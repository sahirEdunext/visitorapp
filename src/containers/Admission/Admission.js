import React, { useState, useEffect } from "react";
import moment from "moment";
import id_card_icon from "../../icons/name.png";
import photo_icon from "../../icons/camera.png";
// import appointment_date_icon from "../../icons/calendar.png";
import time_icon from "../../icons/time.png";
import appointment_date_icon from "../../icons/calBgImg.svg";
import appointment_time_icon from "../../icons/timeAppointment.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import Footer from "../../components/Footer/Footer";
import DFooter from "../../components/DFooter/DFooter";
import { withRouter } from "react-router-dom";
import genderIcon from "../../icons/genderIcon.svg";
import "./Admission.css";
import {
  getClasses,
  admissionForm,
  getSourceOfInformationList,
  getAvaiableSlot,
} from "../../service/backendService";
import Button from "@material-ui/core/Button";
import { ErrorNotification } from "../../components/ErrorNotification";
import DateFnsUtils from "@date-io/date-fns";
import { FileUploadForVisitor } from "../../components/FileUploadForVisitor";

import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import HeaderBackButton from "../../components/HeaderBackButton/HeaderBackButton";
const Admission = (props) => {
  const [show_docs, setShowStatus] = useState(false);
  const [appointmentTrue, setappointmentTrue] = useState(false);
  const [currTime, setcurrTime] = useState(
    new Date().getHours() + ":" + new Date().getMinutes()
  );
  const [selectedPhotoFile, setSelectedPhotoFile] = useState({
    visitorPhoto: "",
    visitorIdPhoto: "",
  });
  const [dataForThankyou, setdataForThankyou] = useState({
    purposeName: "Admission",
    // meetingToName: "",
    visitorName: props.location.state.name,
    appointmentType: appointmentTrue,
    visitorPhotoForId: "",
  })

  const [classes, setClases] = useState([]);
  const [sourcelist, setSourceOfInformation] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorMessage, seterrorMessage] = useState("");
  const [selectedDate, setAppointmentDate] = useState(new Date());
  const [selectedDob, setDOB] = useState(null);
  const [selectedTime, setAppointmentTime] = useState(new Date());
  const [availableSlot, setAvailableSlot] = useState({});
  const [inputs, setInputs] = useState({
    childName: "",
    classId: "",
    dob: "",
    parentName: "",
    emailId: "",
    phoneNo: "",
    address: "",
    isAppointment: appointmentTrue,
    date: appointmentTrue ? "" : moment(new Date()).format("DD/MM/yyyy"),
    time: appointmentTrue ? "" : currTime,
    genderId: "",
    sourceInformationId: "",
  });

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

  const handleAvailableSlot = (e) => {
    e.preventDefault();
    let currDate = new Date();
    currDate = Date.parse(currDate);
    let selDate = selectedDate.toDateString();
    let ftime = e.target.value;
    let selTime = new Date(selDate + " " + ftime);
    selTime = Date.parse(selTime);
    if (currDate > selTime) {
      // seterrorMessage("Please select future Time for Appointment");
      setErrors({ ...errors, ["timeErr"]: "Please select future Time for Appointment" });
      setAppointmentTime(selectedTime);
    } else {
      seterrorMessage("");
      setAppointmentTime(e.target.value);
      setErrors({ ...errors, ["timeErr"]: "" });
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
      // purposeid: "",
      type: "admission",
      date: moment(fdate).format("DD/MM/yyyy"),
    };
    await getAvaiableSlot(requestOptions)
      .then((res) => {
        setAvailableSlot(res.data.data);
        if (
          res.data.data.is_appointment_schedule !== undefined &&
          res.data.data.is_appointment_schedule == true
        ) {
          if (
            res.data.data.avlSlotTimeList !== undefined &&
            res.data.data.avlSlotTimeList.length > 0
          ) {
          } else {
            seterrorMessage("Time slot not available");
            setAppointmentTime("");
          }
        }
      })
      .catch((err) => {
        console.log("admission from time slot response", err);
      });
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
  const checkShowDocs = async (e) => {
    // handleDateChange(new Date());
    setdataForThankyou({ ...dataForThankyou, "appointmentType": e.target.value });
    setappointmentTrue(e.target.value);

    if (e.target.value === "true") {
      setShowStatus(true);
      let requestOptions = {
        purposeid: "",
        type: "admission",
        date: moment(new Date()).format("DD/MM/yyyy"),
      };
      await getAvaiableSlot(requestOptions)
        .then((res) => {
          setAvailableSlot(res.data.data);
          if (
            res.data.data.is_appointment_schedule !== undefined &&
            res.data.data.is_appointment_schedule == true
          ) {
            if (
              res.data.data.avlSlotTimeList !== undefined &&
              res.data.data.avlSlotTimeList.length > 0
            ) {
            } else {
              seterrorMessage("Time slot not available");
              setAppointmentTime("");
            }
          }
        })
        .catch((err) => {
          console.log("admission from time slot response", err);
        });
    } else {
      setShowStatus(false);
      // setInputs({ ...inputs, ["date"]:  moment(new Date()).format("DD/MM/yyyy")});
      // setInputs({ ...inputs, ["time"]: currTime});
      // console.log(inputs);
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
    // if (appointmentTrue == "") error.apptType = "Please select visit type";
    if (!inputs.dob) error.dob = "Please select DOB";
    if (!inputs.sourceInformationId)
      error.sourceInformationId = "Please select Source of Information";
    if (!inputs.genderId) error.genderId = "Please select Gender";
    if (selectedPhotoFile.visitorPhoto === "") error.visitorphoto = "Please capture visitor photo";
    if (selectedPhotoFile.visitorIdPhoto === "") error.visitoridphoto = "Please capture visitor id photo";
    if (inputs.date == moment(new Date()).format("DD/MM/yyyy")) {
      var regex = new RegExp(':', 'g'),
        inputTime = inputs.time,
        currentTime = currTime;
      if (parseInt(inputTime.replace(regex, ''), 10) < parseInt(currentTime.replace(regex, ''), 10)) {
        // console.log('timeStr1 is smaller then timeStr2');
        error.timeErr = "Please select future Time for Appointment";
      }
    }
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
  // const [selectedPhotoFile, setSelectedPhotoFile] = useState([]);
  const [isPhotoPicked, setIsPhotoPicked] = useState(false);

  const changeHandlerId = (files) => {
    setSelectedPhotoFile({ ...selectedPhotoFile, visitorIdPhoto: files });
    setSelectedId(files.name);
    // setSelectedIdFile(files);
    setIsIdPicked(true);
    setErrors({
      ...errors,
      ["visitoridphoto"]: "",
    });
  };
  const changeHandlerPhoto = (files, imageSrc) => {
    setSelectedPhotoFile({ ...selectedPhotoFile, visitorPhoto: files });
    setSelectedPhoto(files.name);
    // setSelectedPhotoFile(files);
    setdataForThankyou({ ...dataForThankyou, "visitorPhotoForId": imageSrc });
    setIsPhotoPicked(true);
    setErrors({
      ...errors,
      ["visitorphoto"]: "",
    });
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

  const handleTextParentInputChange = (event) => {
    if (event.target.value) {
      setErrors({ ...errors, [event.target.name]: "" });
    } else {
      setErrors({
        ...errors,
        [event.target.name]: "Please enter parent name"
      });
    }
  };
  const handleChildInputChange = (event) => {
    if (event.target.value) {
      setErrors({ ...errors, [event.target.name]: "" });
    } else {
      setErrors({
        ...errors,
        [event.target.name]: "Please enter child name"
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

  const handleSelectSrcInputChange = (event) => {
    event.persist();
    setInputs({ ...inputs, [event.target.name]: event.target.value });
    if (event.target.value != 0) {
      setErrors({ ...errors, [event.target.name]: "" });
    } else {
      setErrors({
        ...errors,
        [event.target.name]: "Please select Source of Information"
      });
    }
  };


  const onSubmit = (e) => {

    e.preventDefault();
    inputs.dob = e.target.dob.value;
    inputs.isAppointment = appointmentTrue;
    inputs.time = e.target.time !== undefined ? e.target.time.value : inputs.time;
    inputs.date = e.target.date.value;
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
    const validationErrors = validate(inputs);
    const noErrors = Object.keys(validationErrors).length === 0;
    console.log(inputs);
    // console.log(selectedPhotoFile);
    if (noErrors) {
      setErrors({});
      // Hit Api if no error
      const formData = new FormData();
      // formData.append("idcard", selectedIdFile);
      // formData.append("photo", selectedPhotoFile);
      formData.append("photo", selectedPhotoFile.visitorPhoto);
      formData.append("idcard", selectedPhotoFile.visitorIdPhoto);
      const sessionData = JSON.parse(JSON.parse(sessionStorage.authData));
      inputs.regName = sessionData.name;
      inputs.regMobileNo = sessionData.mobileno;
      formData.append("admissionRequest", JSON.stringify(inputs));

      admissionForm(formData)
        .then((res) => {
          props.history.push({
            pathname: "/thankyou",
            state: {
              data: res.data.data,
              dataForThankyou: dataForThankyou,
            },
          });
        })
        .catch((err) => {
          // seterrorMessage("Error: " + err.response.data.errors[0]["message"]);
          if (err.response.data.errors) {
            seterrorMessage("Error: " + err.response.data.errors[0]["message"]);
          } else {
            seterrorMessage(err.response.data.message);
          }
          // seterrorMessage("Error: Appointment is Mandatory");
        });
    } else {
      console.log("errors try again", validationErrors);
      setErrors(validationErrors);
    }
  };
  const handleSelectGenderInputChange = (event) => {
    event.persist();
    setInputs({ ...inputs, [event.target.name]: event.target.value });
    if (event.target.value != 0) {
      setErrors({ ...errors, [event.target.name]: "" });
    } else {
      setErrors({
        ...errors,
        [event.target.name]: "Please select Gender"
      });
    }
  };

  const handleSelectClassInputChange = (event) => {
    event.persist();
    setInputs({ ...inputs, [event.target.name]: event.target.value });
    if (event.target.value != 0) {
      setErrors({ ...errors, [event.target.name]: "" });
    } else {
      setErrors({
        ...errors,
        [event.target.name]: "Please select class"
      });
    }
  };
  return (
    <Container fluid className="Edu-container">
      <Row>
        <Col sm={6} className="left-col">
          <HeaderBackButton />
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
                <h4 className="btn_upper_heading text-left mt-4">Admission</h4>
                <div className="modal-body d-sm-flex my-sm-3 p-0">
                  <div>
                    <input
                      className="vistor-buttons"
                      onChange={(e) => checkShowDocs(e)}
                      name="visitType"
                      id="WalkIn"
                      value="false"
                      type="radio"
                    />
                    <label
                      className={`m-0 nrml_vis_btn visLabel upp_app_btn ${appointmentTrue ? "" : "actvwlknBtn"}`}
                      htmlFor="WalkIn"
                    >
                      <div className={`visitorTypeIcon walkin ${appointmentTrue ? "" : "actvWalkingImg"}`}></div> Walk-In
                    </label>
                  </div>
                  <div>
                    <input
                      className="vistor-buttons"
                      onChange={(e) => checkShowDocs(e)}
                      name="visitType"
                      id="ScheduleAppointment"
                      value="true"
                      type="radio"
                    />
                    <label
                      className="m-0 nrml_vis_btn ml-sm-2 visLabel upp_app_btn"
                      htmlFor="ScheduleAppointment"
                    >
                      <div className="visitorTypeIcon sAppoint"></div> Schedule
                      Appointment
                    </label>

                  </div>
                </div>
                {errors.apptType && (
                  <p style={{ fontSize: "14px" }} className="text-danger">
                    {errors.apptType}
                  </p>
                )}
                <div className="Login-fields p-registerForm row">
                  <div className="Field-group Field-group-adm col-md-6 mb-2 px-0 pr-sm-1">
                    <label className="reg_form_heading">Child Name</label>
                    <div className="Input-field">
                      <input
                        type="text"
                        name="childName"
                        id="childName"
                        placeholder="Enter Child Name"
                        onKeyPress={(event) => {
                          if (!/[a-zA-Z ]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        className={
                          errors.childName
                            ? "Input-text text-error"
                            : "Input-text"
                        }
                        onChange={handleInputChange}
                        onKeyUp={handleChildInputChange}
                      />
                    </div>
                    {errors.childName && (
                      <p className="text-danger">
                        <small>{errors.childName}</small>
                      </p>
                    )}
                  </div>
                  <div className="Field-group Field-group-adm col-md-6 mb-2 px-0 pl-sm-1">
                    <div className="">
                      <label className="reg_form_heading">Class</label>
                      <div className="Input-field">
                        <select
                          name="classId"
                          className={
                            errors.classId
                              ? "class Input-text text-error"
                              : "class Input-text"
                          }
                          onChange={handleSelectClassInputChange}
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
                  </div>
                  <div className="Field-group Field-group-adm col-md-6 mb-2 px-0 pr-sm-1">
                    <label className="reg_form_heading">Date of Birth</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <div className="calendar-body dob-input-div">
                        <DatePicker
                          format="dd/MM/yyyy"
                          value={selectedDob}
                          name="dob"
                          id="dob"
                          onChange={handleDobChange}
                          className={
                            errors.dob ? "dob-input dob-error" : "dob-input"
                          }
                          placeholder="Enter Date of Birth"
                          autoOk="true"
                          disableFuture="true"
                          okLabel=""
                        />
                        <img
                          className="InputDateIcon"
                          src={appointment_date_icon}
                          onClick={() => activeCalendar("dob")}
                          alt=""
                        ></img>
                      </div>
                    </MuiPickersUtilsProvider>
                    {errors.dob && (
                      <p className="text-danger">
                        <small>{errors.dob}</small>
                      </p>
                    )}
                  </div>
                  <div className="Field-group Field-group-adm col-md-6 mb-2 px-0 pl-sm-1">
                    <label className="reg_form_heading">Gender</label>
                    <div className="Input-field d-flex flex-wrap">
                      <select
                        name="genderId"
                        className={
                          errors.genderId
                            ? " Input-text text-error"
                            : " Input-text"
                        }
                        onChange={handleSelectGenderInputChange}
                      >
                        <option value="0">Select Gender</option>
                        <option id="male" value="1">
                          Male
                        </option>
                        <option id="female" value="2">
                          Female
                        </option>
                      </select>
                    </div>
                    {errors.genderId && (
                      <p className="text-danger">
                        <small>{errors.genderId}</small>
                      </p>
                    )}
                  </div>
                  <div className="Field-group Field-group-adm col-md-6 mb-2 px-0 pr-sm-1">
                    <label className="reg_form_heading">Parent's Name</label>
                    <div className="Input-field">
                      <input
                        type="text"
                        name="parentName"
                        id="parentName"
                        placeholder="Enter Parent's Name"
                        onKeyPress={(event) => {
                          if (!/[a-zA-Z ]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        className={
                          errors.parentName
                            ? "Input-text text-error"
                            : "Input-text"
                        }
                        onChange={handleInputChange}
                        onKeyUp={handleTextParentInputChange}
                      />
                    </div>
                    {errors.parentName && (
                      <p className="text-danger">
                        <small>{errors.parentName}</small>
                      </p>
                    )}
                  </div>
                  <div className="Field-group Field-group-adm col-md-6 mb-2 px-0 pl-sm-1">
                    <label className="reg_form_heading">Email ID</label>
                    <div className="Input-field">
                      <input
                        type="text"
                        name="emailId"
                        id="emailId"
                        placeholder="Enter Your Email Id"
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
                  <div className="Field-group Field-group-adm col-md-6 mb-2 px-0 pr-sm-1">
                    <label className="reg_form_heading">Mobile No.</label>
                    <div className="Input-field">
                      <input
                        type="text"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        name="phoneNo"
                        maxLength="10"
                        id="phoneNo"
                        placeholder="Enter Mobile Number"
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
                  <div className="Field-group Field-group-adm col-md-6 mb-2 px-0 pl-sm-1">
                    <label className="reg_form_heading">
                      Source of Information
                    </label>
                    <div className="Input-field">
                      <select
                        name="sourceInformationId"
                        className={
                          errors.sourceInformationId
                            ? "source Input-text text-error"
                            : "source Input-text"
                        }
                        onChange={handleSelectSrcInputChange}
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
                  <div className="Field-group Field-group-adm col-md-12 px-0">
                    <label className="reg_form_heading">Address</label>
                    <div className="Input-field">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        placeholder="Enter Your Address"
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
                </div>
                <div className="Upload_area mt-2 d-sm-flex">
                  <div className="position-relative">
                    {/* {isPhotoPicked ? (
                      <span className=" imgUploadedTxt">{selectedPhoto}</span>
                    ) : (
                      ""
                    )} */}
                    <input
                      type="file"
                      id="upload-photo"
                      name="photo"
                      hidden
                      onChange={changeHandlerPhoto}
                    />
                    {/* <span
                      onClick={() => handleClickOpenPhoto(true)}
                      htmlFor="upload-photo"
                      className="Upload-id"
                    >
                      <img src={photo_icon} className="photo_icon" />
                      Capture Photo
                    </span> */}

                    <FileUploadForVisitor
                      changeHandler={changeHandlerPhoto}
                      // handleclickopen={handleClickOpenPhoto}
                      upload="false"
                      captureButtonName="Capture Photo"
                    />

                    {/* <FileUploadForVisitor
                        changeHandler={changeHandlerPhoto}
                        handleclickopen={handleClickOpenPhoto}
                        upload="false"
                      /> */}
                    {errors.visitorphoto && (
                      <p className="text-danger pr-sm-2">
                        <small>{errors.visitorphoto}</small>
                      </p>
                    )}
                  </div>

                  <div className="position-relative">
                    {/* {isIdPicked ? (
                      <span className=" imgUploadedTxt">{selectedId}</span>
                    ) : (
                      ""
                    )} */}
                    <input
                      type="file"
                      id="upload-photo"
                      name="photo"
                      hidden
                      onChange={changeHandlerId}
                    />
                    {/* <span
                      onClick={() => handleClickOpenPhoto(true)}
                      htmlFor="upload-photo"
                      className="Upload-id"
                    >
                      <img src={photo_icon} className="photo_icon" />
                      Capture Photo
                    </span> */}

                    <FileUploadForVisitor
                      changeHandler={changeHandlerId}
                      // handleclickopen={handleClickOpenPhoto}
                      captureButtonName="Capture ID Proof"
                      upload="false"
                    />

                    {errors.visitoridphoto && (
                      <p className="text-danger">
                        <small>{errors.visitoridphoto}</small>
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className={
                    show_docs
                      ? "App-date-time-block mt-1"
                      : "App-date-time-block hidden mt-1"
                  }
                >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <div className="Field-group Field-group-adm mb-2 Inline-block app-date ml-0 col-md-6 m-0 px-0 pr-sm-1">
                      <label className="reg_form_heading">Date</label>
                      <div className="calendar-body">
                        <DatePicker
                          format="dd MMMM, yyyy"
                          value={selectedDate}
                          name="date"
                          id="date"
                          className="date-input"
                          onChange={handleDateChange}
                          autoOk="true"
                          disablePast="true"
                          okLabel=""
                        />

                        {/* <div
                            className="date-icon"
                            onClick={() => activeCalendar("date")}
                          > */}
                        <img
                          className="InputDateIcon"
                          src={appointment_date_icon}
                          onClick={() => activeCalendar("date")}
                          alt=""
                        ></img>
                        {/* <img src={appointment_date_icon}></img> */}
                        {/* </div> */}
                      </div>
                    </div>
                    <div className="Field-group Field-group-adm mb-2 Inline-block col-md-6 m-0 px-0 pl-sm-1">
                      {availableSlot.is_appointment_schedule !== undefined ? (
                        <>
                          {availableSlot.is_appointment_schedule == true ? (
                            <>
                              {availableSlot.avlSlotTimeList !== undefined &&
                                availableSlot.avlSlotTimeList.length > 0 ? (
                                <>
                                  <label className="reg_form_heading">
                                    Time
                                  </label>
                                  <div className="calendar-body time-body">
                                    {/* <div className="date-icon">
                                      <img src={time_icon}></img>
                                    </div> */}
                                    <select
                                      name="time"
                                      className={
                                        errors.time
                                          ? "Input-text pTimeLeft text-error par_reg_input"
                                          : "Input-text pTimeLeft par_reg_input"
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
                                    <img className="timeIconsForSelector" src={appointment_time_icon} alt=""></img>
                                  </div>
                                  {errors.timeErr && (
                                    <p className="text-danger position-absolute">
                                      <small>{errors.timeErr}</small>
                                    </p>
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <>
                              <label className="reg_form_heading">Time</label>
                              <div className="calendar-body time-body">
                                <TimePicker
                                  value={selectedTime}
                                  ampm={false}
                                  name="time"
                                  id="time"
                                  className="date-input"
                                  onChange={handleTimeChange}
                                />
                                {/* <div
                                    className="date-icon"
                                    onClick={() => activeCalendar("time")}
                                    > */}
                                <img
                                  className="InputDateIcon"
                                  onClick={() => activeCalendar("time")}
                                  src={appointment_time_icon}
                                  alt=""
                                ></img>
                                {/* <img src={time_icon}></img> */}
                                {/* </div> */}
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
                <div className="Button-container Adm-btn-container  text-right">
                  <Button
                    type="submit"
                    className="Adm-Btn-primary Btn-primary Btn-login Btn-animate verify-Btn-primary btnW-160px "
                  >
                    {appointmentTrue == "true" ? "Send Request" : "Check-In"}
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
