import React, { useState, useEffect, useContext} from 'react';
import OtpInput from 'react-otp-input';
import avatar from '../../icons/Logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Footer from '../../components/Footer/Footer';
import DFooter from '../../components/DFooter/DFooter';
import './parentOtp.css';
import {resendOTP, varifyParentotp} from '../../service/backendService';
import { Redirect } from 'react-router-dom';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import {ErrorNotification} from '../../components/ErrorNotification';
import Button from '@material-ui/core/Button';
import {SchoolContext} from "../../App";

const Otp = (props) => {
    const [otpverified, setOtpStatus] = useState(sessionStorage.getItem('status') === 'true');
    const [transaction_no, setTransactionNo] = useState(props.location.state.trans_no);
    const [otp, setOtp] = useState('');
    const schoolinfo = useContext(SchoolContext);
    const [ error, setError] = useState('');
    const [ otpresend, setOtpResendStatus] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');
    const [visitType, setvisitType] = useState(props.location.state.visitType)
    
    useEffect(()=>{
       let inputs = document.getElementsByTagName("input");
       inputs[0].setAttribute('placeholder', '*');
       inputs[1].setAttribute('placeholder', '*');
       inputs[2].setAttribute('placeholder', '*');
       inputs[3].setAttribute('placeholder', '*');
    },[])

    const handleOtpChange = (OTP) => {
        setOtp(OTP)
    }

    // console.log(visitType)

    const onSubmit = (e) => {
        e.preventDefault();
        const data={
            "otp":otp,
            "transaction_no":transaction_no,
            "mobileno":props.location.state.mobileno
        }
        varifyParentotp(data)
            .then(res=>{
                props.history.replace({pathname:'/parentregister',
                state:{ 
                    ...res.data,
                    visitType
                }
            });
                if(res.data.success){
                    sessionStorage.setItem("status",true);
                    setOtpStatus(sessionStorage.getItem('status') === 'true');
                    setOtpResendStatus(false);
                }else{
                    setOtpResendStatus(false);
                    setError(true);
                }
            })
            .catch(err=>{
                if(!err.response.data.success){
                    setOtpResendStatus(false);
                    setError(true);
                }else{
                    seterrorMessage('Error: Some error occureds');
                }
            });
       // props.history.push('/admission')
        if(otp.length != 4){
            setOtpResendStatus(false);
            setError(true)
        }else{
            //Make an api call
        }
    }
    const handleresendOtp= async () => {
        if(props.location.state.mobileno){
            const data={
                'mobileno':props.location.state.mobileno
            };
             await resendOTP(data)
                .then((res) => {
                    if(res.data.success){
                        setTransactionNo(res.data.data.transaction_no);
                        setError('');
                        setOtpResendStatus(true);
                        document.getElementById('otp1').value='';
                        document.getElementById('otp2').value='';
                        document.getElementById('otp3').value='';
                        document.getElementById('otp4').value='';
                        document.getElementById('otp1').focus();
                    }
                })
                .catch(err=>{
                    // seterrorMessage('Error: '+err.response.data.message);
                });
        }
    }
    const changeOtp = (val,next,prev) => {
        const keys=['Backspace','0','1','2','3','4','5','6','7','8','9'];
        if(keys.includes(val.key)){
            if(val.target.value){
                document.getElementById(next).focus();
                if(val.target.value != val.key){
                    document.getElementById(next).value=val.key;
                }
                let otp1=document.getElementById('otp1').value;
                let otp2=document.getElementById('otp2').value;
                let otp3=document.getElementById('otp3').value;
                let otp4=document.getElementById('otp4').value;
                let value = otp1+''+otp2+''+otp3+''+otp4;
                setOtp(value);
            }else{
                if(prev == 'otp3'){
                   setOtp('')
                }
                document.getElementById(prev).focus();
            }
            setError('');
        }
    }
   if(props.location == undefined){
       return <Redirect to='/'/>
   }else{
    return (
        <Container fluid className="Edu-container">
            <Row>
                <Col sm={6} className="left-col">
                    <HeaderBackButton />
                    <div className="Box-left">
                        <div className='Welcome-text otp-welcome-text'>
                            <p className="otp-text-small">Please Enter the OTP<sup>*</sup> </p>
                            <p className="text-medium"><b>to verify your Account</b></p>
                        </div>
                    </div>
                    <DFooter/>
                </Col>
                <Col sm={6} className="right-col">
                    <div className="Box-right">
                        <div className="Login-form otp-login-form">
                        <div className="Login-logo">
                            <img className="mb-3 sk_wid_70" src={schoolinfo ? schoolinfo.schoollogo: avatar} />
                        </div>
                        <p className="Logo-text lrBar">School Visit</p>
                        <hr className="Lg-underline border-0"></hr>
                            <p className="Logo-text-otp">
                                {/* <div className="Login-fields mb-5">
                                <div className="Field-group">
                                        <label className="text-left">Mobile</label>
                                        <div className="Input-field ">
                                        <input type="text" className="Input-page" value={props.location.state.mobileno} disabled/>
                                    </div>
                                </div>
                                </div> */}
                                An OTP (One Time Password) has been sent to <span className="otpMobileNumber">{props.location.state.mobileno.substr(0,4) + "****" + props.location.state.mobileno.substr(8) }</span>
                             </p>
                            <form onSubmit={onSubmit} autoComplete="off">
                                <div className="d-flex justify-content-center">
                            <OtpInput
                                value={otp}
                                onChange={handleOtpChange}
                                numInputs={4}
                                separator={<span></span>}
                                isInputNum
                                inputStyle={{
                                    width: "40px",
                                    height: "45px",
                                    textAlign: "center",
                                    margin: "10px 13px",
                                    padding:"5px",
                                    border: "none",
                                    fontSize: "20px",
                                    outline:"none",
                                    color: "#010617",
                                    border: "1px solid #70707080",
                                    borderRadius: "4px",
                                    backgroundColor: "#F8F8F8"
                                }}
                            />
                            </div>
                                {error != '' && 
                                    <p className="error-box"><i className="error-icon"></i><span className="error-text">The OTP you entered is invalid <br/>please enter the correct OTP</span></p>
                                }
                                {otpresend && <div className="otp-verify-msg">OTP Sent</div>}
                                {!otpverified ?
                                <div className="Button-container d-flex flex-column justify-content-center align-items-center">
                                        <Button type="submit" className="verify-Btn-primary Btn-animate">Continue</Button>
                                        <Button className="otp-resend otp-Btn-primary Btn-animate" onClick={handleresendOtp}>Resend OTP</Button>
                                </div> : 
                                <div className="otp-verify-msg">OTP verified !!!</div>
                                }
                            </form>
                            {/* {otpverified && 
                            <div className="Visit-purpose">
                                <p className="purpose-text">May I know the purpose of your visit?</p>
                                {/* <hr className="purpose-hr"></hr> *
                                <div className="purpose-icons purpose-admission" onClick={()=>props.history.push({pathname:'/admission',state:{ source: 'otp'}})}><i className="Adm-icon"></i></div>
                                <div className="purpose-icons purpose-vendor" onClick={()=>props.history.push({pathname:'/vendor',state:{ source: 'otp'}})}><i className="vendor-icon"></i></div>
                                <div className="purpose-icons purpose-general" onClick={()=>props.history.push({pathname:'/general',state:{ source: 'otp'}})}><i className="general-icon"></i></div>
                            </div>  */}
                        </div>
                    </div>
                </Col>
                <Footer />
                {errorMessage &&
        <ErrorNotification error={errorMessage} seterror={seterrorMessage}/>}
            </Row>
        </Container>
    )
   }
}
export default Otp;
