import * as restify from 'restify';
import { 
    ChatConnector, 
    UniversalBot, 
    Middleware,
    MemoryBotStorage,
    LuisRecognizer  
} from 'botbuilder';
import * as dialogs from './dialogs';
import { setAccessToken } from './helpers/accessToken';
const config = require('../config.json');

//=========================================================
// Bot Setup
//=========================================================

// Create chat bot
const connector = new ChatConnector({
    appId: process.env.APP_ID || config.APP_ID,
    appPassword: process.env.APP_PASSWORD || config.APP_PASSWORD
});
const bot = new UniversalBot(connector);
// Register in-memory storage
bot.set('storage', new MemoryBotStorage());
setAccessToken(bot);

//=========================================================
// Bots Middleware
//=========================================================

bot.use(Middleware.firstRun({ version: 1.0, dialogId: '*:/firstRun' }));
bot.use(Middleware.sendTyping());

//use LUIS as bot recognizer
const luisRec = new LuisRecognizer(config.LuisUrl);
bot.recognizer(luisRec);

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', dialogs.root);
bot.dialog('/firstRun', dialogs.firstRun);
bot.dialog('/newRequest', dialogs.newRequest);
bot.dialog('/menu', dialogs.menu)
    .triggerAction({ matches: /^API/i })
    .cancelAction('cancelMenuAction', 'OK, nevermind', { matches: /(cancel|nevermind)/i })
bot.dialog('cv', dialogs.cv)
    .triggerAction({ matches: 'cv' });
bot.dialog('emotion', dialogs.emotion)
    .triggerAction({ matches: 'emotion' });


//=========================================================
// Server Setup
//=========================================================

const server = restify.createServer();

// Setup endpoint for incoming messages which will be passed to the bot's ChatConnector.
server.post('/api/messages', connector.listen());

// Start listening on 3978 by default
server.listen(process.env.PORT || 3978, () => {
    console.log('%s listening to %s', server.name, server.url);
});