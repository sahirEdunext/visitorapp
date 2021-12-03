import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import avatar2 from '../../icons/img_avatar.png';
import './VisitorCard.css';
import Button from '@material-ui/core/Button';
import moment from "moment";
import { visitorCheckOut } from '../../service/backendService';
import { ErrorNotification } from '../../components/ErrorNotification';

const VisitorCard = (props) => {
    const [errorMessage, seterrorMessage] = useState('');

    const checkOut = (id, type) => {
        visitorCheckOut({ 'id': id, 'type': type })
            .then(res => {
                // getVisitorList();
                console.log(res.data);
                props.history.push({
                    pathname: '/checkinThankyou',
                    state: {
                        data: res.data
                    }
                });
            })
            .catch(err => {
                if (err.response) {
                    seterrorMessage('Error: ' + err.response.data.message);
                } else {
                    seterrorMessage('Error: Some error occurred');
                }
            })
    }
    return (
        <div className="card cus_vis_box">
            <div className="row no-gutters">
                <div className="col-3 visitor-avatar">
                    <img src={props.data.imageurl ? props.data.imageurl : avatar2} className="img-fluid Card-img" alt="" />
                </div>
                <div className="col-9" style={{ backgroundColor: "white" }}>
                    <div className="card-block">
                        <div className="Person-name mt-1 text-capitalize">{props.data.name}</div>
                        <div className="description mb-2">
                            <div className="w-col-6">
                                <div><span className="V-key"> Check In :</span><span className="V-value"><span className="date">{props.data.intime ? props.data.intime : 'Not Checked In'}</span></span></div>
                                {props.data.appointmenttime && <div><span className="V-key">Appointment :</span ><span className="V-value text-capitalize">{moment(props.data.appointmenttime, 'hh:mm').add(5.5, 'hours').format('hh:mm A')}</span></div>}
                                <div><span className="V-key">Visitor Type :</span><span className="V-value text-capitalize">{props.data.visit_type == 'visitor' ? 'Walk-In' : props.data.visit_type}</span></div>
                            </div>
                            <div className="w-col-6">
                                {props.data.organisation_name && <div><span className="V-key">Company :</span ><span className="V-value text-capitalize">{props.data.organisation_name}</span></div>}
                                <div><span className="V-key"> Check Out :</span><span className="V-value"><span className="date">{props.data.outtime ? props.data.outtime : 'Not Checked Out'}</span></span></div>
                            </div>
                            <p style={{ verticalAlign: "baseline" }}><span className="V-key">Purpose :</span><span className="V-value text-capitalize">{props.data.purpose_name.length > 59 ? props.data.purpose_name.substring(0, 59) : props.data.purpose_name}
                                {props.data.purpose_name.length > 59 ? <span data-target="bs-modal" className="read-more" onClick={() => props.popupfn(props.data.purpose_name)}>...read more</span> : ''}
                            </span></p>

                        </div>
                    </div>
                </div>
            </div>
            <div className="card-footer text-muted p-0 mt-2">
                {!props.data.intime &&
                    <button className="CheckIn-btn"
                        onClick={() => props.history.push({
                            pathname: '/declaration',
                            state: {
                                visitor_data: props.data,
                            }
                        })} >Check In</button>
                }
                {!props.data.outtime && props.data.intime && <Button className="CheckOut-btn" onClick={() => checkOut(props.data.id, props.data.type)}>Check Out</Button>}

            </div>
            {errorMessage &&
                <ErrorNotification error={errorMessage} seterror={seterrorMessage} />}
        </div>
    )
}

export default withRouter(VisitorCard);