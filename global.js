export function alert (message) {
    error.textContent = message;
    error.classList.remove ("hidden");
}

export function saveLocalStorage (key, value) { // Define uma função global chamada 'saveLocalStorage' que recebe duas variáveis: 'key' e 'value'
    localStorage.setItem(key, JSON.stringify(value)); // Converte o valor para uma string JSON e salva no localStorage com a chave fornecida

};

export function getLocalStorage(key){ // Define uma função global chamada 'getLocalStorage' que recebe a variável 'key'
    const value = localStorage.getItem(key); // Recupera o item do localStorage correspondente à chave fornecida
    return value ? JSON.parse(value) : null; // Se o valor existir, converte de volta de JSON para um objeto e retorna. Caso contrário, retorna null
};
