import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PATHS, SOCKET_EVENTS } from "../../constans";
import { navigateto } from "../../navigation";
import { socket } from "../../services/socket";
import { LobbyType, PlayerType, QuestionType } from "../../types";
import { showToast } from "../../utils";
import Players from "./Components/Players";
import Question from "./Components/Question";

type GameProps = {
  player: PlayerType;
};

function Game({ player }: GameProps) {
  const { key } = useParams();
  const [lobby, setLobby] = useState<LobbyType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType>();

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
      console.log("next question", nextQuestion);
      setLobby((prev) => ({ ...prev!, CurrentQuestion: nextQuestion }));
      setCurrentQuestion(nextQuestion);
    });

    return () => {
      socket.emit(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, key, player.ID, (cb: any) => {});
      socket.off(SOCKET_EVENTS.PLAYER_JOINED);
      socket.off(SOCKET_EVENTS.PLAYER_LEFT_LISTENER);
    };
  }, [socket]);

  if (!lobby) {
    return <div>Loading...</div>;
  }

  const handleAnswer = (answerID: number) => {
    socket.emit(SOCKET_EVENTS.EMIT_ANSWER_QUESTION, lobby.ID, player.ID, currentQuestion?.ID, answerID, (cb: any) => {
      console.log(cb);
      if (cb.success) {
        // setLobby(cb.lobby);
      } else {
        showToast("Error", cb.message);
      }
    });
  };

  return (
    <>
      <Players players={lobby?.Players!} />
      <Question Question={currentQuestion!} handleAnswer={(AnswerID: number) => handleAnswer(AnswerID)} />
    </>
  );
}

export default Game;
