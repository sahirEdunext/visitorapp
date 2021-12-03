import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import {withStyles} from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop/Backdrop.js'; 

const  styles = theme =>({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#3710c5',
      }
})

class Loader extends React.Component {
    render() {
        let {classes} = this.props;
        
        return (
            <div>
                <Backdrop className={classes.backdrop} invisible={true} open={true}>
                    <CircularProgress color="secondary"/>
                </Backdrop>
            </div>
        )
    }
}

export default withStyles(styles)(Loader)