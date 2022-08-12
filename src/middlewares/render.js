import { render } from '../lib.js';
import { getUserData } from '../utils.js';


const root = document.getElementById('content');

function boundRender(content) {
    render(content, root);
}

export function decorateContext(ctx, next) {
    ctx.render = boundRender;
    ctx.updateUserNav = updateUserNav;
    next();
}

export function updateUserNav() {
    const userData = getUserData();

    if (userData) {
        document.getElementById('user').style.display = 'inline-block';
        document.getElementById('guest').style.display = 'none';
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'inline-block';
    }
}
