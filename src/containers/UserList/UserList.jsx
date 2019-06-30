import React, {Component} from 'react';
import {connect} from "react-redux";
import './UserList.css'

class UserList extends Component {


	render() {
		const listItems = this.props.userList.map((item) =>
			<li key={item}>{item}</li>
		);
		return (
			<div className='user-list'>
				<h3>Сейчас в чате</h3>
				<div>
					<ul>
						{listItems}
					</ul>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		userList: state.userList
	}
}

export default connect(mapStateToProps)(UserList);