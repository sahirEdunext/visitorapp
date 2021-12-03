import React, { useEffect, useState,useContext } from 'react'
import avatar from '../../icons/Logo.png';
import './GuardLogin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'
import DFooter from '../../components/DFooter/DFooter'
import { guardLogin } from '../../service/backendService';
import {ErrorNotification} from '../../components/ErrorNotification'
import {SchoolContext} from "../../App"
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';

const GuardLogin = (props) => {
  const [inputs, setInputs] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [errorMessage, seterrorMessage] = useState('');
  const schoolinfo = useContext(SchoolContext);
  const validate = (inputs) => {
    const error = {};
    if (!inputs.username) {
      error.username = 'Please enter username';
    }
    if (!inputs.password) {
      error.password = 'Please enter password';
    }
    return error;
  }
  useEffect(
    ()=>{
      if(sessionStorage.getItem('authguard')){
        props.history.push('/guard');
      }else{
        sessionStorage.clear('authguard');
      }
    }
  ,[])
  const onSubmit = (e) => {
    e.preventDefault();

    let username = e.target.username.value;
    let password = e.target.password.value;

    const data = {
      username,
      password
    };
    const validationErrors = validate(data);
    const noErrors = Object.keys(validationErrors).length === 0;
    if (noErrors) {
      // Hit Api if no error
      guardLogin(data)
        .then(res => {
          if(res.data.success){
            sessionStorage.setItem('authguard',JSON.stringify(res.data.data));
            props.history.push('/guard');
          }
        })
        .catch(err => {
          // seterrorMessage('Error: '+err.response.data.message);
          seterrorMessage('Error: Username and Password Wrong Please Try Again');
        });

    } else {
      console.log("errors try again", validationErrors);
      setErrors(validationErrors);
    }


  }

  const handleInputChange = (event) => {
    event.persist();
    setInputs({ ...inputs, [event.target.name]: event.target.value });
    setErrors(prevState => ({
      ...prevState, [event.target.name]:''
  }))
  }

  return (
    <Container fluid className="Edu-container mlgn">
      <Row>
        <Col sm={6} className='left-col'>
        <HeaderBackButton />
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
              <div className="Login-logo">
                <img className="mb-3 sk_wid_70" src={schoolinfo ? schoolinfo.schoollogo: avatar} />
              </div>
              <p className="Logo-text lrBar glogin">&nbsp;Login as Guard&nbsp;</p>
              <hr className="Lg-underline border-0"></hr>
              <form onSubmit={onSubmit} autoComplete="off">
                <div className="Login-fields">
                  <div className="Field-group Lg-username">
                    <label className="">Username</label>
                    <div className="Input-field">
                      <input type="text" name='username' placeholder="Enter your username" onChange={handleInputChange} id="username" className="Input-text"  />
                    </div>
                    {errors.username && <p className="text-danger"><small>{errors.username}</small></p>}
                  </div>
                  <div className="Field-group Lg-mobile_number">
                    <label className="">Password</label>
                    <div className="Input-field">
                      <input type="password" placeholder="Enter your password"name='password' id="password" onChange={handleInputChange} className="Input-text" />
                    </div>
                    {errors.password && <p className="text-danger"><small>{errors.password}</small></p>}
                  </div>
                </div>
                <div className="Button-container">
                  <button type="submit" className="Btn-primary Btn-login Btn-animate">Login</button>
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

export default withRouter(GuardLogin);
