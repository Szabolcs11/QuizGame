import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PATHS, SOCKET_EVENTS } from "../../constans";
import { navigateto } from "../../navigation";
import { socket } from "../../services/socket";
import { LobbyType, PlayerAnswers, PlayerType, QuestionType, ScoreboardPlayerType } from "../../types";
import { showToast } from "../../utils";
import Players from "./Components/Players";
import Question from "./Components/Question";
import Scoreboard from "./Components/Scoreboard";

type GameProps = {
  player: PlayerType;
};

function Game({ player }: GameProps) {
  const { key } = useParams();
  const [lobby, setLobby] = useState<LobbyType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType>();
  const [correctAnswerID, setCorrectAnswerID] = useState<number>(0);
  const [playerAnswers, setPlayerAnswers] = useState<PlayerAnswers[]>([]);
  const [selectedAnswerID, setSelectedAnswerID] = useState<number>(0);
  const [scoreboard, setScoreboard] = useState<ScoreboardPlayerType[]>([]);

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.EMIT_JOIN_GAME, player.ID, key, (cb: any) => {
      console.log(cb.lobby);
      if (cb.success) {
        setCurrentQuestion(cb.lobby.CurrentQuestion);
        setLobby(cb.lobby);
      } else {
        showToast("Error", cb.message);
        navigateto(PATHS.LOBBIES);
      }
    });
  }, []);

  useEffect(() => {
    socket.on(SOCKET_EVENTS.PLAYER_JOINED, (player: PlayerType, lobby: LobbyType) => {
      console.log("join", player.Name);
      setLobby(lobby);
    });
    socket.on(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, (player: PlayerType, lobby: LobbyType) => {
      console.log("left", player.Name);
      setLobby(lobby);
    });

    socket.on(SOCKET_EVENTS.ON_CHANGE_QUESTION, (nextQuestion: QuestionType) => {
      setScoreboard([]);
      console.log("next question", nextQuestion);
      setCorrectAnswerID(0);
      setSelectedAnswerID(0);
      setPlayerAnswers([]);
      setLobby((prev) => ({ ...prev!, CurrentQuestion: nextQuestion }));
      setCurrentQuestion(nextQuestion);
    });

    socket.on(SOCKET_EVENTS.ON_SHOW_SCOREBOARD, (Scoreboard: ScoreboardPlayerType[]) => {
      console.log("scoreboard", Scoreboard);
      setScoreboard(Scoreboard);
    });

    socket.on(SOCKET_EVENTS.ON_QUESTION_ENDED, (PlayerAnswers, CorrectAnswers) => {
      showToast("Info", "A kérdes véget ért!");
      setCorrectAnswerID(CorrectAnswers.ID);
      setPlayerAnswers(PlayerAnswers);
    });

    return () => {
      socket.emit(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, key, player.ID, (cb: any) => {});
      socket.off(SOCKET_EVENTS.ON_CHANGE_QUESTION);
      socket.off(SOCKET_EVENTS.ON_QUESTION_ENDED);
      socket.off(SOCKET_EVENTS.PLAYER_JOINED);
      socket.off(SOCKET_EVENTS.PLAYER_LEFT_LISTENER);
    };
  }, [socket]);

  if (!lobby) {
    return <div>Loading...</div>;
  }

  if (scoreboard.length > 0) {
    return <Scoreboard scoreboard={scoreboard} />;
  }

  const handleAnswer = (answerID: number) => {
    socket.emit(SOCKET_EVENTS.EMIT_ANSWER_QUESTION, lobby.ID, player.ID, currentQuestion?.ID, answerID, (cb: any) => {
      console.log(cb);
      if (cb.success) {
        showToast("Success", cb.message);
        setSelectedAnswerID(answerID);
        // setLobby(cb.lobby);
      } else {
        showToast("Error", cb.message);
      }
    });
  };

  return (
    <>
      <Players players={lobby?.Players!} myid={player.ID} />
      <Question
        Question={currentQuestion!}
        handleAnswer={(AnswerID: number) => handleAnswer(AnswerID)}
        SelectedAnswerID={selectedAnswerID}
        QuestionEnded={Boolean(correctAnswerID)}
        PlayerAnswers={playerAnswers}
        CorrectAnswerID={correctAnswerID}
      />
    </>
  );
}

export default Game;
