export const BASE_PATH = import.meta.env.BASE_URL === '/'
  ? ''
  : import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBasePath = (path = '') => `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, '')}`;

export const currentAppPath = () => {
  const pathname = window.location.pathname;
  if (!BASE_PATH || !pathname.startsWith(BASE_PATH)) return pathname;
  return pathname.slice(BASE_PATH.length) || '/';
};
