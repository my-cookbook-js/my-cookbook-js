import { createRecipe } from '../api/recipe.js';
import { html, classMap } from '../lib.js';
import { createSubmitHandler } from '../utils.js';
import { errorMsg, field } from './common.js';


const createTemplate = (onSubmit, errors, data, categories) => html`
<section id="create">
    <article>
        <h2>Нова Рецепта</h2>
        <form @submit=${onSubmit} id="createForm">
            ${errorMsg(errors)}

            <label>Категория:<select class=${classMap({error: errors.category})} name="category">
                <option value="none" selected disabled hidden>Избери Категория</option>
                ${categories.map(c => html`<option value = ${c.objectId}>${c.name}</option>`)}
            </select></label>

            ${field({label: 'Име', name: 'name', placeholder: 'Име на рецептата', value: data.name, error: errors.name})}
            ${field({label: 'Снимка', name: 'img', placeholder: 'Снимка URL', value: data.img, error: errors.img})}
            ${field({
                label: 'Продукти', 
                type: 'textarea', 
                name: 'ingredients', 
                placeholder: 'Попъленете продуктите на отделни редове', 
                value: data.ingredients, 
                error: errors.ingredients})}
            ${field({
                label: 'Приготвяне', 
                type: 'textarea', 
                name: 'steps', 
                placeholder: 'Въведете стъпките на приготвяне на отделни редове', 
                value: data.steps, 
                error: errors.steps})}
            <input type="submit" value="Добави Рецепта">
        </form>
    </article>
</section>`;

export async function createPage(ctx) {
    const categories = ctx.categories;

    update();
    
    function update(errors = {}, data = {}) {
        ctx.render(createTemplate(createSubmitHandler(onSubmit, 'name', 'img', 'ingredients', 'steps', 'category'), errors, data, categories));
    }
    
    async function onSubmit(data, event) {
        try {
            const missing = Object.entries(data).filter(([k, v]) => v == '');
            
            if (missing.length > 0) {
                throw missing
                .reduce((acc, [k]) => Object.assign(acc, {[k]: true}), {message: 'Моля попълнете всички полета.'});
            }
            const recipe = {
                name: data.name,
                img: data.img,
                ingredients: data.ingredients.split('\n').filter(r => r != ''),
                steps: data.steps.split('\n').filter(r => r != ''),
                category: {
                    __type: 'Pointer',
                    className: 'Category',
                    objectId: data.category
                }
            };
        
            const result = await createRecipe(recipe);
            event.target.reset();
            ctx.notify('Рецептата е създадена');
            ctx.page.redirect('/recipes/details/' + result.objectId);

        } catch (err) {
            update(err, data);
        }
    }
}

