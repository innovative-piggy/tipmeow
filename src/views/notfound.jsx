import Paper from '@material-ui/core/Paper';
import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
  root:{
    marginTop:15,
    width: "50%",
    marginLeft: "25%"
  },
  background:{
    //backgroundColor: "grey"
  },
  paper: theme.mixins.gutters({
    paddingTop: 20,
    paddingBottom: 50,
    marginTop: theme.spacing.unit * 3,
  }),
  container: {
   display: 'flex',
   flexWrap: 'wrap',
 },
 textField: {
   marginLeft: theme.spacing.unit,
   marginRight: theme.spacing.unit,
 },
 textFieldHalf:{
   marginLeft: theme.spacing.unit * .5,
   marginRight: theme.spacing.unit * .5,
   width: "48%"
 },
 button: {
   //width:00,
    margin: theme.spacing.unit,
  },
  bigAvatar: {
  width: 100,
  height: 100,
  },
 menu: {
   width: 100,
 },
});


class NotFound extends React.Component {
  constructor(props){
    super(props);
    this.state={
      username:'test',
      password:'',
      messageError:'',
      messageSuccess:''
    }
  }

  handleChange = name => event => {
   this.setState({
     [name]: event.target.value,
   });
 };

  handleClick(event){
    let path = `/dashboard`
    this.props.history.push(path);
}

  render() {
    const { classes } = this.props;
    return (
    <div className={classes.background}>
    <Grid container className={classes.root} justify={"center"}>

      <Paper className={classes.paper} elevation={4}>
      <Grid container justify={"center"}>
      <Avatar aria-label="Logo" className={classes.bigAvatar}>
            L
      </Avatar>
      </Grid>
        <h1>404 - Not Found</h1>
        <Grid container justify={"center"}>
        <Button
        variant="raised"
        color="primary"
        fullWidth="true"
        className={classes.button}
        onClick={(event) => this.handleClick(event)}
        >
        Return Home ET
        </Button>
        </Grid>

      </Paper>


    </Grid>
    </div>
  );
}
}



/*PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired,
};*/

export default withStyles(styles)(NotFound);
