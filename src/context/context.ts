import { Context, Scenes } from "telegraf";

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