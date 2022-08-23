import { register } from '../api/user.js';
import { html } from '../lib.js';
import { createSubmitHandler } from '../utils.js';
import { errorMsg, field } from './common.js';


const registerTemplate = (onSubmit, errors, data) => html`
<section id="register">
    <article>
        <h2>Register</h2>
        <form @submit=${onSubmit} id="loginForm">
            ${errorMsg(errors)}

            ${field({label: 'Username', name: 'username', value: data.username, error: errors.username})}
            ${field({label: 'E-Mail', name: 'email', value: data.email, error: errors.email})}
            ${field({label: 'Password', type: 'password', name: 'password', error: errors.password})}
            ${field({label: 'Repeat', type: 'password', name: 'repass', error: errors.repass})}
            <input type="submit" value="Register">
        </form>
    </article>
</section>`;

export function registerPage(ctx) {
    update();
    
    function update(errors = {}, data = {}) {
        ctx.render(registerTemplate(createSubmitHandler(onSubmit, 'username', 'email', 'password', 'repass'), errors, data));
    }
    
    async function onSubmit(data, event) {
        try {
            const missing = Object.entries(data).filter(([k, v]) => v == '');

            if (missing.length > 0) {
                throw missing
                .reduce((acc, [k]) => Object.assign(acc, {[k]: true}), {message: 'Please fill all fields.'});
            }
            if (data.password != data.repass) {
                throw {
                    message: 'Paswords don\'t match.',
                    password: true,
                    repass: true
                };
            }
    
            await register(data.username, data.email, data.password);
            event.target.reset();
            ctx.updateUserNav();
            ctx.updateSession();
            ctx.page.redirect('/recipes');

        } catch (err) {
            update(err, data);
        }
    }
}

