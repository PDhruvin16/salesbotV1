// API Endpoints configuration

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/user/login/',
    REFRESH_TOKEN: '/user/refresh_token/',
    CHANGE_PASSWORD: '/user/change_password/',
    LOGOUT: '/user/logout/',
  },
  USER: {
    PROFILE: '/user/profile/',
    UPDATE_PROFILE: '/user/profile/update/',
    PERMISSIONS: '/user/permissions/',
  },
  CORE: {
    DISTRIBUTOR: '/core/distributor/',
    COUNTRY: '/core/country/',
    STATE_FETCH_ALL: '/core/state/fetch_all/',
    TERRITORY_FETCH_ALL: '/core/territory/fetch_all/',
    ZONE: '/core/zone/',
    LEAD: '/core/lead/',
  },
  LEADS: {
    LIST: '/leads/',
    CREATE: '/leads/create/',
    UPDATE: '/leads/:id/update/',
    DELETE: '/leads/:id/delete/',
    DETAIL: '/leads/:id/',
  },
  CONTACTS: {
    LIST: '/contacts/',
    CREATE: '/contacts/create/',
    UPDATE: '/contacts/:id/update/',
    DELETE: '/contacts/:id/delete/',
    DETAIL: '/contacts/:id/',
  },
  CONVERSATIONS: {
    LIST: '/conversations/',
    DETAIL: '/conversations/:id/',
    MESSAGES: '/conversations/:id/messages/',
    SEND_MESSAGE: '/conversations/:id/send/',
  },
  PRODUCTS: {
    LIST: '/products/',
    CREATE: '/products/create/',
    UPDATE: '/products/:id/update/',
    DELETE: '/products/:id/delete/',
    DETAIL: '/products/:id/',
  },
  CAMPAIGNS: {
    LIST: '/campaigns/',
    CREATE: '/campaigns/create/',
    UPDATE: '/campaigns/:id/update/',
    DELETE: '/campaigns/:id/delete/',
    DETAIL: '/campaigns/:id/',
  },
} as const;

/**
 * Derived endpoint types for full type safety & autocomplete
 */
export type Endpoints = typeof API_ENDPOINTS;
