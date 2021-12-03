import React, {useState, useEffect}from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import VisitorCardForQr from '../../components/VisitorCard/VisitorCardForQr';
import "./Visitors.css";
import Header from '../../components/Header/header'
import Footer from '../../components/Footer/Footer'
import DFooter from '../../components/DFooter/DFooter'
import Modal from '../../components/Modal/Modal'
import {visitorsList, visitorCheckOut} from '../../service/backendService';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import {ErrorNotification} from '../../components/ErrorNotification';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));
const Visitors = (props) => {
  const [popupData, setPopupData] = useState('');
  const [errorMessage, seterrorMessage] = useState('');
  const [visitorList, setVisitorList] = useState([]);
  const handlePopupData = (a)=>{
    setPopupData(a)
  }

  useEffect(()=> {
    getVisitorList();
  },[]);

  const getVisitorList = async () => {
    await visitorsList()
    .then(res => {
      if(props.location.state !== undefined){
        var filteredData = res.data.data.visitor_array.filter(item => item.id == props.location.state).length !== 0 ? res.data.data.visitor_array.filter(item => item.id == props.location.state) : res.data.data.appointment_array.filter(item => item.id == props.location.state);
        setVisitorList(filteredData);
        // console.log(res.data.data.visitor_array.filter(item => item.id == props.location.state).length > 0)
      }else{
      setVisitorList(res.data.data.visitor_array);
      }
    })
    .catch(err => {
      if(err.response){
        seterrorMessage('Error: '+err.response.data.message);
      }else{
        seterrorMessage('Error: Some error occurred');
      }
    });
  }
  const checkOut=(id, type)=>{
    visitorCheckOut({'id':id, "type": type})
    .then(res => {
        getVisitorList();
    })
    .catch(err=>{
      if(err.response){
        seterrorMessage('Error: '+err.response.data.message);
      }else{
        seterrorMessage('Error: Some error occurred');
      }
    })
  }
  const classes = useStyles();
  const [sortvalue, setSortValue] = React.useState('name');
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const searchFilter = (event) => {
    setSearchValue(event.target.value);
  }
  

  const handleChange = (event) => {

    setSortValue(event.target.value);
    if(event.target.value=="name") {
      let filteredNames = visitorList.sort((a, b) => (a.name - b.name) ? 1 : -1)
      
      setVisitorList(filteredNames);
    } else if(event.target.value=="company") {
      let filteredCompany = visitorList.sort((a, b) => (a.organisation_name - b.organisation_name) ? 1 : -1)
      setVisitorList(filteredCompany);
      
    }

  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
    
    return(
    <Container fluid className="Edu-container">
      <Row>
        <Col sm={6} className="left-col">
          <HeaderBackButton backGuard={true}/> 
          <div className="Box-left">
            <div className='Welcome-text visitor-text'>
              <p className="visitor-text-medium"><b>Visitors List</b></p>
            </div>
          </div>
          <DFooter/>
        </Col>
        <Col sm={6} className="right-col">
          <div className="Box-right pos-relative d-flex justify-content-center align-items-center">
            <div className="w-100">
              {/* <div className="mobile-hide">
                <img className="" src={avatar} width="40px"/>
              </div> */}
              {/* <div className='search-sort d-flex flex-wrap justify-content-between'>
                <div className="search-box">
                  <input onChange={searchFilter} type="text" name="search_text" className="search-box-input" placeholder="Search Visitor" autoComplete='off'/>
                  <button className="search-btn" type="submit"><i className="search-icon"></i></button>
                </div>
                <div className="sort-box">
                  <i className="icon-sort"></i>
                  <FormControl className={classes.formControl}>
                    <Select
                      open={open}
                      onClose={handleClose}
                      onOpen={handleOpen}
                      value={sortvalue}
                      onChange={handleChange}
                      placeholder="Filter"
                    >
                      <MenuItem value='name'>Sort By Name</MenuItem>
                      <MenuItem value='company'>Sort By Company</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div> */}
              <div className="">
              {
                  visitorList.length == 0 ? <div>No Visitor found</div> : 
                 
                  visitorList.filter((fitem, index) => (
                    fitem.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 || 
                    fitem.organisation_name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 || 
                    fitem.purpose_name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
                  ))
                  .map((item,id) => (
                      <div className="ml-2" key={id}><VisitorCardForQr data={item} popupfn={handlePopupData} checkout={checkOut} /></div>
                  ))
              }
              </div>
            </div>
            <Header/>
          </div>
          <Modal title='Purpose' content={popupData} hidepopupfn={handlePopupData}/>
        </Col>
        <Footer/>
        {errorMessage &&
        <ErrorNotification error={errorMessage} seterror={seterrorMessage}/>}
      </Row>
    </Container>
    );
}

export default withRouter(Visitors);