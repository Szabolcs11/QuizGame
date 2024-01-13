export const API_URL = 'http://localhost:2004/'

export const ENDPOINTS = {
    AUTHENTICATE: API_URL + 'auth/authenticate',
    REGISTER: API_URL + 'auth/register',
    LOBBIES: API_URL + 'lobby/lobbies',
};

export const PATHS = {
    LOBBIES: '/lobbies',
    CREATE_LOBBY: '/create-lobby',
    LOBBY: '/lobby',
}

export const SOCKET_EVENTS = {
    JOIN_LOBBY: 'join-lobby',
    PLAYER_JOINED: 'player-joined',
    PLAYER_LEFT: 'player-left',
    UPDATE_LOBBY_PLAYERS_COUNTER: 'update-lobby-players-counter',
};