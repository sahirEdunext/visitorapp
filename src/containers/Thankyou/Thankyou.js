import React, { useEffect, useState, useContext } from 'react';
import QRCode from "react-qr-code";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Footer  from '../../components/Footer/Footer'
import DFooter from '../../components/DFooter/DFooter'
import selectedParIcon from "../../icons/selectStIcon.png";
import checkIconThanks from "../../icons/checkIconThanks.svg";
import './Thankyou.css';
import {SchoolContext} from "../../App";
import {Redirect} from 'react-router-dom'
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import Button from '@material-ui/core/Button';
import * as htmlToImage from 'html-to-image';

const Thankyou = (props) =>  { 
    // console.log('Thankyou from props', props.location.state)
    const downloadQr = () =>{
        htmlToImage.toJpeg(document.getElementById('cardContainer'),{backgroundColor:'white',pixelRatio:1})
        .then(function (dataUrl) {
          var link = document.createElement('a');
          link.download = 'my-image-name.jpeg';
          link.href = dataUrl;
          link.click();
        });
    }  
    // const [sessionData,setSessionData]=useState({});
    // useEffect(()=>{
    //     setSessionData(JSON.parse(JSON.parse(sessionStorage.authData)));
    //     sessionStorage.clear('status');
    // },[]);

    useEffect(() => {
        setTimeout(() => {
            props.history.push('/'+localStorage.getItem('school_id'))
        }, 10000)
    }, [])
    
    var newQRValue=0;
    if(props.location.state.data.appointmentid !== undefined) {
        newQRValue = props.location.state.data.appointmentid
    } else if(props.location.state.data.visitorid !== undefined) {
        newQRValue = props.location.state.data.visitorid
    }
    const [qrvalue,setQrValue]=useState(newQRValue);
    const schoolinfo = useContext(SchoolContext);
    const [thanksData, setthanksData] = useState(props.location.state.dataForThankyou)
    
    if(props.location.state == undefined){
        return <Redirect to='/'/>
    }else{    
    return (
        <Container fluid className="Edu-container Thank-container">
            {/* {console.log(sessionData)} */}
        <Row>
            <Col sm={6} className='left-col'>
                <HeaderBackButton backHome="true" />
                <div className="Box-left">
                    <div className='Welcome-text'>
                        <p className="Welcome-text-small">Welcome to</p>
                        <p className="Welcome-text-big thankyou-text">Edunext</p>
                    </div>
                </div>
                <DFooter/>
            </Col>
            <Col sm={6} className='right-col'>
                {thanksData.appointmentType == "false" || thanksData.appointmentType == false ? 
                <div className="Box-right align-items-center d-flex flex-column justify-content-center">
                    <div id="cardContainer" className="Qr-container qr-box-border cardBoxQr">
                        <div id="code">
                        {/* {console.log(props.location.state)} */}
                        {/* <p className="thanksMessage">{props.location.state.data.msg !== undefined ? props.location.state.data.msg: "Welcome to <br /> Edunext School"}</p> */}
                        <p className="thanksMessage">Welcome to <br /> {schoolinfo.school_name}</p>
                        {/* <p className="">Your appointment ID is: {props.location.state.data.parentvisitorid !== undefined ? props.location.state.data.parentvisitorid: "Your Registration has been successfully completed."}</p> */}
                        <div className="mt-3">
                            <img className="thankParImage" src={thanksData.visitorPhotoForId ? thanksData.visitorPhotoForId : selectedParIcon} alt="" />
                            <p className="tcapitalize mt-1 font-weight-bold">{thanksData.visitorName}</p>
                            {/* {console.log(props.location.state.dataForThankyou)} */}
                        </div>
                        <div className="Qr-code qrCardContBox">
                            {/* <p>Scan Me</p> */}
                            <div  className="code">
                                <QRCode value={newQRValue.toString()} height={50} width={50} size={80} level="H" />
                            </div>
                        </div>
                        <table className="Qr-data-table mb-0">
                            <tbody>
                            <tr>
                                <td className="cardTdL">Request No.:</td>
                                <td className=""> {newQRValue.toString()}</td>
                            </tr>
                            <tr>
                                <td className="cardTdL">Purpose:</td>
                                <td className="tcapitalize wid80lg"> {thanksData.purposeName}</td>
                            </tr>
                            {thanksData.meetingToName && 
                            <tr>
                                <td className="cardTdL">Meeting To:</td>
                                <td className="tcapitalize wid80lg"> {thanksData.meetingToName}</td>
                            </tr>
                            }
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <Button className="Btn-qr-download downloadCard" onClick={()=>downloadQr()}>Download</Button>
                </div>
                :
                 <div className="Box-right align-items-center d-flex flex-column justify-content-center">
                    <div>
                        <img style={{width: "70px"}} src={checkIconThanks} alt=""/>
                        <h4 className="thanksMesageApt mb-2 mt-4">Thank you!</h4>
                        <p className="apntPara">We've received your request for Appointment. <br /> You shall be notified shortly. <br /><br /></p>
                        <p className="apntPara">Your Request No: <span className="appIdVisitor">EDU- {props.location.state.data.visitorid ? props.location.state.data.visitorid : props.location.state.data.appointmentid}</span></p>
                    </div>
                </div> 
                 } 
            </Col>
            <Footer/>
        </Row>
    </Container>
    )
    }
}
export default Thankyou;
