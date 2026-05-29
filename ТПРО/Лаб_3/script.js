// Данные экскурсий
const tours = [
  { id: 1, title: "Красная площадь и Кремль", description: "Обзорная экскурсия по Красной площади.", date: "2025-10-20", guide: "Ольга" },
  { id: 2, title: "Третий Рим: Москва старинная", description: "Историческая прогулка по центру.", date: "2025-10-22", guide: "Иван" },
  { id: 3, title: "Современная Москва", description: "Экскурсия по современным районам.", date: "2025-10-25", guide: null }
];

// Записи пользователей
const bookings = []; // {id, userName, tourId, status}

let currentUser = null; // {name, role}

const navList = document.getElementById('nav-list');
const mainContent = document.getElementById('main-content');

// --- Навигация
function renderNav() {
  let html = `
    <li><a href="#" id="link-home">Главная</a></li>
    <li><a href="#" id="link-tours">Каталог экскурсий</a></li>
  `;
  if (currentUser) {
    html += `<li><a href="#" id="link-profile">Личный кабинет</a></li>`;
    if (currentUser.role === 'админ') {
      html += `<li><a href="#" id="link-admin">Админка</a></li>`;
    } else if (currentUser.role === 'гид') {
      html += `<li><a href="#" id="link-guide">Мои экскурсии</a></li>`;
    }
  } else {
    html += `<li><a href="#" id="link-login">Вход</a></li>`;
  }
  navList.innerHTML = html;

  document.getElementById('link-home').onclick = e => { e.preventDefault(); showHome(); };
  document.getElementById('link-tours').onclick = e => { e.preventDefault(); showTours(); };
  if (currentUser) {
    document.getElementById('link-profile').onclick = e => { e.preventDefault(); showProfile(); };
    if (currentUser.role === 'админ') {
      document.getElementById('link-admin').onclick = e => { e.preventDefault(); showAdminPanel(); };
    }
    if (currentUser.role === 'гид') {
      document.getElementById('link-guide').onclick = e => { e.preventDefault(); showGuideTours(); };
    }
  } else {
    document.getElementById('link-login').onclick = e => { e.preventDefault(); showLogin(); };
  }
}

// --- Страницы

function showHome() {
  mainContent.innerHTML = '<h2>Добро пожаловать!</h2><p>Выберите экскурсию и запишитесь на неё.</p>';
}

function showLogin(message = '') {
  mainContent.innerHTML = `
    <h2>Вход</h2>
    <p>${message}</p>
    <form id="login-form">
      <label>Имя: <input type="text" id="username" required></label><br/><br/>
      <label>Роль:
        <select id="role-select">
          <option value="турист">Турист</option>
          <option value="гид">Гид</option>
          <option value="админ">Администратор</option>
        </select>
      </label><br/><br/>
      <button type="submit">Войти</button>
    </form>
  `;
  document.getElementById('login-form').onsubmit = e => {
    e.preventDefault();
    const name = document.getElementById('username').value.trim();
    const role = document.getElementById('role-select').value;
    if (name) {
      currentUser = { name, role };
      alert(`Добро пожаловать, ${name} (${role})`);
      renderNav();
      showHome();
    }
  };
}

function showTours() {
  if (!currentUser) {
    showLogin('Вы должны войти в систему для просмотра экскурсий.');
    return;
  }
  let html = '<h2>Каталог экскурсий</h2><ul>';
  tours.forEach(tour => {
    html += `
      <li><strong>${tour.title}</strong> (${tour.date})<br/>
      ${tour.description}<br/>
      Гид: ${tour.guide || 'не назначен'}<br/>
      <button onclick="bookTour(${tour.id})" ${currentUser.role !== 'турист' ? 'disabled' : ''}>Записаться</button>
      <button onclick="showPaymentForm(${tour.id})" ${currentUser.role !== 'турист' ? 'disabled' : ''}>Оплатить</button></li><br/>
    `;
  });
  html += '</ul>';
  mainContent.innerHTML = html;
}

