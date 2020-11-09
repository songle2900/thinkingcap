const dataSet = new Array();
dataSet.push([]);

// fetch data
function getData() {
  const xhr = new XMLHttpRequest();
  xhr.open("get", "https://jsonplaceholder.typicode.com/comments", true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        buildListData(JSON.parse(xhr.response));
      } else {
        console.log("xhr failed with code", xhr.status);
      }
    }
  }
}

// setup data structure into 2D array
function buildListData(data) {
  let postId = data[0].postId;
  let i = 0;

  data.forEach((forum) => {
    if (postId !== forum.postId) {
      postId = forum.postId;
      dataSet.push([]);
      i++;
    }
    dataSet[i].push(forum);
  });
  generateList();
}

// creating lists
function generateList() {
  // container
  const listContainer = document.querySelector('.list');

  // create basic set of accordion
  for (let i = 0; i < dataSet.length; i++) {
    const forumContainer = document.createElement('div');
    forumContainer.classList.add('forum-container');
    forumContainer.id = `forum${i}`;
    forumContainer.setAttribute('data-value', i + 1);

    const buttonElement = document.createElement('button');
    buttonElement.setAttribute("type", "button");
    buttonElement.classList.add('btn-accordion');
    buttonElement.textContent = `Forum ${i + 1}`;
    buttonElement.addEventListener('click', (event) => toggleAccordion(event));
    forumContainer.appendChild(buttonElement);
    for (let j = 0; j < dataSet[i].length; j++) {
      const data = dataSet[i][j];

      const listElement = document.createElement('div');
      listElement.classList.add('item');
      listElement.append(createItem(data));
      forumContainer.appendChild(listElement);
    }
    listContainer.appendChild(forumContainer);
  }
}

// creating indivisual items
function createItem(data) {
  const container = document.createElement('div');
  container.classList.add('item-container');

  const id = document.createElement('span');
  id.textContent = data.id;

  const miniHeader = document.createElement('div');
  miniHeader.classList.add('mini-header');
  const name = document.createElement('span');
  name.classList.add('name');
  name.textContent = data.name;

  const email = document.createElement('a');
  email.classList.add('email');
  email.setAttribute('href', `mailTo:${data.email}`)
  email.textContent = data.email;

  miniHeader.appendChild(name);
  miniHeader.appendChild(email);

  const body = document.createElement('span');
  body.classList.add('body');
  body.textContent = data.body;

  container.appendChild(miniHeader);
  container.appendChild(body);
  return container;
}

// onclinc function to toggle group containers
function toggleAccordion(event) {
  const container = event.target.parentNode;
  container.classList.toggle('active');
}

// serach function
function search() {
  // remove previous highlited backgrounds
  removeHightlights();
  const value = document.getElementById('keyword').value;
  const type = document.getElementById('search-type').value;

  // filter out that contains serach value
  const filtered = dataSet.filter((item) => {
    return !!item.find((obj) => obj[type].includes(value));
  });

  // retrive only 1 postId from a group
  const searched = filtered.map((item) => {
    return item[0].postId;
  });

  // start show/unshow result
  document.querySelectorAll('.forum-container').forEach((item) => {
    // remove previous searched result
    item.classList.remove('out-of-search-criteria');

    // transform string to int
    const val = parseInt(item.getAttribute('data-value'), 10);

    // add class name if out of criteria
    if (!searched.includes(val)) {
      item.classList.add('out-of-search-criteria');
    } else {
      item.querySelectorAll(`.${type}`).forEach((field) => {
        let innerHTML = field.innerHTML;
        const index = innerHTML.indexOf(value);
        if (index >= 0) {
          // add hightlight to the value if matches
          innerHTML = innerHTML.substring(0, index) + "<span class='highlight'>" + innerHTML.substring(index, index + value.length) + "</span>" + innerHTML.substring(index + value.length);
          field.innerHTML = innerHTML;
        }
      })
    }
  });
}

// replace hightlited nodes to normal string
function removeHightlights() {
  document.querySelectorAll('.highlight').forEach((item) => {
    const text = document.createTextNode(item.textContent);
    item.parentNode.replaceChild(text, item);
  });

  return new Promise((resolve) => setTimeout(resolve, 100));
}
