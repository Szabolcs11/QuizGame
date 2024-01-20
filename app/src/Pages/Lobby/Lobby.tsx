import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IconUserLarge from "../../assets/svgs/IconUserLarge";
import IconUserShield from "../../assets/svgs/IconUserShield";
import { PATHS, SOCKET_EVENTS } from "../../constans";
import { socket } from "../../services/socket";
import { LobbyPlayerType, LobbyType, PlayerType } from "../../types";
import { showToast } from "../../utils";
import { navigateto } from "../../navigation";

type LobbyProps = {
  player: PlayerType;
};

function Lobby({ player }: LobbyProps) {
  const { key } = useParams();

  const [lobby, setLobby] = useState<LobbyType | null>(null);

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.JOIN_LOBBY, key, player.ID, (cb: any) => {
      if (cb.success) {
        setLobby(cb.lobby);
      } else {
        showToast("Error", cb.message);
        navigateto(PATHS.LOBBIES);
      }
    });
  }, []);

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

    const lobbyStarted = (lobby: LobbyType) => {
      console.log("LOBBY STARTED", lobby);
      navigateto(PATHS.GAME + "/" + lobby.LobbyKey);
    };

    socket.on(SOCKET_EVENTS.PLAYER_JOINED, handlePlayerJoined);
    socket.on(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, handlePlayerLeft);
    socket.on(SOCKET_EVENTS.ON_LOBBY_STARTED, lobbyStarted);

    return () => {
      socket.emit(SOCKET_EVENTS.PLAYER_LEFT_LISTENER, key, player.ID, (cb: any) => {});

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
      <div className="lobbytitle">{lobby?.Name}</div>
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
    </div>
  );
}

export default Lobby;
