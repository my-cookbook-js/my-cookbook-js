import { page } from './lib.js';
import { decorateContext, updateUserNav } from './middlewares/render.js';
import notify from './middlewares/notify.js';
import { logout } from './api/user.js';
import { catalogPage } from './views/catalog.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';


document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateContext);
page(notify());
page('/', homePage);
page('/login', loginPage);
page('/register', registerPage);
page('/recipes', catalogPage);

updateUserNav();
page.start();

function onLogout() {
    logout();
    updateUserNav();
    page.redirect('/');
}
