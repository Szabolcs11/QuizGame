import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Players from "../../components/Players";
import { PATHS, SOCKET_EVENTS } from "../../constans";
import { navigateto } from "../../navigation";
import { socket } from "../../services/socket";
import { LobbyPlayerType, LobbyType, PlayerType } from "../../types";
import { showToast, sortLobbyPlayersByIsAdmin } from "../../utils";
import LeaveLobbyBtn from "../../components/LeaveLobbyBtn";

type LobbyProps = {
  player: PlayerType;
};

function Lobby({ player }: LobbyProps) {
  const { key } = useParams();

  const [lobby, setLobby] = useState<LobbyType | null>(null);
  let loadedRef = useRef(false);

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.JOIN_LOBBY, key, player.ID, (cb: any) => {
      if (cb.success) {
        if (cb.isAdmin) {
          navigateto(PATHS.LOBBY + "/" + key + "/edit");
        } else {
          loadedRef.current = true;
          setLobby(cb.lobby);
        }
      } else {
        showToast("Error", cb.message);
        navigateto(PATHS.LOBBIES);
      }
    });
  }, []);

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

    const lobbyStarted = (lobby: LobbyType) => {
      navigateto(PATHS.GAME + "/" + lobby.LobbyKey);
    };

    socket.on(SOCKET_EVENTS.PLAYER_JOINED, handlePlayerJoined);
    socket.on(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, handlePlayerLeft);
    socket.on(SOCKET_EVENTS.ON_LOBBY_STARTED, lobbyStarted);

    return () => {
      if (loadedRef.current) {
        socket.emit(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, key, player.ID, (_: any) => {});
      }

      socket.off(SOCKET_EVENTS.PLAYER_JOINED, handlePlayerJoined);
      socket.off(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, handlePlayerLeft);
      socket.off(SOCKET_EVENTS.ON_LOBBY_STARTED, lobbyStarted);
    };
  }, [socket]);

  if (!lobby) {
    return <div>loading...</div>;
  }

  return (
    <div className="lobbycontainer">
      <LeaveLobbyBtn />
      <div className="lobbytitle">{lobby?.Name}</div>
      <Players players={lobby.Players} myid={player.ID} />
    </div>
  );
}

export default Lobby;
