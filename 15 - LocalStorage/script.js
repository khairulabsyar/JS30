document.addEventListener('DOMContentLoaded', () => {
  const addItems = document.querySelector('.add-items');
  const itemsList = document.querySelector('.plates');
  const checkButton = document.getElementById('check');
  const deleteButton = document.getElementById('delete');
  const additional = document.querySelector('.additional');

  const updateCheckButtonText = () => {
    checkButton.textContent = items.every((item) => item.status) ? 'Uncheck All' : 'Check All';
  };

  let items = JSON.parse(localStorage.getItem('localTapas')) || [];

  const updateLocalStorage = () => {
    localStorage.setItem('localTapas', JSON.stringify(items));
  };

  const createList = () => {
    itemsList.innerHTML = items
      .map(
        (item, index) => `
      <li>
        <input type="checkbox" id="item${index}" data-index="${index}" ${item.status ? 'checked' : ''}>
        <label for="item${index}">${item.item}</label>
      </li>
    `,
      )
      .join('');

    additional.style.display = items.length > 0 ? 'flex' : 'none';
  };

  addItems.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = e.target.item.value.trim();
    if (text) {
      items.push({ item: text, status: false });
      updateLocalStorage();
      createList();
      updateCheckButtonText();
      e.target.reset();
    }
  });

  itemsList.addEventListener('click', (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
      const index = e.target.dataset.index;
      items[index].status = !items[index].status;
      updateLocalStorage();
      updateCheckButtonText();
    }
  });

  checkButton.addEventListener('click', () => {
    const shouldBeChecked = checkButton.textContent === 'Check All';
    items.forEach((item) => (item.status = shouldBeChecked));
    updateLocalStorage();
    createList();
    updateCheckButtonText();
  });

  deleteButton.addEventListener('click', () => {
    items = [];
    updateLocalStorage();
    createList();
    additional.style.display = 'none';
  });

  createList();
  updateCheckButtonText();
});
