export interface ILink {
    linkText: string;
    passageName: number;
}

export interface IEmotion {
    character: string;
    emotion: string;
}

export interface IPassage {
    name: string;
    id: number;
    text: string;
    cleanText: string;
    links: ILink[];
    speaker?: string;
    emotions?: IEmotion[];
    background: string;
}

export interface IStoryData {
    uuid: string;
    name: string;
    creator: string;
    creatorVersion: string;
    schemaName: string;
    schemaVersion: string;
    createdAtMs: number;
    passages: IPassage[];
} 