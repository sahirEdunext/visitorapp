import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import temp_icon from '../../icons/hot.png';
import wearing_mask from '../../icons/mask.png'
import sanitised_hand from '../../icons/sanitised.png'
import arogys_setu from '../../icons/arogya.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import './VisitorDeclartion.css';
import id_card_icon from '../../icons/name.png';
import photo_icon from '../../icons/camera.png';
import TickButton from '../../components/TickButton';
import CrossButton from '../../components/CrossButton';
import Header from '../../components/Header/header'
import Footer from '../../components/Footer/Footer'
import DFooter from '../../components/DFooter/DFooter'
import HeaderBackButton from '../../components/HeaderBackButton/HeaderBackButton';
import { visitorCheckIn } from '../../service/backendService';
import { ErrorNotification } from '../../components/ErrorNotification'
import Button from '@material-ui/core/Button';
import { FileUploadForVisitor } from "../../components/FileUploadForVisitor";

const VisitorDeclartion = (props) => {
    const [asTickColor, setAsTickColor] = useState("#9c9c9c");
    const [asCrossColor, setAsCrossColor] = useState("#ff7171");
    const [shCrossColor, setShCrossColor] = useState("#ff7171");
    const [wsCrossColor, setWmCrossColor] = useState("#ff7171");
    const [wsTickColor, setWmTickColor] = useState("#9c9c9c")
    const [shTickColor, setShTickColor] = useState("#9c9c9c");
    const [asVal, setAsVal] = useState(false);
    const [shVal, setShVal] = useState(false);
    const [wsVal, setWsVal] = useState(false);
    const [visitor_data, setVisitorData] = useState({});

    const [asBorderColor, setAsBorderColor] = useState(false);
    const [vistorTemp, setVistorTemp] = useState("")
    const [shBorderColor, setShBorderColor] = useState(false);
    const [wmBorderColor, setWmBorderColor] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');


    const handleArogyaSetu = (e) => {
        setAsVal(e.target.checked);
        if (e.target.checked) {
            setAsTickColor("#6cd86c");
            setAsBorderColor(true);
            setAsCrossColor("#9c9c9c");
        }
        else {
            setAsTickColor("#9c9c9c");
            setAsBorderColor(false);
            setAsCrossColor("#ff7171");
        }
    }
    const handleWearingMask = (e) => {
        setWsVal(e.target.checked);
        if (e.target.checked) {
            setWmBorderColor(true);
            setWmTickColor("#6cd86c");
            setWmCrossColor("#9c9c9c")
        } else {
            setWmBorderColor(false);
            setWmTickColor("#9c9c9c");
            setWmCrossColor("#ff7171");
        }

    }
    const handleSantisedHand = (e) => {
        setShVal(e.target.checked);

        if (e.target.checked) {
            setShBorderColor(true);
            setShTickColor("#6cd86c");
            setShCrossColor("#9c9c9c");
        }
        else {
            setShBorderColor(false);
            setShTickColor("#9c9c9c");
            setShCrossColor("#ff7171");
        }
    }
    const [profiledata, setProfileData] = useState({});
    const [selectedPhotoFile, setSelectedPhotoFile] = useState({
        visitorPhoto: "",
        visitorIdPhoto: "",
    });
    const [selectedId, setSelectedId] = useState();
    const [selectedIdFile, setSelectedIdFile] = useState([]);
    const [isIdPicked, setIsIdPicked] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState();

    const [isPhotoPicked, setIsPhotoPicked] = useState(false);


    const changeHandlerId = (files) => {
        setSelectedPhotoFile({ ...selectedPhotoFile, visitorIdPhoto: files });
        setSelectedId(files.name);
        // setSelectedIdFile(files);
        setIsIdPicked(true);
    };
    const changeHandlerPhoto = (files, imageSrc) => {
        setSelectedPhotoFile({ ...selectedPhotoFile, visitorPhoto: files });
        setSelectedPhoto(files.name);
        // setdataForThankyou({ ...dataForThankyou, "visitorPhotoForId": imageSrc });
        // setSelectedPhotoFile(files);
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
    const onSubmit = (e) => {
        e.preventDefault();
        // console.log()
        const data = {
            "id": visitor_data.id,
            "securityGarudId": profiledata.id,
            "type": visitor_data.type,
            "wearingMask": wsVal,
            "sanitisedHand": shVal,
            "argayusetuApp": asVal,
            "visitorTemperature": vistorTemp + "°C",
        }
        const formData = new FormData();
        // formData.append('photo', selectedPhotoFile);
        formData.append('idcard', selectedPhotoFile.visitorIdPhoto);
        formData.append("photo", selectedPhotoFile.visitorPhoto);
        formData.append('checkInRequest', JSON.stringify(data));
        // console.log(data)
        visitorCheckIn(formData)
            .then(res => {
                // props.history.push('/checkinThankyou');
                // props.history.goBack();
                // state:{ 
                //     data: res.data
                // }
                console.log(res.data);
                props.history.push({
                    pathname: '/checkinThankyou',
                    state: {
                        data: res.data
                    }
                });
            })
            .catch(err => {
                if (err.response.data.errors[0].message) {
                    seterrorMessage('Error: ' + err.response.data.errors[0].message);
                } else if (err.response.data.message) {
                    seterrorMessage('Error: ' + err.response.data.message);
                } else {
                    seterrorMessage('Error: Some error occurred');
                }
            })
    }
    const goBackFunc = () => {
        props.history.goBack();
        // props.history.push('/checkinThankyou');
    }
    useEffect(
        () => {
            setProfileData(JSON.parse(sessionStorage.authguard));
            setVisitorData(props.location.state.visitor_data);
        }
        , [])
    const bodyTemperatureHandle = (e) => {

        if (e.target.value >= 99.5) {
            // console.log("body valid Temperature", e.target.value)
            seterrorMessage("Body temperature is to high")
        } else {
            seterrorMessage("")
            setVistorTemp(e.target.value)
        }

    }
    return (
        <Container fluid className="Edu-container">
            <Row>
                <Col sm={6} className="left-col">
                    <HeaderBackButton />
                    <div className="Box-left">
                        <div className='Welcome-text'>
                            <p className="Welcome-text-small">Visitor</p>
                            <p className="Welcome-text-small"><b>Declaration</b></p>
                        </div>
                    </div>
                    <DFooter />
                </Col>
                <Col sm={6} className="right-col">
                    <div className="Box-right">
                        <div className="Login-form padd_decl visitor-declaration-form">
                            {/* <div className="">
                                <img className="" width="40px" src={avatar} />
                            </div> */}
                            <form onSubmit={onSubmit} autoComplete="off">
                                <div className="mt-3 mb-4 mmb-1">
                                    <div width="100%">
                                        <h5 className="text-left decl_up_head">Visitors Process</h5>
                                        <div>
                                            <div className="decl_div">
                                                <div className="d-flex align-items-center">

                                                    <img src={arogys_setu} className="decl_box_img" alt="" width="70" height="70" />
                                                    <div className="d-flex ml-2 flex-column text-left">
                                                        <p className="no-margin decl_heading">Aarogya Setu App</p>
                                                        <p className="decl_subHead">Apps is Installed or not?</p>
                                                    </div>
                                                </div>
                                                <div className="tick-t-body">
                                                    <div className={asBorderColor ? "tick_decl_div tick_decl_div" : "tick_decl_div"}>
                                                        <input type="checkbox" id="arogyaSetu" onChange={handleArogyaSetu} hidden />
                                                        <label htmlFor="arogyaSetu" className="Label-m"><CrossButton color={asCrossColor} /></label>
                                                        <input type="checkbox" id="arogyaSetu" onChange={handleArogyaSetu} hidden />
                                                        <label htmlFor="arogyaSetu" className="Label-m cross-btn"><TickButton color={asTickColor} /></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="decl_div">
                                                <div className="d-flex align-items-center">

                                                    <img src={wearing_mask} className="decl_box_img" alt="" width="70" height="70" />
                                                    <div className="d-flex ml-2 flex-column text-left">
                                                        <p className="no-margin decl_heading">Wear Mask</p>
                                                        <p className="decl_subHead">Mask is available or not?</p>
                                                    </div>
                                                </div>
                                                <div className="tick-t-body">
                                                    <div className={wmBorderColor ? "tick_decl_div tick_decl_div" : "tick_decl_div"}>
                                                        <input type="checkbox" id="wearingMask" onChange={handleWearingMask} hidden />
                                                        <label htmlFor="wearingMask" className="Label-m "><CrossButton color={wsCrossColor} /></label>
                                                        <input type="checkbox" id="wearingMask" onChange={handleWearingMask} hidden />
                                                        <label htmlFor="wearingMask" className="Label-m cross-btn"><TickButton color={wsTickColor} /></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="decl_div">
                                                <div className="d-flex align-items-center">

                                                    <img src={sanitised_hand} className="decl_box_img" alt="" width="70" height="70" />
                                                    <div className="d-flex ml-2 flex-column text-left">
                                                        <p className="no-margin decl_heading">Sanitization</p>
                                                        <p className="decl_subHead">Cleaning and Disinfection of hand?</p>
                                                    </div>
                                                </div>
                                                <div className="tick-t-body">
                                                    <div className={shBorderColor ? "tick_decl_div tick_decl_div" : "tick_decl_div"}>

                                                        <input type="checkbox" id="santisedHand" onChange={handleSantisedHand} hidden />
                                                        <label htmlFor="santisedHand" className="Label-m"><CrossButton color={shCrossColor} /></label>
                                                        <input type="checkbox" id="santisedHand" onChange={handleSantisedHand} hidden />
                                                        <label htmlFor="santisedHand" className="Label-m cross-btn"><TickButton color={shTickColor} /></label>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <label className="lbl-txt">Body Temperature</label>
                                        <input type="text"
                                            onChange={bodyTemperatureHandle}
                                            onKeyPress={(event) => {
                                                if (!/[0-9.]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            maxLength="5" className="decl_tmp" name="temprature" placeholder="00.0°F" />
                                    </div>
                                </div>
                                <hr className="decl_sepa" />
                                <div className="Upload_area pt-sm-4 pt-2 d-sm-flex align-items-center">
                                    {/* <p className="text-left">Upload File</p> */}
                                    <div className="">
                                        <div className="position-relative">
                                            {isPhotoPicked ? (
                                                <span className=" imgUploadedTxt">{selectedPhoto}</span>
                                            ) : (
                                                ""
                                            )}
                                            <input
                                                type="file"
                                                id="upload-photo"
                                                name="photo"
                                                hidden
                                                onChange={changeHandlerPhoto}
                                            />
                                            <FileUploadForVisitor
                                                changeHandler={changeHandlerPhoto}
                                                // handleclickopen={handleClickOpenPhoto}
                                                upload="false"
                                                captureButtonName="Capture Photo"
                                            />
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="position-relative">
                                            {isIdPicked ? (
                                                <span className=" imgUploadedTxt">{selectedId}</span>
                                            ) : (
                                                ""
                                            )}
                                            <input
                                                type="file"
                                                id="upload-photo"
                                                name="photo"
                                                hidden
                                                onChange={changeHandlerId}
                                            />
                                            <FileUploadForVisitor
                                                changeHandler={changeHandlerId}
                                                // handleclickopen={handleClickOpenPhoto}
                                                captureButtonName="Capture ID Proof"
                                                upload="false"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="Button-container m-sm-0 text-right pb-4 pb-sm-0">
                                    <Button onClick={goBackFunc} className="all_child_btn canc_button Btn-animate">Cancel</Button>

                                    <Button type="submit" className="Btn-primary Btn-login Btn-animate verify-Btn-primary all_child_btn">Submit</Button>
                                    {/* <Button type="submit" className="dec-Btn-primary Btn-login Btn-animate">Finish</Button> */}
                                </div>

                            </form>
                        </div>
                    </div>
                </Col>
                <Header />
                <Footer />
                {errorMessage &&
                    <ErrorNotification error={errorMessage} seterror={seterrorMessage} />}
            </Row>
        </Container>
    )
}

export default withRouter(VisitorDeclartion);