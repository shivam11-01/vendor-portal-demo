import React from 'react'
import './spinner.css'

const Spinner = ({ loader, className }) => {
    return (
        <>
            {loader ?
                <div className={`spinner ${className}`}>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
                : ""}
        </>
    )
}

const SmallSpinner = ({ loader, className }) => {
    return (
        <>
            {loader ?
                <div className={`smallspinner ${className}`}>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
                : ""}
        </>
    )
}

export {
    Spinner, SmallSpinner,
};