// Implemento aquí la logica de autenticación.
// Puedes usar localStorage para guardar el usuario logueado.
// Usa la API (api.js) para consultar y registrar usuarios.

import { api } from './api.js'; // exporta funciones de API en api.js

export const auth = {
  // Implementa la funcion de login
  login: async (email, pass) => {
    // Si la contraseña coincide, guarda el usuario en localStorage
    // Lanza un error si las credenciales no son validas
    const users = await api.get(`/users?email=${email}`);
    if (users.length === 0 || users[0].password !== pass) {
      throw new Error('Credenciales inválidas');
    }
    const user = users[0];
    localStorage.setItem('user', JSON.stringify(user)); // Guarda el usuario en localStorage
  },

  register: async (name, email, pass, role = 'user') => {
    const existingUser = await api.get(`/users?email=${email}`);
    if (existingUser.length > 0) {
      throw new Error('El email ya está registrado');
    }
  
    const newUser = { 
      name, 
      email, 
      password: pass,
      role // Puede ser 'user' o 'admin'
    };
  
    await api.post('/users', newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  },



  // Implementa la funcion de logout
  logout: () => {
    localStorage.removeItem('user');
    location.hash = '#/login'; // Redirige a login despues de cerrar sesion
    router(); // Actualiza la vista
  },
  // Devuelve true si hay usuario autenticado
  isAuthenticated: () => {
    // TODO: Devuelve true si hay usuario en localStorage
    return !!localStorage.getItem('user'); // Devuelve true si hay un usuario guardado
  },
  // Devuelve el usuario autenticado
  getUser: () => {
    // TODO: Devuelve el usuario guardado en localStorage (o null)
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null; // Devuelve el usuario parseado o null si no existe
  }
};


//--------------------------------------
