import { API_BASE_URL } from "./apiConfig.js";
import { saveLocalStorage, getLocalStorage } from "./global.js";

const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");
const columnsContainer = document.getElementById("columnsContainer"); // Verifique se isso está definido corretamente
columnsContainer.innerHTML = '';
// const taskContainer = document.getElementById("taskContainer-${column.Id}");

// Função para fechar o dropdown ao clicar fora dele 
window.addEventListener('click', function(event) { 
    if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) { 
        dropdownMenu.classList.remove('show'); 
    } 
});
dropdownButton.addEventListener("click", function(event) {
    event.stopPropagation();
    dropdownMenu.classList.toggle("show");
    if (dropdownMenu.classList.contains("show")) {
        loadBoard();
    }
});

async function loadBoard() {

    dropdownMenu.innerHTML = '';
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
        console.error("Aconteceu um erro inesperado, tente novamente.boards", error);
    }
}

async function loadColumns(boardId) {
    const columnsContainer = document.getElementById("columnsContainer"); // Verifique se isso está definido corretamente
    try {
        const response = await fetch(`${API_BASE_URL}/ColumnByBoardId?BoardId=${boardId}`);

        if (!response.ok) {
            if (response.status === 422) {
                const errorData = await response.json(); // Converte a resposta em JSON se o status for 422 (Unprocessable Entity)
                console.error(errorData.Errors[0]);
            } else {
                console.error("Aconteceu um erro inesperado, tente novamente.");
                return;
            }
        }

        const listColumns = await response.json(); // Converte a resposta em um array de objetos
        columnsContainer.innerHTML = ''; // Limpa as colunas antes de adicionar novas

        listColumns.forEach(column => {
            const create = document.createElement("div"); // Cria um novo elemento <div> para cada coluna
            // create.className = "column"; // Adiciona uma classe para estilização
            // create.textContent = column.Name; // Define o texto visível com o nome da coluna
            create.innerHTML = `
                <div class="column">${column.Name}</h3>
                <div class="taskContainer" id="taskContainer-${column.Id}"></div>`;
            
            columnsContainer.appendChild(create);
            loadTasks(column.Id);
            // columnsContainer.innerHTML = '';
            // console.log("coluna criada");
        });


        // document.addEventListener('DOMContentLoaded', function(columnId) {
        //     loadTasks(column.Id);
        //     console.log("puxar task");
        // })
    } catch (error) {
        console.error("Erro ao fazer a requisição:colunas", error); // Loga o erro se a requisição falhar
    } finally {
        console.log("Requisição para carregar colunas finalizada.");
    }
    document.addEventListener('DOMContentLoaded', function(columnId) {
        loadTasks(column.Id);
        console.log("puxar task");
    })
}




async function loadTasks(columnId) {
    console.log("carregando task");
    const taskContainer = document.getElementById(`taskContainer-${columnId}`);
    console.log("task container encontrado");

    if (!taskContainer){
        console.error("taskContainer nao encontrado");
        return;
    }
    
    try{
        const response = await fetch(`${API_BASE_URL}/TasksByColumnId?ColumnId=${columnId}`);
        console.log("task carregada da url")
        if (!response.ok) {
            if (response.status === 422) {
                const errorData = await response.json(); // Converte a resposta em JSON se o status for 422 (Unprocessable Entity)
                console.error(errorData.Errors[0]);
            } else {
                console.error("Aconteceu um erro inesperado, tente novamente.");
                return;
            }
        }
        
        const listTask = await response.json(); // Converte a resposta em um array de objetos
        // taskContainer.innerHTML = '';

        listTask.forEach(task => {
            const create = document.createElement("div"); // Cria um novo elemento <div> para cada coluna
            create.className = "task"; // Adiciona uma classe para estilização
            // create.textContent = task.Name; // Define o texto visível com o nome da coluna
            create.innerHTML = `
                <p><strong>${task.Title}</strong></p>
                <p>${task.Description}</p>`;
            taskContainer.appendChild(create); // Adiciona o elemento <div> ao container de colunas
        })
    } catch (error) {
        console.error("Erro ao fazer a requisição: tarefa", error); // Loga o erro se a requisição falhar
    } finally {
        console.log("Requisição para carregar tarefas finalizada.");
    }

};
// Alternar entre os modos claro e escuro
// document.querySelectorAll('input[name="theme"]').forEach((elem) => {
//     elem.addEventListener("change", function(event) {
//         if (event.target.value === "dark") {
//             document.body.classList.add("dark-mode");
//             document.querySelector('.header').classList.add("dark-mode");
//             document.querySelector('.footer').classList.add("dark-mode");
//             localStorage.setItem('theme', 'dark');
//         } else {
//             document.body.classList.remove("dark-mode");
//             document.querySelector('.header').classList.remove("dark-mode");
//             document.querySelector('.footer').classList.remove("dark-mode");
//             localStorage.setItem('theme', 'light');
//         }
//     });
// });

// Carregar a preferência do tema do localStorage ao carregar a página
// document.addEventListener('DOMContentLoaded', function() {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme && savedTheme === 'dark') {
//         document.body.classList.add('dark-mode');
//         document.querySelector('.header').classList.add('dark-mode');
//         document.querySelector('.columns').classList.add('dark-mode');
//         document.querySelector('.dropdown-button').classList.add('dark-mode');
//         document.getElementById('dark').checked = true;
//     } else {
//         document.getElementById('light').checked = true;
//     }
// });


