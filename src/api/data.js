import { getUserData } from '../utils.js';


export const pageSize = 5;
export const homePageSize = 3;

export const endpoints = {
    recipes: '/classes/Recipe',
    recentRecipes: `/classes/Recipe?limit=${homePageSize}&order=-createdAt`,
    recipeById: '/classes/Recipe/',
    recipeDetails: (id) => `/classes/Recipe/${id}?include=owner`,
};

export function createPointer(className, objectId) {
    return {
        __type: 'Pointer',
        className,
        objectId
    };
}

export function addOwner(record) {
    const {id} = getUserData();
    record.owner = createPointer('_User', id);

    return record;
}
