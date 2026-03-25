import { EventEmitter } from 'events';

const AuthEvents = new EventEmitter();

export const AUTH_LOGOUT_EVENT = 'auth:logout';

export default AuthEvents;
