import React, { useState, useEffect } from "react";
import moment from "moment";
import id_card_icon from "../../icons/name.png";
import photo_icon from "../../icons/camera.png";
import appointment_date_icon from "../../icons/calendar.png";
import time_icon from "../../icons/time.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import DFooter from "../../components/DFooter/DFooter";
import {
  getGeneralPurpose,
  meetingToList,
  generalForm,
  getAvaiableSlot,
} from "../../service/backendService";
import Button from "@material-ui/core/Button";
import { ErrorNotification } from "../../components/ErrorNotification";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { FileUpload } from "../../components/FileUpload";

import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import HeaderBackButton from "../../components/HeaderBackButton/HeaderBackButton";
const GuardGeneral = (props) => {
  const [selectedDate, setAppointmentDate] = useState(new Date());
  const [selectedTime, setAppointmentTime] = useState(new Date());
  const [inputs, setInputs] = useState({
    name: "",
    mobileNo: "",
    meetingToId: "",
    purposeId: "",
    isAppointment: "",
    date: "",
    time: "",
    description: "",
    noOfPerson: "",
  });
  const [availableSlot, setAvailableSlot] = useState({});
  const handleTimeChange = (time) => {
    let currDate = new Date();
    currDate = Date.parse(currDate);
    let selDate = selectedDate.toDateString();
    let ftime = time.getHours() + ":" + time.getMinutes();
    let selTime = new Date(selDate + " " + ftime);
    selTime = Date.parse(selTime);
    if (currDate > selTime) {
      seterrorMessage("Please select future Time for Appointment");
      setAppointmentTime(selectedTime);
    } else {
      seterrorMessage("");
      setAppointmentTime(time);
    }
  };
  const handleDateChange = async (date) => {
    let currDate = new Date();
    let fcurrDate = new Date(
      currDate.getFullYear(),
      currDate.getMonth(),
      currDate.getDate()
    );
    let fdate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (fcurrDate > fdate) {
      seterrorMessage("Please select future Date for Appointment");
      setAppointmentDate(currDate);
    } else {
      seterrorMessage("");
      setAppointmentDate(date);
    }
    let requestOptions = {
      purposeid: inputs.purposeId,
      type: "general",
      date: moment(fdate).format("DD/MM/yyyy"),
    };
    await getAvaiableSlot(requestOptions)
      .then((res) => {
        setAvailableSlot(res.data.data)
        if(res.data.data.is_appointment_schedule !== undefined && res.data.data.is_appointment_schedule==true) {
          if(res.data.data.avlSlotTimeList !==undefined && res.data.data.avlSlotTimeList.length > 0) {

          } else {
            seterrorMessage("Time slot not available");
            setAppointmentTime("")
          }
        }
      })
      .catch((err) => {
        console.log("Guard Generalfrom time slot err", err);
      });
  };
  const activeCalendar = (elm) => {
    if (document.getElementById(elm) != undefined) {
      document.getElementById(elm).click();
    }
  };
  const [show_docs, setShowStatus] = useState(false);
  const [generalPurpose, setGeneralPurpose] = useState([]);
  const [meetingtolist, setmeetingToList] = useState([]);
  const [errorMessage, seterrorMessage] = useState("");

  const checkShowDocs =async (val) => {
    if (val.target.checked) {
      setShowStatus(true);
      let requestOptions = {
        purposeid: inputs.purposeId,
        type: "general",
        date: moment(new Date()).format("DD/MM/yyyy"),
      };
      await getAvaiableSlot(requestOptions)
        .then((res) => {
          setAvailableSlot(res.data.data);
          if(res.data.data.is_appointment_schedule !== undefined && res.data.data.is_appointment_schedule==true) {
            if(res.data.data.avlSlotTimeList !==undefined && res.data.data.avlSlotTimeList.length > 0) {
  
            } else {
              seterrorMessage("Time slot not available");
              setAppointmentTime("")
            }
          }
         
        })
        .catch((err) => {
          console.log("General from time slot err", err);
        });
    } else {
      setShowStatus(false);
    }
  };

  useEffect(() => {
    handleGeneralPurpose();
    handleMeetingToList();
  }, []);
  const handleGeneralPurpose = async () => {
    await getGeneralPurpose().then((res) => {
      setGeneralPurpose(res.data.data.purpose_list);
    });
  };
  const handleMeetingToList = async () => {
    await meetingToList().then((res) => {
      setmeetingToList(res.data.data.meeting_to_array);
    });
  };
  const [selectedId, setSelectedId] = useState();
  const [selectedIdFile, setSelectedIdFile] = useState([]);
  const [isIdPicked, setIsIdPicked] = useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState();
  const [selectedPhotoFile, setSelectedPhotoFile] = useState([]);
  const [isPhotoPicked, setIsPhotoPicked] = useState(false);

  const changeHandlerId = (files) => {
    setSelectedId(files.name);
    setSelectedIdFile(files);
    setIsIdPicked(true);
  };
  const changeHandlerPhoto = (files) => {
    setSelectedPhoto(files.name);
    setSelectedPhotoFile(files);
    setIsPhotoPicked(true);
  };
  const [open, setOpen] = useState(false);
  const handleClickOpen = (val) => {
    setOpen(val);
  };
  const [openphoto, setOpenPhoto] = useState(false);
  const handleClickOpenPhoto = (val) => {
    setOpenPhoto(val);
  };
  const [errors, setErrors] = useState({});

  const handleAvailableSlot = (e) => {
    e.preventDefault();
    let currDate = new Date();
    currDate = Date.parse(currDate);
    let selDate = selectedDate.toDateString();
    let ftime = e.target.value;
    let selTime = new Date(selDate + " " + ftime);
    selTime = Date.parse(selTime);
    if (currDate > selTime) {
      seterrorMessage("Please select future Time for Appointment");
      setAppointmentTime(selectedTime);
    } else {
      seterrorMessage("");
      setAppointmentTime(e.target.value);
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    inputs.name = e.target.name.value;
    inputs.mobileNo = e.target.mobileNo.value;
    inputs.description = e.target.description.value;
    // inputs.date=e.target.date.value;
    var dd = selectedDate.getDate();
    var mm = selectedDate.getMonth() + 1;
    var yyyy = selectedDate.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    inputs.date = dd + "/" + mm + "/" + yyyy;
    inputs.time = e.target.time !== undefined ? e.target.time.value: inputs.time;
    inputs.isAppointment = e.target.appointment.checked;
    const validationErrors = validate(inputs);
    const noErrors = Object.keys(validationErrors).length === 0;
    if (noErrors) {
      // Hit Api if no error
      const formData = new FormData();
      formData.append("idcard", selectedIdFile);
      formData.append("photo", selectedPhotoFile);
      formData.append("generalRequest", JSON.stringify(inputs));
      generalForm(formData)
        .then((res) => {
          props.history.push("/guard");
          //     props.history.push({pathname:'/complete',
          //     state:{
          //       data: res.data.data,
          //       persondata:{
          //         name:inputs.name,
          //         mobileno:inputs.mobileNo,
          //       }
          //     }
          //   })
        })
        .catch((err) => {
          if (err.response) {
            seterrorMessage('Error: '+ err.response.data.errors[0]["message"]);

            // seterrorMessage("Error: Appointment is Mandatory");
          } else {
            seterrorMessage("Error: Some error occurred");
          }
        });
    } else {
      console.log("errors try again", validationErrors);
      setErrors(validationErrors);
    }
  };
  const handleMobileInputChange = (event) => {
    if (event.target.value) {
      if (!event.target.value || !/^[0-9]{10}$/.test(event.target.value)) {
        setErrors({
          ...errors,
          [event.target.name]: "Please enter valid 10 digit mobile number",
        });
      } else {
        setErrors({ ...errors, [event.target.name]: "" });
      }
    } else {
      setErrors({
        ...errors,
        [event.target.name]: "Please enter valid 10 digit mobile number",
      });
    }
  };
  const handleTextInputChange = (event) => {
    if (event.target.value) {
      setErrors({ ...errors, [event.target.name]: "" });
    } else {
      setErrors({
        ...errors,
        [event.target.name]: "Please enter " + event.target.name,
      });
    }
  };
  const validate = (inputs) => {
    const error = {};
    if (!inputs.meetingToId) error.meetingToId = "Meeting To required";
    if (!inputs.noOfPerson) error.noOfPerson = "Number of person required";
    if (!inputs.purposeId) error.purposeId = "Please select purpose";
    // if (!inputs.organisationName)
    //     error.organisationName = 'Please enter Organisation name';
    if (!inputs.description) error.description = "Please enter Description";
    if (!inputs.mobileNo || !/^[0-9]{10}$/.test(inputs.mobileNo))
      error.mobileNo = "Please enter valid mobile number";
    if (!inputs.name) error.name = "Please enter Name";
    return error;
  };
  const handleSelectInputChange = (event) => {
    event.persist();
    setInputs({ ...inputs, [event.target.name]: event.target.value });
    if (event.target.value != 0) {
      setErrors({ ...errors, [event.target.name]: "" });
    } else {
      setErrors({
        ...errors,
        [event.target.name]: "Please select " + event.target.name,
      });
    }
  };
  return (
    <Container fluid className="Edu-container">
      <Row>
        <Col sm={6} className="left-col">
          <HeaderBackButton  />
          <div className="Box-left">
            <div className="Welcome-text">
              <p className="Welcome-text-big">General</p>
            </div>
          </div>
          <DFooter />
        </Col>
        <Col sm={6} className="right-col">
          <div className="Box-right">
            <div
              className="Admission-form General-form"
              style={{ padding: "7% 15%" }}
            >
              <form onSubmit={onSubmit} autoComplete="off">
                <div className="Login-fields">
                  <div className="Field-group Field-group-adm">
                    <label className="">Name</label>
                    <div className="Input-field">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className={
                          errors.name ? "Input-text text-error" : "Input-text"
                        }
                        onKeyUp={handleTextInputChange}
                        placeholder="Name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-danger">
                        <small>{errors.name}</small>
                      </p>
                    )}
                  </div>
                  <div className="Field-group Field-group-adm">
                    <label className="">Mobile No.</label>
                    <div className="Input-field">
                      <input
                        type="tel"
                        name="mobileNo"
                        maxlength="10"
                        id="mobileNo"
                        className={
                          errors.mobileNo
                            ? "Input-text text-error"
                            : "Input-text"
                        }
                        onKeyUp={handleMobileInputChange}
                        placeholder="Mobile No."
                      />
                    </div>
                    {errors.mobileNo && (
                      <p className="text-danger">
                        <small>{errors.mobileNo}</small>
                      </p>
                    )}
                  </div>
                  <div className="Field-group Field-group-adm">
                    <label className="">Meeting To</label>
                    <div className="Input-field">
                      <select
                        name="meetingToId"
                        className={
                          errors.meetingToId
                            ? "Input-text text-error"
                            : "Input-text"
                        }
                        onChange={handleSelectInputChange}
                      >
                        <option value="">Select Person</option>
                        {meetingtolist.map((item, key) => (
                          <option key={key} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.meetingToId && (
                      <p className="text-danger">
                        <small>{errors.meetingToId}</small>
                      </p>
                    )}
                  </div>
                  <div className="Field-group Field-group-adm">
                    <label className="">Number of Person</label>
                    <div className="Input-field">
                      <select
                        name="noOfPerson"
                        className={
                          errors.noOfPerson
                            ? "Input-text text-error"
                            : "Input-text"
                        }
                        onChange={handleSelectInputChange}
                      >
                        <option value="">Select Person</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                    {errors.noOfPerson && (
                      <p className="text-danger">
                        <small>{errors.noOfPerson}</small>
                      </p>
                    )}
                  </div>
                  {/* <div className="Field-group Field-group-adm">
                                    <label className="">Organisation Name</label>
                                    <div className="Input-field">
                                    <input type="text" name="organisationName" id="org_name" className={errors.organisationName?"Input-text text-error":"Input-text"} />
                                    </div>
                                </div> */}

                  <div className="Field-group Field-group-adm">
                    <label className="">Purpose</label>
                    <div className="Input-field">
                      <select
                        name="purposeId"
                        className={
                          errors.purposeId
                            ? "Input-text text-error"
                            : "Input-text"
                        }
                        onChange={handleSelectInputChange}
                      >
                        <option value="">Select Purpose</option>
                        {generalPurpose.map((item, key) => (
                          <option key={key} value={item.id}>
                            {Object.values(item.description)}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.purposeId && (
                      <p className="text-danger">
                        <small>{errors.purposeId}</small>
                      </p>
                    )}
                  </div>
                  <div className="Field-group Field-group-adm">
                    <label className="">Description</label>
                    <div className="Input-field">
                      <textarea
                        type="text"
                        name="description"
                        id="source"
                        className={
                          errors.description
                            ? "Input-textarea text-error"
                            : "Input-textarea"
                        }
                        rows="5"
                        onKeyUp={handleTextInputChange}
                      ></textarea>
                    </div>
                    {errors.description && (
                      <p className="text-danger">
                        <small>{errors.description}</small>
                      </p>
                    )}
                  </div>
                  <div className="Upload_area">
                    <div className="Field-group Field-group-adm Inline-block Photo-icon">
                      {isPhotoPicked ? (
                        <span className="doc-text">{selectedPhoto}</span>
                      ) : (
                        ""
                      )}
                      {/* <input type="file" id="upload-photo" name="photo" hidden onChange={changeHandlerPhoto}/> */}
                      <span
                        onClick={() => handleClickOpenPhoto(true)}
                        htmlFor="upload-photo"
                        className="Upload-id"
                      >
                        <img src={photo_icon} className="photo_icon" />
                        Upload Photo
                      </span>
                      {openphoto && (
                        <FileUpload
                          changeHandler={changeHandlerPhoto}
                          handleclickopen={handleClickOpenPhoto}
                        />
                      )}
                    </div>
                    <div className="Field-group Field-group-adm Inline-block Card-icon">
                      {isIdPicked ? (
                        <span className="doc-text">{selectedId}</span>
                      ) : (
                        ""
                      )}
                      {/* <input type="file" id="upload-id" name="idcard" hidden onChange={changeHandlerId}/> */}
                      <span
                        onClick={() => handleClickOpen(true)}
                        htmlFor="upload-id"
                        className="Upload-id"
                      >
                        <img src={id_card_icon} className="id_card_icon" />
                        Upload ID Card
                      </span>
                      {open && (
                        <FileUpload
                          changeHandler={changeHandlerId}
                          handleclickopen={handleClickOpen}
                        />
                      )}
                    </div>
                  </div>
                  <div className="appointment-div">
                    <span className="appointment-text">Appointment</span>
                    <input
                      type="checkbox"
                      id="switch"
                      name="appointment"
                      className="Admission-checkbox"
                      onChange={(val) => checkShowDocs(val)}
                    />
                    <label htmlFor="switch" className="toggle">
                      <p className="yes-no-text">Yes&nbsp;&nbsp;No</p>
                    </label>
                  </div>
                  <div
                    className={
                      show_docs
                        ? "App-date-time-block"
                        : "App-date-time-block hidden"
                    }
                  >
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <div className="Field-group Field-group-adm Inline-block app-date ml-0">
                        <label>Date</label>
                        <div className="calendar-body">
                          <DatePicker
                            format="dd MMMM, yyyy"
                            value={selectedDate}
                            name="date"
                            id="date"
                            className="date-input"
                            onChange={handleDateChange}
                          />
                          <div
                            className="date-icon"
                            onClick={() => activeCalendar("date")}
                          >
                            <img src={appointment_date_icon}></img>
                          </div>
                        </div>
                      </div>
                      <div className="Field-group Field-group-adm Inline-block">
                      
                        {availableSlot.is_appointment_schedule !== undefined ? (
                          <>
                            {availableSlot.is_appointment_schedule == true ? (
                                <>
                                {availableSlot.avlSlotTimeList !== undefined && availableSlot.avlSlotTimeList.length > 0 ? <> 
                                
                                  <label>Time</label>
                                  <div className="calendar-body time-body">
                              <div className="date-icon">
                                <img src={time_icon}></img>
                              </div>
                                <select
                                  name="time"
                                  className={
                                    errors.time
                                      ? "date date-input text-error"
                                      : "date date-input"
                                  }
                                  onChange={handleAvailableSlot}
                                >
                                 
                                  {availableSlot.avlSlotTimeList.map(
                                    (item, key) => (
                                      <option key={key} value={item}>
                                        {item}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                                
                                </>:<></> }
                                  
                              </>
                            ) : (
                              <>
                                <label>Time</label>
                                <div className="calendar-body time-body">
                                    <TimePicker
                                    value={selectedTime}
                                    ampm={false}
                                    name="time"
                                    id="time"
                                    className="date-input"
                                    onChange={handleTimeChange}
                                    />
                                    <div
                                    className="date-icon"
                                    onClick={() => activeCalendar("time")}
                                    >
                                    <img src={time_icon}></img>
                                    </div>
                                </div>
                                    </>
                                    )}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </MuiPickersUtilsProvider>
                  </div>
                </div>
                <div className="Button-container Adm-btn-container">
                  <Button
                    type="submit"
                    className="Adm-Btn-primary Btn-primary Btn-login Btn-animate"
                  >
                    Register
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Col>
        <Footer />
        {errorMessage && (
          <ErrorNotification error={errorMessage} seterror={seterrorMessage} />
        )}
      </Row>
    </Container>
  );
};

export default withRouter(GuardGeneral);
