import React, { Component } from 'react';
import { Paper, Typography, Grid, Card, CardContent, Table, TableHead, TableBody, TableFooter, TableCell, TableRow, Toolbar, AppBar, Divider, Button, CardActionArea, TextField, CardActions } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Send } from "@material-ui/icons";
import { SocketProvider, socketConnect } from 'socket.io-react';
import { withSnackbar, SnackbarProvider } from "notistack";
import { SEND_MESSAGE, RECV_MESSAGE } from '../events';
import toastMessage from '../functions/toaster';


const styles = {
	chatView: {
		margin: 8,
		flex: 80,
		height: "100%",
	},
	view: {
		padding: 16,
	},
	title: {
		fontSize: 20,
	},
	chatMessage: {
		fontSize: 14,
	},
	flex: {
		flex: 1,
	},
}

class ChatView extends Component {
	state = { message: '', messages: [] }

	constructor(props) {
		super(props)
		this.updateMessage = this.updateMessage.bind(this);
		this.keyPressed = this.keyPressed.bind(this);
		this.sendMessage = this.sendMessage.bind(this);

		props.socket.on(RECV_MESSAGE, (payload) => {
			toastMessage(props.enqueueSnackbar, payload.message)
			this.setState({ messages: [...this.state.messages, payload.message] })
		})
	}

	keyPressed(e) {
		if (e.key === 'Enter') {
			console.log("enter key detected")
			this.sendMessage()
		}
	}

	sendMessage() {
		console.log("Sending Message")
		this.props.socket.emit(SEND_MESSAGE, { message: this.state.message, room: this.props.chat })
		this.setState({message: ''})
	}

	updateMessage(event) {
		this.setState({ message: event.target.value })
	}

	render() {
		return (
			<Grid item className={this.props.classes.chatView}>
				<Card>
					<CardContent>
						<Typography className={this.props.classes.title} gutterBottom>
							{this.props.chat.name}
						</Typography>
						<Divider />
						<Grid container direction="column-reverse">
							{this.state.messages.map(
								(message, idx) => {
									return (
									<Paper key={idx} className={this.props.classes.chatMessage}>
										<Typography>{message}</Typography>
									</Paper>
									)
								}
							)}
							
						</Grid>
					</CardContent>
					<CardActions>
						<Grid container direction="row" style={{ padding: 8 }}>
							<TextField autoFocus placeholder='Message' 
								className={this.props.classes.flex} 
								onKeyPress={this.keyPressed} 
								onChange={this.updateMessage} 
								value={this.state.message}
								/>
							<Button variant="contained" color="primary" onClick={this.sendMessage}>Send <Send /></Button>
						</Grid>
					</CardActions>
				</Card>
			</Grid>
		)
	}
}

export default withStyles(styles)(withSnackbar(socketConnect(ChatView)))