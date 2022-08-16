import { getRecipes, pageSize } from '../api/recipe.js';
import { html, until } from '../lib.js';
import { createSubmitHandler, parseQuery } from '../utils.js';
import { spinner } from './common.js';


const catalogTemplate = (recipePromise, onSearch, page, search, category, categories, onSelect) => html`
<section id="catalog">
    <div>
        <label class="category-label">
            <span>Category:</span>
            <select @change=${onSelect} name="category">
                ${categories.map(c => html`
                <option>${c.name}</option>`)}
            </select>
        </label>
        <form @submit=${onSearch} id="searchForm">
            <input type="text" name="search" .value=${search}>
            <input type="submit" value="Search">
        </form>
    </div>
    
    ${until((async () => recipeList(await recipePromise, page, search, category))(), spinner())}
    
</section>`;

function recipeList({results: recipes, count}, page, search, category) {
    const pages = Math.ceil(count / pageSize);

    return html`
    ${pages > 1 ? html`<header class="section-title">
                            ${pager(page, pages, search, category)}
                        </header>` : null}

    ${recipes.length > 0 ? recipes.map(recipePreview) : html`
                                            <div class="section-title">No recipes found.</div>`}

    ${pages > 1 ? html`<footer class="section-title">
                            ${pager(page, pages, search, category)}
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

const pager = (page, pages, search, category) => html`
Page ${page} of ${pages}
${page > 1 ? html`<a class="pager" href=${'/recipes' + createQuery(page - 1, category, search)}>&lt;
    Prev</a>` : ''}
${page < pages ? html`<a class="pager" href=${'/recipes' + createQuery(page + 1, category, search)}>Next
    &gt;</a>` : ''}`;

function createQuery(page, category, search) {
    if (category) {
        return `?page=${page}${(category ? `&category=${category}` : '')}`;
    } else {
        return `?page=${page}${(search ? `&search=${search}` : '')}`;
    }  
}

export function catalogPage(ctx) {
    let { page, search, category } = parseQuery(ctx.querystring);
    const categoryId = getCategoryId(category);    

    const recipesPromise = getRecipes(page || 1, search || '', categoryId || '');

    ctx.render(catalogTemplate(recipesPromise, createSubmitHandler(onSearch, 'search'), page || 1, search || '', category || '', ctx.categories, onSelect));

    function onSearch({ search }) {
        if (search) {
            ctx.page.redirect(`/recipes?search=${encodeURIComponent(search)}`);
        } else {
            ctx.page.redirect('/recipes');
        }
    }

    function onSelect(event) {
        ctx.page.redirect(`/recipes?category=${encodeURIComponent(event.target.value.toLocaleLowerCase())}`);
    }

    function getCategoryId(category) {
        if (!category) {
            return;
        }
        const result = ctx.categories.find(c => c.name.toLocaleLowerCase() == category.toLocaleLowerCase());

        if (result) {
            return result.objectId;
        }
    }
}
