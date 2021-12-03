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
import Footer from "../../components/Footer/Footer";
import DFooter from "../../components/DFooter/DFooter";
import { FileUpload } from "../../components/FileUpload";
import { withRouter } from "react-router-dom";
import {
  getClasses,
  admissionForm,
  getSourceOfInformationList,
  getAvaiableSlot,
} from "../../service/backendService";
import Button from "@material-ui/core/Button";
import { ErrorNotification } from "../../components/ErrorNotification";
import DateFnsUtils from "@date-io/date-fns";
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import HeaderBackButton from "../../components/HeaderBackButton/HeaderBackButton";
const Admission = (props) => {
  const [inputs, setInputs] = useState({
    childName: "",
    classId: "",
    dob: "",
    parentName: "",
    emailId: "",
    phoneNo: "",
    address: "",
    isAppointment: "",
    date: "",
    time: "",
    genderId: "",
    sourceInformationId: "",
  });
  const [show_docs, setShowStatus] = useState(false);
  const [classes, setClases] = useState([]);
  const [sourcelist, setSourceOfInformation] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorMessage, seterrorMessage] = useState("");
  const [selectedDate, setAppointmentDate] = useState(new Date());
  const [selectedTime, setAppointmentTime] = useState(new Date());
  const [selectedDob, setDOB] = useState(null);
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
      purposeid: "",
      type: "admission",
      date: moment(fdate).format("DD/MM/yyyy"),
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
        console.log("Guard Admission from time slot err", err);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    inputs.dob = e.target.dob.value;
    inputs.isAppointment = e.target.isAppointment.checked;
    // inputs.date = e.target.date.value;
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
    const validationErrors = validate(inputs);
    const noErrors = Object.keys(validationErrors).length === 0;
    if (noErrors) {
      setErrors({});
      // Hit Api if no error
      const formData = new FormData();
      formData.append("idcard", selectedIdFile);
      formData.append("photo", selectedPhotoFile);
      formData.append("admissionRequest", JSON.stringify(inputs));
      admissionForm(formData)
        .then((res) => {
          props.history.push("/guard");
          //     props.history.push({pathname:'/complete',
          //     state:{
          //       data: res.data.data,
          //       persondata:{
          //           name:inputs.childName,
          //           mobileno:inputs.phoneNo,
          //       }
          //     }
          //   })
        })
        .catch((err) => {
            seterrorMessage('Error: '+ err.response.data.errors[0]["message"]);
        });
    } else {
      console.log("errors try again", validationErrors);
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    handleClasses();
    handleSourceOfInformation();
  }, []);

  const handleClasses = async () => {
    await getClasses()
      .then((res) => {
        setClases(res.data.data.class_array);
      })
      .catch((err) => {
        seterrorMessage("Error: Some error occurred please reload");
      });
  };
  const handleSourceOfInformation = async () => {
    await getSourceOfInformationList()
      .then((res) => {
        setSourceOfInformation(res.data.data.source_information_list);
      })
      .catch((err) => {
        seterrorMessage("Error: Some error occurred please reload");
      });
  };
  const activeCalendar = (elm) => {
    if (document.getElementById(elm) != undefined) {
      document.getElementById(elm).click();
    }
  };
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
  const handleDobChange = (date) => {
    if (date) {
      setErrors({ ...errors, dob: "" });
    } else {
      setErrors({ ...errors, dob: "Please enter DOB" });
    }
    const currentDate = new Date();
    if (date.getTime() > currentDate.getTime()) {
      seterrorMessage("You cannot choose future DOB");
      setDOB(null);
    } else {
      seterrorMessage("");
      setDOB(date);
    }
  };
  const checkShowDocs = async (val) => {
    if (val.target.checked) {
      setShowStatus(true);
      let requestOptions = {
        purposeid: "",
        type: "admission",
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
        console.log("admission from time slot response", err);
      });
    } else {
      setShowStatus(false);
    }
  };
  const validate = (inputs) => {
    const error = {};
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!inputs.childName) error.childName = "Please enter child name";
    if (!inputs.classId) error.classId = "Please enter class";
    if (!inputs.parentName) error.parentName = "Please enter parent name";
    if (!emailRegex.test(inputs.emailId))
      error.emailId = "Please enter valid email address";
    if (!inputs.phoneNo || !/^[0-9]{10}$/.test(inputs.phoneNo))
      error.phoneNo = "Please enter valid mobile number";
    if (!inputs.address) error.address = "Please enter address";
    if (!inputs.dob) error.dob = "Please select DOB";
    if (!inputs.sourceInformationId)
      error.sourceInformationId = "Please select Source of Information";
    if (!inputs.genderId) error.genderId = "Please select Gender";
    return error;
  };
  const handleInputChange = (event) => {
    event.persist();
    setErrors({ ...errors, [event.target.name]: "" });
    setInputs({ ...inputs, [event.target.name]: event.target.value });
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

  const handleEmailInputChange = (event) => {
    if (event.target.value) {
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(inputs.emailId)) {
        setErrors({
          ...errors,
          [event.target.name]: "Please enter valid email address",
        });
      } else {
        setErrors({ ...errors, [event.target.name]: "" });
      }
    } else {
      setErrors({
        ...errors,
        [event.target.name]: "Please enter valid email address",
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
              <p className="Welcome-text-big">Admission</p>
            </div>
          </div>
          <DFooter />
        </Col>
        <Col sm={6} className="right-col">
          <div className="Box-right">
            <div className="Admission-form">
              <form onSubmit={onSubmit} autoComplete="off">
                <div className="Login-fields">
                  <div className="Field-group Field-group-adm">
                    <label className="">Child Name</label>
                    <div className="Input-field">
                      <input
                        type="text"
                        name="childName"
                        onKeyPress={(event) => { 
                          if(!/[a-zA-Z ]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        id="childName"
                        className={
                          errors.childName
                            ? "Input-text text-error"
                            : "Input-text"
                        }
                        onChange={handleInputChange}
                        onKeyUp={handleTextInputChange}
                      />
                    </div>
                    {errors.childName && (
                      <p className="text-danger">
                        <small>{errors.childName}</small>
                      </p>
                    )}
                  </div>
                  <div className="d-flex flex-wrap justify-content-between">
                    <div className="Field-group Field-group-adm elm-class">
                      <label className="">Class</label>
                      <div className="Input-field">
                        <select
                          name="classId"
                          className={
                            errors.classId
                              ? "class Input-text text-error"
                              : "class Input-text"
                          }
                          onChange={handleSelectInputChange}
                        >
                          <option value="0">Select Class</option>
                          {classes.map((item, key) => (
                            <option key={key} value={Object.keys(item)}>
                              {Object.values(item)}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.classId && (
                        <p className="text-danger">
                          <small>{errors.classId}</small>
                        </p>
                      )}
                    </div>
                    <div className="Field-group Field-group-adm">
                      <label>DOB</label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <div className="calendar-body">
                          <DatePicker
                            format="dd/MM/yyyy"
                            value={selectedDob}
                            name="dob"
                            id="dob"
                            onChange={handleDobChange}
                            className={
                              errors.dob ? "dob-input dob-error" : "dob-input"
                            }
                            placeholder="DD/MM/YYYY"
                          />
                          <i
                            className="dob-icon"
                            onClick={() => activeCalendar("dob")}
                          ></i>
                        </div>
                        {errors.dob && (
                          <p className="text-danger">
                            <small>{errors.dob}</small>
                          </p>
                        )}
                      </MuiPickersUtilsProvider>
                    </div>
                  </div>
                  <div className="Field-group Field-group-adm">
                    <label className="">Gender</label>
                    <div className="Input-field d-flex flex-wrap">
                      <div>
                        <i className="male-icon"></i>
                        <label htmlFor="male" className="gender-label">
                          Male
                        </label>
                        <input
                          type="radio"
                          id="male"
                          name="genderId"
                          value="1"
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <i className="female-icon"></i>
                        <label htmlFor="female" className="gender-label">
                          Female
                        </label>
                        <input
                          type="radio"
                          id="female"
                          name="genderId"
                          onChange={handleInputChange}
                          value="2"
                        />
                      </div>
                    </div>
                    {errors.genderId && (
                      <p className="text-danger">
                        <small>{errors.genderId}</small>
                      </p>
                    )}
                  </div>
                  <div className="Field-group Field-group-adm">
                    <label className="">Parent's Name</label>
                    <div className="Input-field">
                      <input
                        type="text"
                        name="parentName"
                        id="parentName"
                        onKeyPress={(event) => { 
                          if(!/[a-zA-Z ]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        className={
                          errors.parentName
                            ? "Input-text text-error"
                            : "Input-text"
                        }
                        onChange={handleInputChange}
                        onKeyUp={handleTextInputChange}
                      />
                    </div>
                    {errors.parentName && (
                      <p className="text-danger">
                        <small>{errors.parentName}</small>
                      </p>
                    )}
                  </div>
                  <div className="Field-group Field-group-adm">
                    <label className="">Email ID</label>
                    <div className="Input-field">
                      <input
                        type="text"
                        name="emailId"
                        id="emailId"
                        className={
                          errors.emailId
                            ? "Input-text text-error"
                            : "Input-text"
                        }
                        onChange={handleInputChange}
                        onBlur={handleEmailInputChange}
                      />
                    </div>
                    {errors.emailId && (
                      <p className="text-danger">
                        <small>{errors.emailId}</small>
                      </p>
                    )}
                  </div>
                  <div className="Field-group Field-group-adm">
                    <label className="">Mobile No.</label>
                    <div className="Input-field">
                      <input
                        type="text"
                        name="phoneNo"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        maxLength="10"
                        id="phoneNo"
                        className={
                          errors.phoneNo
                            ? "Input-text text-error"
                            : "Input-text"
                        }
                        onChange={handleInputChange}
                        onBlur={handleMobileInputChange}
                      />
                    </div>
                    {errors.phoneNo && (
                      <p className="text-danger">
                        <small>{errors.phoneNo}</small>
                      </p>
                    )}
                  </div>
                  <div className="Field-group Field-group-adm">
                    <label className="">Address</label>
                    <div className="Input-field">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        className={
                          errors.address
                            ? "Input-text text-error"
                            : "Input-text"
                        }
                        onChange={handleInputChange}
                        onKeyUp={handleTextInputChange}
                      />
                    </div>
                    {errors.address && (
                      <p className="text-danger">
                        <small>{errors.address}</small>
                      </p>
                    )}
                  </div>
                  <div className="Field-group Field-group-adm">
                    <label className="">Source of Information</label>
                    <div className="Input-field">
                      <select
                        name="sourceInformationId"
                        className={
                          errors.sourceInformationId
                            ? "source Input-text text-error"
                            : "source Input-text"
                        }
                        onChange={handleSelectInputChange}
                      >
                        <option value="">Select Source Of Information</option>
                        {sourcelist.map((item, key) => (
                          <option key={key} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.sourceInformationId && (
                      <p className="text-danger">
                        <small>{errors.sourceInformationId}</small>
                      </p>
                    )}
                  </div>
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
                    name="isAppointment"
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
export default withRouter(Admission);
