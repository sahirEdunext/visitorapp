import React from 'react';
import { withRouter } from 'react-router-dom';
import './Modal.css';

const Modal = (props) => {
    return (
            <div className="Modal">
                <div className={props.content ?"pmb-modal modal-show" :"pmb-modal" } tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">{props.title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={()=>props.hidepopupfn('')}>
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body scrllAble">
                        {props.content}
                    </div>
                    </div>
                </div>
                </div>
            </div>
    );
}

export default withRouter(Modal);    