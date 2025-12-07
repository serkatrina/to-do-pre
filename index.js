let items = [
    "Сделать проектную работу",
    "Полить цветы",
    "Пройти туториал по Реакту",
    "Сделать фронт для своего проекта",
    "Прогуляться по улице в солнечный день",
    "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
    const savedTasks = localStorage.getItem('todoItems');
    
    if (savedTasks) {
        return JSON.parse(savedTasks);
    } else {
        return items;
    }
}

function createItem(item) {
    const template = document.getElementById("to-do__item-template");
    const clone = template.content.querySelector(".to-do__item").cloneNode(true);
    const textElement = clone.querySelector(".to-do__item-text");
    const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
    const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
    const editButton = clone.querySelector(".to-do__item-button_type_edit");
    
    textElement.textContent = item;
    
    deleteButton.addEventListener('click', () => {
        clone.remove();
        
        const items = getTasksFromDOM();
        saveTasks(items);
    });
    
    duplicateButton.addEventListener('click', () => {
        const itemName = textElement.textContent;
        const newItem = createItem(itemName);
        
        listElement.prepend(newItem);
        
        const items = getTasksFromDOM();
        saveTasks(items);
    });
    
    editButton.addEventListener('click', () => {
        textElement.setAttribute('contenteditable', 'true');
        textElement.focus();
        
        const range = document.createRange();
        range.selectNodeContents(textElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    });
    
    textElement.addEventListener('blur', () => {
        textElement.setAttribute('contenteditable', 'false');
        
        const newText = textElement.textContent.trim();
        
        if (newText) {
            textElement.textContent = newText;
        }
        
        const items = getTasksFromDOM();
        saveTasks(items);
    });
    
    textElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && textElement.getAttribute('contenteditable') === 'true') {
            event.preventDefault();
            textElement.blur();
        }
    });
    
    return clone;
}

function getTasksFromDOM() {
    const itemsNamesElements = listElement.querySelectorAll('.to-do__item-text');
    const tasks = [];
    
    itemsNamesElements.forEach(element => {
        tasks.push(element.textContent);
    });
    
    return tasks;
}

function saveTasks(tasks) {
    localStorage.setItem('todoItems', JSON.stringify(tasks));
}

function renderTasks() {
    listElement.innerHTML = '';
    
    items = loadTasks();
    
    items.forEach(item => {
        const taskElement = createItem(item);
        listElement.append(taskElement);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const taskText = inputElement.value.trim();
    
    if (taskText) {
        const newTaskElement = createItem(taskText);
        listElement.prepend(newTaskElement);
        
        items = getTasksFromDOM();
        saveTasks(items);
        
        inputElement.value = '';
    }
}

function init() {
    items = loadTasks();
    renderTasks();
    formElement.addEventListener('submit', handleFormSubmit);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}