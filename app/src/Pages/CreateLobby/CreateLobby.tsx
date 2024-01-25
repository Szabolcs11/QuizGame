import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { createLobbySchema, showToast } from "../../utils";
import { navigateto } from "../../navigation";
import { PATHS, SOCKET_EVENTS } from "../../constans";
import { socket } from "../../services/socket";
import { PlayerType } from "../../types";

interface FormData {
  name: string;
}

type CreateLobbyProps = {
  player: PlayerType;
};

function CreateLobby({ player }: CreateLobbyProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(createLobbySchema),
  });

  const handleCreateLobby = async (data: FormData) => {
    socket.emit(SOCKET_EVENTS.EMIT_CREATE_LOBBY, player.ID, data.name, (cb: any) => {
      if (cb.success) {
        showToast("Success", cb.message);
        navigateto(PATHS.LOBBY + "/" + cb.lobby.LobbyKey + "/edit");
      } else {
        showToast("Error", cb.message);
      }
    });
  };

  return (
    <div className="createlobbycontainer">
      <div className="createlobbytitle">Szoba létrehozása</div>
      <form onSubmit={handleSubmit(handleCreateLobby)} className="createlobbycontent">
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              autoComplete="off"
              type="text"
              className="createlobbynameinput"
              placeholder="Szoba neve"
            />
          )}
        />
        {errors.name?.message != undefined ? <p className="error">{errors.name?.message}</p> : <></>}
        <input type="submit" value="Létrehozás" className="createlobbybtn" />
      </form>
    </div>
  );
}

export default CreateLobby;
