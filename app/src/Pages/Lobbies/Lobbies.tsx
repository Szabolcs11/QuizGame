import { useEffect, useState } from "react";
import { PATHS, SOCKET_EVENTS } from "../../constans";
import { navigateto } from "../../navigation";
import { getLobbies } from "../../services/api";
import { LobbyType, PlayerType } from "../../types";
import Lobby from "./Components/Lobby";
import { socket } from "../../services/socket";

type LobbiesProps = {
  player: PlayerType;
};

function Lobbies({ player }: LobbiesProps) {
  const [lobbies, setLobbies] = useState<LobbyType[]>([]);

  const getLobbis = async () => {
    let lobbies = await getLobbies();
    if (lobbies) {
      setLobbies(lobbies);
    }
  };

  useEffect(() => {
    getLobbis();
  }, []);

  const joinLobby = async (lobbyID: string) => {
    navigateto(PATHS.LOBBY + "/" + lobbyID);
  };

  const handleClickCreateLobby = async () => {
    navigateto(PATHS.CREATE_LOBBY);
  };

  useEffect(() => {
    socket.on(SOCKET_EVENTS.UPDATE_LOBBY_PLAYERS_COUNTER, (data: any) => {
      setLobbies((prev) =>
        prev.map((lobby) => (lobby.ID === data.ID ? { ...lobby, PlayersCounter: data.Players.length } : lobby))
      );
    });

    return () => {
      socket.off(SOCKET_EVENTS.UPDATE_LOBBY_PLAYERS_COUNTER);
    };
  }, []);

  return (
    <div className="lobbiesscreencontainer">
      <div className="myname">{player.Name}</div>
      <div className="lobbiesscreentitle">Szobák</div>
      <div className="createlobby" onClick={() => handleClickCreateLobby()}>
        Szoba létrehozása
      </div>
      <div className="lobbiescardcontainer">
        {lobbies.map((lobby) => (
          <Lobby key={lobby.ID} lobby={lobby} callback={(e) => joinLobby(e)} />
        ))}
      </div>
    </div>
  );
}

export default Lobbies;
