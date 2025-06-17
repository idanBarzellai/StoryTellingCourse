import { IStoryData, IPassage, ILink, IEmotion } from '../interfaces/IStoryData';

export class StoryManager {
    private storyData: IStoryData | null = null;
    private currentPassage: IPassage | null = null;

    public loadStoryData(data: IStoryData): void {
        this.storyData = data;
    }

    public getPassageById(id: number): IPassage | null {
        if (!this.storyData) return null;
        return this.storyData.passages.find(passage => passage.id === id) || null;
    }

    public getPassageByName(name: string): IPassage | null {
        if (!this.storyData) return null;
        return this.storyData.passages.find(passage => passage.name === name) || null;
    }

    public getCurrentPassage(): IPassage | null {
        return this.currentPassage;
    }

    public setCurrentPassage(passage: IPassage): void {
        this.currentPassage = passage;
    }

    public getCharacterEmotions(passage: IPassage): IEmotion[] {
        return passage.emotions || [];
    }

    public getNextPassage(link: ILink): IPassage | null {
        return this.getPassageById(link.passageId);
    }
} 