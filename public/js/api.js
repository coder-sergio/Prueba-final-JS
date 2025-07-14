

export const api = {
  base: 'http://localhost:3000', 
  // Implementa la funcion 
  get: async param => {
    // implemento peticion GET a la API 
    try {
      const response = await fetch(`${api.base}${param}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en la petición GET:', error);
      throw error;
    }
  },
  // Implemento la funcion POST
  post: async (param, data) => {
    // realizo una peticion POST a la API con los datos
    try {
      const response = await fetch(`${api.base}${param}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Error al crear los datos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en la petición POST:', error);
      throw error;
    }
  },
  // Implemento la funcion PUT
  put: async (p, data) => {
    // realizo una peticion PUT a la API con los datos
    try {
      const response = await fetch(`${api.base}${p}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Error al actualizar los datos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en la petición PUT:', error);
      throw error;
    }
  },
  // Implemento la funcion DELETE
  delete: async p => {
    // realizo una peticion DELETE a la API
    try {
      const response = await fetch(`${api.base}${p}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Error al eliminar los datos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en la petición DELETE:', error);
      throw error;
    }
  }
};
