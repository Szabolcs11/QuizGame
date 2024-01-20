import React from "react";
import { LandingStyle } from "./LandingStyle";
import { authschema } from "../../utils";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerPlayer } from "../../services/api";
import { updatePlayer } from "../../navigation";

interface FormData {
  name: string;
}

function Landing() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(authschema),
  });

  const handleStart = async (data: FormData) => {
    let player = await registerPlayer(data.name);
    if (player) {
      updatePlayer();
    }
  };

  return (
    <div style={LandingStyle.container}>
      <h1 className="title">Quiz Game</h1>
      <form onSubmit={handleSubmit(handleStart)}>
        <div style={LandingStyle.form}>
          <label className="inputlabel">Chose a Name</label>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} type="text" className="input" placeholder="Enter you Name" />}
          />
          {errors.name?.message != undefined ? <p className="error">{errors.name?.message}</p> : <></>}
        </div>
        <div style={{ width: "350px" }}>
          <button className="btnpr" type="submit">
            Start
          </button>
        </div>
      </form>
    </div>
  );
}

export default Landing;
