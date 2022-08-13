import { html, classMap } from '../lib.js';


export const spinner = () => html`<div class="div-loader"><span class="loader"></span></div>`;

export const field = ({label, type = 'text', name, value = '', placeholder = '', error}) => {
    if (type == 'textarea') {
        return html`
        <label class="ml">${label}: <textarea class=${classMap({error})} name=${name}
        placeholder=${placeholder} .value=${value}></textarea></label>`;
    } else {
        return html`
        <label>${label}: <input class=${classMap({error})} type=${type} name=${name} placeholder=${placeholder} .value=${value}></label>`;
    }
};

export const errorMsg = (errors) => {
    if (errors) {
        return html`<p class="error">${errors.message}</p>`;
    } else {
        return null;
    }
};
