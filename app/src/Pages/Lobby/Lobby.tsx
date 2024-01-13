import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SOCKET_EVENTS } from "../../constans";
import { socket } from "../../services/socket";
import { LobbyPlayerType, LobbyType, PlayerType } from "../../types";
import { palette } from "../../style";

type LobbyProps = {
  player: PlayerType;
};

function Lobby({ player }: LobbyProps) {
  const { key } = useParams();
  console.log(key);

  const [lobby, setLobby] = useState<LobbyType | null>(null);

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.JOIN_LOBBY, key, player.ID, (cb: any) => {
      setLobby(cb.lobby);
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

    socket.on(SOCKET_EVENTS.PLAYER_JOINED, handlePlayerJoined);
    socket.on(SOCKET_EVENTS.PLAYER_LEFT, handlePlayerLeft);

    return () => {
      socket.off(SOCKET_EVENTS.PLAYER_JOINED, handlePlayerJoined);
      socket.off(SOCKET_EVENTS.PLAYER_LEFT, handlePlayerLeft);
    };
  }, [socket]);

  if (!lobby) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <p>{lobby?.Name}</p>
      <p>{key}</p>
      <div>
        {lobby?.Players.map((player) => {
          return (
            <div key={player.ID} style={{ backgroundColor: palette.white }}>
              <p>{player.Name}</p>
              <p>{player.IsAdmin}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Lobby;
