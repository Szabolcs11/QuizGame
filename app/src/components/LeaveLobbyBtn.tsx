import { PATHS } from "../constans";
import { navigateto } from "../navigation";

type LeaveLobbyBtnProps = {
  callback?: () => void;
};

function LeaveLobbyBtn({ callback }: LeaveLobbyBtnProps) {
  return (
    <div
      className="leavelobbybtncontainer"
      onClick={() => {
        callback ? callback() : navigateto(PATHS.LOBBIES);
      }}
    >
      <div className="leavelobbybtntext">Kilépés</div>
    </div>
  );
}

export default LeaveLobbyBtn;
