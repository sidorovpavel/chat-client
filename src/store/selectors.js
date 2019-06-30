export const getIsReachedEnd = (state) => (
	state.messages.length > 0 && state.visibleMessages.length > 0 ?
		state.messages[state.messages.length - 1].id === state.visibleMessages[state.visibleMessages.length - 1].id :
		false
);
export const getIsReachedBegin = (state) => (state.allLoaded && (state.indexVisibleMessageId === 0));