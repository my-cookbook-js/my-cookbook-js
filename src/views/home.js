import { getRecentRecipies } from '../api/recipe.js';
import { html, until } from '../lib.js';
import { spinner } from './common.js';


const homeTemplate = (dataPromise) => html`
<section id="home">
    <div class="hero">
        <h2>Welcome to My Cookbook</h2>
    </div>
    <header class="section-title">Recently added recipes</header>
    <div class="recent-recipes">
        
        ${until(dataPromise, spinner())}

    </div>
    <footer class="section-title">
        <p>Browse all recipes in the <a href="/recipes">Catalog</a></p>
    </footer>
</section>`;

const recipePreview = (recipe) => html`
<a class="card" href="/recipes/details/${recipe.objectId}">
    <article class="recent">
        <div class="recent-preview"><img src=${recipe.img}></div>
        <div class="recent-title">${recipe.name}</div>
    </article>
</a>`;

export function homePage(ctx) {
    ctx.render(homeTemplate(loadData()));
}

async function loadData() {
    const {results: data} = await getRecentRecipies();
    
    if (data.length == 0) {
        return html`<p>No recipes found.</p>`;
    } else {
        return data.reduce((acc, curr) => {
            if (acc.length > 0) {
                acc.push(html`<div class="recent-space"></div>`);
            }
            acc.push(recipePreview(curr));
            return acc;
        }, []);
    }   
}
