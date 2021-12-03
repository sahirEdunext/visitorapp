import React, { useState, useEffect,useContext } from 'react'
import avatar from '../../icons/Logo.png';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'
import DFooter from '../../components/DFooter/DFooter'
import { register } from '../../service/backendService';
import {ErrorNotification} from '../../components/ErrorNotification'
import Button from '@material-ui/core/Button';
import {SchoolContext} from "../../App";
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';

const Login = (props) => {
  
  const [inputs, setInputs] = useState({ name: '', mobileno: '' });
  const [errors, setErrors] = useState({});
  const [errorMessage, seterrorMessage] = useState('');
  const [disable, setdisable] = useState(false);
  const schoolinfo = useContext(SchoolContext);

  const validate = (inputs) => {
    const error = {};
    if (!inputs.name || !(/^[a-zA-Z ]+$/.test(inputs.name))) {
      error.name = 'Please enter your name';
    }
    if (!inputs.mobileno || !(/^[0-9]{10}$/.test(inputs.mobileno))) {
      error.mobileno = 'Please enter your 10 digit mobile number';
    }
    return error;
  }
  useEffect(() => {
    sessionStorage.clear('authData');
    sessionStorage.clear('status');
  },[])
  const onSubmit = (e) => {
    e.preventDefault();

    let name = e.target.name.value;
    let mobileno = e.target.mobileno.value;
    const data = {
      name,
      mobileno
    };
    const validationErrors = validate(data);
    const noErrors = Object.keys(validationErrors).length === 0;
    if (noErrors) {
      // Hit Api if no error
      setdisable(true);
      register(data)
        .then(res => {
          if(res.data){
            sessionStorage.setItem('authData', JSON.stringify(res.config.data));
            props.history.push({pathname:'/otp',
              state:{ 
                trans_no: res.data.data.transaction_no,
                mobileno,
                name
              }
            });
            setdisable(false);
          }
        })
        .catch(err => {
          if(err.response){
            seterrorMessage('Error: '+err.response.data.message);
          }else{
            seterrorMessage('Error: Some error occurred');
          }
          setdisable(false)
        });
    } else {
      console.log("errors try again", validationErrors);
      setErrors(validationErrors);
    }

  }

  const handleInputChange = (event) => {
    event.persist();
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  }
  const handleMobileInputChange = (event) => {
    if(event.target.value){
      if (!event.target.value || !(/^[0-9]{10}$/.test(event.target.value))) {
        setErrors({ ...errors, [event.target.name]: 'Please enter your 10 digit mobile number' });
      }else{
        setErrors({ ...errors, [event.target.name]: '' });
      }
    }else{
      setErrors({ ...errors, [event.target.name]: 'Please enter your 10 digit mobile number' });
    }
  }
  const handleTextInputChange = (event) => {
    if(event.target.value){
      setErrors({ ...errors, [event.target.name]: '' });
    }else{
      setErrors({ ...errors, [event.target.name]: 'Please enter your '+event.target.name });
    }
  }
  return (
    <Container fluid className="Edu-container login-page mlgn">
      <Row>
        <Col sm={6} className='left-col'>
        <HeaderBackButton backHome="true"/>
          <div className="Box-left">
            <div className='Welcome-text'>
              <p className="Welcome-text-small">Welcome to</p>
              <p className="Welcome-text-big">Edunext</p>
            </div>
          </div>
          <DFooter/>
        </Col>
        <Col sm={6} className='right-col'>
          <div className="Box-right">
            <div className="Login-form Lg-Form">
              <div className="Login-logo mb-4">
                <img className="sk_wid_70" src={schoolinfo ? schoolinfo.schoollogo: avatar} alt="" />
                {/* {console.log(schoolinfo)} */}
              </div>
              <p className="Logo-text lrBar lr-30">Let's Start Self Check - In</p>
              <hr className="Lg-underline border-0"></hr>
              <form onSubmit={onSubmit} autoComplete="off">
                <div className="Login-fields">
                  <div className="Field-group Lg-username">
                    <label className="mx-2 my-1">Name</label>
                    <div className="Input-field">
                      <input type="text"
                      onKeyPress={(event) => { 
                        if(!/[a-zA-Z ]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      name='name' placeholder="Enter Your Name" onChange={handleInputChange}  onKeyUp={handleTextInputChange}id="name" className="Input-text" />
                    </div>
                    {errors.name && <p className="text-danger"><small>{errors.name}</small></p>}
                  </div>
                  <div className="Field-group Lg-mobile_number">
                    <label className="mx-2 my-1">Mobile</label>
                    <div className="Input-field">
                      <input type="text" placeholder="Enter Your Mobile Number"
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                       maxLength="10" id="mobileno" onBlur={handleMobileInputChange} onChange={handleInputChange} name='mobileno' className="Input-text" />
                    </div>
                    {errors.mobileno && <p className="text-danger"><small>{errors.mobileno}</small></p>}
                  </div>
                </div>
                <div className="Button-container">
                  <Button type="submit" className="Btn-primary Btn-login Btn-animate verify-Btn-primary btnW-160px" disabled={disable}>Register</Button>
                </div>
              </form>
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

export default withRouter(Login);
