import { getRecipeById, updateRecipe } from '../api/recipe.js';
import { html, until } from '../lib.js';
import { createSubmitHandler } from '../utils.js';
import { errorMsg, field } from './common.js';
import { spinner } from './common.js';


const editTemplate = (onSubmit, dataPromise, categories, errors) => html`
<section id="edit">
    ${until((async () => formTemplate(await dataPromise, onSubmit, categories, errors))(), spinner())} 
</section>`;

function formTemplate(data, onSubmit, categories, errors) {
    if (Array.isArray(data.ingredients)) {
        data.ingredients = (data.ingredients || []).join('\n');
        data.steps = (data.steps || []).join('\n');
    }
    const categoryId = data.category.objectId;

    function optionTemplate({name, objectId}) {
        if (objectId == categoryId) {
            return html`<option value=${objectId} selected>${name}</option>`;
        } else {
            return html`<option value=${objectId}>${name}</option>`;
        }
    }

    return html`
    <article>
        <h2>Редакция на Рецепта</h2>
        <form @submit=${onSubmit} id="editForm">
            ${errorMsg(errors)}

            <label>Категория:<select name="category">
                ${categories.map(optionTemplate)}
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
            <input type="submit" value="Запази">
        </form>
    </article>`;
}

export function editPage(ctx) {
    const categories = ctx.categories;
    const recipeId = ctx.params.id;
    const recipePromise = getRecipeById(recipeId);
    
    update();
    
    function update(errors = {}, data = recipePromise) {
        ctx.render(editTemplate(createSubmitHandler(onSubmit, 'name', 'img', 'ingredients', 'steps', 'category'), data, categories, errors)); 
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
            
            const result = await updateRecipe(ctx.params.id, recipe);
            event.target.reset();
            ctx.notify('Рецептата е редактирана');
            ctx.page.redirect('/recipes/details/' + recipeId);

        } catch (err) {
            update(err, data);
        }
    }
}
