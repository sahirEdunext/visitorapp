import React, { useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Footer  from '../../components/Footer/Footer'
import DFooter from '../../components/DFooter/DFooter'
import {Redirect} from 'react-router-dom'
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import Button from '@material-ui/core/Button';
import * as htmlToImage from 'html-to-image';

const Complete = (props) =>  { 
    const downloadQr = () =>{
        htmlToImage.toJpeg(document.getElementById('code'),{backgroundColor:'white',pixelRatio:1})
        .then(function (dataUrl) {
          var link = document.createElement('a');
          link.download = 'my-image-name.jpeg';
          link.href = dataUrl;
          link.click();
        });
    }  

    const [personData,setPersonData]=useState(props.location.state.persondata);
    const [qrvalue,setQrValue]=useState(props.location.state.data.visitorid);
    if(props.location.state == undefined){
        return <Redirect to='/'/>
    }else{    
    return (
        <Container fluid className="Edu-container Thank-container">
            <Row>
                <Col sm={6} className='left-col'>
                    <HeaderBackButton />
                    <div className="Box-left">
                        <div className='Welcome-text'>
                            {/* <p className="Welcome-text-small">Welcome to</p> */}
                            <p className="Welcome-text-big thankyou-text">Thank You.</p>
                        </div>
                    </div>
                    <DFooter/>
                </Col>
                <Col sm={6} className='right-col'>
                    <div className="Box-right">
                        <div className="Qr-container">
                            <div id="code">
                            <p className="Th-Logo-text">Registration Completed</p>
                            <div className="Qr-code">
                                <p>Scan Me</p>
                                <div  className="code">
                                    <QRCode value={qrvalue.toString()} size={110} level="H" />
                                </div>
                            </div>
                            <table className="Qr-data-table">
                                <tbody>
                                <tr>
                                    <td className="Q-key">Name:</td>
                                    <td className="Q-value">{personData.name}</td>
                                </tr>
                                <tr>
                                    <td className="Q-key">Mobile No.:</td>
                                    <td className="Q-value">{personData.mobileno}</td>
                                </tr>
                                <tr>
                                    <td className="Q-key">Visitor No.:</td>
                                    <td className="Q-value">{qrvalue.toString()}</td>
                                </tr>
                                </tbody>
                            </table>
                            </div>
                            <Button style={{marginTop:'30px !important'}} className="Btn-qr-download" onClick={()=>downloadQr()}>Download</Button>
                        </div>
                    </div>
                </Col>
                <Footer/>
            </Row>
        </Container>
    )
    }
}
export default Complete;
