import { getRecentRecipes } from '../api/recipe.js';
import { html, until } from '../lib.js';
import { spinner } from './common.js';


const homeTemplate = (dataPromise) => html`
<section id="home">
    <div class="hero">
        <h2>Добре Дошли в Моите Рецепти</h2>
    </div>
    <header class="section-title">Последно добавени рецепти</header>
    <div class="recent-recipes">
        
        ${until(dataPromise, spinner())}
        
    </div>
    <footer class="section-title">
        <p>Разгледайте всички рецепти в <a href="/recipes">Каталог</a></p>
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
    const {results: data} = await getRecentRecipes();
    
    if (data.length == 0) {
        return html`<p>Няма намерени рецепти.</p>`;
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
