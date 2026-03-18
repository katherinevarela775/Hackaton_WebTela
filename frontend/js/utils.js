// utils.js - Utilidades generales de la aplicacion

const API_BASE = 'http://127.0.0.1:5000';

function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}
