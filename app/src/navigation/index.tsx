import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Landing from "../Pages/Landing/Landing";
import Lobbies from "../Pages/Lobbies/Lobbies";
import { authPlayer } from "../services/api";
import { PlayerType } from "../types";
import CreateLobby from "../Pages/CreateLobby/CreateLobby";
import { PATHS } from "../constans";
import Lobby from "../Pages/Lobby/Lobby";

export let navigateto: any;
export let updatePlayer: () => void;
function index() {
  navigateto = useNavigate();
  const [player, setPlayer] = useState<PlayerType | false>(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlayer = async () => {
    let player = await authPlayer();
    setPlayer(player);
    setIsLoading(false);
  };

  updatePlayer = async () => {
    await fetchPlayer();
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPlayer();
  }, []);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!player) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path={PATHS.LOBBIES} element={<Lobbies player={player} />} />
      <Route path={PATHS.CREATE_LOBBY} element={<CreateLobby />} />
      <Route path={PATHS.LOBBY + "/:key"} element={<Lobby player={player} />} />
      <Route path="*" element={<Navigate to={PATHS.LOBBIES} />} />
    </Routes>
  );
}

export default index;
