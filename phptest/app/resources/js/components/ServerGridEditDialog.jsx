import React from "react";

export default function ServerGridEditDialog({
  formComponent,
  isEditing = false,
  onCancel,
  onSave,
}) {
  const title = isEditing ? "Edit" : "Add";

  const handleSave = () => {
    if (typeof onSave === "function") {
      onSave();
    }
  };

  const handleCancel = () => {
    if (typeof onCancel === "function") {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        <button
          onClick={handleCancel}
          className="edit-modal-close"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="edit-modal-title">{title}</h2>

        {formComponent}

        <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="edit-modal-close-btn"
            style={{ backgroundColor: '#111827' }}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="edit-modal-save-btn"
            style={{ backgroundColor: '#22c55e' }}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
