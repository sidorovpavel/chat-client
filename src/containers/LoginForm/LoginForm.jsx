import React from 'react';
import './LoginForm.css';
import {connect} from "react-redux";
import {userSet} from "../../store/actions";

class LoginForm extends React.Component {

	constructor(props) {
		super(props);
		this.input = React.createRef();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit = (e) => {
		const nickname = this.input.current.value;
		e.preventDefault();
		if (nickname !== '') {
			this.props.setUser(nickname);
		}
	}

	componentDidMount() {
		this.input.current.focus();
	}

	render() {
		return(
			<div className='login'>
				<h3>Укажите Ваше имя</h3>
				<form className='login-form' onSubmit={this.handleSubmit}>
				<label htmlFor='nickname'>Ник</label>
				<input ref={this.input}
					id = 'nickname'
					type = 'text'
					placeholder='Укажите Ваш Ник'
				/>
					<div className='error'>{this.props.userExist ? 'В чате есть пользователь с таким Ником': null}</div>
				<input type='submit' value='Использовать'/>
				</form>
			</div>
		)
	}
}


const mapStateToProps = (state = {}) => {
	return {
		userExist: state.userExist
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		setUser: (nickname) => dispatch(userSet(nickname))
	}
};


export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

