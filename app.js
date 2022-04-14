
const taskInput = document.getElementById('new_task');
const deleteAll = document.getElementById('delete_tasks');
const list = document.getElementById('list');
const doneList = document.getElementById('done_list');
const form = document.querySelector('form');

const renderTask = (todo, id) => {

  let place = todo.status ? doneList : list;

  place.insertAdjacentHTML('beforeend', `
  <li ${todo.status ? "class='done'" : ''} >
    <label>${todo.taskName}
      <input type="checkbox" ${todo.status ? 'checked' : ''}>
    </label>
    <button class="js-delete" id="${id}">&#10060;</button>
  </li>
`)}

const watchDeleteSingleTaskBtn = () =>{
  document.querySelectorAll('.js-delete').forEach(el => {
    el.addEventListener('click', (e) => {
      e.target.closest('li').remove()
      delete localStorage[e.target.id]
    })
  })
}

const deleteAllTasksBtn = () => {
  deleteAll.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    list.innerHTML = '';
    doneList.innerHTML = '';
  })
}

const checkEmpty = (place) => {
  if (!place.childElementCount) {
    place.classList.add('empty')
  } else {
    place.classList.remove('empty')
  }
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
  if (taskInput.value.length === 0) return;

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
})

deleteAllTasksBtn();
watchDeleteSingleTaskBtn();
watchStatus();