import React, { useContext } from 'react';
import { withRouter } from "react-router-dom";
import { SchoolContext } from "../../App"
import poweredBy from "../../icons/poweredBy.png";
import './DFooter.css';

const DFooter = (props) => {

    const redirectMap = (addr) => {
        window.open(`https://www.google.co.in/maps/place/${addr}`, '_blank');
    }

    const schoolinfo = useContext(SchoolContext);

    return (
        <div className="mobile-hide dfooter">
            <div className="d-flex align-items-center justify-content-between ">
                <div className="w-100">
                    <p className="my-2"><i className="icon-call"></i>{schoolinfo ? schoolinfo.school_mobile : ''}</p>
                    <p className=" brkWord">
                        <i target="_blank" className="icon-location" onClick={() => redirectMap(schoolinfo ? schoolinfo.school_address : '')}></i>{schoolinfo ? schoolinfo.school_address : ''}
                    </p>
                </div>
                <div>
                    <span className="para-powered">Powered By</span> <span className="powered-img-span"><a target="blank" href="https://www.edunexttechnologies.com/"> <img className="img-powered" src={poweredBy} alt="" /></a></span>
                </div>
            </div>
        </div>
    );

}

export default withRouter(DFooter);