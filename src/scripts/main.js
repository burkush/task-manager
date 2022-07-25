'use strict';

const taskContainer = document.querySelector('.task-container');
const statusMessage = document.querySelector('.status-message');
const deleteMessage = document.querySelector('.delete-message');
const deleteAllMessage = document.querySelector('.delete-all-message');
const savedMessage = document.querySelector('.saved-message');

const checkAllBtn = document.querySelector('.check-all-btn');
checkAllBtn.addEventListener('click', checkAll);

const uncheckAllBtn = document.querySelector('.uncheck-all-btn');
uncheckAllBtn.addEventListener('click', uncheckAll);

const deleteAllBtn = document.querySelector('.delete-all-btn');
deleteAllBtn.addEventListener('click', openDeleteAllModal);

const selectMore = document.querySelector('.more-options');
selectMore.selectedIndex = 0;
selectMore.addEventListener('click', chooseMoreOptions);

const tagsList = document.querySelector('.tags-list');

const tagInput = tagsList.querySelector('.tag-input');
tagInput.addEventListener('keyup', addTag);

let maxTags = 5;
let tags = [];

document.addEventListener('click', clickOutsideModal);
document.addEventListener('keyup', escapeCloseModal);

// CREATE MODAL

const addTaskModal = document.querySelector('.add-task-modal');
const addTaskInput = document.querySelector('.add-task-input');

const addTaskBtn = document.querySelector('.add-task-btn');
addTaskBtn.addEventListener('click', openCreateModal);

const confirmAddBtn = document.querySelector('.confirm-add-btn');
confirmAddBtn.addEventListener('click', addTask);

const closeCreateBtn = addTaskModal.querySelector('.close-modal');
closeCreateBtn.addEventListener('click', closeCreateModal);

// EDIT MODAL

const editTaskModal = document.querySelector('.edit-task-modal');
const editTaskInput = editTaskModal.querySelector('.edit-task-input');

const editTagsList = document.querySelector('.edit-tags-list');

const editTagInput = editTagsList.querySelector('.edit-tag-input');
editTagInput.addEventListener('keyup', addTag);

const confirmEditBtn = document.querySelector('.confirm-edit-btn');
confirmEditBtn.addEventListener('click', editTask);

const closeEditBtn = editTaskModal.querySelector('.close-modal');
closeEditBtn.addEventListener('click', closeEditModal);

// DELETE ALL MODAL

const deleteAllModal = document.querySelector('.delete-all-modal');

const confirmDeleteBtn = deleteAllModal.querySelector('.confirm-delete-btn');
confirmDeleteBtn.addEventListener('click', deleteAll);

const refuseDeleteBtn = deleteAllModal.querySelector('.refuse-delete-btn');
refuseDeleteBtn.addEventListener('click', closeDeleteAllModal);

const closeDeleteAllBtn = deleteAllModal.querySelector('.close-modal');
closeDeleteAllBtn.addEventListener('click', closeDeleteAllModal);

// ====================================================================================================================

let tasks;

let taskIndex;

function Task(name, tags) {
  this.name = name;
  this.done = false;
  this.tags = tags;
}

function init() {
  if (localStorage.tasks) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    addToDOM();
    insertTags();
    updateStatus();
  } else {
    tasks = [];
  }
}

init();

function addTask() {
  if (addTaskInput.value === '') {
    addTaskInput.classList.add('empty-field');

    addTaskInput.addEventListener('input', () => {
      if (addTaskInput.value !== '') {
        addTaskInput.classList.remove('empty-field');
      }
    });
  } else {
    let currentTags = [];
    const tagElements = tagsList.querySelectorAll('li');
    tagElements.forEach((el) => {
      currentTags.push(el.textContent);
    });

    const task = new Task(addTaskInput.value, currentTags);
    tasks.push(task);
    addToLocalStorage();
    addToDOM();
    insertTags();
    updateStatus();
    closeCreateModal();
  }
}

function insertTags() {
  if (!localStorage.tasks) {
    return;
  }

  const allTasks = taskContainer.querySelectorAll('.task');
  allTasks.forEach((thisTask, i) => {
    const ul = document.createElement('ul');
    ul.classList.add('tags');
    // console.log(tasks[taskIndex].tags);
    tasks[i].tags.forEach((tag, index) => {
      const li = document.createElement('li');
      li.textContent = tag;
      ul.appendChild(li);
    });
    thisTask.insertBefore(ul, thisTask.children[2]);
  });
}

function addToDOM() {
  taskContainer.innerHTML = '';

  tasks.forEach((task, index) => {
    taskContainer.innerHTML += createTaskTemplate(task, index);
  });
}

