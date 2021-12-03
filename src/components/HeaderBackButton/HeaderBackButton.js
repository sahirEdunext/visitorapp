import React from 'react';
import './HeaderBackButton.css';
import { withRouter, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import { Router } from 'react-router';
const HeaderBackButton = (props) => {
    let history = useHistory();
    return (
        <>
            {props.backGuard ? 
            <Link className="Back-top-icons" to={`/guard`}>
                <i className="back-arrow"></i>
            </Link>
            :
            <Link className="Back-top-icons" to={`/${localStorage.getItem('school_id')}`}>
                <i className="back-arrow"></i>
            </Link>
            }
            
            {/* <a href="" className="Back-top-icons" onClick={() => history.goBack()}>
                <i className="back-arrow"></i>
            </a> */}
            
        </>

    )
}

export default withRouter(HeaderBackButton);