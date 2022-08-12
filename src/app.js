import { page } from './lib.js';
import { decorateContext, updateUserNav } from './middlewares/render.js';
import notify from './middlewares/notify.js';
import { catalogPage } from './views/catalog.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';


page(decorateContext);
page(notify());
page('/', homePage);
page('/login', loginPage);
page('/recipes', catalogPage);

updateUserNav();
page.start();



