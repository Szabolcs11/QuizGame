import io from "socket.io-client";
import { API_URL } from "../constans";

export const socket = io(API_URL);