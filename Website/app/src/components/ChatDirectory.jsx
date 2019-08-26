import React, { Component } from 'react';
import { Typography, Grid, Card, CardContent, Divider, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { socketConnect } from 'socket.io-react';
import { withSnackbar } from "notistack";
import toastMessage from "../functions/toaster";
import { ROOM_LIST, ENTER_ROOM, LEAVE_ROOM } from '../events';

const styles = {
	card: {
		padding: 8,
		flex: 20,
		height: "100%",
	},
	directory: {
		marginTop: 8,
		marginBottom: 8,
		flexWrap: 'nowrap',
		overflow: 'auto',
	},
	title: {
		fontSize: 20,
	},
	chatRoomButton: {
		marginTop: 8,
		marginBottom: 8, 
	},
	buttonName: {
		fontSize: 14,
	},
	flex: {
		flex: 1,
	},
}

const ChatRoomButtom = withStyles(styles)((props) => {
	return <Button variant="contained"
		color={props.active ? "primary" : "default"}
		className={props.classes.chatRoomButton} onClick={() => {props.func(props.chatRoom)}}>
		<Typography className={props.classes.buttonName}>
			{props.chatRoom.name}
		</Typography>
	</Button>
})

class ChatDirectory extends Component {
	state = { chatRooms: [] }

	constructor(props) {
		super(props)
		const { socket } = props
		this.updateActiveChat = this.updateActiveChat.bind(this)

		socket.on(ROOM_LIST, (payload) => {
			toastMessage(this.props.enqueueSnackbar, {type: "success", message:"Data Loaded"});
			this.setState({ chatRooms: payload })
			props.updateActiveChat(payload[0])
			socket.emit(ENTER_ROOM, payload[0])
		});
	}

	updateActiveChat(chatRoom) {
		this.props.socket.emit(LEAVE_ROOM)
		this.props.updateActiveChat(chatRoom)
		this.props.socket.emit(ENTER_ROOM, chatRoom)
	}

	render() {
		var classes = this.props.classes
		return <Grid item className={classes.card}>
			<Card style={{ height: '100%' }}>
				<Grid style={{ padding: 16, height: '100%' }} container direction="column">
					<Typography className={classes.title} gutterBottom>
						Chat Rooms
					</Typography>
					<Divider />
					<Grid container direction="column" alignContent="stretch"
						style={{ marginTop: 8 }} className={[classes.flex, classes.directory].join(" ")}>
						{this.state.chatRooms.map((chatRoom, idx) => {
							return <ChatRoomButtom key={idx} func={this.updateActiveChat}
								chatRoom={chatRoom} active={this.props.activeChat.id === chatRoom.id} />
						})}
					</Grid>
				</Grid>
			</Card>
		</Grid>
	}
}

export default withStyles(styles, {name:"ChatDirectory"})(withSnackbar(socketConnect(ChatDirectory)))