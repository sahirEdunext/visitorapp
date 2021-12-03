import React, { useState, useEffect } from "react";
import moment from "moment";
import id_card_icon from "../../icons/name.png";
import photo_icon from "../../icons/camera.png";
import appointment_date_icon from "../../icons/calBgImg.svg";
import appointment_time_icon from "../../icons/timeAppointment.svg";
import time_icon from "../../icons/time.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import "./Vendor.css";
import Footer from "../../components/Footer/Footer";
import DFooter from "../../components/DFooter/DFooter";
import {
  getVendorPurpose,
  meetingToList,
  vendorForm,
  getAvaiableSlot,
} from "../../service/backendService";
import { ErrorNotification } from "../../components/ErrorNotification";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import { FileUploadForVisitor } from "../../components/FileUploadForVisitor";

import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import HeaderBackButton from "../../components/HeaderBackButton/HeaderBackButton";

const Vendor = (props) => {
  const activeCalendar = (elm) => {
    if (document.getElementById(elm) != undefined) {
      document.getElementById(elm).click();
    }
  };
  const [show_docs, setShowStatus] = useState(false);
  const [vendorPurpose, setVendorPurpose] = useState([]);
  const [meetingtolist, setmeetingToList] = useState([]);
  const [errorMessage, seterrorMessage] = useState("");
  const [selectedDate, setAppointmentDate] = useState(new Date());
  const [selectedTime, setAppointmentTime] = useState(new Date());
  const [appointmentTrue, setappointmentTrue] = useState(false);

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
    if (inputs.purposeId == "" || inputs.purposeId == undefined) {
      seterrorMessage("Please select the purpose");
      return;
    }
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
      type: "vendor",
      date: moment(fdate).format("DD/MM/yyyy"),
    };
    await getAvaiableSlot(requestOptions)
      .then((res) => {
        setAvailableSlot(res.data.data);

        if (res.data.data.is_appointment_schedule !== undefined && res.data.data.is_appointment_schedule == true) {
          if (res.data.data.avlSlotTimeList !== undefined && res.data.data.avlSlotTimeList.length > 0) {

          } else {
            seterrorMessage("Time slot not available");
            setAppointmentTime("")
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const checkShowDocs = async (e) => {
    // handleDateChange(new Date());
    setdataForThankyou({ ...dataForThankyou, "appointmentType": e.target.value });
    setappointmentTrue(e.target.value);
    let value = e.target.value;

    if (e.target.value === "true") {
      setShowStatus(true);
      handleVendorPurpose(true);
      // let requestOptions = {
      //   purposeid: inputs.purposeId,
      //   type: "vendor",
      //   date: moment(new Date()).format("DD/MM/yyyy"),
      // };
      // await getAvaiableSlot(requestOptions)
      //   .then((res) => {
      //     setAvailableSlot(res.data.data);
      //     if(res.data.data.is_appointment_schedule !== undefined && res.data.data.is_appointment_schedule==true) {
      //       if(res.data.data.avlSlotTimeList !==undefined && res.data.data.avlSlotTimeList.length > 0) {

      //       } else {
      //         seterrorMessage("Time slot not available");
      //         setAppointmentTime("")
      //       }
      //     }

      //   })
      //   .catch((err) => {
      //     console.log("General from time slot err", err);
      //   });
      // await getGeneralPurpose(value).then((res) => {
      //   setGeneralPurpose(res.data.data.purpose_list);
      // });
      // await getVendorPurpose(value).then((res) => {
      //   setVendorPurpose(res.data.data.purpose_list);
      // });
    } else {
      setShowStatus(false);
      handleVendorPurpose(false);
    }
    // handleMeetingToList();
    setmeetingToList([])
  };

  useEffect(() => {
    handleVendorPurpose(false);
    // handleMeetingToList();
  }, []);
  const handleVendorPurpose = async (vdata) => {
    await getVendorPurpose(vdata).then((res) => {
      setVendorPurpose(res.data.data.purpose_list);
    });
  };
  const handleMeetingToList = async (mdata) => {
    await meetingToList(mdata).then((res) => {
      setmeetingToList(res.data.data.meeting_to_array);
    })
      .catch((err) => {
        // console.log("fkdfjl", err);
        seterrorMessage('Meeting person is not available for selected purpose')
      });
  };
  const handleInputChange = (event) => {
    event.persist();
    setErrors({ ...errors, [event.target.name]: "" });
    setInputs({ ...inputs, [event.target.name]: event.target.value });
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
  const [selectedId, setSelectedId] = useState();
  const [selectedIdFile, setSelectedIdFile] = useState([]);
  const [isIdPicked, setIsIdPicked] = useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState();
  const [selectedPhotoFile, setSelectedPhotoFile] = useState({
    visitorPhoto: "",
    visitorIdPhoto: "",
  });


  const [isPhotoPicked, setIsPhotoPicked] = useState(false);

  const [currTime, setcurrTime] = useState(
    new Date().getHours() + ":" + new Date().getMinutes()
  );
  const [inputs, setInputs] = useState({
    name: "",
    mobileNo: "",
    meetingToId: "",
    purposeId: "",
    isAppointment: appointmentTrue,
    date: appointmentTrue ? "" : moment(new Date()).format("DD/MM/yyyy"),
    time: appointmentTrue ? "" : currTime,
    description: "",
    organisationName: "",
    noOfPerson: "",
  });

  const [dataForThankyou, setdataForThankyou] = useState({
    purposeName: "",
    meetingToName: "",
    visitorName: props.location.state.name,
    appointmentType: inputs.isAppointment,
    visitorPhotoForId: "",
  })

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
  const [open, setOpen] = useState(false);
  const handleClickOpen = (val) => {
    setOpen(val);
  };
  const [openphoto, setOpenPhoto] = useState(false);
  const handleClickOpenPhoto = (val) => {
    setOpenPhoto(val);
  };
  const [errors, setErrors] = useState({});

  const onSubmit = (e) => {
    e.preventDefault();
    inputs.meetingToId = e.target.meetingToId.value;
    inputs.purposeId = e.target.purposeId.value;
    inputs.organisationName = e.target.organisationName.value;
    inputs.noOfPerson = e.target.noOfPerson.value;
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
    inputs.time = e.target.time !== undefined ? e.target.time.value : inputs.time;
    inputs.isAppointment = appointmentTrue;
    const sessionData = JSON.parse(JSON.parse(sessionStorage.authData));
    inputs.name = sessionData.name;
    inputs.mobileNo = sessionData.mobileno;
    const validationErrors = validate(inputs);
    const noErrors = Object.keys(validationErrors).length === 0;
    console.log(inputs)
    if (noErrors) {
      // Hit Api if no error
      const formData = new FormData();
      // formData.append("idcard", selectedIdFile);
      // formData.append("photo", selectedPhotoFile);
      formData.append("photo", selectedPhotoFile.visitorPhoto);
      formData.append("idcard", selectedPhotoFile.visitorIdPhoto);
      formData.append("vendorRequest", JSON.stringify(inputs));
      vendorForm(formData)
        .then((res) => {
          props.history.push({
            pathname: "/thankyou",
            state: {
              data: res.data.data,
              dataForThankyou: dataForThankyou
            },
          });
        })
        .catch((err) => {
          if (err.response.data) {
            if (err.response.data.errors) {
              seterrorMessage("Error: " + err.response.data.errors[0]["message"]);
            } else {
              seterrorMessage(err.response.data.message);
            }
            console.log(err.response);
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

  const handleSelectPurposeInputChange = async (event) => {
    event.persist();
    setInputs({ ...inputs, [event.target.name]: event.target.value });
    let ival = event.target.value;
    if (event.target.value != 0) {
      setErrors({ ...errors, [event.target.name]: "" });
    } else {
      setErrors({
        ...errors,
        [event.target.name]: "Please select purpose"
      });
    }


    if (event.target.name == "purposeId") {
      setdataForThankyou({ ...dataForThankyou, "purposeName": event.target.selectedOptions[0].text });
    } else if (event.target.name == "meetingToId") {
      setdataForThankyou({ ...dataForThankyou, "meetingToName": event.target.selectedOptions[0].text });
    }

    // await meetingToList(ival).then((res) => {
    //   setmeetingToList(res.data.data.meeting_to_array);
    // });
    handleMeetingToList(event.target.value);

    if (!appointmentTrue) {
      return;
    } else {
      // setShowStatus(true);
      let requestOptions = {
        purposeid: event.target.value,
        // type: "admission",
        date: moment(selectedDate).format("DD/MM/yyyy"),
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
              // seterrorMessage("Time slot not available");
              // setAppointmentTime("");
            }
          }
        })
        .catch((err) => {
          console.log("Time slot response", err);
        });
    }
  }


  const validate = (inputs) => {
    const error = {};
    if (!inputs.meetingToId)
      error.meetingToId = "Please select the Person for meeting.";
    if (!inputs.noOfPerson)
      error.noOfPerson = "Please select number of person.";
    if (!inputs.purposeId) error.purposeId = "Please select purpose";
    if (!inputs.emailId) error.emailId = "Please enter email address";
    // if (appointmentTrue == "") error.apptType = "Please select visit type";
    if (!inputs.organisationName)
      error.organisationName = "Please enter Organisation name";
    if (!inputs.description) error.description = "Please enter Description";
    if (selectedPhotoFile.visitorPhoto === "") error.visitorphoto = "Please capture visitor photo";
    if (selectedPhotoFile.visitorIdPhoto === "") error.visitoridphoto = "Please capture visitor id photo";
    if (inputs.date == moment(new Date()).format("DD/MM/yyyy")) {
      var regex = new RegExp(':', 'g'),
        inputTime = inputs.time,
        currentTime = currTime;
      if (parseInt(inputTime.replace(regex, ''), 10) < parseInt(currentTime.replace(regex, ''), 10)) {
        console.log('timeStr1 is smaller then timeStr2');
        error.timeErr = "Please select future Time for Appointment";
      }
    }
    return error;
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

    if (event.target.name == "purposeId") {
      setdataForThankyou({ ...dataForThankyou, "purposeName": event.target.selectedOptions[0].text });
    } else if (event.target.name == "meetingToId") {
      setdataForThankyou({ ...dataForThankyou, "meetingToName": event.target.selectedOptions[0].text });
    }
  };
  return (
    <Container fluid className="Edu-container">
      <Row>
        <Col sm={6} className="left-col">
          <HeaderBackButton />
          <div className="Box-left">
            <div className="Welcome-text">
              <p className="Welcome-text-big">Vendor</p>
            </div>
          </div>
          <DFooter />
        </Col>
        <Col sm={6} className="right-col">
          <div className="Box-right">
            <div className="Admission-form Vendor-form">
              <form onSubmit={onSubmit} autoComplete="off">
                <h4 className="btn_upper_heading text-left mt-4">Vendor</h4>
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
                      <div className={`visitorTypeIcon walkin  ${appointmentTrue ? "" : "actvWalkingImg"}`}></div> Walk-In
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

                  <div className="Field-group Field-group-adm ml-0 col-md-12 mt-2 m-0 px-0 ">
                    <label className="reg_form_heading">Organisation Name</label>
                    <div className="Input-field">
                      <input
                        type="text"
                        name="organisationName"
                        id="parent_name"
                        className={
                          errors.organisationName
                            ? "Input-text text-error"
                            : "Input-text"
                        }
                        onKeyUp={handleTextInputChange}
                        placeholder="Enter Your Organisation Name"
                      />
                    </div>
                    {errors.organisationName && (
                      <p className="text-danger">
                        <small>{errors.organisationName}</small>
                      </p>
                    )}
                  </div>

                  <div className="Field-group Field-group-adm col-md-6 mb-2 px-0 mt-2 pr-sm-1">
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

                  <div className="Field-group Field-group-adm ml-0 col-md-6  mt-2 m-0 px-0 pl-sm-1">
                    <label className="reg_form_heading">Purpose</label>
                    <div className="Input-field">
                      <select
                        name="purposeId"
                        className={
                          errors.purposeId
                            ? "Input-text text-error"
                            : "Input-text"
                        }
                        onChange={handleSelectPurposeInputChange}
                      >
                        <option value="">Select Your Purpose</option>
                        {vendorPurpose.map((item, key) => (
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
                  <div className="Field-group Field-group-adm ml-0 col-md-6  mt-2 m-0 px-0 pr-sm-1">
                    <label className="reg_form_heading">Meeting To</label>
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
                        <option value="">Select Meeting Person</option>
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
                  <div className="Field-group Field-group-adm ml-0 col-md-6  mt-2 m-0 px-0 pl-sm-1">
                    <label className="reg_form_heading">Accompanied Person</label>
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
                        <option value="">Select Accompanied Person</option>
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

                  <div className="Field-group Field-group-adm ml-0 col-md-12 mt-2  m-0 px-0 pr-sm-1">
                    <label className="reg_form_heading">Description</label>
                    <div className="Input-field">
                      <textarea
                        type="text"
                        name="description"
                        placeholder="Enter your Description"
                        id="source"
                        row="4"
                        className={
                          errors.description
                            ? "Input-textarea par_reg_input h_4rem text-error"
                            : "Input-textarea par_reg_input h_4rem"
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
                  <div className="Upload_area mt-2 d-sm-flex ml-0 col-md-12 m-0 px-0 pl-sm-1">
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
                  {/* <div className="appointment-div">
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
                  </div> */}
                  <div
                    className={
                      show_docs
                        ? "App-date-time-block mt-1 col-12 px-0"
                        : "App-date-time-block hidden mt-1 col-12 px-0"
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
                                    src={appointment_time_icon}
                                    onClick={() => activeCalendar("time")}
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
                </div>
                <div className="Button-container Adm-btn-container text-right">
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

export default withRouter(Vendor);
