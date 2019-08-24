import React from "react";
import { AppBar, Toolbar, Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const styles = {
	toolbar: {
		padding: 8,
		background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
		color: 'white',
	},
}

function Navigation(props) {
	return (
		<AppBar position="relative">
			<Toolbar className={props.classes.toolbar}>
				<Grid container direction="row" alignContent="center">
					<Typography variant="h3">Budget</Typography>
				</Grid>
			</Toolbar>
		</AppBar>
	)
}


export default withStyles(styles)(Navigation);