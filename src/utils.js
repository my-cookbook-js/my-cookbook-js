export function getUserData() {
    return JSON.parse(localStorage.getItem('userData'));
}

export function setUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
}

export function clearUserData() {
    localStorage.removeItem('userData');
}

export function createSubmitHandler(callback, ...fields) {
    return function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        if (formData.get('category') == null) {
            formData.set('category', '');
        }
  
        const data = fields.reduce((a, c) => Object.assign(a, { [c]: formData.get(c).trim() }), {});

        callback(data, event);
    };
}

export function parseQuery(querystring) {
    if (querystring == '') {
        return {};
    } else {
        return querystring.split('&').reduce((a, c) => {
            let [key, value] = c.split('=');
            if (key == 'page') {
                value = Number(value);
            }
            a[key] = value;
            return a;
        }, {});
    }
}
