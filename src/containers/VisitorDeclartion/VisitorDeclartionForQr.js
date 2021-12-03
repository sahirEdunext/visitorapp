import React, { useState, useEffect} from 'react';
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
import {visitorCheckIn} from '../../service/backendService';
import {ErrorNotification} from '../../components/ErrorNotification'
import Button from '@material-ui/core/Button';
import {FileUpload} from '../../components/FileUpload'

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
    const[visitor_data, setVisitorData]=useState({});
    const [asBorderColor, setAsBorderColor] = useState(false);
    const [shBorderColor, setShBorderColor] = useState(false);
    const [wmBorderColor, setWmBorderColor] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');

    const onSubmit = (e) => {
        // console.log(visitorData)
        e.preventDefault();
        const data={
            "id":visitor_data.id,
            "securityGarudId":profiledata.id,
            "type": visitor_data.type,
            "wearingMask" : wsVal,
            "sanitisedHand" : shVal,
            "argayusetuApp" : asVal
        }
        const formData = new FormData();
        formData.append('idcard',selectedIdFile);
        formData.append('photo', selectedPhotoFile);
        formData.append('checkInRequest',JSON.stringify(data));
        visitorCheckIn(formData)
        .then(res => {
            props.history.push({ pathname: '/Qrvisitors', state: data.id });
        })
        .catch(err=>{
            if(err.response){
                seterrorMessage('Error: '+err.response.data.message);
              }else{
                seterrorMessage('Error: Some error occurred');
              }
        })
    }
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
            setShCrossColor("#9c9c9c")
        }
        else {
            setShBorderColor(false);
            setShTickColor("#9c9c9c");
            setShCrossColor("#ff7171");
        }
    }
    const [selectedId, setSelectedId] = useState();
    const [selectedIdFile, setSelectedIdFile] = useState([]);
	const [isIdPicked, setIsIdPicked] = useState(false);

    const [selectedPhoto, setSelectedPhoto] = useState();
    const [selectedPhotoFile, setSelectedPhotoFile] = useState([]);
	const [isPhotoPicked, setIsPhotoPicked] = useState(false);
    const [profiledata,setProfileData]=useState({});

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
    useEffect(
        ()=>{
            setProfileData(JSON.parse(sessionStorage.authguard));
            setVisitorData(props.location.state.visitor_data);
        }
    ,[])
    const bodyTemperatureHandle = (e) => {
        
        if(e.target.value >= "38.00") {
            // console.log("body valid Temperature", e.target.value)
            seterrorMessage("Body temperature not valid")
        } else {
            // seterrorMessage("Body temperature not valid")
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
                    <DFooter/>
                </Col>
                <Col sm={6} className="right-col">
                    <div className="Box-right">
                        <div className="Login-form visitor-declaration-form">
                            {/* <div className="">
                                <img className="" width="40px" src={avatar} />
                            </div> */}
                            <form onSubmit={onSubmit} autoComplete="off">
                                <div className="mt-3 mb-4 mmb-1">
                                    <table width="100%">
                                        <tbody>
                                            <tr className="tr-styling">
                                                <td width="40%">
                                                    <p className="no-margin">Wearing mask</p>
                                                    <img src={wearing_mask} className="rounded-circle mt-2" alt="" width="70" height="70" />
                                                </td>
                                                <td className="tick-t-body">
                                                    <div className={wmBorderColor ? "tick-border border-green" : "tick-border" }>
                                                    <input type="checkbox" id="wearingMask" onChange={handleWearingMask} hidden />
                                                    <label htmlFor="wearingMask" className="Label-m"><TickButton color={wsTickColor} /></label>
                                                    <input type="checkbox" id="wearingMask" onChange={handleWearingMask} hidden />
                                                    <label htmlFor="wearingMask" className="Label-m cross-btn"><CrossButton color={wsCrossColor} /></label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="tr-styling">
                                                <td width="40%">
                                                    <p className="no-margin">Sanitised Hands</p>
                                                    <img src={sanitised_hand} className="rounded-circle mt-2" alt="" width="70" height="70" />
                                                </td>
                                                <td className="tick-t-body">
                                                    <div className={shBorderColor ? "tick-border border-green" : "tick-border" }>
                                                    <input type="checkbox" id="santisedHand" onChange={handleSantisedHand} hidden />
                                                    <label htmlFor="santisedHand" className="Label-m"><TickButton color={shTickColor} /></label>

                                                    <input type="checkbox" id="santisedHand" onChange={handleSantisedHand} hidden />
                                                    <label htmlFor="santisedHand" className="Label-m cross-btn"><CrossButton color={shCrossColor} /></label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="tr-styling">
                                                <td width="40%">
                                                    <p className="no-margin">Aarogya Setu</p>
                                                    <img src={arogys_setu} className="rounded-circle mt-2" alt="" width="70" height="70" />
                                                </td>
                                                <td className="tick-t-body">
                                                    <div className={asBorderColor ? "tick-border border-green" : "tick-border" }>
                                                    <input type="checkbox" id="arogyaSetu" onChange={handleArogyaSetu} hidden />
                                                    <label htmlFor="arogyaSetu" className="Label-m"><TickButton color={asTickColor} /></label>
                                                    <input type="checkbox" id="arogyaSetu" onChange={handleArogyaSetu} hidden />
                                                    <label htmlFor="arogyaSetu" className="Label-m cross-btn"><CrossButton color={asCrossColor} /></label>
                                                    </div>
                                                </td>
                                            </tr>
                                           </tbody>
                                    </table>
                                </div>
                                <div className="temp-area mt-4">
                                    <div className="temp-icon float-left mr-2">
                                        <img height="40px" src={temp_icon} alt="temprature"/>
                                    </div>
                                    <div className="temp-data float-right">
                                        <p className="temp">
                                        <input type="text"
                                        onBlur={bodyTemperatureHandle}
                                        onKeyPress={(event) => {
                                            if (!/[0-9.]/.test(event.key)) {
                                            event.preventDefault();
                                            }
                                        }}
                                       maxLength="5" name="temprature" placeholder="00.00"/>
                                      </p><span><sup>o</sup>C</span>
                                        <p className="temp-text">Body Temperature</p>
                                    </div>
                                </div>
                                <div className="Upload_area">
                                    <div className="Field-group Field-group-adm Inline-block Photo-icon">
                                        {isPhotoPicked?<span className="doc-text">{selectedPhoto}</span>:''}
                                        {/* <input type="file" id="upload-photo" name="photo" hidden onChange={changeHandlerPhoto}/> */}
                                        <span onClick={()=>handleClickOpenPhoto(true)}  htmlFor="upload-photo" className="Upload-id"><img src={photo_icon} className="photo_icon" alt=""/>Upload Photo</span>
                                        {openphoto && 
                                        <FileUpload changeHandler ={changeHandlerPhoto} handleclickopen={handleClickOpenPhoto} />}
                                    </div>
                                    <div className="Field-group Field-group-adm Inline-block Card-icon">
                                        {isIdPicked?<span className="doc-text">{selectedId}</span>:''}
                                        {/* <input type="file" id="upload-id" name="idcard" hidden onChange={changeHandlerId}/> */}
                                        <span onClick={()=>handleClickOpen(true)} htmlFor="upload-id" className="Upload-id"><img src={id_card_icon} className="id_card_icon" alt="" />Upload ID Card</span>
                                        {open && 
                                        <FileUpload changeHandler ={changeHandlerId} handleclickopen={handleClickOpen} />}
                                    </div>
                                </div>
                                <div className="Button-container">
                                    <Button type="submit" className="dec-Btn-primary Btn-login Btn-animate">Finish</Button>
                                </div>

                            </form>
                        </div>
                    </div>
                </Col>
                <Header/>
                <Footer/>
                {errorMessage &&
            <ErrorNotification error={errorMessage} seterror={seterrorMessage}/>}
            </Row>
        </Container>
    )
}

export default withRouter(VisitorDeclartion);