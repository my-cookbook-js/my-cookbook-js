import { page } from './lib.js';
import decorateContext from './middlewares/render.js';
import addSession from './middlewares/session.js';
import notify from './middlewares/notify.js';
import showModal from './middlewares/modal.js';
import categories from './middlewares/category.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';
import { catalogPage } from './views/catalog.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { passwordResetPage } from './views/lostPass.js';


page(decorateContext());
page(addSession());
page(notify());
page('/', homePage);
page('/login', loginPage);
page('/register', registerPage);
page('/profile/lostpass', passwordResetPage);
page('/recipes', categories(), catalogPage);
page('/recipes/create', categories(), createPage);
page('/recipes/details/:id', showModal(), detailsPage);
page('/recipes/details/edit/:id', categories(), editPage);

page.start();
