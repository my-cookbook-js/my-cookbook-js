import { login } from '../api/user.js';
import { html } from '../lib.js';
import { createSubmitHandler } from '../utils.js';
import { field } from './common.js';


const loginTemplate = (onSubmit, errors, data) => html`
<section id="login">
    <article>
        <h2>Login</h2>
        <form @submit=${onSubmit} id="loginForm">
            ${errors ? html`<p class="error">${errors.message}</p>` : null}
            ${field({label: 'Username', name: 'username', value: data.username, error: errors.username})}
            ${field({label: 'Password', type: 'password', name: 'password', error: errors.password})}
            <input type="submit" value="Login">
        </form>
    </article>
</section>`;

export function loginPage(ctx) {
    update();
    
    function update(errors = {}, data = {}) {
        ctx.render(loginTemplate(createSubmitHandler(onSubmit, 'username', 'password'), errors, data));
    }
    
    async function onSubmit({username, password}, event) {
        try {
            if (username == '' || password == '') {
                throw {
                    message: 'Please fill all fields.',
                    username: true,
                    password: true
                };
            }
    
            await login(username, password);
            event.target.reset();
            ctx.updateUserNav();
            ctx.page.redirect('/recipes');

        } catch (err) {
            update(err, {username});
        }
    }
}

