const conn = require("./../mysql/index.js");

async function returnError(req, res, message) {
  return res.status(200).json({
    success: false,
    message: message,
  });
}

async function getUserByToken(Token) {
  const [res] = await (
    await conn
  ).query(
    "SELECT Players.ID, Players.Name FROM Players INNER JOIN sessions ON sessions.PlayerID = players.ID AND sessions.Token=?;",
    [Token]
  );
  if (res.length == 0) return false;
  return res[0];
}

async function createPlayer(Name) {
  const [res] = await (await conn).query("INSERT INTO players (Name) VALUES (?);", [Name]);
  if (res.affectedRows == 0) return false;
  if (!res.insertId) return false;
  let token = generateToken(16);
  const [res2] = await (
    await conn
  ).query("INSERT INTO sessions (Token, PlayerID) VALUES (?, ?);", [token, res.insertId]);
  if (res2.affectedRows == 0) return false;
  let player = await getPlayerById(res.insertId);
  return { player, token };
}

async function getPlayerById(ID) {
  const [res] = await (await conn).query("SELECT * FROM players WHERE ID=?;", [ID]);
  if (res.length == 0) return false;
  return res[0];
}

async function getLobbies() {
  const [res] = await (await conn).query("SELECT * FROM lobbies");
  if (res.length == 0) return false;
  await Promise.all(
    res.map(async (e) => {
      const result = await getLobbyPlayersCounter(e.ID);
      e.PlayersCounter = result;
    })
  );
  return res;
}

async function getLobbyPlayersCounter(LobbyID) {
  const [res] = await (
    await conn
  ).query("SELECT COUNT(*) as Players FROM lobby_members WHERE lobby_members.LobbyID = ?;", [LobbyID]);
  return res[0].Players;
}

function generateToken(length) {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}

async function getLobbyFromKey(LobbyKey) {
  const [res] = await (await conn).query("SELECT * FROM lobbies WHERE LobbyKey=?;", [LobbyKey]);
  if (res.length == 0) return false;
  await Promise.all(
    res.map(async (e) => {
      const result = await getLobbyPlayers(e.ID);
      res[0].Players = result;
    })
  );
  return res[0];
}

async function getLobbyPlayers(LobbyID) {
  const [res] = await (
    await conn
  ).query(
    "SELECT players.ID, players.Name, lobby_members.IsAdmin FROM lobby_members INNER JOIN lobbies ON lobby_members.LobbyID = lobbies.ID INNER JOIN players ON players.ID = lobby_members.PlayerID WHERE lobbies.ID = ?;",
    [LobbyID]
  );
  if (res.length == 0) return false;
  return res;
}

async function joinLobby(LobbyID, PlayerID, IsAdmin) {
  const [res] = await (
    await conn
  ).query("INSERT INTO lobby_members (LobbyID, PlayerID, IsAdmin) VALUES (?, ?, ?);", [LobbyID, PlayerID, IsAdmin]);
  if (res.affectedRows == 0) return false;
  const [res2] = await (await conn).query("SELECT * FROM players WHERE ID=?;", [PlayerID]);
  if (res2.length == 0) return false;
  res2[0].IsAdmin = IsAdmin;
  return res2[0];
}

async function handlePlayerDisconnect(PlayerID) {
  const [res] = await (await conn).query("DELETE FROM lobby_members WHERE PlayerID=?;", [PlayerID]);
  if (res.affectedRows == 0) return false;
  return PlayerID;
}

module.exports = {
  returnError,
  getUserByToken,
  createPlayer,
  getLobbies,
  getLobbyFromKey,
  joinLobby,
  handlePlayerDisconnect,
};
