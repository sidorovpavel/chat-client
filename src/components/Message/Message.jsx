import * as React from 'react';
import './Message.css';

export const Message = (props) => {
	const {dt, user, message} = props.data
	return (
		<li className='message' id={props.id}>
			<span className='date'>[{(new Date(dt)).toLocaleString()}] </span>
			<span className='nick'>{user}: </span>
			<span className='text'>{message}</span>
		</li>
	);
};