import { LobbyPreviewType } from "../../../types";
import Playing from "./Playing";
import Waiting from "./Waiting";

type LobbyProps = {
  lobby: LobbyPreviewType;
  callback: (lobbyID: string) => void;
};

let statuses = {
  waiting: Waiting,
  playing: Playing,
};

function Lobby({ lobby, callback }: LobbyProps) {
  const Indicator = statuses[lobby.Status as keyof typeof statuses];
  return (
    <div onClick={() => callback(lobby.LobbyKey)} className="lobbycardcontainer" key={lobby.ID}>
      <div className="lobbyname">{lobby.Name}</div>
      <div className="lobbyplayers">{"Players: " + lobby.PlayersCounter}</div>
      <Indicator />
    </div>
  );
}

export default Lobby;
