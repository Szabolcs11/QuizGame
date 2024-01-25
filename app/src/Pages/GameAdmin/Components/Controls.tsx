import ArrowRight from "../../../assets/svgs/ArrowRight";
import FinishFlag from "../../../assets/svgs/FinishFlag";
import Pause from "../../../assets/svgs/Pause";
import RotateArrow from "../../../assets/svgs/RotateArrow";
import Scoreboard from "../../../assets/svgs/Scoreboard";

interface ControlProps {
  handleEndQuestion: () => void;
  handleShowScoreboard: () => void;
  handleNextQuestion: () => void;
  handleFinishGame: () => void;
  handleResetGame: () => void;
}

function Controls({
  handleNextQuestion,
  handleShowScoreboard,
  handleEndQuestion,
  handleFinishGame,
  handleResetGame,
}: ControlProps) {
  return (
    <div className="controllercontainer">
      <div className="subtitle">Controller</div>
      <div className="controls">
        <div className="control" onClick={() => handleEndQuestion()}>
          <Pause />
        </div>
        <div className="control" onClick={() => handleShowScoreboard()}>
          <Scoreboard />
        </div>
        <div className="control" onClick={() => handleNextQuestion()}>
          <ArrowRight />
        </div>
        <div className="control" onClick={() => handleFinishGame()}>
          <FinishFlag />
        </div>
        <div className="control" onClick={() => handleResetGame()}>
          <RotateArrow />
        </div>
      </div>
    </div>
  );
}

export default Controls;
