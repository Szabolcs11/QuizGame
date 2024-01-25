import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { PATHS, SOCKET_EVENTS } from "../../constans";
import { navigateto } from "../../navigation";
import { socket } from "../../services/socket";
import { LobbyPlayerType, LobbyType, PlayerType, QuestionType, ScoreboardPlayerType } from "../../types";
import { showToast, sortLobbyPlayersByIsAdmin } from "../../utils";
import Players from "./../../components/Players";
import Controls from "./Components/Controls";
import Questions from "./Components/Questions";
import Podium from "../../components/Podium";
import LeaveLobbyBtn from "../../components/LeaveLobbyBtn";

type GameAdminProps = {
  player: PlayerType;
};

type AnswersType = {
  PlayerID: number;
  PlayerName: string;
  QuestionID: number;
  AnswerID: number;
};

type PointsScored = {
  PlayerID: number;
  Points: number;
};

function GameAdmin({ player }: GameAdminProps) {
  const { key } = useParams();
  const [lobby, setLobby] = useState<LobbyType | null>(null);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<AnswersType[]>([]);
  const [players, setPlayers] = useState<LobbyPlayerType[]>([]);
  const [pointsScored, setPointsScored] = useState<PointsScored[]>([]);
  const [podiumData, setPodiumData] = useState<ScoreboardPlayerType[]>([]);

  const ref = useRef<LobbyPlayerType[]>();
  ref.current = players;

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.EMIT_JOIN_GAME_ADMIN, player.ID, key, (cb: any) => {
      if (cb.success) {
        setLobby(cb.lobby);
        setPlayers(cb.lobby.Players);
        setQuestions(cb.questions);
      } else {
        showToast("Error", cb.message);
        navigateto(PATHS.LOBBIES);
      }
      setIsLoading(false);
    });
    return () => {
      socket.emit(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, key, player.ID, (_: any) => {});
    };
  }, []);

  useEffect(() => {
    const handlePlayerJoined = (player: LobbyPlayerType, lobby: LobbyType) => {
      console.log("join", player.Name);
      lobby.Players = sortLobbyPlayersByIsAdmin(lobby);
      setPlayers(lobby.Players);
    };

    const handlePlayerLeft = (player: LobbyPlayerType, lobby: LobbyType) => {
      console.log("left", player.Name);
      lobby.Players = sortLobbyPlayersByIsAdmin(lobby);
      setPlayers(lobby.Players);
    };

    const handlePlayerAnsweredQuestion = (PlayerID: number, QuestionID: number, AnswerID: number) => {
      setAnswers((prev) => [
        ...prev,
        { PlayerID, PlayerName: ref.current!.find((p) => p.ID === PlayerID)?.Name!, QuestionID, AnswerID },
      ]);
    };

    socket.on(SOCKET_EVENTS.PLAYER_JOINED, handlePlayerJoined);
    socket.on(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, handlePlayerLeft);
    socket.on(SOCKET_EVENTS.ON_ANSWERED_QUESTION, handlePlayerAnsweredQuestion);

    return () => {
      socket.off(SOCKET_EVENTS.PLAYER_JOINED, handlePlayerJoined);
      socket.off(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, handlePlayerLeft);
      socket.off(SOCKET_EVENTS.ON_ANSWERED_QUESTION, handlePlayerAnsweredQuestion);
    };
  }, [socket]);

  const handleEndQuestion = () => {
    socket.emit(SOCKET_EVENTS.EMIT_END_QUESTION, player.ID, lobby!.ID, (cb: any) => {
      if (cb.success) {
        setPointsScored(cb.PlayersScored);
      } else {
        showToast("Error", cb.message);
      }
    });
  };

  const handleShowScoreboard = () => {
    socket.emit(SOCKET_EVENTS.EMIT_SHOW_SCOREBOARD, lobby!.ID, pointsScored, (cb: any) => {
      if (cb.success) {
        showToast("Success", cb.message);
      } else {
        showToast("Error", cb.message);
      }
    });
  };

  const handleNextQuestion = () => {
    socket.emit(SOCKET_EVENTS.EMIT_NEXT_QUESTION, player.ID, lobby!.ID, (cb: any) => {
      if (cb.success) {
        setPointsScored([]);
        let temp = questions;
        temp.find((q) => q.ID === lobby?.CurrentQuestion.ID)!.Status = "answered";
        setQuestions(temp);
        setLobby((prev) => ({ ...prev!, CurrentQuestion: cb.currentQuestion }));
      } else {
        showToast("Error", cb.message);
      }
    });
  };

  const handleFinishGame = () => {
    socket.emit(SOCKET_EVENTS.EMIT_FINISH_GAME, lobby?.ID, (cb: any) => {
      if (cb.success) {
        setPodiumData(cb.scoreboard);
        showToast("Success", cb.message);
      } else {
        showToast("Error", cb.message);
      }
    });
  };

  const handleResetGame = () => {
    socket.emit(SOCKET_EVENTS.EMIT_RESET_GAME, lobby?.ID, (cb: any) => {
      if (cb.success) {
        navigateto(PATHS.LOBBY + "/" + lobby?.LobbyKey);
        showToast("Success", cb.message);
      } else {
        showToast("Error", cb.message);
      }
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (podiumData.length > 0) {
    return (
      <div>
        <LeaveLobbyBtn callback={() => setPodiumData([])} />
        <Podium data={podiumData} />
      </div>
    );
  }

  return (
    <div className="gameadmin-content">
      <Players players={players!} myid={player.ID} />
      <Questions Questions={questions} CurrentQuestionID={lobby!.CurrentQuestion.ID} Answers={answers} />
      <Controls
        handleEndQuestion={() => handleEndQuestion()}
        handleNextQuestion={() => handleNextQuestion()}
        handleShowScoreboard={() => handleShowScoreboard()}
        handleFinishGame={() => handleFinishGame()}
        handleResetGame={() => handleResetGame()}
      />
    </div>
  );
}

export default GameAdmin;
