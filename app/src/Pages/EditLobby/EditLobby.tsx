import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams } from "react-router-dom";
import IconUserLarge from "../../assets/svgs/IconUserLarge";
import IconUserShield from "../../assets/svgs/IconUserShield";
import { PATHS, SOCKET_EVENTS } from "../../constans";
import { navigateto } from "../../navigation";
import { uploadFile } from "../../services/api";
import { socket } from "../../services/socket";
import { AnswerType, LobbyPlayerType, LobbyType, PlayerType, QuestionType, QuestionTypes } from "../../types";
import { showToast } from "../../utils";
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
  const [player, setPlayer] = useState<LobbyPlayerType | false>(false);
  const [lobby, setLobby] = useState<LobbyType>();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.EMIT_JOIN_EDIT_LOBBY, playerprop, key, (cb: any) => {
      if (cb.success) {
        setLobby(cb.lobby as LobbyType);
        setPlayer({ ...playerprop, IsAdmin: true });
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
      let res = await uploadFile(e.target.files![0]);
      if (res) {
        setAttachmentUrl(res);
      }
    } else {
      setAttachmentUrl("");
    }
  };

  const handleAddQuestion = async (data: FormData) => {
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
      console.log(lobby);
      setLobby(lobby);
    };

    const handlePlayerLeft = (player: LobbyPlayerType, lobby: LobbyType) => {
      console.log("left", player.Name);
      console.log(lobby);
      setLobby(lobby);
    };

    socket.on(SOCKET_EVENTS.PLAYER_JOINED, handlePlayerJoined);
    socket.on(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, handlePlayerLeft);

    return () => {
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
      <div className="editlobbytitle">Edit Lobby</div>
      <div className="leftsidecontainer">
        <div className="playerscontainer">
          <div className="subtitle">Játékosok:</div>
          {lobby?.Players.map((player) => {
            return (
              <div key={player.ID} className="playercontainer">
                {player.IsAdmin ? <IconUserShield /> : <IconUserLarge />}
                <div className="playername">{player.Name}</div>
              </div>
            );
          })}
        </div>
        <div className="startgamebuttoncontainer">
          <div onClick={() => handleSartGame()} className="startgamebutton">
            Játék indítása
          </div>
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>
        <QuestionsList questions={questions} onQuestionOrderChange={handleQuestionOrderChange} />
      </DndProvider>
      <AddQuestionForm
        handleAttachmentChange={handleAttachmentChange}
        handleAddQuestion={handleAddQuestion}
        attachmentUrl={attachmentUrl}
      />
    </div>
  );
}

export default EditLobby;
