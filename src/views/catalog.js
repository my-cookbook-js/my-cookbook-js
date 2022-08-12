import { getRecipes } from '../api/recipe.js';
import { html, until } from '../lib.js';
import { spinner } from './common.js';


const catalogTemplate = (dataPromise) => html`
`;

const recipePreview = (recipe) => html`
`;

export function catalogPage(ctx) {
    ctx.render(catalogTemplate(loadData()));
}

async function loadData() {
    const {results: data} = await getRecipes();
    
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