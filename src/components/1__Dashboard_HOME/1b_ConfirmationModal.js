import React, { useState } from 'react';
import { Button } from '@mui/material';


const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmText }) => (
     <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "440px" }}>
               <div style={{ padding: "24px" }}>
                    <h3
                         style={{
                              fontSize: "18px",
                              fontWeight: "600",
                              marginBottom: "8px",
                         }}
                    >
                         {title}
                    </h3>
                    <p
                         style={{
                              color: "var(--text-muted)",
                              fontSize: "14px",
                              lineHeight: 1.5,
                         }}
                    >
                         {message}
                    </p>
               </div>
               <div
                    className="modal-footer"
                    style={{ backgroundColor: "var(--bg-tertiary)" }}
               >
                    <Button
                         onClick={onCancel}
                         className="btn btn-outline"
                         style={{
                              color: "#000000",
                              backgroundColor: "#FFFFFF",
                              borderRadius: 8,
                              border: "1px solid #E0E0E0",
                              minWidth: 120,
                         }}
                    >
                         Cancel
                    </Button>
                    <Button
                         onClick={onConfirm}
                         className="btn btn-danger"
                         style={{
                              color: "white",
                              backgroundColor: "#f50057",
                              borderRadius: 8,
                              minWidth: 170,
                         }}
                    >
                         {confirmText}
                    </Button>
               </div>
          </div>
     </div>
);

export default ConfirmationModal;