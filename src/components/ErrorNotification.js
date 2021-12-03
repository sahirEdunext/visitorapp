import React from 'react';
const style={
    position: 'fixed',
    right: '10px',
    top: '10px',
    zIndex: '9'
};
export const ErrorNotification = (props) => {
    return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert" style={style}>
        {props.error}
        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={()=>props.seterror()}>
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
    )
}
