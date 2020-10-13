import React from 'react';
import { Typography, Grid, Divider, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

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

const ChatRoomButtom = withStyles(styles)(({active, classes, func, chatRoom}) => {
	return <Button variant="contained"
		color={active ? "primary" : "default"}
		className={classes.chatRoomButton} onClick={() => { func(chatRoom) }}>
		<Typography className={classes.buttonName}>
			{chatRoom.name}
		</Typography>
	</Button>
})

function ChatDirectory({ classes, chatRooms, updateActiveChat, activeChat }) {
	return (
		<Grid style={{ padding: 16, height: '100%', width: 240 }} container direction="column">
			<Typography className={classes.title} gutterBottom>
				Chat Rooms
					</Typography>
			<Divider />
			<Grid container direction="column" alignContent="stretch"
				style={{ marginTop: 8 }} className={[classes.flex, classes.directory].join(" ")}>
				{chatRooms.map((chatRoom, idx) => {
					return <ChatRoomButtom key={idx} func={updateActiveChat}
						chatRoom={chatRoom} active={activeChat !== undefined ? activeChat.id === chatRoom.id : false} />
				})}
			</Grid>
		</Grid>
	)
}

export default withStyles(styles, { name: "ChatDirectory" })(ChatDirectory)