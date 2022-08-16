import { getCategories } from "../api/category.js";


export default function initialize() {
    return async function(ctx, next) {
        ctx.categories = (await getCategories()).results;

        next();
    };
}