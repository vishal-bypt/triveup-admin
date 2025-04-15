'use client';

import PropTypes from 'prop-types';

const Modal = ({ title, description, isOpen, onClose, onConfirm }) => {
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
                        <div className="modal-body">
                            {description}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={onConfirm}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Modal.propTypes = {
//     title: PropTypes.string.isRequired,
//     description: PropTypes.string.isRequired,
//     isOpen: PropTypes.bool.isRequired,
//     onClose: PropTypes.func.isRequired,
//     onConfirm: PropTypes.func.isRequired,
// };

export default Modal;