import { API_BASE_URL } from "./apiConfig.js";
import { saveLocalStorage, getLocalStorage } from "./global.js";

const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");
const columnsContainer = document.getElementById("columnsContainer"); // Verifique se isso está definido corretamente

async function loadBoard() {
    try {
        const response = await fetch(`${API_BASE_URL}/Boards`);

        if (!response.ok) {
            if (response.status === 422) {
                const errorData = await response.json();
                console.error(errorData.Errors[0]);
            } else {
                console.error("Aconteceu um erro inesperado, tente novamente.");
            }
            return;
        }

        const boards = await response.json();

        dropdownMenu.innerHTML = ''; // Limpa as opções do menu dropdown antes de adicionar novas

        boards.forEach(board => {
            const boardLink = document.createElement("a");
            boardLink.href = "#";
            boardLink.classList.add("dropdown-item"); // Adiciona a classe para estilização
            boardLink.textContent = board.Name;
            boardLink.addEventListener("click", () => {
                loadColumns(board.Id);
            });
            dropdownMenu.appendChild(boardLink);
        });
    } catch (error) {
        console.error("Aconteceu um erro inesperado, tente novamente.");
    }
}

async function loadColumns(boardId) {
    const columnsContainer = document.getElementById("columnsContainer"); // Verifique se isso está definido corretamente

    try {
        const response = await fetch(`${API_BASE_URL}/ColumnByBoardId?BoardId=${boardId}`);

        if (!response.ok) {
            if (response.status === 422) {
                const errorData = await response.json(); // Converte a resposta em JSON se o status for 422 (Unprocessable Entity)
                alert(errorData.Errors[0]); // Exibe o primeiro erro da lista de erros recebida
            } else {
                alert("Aconteceu um erro inesperado, tente novamente."); // Exibe um alerta de erro genérico se o status não for 422
                return;
            }
        }

        const listColumns = await response.json(); // Converte a resposta em um array de objetos
        columnsContainer.innerHTML = ''; // Limpa as colunas antes de adicionar novas

        listColumns.forEach(column => {
            const create = document.createElement("div"); // Cria um novo elemento <div> para cada coluna
            create.className = "column"; // Adiciona uma classe para estilização
            create.textContent = column.Name; // Define o texto visível com o nome da coluna
            columnsContainer.appendChild(create); // Adiciona o elemento <div> ao container de colunas
        });
    } catch (error) {
        console.error("Erro ao fazer a requisição:", error); // Loga o erro se a requisição falhar
    } finally {
        console.log("Requisição para carregar colunas finalizada.");
    }
}

// Alternar entre os modos claro e escuro
document.querySelectorAll('input[name="theme"]').forEach((elem) => {
    elem.addEventListener("change", function(event) {
        if (event.target.value === "dark") {
            document.body.classList.add("dark-mode");
            document.querySelector('.header').classList.add("dark-mode");
            document.querySelector('.footer').classList.add("dark-mode");
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove("dark-mode");
            document.querySelector('.header').classList.remove("dark-mode");
            document.querySelector('.footer').classList.remove("dark-mode");
            localStorage.setItem('theme', 'light');
        }
    });
});

// Carregar a preferência do tema do localStorage ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.header').classList.add('dark-mode');
        document.getElementById('dark').checked = true;
    } else {
        document.getElementById('light').checked = true;
    }
});

dropdownButton.addEventListener("click", function(event) {
    event.stopPropagation();
    dropdownMenu.classList.toggle("show");
    if (dropdownMenu.classList.contains("show")) {
        loadBoard();
    }
});
