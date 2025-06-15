import { IStoryData, IPassage } from '../interfaces/IStoryData';

export class StoryManager {
    private storyData: IStoryData | null = null;
    private currentPassage: IPassage | null = null;

    public loadStoryData(data: IStoryData): void {
        this.storyData = data;
    }

    public getPassageByName(name: string): IPassage | null {
        if (!this.storyData) return null;
        return this.storyData.passages.find(p => p.name === name || p.id === name) || null;
    }

    public getPassageById(id: string): IPassage | null {
        if (!this.storyData) return null;
        return this.storyData.passages.find(p => p.id === id) || null;
    }

    public setCurrentPassage(passage: IPassage): void {
        this.currentPassage = passage;
    }

    public getCurrentPassage(): IPassage | null {
        return this.currentPassage;
    }

    public processCharacterEmotions(text: string): { character: string; emotion: string }[] {
        const emotions: { character: string; emotion: string }[] = [];
        const lines = text.split('\n');

        for (const line of lines) {
            if (line.startsWith('[') && line.includes(':')) {
                const emotionText = line.slice(1, -1); // Remove [ and ]
                const [character, emotion] = emotionText.split(':');
                if (character && emotion) {
                    console.log(`Found emotion: ${character} is ${emotion}`);
                    emotions.push({ character, emotion });
                }
            }
        }

        return emotions;
    }

    public findSpecialLink(text: string): string | null {
        // Look for both formats: [[Text-> ->passageId]] and [[Text->passageId]]
        const match = text.match(/\[\[[^\]]*->\s*->?([^\]]+)\]\]/);
        return match ? match[1] : null;
    }

    public getNextPassage(passage: IPassage, linkText?: string): IPassage | null {
        if (!this.storyData) return null;

        // If there's a special link in the text, use that
        const specialLink = this.findSpecialLink(passage.text);
        if (specialLink) {
            return this.getPassageById(specialLink);
        }

        // If there are regular links, find the matching one
        if (passage.links && passage.links.length > 0) {
            if (linkText) {
                const link = passage.links.find(l => l.linkText === linkText);
                if (link) {
                    return this.getPassageByName(link.passageName) || this.getPassageById(link.passageName);
                }
            } else if (passage.links.length === 1) {
                // If there's only one link, use it
                return this.getPassageByName(passage.links[0].passageName) || this.getPassageById(passage.links[0].passageName);
            }
        }

        return null;
    }
} 