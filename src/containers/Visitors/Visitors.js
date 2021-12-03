import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import VisitorCard from '../../components/VisitorCard/VisitorCard';
import "./Visitors.css";
import Header from '../../components/Header/header'
import Footer from '../../components/Footer/Footer'
import DFooter from '../../components/DFooter/DFooter'
import { Redirect } from 'react-router-dom'
import Modal from '../../components/Modal/Modal'
import { visitorsList, visitorCheckOut } from '../../service/backendService';
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import { ErrorNotification } from '../../components/ErrorNotification';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import reportIcon from '../../icons/g-re-icon.svg';
import outIcon from '../../icons/g-out-icon.svg';
import appIcon from '../../icons/g-app-icon.svg';
import inIcon from '../../icons/g-in-icon.svg';

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
  const [guardvisitorList, setguardvisitorList] = useState([]);
  const [customVistorArrName, setcustomVistorArrName] = useState(props.location.state ? props.location.state.name : "")
  const [custHeader, setcustHeader] = useState({})
  // const [visitorArrName, setvisitorArrName] = useState(initialState)
  const handlePopupData = (a) => {
    setPopupData(a)
  }

  useEffect(() => {
    getVisitorList();
  }, []);

  const getVisitorList = async () => {
    await visitorsList()
      .then(res => {
        // if(props.location.state !== undefined){
        //   var filteredData = res.data.data.visitor_array.filter(item => item.id == props.location.state);
        //   setguardvisitorList(filteredData);
        // }else{
        if (customVistorArrName == "checkout_array") {
          setguardvisitorList(res.data.data.checkout_array);
          setcustHeader({
            class: "GoutBox",
            img: "outIcon",
            text: "Check-Out",
          })

        } else if (customVistorArrName == "appointment_array") {
          setguardvisitorList(res.data.data.appointment_array);
          setcustHeader({
            class: "GappBox",
            img: "appIcon",
            text: "Appointment Visitor Lists",
          })

        } else if (customVistorArrName == "checkin_array") {
          setguardvisitorList(res.data.data.checkin_array);
          setcustHeader({
            class: "GinBox",
            img: "inIcon",
            text: "Check-In",
          })

        } else if (customVistorArrName == "visitor_array") {
          setguardvisitorList(res.data.data.visitor_array);
          setcustHeader({
            class: "GreBox",
            img: "reportIcon",
            text: "Visitor List",
          })
        }

        // console.log(customVistorArrName)
        // console.log(res.data.data.props.location.state)
        // }
      })
      .catch(err => {
        if (err.response) {
          seterrorMessage('Error: ' + err.response.data.message);
        } else {
          seterrorMessage('Error: Some error occurred');
        }
      });
  }
  const checkOut = (id, type) => {
    visitorCheckOut({ 'id': id, 'type': type })
      .then(res => {
        getVisitorList();
      })
      .catch(err => {
        if (err.response) {
          seterrorMessage('Error: ' + err.response.data.message);
        } else {
          seterrorMessage('Error: Some error occurred');
        }
      })
  }
  const classes = useStyles();
  const [sortvalue, setSortValue] = React.useState('name');
  const [open, setOpen] = React.useState(false);
  // const [searchValue, setSearchValue] = React.useState("");
  const [searchValue, setSearchValue] = useState("")


  const searchFilter = (event) => {
    setSearchValue(event.target.value);
  }


  const handleChange = (event) => {

    setSortValue(event.target.value);
    if (event.target.value == "name") {
      // let filteredNames = guardvisitorList.sort((a, b) => (a.name - b.name) ? 1 : -1)
      let filteredNames = guardvisitorList.sort((a, b) => a.name.localeCompare(b.name))

      setguardvisitorList(filteredNames);
    } else if (event.target.value == "purpose") {
      // let filteredCompany = guardvisitorList.sort((a, b) => (a.organisation_name - b.organisation_name) ? 1 : -1)
      let filteredCompany = guardvisitorList.sort((a, b) => a.purpose_name.localeCompare(b.purpose_name))
      setguardvisitorList(filteredCompany);

    }

  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  if (props.location.state == undefined) {
    return <Redirect to={`/${localStorage.getItem('school_id')}`} />
  } else {

    return (
      <Container fluid className="Edu-container">
        {/* {console.log(props.location.state)} */}

        <Row>
          <Col sm={6} className="left-col">
            <HeaderBackButton backGuard={true} />
            <div className="Box-left">
              {/* <div className='Welcome-text visitor-text'>
                <p className="visitor-text-medium"><b>Visitors List</b></p>
              </div> */}
              <div className="Welcome-text"><p className="Welcome-text-small">Welcome to</p><p className="Welcome-text-big">Edunext</p></div>
            </div>
            <DFooter />
          </Col>

          <Col sm={6} className="right-col">
            {/* {console.log(guardvisitorList)} */}
            <div className="Box-right pos-relative">
              <div className="Visitor-list-form">
                <div className={`d-flex flex-wrap justify-content-between gVis_b_box crsr-normal totalVis ${custHeader.class}`}>
                  <div>
                    <img className="nrml_icon" src={custHeader.text == "Check-Out" ? outIcon : custHeader.text == "Check-In" ? inIcon : custHeader.text == "Visitor List" ? reportIcon : custHeader.text == "Appointment Visitor Lists" ? appIcon : null} />

                    <span className="gvis_txt">{custHeader.text}</span></div>
                  <div className="circ_t_num">{guardvisitorList.length !== undefined ? guardvisitorList.length : 0}</div>
                </div>
                <div className='search-sort d-flex flex-wrap justify-content-between'>
                  <div className="search-box">
                    <input onChange={searchFilter} type="text" name="search_text" className="search-box-input" placeholder="Search by visitor's Name" autoComplete='off' />
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
                        <MenuItem value='purpose'>Sort By Purpose</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="Scrollable-div">
                  {
                    guardvisitorList.length == 0 ? <div>No Visitor found</div> :
                      guardvisitorList.filter((fitem, index) => (
                        fitem.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
                        // fitem.organisation_name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
                        // fitem.purpose_name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
                      ))
                        .map((item, id) => (
                          <div className="mb-4" key={id}><VisitorCard data={item} popupfn={handlePopupData} /></div>
                          // <div className="mb-4" key={id}><VisitorCard data={item} popupfn={handlePopupData} checkout={checkOut} /></div>
                        ))
                  }
                </div>
              </div>
              <Header />
            </div>

            <Modal title='Purpose' content={popupData} hidepopupfn={handlePopupData} />
          </Col>
          <Footer />
          {errorMessage &&
            <ErrorNotification error={errorMessage} seterror={seterrorMessage} />}
        </Row>
      </Container >
    );
  }
}

export default withRouter(Visitors);