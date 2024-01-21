import IconUserLarge from "../../../assets/svgs/IconUserLarge";
import IconUserShield from "../../../assets/svgs/IconUserShield";
import { LobbyPlayerType } from "../../../types";

interface PlayersProps {
  players: LobbyPlayerType[];
  myid: number;
}

function Players({ players, myid }: PlayersProps) {
  return (
    <div className="gameplayerscontainer">
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