function createTaskTemplate(task, index) {
  taskIndex = index;

  return `
  <div class="task flex">
    <input type="checkbox" class="check-task" onclick="checkTask(${index})" 
    ${task.done ? 'checked' : ''}>

    <p class="task-text ${task.done ? 'task-checked' : ''}">${task.name}</p>

    <div class="task-actions dropdown" data-dropdown>
      <button type="button" class="btn dropdown-btn" data-dropdown-btn title="More options">
        <i class="fa-solid fa-ellipsis"></i>
      </button>

      <div class="dropdown-options">
        <ul>
          <li>
            <button type="button" class="btn option-btn edit-btn" onclick="openEditModal(${index})">Edit</button>
          </li>
          <li>
            <button type="button" class="btn option-btn delete-btn" onclick="deleteTask(${index})">Delete</button>
          </li>
        </ul>
      </div>
    </div>
  </div>`;
}

function addToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function checkTask(index) {
  tasks[index].done = !tasks[index].done;

  const taskElement = document.querySelectorAll('.task')[index];

  if (tasks[index].done) {
    taskElement.querySelector('.task-text').classList.add('task-checked');
  } else {
    taskElement.querySelector('.task-text').classList.remove('task-checked');
  }

  addToLocalStorage();
  addToDOM();
  updateStatus();
}

function checkAll() {
  tasks.forEach((task) => {
    task.done = true;
  });

  const taskElements = document.querySelectorAll('.task');
  taskElements.forEach((element) => {
    element.querySelector('.task-text').classList.add('task-checked');
  });

  addToLocalStorage();
  addToDOM();
  insertTags();
  updateStatus();
}

function uncheckAll() {
  tasks.forEach((task) => {
    task.done = false;
  });

  const taskElements = document.querySelectorAll('.task');
  taskElements.forEach((element) => {
    element.querySelector('.task-text').classList.remove('task-checked');
  });

  addToLocalStorage();
  addToDOM();
  insertTags();
  updateStatus();
}

function editTask() {
  if (editTaskInput.value === '') {
    editTaskInput.classList.add('empty-field');

    editTaskInput.addEventListener('input', () => {
      if (editTaskInput.value !== '') {
        editTaskInput.classList.remove('empty-field');
      }
    });
  } else {
    tasks[taskIndex].name = editTaskInput.value;

    const tags = editTagsList.querySelectorAll('li');
    const tagsArray = [];
    tags.forEach((tag) => {
      tagsArray.push(tag.textContent);
    });

    tasks[taskIndex].tags = tagsArray;
    addToLocalStorage();
    addToDOM();
    insertTags();
    closeEditModal();

    showSavedMessage();
    setTimeout(hideSavedMessage, 2000);
  }
}

function showSavedMessage() {
  savedMessage.style.display = 'block';
}

function hideSavedMessage() {
  savedMessage.style.display = 'none';
}

function deleteTask(index) {
  tasks.splice(index, 1);

  if (tasks.length === 0) {
    localStorage.removeItem('tasks');
    addToDOM();
    updateStatus();

    showDeleteMessage();
    setTimeout(hideDeleteMessage, 2000);
  } else {
    addToLocalStorage();
    addToDOM();
    updateStatus();

    showDeleteMessage();
    setTimeout(hideDeleteMessage, 2000);
  }
}

function deleteAll() {
  tasks.length = 0;
  localStorage.removeItem('tasks');
  addToLocalStorage();
  addToDOM();
  updateStatus();
  deleteAllModal.style.display = 'none';

  showDeleteAllMessage();
  setTimeout(hideDeleteAllMessage, 2000);
}

function showDeleteMessage() {
  deleteMessage.style.display = 'block';
}

function hideDeleteMessage() {
  deleteMessage.style.display = 'none';
}

function showDeleteAllMessage() {
  deleteAllMessage.style.display = 'block';
}

function hideDeleteAllMessage() {
  deleteAllMessage.style.display = 'none';
}

function updateStatus() {
  const checkedTasks = tasks.filter((task) => task.done);
  const numOfTasks = tasks.length - checkedTasks.length;

  if (numOfTasks === 0) {
    statusMessage.textContent = "You don't have any tasks yet.";
  } else if (numOfTasks === 1) {
    statusMessage.textContent = `You currently have ${numOfTasks} task to do.`;
  } else {
    statusMessage.textContent = `You currently have ${numOfTasks} tasks to do.`;
  }
}

function chooseMoreOptions(e) {
  const tasks = taskContainer.querySelectorAll('.task');

  tasks.forEach((task) => {
    switch (e.target.value) {
      case 'show-all':
        task.style.display = 'flex';
        break;
      case 'show-completed':
        if (
          task.querySelector('.task-text').classList.contains('task-checked')
        ) {
          task.style.display = 'flex';
        } else {
          task.style.display = 'none';
        }
        break;
      case 'show-not-completed':
        if (
          !task.querySelector('.task-text').classList.contains('task-checked')
        ) {
          task.style.display = 'flex';
        } else {
          task.style.display = 'none';
        }
        break;
    }
  });
}

function openCreateModal() {
  addTaskModal.setAttribute('data-create-modal', true);
  addTaskModal.style.display = 'block';
  addTaskInput.classList.remove('empty-field');
  addTaskInput.focus();
  addTaskInput.placeholder = generatePlaceholder();
  tagInput.value = '';
}

