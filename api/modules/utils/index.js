const conn = require("./../mysql/index.js");

const GLOBALROOM = "GLOBALROOM";

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
    "SELECT players.ID, players.Name FROM players INNER JOIN sessions ON sessions.PlayerID = players.ID AND sessions.Token=?;",
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

async function getLobbyFromID(LobbyID) {
  const [res] = await (await conn).query("SELECT * FROM lobbies WHERE ID=?;", [LobbyID]);
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
    "SELECT players.ID, players.Name, lobby_members.IsAdmin FROM lobby_members INNER JOIN lobbies ON lobby_members.LobbyID = lobbies.ID INNER JOIN players ON players.ID = lobby_members.PlayerID WHERE lobbies.ID = ? ORDER BY lobby_members.IsAdmin DESC;",
    [LobbyID]
  );
  if (res.length == 0) return [];
  return res;
}

async function joinLobby(LobbyID, PlayerID) {
  let isAdmin = 0;
  const [result] = await (await conn).query("SELECT * FROM lobbies WHERE ID=? AND Status='waiting';", [LobbyID]);
  if (result.length == 0) return "LOBBY_PLAYING";
  if (result[0].LobbyOwnerID == PlayerID) isAdmin = 1;
  const [res] = await (
    await conn
  ).query("INSERT INTO lobby_members (LobbyID, PlayerID, IsAdmin) VALUES (?, ?, ?);", [LobbyID, PlayerID, isAdmin]);
  if (res.affectedRows == 0) return false;
  const [res2] = await (await conn).query("SELECT * FROM players WHERE ID=?;", [PlayerID]);
  if (res2.length == 0) return false;
  res2[0].IsAdmin = isAdmin;
  return res2[0];
}

async function joinOnGoingGame(LobbyID, PlayerID, isAdmin) {
  const [res] = await (
    await conn
  ).query("INSERT INTO lobby_members (LobbyID, PlayerID, IsAdmin) VALUES (?, ?, ?);", [LobbyID, PlayerID, isAdmin]);
  if (res.affectedRows == 0) return false;
  const [res2] = await (await conn).query("SELECT * FROM players WHERE ID=?;", [PlayerID]);
  if (res2.length == 0) return false;
  let lobby = await getLobbyFromID(LobbyID);
  return lobby;
}

async function handlePlayerDisconnect(PlayerID) {
  const [res] = await (await conn).query("DELETE FROM lobby_members WHERE PlayerID=?", [PlayerID]);
  if (res.affectedRows == 0) return false;
  const player = await getPlayerById(PlayerID);
  return player;
}

async function createLobby(PlayerID, LobbyName) {
  const LobbyKey = generateToken(6);
  const [res] = await (
    await conn
  ).query("INSERT INTO lobbies (Name, LobbyKey, LobbyOwnerID) VALUES (?, ?, ?);", [LobbyName, LobbyKey, PlayerID]);
  if (res.affectedRows == 0) return false;
  // const [res2] = await (
  //   await conn
  // ).query("INSERT INTO lobby_members (LobbyID, PlayerID, IsAdmin) VALUES (?, ?, ?);", [res.insertId, PlayerID, 1]);
  // if (res2.affectedRows == 0) return false;
  const [res3] = await (await conn).query("SELECT * FROM lobbies WHERE ID=?;", [res.insertId]);
  if (res3.length == 0) return false;
  await Promise.all(
    res3.map(async (e) => {
      const result = await getLobbyPlayers(e.ID);
      e.Players = result;
    })
  );
  return res3[0];
}

async function getLobbyQuestions(LobbyID) {
  const [res] = await (await conn).query("SELECT * FROM questions WHERE LobbyID=? ORDER BY OrderNum ASC;", [LobbyID]);
  if (res.length == 0) return [];
  await Promise.all(
    res.map(async (e) => {
      e.Answers = await getQuestionAnswers(e.ID);
    })
  );
  return res;
}

async function getLobbyQuestion(LobbyID, QuestionID) {
  const [res] = await (await conn).query("SELECT * FROM questions WHERE LobbyID=? AND ID=?;", [LobbyID, QuestionID]);
  if (res.length == 0) return false;
  res[0].Answers = await getQuestionAnswers(res[0].ID);
  return res[0];
}

async function getQuestionAnswers(QuestionID) {
  const [res] = await (await conn).query("SELECT * FROM questions_answers WHERE QuestionID=?;", [QuestionID]);
  if (res.length == 0) return [];
  return res;
}

