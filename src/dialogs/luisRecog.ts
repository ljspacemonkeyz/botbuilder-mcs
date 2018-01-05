import { IDialogResult, ListStyle, Prompts, Session } from 'botbuilder';
import { APIs, CognitiveServices } from '../helpers/consts';

// The /luis dialog handler
export const cv = 
    (session: Session, args: Object) => {
        session.userData.selectedAPI = CognitiveServices.ComputerVision;
        session.endDialog("OK, from now on I'll be using the %s API.", APIs[session.userData.selectedAPI].name);
    };

export const emotion = 
    (session: Session, args: Object) => {
        session.userData.selectedAPI = CognitiveServices.Emotion;
        session.endDialog("OK, from now on I'll be using the %s API.", APIs[session.userData.selectedAPI].name);
    };