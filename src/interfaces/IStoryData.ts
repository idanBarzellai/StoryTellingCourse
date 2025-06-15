export interface ILink {
    linkText: string;
    passageName: string;
}

export interface IPassage {
    id: string;
    name: string;
    text: string;
    cleanText: string;
    links?: ILink[];
}

export interface IStoryData {
    passages: IPassage[];
} 