async function addQuestion(Question, LobbyID) {
  let info = {
    Text: Question.Text,
    Type: Question.Type,
    LobbyID: LobbyID,
    AttachmentURL: Question?.AttachmentURL,
    OrderNum: Question.OrderNum,
  };
  const [res] = await (await conn).query("INSERT INTO questions SET ?", [info]);
  if (res.affectedRows == 0) return false;
  if (!res.insertId) return false;
  let answers = [];
  Question.Answers.forEach((e) => {
    answers.push([e.Text, res.insertId, e.IsCorrect]);
  });
  const [res2] = await (
    await conn
  ).query("INSERT INTO questions_answers (Text, QuestionID, IsCorrect) VALUES ?", [answers]);
  if (res2.affectedRows == 0) return false;
  return await getLobbyQuestion(LobbyID, res.insertId);
}

async function handleupdateQuestionOrder(Question, LobbyID) {
  const [res] = await (
    await conn
  ).query("UPDATE questions SET OrderNum=? WHERE ID=? AND LobbyID=?;", [Question.OrderNum, Question.ID, LobbyID]);
  if (res.affectedRows == 0) return false;
  return true;
}

async function deleteQuestion(QuestionID) {
  const [res2] = await (await conn).query("DELETE FROM questions_answers WHERE QuestionID=?;", [QuestionID]);
  if (res2.affectedRows == 0) return false;
  const [res] = await (await conn).query("DELETE FROM questions WHERE ID=?;", [QuestionID]);
  if (res.affectedRows == 0) return false;
  return true;
}

async function changeLobbyStatus(LobbyID, Status) {
  const [res] = await (await conn).query("UPDATE lobbies SET Status=? WHERE ID=?;", [Status, LobbyID]);
  if (res.affectedRows == 0) return false;
  const [res2] = await (await conn).query("SELECT * FROM lobbies WHERE ID=?;", [LobbyID]);
  if (res2.length == 0) return false;
  await Promise.all(
    res2.map(async (e) => {
      const result = await getLobbyPlayers(e.ID);
      e.Players = result;
    })
  );
  return res2[0];
}

async function getLobbyQuestions(LobbyID) {
  const [res] = await (await conn).query("SELECT * FROM questions WHERE LobbyID=? ORDER BY OrderNum ASC;", [LobbyID]);
  if (res.length == 0) return [];
  await Promise.all(
    res.map(async (e) => {
      e.Answers = await getQuestionAnswers(e.ID);
    })
  );
  return res;
}

async function getQuestionAnswers(QuestionID) {
  const [res] = await (await conn).query("SELECT * FROM questions_answers WHERE QuestionID=?;", [QuestionID]);
  if (res.length == 0) return [];
  return res;
}

async function getFirstQuessionID(LobbyID) {
  const [res] = await (
    await conn
  ).query("SELECT * FROM questions WHERE LobbyID=? ORDER BY OrderNum ASC LIMIT 1;", [LobbyID]);
  if (res.length == 0) return false;
  return res[0].ID;
}

async function changeCurrentQuestionID(LobbyID, QuestionID) {
  const [res] = await (await conn).query("UPDATE lobbies SET CurrentQuestionID=? WHERE ID=?;", [QuestionID, LobbyID]);
  if (res.affectedRows == 0) return false;
  return true;
}

async function getCurrentQuestion(LobbyID) {
  const [res] = await (await conn).query("SELECT CurrentQuestionID FROM lobbies WHERE ID=?;", [LobbyID]);
  if (res.length == 0) return false;
  const result = getLobbyQuestion(LobbyID, res[0].CurrentQuestionID);
  if (!result) return false;
  return result;
}

async function answerQuestion(PlayerID, QuestionID, AnswerID) {
  const [res] = await (
    await conn
  ).query("INSERT INTO players_answers (PlayerID, QuestionID, AnswerID) VALUES (?, ?, ?);", [
    PlayerID,
    QuestionID,
    AnswerID,
  ]);
  if (res.affectedRows == 0) return false;
  return res.insertId;
}

async function isPlayerAnswered(PlayerID, QuestionID) {
  const [res] = await (
    await conn
  ).query("SELECT * FROM players_answers WHERE PlayerID=? AND QuestionID=?;", [PlayerID, QuestionID]);
  if (res.length == 0) return false;
  return true;
}

async function getLobbyQuestionByOrderNum(LobbyID, OrderNum) {
  const [res] = await (
    await conn
  ).query("SELECT * FROM questions WHERE LobbyID=? AND OrderNum=?;", [LobbyID, OrderNum]);
  if (res.length == 0) return false;
  return res[0];
}

