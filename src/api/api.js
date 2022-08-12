import { notify } from '../lib.js';
import { getUserData, setUserData, clearUserData } from '../utils.js';

const host = 'https://parseapi.back4app.com';


async function request(url, options) {
    try {
        const response = await fetch(host + url, options);

        if (response.ok == false) {
            const error = await response.json();
            throw new Error(error.error);
        }

        return response.json();

    } catch (err) {
        notify(err.message);
        throw err;
    }
}

function createOptions(method = 'get', data) {
    const options = {
        method,
        headers: {
            'X-Parse-Application-Id': 'KMZkVusTVemsLeJdTZaeDrBODQOsDh6ZIoOVtBio',
            'X-Parse-REST-API-Key': 'dLf4Vi9SXPqRTV2idnbDplVyPlf4WVhwvWBXxaIJ'
        }
    };

    if (data != undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const userData = getUserData();
    if (userData != null) {
        options.headers['X-Parse-Session-Token'] = userData.token;
    }

    return options;
}

export async function get(url) {
    return request(url, createOptions());
}

export async function post(url, data) {
    return request(url, createOptions('post', data));
}

export async function put(url, data) {
    return request(url, createOptions('put', data));
}

export async function del(url) {
    return request(url, createOptions('delete'));
}

export async function login(username, password) {
    const result = await post('/login', {username, password});
    
    const userData = {
        username: result.username,
        id: result.objectId,
        token: result.sessionToken
    };
    setUserData(userData);

    return result;
}

export async function register(username, email, password) {
    const result = await post('/users', {username, email, password});

    const userData = {
        username,
        id: result.objectId,
        token: result.sessionToken
    };
    setUserData(userData);

    return result;
}

export async function logout() {
    post('/logout');
    clearUserData();
}

