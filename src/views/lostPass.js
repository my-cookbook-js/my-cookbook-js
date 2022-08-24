import { passwordReset } from '../api/user.js';
import { html } from '../lib.js';
import { createSubmitHandler } from '../utils.js';
import { errorMsg, field } from './common.js';


const passwordResetTemplate = (onSubmit, errors, data) => html`
<section id="lostpass">
    <article>
        <form @submit=${onSubmit} id="lostpassForm">
            ${errorMsg(errors)}
            <p>Моля въведете имейлът, скойто сте се регистрирали.</p>
            ${field({label: 'E-mail', name: 'email', value: data.email, error: errors.email})}
            <input type="submit" value="Напред"> 
        </form>
    </article>
</section>`;

export function passwordResetPage(ctx) {
    update();
    
    function update(errors = {}, data = {}) {
        ctx.render(passwordResetTemplate(createSubmitHandler(onSubmit, 'email'), errors, data));
    }
    
    async function onSubmit({email}, event) {
        console.log({email});
        try {
            if (email == '') {
                throw {
                    message: 'Моля въведете email.',
                    email: true,
                };
            }
    
            await passwordReset({email});
            event.target.reset();
            ctx.page.redirect('/login');

        } catch (err) {
            update(err, {email});
        }
    }
}

