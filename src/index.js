import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import * as serviceWorker from './serviceWorker';
import {store} from './store/';
import {Provider} from 'react-redux';

import App from "./App";

const app = document.getElementById('root');


ReactDOM.render(
	<Provider store={store}>
			<App/>
	</Provider>
	, app);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
