import axios from 'axios';
import { HOST_URL, TEST_URL } from '../config/constant';

const getHostUrl = () => {
    // console.log(localStorage)
    return 'https://'+localStorage.getItem('host_url')+'/api/visitor';
    // return 'https://0177-103-117-12-129.ngrok.io/api/visitor';
}
export const register = (data) => {
    return axios({
        data: data,
        method: 'POST',
        url: `${getHostUrl()}/register`,
    });
}
export const guardLogin = (data) => {
    return axios({
        data: data,
        method: 'POST',
        url: `${getHostUrl()}/securitygaurdlogin`,
    });
}
export const varifyOtp = (data) => {
    return axios({
        data: data,
        method: 'POST',
        url: `${getHostUrl()}/varifyotp/`,
    });
}
export const resendOTP = (data) => {
    return axios({
        data: data,
        method: 'POST',
        url: `${getHostUrl()}/resendOTP/`,
    });
}

export const getClasses = () => {
    return axios({
        headers :{
            contentType : "application/json"
        },
        method: 'GET',
        url: `${getHostUrl()}/classes`,
    });
}
export const getVendorPurpose = (data) => {
    return axios({
        data: data,
        headers :{
            contentType : "application/json"
        },
        method: 'GET',
        url: `${getHostUrl()}/vendorpurpose?is_appointment=${data}`,
    });
}
export const getGeneralPurpose = (data) => {
    return axios({
        data: data,
        headers :{
            contentType : "application/json"
        },
        method: 'GET',
        url: `${getHostUrl()}/generalpurpose?is_appointment=${data}`,
    });
}
export const meetingToList = (data) => {
    return axios({
        data: data,
        headers :{
            contentType : "application/json"
        },
        method: 'GET',
        url: `${getHostUrl()}/meetingtolist?purposeid=${data}`,
    });
}
export const getVisitorCount = () => {
    return axios({
        headers :{
            contentType : "application/json"
        },
        method: 'GET',
        url: `${getHostUrl()}/visitorcount`,
    });
}
export const admissionForm = (data) => {
    return axios({
        data: data,
        method: 'POST',
        url: `${getHostUrl()}/admissionRegister`,
    });
}
export const generalForm = (data) => {
    return axios({
        data: data,
        method: 'POST',
        url: `${getHostUrl()}/generalRegister`,
    });
}
export const vendorForm = (data) => {
    return axios({
        data: data,
        method: 'POST',
        url: `${getHostUrl()}/vendorRegister`,
    });
}
export const visitorsList = () => {
    return axios({
        headers :{
            contentType : "application/json"
        },
        method: 'GET',
        url: `${getHostUrl()}/visitorlist`,
    });
}
export const getSourceOfInformationList = () => {
    return axios({
        headers :{
            contentType : "application/json"
        },
        method: 'GET',
        url: `${getHostUrl()}/sourceofinformationlist`,
    });
}
export const visitorCheckIn = (data) => {
    return axios({
        data: data,
        method: 'POST',
        url: `${getHostUrl()}/visitorcheckin`,
    });
}
export const visitorCheckOut = (data) => {
    return axios({
        data: data,
        method: 'POST',
        url: `${getHostUrl()}/visitorcheckout`,
    });
}
export const getSchoolData = () => {
    return axios({
        headers :{
            contentType : "application/json"
        },
        method: 'GET',
        url: `${getHostUrl()}/schoolDetails`,
    });
}

export const getSchoolDetails = (code) => {
    return axios({
        headers: {
            contentType : "application/json"
        },
        method: 'GET',
        url: `${TEST_URL}/mobile/visitorSchoolDetails?visitor_code=${code}`
    })
}
export const getAvaiableSlot = (data) => {
    return axios({
        data: data,
        headers :{
            contentType: 'application/json'
        },
        method: 'POST',
        url: `${getHostUrl()}/avaiableSlot`
    })
}
export const checkVisitorCode = (data) => {
    return axios({
        headers: {
            contentType : "application/json"
        },
        method: "GET",
        url: `${TEST_URL}/mobile/checkVisitorCode?visitor_code=${data}`
    })
}

export const checkParentRecord = (data) => {
    return axios({
        headers: {
            contentType : "application/json"
        },
        method: "GET",
        url: `${getHostUrl()}/checkParentRecord?mobileno=${data.mobileno}`
    })
}
export const varifyParentotp = (data) => {
    return axios({
        headers: {
            contentType : "application/json"
        },
        method: "POST",
        url: `${getHostUrl()}/varifyParentotp`,
        data: data
    })
}
export const parentpurpose = (data) => {
    return axios({
        headers: {
            contentType : "application/json"
        },
        method: "GET",
        url: `${getHostUrl()}/parentpurpose?is_appointment=${data}`,
        data: data
    })
}
export const parentRegister = (data) => {
    return axios({
        headers: {
            contentType : "application/json"
        },
        url: `${getHostUrl()}/parentRegister`,
        method: "POST",
        data:data
    })
}

export const markStudentAttendance = (data) => {
    return axios({
        headers: {
            contentType : "application/json"
        },
        url: `${TEST_URL}/visitorapp/markStudentAttendanceThroughQRCode?admissionno=${data}`,
        method: "GET",
        data:data
    })
}

export const parentMeetingHistory = (data) => {
    return axios({
        headers: {
            contentType : "application/json"
        },
        url: `${getHostUrl()}/parentMeetingHistory?mobileno=${data.mobileno}`,
        method: "POST",
        data:data
        })
}