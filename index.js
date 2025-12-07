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

// Функция для загрузки задач
function loadTasks() {
    // Проверяем, есть ли сохраненные задачи в localStorage
    const savedTasks = localStorage.getItem('todoItems');
    
    if (savedTasks) {
        // Если есть - возвращаем их, преобразовав из JSON
        return JSON.parse(savedTasks);
    } else {
        // Если нет - возвращаем начальный список
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
    
    // Устанавливаем текст задачи
    textElement.textContent = item;
    
    // Добавляем обработчики событий для кнопок
    deleteButton.addEventListener('click', () => {
        // Удаляем текущий элемент задачи
        clone.remove();
        
        // Получаем актуальный список задач из DOM
        const items = getTasksFromDOM();
        
        // Сохраняем обновленный список в localStorage
        saveTasks(items);
    });
    
    duplicateButton.addEventListener('click', () => {
        // Получаем текст текущей задачи
        const itemName = textElement.textContent;
        
        // Создаем копию задачи
        const newItem = createItem(itemName);
        
        // Добавляем копию в начало списка
        listElement.prepend(newItem);
        
        // Получаем актуальный список задач из DOM
        const items = getTasksFromDOM();
        
        // Сохраняем обновленный список в localStorage
        saveTasks(items);
    });
    
    // Обработчик для кнопки редактирования
    editButton.addEventListener('click', () => {
        // Включаем редактирование текста
        textElement.setAttribute('contenteditable', 'true');
        
        // Устанавливаем фокус на редактируемый элемент
        textElement.focus();
        
        // Выделяем весь текст для удобства редактирования
        const range = document.createRange();
        range.selectNodeContents(textElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    });
    
    // Обработчик для потери фокуса при редактировании
    textElement.addEventListener('blur', () => {
        // Отключаем редактирование текста
        textElement.setAttribute('contenteditable', 'false');
        
        // Обрезаем лишние пробелы
        const newText = textElement.textContent.trim();
        
        // Если текст не пустой, обновляем его
        if (newText) {
            textElement.textContent = newText;
        }
        
        // Получаем актуальный список задач из DOM
        const items = getTasksFromDOM();
        
        // Сохраняем обновленный список в localStorage
        saveTasks(items);
    });
    
    // Обработчик для сохранения при нажатии Enter
    textElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && textElement.getAttribute('contenteditable') === 'true') {
            event.preventDefault(); // Предотвращаем перенос строки
            
            // Снимаем фокус, что вызовет событие blur
            textElement.blur();
        }
    });
    
    return clone;
}

// Функция для получения задач из DOM
function getTasksFromDOM() {
    // Находим все элементы с текстом задач
    const itemsNamesElements = listElement.querySelectorAll('.to-do__item-text');
    
    // Создаем пустой массив для хранения задач
    const tasks = [];
    
    // Проходим по всем элементам и собираем тексты задач
    itemsNamesElements.forEach(element => {
        tasks.push(element.textContent);
    });
    
    return tasks;
}

// Функция для сохранения задач в localStorage
function saveTasks(tasks) {
    // Преобразуем массив в строку JSON и сохраняем
    localStorage.setItem('todoItems', JSON.stringify(tasks));
}

// Функция для отображения всех задач
function renderTasks() {
    // Очищаем список перед рендерингом
    listElement.innerHTML = '';
    
    // Загружаем актуальные задачи
    items = loadTasks();
    
    // Добавляем каждую задачу в список
    items.forEach(item => {
        const taskElement = createItem(item);
        listElement.append(taskElement);
    });
}

// Обработчик отправки формы
function handleFormSubmit(event) {
    event.preventDefault(); // Отключаем перезагрузку страницы
    
    const taskText = inputElement.value.trim(); // Получаем текст задачи из поля ввода
    
    if (taskText) {
        // Создаем новый элемент задачи
        const newTaskElement = createItem(taskText);
        
        // Добавляем задачу в начало списка
        listElement.prepend(newTaskElement);
        
        // Получаем актуальный список задач из DOM
        items = getTasksFromDOM();
        
        // Сохраняем обновленный список в localStorage
        saveTasks(items);
        
        // Очищаем поле ввода
        inputElement.value = '';
    }
}

// Инициализация при загрузке страницы
function init() {
    // Загружаем задачи из localStorage или начальный список
    items = loadTasks();
    
    // Рендерим задачи
    renderTasks();
    
    // Устанавливаем слушатель события на форму
    formElement.addEventListener('submit', handleFormSubmit);
}

// Запускаем инициализацию при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}