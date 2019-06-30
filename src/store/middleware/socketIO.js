import io from 'socket.io-client';
import {
	MESSAGE_HISTORY,
	MESSAGE_SEND, MESSAGE_SHIFT, NUMBER_LOADED_MESSAGES, NUMBER_SHIFT_MESSAGES,
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
					dispatch(messagesHistory(messages))
				})
				socket.emit(USER_CONNECTED, {user, historyLimit: NUMBER_LOADED_MESSAGES});
			}
		};

		switch (action.type) {
			case USER_VERIFY:
				socket.emit(USER_VERIFY, action.payload, setUser);
				return false;
			case MESSAGE_SEND:
				socket.emit(MESSAGE_SEND, action.payload);
				return false;
			case MESSAGE_SHIFT:
				if(!getState().allLoaded && getState().indexVisibleMessageId < NUMBER_SHIFT_MESSAGES * 3) {
					socket.emit(MESSAGE_HISTORY, {})
				}
				return next(action);
			default: return next(action);
		}
	}
};
