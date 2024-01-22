import IconUserLarge from "../assets/svgs/IconUserLarge";
import IconUserShield from "../assets/svgs/IconUserShield";
import { LobbyPlayerType } from "../types";

interface PlayerProps {
  players: LobbyPlayerType[];
  myid: number;
}

function Players({ myid, players }: PlayerProps) {
  return (
    <div className="playerscontainer">
      <div className="subtitle">Játékosok:</div>
      {players.map((player) => (
        <div key={player.ID} className="playercontainer">
          {player.IsAdmin ? <IconUserShield /> : <IconUserLarge />}
          <div className="playername">{`${player.Name} ${player.ID == myid ? "(Én)" : ""} `}</div>
        </div>
      ))}
    </div>
  );
}

export default Players;
