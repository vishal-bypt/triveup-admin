'use client';

import PropTypes from 'prop-types';
import { Image } from "react-bootstrap";

const ImageViewer = ({ title, imageUrl, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay"></div>

            <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">{title}</h1>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Image thumbnail src={imageUrl} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// ImageViewer.propTypes = {
//     title: PropTypes.string.isRequired,
//     imageUrl: PropTypes.string.isRequired,
//     isOpen: PropTypes.bool.isRequired,
//     onClose: PropTypes.func.isRequired,
// };

export default ImageViewer;