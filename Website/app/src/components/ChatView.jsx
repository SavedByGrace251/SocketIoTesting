import React, { Component } from 'react';
import { Paper, Typography, Grid, Card, CardContent, Table, TableHead, TableBody, TableFooter, TableCell, TableRow, Toolbar, AppBar, Divider, Button, CardActionArea, TextField, CardActions } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SocketProvider, socketConnect } from 'socket.io-react';
import { withSnackbar, SnackbarProvider } from "notistack";


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
	componentDidMount() {
		this.props.socket.emit("join_room", )
	}

	sendMessage(message) {
		this.props.socket.emit("send_message", { message: message, room: this.props.room })
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
						<Grid>
							<Typography className={this.props.classes.chatMessage} gutterBottom>
								Chat View
							</Typography>
						</Grid>
					</CardContent>
					<CardActions>
						<Grid container direction="row">
							<Typography>Message:</Typography>
							<TextField className={this.props.classes.flex} />
							<Button>Send</Button>
						</Grid>
					</CardActions>
				</Card>
			</Grid>
		)
	}
}

export default withStyles(styles)(socketConnect(ChatView))