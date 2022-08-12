import { notify } from "../lib.js";


export default function initialize() {
    return function(ctx, next) {
        ctx.notify = notify;

        next();
    };
}