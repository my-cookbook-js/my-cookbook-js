import { render } from '../lib.js';
import { getUserData } from '../utils.js';


export default function initialize() {
    const root = document.querySelector('main');
    const links = document.querySelectorAll('body header a');
    
    updateUserNav();

    return function (ctx, next) {
        ctx.render = boundRender;
        ctx.updateUserNav = updateUserNav;

        next();
    };

    function updateUserNav() {
        const userData = getUserData();
        
        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function() {
                [...links].forEach(a => a.classList.remove('active'));
                
                if (this.attributes.href.value != '/') {
                    this.className = 'active';
                }  
            });
        }

        if (userData) {
            document.getElementById('user').style.display = 'inline-block';
            document.getElementById('guest').style.display = 'none';
        } else {
            document.getElementById('user').style.display = 'none';
            document.getElementById('guest').style.display = 'inline-block';
        }
    }

    function boundRender(content) {
        render(content, root);
    }
}
