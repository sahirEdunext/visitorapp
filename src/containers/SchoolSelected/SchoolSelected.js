import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { getSchoolDetails,getHost } from '../../service/backendService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SchoolSelected.css';
import facebook from '../../icons/facebook.svg';
import instagram from '../../icons/instagram.svg';
import twitter from '../../icons/twitter.svg';
import parentGuardian from '../../icons/parents-guardians.svg';
import newVisitor from '../../icons/new-visitor.svg';
import visitor from '../../icons/visitor-img.png';
import guardIcon from '../../icons/guards.svg';
import studentIcon from '../../icons/studentSS.svg';
import arrowRight from '../../icons/arrow-right.svg';
import callIcon from '../../icons/call-icon.svg';
import emailIcon from '../../icons/email-icon.svg';
import webIcon from '../../icons/web-icon.svg';
import addressIcon from '../../icons/address-icon.svg';
import { BASE_URL } from '../../config/constant';

const SchoolSelected = (props) => {
    const [schoolData, setschoolData] = useState({})
    useEffect(() => {
        if (props.match.params != null) {
            getSchoolDetails(props.match.params.visitorId)
                .then(res => {
                    localStorage.setItem('host_url',window.atob(res.data.domain));
                    localStorage.setItem('school_id',props.match.params.visitorId);
                    // BASE_URL(window.atob(res.data.domain));
                    // console.log(window.atob(res.data.domain))
                    setschoolData(res.data);
                })
                .catch(err => {
                    
                });
        }
    }, []);

    return (
        <div>
            <section className="visitor-section">
                <div className="row ml-0 mr-0">
                    <div className="col-lg-3 pl-0 pr-0 leftBoxBgIMG">
                        <div className="side-panel">
                            <div className="logo-box">
                                <div className="logo-img">
                                    <img src={schoolData.schoollogo} alt="logo" />
                                </div>
                                <div className="logo-tag-line">
                                    <p>{schoolData.school_name}</p>

                                </div>

                            </div>

                            <div className="contact-info deskTop_view">
                                <ul>
                                    <li>
                                        <div className="contact-content">
                                            <div className="icon-box">
                                                <img className="leftSideDivIcon" src={callIcon} alt="" />
                                                <h5>Contact No.</h5>
                                            </div>
                                            <div className="main-content">
                                                <p>{schoolData.school_mobile == undefined ? '-' : schoolData.school_mobile}</p>
                                            </div>

                                        </div>
                                    </li>

                                    <li>
                                        <div className="contact-content">
                                            <div className="icon-box">
                                            <img className="leftSideDivIcon" src={emailIcon} alt="" />
                                                <h5>Email</h5>
                                            </div>
                                            <div className="main-content">
                                                <p>{schoolData.school_email == undefined ? '-' : schoolData.school_email}</p>
                                            </div>

                                        </div>
                                    </li>

                                    <li>
                                        <div className="contact-content">
                                            <div className="icon-box">
                                            <img className="leftSideDivIcon" style={{width: "20px"}} src={webIcon} alt="" />
                                                <h5>Website</h5>
                                            </div>
                                            <div className="main-content">
                                                <p><a target="_blank" href={schoolData.website_link == undefined ? '-' : schoolData.website_link}>{schoolData.website_link && schoolData.website_link.replace(/^(?:https?:\/\/)?/i, "").split('/')[0]}</a></p>
                                            </div>
                                        </div>
                                    </li>

                                    <li>
                                        <div className="contact-content mb-5">
                                            <div className="icon-box">
                                            <img className="leftSideDivIcon" src={addressIcon} alt="" />
                                                <h5>Address</h5>
                                            </div>
                                            <div className="main-content">
                                                <p>{schoolData.school_address == undefined ? '-' : schoolData.school_address}</p>
                                            </div>

                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="social-icons deskTop_view">
                                <h5>Follow us:</h5>
                                <ul>
                                    <li>
                                       <a target="_blank" href="https://www.instagram.com/"> <img src={instagram} alt="Instagram icon" /></a>
                                    </li>
                                    <li>
                                      <a target="_blank" href="https://www.facebook.com/">  <img src={facebook} alt="facebook icon" /> </a>
                                    </li>
                                    <li>
                                      <a target="_blank" href="https://www.twitter.com/"> <img src={twitter} alt="Twitter icon" /> </a>
                                    </li>
                                </ul>

                            </div>

                        </div>

                    </div>


                    <div className="col-lg-9 pl-0 pr-0">
                        <div className="right-panel">
                            <div className="content-wrapper">
                                <div className="left-part">
                                    <h3>Safety Purpose</h3>
                                    <p>Edunext is committed towards safety and security of every stakeholder at school. Now you can self-register as parent and general visitor for your appointment at school.</p>
                                </div>
                                <div className="right-part d-none d-sm-block">
                                    <img src={visitor} alt="visitor-img" />
                                </div>

                            </div>


                            <div className="visitor-type">
                                <div className="visitor-heading">
                                    <h3>Choose the type of visitor you're</h3>
                                </div>

                                <div className="row">
                                <div className="col-sm-12">
                                        <div className="visitor-content guards-box" style={{ cursor: "pointer" }}
                                            onClick={() => props.history.push('/parentlogin')}>
                                            <div className="img-box">
                                                <img src={parentGuardian} alt="Guardian-img" />
                                            </div>
                                            <div className="content-box">
                                                <h4>Parents Visitor</h4>
                                                <p>Mark as owned by individuals.</p>
                                                <img className="arrowRight" src={arrowRight} alt="Arrow Right" />
                                            </div>
                                        </div>
                                    </div>
                                <div className="col-sm-12">
                                        <div className="visitor-content guards-box" style={{ cursor: "pointer" }}
                                            onClick={() => props.history.push('/login')}>
                                            <div className="img-box">
                                                <img src={newVisitor} alt="Guardian-img" />
                                            </div>
                                            <div className="content-box">
                                                <h4>Other Visitor</h4>
                                                <p>Login to Visit or Mark as a Visitor.</p>
                                                <img className="arrowRight" src={arrowRight} alt="Arrow Right" />
                                            </div>
                                        </div>
                                    </div>
                                  
                                    <div className="col-sm-12">
                                        <div className="visitor-content guards-box" style={{ cursor: "pointer" }}
                                            onClick={() => props.history.push('/guardLogin')}>
                                            <div className="img-box">
                                                <img src={guardIcon} alt="Guardian-img" />
                                            </div>
                                            <div className="content-box">
                                                <h4>Security Guard</h4>
                                                <p>Login to Visit or Mark as a present.</p>
                                                <img className="arrowRight" src={arrowRight} alt="Arrow Right" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="col-sm-12">
                                        <div className="visitor-content guards-box" style={{ cursor: "pointer" }}
                                            onClick={() => props.history.push('/studentAttendance')}>
                                            <div className="img-box">
                                                <img src={studentIcon} alt="Guardian-img" />
                                            </div>
                                            <div className="content-box">
                                                <h4>Student Attendance</h4>
                                                <p>Scan QR Code of Student ID Card.</p>
                                                <img className="arrowRight" src={arrowRight} alt="Arrow Right" />
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 pl-0 pr-0 footer_mobile">
                        <div className="side-panel">

                            <div className="contact-info">
                                <ul>
                                    <li>
                                        <div className="contact-content">
                                            <div className="icon-box">
                                            <img className="leftSideDivIcon" src={callIcon} alt="" />
                                                <h5>Contact No.</h5>
                                            </div>
                                            <div className="main-content">
                                                <p>{schoolData.school_mobile == undefined ? '-' : schoolData.school_mobile}</p>
                                            </div>

                                        </div>
                                    </li>

                                    <li>
                                        <div className="contact-content">
                                            <div className="icon-box">
                                            <img className="leftSideDivIcon" src={emailIcon} alt="" />
                                                <h5>Email</h5>
                                            </div>
                                            <div className="main-content">
                                                <p>{schoolData.school_email == undefined ? '-' : schoolData.school_email}</p>
                                            </div>

                                        </div>
                                    </li>

                                    <li>
                                        <div className="contact-content">
                                            <div className="icon-box">
                                            <img className="leftSideDivIcon" style={{width: "20px"}} src={webIcon} alt="" />
                                                <h5>Website</h5>
                                            </div>
                                            <div className="main-content">
                                                <p><a target="_blank" href={schoolData.website_link == undefined ? '-' : schoolData.website_link}>{schoolData.website_link && schoolData.website_link.replace(/^(?:https?:\/\/)?/i, "").split('/')[0]}</a></p>
                                            </div>
                                        </div>
                                    </li>

                                    <li>
                                        <div className="contact-content">
                                            <div className="icon-box">
                                            <img className="leftSideDivIcon" src={addressIcon} alt="" />
                                                <h5>Address</h5>
                                            </div>
                                            <div className="main-content">
                                                <p>{schoolData.school_address == undefined ? '-' : schoolData.school_address}</p>
                                            </div>

                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="social-icons">
                                <h5>Follow us:</h5>
                                <ul>
                                    <li>
                                       <a target="_blank" href="https://www.instagram.com/"> <img src={instagram} alt="Instagram icon" /></a>
                                    </li>
                                    <li>
                                      <a target="_blank" href="https://www.facebook.com/">  <img src={facebook} alt="facebook icon" /> </a>
                                    </li>
                                    <li>
                                      <a target="_blank" href="https://www.twitter.com/"> <img src={twitter} alt="Twitter icon" /> </a>
                                    </li>
                                </ul>

                            </div>

                        </div>

                    </div>


                </div>
            </section>
        </div>
    );
}

export default withRouter(SchoolSelected);