import React, { useState } from 'react';



const  EditEventModal = ({ event, onSave, onClose }) => {
    // Use imageUrl consistently
    const [formData, setFormData] = useState({
        ...event,
        imageUrl: event.imageUrl || "",
    });
    const [imagePreview, setImagePreview] = useState(event.imageUrl || "");
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                // Don't set image in formData, just preview; imageUrl will be updated after upload
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.title ||
            !formData.date ||
            !formData.time ||
            !formData.location ||
            !formData.description
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        // Use imageFile from useState, and pass imageUrl as well
        onSave({ ...formData, imageFile: imageFile });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Edit Event</h2>
                    <button className="close-button" onClick={onClose}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form">
                            <div className="form-group">
                                <label className="form-label" htmlFor="title">
                                    Event Title
                                </label>
                                <input
                                    className="form-input"
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label
                                        className="form-label"
                                        htmlFor="date"
                                    >
                                        Date
                                    </label>
                                    <input
                                        className="form-input"
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        className="form-label"
                                        htmlFor="time"
                                    >
                                        Time
                                    </label>
                                    <input
                                        className="form-input"
                                        type="time"
                                        id="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label
                                    className="form-label"
                                    htmlFor="location"
                                >
                                    Location
                                </label>
                                <input
                                    className="form-input"
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Event Image
                                </label>
                                <input
                                    type="file"
                                    id="image-upload-edit"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    // className="hidden"
                                    className="form-group"
                                />
                                <label
                                    htmlFor="image-upload-edit"
                                    className="image-upload"
                                >
                                    Click to upload image
                                </label>
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="image-preview"
                                        style={{
                                            maxWidth: 360,
                                            maxHeight: 360,
                                            display: "block",
                                            margin: "30px auto 0",
                                        }}
                                    />
                                )}
                            </div>
                            <div className="form-group">
                                <label
                                    className="form-label"
                                    htmlFor="description"
                                >
                                    Description
                                </label>
                                <textarea
                                    className="form-textarea"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default EditEventModal;