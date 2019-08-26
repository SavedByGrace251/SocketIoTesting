import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/App';
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
import { SnackbarProvider } from 'notistack';

const socket = io.connect("ws://"+window.location.hostname+":1005");

ReactDOM.render(
	<SocketProvider socket={socket}>
		<SnackbarProvider maxSnack={5}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
			<App />
		</SnackbarProvider>
	</SocketProvider>
	, document.getElementById('root'));