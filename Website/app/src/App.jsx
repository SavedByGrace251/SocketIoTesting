import React, { Component, useState } from 'react';
import { Paper, Typography, Grid, Card, CardContent, Table, TableHead, TableBody, TableFooter, TableCell, TableRow, Toolbar, AppBar, Divider, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

const useStyles = makeStyles(
	{
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
	}, {
		name: "ChatStyles"
	}
);

function ChatView(props) {
	const classes = useStyles();
	return (
		<Grid item className={classes.chatView}>
			<Card>
				<CardContent>
					<Typography className={classes.title} gutterBottom>
						Chat View
					</Typography>
				</CardContent>
			</Card>
		</Grid>
	)
}


function ChatRoomButtom(props) {
	const classes = useStyles();
	return (
		<Grid item>
			<Button variant="contained"
				color={props.active ? "default" : "primary"}
				className={classes.chatRoomButton}>
				<Typography className={classes.buttonName}>
					{props.name}
				</Typography>
			</Button>
		</Grid>
	)
}

class ChatDirectory extends Component {
	state = { chatRooms: [{ name: "TeftyTeft", id: 1 }, { name: "SavedByGrace251", id: 2 }] }
	
	render() {
		const classes = useStyles();
		return (
			<Grid item className={classes.chatDirectory}>
				<Card>
					<CardContent>
						<Typography className={classes.title} gutterBottom>
							Chat Rooms
					</Typography>
						<Divider />
						<Grid container direction="column" justify="center" alignContent="stretch" style={{ marginTop: 8 }}>
							{this.state.chatRooms.map(
								function (chatRoom) {
									return <ChatRoomButtom
										onClick={this.props.updateActiveChat}
										name={chatRoom.name}
										active={this.props.activeChat.id === chatRoom.id} />
								})
							}
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		)
	}
}

function Navigation(props) {
	const classes = useStyles();
	return (
		<AppBar position="relative">
			<Toolbar className={classes.toolbar}>
				<Grid container direction="row" alignContent="center">
					<Typography variant="h3">Budget</Typography>
				</Grid>
			</Toolbar>
		</AppBar>
	)
}

class App extends Component {
	state = {
		activeChat: {},
		response: false,
		endpoint: "http://127.0.0.1:4001"
	}

	componentDidMount() {
		const {endpoint} = this.state;
		const socket = socketIOClient(endpoint);
		socket.on("FromAPI", data => this.setState({response:data}))
	}

	updateActiveChat(chatId) {
		this.setState({
			activeChat: chatId
		})
	}

	render() {
		const classes = useStyles();
		return (
			<Socket uri={"http://localhost:1005"} option={{ transports: ['websocket'] }}>
				<Grid container direction="column" className={classes.root}>
					<Navigation />
					<Grid item className={classes.content} container
						direction="row" justify="center"
						alignContent='stretch'>
						<ChatDirectory updateActiveChat={this.updateActiveChat} activeChat={this.state.activeChat} />
						<ChatView chatId={this.state.activeChat} />
					</Grid>
				</Grid>
			</Socket>
		);
	}
}

export default App;