async function handleNextQuestion(LobbyID) {
  const currentQuestion = await getCurrentQuestion(LobbyID);
  if (!currentQuestion) return false;
  let nextQuestion = await getLobbyQuestionByOrderNum(LobbyID, currentQuestion.OrderNum + 1);
  if (!nextQuestion) return false;
  nextQuestion.Answers = await getQuestionAnswers(nextQuestion.ID);
  if (!nextQuestion) return false;
  await changeCurrentQuestionID(LobbyID, nextQuestion.ID);
  return nextQuestion;
}

async function getQuestionIsAnswered(QuestionID) {
  const [res] = await (await conn).query("SELECT * FROM questions WHERE ID=?;", [QuestionID]);
  if (res.length == 0) return false;
  if (res[0].Status == "answered") return true;
  return false;
}

async function updateQuestionStatus(QuestionID, Status) {
  const [res] = await (await conn).query("UPDATE questions SET Status=? WHERE ID=?;", [Status, QuestionID]);
  if (res.affectedRows == 0) return false;
  return true;
}

async function calculatePoints(QuestionID, LobbyID) {
  const [result] = await (
    await conn
  ).query("SELECT * FROM questions_answers WHERE QuestionID=? AND IsCorrect=1;", [QuestionID]);
  if (result.length == 0) return false;
  const [res] = await (
    await conn
  ).query(
    "SELECT players.ID as PlayerID, players.Name as PlayerName, questions_answers.ID as AnswerID, questions_answers.Text as AnswerText, questions_answers.IsCorrect, players_answers.Date FROM players_answers INNER JOIN questions_answers ON questions_answers.ID = players_answers.AnswerID INNER JOIN players ON players.ID = players_answers.PlayerID WHERE players_answers.QuestionID=?",
    [QuestionID]
  );
  if (res.length == 0) return false;

  let correctAnswers = [];
  res.forEach((e) => {
    if (e.IsCorrect == 1) correctAnswers.push(e);
  });

  correctAnswers.sort((a, b) => {
    return a.Date - b.Date;
  });
  let AnswersWithScores = [];
  res.forEach((e) => {
    AnswersWithScores.push({ ...e, Score: 0 });
  });

  // Scores calculation logic 100, 80, 60, 50
  correctAnswers.forEach((e, index) => {
    AnswersWithScores.forEach((e2) => {
      if (e.PlayerID == e2.PlayerID) {
        e2.Score = index < 3 ? 100 - index * 20 : 50;
      }
    });
  });

  const updatedPoints = await Promise.all(
    AnswersWithScores.map(async (e) => {
      const [res] = await (
        await conn
      ).query("UPDATE scores SET Score=Score+? WHERE LobbyID=? AND PlayerID=?;", [e.Score, LobbyID, e.PlayerID]);
      if (res.affectedRows == 0) return false;
      return true;
    })
  );
  if (updatedPoints.includes(false)) return false;

  return { AnswersWithScores, correctAnswer: result[0] };
}

async function createScoreboard(lobby) {
  lobby.Players.map(async (e) => {
    if (e.IsAdmin == 1) return;
    const [res] = await (
      await conn
    ).query("INSERT INTO scores (LobbyID, PlayerID, Score) VALUES (?, ?, ?);", [lobby.ID, e.ID, 0]);
    if (res.affectedRows == 0) return false;
  });
  return true;
}

async function getScoreboard(LobbyID) {
  const [res] = await (
    await conn
  ).query(
    "SELECT scores.Score, players.Name, players.ID FROM scores INNER JOIN players ON players.ID = scores.PlayerID WHERE scores.LobbyID=? ORDER BY scores.Score DESC;",
    [LobbyID]
  );
  if (res.length == 0) return false;
  return res;
}
module.exports = {
  returnError,
  getUserByToken,
  createPlayer,
  getLobbies,
  getLobbyFromKey,
  joinLobby,
  handlePlayerDisconnect,
  createLobby,
  GLOBALROOM,
  getLobbyQuestions,
  addQuestion,
  handleupdateQuestionOrder,
  deleteQuestion,
  changeLobbyStatus,
  joinOnGoingGame,
  getLobbyQuestions,
  getFirstQuessionID,
  changeCurrentQuestionID,
  getCurrentQuestion,
  answerQuestion,
  getLobbyFromID,
  isPlayerAnswered,
  handleNextQuestion,
  getQuestionIsAnswered,
  updateQuestionStatus,
  calculatePoints,
  createScoreboard,
  getScoreboard,
};
