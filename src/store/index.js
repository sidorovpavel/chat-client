import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import {createSocketIO} from "./middleware/socketIO";
import thunk from "redux-thunk";
import reducer from './reducer'

const socketUrl = 'https://chat-server-pavel.herokuapp.com';
const socketIO = createSocketIO(socketUrl);
const middleware = [...getDefaultMiddleware(), thunk, socketIO];

export const store = configureStore({
	reducer,
	middleware,
	devTools: process.env.NODE_ENV !== 'production',
});