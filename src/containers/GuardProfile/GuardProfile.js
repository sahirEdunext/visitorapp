import React, { useState, useEffect } from 'react'
import './GuardProfile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Header from '../../components/Header/header'
import Footer from '../../components/Footer/Footer'
import DFooter from '../../components/DFooter/DFooter'
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Avatar } from '@material-ui/core';

const GuardProfile = (props) => {
  const useStyles = makeStyles({
    root: {
      flexGrow: 1,
      background: 'transparent',
      borderBottom: '2px solid #efefef',
      boxShadow: 'none',
    },
  });
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [profiledata,setProfileData]=useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const redirectMap=(addr)=>{
    window.location.href="https://www.google.co.in/maps/place/"+addr;
  }
  useEffect(()=>{
    setProfileData(JSON.parse(sessionStorage.authguard));
  },[]);
  return (
    <Container fluid className="Edu-container">
      <Row>
        <Col sm={6} className="left-col">
          <HeaderBackButton />
          <div className="Box-left">
            <div className='Welcome-text'>
              <p className="Welcome-text-small">Welcome to</p>
              <p className="Welcome-text-big">Edunext</p>
            </div>
          </div>
          <DFooter />
        </Col>
        <Col sm={6} className="right-col">
          <div className="Box-right">
            <div className="Guard-profile">
              <div className="G-profile-main">
                <div className="G-name">
                  <p className="name">{profiledata.name}</p>
                  <p className="post">Security Guard</p>
                </div>
                <div>
                  <Avatar 
                  src={profiledata.employee_image}
                  alt={profiledata.name} 
                  variant="square"
                  className="profile-img"
                  />
                </div>
              </div>
              <Paper className={classes.root}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab name="guard-detail" label="Guard Details" />
                  <Tab name="address" label="Address" />
                </Tabs>
              </Paper>
              {value ? 
              <div className="address-tab">
                  <p className=""><i className="icon-location" onClick={()=>redirectMap('H-182, Sector 63, Noida')}></i>{profiledata.address}</p>
              </div>
               :
              <table>
                <tbody>
                  <tr>
                    <td>
                      <p className="T-key">Employee code</p>
                      <p className="T-value">{profiledata.emp_code}</p>
                    </td>
                    <td>
                      <p className="T-key">Father Name</p>
                      <p className="T-value">{profiledata.fathername}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="T-key">Date of Birth</p>
                      <p className="T-value">{profiledata.dob}</p>
                    </td>
                    <td>
                      <p className="T-key">Joining Date</p>
                      <p className="T-value">{profiledata.joiningdate}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="T-key">Mobile No.</p>
                      <p className="T-value">{profiledata.mobileno}</p>
                    </td>
                    <td>
                      <p className="T-key">Email Id</p>
                      <p className="T-value">{profiledata.personalemailid}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              }
            </div>
          </div>
            <Header />
        </Col>
        <Footer />
      </Row>
    </Container>
  )
}

export default withRouter(GuardProfile);
