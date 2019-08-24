import React, { Component } from 'react';
import { Paper, Typography, Grid, Card, CardContent, Table, TableHead, TableBody, TableFooter, TableCell, TableRow, Toolbar, AppBar, Divider, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SocketProvider, socketConnect } from 'socket.io-react';
import { withSnackbar, SnackbarProvider } from "notistack";
import ChatDirectory from "./components/ChatDirectory";
import ChatView from "./components/ChatView";
import Navigation from './Navigation';
import toastMessage from "./functions/toaster";

const styles = {
	root: {
		margin: 0,
		width: '100%',
		height: '100%',
		overflow: 'hidden'
	},
	content: {
		margin: 0,
		flex: 1,
		overflowX: 'auto'
	},
	toolbar: {
		padding: 8,
		background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
		color: 'white',
	},
	chatDirectory: {
		margin: 8,
		flex: 20,
		height: "100%",
	},
	chatView: {
		margin: 8,
		flex: 80,
		height: "100%",
	},
	title: {
		fontSize: 20,
	},
	chatRoomButton: {
	},
	buttonName: {
		fontSize: 14,
	},
}

class App extends Component {
	state = {
		activeChat: {},
	}
	classes = this.props.classes

	constructor(props) {
		super(props)
		props.socket.on('connect', () => {
			this.reconnected();
		});
		props.socket.on('disconnect', () => {
			this.connectionError();
		});
		props.socket.on('send_message', (data) => {
			toastMessage(this.props.enqueueSnackbar, data);
		});
		this.updateActiveChat = function(chat) {
			this.setState({ activeChat: chat })
		}.bind(this)
	}

	detectConnection() {
		if (this.props.socket.connected) {
			this.reconnected()
		} else {
			this.connectionError()
		}
	}

	connectionError() {
		const key = this.props.enqueueSnackbar('No connection!', {
			variant: 'error',
			persist: true,
			anchorOrigin: {
				vertical: 'bottom',
				horizontal: 'center',
			}
		});
		this.setState({ connectionKey: key })
	}

	reconnected() {
		this.props.closeSnackbar(this.state.connectionKey);
	}

	render() {
		return (
			<Grid container direction="column" className={this.classes.root}>
				<Navigation />
				<Grid item className={this.classes.content} container
					direction="row" justify="center"
					alignContent='stretch'>
					<ChatDirectory updateActiveChat={this.updateActiveChat} 
						activeChat={this.state.activeChat} />
					<ChatView chat={this.state.activeChat} />
				</Grid>
			</Grid>
		);
	}
}

export default withStyles(styles, { name: "ChatStyles" })(withSnackbar(socketConnect(App)));