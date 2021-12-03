import React, { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Footer from '../../components/Footer/Footer'
import DFooter from '../../components/DFooter/DFooter'
import checkIconThanks from "../../icons/checkIconThanks.svg";
import successGif from "../../icons/successGif.gif";
import redCrossIcon from "../../icons/redCrossIcon.png";
import './CheckinThankyou.css';
import { SchoolContext } from "../../App";
import { Redirect } from 'react-router-dom';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import Button from '@material-ui/core/Button';
import useTimeout from '../../components/useTimeout';

const CheckinThankyou = (props) => {

    const [checkData, setcheckData] = useState(props.location.state);
    const { clear, reset } = useTimeout(() => props.history.push('/guard'), 6000)

    useEffect(() => {
        reset();
    }, [])

    if (props.location.state == undefined) {
        return <Redirect to='/' />
    } else {
        return (
            <Container fluid className="Edu-container Thank-container check-in-thanks">
                {/* {console.log(sessionData)} */}
                <Row>
                    <Col sm={6} className='left-col'>
                        <HeaderBackButton backGuard={true} />
                        <div className="Box-left">
                            <div className='Welcome-text'>
                                <p className="Welcome-text-small">Welcome to</p>
                                <p className="Welcome-text-big thankyou-text">Edunext</p>
                            </div>
                        </div>
                        <DFooter />
                        {/* {console.log(thanksData)} */}
                    </Col>
                    <Col sm={6} className='right-col'>

                        <div className="Box-right align-items-center d-flex flex-column justify-content-center">
                            <div>
                                <img style={{ width: "110px" }} src={checkData.data.success ? successGif : redCrossIcon} alt="" />
                                <h4 className="thanksMesageApt mb-2 mt-4">{checkData.data.message}</h4>
                                {/* {console.log(checkData)} */}
                                <div className="mt-3">
                                    <Button onClick={() => {props.history.push('/guard'); clear();}} className="Btn-primary Btn-login Btn-animate verify-Btn-primary all_child_btn" >Go Now!</Button>
                                </div>
                            </div>
                        </div>

                    </Col>
                    <Footer />
                </Row>
            </Container >
        )
    }
}
export default CheckinThankyou;
