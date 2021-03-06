import choo from 'choo';
import { pipe } from 'ramda';

// config
import config from '../config';

// models
import appModel from './models/app';
import uiModel from './models/ui';
import customerModel from './models/customer';
import botModel from './models/bot';
import repliesModel from './models/replies';
import intentsModel from './models/intents';
import usersModel from './models/users';
import inviteModel from './models/invite';
import createApiModel from './models/api';
import createFbSessionModel from './models/fbSession';
import createSageModel from './models/sage';

// views
import fbSDK from './views/fbSDK';
import mainView from './views/main';
import loginView from './views/login';
import dashboardView from './views/dashboard';
import homeContent from './views/home';
import channelsContent from './views/channels';
import ecommerceContent from './views/ecommerce';
import intentsContent from './views/intents';
import repliesContent from './views/replies';
import mutedChatsContent from './views/mutedChats';
import adminsContent from './views/admins';
import invitationContent from './views/invitation';
import debugContent from './views/debug';

const app = choo({ history: false, href: false });
app.model(appModel);
app.model(uiModel);
app.model(customerModel);
app.model(botModel);
app.model(repliesModel);
app.model(intentsModel);
app.model(usersModel);
app.model(inviteModel);
app.model(createApiModel(config.controltower));
app.model(createSageModel(config.sage));
app.model(createFbSessionModel(config.facebook));

const defaultAnonView = loginView;
const authWrapper =
    (loggedView, anonView = defaultAnonView) => (state, prev, send) => (
        state.customer.isLogged
            ? loggedView(state, prev, send)
            : anonView(state, prev, send)
);

const viewWrapper = pipe(authWrapper, dashboardView);
const homeView = viewWrapper(homeContent);
const channelsView = viewWrapper(channelsContent);
const ecommerceView = viewWrapper(ecommerceContent);
const intentsView = viewWrapper(intentsContent);
const repliesView = viewWrapper(repliesContent);
const mutedChatsView = viewWrapper(mutedChatsContent);
const adminsView = viewWrapper(adminsContent);
const invitationView = invitationContent;
const debugView = viewWrapper(debugContent);

const rootView = homeView;
app.router([
    ['/', rootView],
    ['/controltower', rootView],
    ['/controltower/', rootView],
    ['/home', homeView],
    ['/channels', channelsView],
    ['/ecommerce', ecommerceView],
    ['/intents', intentsView],
    ['/replies', repliesView],
    ['/mutedChats', mutedChatsView],
    ['/admins', adminsView],
    ['/invite', invitationView],
    ['/debug', debugView]
]);

const tree = app.start();

// facebook javascript sdk script tag
document.body.appendChild(fbSDK);
document.body.appendChild(mainView());
const mainWrapper = document.getElementById('mainContent');
mainWrapper.appendChild(tree);
