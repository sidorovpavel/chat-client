import React, {Component} from 'react';
import {connect} from "react-redux";
import './ChatRoom.css'
import {liveModeToggle, messageSend, messageShift} from "../../store/actions";
import {Message} from "../../components/Message";
import {NUMBER_SHIFT_MESSAGES} from "../../store/const";
import {getIsReachedBegin, getIsReachedEnd} from "../../store/selectors";

const SHIFT_OFFSET_PERCENT = 15;

class ChatRoom extends Component {
	constructor(props) {
		super(props);
		this.textInput = React.createRef();
		this.wrapper = React.createRef();
		this.handleScroll = this.handleScroll.bind(this);
		this.isShifting = false;
	};

	handleSubmit = (e) => {
		const {user, messageSend, } = this.props;
		const {value: text} = this.textInput.current;
		e.preventDefault();
		if (text !== '') {
			messageSend(user, text);
			this.textInput.current.value = '';
		}
	};


	handleScroll = (e) => {
		const {scrollTop, scrollHeight, clientHeight } = e.currentTarget;
		const shiftOffset =  Math.round(scrollHeight * SHIFT_OFFSET_PERCENT / 100);
		if (this.prevScrollTop === scrollTop) {
			return;
		}
		const {bottom: wrapperBottom} = this.wrapper.current.getBoundingClientRect();
		const {bottom: lastMessageBottom} = this.wrapper.current.firstChild.lastChild.getBoundingClientRect();
		const visibleLast = lastMessageBottom <= wrapperBottom;
		// Если прокрутка вверх
		if (this.prevScrollTop > scrollTop) {

			if (this.props.isLiveMode && !visibleLast) {
				this.props.liveModeToggle(false);
			}
			if ((scrollTop < shiftOffset) && !this.isShifting  && !this.props.reachedBegin) {
				this.isShifting = true;
				this.props.messageShift(-NUMBER_SHIFT_MESSAGES);
			}
		}

		// Если прокрутка вниз
		if (this.prevScrollTop < scrollTop) {
			if (!this.props.isLiveMode && visibleLast) {
				this.props.liveModeToggle(true);
			}
			if ((scrollHeight - clientHeight - scrollTop < shiftOffset) && !this.isShifting) {
				this.isShifting = true;
				this.props.messageShift(NUMBER_SHIFT_MESSAGES);
			}
		}

		this.prevScrollTop = scrollTop;
	};


	getMessageId = (id) => ('message'+id);

	componentDidMount() {
		this.wrapper.current.addEventListener('scroll', this.handleScroll, { passive: true });
		this.textInput.current.focus();
	}
	componentWillUnmount() {
		this.wrapper.current.removeEventListener('scroll', this.handleScroll, { passive: true });
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		if ((prevProps.messages.length === 0) || (this.props.messages.length === 0)) {
			return null
		} else{
			const {top: firstChildTop} = this.wrapper.current.firstChild.firstChild.getBoundingClientRect();
			const {top: lastChildTop} = this.wrapper.current.firstChild.lastChild.getBoundingClientRect();
			return {
				firstMessageTop: firstChildTop,
				lastMessageTop: lastChildTop,
				scrollTop: this.wrapper.current.scrollTop,
			}
		}
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		const {current: wrapper} = this.wrapper;
		if ((prevProps.messages.length === 0) && (this.props.messages.length > 0)) {
			wrapper.scrollTop = wrapper.scrollHeight - wrapper.clientHeight;
			this.prevScrollTop = wrapper.scrollTop;
		}
		if (this.props.isLiveMode) {
			wrapper.scrollTop = wrapper.scrollHeight - wrapper.clientHeight;
		} else if (snapshot !== null && (snapshot.scrollTop === wrapper.scrollTop)) {
			const elem = wrapper.firstChild;
			let index = 0;
			const prevFirstId = prevProps.messages[0].id,
				prevLastId = prevProps.messages[prevProps.messages.length - 1].id;
			if (prevFirstId > this.props.messages[0].id) {
				index = prevFirstId - this.props.messages[0].id;
				while ((index > 0 ) && (elem.childNodes[index].id !== this.getMessageId(prevFirstId))) {
					index--;
				}
				if (elem.childNodes[index].id === this.getMessageId(prevFirstId)) {
					const {top: elementTop} = elem.childNodes[index].getBoundingClientRect();
					wrapper.scrollTop += elementTop - snapshot.firstMessageTop;
				}
			} else if (prevFirstId < this.props.messages[0].id) {
				index = this.props.messages.length - this.props.messages[this.props.messages.length - 1].id + prevLastId - 1;
				while ((index < this.props.messages.length ) && (elem.childNodes[index].id !== this.getMessageId(prevLastId))) {
					index++;
				}
				if (elem.childNodes[index].id === this.getMessageId(prevLastId)) {
					const {top: elementTop} = elem.childNodes[index].getBoundingClientRect();
					wrapper.scrollTop += elementTop - snapshot.lastMessageTop;
				}
			}
		}
		if (this.isShifting) {
			if ((wrapper.scrollTop === 0) && !this.props.reachedBegin) {
				this.props.messageShift(-NUMBER_SHIFT_MESSAGES);
			} else if((wrapper.scrollTop + wrapper.scrollHeight === wrapper.clientHeight) && !this.props.reachedEnd) {
				this.props.messageShift(NUMBER_SHIFT_MESSAGES);
			}
		}
		this.isShifting = false;
	}

	render() {
		const messageItems = this.props.messages.map(item =>
			<Message data={item} key={item.id} id={this.getMessageId(item.id)}/>
		);
		return (
			<div className='chat-room'>
				<h3>Сообщения чата</h3>
				<div className='wrapper' ref={this.wrapper} onWheel={this.handleScroll}>
					<ol className='messages'>
						{messageItems}
					</ol>
				</div>
				<div className='sender'>
					<form onSubmit={this.handleSubmit}>
						<input ref={this.textInput} type='text' placeholder='Введите сообщение' />
						<input type='submit' value='Отправить' />
					</form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		messages: state.visibleMessages,
		reachedBegin: getIsReachedBegin(state),
		reachedEnd: getIsReachedEnd(state),
		isLiveMode: state.isLiveMode,
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		messageSend: (user, text) => dispatch(messageSend({user, text})),
		messageShift: (number) => dispatch(messageShift(number)),
		liveModeToggle: (value) => dispatch(liveModeToggle(value)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);