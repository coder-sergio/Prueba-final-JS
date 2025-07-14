

// Importa los modulos necesarios
import { auth } from './auth.js';
import {
  showLogin, // Implementa en views.js
  showRegister, // Implementa en views.js
  showDashboard, // Implementa en views.js
  showevents, // Implementa en views.js
  showCreateevents, // Implementa en views.js
  showEditevents, // Implementa en views.js
  renderNotFound // Implementa en views.js
} from './views.js';
// import { api } from './api.js'; // Asegurate de tener un modulo api.js para manejar las peticiones----
// Define aquí las rutas de tu SPA
const routes = {
  '#/login': showLogin, // Vista de login
  '#/register': showRegister, // Vista de registro
  '#/dashboard': showDashboard, // Vista principal tras login
  '#/dashboard/events': showevents, // Listado de cursos del estudiante y el admin
  '#/dashboard/events/create': showCreateevents, // Formulario para crear curso

};

// 
// Funcion principal de enrutamiento
export function router() {
  const path = location.hash || '#/login';
  const user = auth.getUser();

  // protejo rutas de dashboard
  if (path.startsWith('#/dashboard') && !auth.isAuthenticated()) {
    location.hash = '#/login';
    return;
  }

  // eviyo que usuarios logueados accedan a login/register
  if ((path === '#/login' || path === '#/register') && auth.isAuthenticated()) {
    location.hash = '#/dashboard';
    return;
  }

  // ruta dinamica para editar curso
  if (path.startsWith('#/dashboard/events/edit/')) {
    showEditevents(); // Implemento esta funcion en views.js
    return;
  }

  // Cargo la vista correspondiente
  const view = routes[path];

  

  if (view) {
    view();
  } else {
    renderNotFound(); // Implemento la funcion en views.js
  }
}
