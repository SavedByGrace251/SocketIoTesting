import React, { Component } from 'react';
import { Paper, Typography, Grid, Card, CardContent, Table, TableHead, TableBody, TableFooter, TableCell, TableRow, Toolbar, AppBar, Divider, Button, CardActionArea, TextField, CardActions, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Send } from "@material-ui/icons";
import { SocketProvider, socketConnect } from 'socket.io-react';
import { withSnackbar, SnackbarProvider } from "notistack";
import { SEND_MESSAGE, RECV_MESSAGE, GET_ID } from '../events';
import toastMessage from '../functions/toaster';

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

function getTextColor(hexCode) {
	var r = parseInt(hexCode.slice(0,2), 16)/255;
	r = r <= 0.03928 ? r/12.92 : ((r+0.055)/1.055)**2.4
	var g = parseInt(hexCode.slice(2,4), 16)/255;
	g = g <= 0.03928 ? g/12.92 : ((g+0.055)/1.055)**2.4
	var b = parseInt(hexCode.slice(4,6), 16)/255;
	b = b <= 0.03928 ? b/12.92 : ((b+0.055)/1.055)**2.4
	var L = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
	var textColor = L > 0.179 ? "black" : "white";
	return textColor
}

const MyChatMessage = withStyles(styles, { name: "MyChatMessage" })((props) => {
	var { classes } = props;
	return <Grid container direction="row">
		<div className={classes.flex} />
		<Paper className={classes.chatMessage + " " + classes.myMessage}>
			<Typography color='inherit'>{props.message.message}</Typography>
		</Paper>
	</Grid>
})

const ChatMessageUser = withStyles(styles, { name: 'ChatMesssageUser' })((props) => {
	var { classes } = props;
	var userId = props.userSid.slice(0, 2);
	return <Tooltip title={props.userSid} placement="top" aria-label="add">
		<Paper className={classes.chatUser} style={{backgroundColor: "#"+props.color, color: props.textColor}}>
			<Typography>{userId}</Typography>
		</Paper>
	</Tooltip>
})

const OtherChatMessage = withStyles(styles, {name: "OtherChatMessage"})((props) => {
	var { classes } = props;
	var color = props.message.sid.slice(0,6);
	var textColor = getTextColor(color);
	return <Grid container direction="row">
		<ChatMessageUser textColor={textColor} color={color} userSid={props.message.sid} />
		<Paper className={classes.chatMessage} style={{backgroundColor: "#"+color, color: textColor}}>
			<Typography color='inherit'>{props.message.message}</Typography>
		</Paper>
	</Grid>
})

function ChatMessage(props) {
	if (props.message.sid === props.userSid) {
		return <MyChatMessage {...props} />
	} else {
		return <OtherChatMessage {...props} />
	}
};

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