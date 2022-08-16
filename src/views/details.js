import { getRecipeById, deleteRecipe } from '../api/recipe.js';
import { html, until } from '../lib.js';
import { spinner } from './common.js';


const detailsTemplate = (dataPromise) => html`
<section id="details">
    ${until(dataPromise, spinner())}
    
</section>`;

const recipeCard = (recipe, isOwner, onDelete) => html`
<article>
    <h2>${recipe.name}</h2>
    <div class="band">
        <div class="thumb"><img src=${recipe.img}></div>
        <div class="ingredients">
            <h3>Category: <span>${recipe.category.name}</span></h3>
            <br/>
            <h3>Ingredients:</h3>
            <ul>
                ${recipe.ingredients.map(i => html`<li>${i}</li>`)}
            </ul>
        </div>
    </div>
    <div class="description">
        <h3>Preparation:</h3>
        ${recipe.steps.map(s => html`<p>${s}</p>`)}
    </div>
    ${isOwner ? controls(recipe.objectId, onDelete) : null}
</article>`;

const controls = (id, onDelete) => html`
<div class="controls">
    <a class="actionLink" href="recipes/details/edit/${id}">&#x270e; Edit</a>
    <a @click=${onDelete} class="actionLink" href="javascript:void(0)">&#x2716; Delete</a>
</div>`;

export function detailsPage(ctx) {
    ctx.render(detailsTemplate(loadData(ctx.params.id, ctx.user, onDelete)));
    
    async function onDelete() {
        const choice = confirm('Are you sure you want to delete this recipe?');

        if (choice) {
            await deleteRecipe(ctx.params.id);
            ctx.page.redirect('/recipes');
        }
    }
}

async function loadData(id, user, onDelete) {
    const recipe = await getRecipeById(id);
    const isOwner = user && user.id == recipe.owner.objectId;
    
    return recipeCard(recipe, isOwner, onDelete); 
}
