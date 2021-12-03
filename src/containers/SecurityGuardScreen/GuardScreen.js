import React, { useState, useEffect, useContext } from 'react';
import './GuardScreen.css';
import avatar from '../../icons/Logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Header from '../../components/Header/header'
import Footer from '../../components/Footer/Footer'
import DFooter from '../../components/DFooter/DFooter'
import { getVisitorCount } from '../../service/backendService'
import QrReader from 'react-qr-reader'
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ErrorNotification } from '../../components/ErrorNotification';
import appIcon from '../../icons/g-app-icon.svg';
import inIcon from '../../icons/g-in-icon.svg';
import outIcon from '../../icons/g-out-icon.svg';
import { SchoolContext } from "../../App";
import reportIcon from '../../icons/g-re-icon.svg';
const GuardScreen = (props) => {

  const [visitorcount, setVisitorCount] = useState({});
  const [scanresult, setScanState] = useState('');
  const schoolinfo = useContext(SchoolContext);
  // const [errors, setErrors] = useState({});
  const [errorMessage, seterrorMessage] = useState('');
  const [showscanner, setShowScanner] = useState(false);
  // const [studentsModal, setstudentsModal] = useState(false)
  useEffect(
    () => {
      handleVisitorCount();
    },
    []
    );
    const handleVisitorCount = async () => {
      await getVisitorCount().then(res => {
        setVisitorCount(res.data.data);
      })
    }
    
    const handleVisitCode = (event) => {
      event.preventDefault();
    let visCode = event.target["visitorCode"].value;
    // console.log(visCode)
    if (visCode !== "") {
      // setScanState(event.target["visitorCode"].value);
      props.history.push({ pathname: '/Qrvisitors', state: visCode })
    } else {
      seterrorMessage('Please enter a valid code');
    }
  }

  const handleMobileInputChange = (event) => {
    if (event.target.value) {
      if (!event.target.value || !(/^[0-9]{5}$/.test(event.target.value))) {
        // setErrors({ ...errors, [event.target.name]: 'Please enter your 10 digit mobile number' });
      } else {
        // setErrors({ ...errors, [event.target.name]: '' });
      }
    } else {
      // setErrors({ ...errors, [event.target.name]: 'Please enter your 10 digit mobile number' });
    }
  }

  const handleScan = (data) => {
    // console.log(data)
    if (data) {
      setScanState(data);
      props.history.push({ pathname: '/Qrvisitors', state: data })
    }
  }
  const handleError = (err) => {
    console.error(err)
  }
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // const handleNewVisitor = (to) => {
  //   props.history.push({ pathname: '/' + to, state: { source: 'guard' } })
  // }
  return (
    <Container fluid className="Edu-container">
      <Row>
        <Col sm={6} className="left-col">
          <HeaderBackButton backHome="true" />
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
              <div className="w-100 mt-4 mt-sm-0 text-right d-flex justify-content-between" >
                {schoolinfo.isStdAttendance ? <button onClick={() => props.history.push('/studentAttendance')} className=" stdAttendeBtn">
                  <span className="d-flex align-items-center">Student Attendance</span>
                </button>
                :<span></span>}

                <button onClick={() => { props.history.push('/addVisitor') }} className=" addVisitorBtn">
                  <span className="d-flex align-items-center"><span className="plusIconAddVis">+</span> New Request</span>
                </button>
              </div>

              <div className="d-flex mt-4 pt-4 align-items-center flex-column mobBotMargin">
                <div className=" p-1 mt-3 Guard-Btn1" onClick={() => setShowScanner(true)}>
                  <i className="qr-icon ml-3"></i><span className="Guard-btn-text">Scan QR Code</span>
                </div>

                <div className="cus_wid mt-3">
                  <p className="orBars">OR</p>
                </div>

                <div className="Field-group text-left mt-3 mlgn cus_wid">
                  <form className="" onSubmit={handleVisitCode}>
                    <label className="mx-2 my-1 text-left ">Your Visitor Code</label>
                    <div className="Input-field">
                      <input className="p-2 Input-text" type="text" placeholder="Enter Your Visitor Code" className="Input-text "
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        maxLength="5" id="mobileno" onBlur={handleMobileInputChange} name='visitorCode' />
                      <input className="p-1 mt-3 Guard-Btn1" type="submit" value="Continue"></input>
                    </div>
                    {/* {errors.mobileno && <p className="text-danger"><small>{errors.mobileno}</small></p>} */}
                  </form>
                </div>

                <div className="w-100 mt-4 pt-2" >
                  {/* {console.log(visitorcount)} */}
                  <div><p className="gvis_heading">Today's Visitor</p></div>
                  <div className="row">
                    <div className="gVis_b_outer col-md-6 ">
                      <div value="appointment_array" onClick={() => props.history.push({ pathname: '/visitors', state: { name: "appointment_array" } })} className="gVis_b_box GappBox">
                        <div><img className="nrml_icon" src={appIcon} /><span className="gvis_txt">Appointment</span></div>
                        <div className="circ_t_num">{visitorcount.appointment_count !== undefined ? visitorcount.appointment_count : 0}</div>
                      </div>
                    </div>


                    <div className="gVis_b_outer col-md-6 ">
                      <div value="visitor_array" onClick={() => props.history.push({ pathname: '/visitors', state: { name: "visitor_array" } })} className="gVis_b_box GreBox">
                        <div><img className="nrml_icon" src={reportIcon} /><span className="gvis_txt">Visitor List</span></div>
                        <div className="circ_t_num">{visitorcount.total_count !== undefined ? visitorcount.total_count : 0}</div>
                      </div>
                    </div>


                    <div className="gVis_b_outer col-md-6 ">
                      <div value="checkin_array" onClick={() => props.history.push({ pathname: '/visitors', state: { name: "checkin_array" } })} className="gVis_b_box GinBox">
                        <div><img className="nrml_icon" src={inIcon} /><span className="gvis_txt">Check-In</span></div>
                        <div className="circ_t_num">{visitorcount.in_count ? visitorcount.in_count : 0}</div>
                      </div>
                    </div>

                    <div className="gVis_b_outer col-md-6 ">
                      <div value="checkout_array" onClick={() => props.history.push({ pathname: '/visitors', state: { name: "checkout_array" } })} className="gVis_b_box GoutBox">
                        <div><img className="nrml_icon" src={outIcon} /><span className="gvis_txt">Check-Out</span></div>
                        <div className="circ_t_num">{visitorcount.out_count !== undefined ? visitorcount.out_count : 0}</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              {/* <p className="total-visitor">Total Visitors : <span>{visitorcount.total_count !== undefined ? visitorcount.total_count : 0}</span></p>
              <div className="row">
                <div className="col-4">
                  <div className="donuts appointment_count"><span className="count">{visitorcount.appointment_count !== undefined ? visitorcount.appointment_count : 0}</span><span className="count-text">Appointment</span></div>
                </div>
                <div className="col-4">
                  <div className="donuts out_count"><span className="count">{visitorcount.out_count !== undefined ? visitorcount.out_count : 0}</span><span className="count-text">OUT</span></div>
                </div>
                <div className="col-4">
                  <div className="donuts in_count"><span className="count">{visitorcount.in_count ? visitorcount.in_count : 0}</span><span className="count-text">IN</span></div>
                </div>
              </div>
              <div className="d-flex mt-4 align-items-center flex-column">
                <div className=" p-1 mt-3 Guard-Btn1" onClick={() => setShowScanner(true)}>
                  <i className="qr-icon ml-3"></i><span className="Guard-btn-text">Scan QR Code</span>
                </div>
                <div className=" w-75 p-1  mt-3 Guard-Btn2" onClick={() => props.history.push("/visitors")}>
                  <i className="visitor-list-icon"></i><span className="Guard-btn-text">Visitors List</span><i className="orange-icon"></i>
                </div>
                <div className=" w-75 p-1  mt-3 Guard-Btn3" onClick={handleClickOpen}>
                  <i className="new-visitor-icon"></i><span className="Guard-btn-text" >New Visitors</span><i className="purple-icon"></i>
                </div>
               
              </div> */}

              {/* <div className={`modal fade show ${studentsModal ? "shownsk" : "hide"}`} role="dialog">
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
              </div> */}

              {/* <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle id="responsive-dialog-title"><p className="purpose-text">Purpose of your visit ?</p></DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <div className="Visit-purpose">
                      <div className="mx-3 purpose-icons purpose-admission" onClick={() => props.history.replace({ pathname: '/parentlogin' })}><i className="Adm-icon circle-icons-size"></i></div>
                      <div className="mx-3 purpose-icons purpose-vendor" onClick={() => props.history.replace({ pathname: '/login' })}><i className="vendor-icon circle-icons-size"></i></div>
                    </div>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog> */}
            </div>
            <Header />
          </div>
        </Col>
        <Footer />
      </Row>
      {showscanner &&
        <div>
          <div className="Modal">
            <div className="pmb-modal modal-show" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowScanner(false)}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <QrReader
                      facingMode={"environment"}
                      delay={300}
                      onError={handleError}
                      onScan={handleScan}
                      className='qr-container'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p>{scanresult}</p>
        </div>
      }
      {errorMessage &&
        <ErrorNotification error={errorMessage} seterror={seterrorMessage} />}
    </Container>
  )
}

export default withRouter(GuardScreen);
