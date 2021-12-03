import React, { useState, useEffect } from "react";
import moment from "moment";
import student_image_icon from "../../icons/Profile.svg";
// import button_circular_i from "../../icons/circle_icon_button.svg";
import scheduleImg from "../../icons/scheduleIcon.svg";
import walkInImg from "../../icons/walkInIcon.svg";
import selectStIcon from "../../icons/selectStIcon.png";
// import photo_icon from "../../icons/camera.png";
import appointment_date_icon from "../../icons/calBgImg.svg";
import appointment_time_icon from "../../icons/timeAppointment.svg";
// import time_icon from "../../icons/time.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import Footer from "../../components/Footer/Footer";
import DFooter from "../../components/DFooter/DFooter";
import { withRouter } from "react-router-dom";
import "./parentRegister.css";
import {
  getClasses,
  parentRegister,
  getAvaiableSlot,
  meetingToList,
  parentpurpose,
  parentMeetingHistory
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
const ParentRegister = (props) => {

  const [registerData, setRegisterData] = useState(props.location.state.data);
  const [show_docs, setShowStatus] = useState(false);
  const [classes, setClases] = useState([]);
  const [purposeList, setParentpurpose] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorMessage, seterrorMessage] = useState("");
  const [selectedDate, setAppointmentDate] = useState(new Date());
  const [selectedDob, setDOB] = useState(null);
  const [selectedTime, setAppointmentTime] = useState(new Date());
  const [availableSlot, setAvailableSlot] = useState({});
  const [meetingtolist, setmeetingToList] = useState([]);
  const [stparentMeetingHistory, setstparentMeetingHistory] = useState([]);
  const [visitorType, setvisitorType] = useState(props.location.state.visitType)
  const [visitorTrue, setvisitorTrue] = useState(visitorType === "ScheduleAppointment" ? (true) : (false))
  const [currTime, setcurrTime] = useState(new Date().getHours() + ':' + new Date().getMinutes())
  const [nameForThankyou, setnameForThankyou] = useState({
    purposeName: "",
    meetingToName: "",
    visitorName: "",
    visitorTypeName: visitorType,
    visitorPhotoForId: ""
  })
  // const [isAppointVisitor, setisAppointVisitor] = useState();
  const [inputs, setInputs] = useState({
    name: "",
    meetingToId: "",
    studentId: JSON.stringify(registerData.student_array[0].studentid),
    mobileNo: registerData.student_array[0].mobile_no,
    description: "",
    isAppointment: visitorTrue,
    date: visitorTrue ? ("") : moment(new Date()).format("DD/MM/yyyy"),
    time: visitorTrue ? ("") : currTime,
    relation: "",
    purposeId: "",
  });

  console.log(props.location.state)


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

  // {console.log(availableSlot.avlSlotTimeList)}

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
  const handleMeetingToList = async (mdata) => {
    await meetingToList(mdata).then((res) => {
      setmeetingToList(res.data.data.meeting_to_array);
    });
  };

  // console.log(registerData);

  // const handleparentMeetingHistory = async () => {
  //   const data = {
  //     'mobileno': registerData.student_array[0].mobile_no
  //   };
  //   await parentMeetingHistory(data)
  //     .then((res) => {
  //       setstparentMeetingHistory(res.data.data);

  //     })
  //     .catch((err) => {
  //       seterrorMessage("Error: Parent history error");
  //       console.log(err)
  //     });

  // };

  const handleDateChange = async (date) => {
    if (!visitorTrue) {
      return;
    }

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

    setInputs({ ...inputs, ["date"]: moment(fdate).format('DD/MM/yyyy') })

    // moment(fdate).format('DD/MM/yyyy')
    // console.log(moment(fdate).format('DD/MM/yyyy'));

    if (fcurrDate > fdate) {
      seterrorMessage("Please select future Date for Appointment");
      setAppointmentDate(currDate);
    } else {
      seterrorMessage("");
      setAppointmentDate(date);
    }
    // console.log(fdate)
    let requestOptions = {
      purposeid: inputs.purposeId,
      // type: "admission",
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
            seterrorMessage("Time slot not available for the selected date");
            // console.log(res.data)
            setAppointmentTime("");
          }
        }
        // console.log(res.data.data)
      })
      .catch((err) => {
        console.log("Date", err);
      });
  };
  const onSubmit = (e) => {
    e.preventDefault();

    // inputs.isAppointment = e.target.isAppointment.checked;
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
    // console.log(inputs)
    inputs.time = e.target.time !== undefined ? e.target.time.value : inputs.time;
    nameForThankyou.visitorName = inputs.name
    const validationErrors = validate(inputs);
    const noErrors = Object.keys(validationErrors).length === 0;
    console.log(inputs)

    if (noErrors) {
      setErrors({});
      // Hit Api if no error
      const formData = new FormData();
      // formData.append("photo", selectedPhotoFile);
      formData.append("photo", selectedPhotoFile.visitorPhoto);
      formData.append("idcard", selectedPhotoFile.visitorIdPhoto);
      formData.append("parentRequest", JSON.stringify(inputs));
      parentRegister(formData)
        .then((res) => {
          // console.log(res.data.data)
          // console.log(props)
          props.history.replace({
            pathname: "/thankyouparent",
            state: {
              data: res.data.data,
              nameForThankyou
            },
          });
        })
        .catch((err) => {
          // console.log(err);
          if (err.response) {
            seterrorMessage(err.response.data.message);
          }
          // seterrorMessage("Error: " + err.response.data.errors[0]["message"]);
          //   seterrorMessage(slotAvailability.message);
        });
    } else {
      // console.log("errors try again", validationErrors);
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    // handleClasses();
    // handleMeetingToList();
    getParentpurpose(visitorTrue);
    // handleparentMeetingHistory();
    checkShowDocs();
    setInputs({ ...inputs, ["date"]: moment(selectedDate).format('DD/MM/yyyy') })
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
  const getParentpurpose = async (pdata) => {
    await parentpurpose(pdata)
      .then((res) => {
        setParentpurpose(res.data.data.purpose_list);
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

  const handleSelectPurposeInputChange = async (event) => {
    event.persist();
    setInputs({ ...inputs, [event.target.name]: event.target.value });
    if (event.target.value != 0) {
      setErrors({ ...errors, [event.target.name]: "" });
    } else {
      setErrors({
        ...errors,
        [event.target.name]: "Please select purpose"
      });
    }

    if (event.target.name == "purposeId") {
      setnameForThankyou({ ...nameForThankyou, "purposeName": event.target.selectedOptions[0].text });
    } else if (event.target.name == "meetingToId") {
      setnameForThankyou({ ...nameForThankyou, "meetingToName": event.target.selectedOptions[0].text });
    }

    handleMeetingToList(event.target.value);

    if (!visitorTrue) {
      return;
    } else {
      // setShowStatus(true);
      let requestOptions = {
        purposeid: event.target.value,
        // type: "admission",
        date: inputs.date ? inputs.date : moment(new Date()).format("DD/MM/yyyy"),
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


  const checkShowDocs = async () => {
    if (!visitorTrue) {
      return;
    }
    setShowStatus(true);
    let requestOptions = {
      purposeid: "",
      // type: "admission",
      date: inputs.date ? inputs.date : moment(new Date()).format("DD/MM/yyyy"),
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
  };
  const validate = (inputs) => {
    const error = {};
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!inputs.name) error.name = "Please select the visitor";
    if (!inputs.description) error.description = "Please enter description";
    if (!inputs.purposeId)
      error.purposeId = "Please select purpose";
    if (!inputs.relation) error.relation = "Please select relation";
    if (!inputs.meetingToId) error.meetingToId = "Please select the meeting person";
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
  const handleRelation = (event) => {
    event.persist();
    setInputs({ ...inputs, [event.target.name]: event.target.id, ["name"]: event.target.value });
    setErrors({ ...errors, "name": "" });
    // setInputs({ ...inputs, ["name"]: event.target.value });
  };

  const [selectedId, setSelectedId] = useState();
  const [selectedIdFile, setSelectedIdFile] = useState([]);
  const [isIdPicked, setIsIdPicked] = useState(false);
  const [selectedPhotoVisitor, setSelectedPhotoVisitor] = useState();
  const [selectedPhotoVisitorId, setSelectedPhotoVisitorId] = useState();
  const [selectedPhotoFile, setSelectedPhotoFile] = useState({
    visitorPhoto: "",
    visitorIdPhoto: ""
  });
  const [isVisitorPhotoPicked, setIsVisitorPhotoPicked] = useState(false);
  const [isVisitorIdPhotoPicked, setisVisitorIdPhotoPicked] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [studentsModal, setstudentsModal] = useState(true)
  const [selectedStdDetails, setselectedStdDetails] = useState(registerData.student_array.length == 1 ? true : false)
  const [selectedStd, setselectedStd] = useState(0)
  const [historyModal, sethistoryModal] = useState(false)

  const stdSelected = (e) => {
    setstudentsModal(false)
    setselectedStd(e.target.value)
    setselectedStdDetails(true)
    // setErrors({ ...errors, "name": "" });
  }
  const changeHandlerId = (files) => {
    setSelectedId(files.name);
    setSelectedIdFile(files);
    setIsIdPicked(true);
  };
  const changeHandlerVisitorPhoto = (files, imageSrc) => {
    setSelectedPhotoVisitor(files.name);
    setSelectedPhotoFile({ ...selectedPhotoFile, "visitorPhoto": files });
    setIsVisitorPhotoPicked(true);
    setnameForThankyou({ ...nameForThankyou, "visitorPhotoForId": imageSrc });
    setErrors({
      ...errors,
      ["visitorphoto"]: "",
    });
    // console.log(imageSrc)
  };
  const changeHandlerVisitorIdPhoto = (files) => {
    setSelectedPhotoVisitorId(files.name);
    setSelectedPhotoFile({ ...selectedPhotoFile, "visitorIdPhoto": files });
    setisVisitorIdPhotoPicked(true);
    setErrors({
      ...errors,
      ["visitoridphoto"]: "",
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

  // const setimageSrc = (image) => {
  //   console.log(image)
  //   setnameForThankyou({ ...nameForThankyou, "visitorPhotoForId": image });
  // }
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
    // console.log(event);
    if (event.target.name == "purposeId") {
      setnameForThankyou({ ...nameForThankyou, "purposeName": event.target.selectedOptions[0].text });
    } else if (event.target.name == "meetingToId") {
      setnameForThankyou({ ...nameForThankyou, "meetingToName": event.target.selectedOptions[0].text });
    }
    // console.log(nameForThankyou)
  };
  return (
    <Container fluid className="Edu-container">
      {/* {console.log(registerData)} */}
      <Row>
        <Col sm={6} className="left-col">
          <HeaderBackButton />
          <div className="Box-left">
            <div className="Welcome-text">
              <p className="Welcome-text-small">Welcome to</p>
              <p className="Welcome-text-big">Edunext</p>
            </div>
          </div>
          <DFooter />
        </Col>
        <Col sm={6} className="right-col">
          <div className="Box-right">
            <div className="Admission-form">
              {registerData.student_array.length > 1 &&
                <div className={`modal fade show ${studentsModal ? "shownsk" : "hide"}`} role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content border-0">
                      <h3 style={{ fontSize: "20px", fontWeight: "500", color: "#03081C", margin: "10px 0 30px" }} className="selectStHeading">Select The Child</h3>
                      <div className="modal-body text-center d-sm-flex flex-wrap stFixHeight stCustScroll">
                        {registerData.student_array.map((item, id) => (
                          <div key={id} >
                            {/* {console.log(item)} */}
                            <label className="selectLabelSt" htmlFor={"stud_" + id}>
                              <div className="selectStudentDiv">
                                <img className="selectStIconImg" src={!item.student_image ? selectStIcon : item.student_image} alt="" />
                                <h6 className="selectStName">{item.name}</h6>
                                <p className="selectStAddNo">Addmission No. {item.enrollmentno}</p>
                                {/* <p className="selectStAddNo colr">{item.address}</p> */}
                              </div>
                            </label>
                            <input className="d-none" onClick={(e) => { stdSelected(e) }} name="stName" id={"stud_" + id} value={id} type="radio" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>}
              {selectedStdDetails &&
                <>
                  <div>
                    <div>
                      <div className="parHeading">
                        {visitorType === "WalkIn" ? (
                          <>
                            <img src={walkInImg} alt="" />
                            <p>Walk-In</p>
                          </>
                        ) : (
                          <>
                            <img src={scheduleImg} alt="" /> <p>Schedule Appointment</p>
                          </>
                        )}</div>
                      <div className="d-flex justify-content-between align-items-center px-0">
                        <div className="d-flex align-items-center justify-content-between text-left">
                          <div className="student-Img_cont mr-2">
                            {/* {console.log(registerData)} */}
                            <img
                              className="student_img_cont mt-1"
                              src={!registerData.student_array[selectedStd].student_image ? student_image_icon : registerData.student_array[selectedStd].student_image}
                              alt=""
                            />
                          </div>
                          <div className="line_h_1">
                            <p className="student_name_regiter">{registerData.student_array[selectedStd].name}</p>
                            <p className="student_id_regiter">{registerData.student_array[selectedStd].enrollmentno} | {registerData.student_array[selectedStd].classname}-{registerData.student_array[selectedStd].sectionname}</p>
                          </div>

                        </div>
                        <div>
                          {registerData.student_array.length > 1 && <div className="">
                            <Button type="submit" onClick={() => setstudentsModal(true)} className="Btn-primary Btn-login Btn-animate verify-Btn-primary all_child_btn">All Childern</Button>
                          </div>}
                        </div>
                      </div>
                      <hr className="reg_separator" />
                      <div>
                        <div className="row">
                          <div className="col-md-12 text-left p-0">
                            <h5 className="student_name_regiter">Select the Visitor</h5>
                          </div>

                          <div className="col-md-12 d-flex align-items-center mb-3 p-0">
                            <input className="c-pointer" name="relation" onChange={handleRelation} id="Father" value={registerData.student_array[selectedStd].fathername} type="radio" />
                            <label className=" mb-0 d-flex c-pointer" htmlFor="Father">
                              <img className="student_img_cont mx-2" src={!registerData.student_array[selectedStd].father_image ? student_image_icon : registerData.student_array[selectedStd].father_image} alt="" />
                              <span>
                                <p className="reg_form_subHead">{registerData.student_array[selectedStd].fathername}</p>
                                <p className="reg_form_heading">Father</p>
                              </span>
                            </label>
                          </div>

                          <div className="col-md-12 d-flex align-items-center text-left mb-3 p-0">
                            <input className="c-pointer" name="relation" onChange={handleRelation} id="Mother" value={registerData.student_array[selectedStd].mothername} type="radio" />
                            <label className=" mb-0 d-flex c-pointer" htmlFor="Mother">
                              <img className="student_img_cont mx-2" src={!registerData.student_array[selectedStd].mother_image ? student_image_icon : registerData.student_array[selectedStd].mother_image} alt="" />
                              <span>
                                <p className="reg_form_subHead">{registerData.student_array[selectedStd].mothername}</p>
                                <p className="reg_form_heading">Mother</p>
                              </span>
                            </label>
                          </div>
                          {/* {console.log(registerData.student_array[selectedStd].guardian_data_array)} */}

                          {registerData.student_array[selectedStd].guardian_data_array && registerData.student_array[selectedStd].guardian_data_array.map((guardian, id) => (
                            <div key={id} className="col-md-12 d-flex align-items-center text-left mb-3 p-0">
                              <input className="c-pointer" name="relation" onChange={handleRelation} id="Guardian" value={guardian.guardian_name} type="radio" />
                              <label className=" mb-0 d-flex c-pointer" htmlFor="Guardian">
                                <img className="student_img_cont mx-2" src={!guardian.guardian_imagepath ? student_image_icon : guardian.guardian_imagepath} alt="" />
                                <span>
                                  <p className="reg_form_subHead">{guardian.guardian_name}</p>
                                  <p className="reg_form_heading">{!guardian.guardian_relationtypename ? "Guardian" : guardian.guardian_relationtypename}</p>
                                </span>
                              </label>
                            </div>
                          ))}
                          {errors.name && (
                            <p className="text-danger">
                              <small>{errors.name}</small>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={onSubmit} autoComplete="off">
                    <div className="Login-fields row p-registerForm">
                      {/* <div className="Field-group Field-group-adm">
                    <label className="reg_form_heading">Visitor Name</label>
                    <div className="Input-field">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        onKeyPress={(event) => {
                          if (!/[a-zA-Z ]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        className={
                          errors.name
                            ? "Input-text text-error"
                            : "Input-text par_reg_input"
                        }
                        onChange={handleInputChange}
                        onKeyUp={handleTextInputChange}
                        value={registerData.student_array[selectedStd].mothername}
                      />
                    </div>
                    
                  </div> */}

                      <div className="Field-group Field-group-adm mb-2 col-md-6 pl-sm-0 pr-sm-1 px-0">
                        <label className="reg_form_heading">Purpose</label>
                        <div className="Input-field">
                          {/* {console.log(parentpurpose)}    */}
                          <select
                            name="purposeId"
                            className={
                              errors.purposeId
                                ? "source Input-text text-error"
                                : "source Input-text par_reg_input"
                            }
                            onChange={handleSelectPurposeInputChange}
                          >
                            <option value="">Select Your Purpose</option>
                            {/* <option value="1"></option> */}

                            {purposeList.map((item, key) => (
                              <option key={key} value={item.id} id={item.description}>
                                {item.description}
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

                      <div className="Field-group Field-group-adm col-md-6 pr-sm-0 pl-sm-1 px-0">
                        <label className="reg_form_heading">Meeting To</label>
                        <div className="Input-field">
                          <select
                            name="meetingToId"
                            className={
                              errors.meetingToId
                                ? "Input-text text-error"
                                : "Input-text par_reg_input"
                            }
                            onChange={handleSelectInputChange}
                          >
                            <option value="">Select Meeting Person</option>
                            {meetingtolist.map((item, key) => (
                              <option key={key} value={item.id} name={item.name}>
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

                      {/* <label className="reg_form_heading">Relation</label>
                  <div className="d-flex justify-content-start">
                    <div className="d-flex align-items-center mr-3">
                      <label className="reg_form_heading pr-1">Father</label>

                      <input
                        type="radio"
                        id="1"
                        name="relation"
                        value="Father"
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="d-flex align-items-center mr-3">
                      <label className="reg_form_heading pr-1">Mother</label>

                      <input
                        type="radio"
                        id="2"
                        name="relation"
                        value="Mother"
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="d-flex align-items-center mr-2">
                      <label className="reg_form_heading pr-1">Guardian</label>

                      <input
                        type="radio"
                        id="3"
                        name="relation"
                        value="Guardian"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  {errors.relation && (
                      <p className="text-danger">
                        <small>{errors.relation}</small>
                      </p>
                    )} */}

                      <div className="Field-group Field-group-adm col-md-12 px-sm-0 px-0">
                        <label className="reg_form_heading">Description</label>
                        <div className="Input-field ">
                          <textarea
                            placeholder="Enter your Description"
                            row="4"
                            type="text"
                            name="description"
                            id="description"
                            className={
                              errors.description
                                ? "Input-text text-error h_4rem"
                                : "Input-text par_reg_input h_4rem"
                            }
                            onChange={handleInputChange}
                            onKeyUp={handleTextInputChange}
                          ></textarea>
                        </div>
                        {errors.description && (
                          <p className="text-danger">
                            <small>{errors.description}</small>
                          </p>
                        )}
                      </div>

                      {visitorType === "ScheduleAppointment" && (
                        <div className="Field-group Field-group-adm mb-2 row px-sm-0 px-0 col-md-12">
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <div className="Field-group Field-group-adm Inline-block col-md-6 m-0 mb-sm-3 pr-sm-1 p-0">
                              <label>Date</label>
                              <div className="calendar-body">
                                <DatePicker
                                  format="dd MMMM, yyyy"
                                  placeholder="Select Date"
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
                                <img onClick={() => activeCalendar("date")} className="InputDateIcon" src={appointment_date_icon} alt=""></img>
                                {/* </div> */}
                              </div>
                            </div>

                            <div className="Field-group Field-group-adm Inline-block col-md-6 m-0 pl-sm-1 p-0">
                              {availableSlot.is_appointment_schedule !== undefined ? (
                                <>
                                  {availableSlot.is_appointment_schedule == true ? (
                                    <>
                                      {availableSlot.avlSlotTimeList !== undefined &&
                                        availableSlot.avlSlotTimeList.length > 0 ? (
                                        <>
                                          <label>Time</label>
                                          <div className="calendar-body time-body">
                                            {/* <div className="date-icon">
                                      <img src={time_icon} alt=""></img>
                                    </div> */}
                                            <select
                                              name="time"
                                              className={
                                                errors.time
                                                  ? " Input-text pTimeLeft par_reg_input text-error"
                                                  : " Input-text pTimeLeft par_reg_input"
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
                                      {/* <label>Time</label>
                                      <div className="calendar-body time-body">
                                        <TimePicker
                                          value={selectedTime}
                                          ampm={false}
                                          name="time"
                                          id="time"
                                          className="date-input"
                                          onChange={handleTimeChange}
                                        />
                                        <img onClick={() => activeCalendar("time")} className="InputDateIcon" src={appointment_time_icon} alt=""></img>
                                      </div> */}
                                    </>
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                          </MuiPickersUtilsProvider>
                        </div>)}

                    </div>
                    <div className="d-sm-flex align-items-center">
                      <div className="position-relative">
                        {/* {isVisitorPhotoPicked ? (
                          <span className=" imgUploadedTxt">{selectedPhotoVisitor}</span>
                        ) : (
                          ""
                        )} */}
                        <input type="file" id="upload-photo" name="photo" hidden onChange={changeHandlerVisitorPhoto} />
                        {/* <span
                      onClick={() => handleClickOpenPhoto(true)}
                      htmlFor="upload-photo"
                      className="Upload-id"
                    >
                      <img src={photo_icon} className="photo_icon" />
                      Capture Photo
                    </span> */}

                        <FileUploadForVisitor
                          changeHandler={changeHandlerVisitorPhoto}
                          // handleclickopen={handleClickOpenPhoto}
                          upload="false"
                          captureButtonName="Capture Photo"
                        // imageSource={setimageSrc}
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
                        {/* {isVisitorIdPhotoPicked ? (
                          <span className=" imgUploadedTxt">{selectedPhotoVisitorId}</span>
                        ) : (
                          ""
                        )} */}
                        <input type="file" id="upload-photo" name="photo" hidden onChange={changeHandlerVisitorIdPhoto} />
                        {/* <span
                      onClick={() => handleClickOpenPhoto(true)}
                      htmlFor="upload-photo"
                      className="Upload-id"
                    >
                      <img src={photo_icon} className="photo_icon" />
                      Capture Photo
                    </span> */}

                        <FileUploadForVisitor
                          changeHandler={changeHandlerVisitorIdPhoto}
                          // handleclickopen={handleClickOpenPhoto}
                          captureButtonName="Capture ID Proof"
                          upload="false"
                        />


                        {/* <FileUploadForVisitor
                        changeHandler={changeHandlerPhoto}
                        handleclickopen={handleClickOpenPhoto}
                        upload="false"
                      /> */}
                        {errors.visitoridphoto && (
                          <p className="text-danger">
                            <small>{errors.visitoridphoto}</small>
                          </p>
                        )}

                      </div>

                      {/* <div className="">
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
                  </div> */}
                    </div>




                    <div className="Button-container Adm-btn-container d-flex justify-content-end">
                      {/* <Button size="medium" className="canc-btn-reg mr-4">
                    Cancel
                  </Button> */}
                      <Button
                        type="submit"
                        className="Adm-Btn-primary sm-btn Btn-primary Btn-login Btn-animate"
                      >
                        {visitorType == "WalkIn" ? "Check-In" : "Send Request"}
                        {/* Register */}
                      </Button>
                    </div>
                  </form></>}
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
export default withRouter(ParentRegister);
