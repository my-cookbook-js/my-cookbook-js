import * as api from './api.js';
import { endpoints } from './data.js';


export const login = api.login;
export const register = api.register;
export const logout = api.logout;

export async function verifyEmail(email) {
    return api.post(endpoints.emailVerification, email);
}