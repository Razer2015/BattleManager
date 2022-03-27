const TOKEN_KEY = "battlemanager-tokens";

export function saveTokens(tokens) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function getTokens() {
    return JSON.parse(localStorage.getItem(TOKEN_KEY));
}

export function deleteTokens() {
    localStorage.removeItem(TOKEN_KEY);
}