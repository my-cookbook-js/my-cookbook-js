import * as api from './api.js';
import { endpoints, addOwner } from './data.js';


export async function getRecipes(page, search) {
    // let url = endpoints.recipes + `&offset=${(page - 1) * PAGE_SIZE}&pageSize=${PAGE_SIZE}`;
    // if (search) {
    //     url += '&where=' + encodeURIComponent(`name like "${search}"`);
    // }
    return await api.get(endpoints.recipes);
}


export async function getRecentRecipies() {
    return api.get(endpoints.recentRecipes);
}

export async function getRecipeById(id) {
    return api.get(endpoints.recipeDetails(id));
}

export async function createRecipe(data) {
    addOwner(data); 
    return api.post(endpoints.recipes, data);
}

export async function editRecipe(id, data) {
    return api.put(endpoints.recipeById + id, data);
}

export async function deleteRecipe(id) {
    return api.del(endpoints.recipeById + id);
}
