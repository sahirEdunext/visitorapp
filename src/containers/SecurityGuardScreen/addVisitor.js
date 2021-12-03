import React, { useState, useEffect, useContext } from 'react';
import './GuardScreen.css';
import avatar from '../../icons/Logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { SchoolContext } from "../../App";
import { Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Header from '../../components/Header/header'
import Footer from '../../components/Footer/Footer'
import DFooter from '../../components/DFooter/DFooter'
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';

const GuardScreen = (props) => {
    const schoolinfo = useContext(SchoolContext);
  return (
    <Container fluid className="Edu-container">
      <Row>
        <Col sm={6} className="left-col">
          <HeaderBackButton backGuard={true} />
          <div className="Box-left">
            <div className='Welcome-text'>
              <p className="Welcome-text-small">Welcome to</p>
              <p className="Welcome-text-big">Edunext</p>
            </div>
          </div>
          <DFooter />
        </Col>
        <Col sm={6} className="right-col">
          <div className="Box-right pos-relative Guard-screen">
            <div className="Login-form">

              <div className="modal show addVisDivPop" role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content border-0">
                    <div className="Login-logo">
                      <img className="mb-3 sk_wid_70" src={schoolinfo ? schoolinfo.schoollogo : avatar} />
                    </div>
                    <p className="Logo-text g-visitbox lrBar mb-4">School Visit</p>
                    <h3 style={{ fontSize: "20px", fontWeight: "500", color: "#573EEA", margin: "10px 0 3px", fontFamily: 'Hind',}} className="selectStHeading">New Visitors</h3>
                    <p style={{ fontSize: "13px",  fontFamily: 'Hind',}}>Choose Which type of Visitor you're</p>
                    <div className="modal-body text-center d-sm-flex flex-wrap">

                      <div className="Visit-purpose">
                        <div className="mx-3 purpose-icons purpose-admission" onClick={() => props.history.replace({ pathname: '/parentlogin' })}><i className="g-vis-new-icon circle-icons-size"></i></div>
                        <div className="mx-3 purpose-icons purpose-vendor" onClick={() => props.history.replace({ pathname: '/login' })}><i className="g-vis-other-new circle-icons-size"></i></div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>
            <Header />
          </div>
        </Col>
        <Footer />
      </Row>
      
    </Container>
  )
}

export default withRouter(GuardScreen);
