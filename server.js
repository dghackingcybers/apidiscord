import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Flags de Badges do Discord
const USER_FLAGS = {
  1: "Discord Employee",
  2: "Partnered Server Owner",
  4: "HypeSquad Events",
  8: "Bug Hunter Level 1",
  64: "HypeSquad Bravery",
  128: "HypeSquad Brilliance",
  256: "HypeSquad Balance",
  512: "Early Supporter",
  16384: "Bug Hunter Level 2",
  131072: "Verified Bot Developer",
  4194304: "Active Developer",
};

// Função para converter os `public_flags` em badges
function getBadges(flags) {
  return Object.entries(USER_FLAGS)
    .filter(([bit]) => flags & bit)
    .map(([_, badge]) => badge);
}

// Rota para buscar badges do usuário
app.get("/badges/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${DISCORD_TOKEN}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Usuário não encontrado ou token inválido" });
    }

    const user = await response.json();
    const badges = getBadges(user.public_flags || 0);

    res.json({ id: user.id, username: user.username, badges });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados do Discord" });
  }
});

// Inicia o servidor
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
