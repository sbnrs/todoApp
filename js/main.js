// Находим элементы
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

// Получаем данные из localStorage и отрисовываем
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => renderTask(task));
}

// Проверяем есть ли элементы в списке
checkEmptyList();

// Добавляем прослушку на форму
form.addEventListener( 'submit', addTask );

// Удаление задачи
tasksList.addEventListener( 'click', deleteTask );

// Задача выполнена
tasksList.addEventListener( 'click', doneTask );

// Функции
function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value;

    // Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    // Добавим задачу в массив с задачами
    tasks.push(newTask);

    renderTask(newTask);

    // Очистка поля ввода и возврат фокуса
    taskInput.value = '';
    taskInput.focus();

    // Проверяем есть ли элементы в списке
    checkEmptyList();

    // Сохраняем изменения в массиве с задачами в localStorage
    saveToLocalStorage();
}

function deleteTask(e) {
    if (e.target.dataset.action !== 'delete') return;

    const parentNode = e.target.closest('li');

    // Определяем id задачи
    const id = +parentNode.id;

    // Удаляем задачу через фильтрацию массива
    tasks = tasks.filter( (task) => task.id !== id ); 

    parentNode.remove();

    // Проверяем есть ли элементы в списке
    checkEmptyList();

    // Сохраняем изменения в массиве с задачами в localStorage
    saveToLocalStorage();
}

function doneTask(e) {
    if (e.target.dataset.action !== 'done') return;

    const parentNode = e.target.closest('li');

    // Определяем id задачи, находим её в массиве tasks и меняем значение done на противоположное
    const id = +parentNode.id;
    const task = tasks.find( (task) => task.id === id );
    task.done = !task.done;

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');

    // Сохраняем изменения в массиве с задачами в localStorage
    saveToLocalStorage();
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListElement = `
                            <li id="emptyList" class="list-group-item empty-list">
                                <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                <div class="empty-list__title">Список дел пуст</div>
                            </li>`;

        tasksList.insertAdjacentHTML('beforeend', emptyListElement);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    // Формируем класс css
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    // Формируем разметку для новой задачи
    const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                    <span class="${cssClass}">${task.text}</span>
                    <div class="task-item__buttons">
                        <button type="button" data-action="done" class="btn-action">
                            <img src="./img/tick.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/cross.svg" alt="Done" width="18" height="18">
                        </button>
                    </div>
                </li>`;

    // Добавляем задачу на страницу
    tasksList.insertAdjacentHTML( 'beforeend', taskHTML );
}