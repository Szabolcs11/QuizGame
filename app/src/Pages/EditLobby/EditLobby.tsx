import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams } from "react-router-dom";
import Players from "../../components/Players";
import { PATHS, SOCKET_EVENTS } from "../../constans";
import { navigateto } from "../../navigation";
import { uploadFile } from "../../services/api";
import { socket } from "../../services/socket";
import { AnswerType, LobbyPlayerType, LobbyType, PlayerType, QuestionType, QuestionTypes } from "../../types";
import { showToast, sortLobbyPlayersByIsAdmin } from "../../utils";
import AddQuestionForm from "./Components/AddQuestionForm";
import QuestionsList from "./Components/QuestionsList";

type EditLobbyProps = {
  playerprop: PlayerType;
};

interface FormData {
  question: string;
  answera: string;
  answerb: string;
  answerc: string;
  answerd: string;
  questiontype: string;
  correctanswer: string;
}

export let handleDeleteQuestion: (QuestionID: number) => void;

function EditLobby({ playerprop }: EditLobbyProps) {
  const { key } = useParams();
  const [player, setPlayer] = useState<LobbyPlayerType>();
  const [lobby, setLobby] = useState<LobbyType>();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.EMIT_JOIN_EDIT_LOBBY, playerprop, key, (cb: any) => {
      if (cb.success) {
        let lobby = cb.lobby as LobbyType;
        lobby.Players = sortLobbyPlayersByIsAdmin(lobby);
        setLobby(cb.lobby as LobbyType);
        setPlayer({ ...playerprop, IsAdmin: true } as LobbyPlayerType);
        setQuestions(cb.questions as QuestionType[]);
        showToast("Success", cb.message);
      } else {
        showToast("Error", cb.message);
        navigateto(PATHS.LOBBIES);
      }
      setIsLoading(false);
    });
  }, []);

  const handleAttachmentChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files?.length! > 0) {
      setIsUploading(true);
      let res = await uploadFile(e.target.files![0]);
      if (res) {
        setAttachmentUrl(res);
        setIsUploading(false);
      } else {
        showToast("Error", "Hiba történt a kép feltöltése közben");
        setIsUploading(false);
      }
    } else {
      setAttachmentUrl("");
    }
  };

  const handleAddQuestion = async (data: FormData) => {
    if (isUploading) {
      showToast("Error", "Kép feltöltése folyamatban");
      return;
    }
    if (data.questiontype == "none") {
      showToast("Error", "Kérdés típus megadása kötelező");
      return;
    }
    if (data.correctanswer == "none") {
      showToast("Error", "Helyes válasz megadása kötelező");
      return;
    }
    if ((data.questiontype == "image" || data.questiontype == "sound") && attachmentUrl == "") {
      showToast("Error", "Kép és hang esetén kötelező a csatolmány feltöltése");
      return;
    }
    let answers = [
      { Text: data.answera, IsCorrect: data.correctanswer == data.answera },
      { Text: data.answerb, IsCorrect: data.correctanswer == data.answerb },
      { Text: data.answerc, IsCorrect: data.correctanswer == data.answerc },
      { Text: data.answerd, IsCorrect: data.correctanswer == data.answerd },
    ];

    let question = {
      Text: data.question,
      Type: data.questiontype as QuestionTypes,
      OrderNum: questions.length + 1,
      AttachmentURL: attachmentUrl,
      Answers: answers as AnswerType[],
    };
    socket.emit(SOCKET_EVENTS.EMIT_ADD_QUESTION, lobby?.ID, question, (cb: any) => {
      if (cb.success) {
        showToast("Success", cb.message);
        setQuestions([...questions, cb.newQuestion as QuestionType]);
      } else {
        showToast("Error", cb.message);
      }
    });
  };

  useEffect(() => {
    const handlePlayerJoined = (player: LobbyPlayerType, lobby: LobbyType) => {
      console.log("join", player.Name);
      lobby.Players = sortLobbyPlayersByIsAdmin(lobby);
      setLobby(lobby);
    };

    const handlePlayerLeft = (player: LobbyPlayerType, lobby: LobbyType) => {
      console.log("left", player.Name);
      lobby.Players = sortLobbyPlayersByIsAdmin(lobby);
      setLobby(lobby);
    };

    socket.on(SOCKET_EVENTS.PLAYER_JOINED, handlePlayerJoined);
    socket.on(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, handlePlayerLeft);

    return () => {
      socket.emit(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, key, playerprop!.ID, (_: any) => {});
      socket.off(SOCKET_EVENTS.PLAYER_JOINED, handlePlayerJoined);
      socket.off(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, handlePlayerLeft);
    };
  }, [socket]);

  const handleQuestionOrderChange = (updatedOrder: QuestionType[]) => {
    updatedOrder.map((e, i) => {
      e.OrderNum = i + 1;
    });
    setQuestions(updatedOrder);
    socket.emit(SOCKET_EVENTS.EMIT_UPDATE_QUESTIONS_ORDER, lobby?.ID, updatedOrder, (cb: any) => {
      if (cb.success) {
        showToast("Success", cb.message);
      } else {
        showToast("Error", cb.message);
      }
    });
  };

  handleDeleteQuestion = (QuestionID: number) => {
    socket.emit(SOCKET_EVENTS.EMIT_DELETE_QUESTION, lobby?.LobbyKey, QuestionID, (cb: any) => {
      if (cb.success) {
        showToast("Success", cb.message);
      } else {
        showToast("Error", cb.message);
      }
    });
  };

  const handleSartGame = () => {
    socket.emit(SOCKET_EVENTS.EMIT_START_LOBBY, lobby?.LobbyKey, (cb: any) => {
      if (cb.success) {
        showToast("Success", cb.message);
        navigateto(PATHS.GAME_ADMIN + "/" + lobby?.LobbyKey);
      } else {
        showToast("Error", cb.message);
      }
    });
  };

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className="editlobbycontainer">
      <div className="editlobbytitle">
        Szoba módosítása<span className="subtitle">({lobby?.Name})</span>
      </div>
      <div className="editlobbycontent">
        <Players players={lobby?.Players as LobbyPlayerType[]} myid={player!.ID} />
        <AddQuestionForm
          handleAttachmentChange={handleAttachmentChange}
          handleAddQuestion={handleAddQuestion}
          isUploading={isUploading}
        />
        <DndProvider backend={HTML5Backend}>
          <QuestionsList questions={questions} onQuestionOrderChange={handleQuestionOrderChange} />
        </DndProvider>
      </div>
      <div className="startgamebuttoncontainer">
        <div onClick={() => handleSartGame()} className="startgamebutton">
          Játék indítása
        </div>
      </div>
    </div>
  );
}

export default EditLobby;
