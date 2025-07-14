

import './api.js'; // Implemento la API en js/api.js
import './auth.js'; // Implemento la autenticacion en js/auth.js
import { router } from './router.js'; // Implemento el enrutador en js/router.js
import './views.js'; // Implementa las vistas en js/views.js

// Inicializo el enrutador al cargar la pagina y al cambiar el hash
window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);
