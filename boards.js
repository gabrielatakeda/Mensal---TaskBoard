import { API_BASE_URL } from "./apiConfig.js";
import { saveLocalStorage, getLocalStorage } from "./global.js";
import { alert } from "./global.js";

document.addEventListener("DOMContentLoaded", async (evento) => {

    const boards = document.getElementById("dropdown-content");

    try {
        const importBoards = await fetch(`${API_BASE_URL}/Boards`); //Faz uma requisição para buscar os dados das boards, await é usado para aguardar a resposta
        const listBoards = await importBoards.json(); //converte as boards exixentes em um array de objetos

        if (!importBoards.ok) {
            alert("Erro ao carregar as boards");
        }else{
            boards.innerHTML = ''; //Limpa as opções antes de adicionar novas
            const defaultOption = document.createElement("option"); //Cria um novo elemento, que será a primeira opção do dropDown
            defaultOption.textContent = "Select Board"; //Define o texto visível para a opção criada
            boards.appendChild(defaultOption); //Faz aparecer para o usuário
            listBoards.forEach(board => { //Itera cada board dentro do array, cada board será transformada em uma option, para o usuário escolher
                 const option = document.createElement("option");
                 option.value = board.Id; //"Id" seja o identificador único da board
                 option.textContent = board.Name; //"Name" seja o nome da board
                 board.appendChild(option);
            });
        }
        
    }catch (error) {
        console.error("Erro ao fazer a requisição:", error);
    }finally {  

    }
        

});






// document.addEventListener("DOMContentLoaded", async (e) => { //Vai ser executado assim que a página carregar todo o HTML
//     const boardsDropdown = document.getElementById("boards-dropdown"); //Armazena em uma variável onde as boards vão aparecer

//     try { //Envolve o código que pode lançar um erro, se ocorre um erro dentro do try, ele será capturado no catch
//         const response = await fetch(${url_postman}/Boards); //Faz uma requisição para buscar os dados das boards, await é usado para aguardar a resposta
//         const boardsList = await response.json(); //Converte em objeto

//         if(response.ok){ //Verifica se a resposta é verdadeira, se for verdadeira, será executado esse bloco
//             boardsDropdown.innerHTML = ''; //Limpa as opções antes de adicionar novas
//             const defaultOption = document.createElement("option"); //Cria um novo elemento, que será a primeira opção do dropDown
//             defaultOption.textContent = "Select Board"; //Define o texto visível para a opção criada
//             boardsDropdown.appendChild(defaultOption); //Faz aparecer para o usuário
//             boardsList.forEach(board => { //Itera cada board dentro do array, cada board será transformada em uma option, para o usuário escolher
//                 const option = document.createElement("option");
//                 option.value = board.Id; //"Id" seja o identificador único da board
//                 option.textContent = board.Name; //"Name" seja o nome da board
//                 boardsDropdown.appendChild(option);
//             });
//         } else {
//             console.error("Falha ao obter as boards: ", response.statusText);
//         }

//     } catch (error) { //Captura qualquer erro que tenha ocorrido dentro do try
//         console.error("Erro ao fazer a requisição:", error);
//     }
// });



// Alternar entre os modos claro e escuro
document.querySelectorAll('input[name="theme"]').forEach((elem) => {
    elem.addEventListener("change", function(event) {
        if (event.target.value === "dark") {
            document.body.classList.add("dark-mode");
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem('theme', 'light');
        }
    });
});

// Carregar a preferência do tema do localStorage ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('dark').checked = true;
    } else {
        document.getElementById('light').checked = true;
    }
});
