import * as api from './api.js';
import { endpoints, addOwner } from './data.js';


export const pageSize = 5;

export async function getRecentRecipes() {
    return api.get(endpoints.recentRecipes);
}

export async function getRecipes(page, query, categoryId) {
    if (categoryId) {
        return api.get(endpoints.recipesByCategory(categoryId, page, pageSize));
    }
    if (query) {
        query = {
            name: {
                $regex: query,
                $options: 'i'
                // $text: {
                //     $search: {
                //         $term: query,
                //         $caseSensitive: false
                //     }
                // }
            }
        };
        return api.get(endpoints.recipeSearch(query, page, pageSize));
    } else {
        return api.get(endpoints.recipes(page, pageSize));
    }
}

export async function getRecipeById(id) {
    return api.get(endpoints.recipeById(id));
}

export async function createRecipe(recipe) {
    addOwner(recipe);
    return api.post(endpoints.createRecipe, recipe);
}

export async function updateRecipe(id, recipe) {
    return api.put(endpoints.recipeById + id, recipe);
}

export async function deleteRecipe(id) {
    return api.del(endpoints.recipeById + id);
}