function closeCreateModal() {
  addTaskModal.setAttribute('data-create-modal', false);
  addTaskModal.style.display = 'none';
  addTaskInput.value = '';

  if (addTaskInput.classList.contains('empty-field')) {
    addTaskInput.classList.remove('empty-field');
  }
}

function openEditModal(index) {
  taskIndex = index; // needed for editTask()

  editTaskModal.setAttribute('data-edit-modal', true);
  editTaskModal.style.display = 'block';
  editTaskInput.value = tasks[index].name;
  editTagInput.value = '';

  let previous = editTagsList.querySelectorAll('li');
  previous.forEach((elem) => elem.remove());

  const tagsCopy = [...tasks[index].tags]; // needed to reverse an array without affecting the original and show items in the creation order
  tagsCopy.reverse();

  tagsCopy.forEach((tag, i) => {
    const li = document.createElement('li');
    li.textContent = tag;
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-xmark');
    li.appendChild(icon);
    icon.addEventListener('click', removeEditTag);
    editTagsList.prepend(li);
  });

  editTaskInput.classList.remove('empty-field');
  editTaskInput.focus();

  const activeDropdown = document.querySelectorAll('[data-dropdown]')[index];
  activeDropdown.classList.toggle('active-dropdown');
}

function removeEditTag(e) {
  let toRemove = e.target.parentElement;
  toRemove.remove();
}

function closeEditModal() {
  editTaskModal.setAttribute('data-edit-modal', false);
  editTaskModal.style.display = 'none';

  if (editTaskInput.classList.contains('empty-field')) {
    editTaskInput.classList.remove('empty-field');
  }
}

function openDeleteAllModal() {
  deleteAllModal.style.display = 'block';
}

function closeDeleteAllModal() {
  deleteAllModal.style.display = 'none';
}

function clickOutsideModal(e) {
  if (
    e.target === addTaskModal ||
    e.target === editTaskModal ||
    e.target === deleteAllModal
  ) {
    closeAllModals();
  }
}

function escapeCloseModal(e) {
  if (e.keyCode === 27) {
    closeAllModals();
  }
}

function closeAllModals() {
  addTaskModal.style.display = 'none';
  addTaskInput.value = '';

  editTaskModal.style.display = 'none';
  editTaskInput.value = '';

  deleteAllModal.style.display = 'none';

  if (addTaskInput.classList.contains('empty-field')) {
    addTaskInput.classList.remove('empty-field');
  }

  if (editTaskInput.classList.contains('empty-field')) {
    editTaskInput.classList.remove('empty-field');
  }
}

function generatePlaceholder() {
  const placeholders = [
    'Walk the dog',
    'Go for a walk',
    'Go for a run',
    'Visit friends',
    'Clean the room',
    'Learn to play the piano',
    'Sign up for a dance class',
    'Watch a favorite movie',
    'Do school homework',
    'Learn English',
    'Learn Polish',
    'Learn to make websites',
    'Make dinner',
    'Do some gardening',
    'Compose a song',
    'Write a poem',
    'Try something new',
    'Go to the river',
  ];

  let generatedPlaceholder =
    placeholders[Math.floor(Math.random() * placeholders.length)];

  return generatedPlaceholder;
}

// TAGS

function createTag(e, editArray) {
  if (e.target === editTagInput) {
    editTagsList.querySelectorAll('li').forEach((li) => li.remove());
    editArray
      .slice()
      .reverse()
      .forEach((tag) => {
        let liTag = `<li>${tag} <i class="fa-solid fa-xmark" onclick="removeTag(this, '${tag}')"></i></li>`;
        editTagsList.insertAdjacentHTML('afterbegin', liTag);
      });
  } else {
    tagsList.querySelectorAll('li').forEach((li) => li.remove());
    tags
      .slice()
      .reverse()
      .forEach((tag) => {
        let liTag = `<li>${tag} <i class="fa-solid fa-xmark" onclick="removeTag(this, '${tag}')"></i></li>`;
        tagsList.insertAdjacentHTML('afterbegin', liTag);
      });
  }
}

function removeTag(element, tag) {
  let index = tags.indexOf(tag);

  tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
  element.parentElement.remove();
}

function addTag(e) {
  if (e.key === 'Enter') {
    if (e.target === editTagInput) {
      const parent = e.target.parentElement;
      const tags = parent.querySelectorAll('li');
      let tagsArr = [];

      tags.forEach((tag, index) => {
        tagsArr.push(tag.textContent);
      });

      let tag = e.target.value.replace(/\s+/g, ' ');
      if (tag.length > 1 && !tagsArr.includes(tag)) {
        if (tagsArr.length < 5) {
          tag.split(',').forEach((tag) => {
            tagsArr.push(tag);
            createTag(e, tagsArr);
          });
        }
      }
      e.target.value = '';
    } else {
      let tag = e.target.value.replace(/\s+/g, ' ');
      if (tag.length > 1 && !tags.includes(tag)) {
        if (tags.length < 5) {
          tag.split(',').forEach((tag) => {
            tags.push(tag);
            createTag(e);
          });
        }
      }
      e.target.value = '';
    }
  }
}
