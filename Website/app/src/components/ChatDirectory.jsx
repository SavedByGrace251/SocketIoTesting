import React, { Component } from 'react';
import { Typography, Grid, Card, CardContent, Divider, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { socketConnect } from 'socket.io-react';
import { withSnackbar } from "notistack";
import toastMessage from "../functions/toaster";


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
		marginTop: 8,
		marginBottom: 8, 
	},
	buttonName: {
		fontSize: 14,
	},
}

const ChatRoomButtom = withStyles(styles)(buttonComp)
function buttonComp(props) {
	return (
		<Button variant="contained"
			color={props.active ? "primary" : "default"}
			className={props.classes.chatRoomButton} onClick={() => {props.func(props.chatRoom)}}>
			<Typography className={props.classes.buttonName}>
				{props.chatRoom.name}
			</Typography>
		</Button>
	)
}

class ChatDirectory extends Component {
	state = { chatRooms: [] }
    classes = this.props.classes
	constructor(props) {
		super(props)
		const { socket } = props

		socket.on('room_list', (payload) => {
			toastMessage(this.props.enqueueSnackbar, {type: "success", message:"Data Loaded"});
			this.setState({ chatRooms: payload })
			props.updateActiveChat(payload[0])
		});
	}
	
	componentDidMount() {
	}

	render() {
		return (
			<Grid item className={this.classes.chatDirectory}>
				<Card>
					<CardContent>
						<Typography className={this.classes.title} gutterBottom>
							Chat Rooms
					</Typography>
						<Divider />
						<Grid container direction="column" justify="center" alignContent="stretch" style={{ marginTop: 8 }}>
							{this.state.chatRooms.map((chatRoom, idx) => {
									return <ChatRoomButtom key={idx}
										func={this.props.updateActiveChat}
										chatRoom={chatRoom}
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

export default withStyles(styles)(withSnackbar(socketConnect(ChatDirectory)))