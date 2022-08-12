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
    return function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const data = fields
        .reduce((acc, curr) => Object.assign(acc, {[curr]: formData.get(curr).trim()}), {});

        callback(data, event);
    };
}