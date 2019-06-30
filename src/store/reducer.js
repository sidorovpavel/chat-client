import {
	MESSAGE_HISTORY,
	MESSAGE_NEW,
	USER_CONNECTED,
	USER_DISCONNECTED,
	USER_EXIST,
	USER_LIST_CHANGE,
	NUMBER_VISIBLE_MESSAGES,
	MESSAGE_SHIFT, NUMBER_LOADED_MESSAGES, LIVE_MODE_TOGGLE
} from './const'
const initialState = {
	user: null, // Никнейм пользователя чата
	userExist: false, // Флаг ошибки при наличии юзера с таким же ником
	userList: [], // Список участников чата
	messages: [], // Массив всех загруженных сообщений
	visibleMessages: [], // Массив отображаемых сообщений в чате
  allLoaded: false, // Флаг, выгружена ли вся история
	isLiveMode: true, // Флаг, что при появлении новых сообщений они добавятся в visibleMessages
	indexVisibleMessageId: null // Индекс в массиве messages, по которому лежит первое сообщение в visibleMessages
};

const reducer = (state = initialState, action) => {
	const {payload} = action;
	let newVisibleMessage = [...state.visibleMessages];
	let newIndexVisibleMessageId =state.indexVisibleMessageId;
	switch (action.type) {
		case USER_EXIST:
			return  {
				...state, userExist: true
			};
		case USER_CONNECTED:
			return {
				...state,
				user: payload
			};
		case USER_DISCONNECTED:
			return {
				...state,
				user: null
			};
		case USER_LIST_CHANGE:
			return {
				...state,
				userList: payload
			};
		case MESSAGE_NEW:
			const newMessages = [...state.messages, payload];
			if (state.isLiveMode) {
				newVisibleMessage = [...state.visibleMessages, payload].slice(-NUMBER_VISIBLE_MESSAGES);
				newIndexVisibleMessageId = state.indexVisibleMessageId + 1 - newVisibleMessage.length + state.visibleMessages.length;
			}
			return {
				...state,
				messages: newMessages,
				indexVisibleMessageId: newIndexVisibleMessageId,
				visibleMessages: newVisibleMessage,
			};
		case MESSAGE_HISTORY:
			newVisibleMessage = [...payload, ...state.visibleMessages].slice(-NUMBER_VISIBLE_MESSAGES);
			newIndexVisibleMessageId = state.indexVisibleMessageId + payload.length - newVisibleMessage.length + state.visibleMessages.length;
			return {
				...state,
				allLoaded: payload.length < NUMBER_LOADED_MESSAGES,
				messages: [...payload, ...state.messages],
				visibleMessages: newVisibleMessage,
				indexVisibleMessageId: newIndexVisibleMessageId,
			};
		case MESSAGE_SHIFT:
			if (payload > 0){
				newIndexVisibleMessageId = Math.min( state.indexVisibleMessageId + payload, state.messages.length - NUMBER_VISIBLE_MESSAGES);
			} else {
				newIndexVisibleMessageId = Math.max(0, state.indexVisibleMessageId + payload);
			}
			return {
				...state,
				visibleMessages: state.messages.slice(newIndexVisibleMessageId, newIndexVisibleMessageId + NUMBER_VISIBLE_MESSAGES),
				indexVisibleMessageId: newIndexVisibleMessageId,
			};
		case LIVE_MODE_TOGGLE:
			return {
				...state,
				isLiveMode: payload,
			};
		default: return state
	}};

export default reducer;