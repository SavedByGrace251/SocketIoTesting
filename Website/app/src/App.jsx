import React, { useEffect, useState } from 'react';
import { Grid, Drawer } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import ChatDirectory from "./components/ChatDirectory";
import ChatView from "./components/ChatView";
import Navigation from './Navigation';
import { SocketEvent } from './constants';
import { useSocketIO } from './services';
import { useSnackbar } from 'notistack';
import { toastMessage } from './functions/toaster';

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

function App(props) {

	const { socket, connected } = useSocketIO();
	const { enqueueSnackbar } = useSnackbar();

	const [chatRooms, setChatRooms] = useState([])
	const [activeChat, setActiveChat] = useState(undefined);
	const [openDrawer, setOpenDrawer] = useState(false);
	const classes = props.classes;

	const updateActiveChat = (chat) => {
		socket.emit(SocketEvent.leaveRoom);
		setActiveChat(chat);
		setOpenDrawer(false);
		socket.emit(SocketEvent.enterRoom, chat)
	};

	useEffect(() => {
		if (connected && enqueueSnackbar) {
			socket.on(SocketEvent.sendMessage, (data) => {
				toastMessage(enqueueSnackbar, data);
			});
			socket.on(SocketEvent.roomList, (payload) => {
				toastMessage(enqueueSnackbar, {type: "success", message: "Data Loaded"});
				setChatRooms(payload)
			});
		}
	}, [socket, connected, enqueueSnackbar])

	const toggleOpenDrawer = () => {
		socket.emit(SocketEvent.getRooms, {});
		setOpenDrawer(true);
	}

	return (
		<Grid container direction="column" className={classes.root}>
			<Navigation toggleDrawer={toggleOpenDrawer} />
			<Grid item className={classes.content} container
				direction="row" justify="center"
				alignContent='stretch'>
				<Drawer open={openDrawer} onClose={() => {setOpenDrawer(false)}}>
					<ChatDirectory
						chatRooms={chatRooms}
						updateActiveChat={updateActiveChat}
						activeChat={activeChat} />
				</Drawer>
				<ChatView chat={activeChat} />
			</Grid>
		</Grid>
	);
}

export default withStyles(styles, { name: "ChatStyles" })(App);
