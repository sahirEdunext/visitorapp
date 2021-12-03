import React, { useState } from 'react'
import std_img_empty from "../../icons/selectStIcon.png";
import stdTickIcon from "../../icons/stdTickIcon.svg";
import QrReader from 'react-qr-reader'
import './studentAttendance.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import DFooter from '../../components/DFooter/DFooter';
import { markStudentAttendance } from '../../service/backendService';
import { ErrorNotification } from '../../components/ErrorNotification';
import Button from '@material-ui/core/Button';
import { SchoolContext } from "../../App";
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import useTimeout from "../../components/useTimeout"

const StudentAttendance = (props) => {

  const [stdQrNumber, setstdQrNumber] = useState();
  const [studentData, setstudentData] = useState({});
  const { clear, reset } = useTimeout(() => setstudentData(""), 10000)
  const handleScan = async (data) => {

    if (data) {
      // setScanState(data);
      // markStudentAttendance(data);
      await markStudentAttendance(data)
        .then((res) => {
          // console.log(res.data)
          setstudentData(res.data)
          reset();
          // setParentpurpose(res.data.data.purpose_list);
        })
        .catch((err) => {
          // seterrorMessage("Error: Some error occurred please reload");
        });
      // console.log(data);
      setstdQrNumber(data);

    }
  }
  const handleError = (err) => {
    console.error(err)
  }
  return (
    <Container fluid className="Edu-container" >
      <Row>
        <Col sm={6} className='left-col'>
          <HeaderBackButton backGuard={true} />
          <div className="Box-left">
            <div className='Welcome-text'>
              <p className="Welcome-text-small">Welcome to</p>
              <p className="Welcome-text-big">Edunext</p>
            </div>
          </div>
          <DFooter />
        </Col>
        <Col sm={6} className='right-col'>
          <div className="Box-right student-scan-cont">
            {studentData.admissionno ?
              <div className="att-div-std">
                <div className="attStudentDetails_div">
                  <div className="attImgDiv"><img src={std_img_empty} /></div>
                  <div className="attDetailsDiv ml-2">
                    <p className="stNameAtt">{studentData.studentname}</p>
                    <div className="commATT"><span className="attTitle">Adm. No: </span><span className="stdIdATT">{studentData.admissionno}</span> &nbsp;|&nbsp; <span className="attTitle">Class: </span> <span className="stdIdATT">{studentData.classname}-{studentData.sectionname}</span></div>
                  </div>
                  <div className="attTickDiv ml-2"><img src={stdTickIcon} /></div>
                </div>
              </div>
              : studentData.reason ?
              <div className="att-div-std">
                <div className="attStudentDetails_div">
                  <div className="attDetailsDiv ml-2">
                    <span className="attTitle">{studentData.reason}</span>
                  </div>
                  {/* <div className="attTickDiv ml-2"><img src={stdTickIcon} /></div> */}
                </div>
              </div>
              :
              ""}

            <div className="">
              <div className="corner-borders corner-borders--left"></div>
              <div className="corner-borders corner-borders--right"></div>
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                className='qr-container student-scan'
              />
              <div className="st_scan_div">
                <p className="scan_stQR">Scan QR code</p>
                <Button onClick={() => props.history.goBack()} className=" cancel_scan_std Btn-animate">Cancel</Button>
                {/* <Button onClick={reset} className=" cancel_scan_std Btn-animate">Cancel</Button> */}
              </div>



            </div>
          </div>
          {/* {errorMessage &&
        <ErrorNotification error={errorMessage} seterror={seterrorMessage}/>} */}
        </Col>
      </Row>
    </Container>
  )
}

export default withRouter(StudentAttendance);

