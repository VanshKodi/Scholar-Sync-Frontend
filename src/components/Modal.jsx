import React, { useState } from 'react';

const modalStyles = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .modal-content {
        background: #1f2937;
        padding: 2rem;
        border-radius: 12px;
        width: 400px;
        max-width: 90%;
        color: white;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        text-align: center;
    }
    .modal-content p.modal-error {
        color: #f87171;
        font-size: 0.875rem;
        margin-top: 8px;
    }
    .fade-in {
        animation: fadeIn 0.3s ease-in;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .modal-content input, .modal-content select {
        width: 100%;
        padding: 10px;
        margin: 20px 0 8px;
        border-radius: 6px;
        border: 1px solid #374151;
        background: #111827;
        color: white;
        box-sizing: border-box;
    }
    .modal-content button {
        background: #5b6cff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
    }
    .modal-content button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .modal-content .secondary {
        background: transparent;
        color: #9ca3af;
    }
    .modal-content .danger {
        background: #dc2626;
    }
    .button-group {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 12px;
    }
`;

const OnboardingModal = ({ isOpen, onComplete, error }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        displayName: '',
        universityId: ''
    });

    if (!isOpen) return null;

    const nextStep = () => setStep((s) => s + 1);

    const handleSubmit = () => {
        onComplete(formData);
    };

    return (
        <>
            <style>{modalStyles}</style>
            <div className="modal-overlay">
                <div className="modal-content">
                    {step === 1 && (
                        <div className="fade-in">
                            <h2>Welcome to ScholarSync!</h2>
                            <p>What should we call you?</p>
                            <input
                                type="text"
                                placeholder="Display Name"
                                value={formData.displayName}
                                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                            />
                            {error && <p className="modal-error">{error}</p>}
                            <button onClick={nextStep} disabled={!formData.displayName}>Next</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="fade-in">
                            <h2>Join a University</h2>
                            <p>Which campus are you joining?</p>
                            <input
                                type="text"
                                placeholder="University ID"
                                value={formData.universityId}
                                onChange={(e) => setFormData({...formData, universityId: e.target.value})}
                            />
                            {error && <p className="modal-error">{error}</p>}
                            <div className="button-group">
                                <button className="secondary" onClick={() => setStep(1)}>Back</button>
                                <button onClick={handleSubmit} disabled={!formData.universityId}>Complete</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export const JoinUniversityModal = ({ isOpen, onSubmit, onClose, error }) => {
    const [universityId, setUniversityId] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(universityId);
    };

    return (
        <>
            <style>{modalStyles}</style>
            <div className="modal-overlay">
                <div className="modal-content fade-in">
                    <h2>Join a University</h2>
                    <p>Enter the University ID (UUID) provided by your institution.</p>
                    <input
                        type="text"
                        placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                        value={universityId}
                        onChange={(e) => setUniversityId(e.target.value)}
                    />
                    {error && <p className="modal-error">{error}</p>}
                    <div className="button-group">
                        <button className="secondary" onClick={onClose}>Cancel</button>
                        <button onClick={handleSubmit} disabled={!universityId}>Join</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export const LeaveUniversityModal = ({ isOpen, universityId, onConfirm, onClose, error }) => {
    if (!isOpen) return null;

    return (
        <>
            <style>{modalStyles}</style>
            <div className="modal-overlay">
                <div className="modal-content fade-in">
                    <h2>Leave University</h2>
                    <p>
                        Are you sure you want to leave{' '}
                        <strong>{universityId || 'your current university'}</strong>?
                        This action cannot be undone.
                    </p>
                    {error && <p className="modal-error">{error}</p>}
                    <div className="button-group">
                        <button className="secondary" onClick={onClose}>Cancel</button>
                        <button className="danger" onClick={onConfirm}>Leave</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OnboardingModal;