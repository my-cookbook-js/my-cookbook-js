import { login } from '../api/user.js';
import { html } from '../lib.js';
import { createSubmitHandler } from '../utils.js';
import { errorMsg, field } from './common.js';


const loginTemplate = (onSubmit, errors, data) => html`
<section id="login">
    <article>
        <h2>Вход</h2>
        <form @submit=${onSubmit} id="loginForm">
            ${errorMsg(errors)}

            ${field({label: 'Потребител', name: 'username', value: data.username, error: errors.username})}
            ${field({label: 'Парола', type: 'password', name: 'password', error: errors.password})}
            <input type="submit" value="Вход">
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
                    message: 'Моля попълнете всички полета.',
                    username: true,
                    password: true
                };
            }
    
            await login(username, password);
            event.target.reset();
            ctx.updateUserNav();
            ctx.updateSession();
            ctx.page.redirect('/recipes');

        } catch (err) {
            update(err, {username});
        }
    }
}

