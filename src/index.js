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
import usersModel from './models/users';
import createApiModel from './models/api';
import createFbSessionModel from './models/fbSession';

// views
import fbSDK from './views/fbSDK';
import mainView from './views/main';
import loginView from './views/login';
import dashboardView from './views/dashboard';
import homeContent from './views/home';
import channelsContent from './views/channels';
import ecommerceContent from './views/ecommerce';
import repliesContent from './views/replies';
import mutedChatsContent from './views/mutedChats';

const app = choo({ history: false, href: false });
app.model(appModel);
app.model(uiModel);
app.model(customerModel);
app.model(botModel);
app.model(repliesModel);
app.model(usersModel);
app.model(createApiModel(config.calamar));
app.model(createFbSessionModel(config.facebook));

const defaultAnonView = loginView;
const authWrapper =
    (loggedView, anonView = defaultAnonView) => (state, prev, send) => (
        state.customer.isLogged
            ? loggedView(state, prev, send)
            : anonView(state, prev, send)
);

const viewWrapper = pipe(authWrapper, mainView);
const homeView = dashboardView(homeContent);
const channelsView = dashboardView(channelsContent);
const ecommerceView = dashboardView(ecommerceContent);
const repliesView = dashboardView(repliesContent);
const mutedChatsView = dashboardView(mutedChatsContent);

app.router([
    // ['/', viewWrapper(homeView)],
    ['/', mainView(repliesView)],
    ['/controltower', viewWrapper(homeView)],
    ['/channels', viewWrapper(channelsView)],
    ['/ecommerce', viewWrapper(ecommerceView)],
    ['/replies', viewWrapper(repliesView)],
    ['/mutedChats', viewWrapper(mutedChatsView)]
]);

const tree = app.start();

// facebook javascript sdk script tag
document.body.appendChild(fbSDK);
document.body.appendChild(tree);
