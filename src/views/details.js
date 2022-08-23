import { getRecipeById, deleteRecipe } from '../api/recipe.js';
import { html, until, showModal } from '../lib.js';
import { spinner } from './common.js';


const detailsTemplate = (dataPromise) => html`
<section id="details">
    ${until(dataPromise, spinner())}
    
</section>`;

const recipeCard = (recipe, isOwner, onDelete) => html`
<article>
    <h2>
        ${recipe.name}
        <span>${new Date(recipe.createdAt).toLocaleDateString('bg-BG')}</span>
    </h2>
    <div class="band">
        <div class="thumb"><img src=${recipe.img}></div>
        <div class="ingredients">
            <h3>Author: <span><a href="/recipes?author=${recipe.owner.objectId}">${recipe.owner.username}</a></span></h3>
            <br/>
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
    <a class="actionLink" href="/recipes/details/edit/${id}">&#x270e; Edit</a>
    <a @click=${onDelete} class="actionLink" href="javascript:void(0)">&#x2716; Delete</a>
</div>`;

export function detailsPage(ctx) {
    const recipeId = ctx.params.id;
    ctx.render(detailsTemplate(loadData(recipeId, ctx.user, onDelete)));
    
    function onDelete() {
        ctx.showModal('Are you sure you want to delete this recipe?', onSelect);
    }

    async function onSelect(choice) {
        if (choice) {
            await deleteRecipe(recipeId);
            ctx.notify('Recipe deleted');
            ctx.page.redirect('/recipes');
        }
    }
}

async function loadData(id, user, onDelete) {
    const recipe = await getRecipeById(id);
    const isOwner = user && user.id == recipe.owner.objectId;
    
    return recipeCard(recipe, isOwner, onDelete); 
}
