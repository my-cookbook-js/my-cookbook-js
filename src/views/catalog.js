import { getRecipes } from '../api/recipe.js';
import { html, until } from '../lib.js';
import { createSubmitHandler, parseQuery } from '../utils.js';
import { spinner } from './common.js';


const catalogTemplate = (recipePromise, onSearch, page, search) => html`
<section id="catalog">
    <div class="section-title">
        <form @submit=${onSearch} id="searchForm">
            <input type="text" name="search" .value=${search}>
            <input type="submit" value="Search">
        </form>
    </div>
    
    ${until((async () => recipeList(await recipePromise, page, search))(), spinner())}
    
</section>`;

function recipeList({results: recipes, pages}, page, search) {
    return html`
    ${pages > 1 ? html`<header class="section-title">
                            ${pager(page, pages, search)}
                        </header>` : null}

    ${recipes.length > 0 ? recipes.map(recipePreview) : html`
                                            <div class="section-title">No recipes found.</div>`}

    ${pages > 1 ? html`<footer class="section-title">
                            ${pager(page, pages, search)}
                        </footer>` : null}`;
}

const recipePreview = (recipe) => html`
<a class="card" href="recipes/details/${recipe.objectId}">
    <article class="preview">
        <div class="title">
            <h2>${recipe.name}</h2>
        </div>
        <div class="small"><img src=${recipe.img}></div>
    </article>
</a>`;

const pager = (page, pages, search) => html`
Page ${page} of ${pages}
${page > 1 ? html`<a class="pager" href=${'/recipes/' + createQuery(page - 1, search)}>&lt;
    Prev</a>` : ''}
${page < pages ? html`<a class="pager" href=${'/recipes/' + createQuery(page + 1, search)}>Next
    &gt;</a>` : ''}`;

function createQuery(page, search) {
    return `?page=${page}${(search ? `&search=${search}` : '')}`;
}

export function catalogPage(ctx) {
    const { page, search } = parseQuery(ctx.querystring);

    const recipesPromise = getRecipes(page || 1, search || '');
    
    ctx.render(catalogTemplate(recipesPromise, createSubmitHandler(onSearch, 'search'), page || 1, search || ''));

    function onSearch({ search }) {
        if (search) {
            ctx.page.redirect(`/recipes?search=${encodeURIComponent(search)}`);
        } else {
            ctx.page.redirect('/recipes');
        }
    }
}
