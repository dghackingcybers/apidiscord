import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Flags de Badges do Discord
// Mapeamento completo de badges
const USER_FLAGS = {
  1: "Discord Employee",              // 00000001
  2: "Partnered Server Owner",        // 00000010
  4: "HypeSquad Events",              // 00000100
  8: "Bug Hunter Level 1",            // 00001000
  64: "HypeSquad Bravery",            // 01000000
  128: "HypeSquad Brilliance",        // 10000000
  256: "HypeSquad Balance",           // 100000000
  512: "Early Supporter",             // 1000000000
  16384: "Bug Hunter Level 2",        // 0100000000000000
  131072: "Verified Bot Developer",   // 0010000000000000
  4194304: "Active Developer",        // 100000000000000000
  0x00000001: "Nitro",                // Nitro flag
  0x00000100: "Nitro Classic",        // Nitro Classic flag
};

// Função para obter todas as badges de acordo com as flags
function getBadges(flags) {
  const badges = [];
  Object.entries(USER_FLAGS).forEach(([bit, badge]) => {
    if (flags & parseInt(bit)) {
      badges.push(badge);
    }
  });
  return badges;
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