function bookTour(tourId) {
  if (!currentUser || currentUser.role !== 'турист') {
    alert('Только туристы могут записываться');
    return;
  }
  const existing = bookings.find(b => b.userName === currentUser.name && b.tourId === tourId && b.status === 'Активна');
  if (existing) {
    alert('Вы уже записаны на эту экскурсию.');
    return;
  }
  const tour = tours.find(t => t.id === tourId);
  const bookingId = bookings.length + 1;
  bookings.push({ id: bookingId, userName: currentUser.name, tourId, status: 'Активна' });
  alert(`Вы записались на экскурсию: ${tour.title}`);
  showProfile();
}

function showPaymentForm(tourId) {
  if (!currentUser || currentUser.role !== 'турист') {
    showLogin('Войдите для оплаты');
    return;
  }
  const tour = tours.find(t => t.id === tourId);
  mainContent.innerHTML = `
    <h2>Оплата экскурсии: ${tour.title}</h2>
    <form id="payment-form">
      <label>Сумма: <input type="number" value="1000" disabled></label><br/><br/>
      <label>Номер карты: <input type="text" required></label><br/><br/>
      <button type="submit">Оплатить</button>
    </form>
    <button onclick="showTours()">Назад</button>
  `;
  document.getElementById('payment-form').onsubmit = e => {
    e.preventDefault();
    alert('Оплата прошла успешно!');
    showProfile();
  };
}

function showProfile() {
  if (!currentUser) {
    showLogin();
    return;
  }
  let html = `<h2>Личный кабинет</h2>
    <p>Здравствуйте, ${currentUser.name} (${currentUser.role})</p>`;

  if (currentUser.role === 'турист') {
    const userBookings = bookings.filter(b => b.userName === currentUser.name && b.status === 'Активна');
    if (userBookings.length > 0) {
      html += `<h3>Мои записи</h3><ul>`;
      userBookings.forEach(b => {
        const tour = tours.find(t => t.id === b.tourId);
        html += `<li>${tour.title} (${tour.date}) 
          <button onclick="cancelBooking(${b.id})">Отменить запись</button></li>`;
      });
      html += `</ul>`;
    } else {
      html += '<p>У вас нет активных записей.</p>';
    }
  }

  html += `<button onclick="logout()">Выйти</button>`;
  mainContent.innerHTML = html;
}

function cancelBooking(bookingId) {
  const booking = bookings.find(b => b.id === bookingId && b.userName === currentUser.name);
  if (booking) {
    booking.status = 'Отменена';
    alert('Запись отменена');
    showProfile();
  }
}

function showAdminPanel() {
  if (!currentUser || currentUser.role !== 'админ') {
    alert('Доступ запрещён');
    return;
  }
  let html = `<h2>Администрирование экскурсий</h2>
    <button onclick="showAddTourForm()">Добавить экскурсию</button>
    <h3>Список экскурсий</h3><ul>`;

  tours.forEach(tour => {
    html += `<li><strong>${tour.title}</strong> (${tour.date}) - Гид: ${tour.guide || 'не назначен'}
      <button onclick="showEditTourForm(${tour.id})">Редактировать</button>
      <button onclick="deleteTour(${tour.id})">Удалить</button>
    </li>`;
  });

  html += `<h3>Бронирования</h3><ul>`;
  bookings.forEach(b => {
    const tour = tours.find(t => t.id === b.tourId);
    html += `<li>Пользователь: ${b.userName}, Экскурсия: ${tour.title} (${tour.date}), Статус: ${b.status}</li>`;
  });
  html += `</ul><button onclick="showHome()">Главная</button>`;
  mainContent.innerHTML = html;
}

