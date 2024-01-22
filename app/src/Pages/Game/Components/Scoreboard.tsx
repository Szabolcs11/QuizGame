import { animated, useSpring } from "@react-spring/web";
import { ScoreboardPlayerType } from "../../../types";

interface ScoreboardProps {
  scoreboard: ScoreboardPlayerType[];
}

function Scoreboard({ scoreboard }: ScoreboardProps) {
  return (
    <div className="scoreboardcontainer">
      <div className="subtitle">Pontok</div>
      <div className="scorescontainer">
        {scoreboard.map((e) => {
          const { number } = useSpring({
            from: { number: e.Score - e?.PointsAdded! },
            number: e.Score,
            delay: 200,
            config: { mass: 1, tension: 20, friction: 10 },
          });
          return (
            <div className="score" key={e.ID}>
              <div>{e.Name}</div>
              <div>
                <animated.span>{number.to((n: number) => n.toFixed(0))}</animated.span>
                <span className="scoreadded"> (+{e?.PointsAdded})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Scoreboard;
