
const taskInput = document.getElementById('new_task');
const deleteAll = document.getElementById('delete_tasks');
const list = document.getElementById('list');
const doneList = document.getElementById('done_list');
const form = document.querySelector('form');
const dialog = document.querySelector('dialog');
const closeDialogBtn = document.querySelector('.js-close-dialog');

closeDialogBtn.addEventListener('click', () => {
  dialog.close()
})

const renderTask = (todo, id) => {

  let place = todo.status ? doneList : list;

  place.insertAdjacentHTML('beforeend', `
  <li ${todo.status ? "class='done'" : ''} >
    <label>${todo.taskName}
      <input type="checkbox" ${todo.status ? 'checked' : ''}>
    </label>
    <button class="js-delete" id="${id}"><span>❌</span></button>
  </li>
`)}

const checkEmpty = (place) => {
  if (!place.childElementCount) {
    place.classList.add('empty')
  } else {
    place.classList.remove('empty')
  }
}

const checkAllEmpty = () => {
  let main = document.querySelector('main');
  if(!list.childElementCount && !doneList.childElementCount) {
    main.classList.add('empty')
  } else {
    main.classList.remove('empty')
  }
}

const watchDeleteSingleTaskBtn = () =>{
  document.querySelectorAll('.js-delete').forEach(el => {
    el.addEventListener('click', (e) => {
      e.target.closest('li').remove()
      delete localStorage[e.target.id]

      checkEmpty(list);
      checkEmpty(doneList);
      checkAllEmpty()
    })
  })
}

const deleteAllTasksBtn = () => {
  deleteAll.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    list.innerHTML = '';
    doneList.innerHTML = '';

    checkEmpty(list);
    checkEmpty(doneList);
    checkAllEmpty()
  })
}

const watchStatus = () => {
  document.querySelectorAll('[type="checkbox"]').forEach(input => {
    input.addEventListener('click', () => {
  
      let parent = input.closest('li');
      let key = parent.querySelector('button').id;
      let keyData = JSON.parse(localStorage.getItem(key))

      if(input.checked) {
        parent.classList.add('done')
        keyData.status = !keyData.status
        localStorage.setItem(key, JSON.stringify(keyData))
        doneList.append(parent)
      } else {
        parent.classList.remove('done')
        keyData.status = !keyData.status
        localStorage.setItem(key, JSON.stringify(keyData))
        list.append(parent)
      }

      checkEmpty(list);
      checkEmpty(doneList);
      checkAllEmpty()
    })
  })
}


if (!localStorage.getItem('taskIndex')) {
  localStorage.setItem('taskIndex', 0);
}

let keys = Object.keys(localStorage);
let sortedArray = [];

keys.forEach(key => {
  if (key == 'taskIndex') return;
  sortedArray.push(key)
})

sortedArray.sort().forEach(task => {
  renderTask(JSON.parse(localStorage.getItem(task)), task)
})


form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (taskInput.value.length === 0) {
    dialog.showModal()
    return
  };

  let currentIndex = +localStorage.getItem('taskIndex');
  localStorage.setItem( currentIndex, 
    JSON.stringify({
      taskName: taskInput.value,
      status: false
    })
  )
  localStorage.setItem('taskIndex', currentIndex + 1);

  renderTask(JSON.parse(localStorage.getItem(currentIndex)), currentIndex)

  taskInput.value = '';

  watchDeleteSingleTaskBtn();
  watchStatus();
  checkEmpty(list);
  checkEmpty(doneList);
  checkAllEmpty()
})

deleteAllTasksBtn();
watchDeleteSingleTaskBtn();
watchStatus();
checkAllEmpty()