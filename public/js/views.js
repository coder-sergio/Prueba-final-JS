// public/js/views.js
// Este archivo contiene las funciones de renderizado de vistas para la aplicación.

// Importo las dependencias necesarias
import { api } from './api.js'; // Implemento y exporto funciones de API en api.js
import { auth } from './auth.js'; // Implemento y exporto funciones de autenticación en auth.js
import { router } from './router.js'; // Importo el enrutador para redirigir después de acciones

// Creo un mensaje de pagina no encontrada
export function renderNotFound() {
  document.getElementById('app').innerHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Error 404 - Página no encontrada</title>
</head>
<body>
  <h1>Error 404 - Página no encontrada</h1>
  <p>La página que buscas no existe en este sitio web.</p>
  <p>Por favor, revisa la URL o utiliza la barra de búsqueda para encontrar lo que buscas.</p>
  <a href="/">Volver a la página de inicio</a>
</body>
</html>`;
}
// Se crea la vista de login
export async function showLogin() {
  document.getElementById('app').innerHTML = `
    <div class="login-container">
      <form id="form" class="login-form card">
        <h2 style="text-align:center; margin-bottom:1em;">Login</h2>
        <input type="email" id="e" placeholder="email">
        <input type="password" id="p" placeholder="pass">
        <button>Enter</button>
        <br>
        don't have an account? <a href="#/register" data-link>Register</a>
      </form>
    </div>`;
  document.getElementById('form').onsubmit = async e => {
    e.preventDefault();
    try {
      await auth.login(e.target.e.value, e.target.p.value);
      location.hash = '#/dashboard';
      router();
    } catch (err) {
      alert(err.message);
    }
  };
}

export async function showRegister() {
  document.getElementById('app').innerHTML = `
    <button id="back-btn-register"><---</button>
    <div class="login-container ">
      <form id="f" class="login-form card">
        <h2 style="text-align:center; margin-bottom:1em;">Register</h2>
        <input placeholder="name" id="n">
        <input placeholder="email" id="e">
        <input type="password" id="p" placeholder="password">
        <select id="r">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button>Register</button>
      </form>
    </div>`;

  document.getElementById('back-btn-register').onclick = () => {
    location.hash = '#/login';
    router();
  };

  document.getElementById('f').onsubmit = async e => {
    e.preventDefault();
    try {
      const role = e.target.r.value;
    
      await auth.register(e.target.n.value, e.target.e.value, e.target.p.value, role);
      // Redirigir según el rol
      if (role === 'admin') {
        location.hash = '#/dashboard';
      } else {
        location.hash = '#/dashboard';
      }
      router();
    } catch (err) {
      alert(err.message);
    }
  };
}




// creo la vista principal del dashboard
export async function showDashboard() {
  const u = auth.getUser();
  document.getElementById('app').innerHTML = `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2>WELCOME ${u.name} (${u.role})</h2>
        <button id="out"><--</button>
      </div>
      <nav>
        <a href="#/dashboard/events" data-link>SHOW EVENTS</a>
        ${u.role === 'admin' ? `<a href="#/dashboard/events/create" data-link>CREATE EVENTS</a>` : ''}
      </nav>
    </div>`;
  document.getElementById('out').onclick = auth.logout;
  document.querySelectorAll('[data-link]').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      location.hash = a.getAttribute('href');
    };
  });
}

// Implemento la vista de listado de eventos
export async function showevents() {
  function validateeventsEnrollment(events, user) {
    return events.enrolled && events.enrolled.includes(user.email);
  }

  function showuserList(events, eventsID) {
    const selectedEvent = events.find(event => event.id === eventsID);
    if (selectedEvent && selectedEvent.enrolled && selectedEvent.enrolled.length > 0) {
      const userList = selectedEvent.enrolled.map(user => `<li>${user}</li>`).join('');
      document.getElementById('user-list').innerHTML = `
        <h3>Users registered for the event</h3>
        <ul>${userList}</ul>`;
    } else {
      document.getElementById('user-list').innerHTML = `
        <h3>There are no users registered for this event</h3>`;
    }
  }


  function editevents(id){
    location.hash = `#/dashboard/events/edit/${id}`; 
    router();
  }

  const user = auth.getUser();
  const events = await api.get('/events');

  document.getElementById('app').innerHTML = `
    <button id="back-btn-events"><--</button>
    <h2>Available events</h2>
    <ul>${events.map(events => `
      <li>${events.title || 'Sin título'} (${events.capacity || 0} places available) — Instructor: ${events.instructor || 'N/A'}
        ${user.role === 'admin' ? `<button id="edit-btn-events-${events.id}">Edit</button>` : ''}
        ${user.role === 'admin' ? `<button id="show-user-btn-${events.id}">Show users</button>` : ''}
        ${user.role === 'user' && !validateeventsEnrollment(events, user) ? `<button class="enroll-btn" data-id="${events.id}">Register</button>` : ''}
      </li>`).join('')}

      <div id="user-list"></div>
    </ul>`;

