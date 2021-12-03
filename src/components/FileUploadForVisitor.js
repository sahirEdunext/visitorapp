import React,{useState,} from 'react';
import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
import Camera from 'react-html5-camera-photo';
import {ErrorNotification} from './ErrorNotification'
import 'react-html5-camera-photo/build/css/index.css';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import captureButtonIcon from '../icons/captureButtonIcon.svg'
// import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
const style ={
    position: 'fixed',
    right: '10px',
    top: '10px'
};
const captureImgst = {
    width: '24px'
};
const imgstyle={
    display:'block',
    // maxWidth:'100px',
    padding:'0px',
    margin:'0px auto',
    borderRadius: "6px",
    objectFit: "cover",
    height: "75px",
    width: "7rem",
    marginRight: "5px"
}
const labelstyle={
    display:'inline-block',
    fontSize:'12px',
    color:'blue',
    cursor:'pointer'
}
const webbox={
    display:'block',
    border:'1px solid red',
    position: 'fixed',
    background: "#2e2e2ea6",
    left: '1px',
    top: '1px',
    width: '100%',
    height: '99vh',
    zIndex:'1111'
}
const close={
    position:'fixed',
    top:'25px',
    right:'25px',
    fontSize: '20px',
    color: 'white',
    fontWeight: 'bold',
    cursor:'pointer',
    padding: '1px 9px 1px 8px',
    background: '#503bec',
    borderRadius: '22px',
}
const capturestyle={
    color: "#1100B4",
    cursor: "pointer",
    fontSize: "13px",
    marginSeft: "10px",
    background: "#1100B405",
    border: "1.5px dashed #1100B4",
    borderRadius: "6px",
    padding: "15px 0px",
    fontFamily: 'Hind',
    fontWeight: "600",
    margin: "5px",
    width: "7rem",
}
export const FileUploadForVisitor = (props) => {
    const [imgSrc,setImageSrc]=useState('');
    const [capimgSrc,setCaptureImageSrc]=useState('');
    const [openwebcam, setOpenWebcam] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');
    const [imgName, setimgName] = useState();

    const handleClose = () => {
        props.handleclickopen(false);
      };
    const changeFileHandler = (event) =>{
        const type=event.target.files[0].type;
        if(type == 'image/jpeg' || type == 'image/jpg' || type == 'image/png'){
            props.changeHandler(event.target.files[0]);
            const reader = new FileReader();
            const url = reader.readAsDataURL(event.target.files[0]);
            reader.onloadend = function (e) {
                setImageSrc(reader.result);
              }
              setCaptureImageSrc('');
            seterrorMessage('');
        }else{
            seterrorMessage('Error: Only jpeg,png,jpg supported');
        }
        // props.handleclickopen(false);
    }
 
    const b64toBlob=(b64Data, contentType, sliceSize)=> {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }
    const handleTakePhoto=(dataUri)=>{
        setCaptureImageSrc(dataUri);
        setImageSrc('');
        const block = dataUri.split(";");
        if(block[1]){
            const contentType = block[0].split(":")[1];
            const realData = block[1].split(",")[1];
    
            const blob = b64toBlob(realData, contentType);
            blob.lastModifiedDate = new Date();
            const random=Math.floor(100000 + Math.random() * 900000);
            blob.name = 'img'+random+'.jpeg';
            setimgName(blob.name)
            // const myFile = new File([blob], "image.jpeg", {
            //     type: blob.type,
            //   });
            props.changeHandler(blob, dataUri);   
            // props.imageSource(dataUri);
        }
        setOpenWebcam(false);
    }
    return (
        <div className="">
            <div
                open={true}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                >
                {/* <div id="responsive-dialog-title"><p className="purpose-text">Choose Action</p></div> */}
                <div>
                    <div className="d-flex align-items-center col-12 p-0">
                        {imgSrc && <img style={imgstyle} src={imgSrc} />}
                        {capimgSrc && <img style={imgstyle} src={capimgSrc} />}
                        {imgName && <span className=" imgUploadedTxt">{imgName}</span>}
                        {props.upload == "false" ? null : 
                        <div className="position-relative">
                        <input type="file" id="upload-id" name="idcard" hidden onChange={changeFileHandler}/>
                        <label htmlFor="upload-id" style={labelstyle}><PermMediaIcon/> Choose file</label>
                        </div>}
                        <span style={capturestyle} className="captureButtonCam" onClick={()=>setOpenWebcam(true)}><img style={captureImgst} src={captureButtonIcon} alt="" /><br /> {props.captureButtonName}</span>
                        {openwebcam &&
                        <span style={webbox}>
                            <Camera
                                imageType='jpg'
                                idealFacingMode='FACING_MODES.ENVIRONMENT'
                                onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                            />
                        <span style={close} onClick={()=>setOpenWebcam(false)}>&#x2716;</span>
                        </span>}
                    </div>
                </div>
                <div>
                    {/* <Button  onClick={handleClose} color="primary">
                    Done
                    </Button> */}
                </div>
            </div>
            {errorMessage &&
                <ErrorNotification error={errorMessage} seterror={seterrorMessage}/>}
        </div>
    )
}