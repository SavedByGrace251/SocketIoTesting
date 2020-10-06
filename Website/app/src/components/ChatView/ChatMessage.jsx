import React from 'react';
import { Typography, Grid, Paper, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { fadeColor, getTextColor } from "../../functions/styling";

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
		<Paper className={classes.chatUser} style={{
			background: "linear-gradient(45deg, #" + fadeColor(props.color, -40) + ", #" + fadeColor(props.color, 40) + ")",
			color: props.textColor}}>
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
		<Paper className={classes.chatMessage} 
			style={{
				background: "linear-gradient(45deg, #" + fadeColor(color, -40) + ", #" + fadeColor(color, 40) + ")", 
				color: textColor
			}}>
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

export default ChatMessage;