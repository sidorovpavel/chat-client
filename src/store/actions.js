import {
	LIVE_MODE_TOGGLE,
	MESSAGE_HISTORY,
	MESSAGE_NEW,
	MESSAGE_SEND, MESSAGE_SHIFT,
	USER_CONNECTED,
	USER_DISCONNECTED,
	USER_EXIST,
	USER_LIST_CHANGE,
	USER_VERIFY
} from "./const";
import {createAction} from "redux-starter-kit";

export const userSet = createAction(USER_VERIFY);
export const userExist = createAction(USER_EXIST);
export const userConnected = createAction(USER_CONNECTED);
export const userDisconnected = createAction(USER_DISCONNECTED);
export const userListChange = createAction(USER_LIST_CHANGE);
export const messageNew = createAction(MESSAGE_NEW);
export const messageSend = createAction(MESSAGE_SEND);
export const messagesHistory = createAction(MESSAGE_HISTORY);
export const messageShift = createAction(MESSAGE_SHIFT);
export const liveModeToggle = createAction(LIVE_MODE_TOGGLE);