// Configurar eventos para botones de "Editar" y "Ver usuarios"
events.forEach(event => {
  if (user.role === 'admin') {
    document.getElementById(`edit-btn-events-${event.id}`).onclick = () => editevents(event.id);
    document.getElementById(`show-user-btn-${event.id}`).onclick = () => {
      showuserList(events, event.id); // Pasar el array completo y el ID del evento actual
    };
  }
});

  document.getElementById('back-btn-events').onclick = () => {
    location.hash = '#/dashboard';
    router();
  };

  if (user.role === 'user') {
    document.querySelectorAll('.enroll-btn').forEach(btn => {
      btn.onclick = async () => {
        const eventsId = btn.dataset.id;

        // Obtener evento actual
        const events = await api.get('/events/' + eventsId);

        // Simular lista de inscritos (opcional)
        if (!events.enrolled) events.enrolled = [];

        // Evitar doble inscripción
        if (events.enrolled.includes(user.email)) {
          alert('You are already registered for this event.');
          return;
        }
        // Verificar capacidad
        if (events.enrolled.length >= events.capacity) {
          alert('This event is already full.');
          return;
        }
        
        events.enrolled.push(user.email);
        events.capacity = events.capacity - 1;

        await api.put('/events/' + eventsId, events);
        alert('Successful registration!');
        showevents(); // recargar lista
      };
    });
  }
}

// Implemento la vista para crear un evento(solo admin)
export function showCreateevents() {
  document.getElementById('app').innerHTML = `
    <button id="back-btn-create"><--</button>
    <h2>Create event</h2>
    <form id="f">
      <input placeholder="Title" id="title">
      <input placeholder="Instructor" id="instructor">
      <input type="number" placeholder="places" id="capacity">
      <button>Save</button>
    </form>`;
  document.getElementById('back-btn-create').onclick = () => {
    location.hash = '#/dashboard';
    router();
  };

  document.getElementById('f').onsubmit = async e => {
    e.preventDefault();
    const data = {
      title: e.target.title.value,
      instructor: e.target.instructor.value,
      capacity: parseInt(e.target.capacity.value)
    };
    await api.post('/events', data);
    location.hash = '#/dashboard/events';
    router();
  };
}

// Implemento la vista para editar un curso (solo admin)
export async function showEditevents() {
  const user = auth.getUser();
  if (user.role !== 'admin') {
    renderNotFound();
    return;
  }

  const eventsId = location.hash.split('/').pop();
  const events = await api.get('/events/' + eventsId);

  if (!events) {
    renderNotFound();
    return;
  }

  document.getElementById('app').innerHTML = `
    <button id="back-btn-edit"><--</button>
    <h2>Edit events</h2>
    <form id="f">
      <input id="title" placeholder="Title" value="${events.title}">
      <input id="instructor" placeholder="Instructor" value="${events.instructor}">
      <input type="number" id="capacity" placeholder="places" value="${events.capacity}">
      <button>Guardar</button>
    </form>`;

    document.getElementById('back-btn-edit').onclick = () => {
      location.hash = '#/dashboard/events';
      router();
    };

  document.getElementById('f').onsubmit = async e => {
    e.preventDefault();
    const updated = {
      title: e.target.title.value,
      instructor: e.target.instructor.value,
      capacity: parseInt(e.target.capacity.value)
    };
    await api.put('/events/' + eventsId, updated);
    location.hash = '#/dashboard/events';
    router();
  };
}


