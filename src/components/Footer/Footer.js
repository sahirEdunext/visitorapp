import React,{useContext} from 'react';
import { withRouter } from "react-router-dom";
import { Col } from 'react-bootstrap'
import {SchoolContext} from "../../App"
import './Footer.css';

const Footer = (props) => {
    const redirectMap=(addr)=>{
        window.location.href="https://www.google.co.in/maps/place/"+addr;
    }
    const schoolinfo = useContext(SchoolContext);
    return (
        <Col sm={12} className="footer-col">
            <div style={{zIndex: "9"}} className="display-hide footer">
                <p className="float-left"><i className="icon-location" onClick={()=>redirectMap(schoolinfo?schoolinfo.school_address:'')}></i>{schoolinfo?schoolinfo.school_address:''}</p>
                <p className="float-sm-right float-left mt-sm-0 mt-2"><i className="icon-call"></i>{schoolinfo?schoolinfo.school_mobile:''}</p>
            </div>
        </Col>
    );
}

export default withRouter(Footer);    