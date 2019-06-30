import io from 'socket.io-client';
import {
	MESSAGE_HISTORY,
	MESSAGE_SEND, MESSAGE_SHIFT, NUMBER_LOADED_MESSAGES, NUMBER_SHIFT_MESSAGES, NUMBER_VISIBLE_MESSAGES,
	USER_CONNECTED,
	USER_DISCONNECTED,
	USER_VERIFY
} from "../const";
import {messageNew, userConnected, userExist, userListChange, messagesHistory} from "../actions";

export const createSocketIO = (socketUrl) =>  {
	const socket = io.connect(socketUrl,
		{
			pingInterval: 3000,
			pingTimeout: 10000,
			transports: ['websocket', 'polling']
		});

	let loadingHistory = false;

	return ({getState, dispatch}) => next => action => {

		const setUser = ({user, isUser})=>{
			if(isUser){
				dispatch(userExist());
			} else {
				dispatch(userConnected(user));
				socket.on(USER_CONNECTED, data => {
					dispatch(userListChange(data.connectedUsers))
				});
				socket.on(USER_DISCONNECTED, data => {
					dispatch(userListChange(data.connectedUsers));
				});
				socket.on(MESSAGE_SEND, (message) => {
					dispatch(messageNew(message))
				});
				socket.on(MESSAGE_HISTORY, (messages) => {
					loadingHistory = false;
					dispatch(messagesHistory(messages))
				});
				socket.emit(USER_CONNECTED, {user, historyLimit: NUMBER_VISIBLE_MESSAGES});
			}
		};

		switch (action.type) {
			case USER_VERIFY:
				socket.emit(USER_VERIFY, action.payload.trim(), setUser);
				return false;
			case MESSAGE_SEND:
				socket.emit(MESSAGE_SEND, action.payload);
				return false;
			case MESSAGE_SHIFT:
				if(!loadingHistory && !getState().allLoaded && getState().indexVisibleMessageId < NUMBER_SHIFT_MESSAGES * 5) {
					loadingHistory = true;
					socket.emit(MESSAGE_HISTORY, NUMBER_LOADED_MESSAGES)
				}
				return next(action);
			default: return next(action);
		}
	}
};
