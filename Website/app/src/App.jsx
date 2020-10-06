import React, { Component } from 'react';
import { Paper, Typography, Grid, Card, CardContent, Table, TableHead, TableBody, TableFooter, TableCell, TableRow, Toolbar, AppBar, Divider, Button, Drawer } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { socketConnect } from 'socket.io-react';
import { withSnackbar } from "notistack";
import ChatDirectory from "./components/ChatDirectory";
import ChatView from "./components/ChatView";
import Navigation from './Navigation';
import toastMessage from "./functions/toaster";
import { CONNECT, DISCONNECT, SEND_MESSAGE, ROOM_LIST, LEAVE_ROOM, ENTER_ROOM } from "./events";

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
	drawer: {
		width: 240,
		flexShrink: 0,
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
	state = {}
	classes = this.props.classes

	constructor(props) {
		super(props)
		props.socket.on(CONNECT, (client) => {
			this.reconnected();
		});
		props.socket.on(DISCONNECT, () => {
			this.connectionError();
		});
		props.socket.on(SEND_MESSAGE, (data) => {
			toastMessage(this.props.enqueueSnackbar, data);
		});
		props.socket.on(ROOM_LIST, (payload) => {
			toastMessage(this.props.enqueueSnackbar, {type: "success", message:"Data Loaded"});
			this.setState({ chatRooms: payload })
		});
		this.updateActiveChat = function (chat) {
			props.socket.emit(LEAVE_ROOM)
			this.setState({ activeChat: chat, openDrawer: false })
			props.socket.emit(ENTER_ROOM, chat)
		}.bind(this)

		this.toggleDrawer = function (state) { 
			this.setState({ openDrawer: state })
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
				<Navigation toggleDrawer={this.toggleDrawer} />
				<Grid item className={this.classes.content} container
					direction="row" justify="center"
					alignContent='stretch'>
					<Drawer open={this.state.openDrawer} onClose={() => {this.toggleDrawer(false)}}>
						<ChatDirectory
							chatRooms={this.state.chatRooms}
							updateActiveChat={this.updateActiveChat}
							activeChat={this.state.activeChat} />
					</Drawer>
					<ChatView chat={this.state.activeChat} />
				</Grid>
			</Grid>
		);
	}
}

export default withStyles(styles, { name: "ChatStyles" })(withSnackbar(socketConnect(App)));
