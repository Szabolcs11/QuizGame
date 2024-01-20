export type PlayerType = {
    ID: number;
    Name: string;
}

export interface LobbyPlayerType extends PlayerType {
    IsAdmin: boolean;
}

type LobbyStatus = 'waiting' | 'playing' | 'finished';

export type LobbyPreviewType = {
    ID: number;
    Name: string;
    LobbyKey: string;
    Status: LobbyStatus;
    PlayersCounter: number;
}

export interface LobbyType extends LobbyPreviewType {
    Players: LobbyPlayerType[];
    CurrentQuestion: QuestionType;
}

export type QuestionTypes = 'text' | 'image' | 'sound';

export type QuestionType = {
    ID: number;
    Text: string;
    Type: QuestionTypes;
    OrderNum: number;
    Answers: AnswerType[];
    Status: 'unanswered' | "answered"
}

export type AnswerType = {
    ID: number;
    Text: string;
    IsCorrect: boolean;
}