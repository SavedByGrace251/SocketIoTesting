import React from 'react';
import { Paper, Typography, Grid, Card, CardContent, Table, TableHead, TableBody, TableFooter, TableCell, TableRow, Toolbar, AppBar, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
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
		padding: 8,
	},
	buttonName: {
		fontSize: 14,
	},
}, {name: "ChatStyles"});

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
			<Paper className={classes.chatRoomButton}>
				<Typography className={classes.buttonName}>
					{props.name}
				</Typography>
			</Paper>
		</Grid>
	)
}

function ChatDirectory(props) {
	const classes = useStyles();
	return (
		<Grid item className={classes.chatDirectory}>
			<Card>
				<CardContent>
					<Typography className={classes.title} gutterBottom>
						Chat Rooms
					</Typography>
					<Divider />
					<Grid container direction="column" justify="center" alignContent="stretch" style={{marginTop: 8}}>
						<ChatRoomButtom name="TeftyTeft"/>
					</Grid>
				</CardContent>
			</Card>
		</Grid>
	)
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

function App(props) {
	const classes = useStyles();
	return (
		<Grid container direction="column" className={classes.root}>
			<Navigation />
			<Grid item className={classes.content} container
				direction="row" justify="center"
				alignContent='stretch'>
				<ChatDirectory />
				<ChatView />
			</Grid>
		</Grid>
	);
}

export default App;
