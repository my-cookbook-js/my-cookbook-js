import { getRecipes, pageSize } from '../api/recipe.js';
import { html, until } from '../lib.js';
import { createSubmitHandler, parseQuery } from '../utils.js';
import { spinner } from './common.js';


const catalogTemplate = (recipePromise, onSearch, page, search, category, authorId, categories, onSelect) => html`
<section id="catalog">
    <div>
        <label class="category-label">
            <span>Категория:</span>
            <select @change=${onSelect} name="category">
                <option value="none" selected hidden>Избери Категория</option>
                ${categories.map(c => optionTemplate(c.name, category))}
            </select>
        </label>
        <form @submit=${onSearch} id="searchForm">
            <input type="text" name="search" .value=${search}>
            <input type="submit" value="Search">
        </form>
    </div>
    
    ${until((async () => recipeList(await recipePromise, page, search, category, authorId))(), spinner())}
    
</section>`;

function optionTemplate(name, category) {
    if (name.toLocaleLowerCase() == category) {
        return html`<option selected>${name}</option>`;
    } else {
        return html`<option>${name}</option>`;
    }
}

function recipeList({results: recipes, count}, page, search, category, authorId) {
    const pages = Math.ceil(count / pageSize);

    return html`
    ${pages > 1 ? html`<header class="section-title">
                            ${pager(page, pages, search, category, authorId)}
                        </header>` : null}

    ${recipes.length > 0 ? recipes.map(recipePreview) : html`
                                            <div class="section-title">Няма намерени рецепти.</div>`}

    ${pages > 1 ? html`<footer class="section-title">
                            ${pager(page, pages, search, category, authorId)}
                        </footer>` : null}`;
}

const recipePreview = (recipe) => html`
<article class="preview">
    <a class="card" href="recipes/details/${recipe.objectId}">
        <div class="title">
            <h2>${recipe.name}</h2>
        </div>
        <div class="small"><img src=${recipe.img}></div>
    </a>
</article>`;

const pager = (page, pages, search, category, authorId) => html`
Страница ${page} от ${pages}
${page > 1 ? html`<a class="pager" href=${createQuery(page - 1, category, search, authorId)}>&lt;
    Предишна</a>` : ''}
${page < pages ? html`<a class="pager" href=${createQuery(page + 1, category, search, authorId)}>Следваща
    &gt;</a>` : ''}`;

function createQuery(page, category, search, authorId) {
    let url = `/recipes?page=${page}`;
    
    if (search) {
        return url + `&search=${encodeURIComponent(search)}`;
    }
    if (category) {
        url += `&category=${encodeURIComponent(category)}`;
    }
    if (authorId) {
        url += `&author=${encodeURIComponent(authorId)}`;
    }
    
    return url;
}

export function catalogPage(ctx) {
    let { page, search, category, author } = parseQuery(ctx.querystring);
    const categoryId = getCategoryId(category);    

    const recipesPromise = getRecipes(page || 1, search || '', categoryId || '', author || '');

    ctx.render(catalogTemplate(recipesPromise, createSubmitHandler(onSearch, 'search'), page || 1, search || '', category || '', author || '', ctx.categories, onSelect));

    function onSearch({ search }) {
        let url = '/recipes';
        if (search) {
            url += `?search=${encodeURIComponent(search)}`;
        }
        ctx.page.redirect(url);
    }

    function onSelect(event) {
        let url = `/recipes?category=${encodeURIComponent(event.target.value.toLocaleLowerCase())}`;
        if (author) {
            url += `&author=${encodeURIComponent(author)}`;
        }
        ctx.page.redirect(url);
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
