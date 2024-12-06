//LOGIN
import { API_BASE_URL } from "./apiConfig.js";
import { saveLocalStorage, getLocalStorage } from "./global.js";
import { alert } from "./global.js";

const emailInput = document.getElementById ("email"); //puxando do input do html
const validateForm = document.getElementById ("form-login"); //
const error = document.getElementById ("error");

function disableButton(button, disable){
    button.disabled = disable;
    button.textContent = disable ? "Carregando..." : "Acessar";
}

validateForm.addEventListener("submit", async (event) => { // Adiciona um ouvinte de eventos para o evento de envio no formulário 'validateForm'
    event.preventDefault(); // Previne o comportamento padrão do formulário de recarregar a página ao ser submetido

    const email = emailInput.value.trim(); // Obtém o valor do campo de entrada 'emailInput' e remove espaços em branco no início e no fim

    if (!email) {  
        alert("Por favor informe um email válido."); // Exibe um alerta se o campo de email estiver vazio
        return; // Sai da função se o campo de email estiver vazio
    }

    const submitButton = validateForm.querySelector("button"); // Seleciona o botão de envio dentro do formulário 'validateForm'
    disableButton(submitButton, true); // Desativa o botão de envio chamando a função 'disableButton' com o argumento 'true'

    try {
        const response = await fetch(`${API_BASE_URL}/GetPersonByEmail?Email=${email}`); // Faz uma requisição assíncrona para a URL fornecida com o email como parâmetro
        if (!response.ok) {
            if (response.status === 422) {
                const errorData = await response.json(); // Converte a resposta em JSON se o status for 422 (Unprocessable Entity)
                alert(errorData.Errors[0]); // Exibe o primeiro erro da lista de erros recebida
            } else {
                alert("Aconteceu um erro inesperado, tente novamente."); // Exibe um alerta de erro genérico se o status não for 422
            }
            return; // Sai da função se a resposta não for bem-sucedida
        }

        const userData = await response.json();
        saveLocalStorage("user", { id: userData.Id, email: userData.Email });
        window.location.href = "boards.html"; // Navega para a tela de home

    } catch (error) {
        alert("Aconteceu um erro inesperado, tente novamente."); // Exibe um alerta de erro em caso de exceção durante a requisição
        console.error(error); // Loga o erro no console para depuração
    } finally {
        disableButton(submitButton, false); // Reativa o botão de envio chamando a função 'disableButton' com o argumento 'false'
    }
});