function showAddTourForm() {
  mainContent.innerHTML = `
    <h2>Добавить экскурсию</h2>
    <form id="add-tour-form">
      <label>Название: <input type="text" id="tour-title" required></label><br/><br/>
      <label>Описание: <textarea id="tour-desc" required></textarea></label><br/><br/>
      <label>Дата: <input type="date" id="tour-date" required></label><br/><br/>
      <label>Гид: <input type="text" id="tour-guide" placeholder="Имя гида"></label><br/><br/>
      <button type="submit">Добавить</button>
      <button type="button" onclick="showAdminPanel()">Отмена</button>
    </form>
  `;
  document.getElementById('add-tour-form').onsubmit = e => {
    e.preventDefault();
    const title = document.getElementById('tour-title').value.trim();
    const desc = document.getElementById('tour-desc').value.trim();
    const date = document.getElementById('tour-date').value;
    const guide = document.getElementById('tour-guide').value.trim();
    const newTour = { id: tours.length + 1, title, description: desc, date, guide: guide || null };
    tours.push(newTour);
    alert('Экскурсия добавлена');
    showAdminPanel();
  };
}

function showEditTourForm(id) {
  const tour = tours.find(t => t.id === id);
  if (!tour) {
    alert('Экскурсия не найдена');
    return;
  }
  mainContent.innerHTML = `
    <h2>Редактировать экскурсию</h2>
    <form id="edit-tour-form">
      <label>Название: <input type="text" id="edit-tour-title" value="${tour.title}" required></label><br/><br/>
      <label>Описание: <textarea id="edit-tour-desc" required>${tour.description}</textarea></label><br/><br/>
      <label>Дата: <input type="date" id="edit-tour-date" value="${tour.date}" required></label><br/><br/>
      <label>Гид: <input type="text" id="edit-tour-guide" value="${tour.guide || ''}"></label><br/><br/>
      <button type="submit">Сохранить</button>
      <button type="button" onclick="showAdminPanel()">Отмена</button>
    </form>
  `;
  document.getElementById('edit-tour-form').onsubmit = e => {
    e.preventDefault();
    tour.title = document.getElementById('edit-tour-title').value.trim();
    tour.description = document.getElementById('edit-tour-desc').value.trim();
    tour.date = document.getElementById('edit-tour-date').value;
    tour.guide = document.getElementById('edit-tour-guide').value.trim() || null;
    alert('Экскурсия обновлена');
    showAdminPanel();
  };
}

function deleteTour(id) {
  if (!confirm('Удалить эту экскурсию?')) return;
  const index = tours.findIndex(t => t.id === id);
  if (index >= 0) {
    tours.splice(index, 1);
    // Также удалить связанные бронирования
    for (let i = bookings.length - 1; i >= 0; i--) {
      if (bookings[i].tourId === id) bookings.splice(i, 1);
    }
    alert('Экскурсия удалена');
    showAdminPanel();
  }
}

function showGuideTours() {
  if (!currentUser || currentUser.role !== 'гид') {
    alert('Доступ запрещён');
    return;
  }
  const myTours = tours.filter(t => t.guide === currentUser.name);
  if (myTours.length === 0) {
    mainContent.innerHTML = '<h2>Мои экскурсии</h2><p>Нет назначенных экскурсий.</p>';
    return;
  }
  let html = '<h2>Мои экскурсии и участники</h2><ul>';
  myTours.forEach(t => {
    html += `<li><strong>${t.title}</strong> (${t.date})<br/>Участники:<ul>`;
    const participants = bookings.filter(b => b.tourId === t.id && b.status === 'Активна');
    if (participants.length === 0) {
      html += '<li>Нет записавшихся</li>';
    } else {
      participants.forEach(p => {
        html += `<li>${p.userName}</li>`;
      });
    }
    html += '</ul></li><br/>';
  });
  html += '</ul>';
  mainContent.innerHTML = html;
}

function logout() {
  currentUser = null;
  renderNav();
  showHome();
}

// Инициализация
renderNav();
showHome();
