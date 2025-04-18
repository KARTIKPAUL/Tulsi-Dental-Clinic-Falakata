// src/services/getCookie.js
export function getCookie(name) {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='));
    return cookieValue ? cookieValue.split('=')[1] : null;
  }
  