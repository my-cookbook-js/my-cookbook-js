import { showModal } from "../lib.js";


export default function initialize() {
    return function(ctx, next) {
        ctx.showModal = showModal;

        next();
    };
}