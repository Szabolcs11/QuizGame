export const API_URL = import.meta.env.VITE_API_URL as string

export const ENDPOINTS = {
    AUTHENTICATE: API_URL + 'auth/authenticate',
    REGISTER: API_URL + 'auth/register',
    LOBBIES: API_URL + 'lobby/lobbies',
    FILE_UPLOAD: API_URL + 'file/upload',
    GET_FILE: API_URL + 'file/',
};

export const PATHS = {
    LOBBIES: '/lobbies',
    CREATE_LOBBY: '/create-lobby',
    LOBBY: '/lobby',
    GAME: '/game',
    GAME_ADMIN: '/game-admin',
}

export const SOCKET_EVENTS = {
    JOIN_LOBBY: 'join-lobby',
    PLAYER_JOINED: 'player-joined',
    PLAYER_LEFT_LISTENER: 'player-left',
    UPDATE_LOBBY: 'update-lobby',
    EMIT_CREATE_LOBBY: 'create-lobby',
    EMIT_JOIN_EDIT_LOBBY: 'join-edit-lobby',
    ON_LOBBY_CREATED: 'lobby-created',
    EMIT_ADD_QUESTION: 'add-question',
    EMIT_UPDATE_QUESTIONS_ORDER: 'update-questions-order',
    EMIT_DELETE_QUESTION: 'delete-question',
    EMIT_START_LOBBY: 'start-lobby',
    ON_LOBBY_STARTED: 'lobby-started',
    EMIT_JOIN_GAME: 'join-game',
    EMIT_JOIN_GAME_ADMIN: 'join-game-admin',
    EMIT_ANSWER_QUESTION: 'answer-question',
    ON_ANSWERED_QUESTION: 'answered-question',
    EMIT_NEXT_QUESTION: 'next-question',
    ON_CHANGE_QUESTION: 'change-question',
    EMIT_END_QUESTION: 'end-question',
    ON_QUESTION_ENDED: 'question-ended',
    EMIT_SHOW_SCOREBOARD: 'show-scoreboard',
    ON_SHOW_SCOREBOARD: 'show-scoreboard',
    EMIT_FINISH_GAME: 'finish-game',
    ON_FINISH_GAME: 'finish-game',
    EMIT_RESET_GAME: 'reset-game',
    ON_GAME_RESET: 'game-reseted',
};