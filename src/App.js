import React, {Component} from 'react';
import io from 'socket.io-client';
import {connect} from 'react-redux';
import {LoginForm} from './containers/LoginForm/'
import {ChatRoom} from './containers/ChatRoom'
import {UserList} from './containers/UserList'
import './App.css'


const socketUrl = "http://192.168.1.16:4000";
class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      socket: null
    };
  }


  initConnect = () => {
    const socket = io(socketUrl);
    socket.on('connect', () => {
      console.log('connected');
    })
    this.setState({socket});
  }

  login = (user) => {
    const { socket } = this.state;
    socket.emit('USER_CONNECTED', user);
    this.setState({user});
  }

  logout = (user) => {
    const { socket } = this.state;
    socket.emit('USER_DISCONNECTED', user);
    this.setState({user: null});
  }

  render() {
    const {user} = this.props;
    return (
      <div className='app'>
        {!user ? <LoginForm /> :
          <div className='chat'>
            <UserList/>
            <ChatRoom/>
          </div>}
      </div>
    );
  }
}

const mapStateToProps = (state = {}) => {
  return {user: state.user};
};

export default connect(mapStateToProps)(App);