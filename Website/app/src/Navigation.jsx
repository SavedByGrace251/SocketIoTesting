import React from "react";
import { AppBar, Toolbar, Grid, Typography, IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Menu as MenuIcon } from "@material-ui/icons";

const styles = {
	toolbar: {
		padding: 8,
		background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
		color: 'white',
	},
}

function Navigation({classes, toggleDrawer}) {
	return (
		<AppBar position="relative">
			<Toolbar className={classes.toolbar}>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={() => {toggleDrawer(true)}}
					className={classes.menuButton} >
					<MenuIcon />
				</IconButton>
				<Grid container direction="row" alignContent="center" style={{paddingLeft: 16}}>
					<Typography variant="h3">Chat</Typography>
				</Grid>
			</Toolbar>
		</AppBar>
	)
}


export default withStyles(styles)(Navigation);