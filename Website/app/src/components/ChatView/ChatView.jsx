import React, { Component } from 'react';
import { Typography, Grid, Card, Divider, Button, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Send } from "@material-ui/icons";
import { socketConnect } from 'socket.io-react';
import { withSnackbar } from "notistack";
import toastMessage from '../../functions/toaster';
import ChatMessage from './ChatMessage';
import { GET_ID, RECV_MESSAGE, SEND_MESSAGE } from '../../events';

const styles = {
	card: {
		padding: 8,
		flex: 80,
		height: "100%",
	},
	view: {
		padding: 16,
	},
	title: {
		fontSize: 20,
	},
	messages: {
		marginTop: 8,
		marginBottom: 8,
		flexWrap: 'nowrap',
		overflow: 'auto',
	},
	message: {
		paddingRight: 16,
	},
	messageField: {
		marginTop: 8,
	},
	myMessage: {
		background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
		color: 'white',
		alignSelf: 'flex-end',
	},
	otherMessage: {
		alignSelf: 'flex-start',
	},
	chatMessage: {
		fontSize: 14,
		margin: 4,
		padding: 4,
		paddingRight: 8,
		paddingLeft: 8,
		maxWidth: "60%",
	},
	chatUser: {
		borderRadius: "50%",
		margin: 4,
		padding: 4,
		paddingRight: 8,
		paddingLeft: 8,
	},
	flex: {
		flex: 1,
	},
}


class ChatView extends Component {
	messagesEnd = '';

	constructor(props) {
		super(props)
		this.updateMessage = this.updateMessage.bind(this);
		this.keyPressed = this.keyPressed.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.state = { message: '', sid: '' }

		props.socket.on(GET_ID, (payload) => {
			this.setState({ sid: payload })
		})
		props.socket.on(RECV_MESSAGE, (payload) => {
			toastMessage(props.enqueueSnackbar, payload.message)
			var obj = {}
			var roomMessages = []
			if (this.state[this.props.chat.id]) {
				roomMessages = this.state[this.props.chat.id]
			}
			obj[this.props.chat.id] = [...roomMessages, payload]
			this.setState(obj)
			this.scrollToBottom()
		})
	}

	keyPressed(e) {
		if (e.key === 'Enter') {
			this.sendMessage()
		}
	}

	sendMessage() {
		if (this.state.message != '') {
			this.props.socket.emit(SEND_MESSAGE, { message: this.state.message, room: this.props.chat })
			this.setState({ message: '' })
		}
	}

	updateMessage(event) {
		this.setState({ message: event.target.value })
	}

	scrollToBottom() {
		this.messagesEnd.scrollIntoView({ behavior: "smooth" });
	}

	render() {
		var classes = this.props.classes
		var messages = []
		if (this.state[this.props.chat.id]) {
			messages = this.state[this.props.chat.id]
		}
		return (
			<Grid item className={classes.card}>
				<Card style={{ height: '100%' }}>
					<Grid style={{ padding: 16, height: '100%' }} container direction="column">
						<Typography className={classes.title} gutterBottom>
							{this.props.chat.name}
						</Typography>
						<Divider />
						<Grid container direction="column"
							className={[classes.flex, classes.messages].join(" ")}>
							{messages.map((message, idx) =>
								<ChatMessage key={idx} userSid={this.state.sid} message={message} />
							)}
							<div ref={(elem) => { this.messagesEnd = elem }}></div>
						</Grid>
						<Divider />
						<Grid container direction="row" justify="center" className={classes.messageField}>
							<TextField autoFocus placeholder='Message'
								className={[classes.flex, classes.message].join(" ")}
								onKeyPress={this.keyPressed}
								onChange={this.updateMessage}
								value={this.state.message} />
							<Button variant="contained" color="primary" onClick={this.sendMessage}>Send <Send /></Button>
						</Grid>
					</Grid>
				</Card>
			</Grid>
		)
	}
}

export default withStyles(styles, { name: "ChatView" })(withSnackbar(socketConnect(ChatView)))