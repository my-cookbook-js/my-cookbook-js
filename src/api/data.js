import { getUserData } from '../utils.js';


export const endpoints = {
    recentRecipes: '/classes/Recipe?limit=3&order=createdAt',
    recipes: (page, pageSize) => `/classes/Recipe?skip=${(page - 1) * pageSize}&limit=${pageSize}&order=name&count=1`,
    recipesByCategory: (categoryId, page, pageSize) => `/classes/Recipe?where=${createPointerQuery('category', 'Category', categoryId)}&skip=${(page - 1) * pageSize}&limit=${pageSize}&order=name&count=1`,
    recipeSearch: (query, page, pageSize) => `/classes/Recipe?where=${createQuery(query)}&skip=${(page - 1) * pageSize}&limit=${pageSize}&order=name&count=1`,
    recipeById: (id) => `/classes/Recipe/${id}?include=category`,
    createRecipe: '/classes/Recipe',
    categories: '/classes/Category'
};

export function createPointerQuery(propName, className, objectId) {
    return createQuery({[propName]: createPointer(className, objectId)});
}

export function createQuery(query) {
    return encodeURIComponent(JSON.stringify(query));
}

export function createPointer(className, objectId) {
    return {
        __type: 'Pointer',
        className,
        objectId
    };
}

export function addOwner(record) {
    const { id } = getUserData();
    record.owner = createPointer('_User', id);

    return record;
}
