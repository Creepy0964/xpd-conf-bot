import { Scenes, Context } from "telegraf";

export interface UserI {
    tId: number,
    username: string,
    isBanned: number
}

interface SessionData extends Scenes.WizardSession {
    typology: string;
    experience: string;
    type: string;
    anquette: string;
}

export interface MyContext extends Context {
    scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
	wizard: Scenes.WizardContextWizard<MyContext>;
    session: SessionData;
}