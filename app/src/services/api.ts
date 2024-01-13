import axios from "axios";
import { ENDPOINTS } from "../constans";
import { LobbyType, PlayerType } from "../types";
import { showToast } from "../utils";

export const authPlayer = async () => {
    try {
        const res = await axios.get(ENDPOINTS.AUTHENTICATE, {withCredentials: true});
        if (res.data.success) {
            return res.data.player as PlayerType;
        }
        return false;
    } catch (error) {
        throw error;
    };
}

export const registerPlayer = async (Name:string) => {
    try {
        const res = await axios.post(ENDPOINTS.REGISTER, {Name}, {withCredentials: true});
        if (res.data.success) {
            showToast('Success', res.data.message);
            return res.data.player as PlayerType;
        } else {
            showToast('Error', res.data.message);
        }
        return false;
    } catch (error) {
        throw error;
    };
}

export const getLobbies = async () => {
    try {
        const res = await axios.get(ENDPOINTS.LOBBIES, {withCredentials: true});
        if (res.data.success) {
            return res.data.lobbies as LobbyType[];
        }
        return false;
    } catch (error) {
        throw error;
    };
}