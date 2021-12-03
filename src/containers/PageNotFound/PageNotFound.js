import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { checkVisitorCode } from '../../service/backendService';
import { ErrorNotification } from "../../components/ErrorNotification";
import mainLogo from '../../icons/mainLogo.svg'
import footerLogo from '../../icons/footerLogo.png'

import './Pagenotfound.css';


const PageNotFound = (props) => {
    const [errorMessage, seterrorMessage] = useState("");
    useEffect(() => {
        sessionStorage.clear();
        localStorage.clear();
    }, []);
    const onSubmit = async (e) => {

        e.preventDefault();
        let schoolCode = '/' + e.target.schoolCode.value;
        console.log(schoolCode);
        await checkVisitorCode(e.target.schoolCode.value).then((res) => {
            if (res.data.success) {
                props.history.push(schoolCode);
                // console.log(res.data)
            } else {
                seterrorMessage(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
        })

    }

    // return <div className="notFoundTxt"><b>Oops! Page not found. Getting school</b></div>
    return (
        <form className="" onSubmit={onSubmit} autoComplete="off">
            <div className="notFoundTxt mainFirstPage">

                <div className="col-md-5 col-lg-5">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="login-wrapper login-wrapper  d-flex align-items-center justify-content-center flex-column">
                            <div>
                                {/* <h4 className="schoolnamecolor">
                       <span style={{color: '#4285f4'}}>E</span>
                       <span style={{color: '#ea4335'}}>D</span>
                       <span style={{color: '#fbbc05'}}>U</span>
                       <span style={{color: '#4285f4'}}>N</span>
                       <span style={{color: '#34a853'}}>E</span>
                       <span style={{color: '#ea4335'}}>X</span>
                       <span style={{color: '#4285f4'}}>T</span>
                    </h4> */}
                                <img className="mainLogoImg" src={mainLogo} alt="logo" />
                            </div>
                            <div className="Field-group Lg-username width100">
                                {/* <div className="Input-field">
                    
                        <input type="text" name='schoolCode' id="schoolCode" className="Input-page" placeholder="Enter School Code"/>
                    </div> */}
                                <TextField className="mainSearchField" name='schoolCode' id="schoolCode" label="Enter Visitor Code" variant="outlined" />
                            </div>

                            <div className="Button-container mt-3">
                                <Button type="submit" className="Btn-primary Btn-login Btn-animate">Search</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footerContaienr">
                                <p>Powered By</p>
                                <img src={footerLogo} alt="footer logo" />
                            </div>
            </div>
            {errorMessage && (
                <ErrorNotification error={errorMessage} seterror={seterrorMessage} />
            )}
        </form>
    )
}

export default PageNotFound;