import React, { useState } from 'react';

const OnboardingModal = ({ isOpen, onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        displayName: '',
        university: ''
    });

    if (!isOpen) return null;

    const nextStep = () => setStep((s) => s + 1);

    const handleSubmit = () => {
        // Saving to profiles table
        console.log("Saving to profiles table:", formData); 
        onComplete(formData);
    };

    return (
        <>
            <style>{`
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
                    background: #1f2937; /* Matches your sidebar theme */
                    padding: 2rem;
                    border-radius: 12px;
                    width: 400px;
                    max-width: 90%;
                    color: white;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                    text-align: center;
                }
                .fade-in {
                    animation: fadeIn 0.3s ease-in;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                input, select {
                    width: 100%;
                    padding: 10px;
                    margin: 20px 0;
                    border-radius: 6px;
                    border: 1px solid #374151;
                    background: #111827;
                    color: white;
                }
                button {
                    background: #5b6cff; /* Sidebar active color */
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                }
                button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .secondary {
                    background: transparent;
                    color: #9ca3af;
                }
                .button-group {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                }
            `}</style>

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
                            <button onClick={nextStep} disabled={!formData.displayName}>Next</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="fade-in">
                            <h2>Join a University</h2>
                            <p>Which campus are you joining?</p>
                            <select 
                                value={formData.university}
                                onChange={(e) => setFormData({...formData, university: e.target.value})}
                            >
                                <option value="">Select University...</option>
                                <option value="nirma">Nirma University</option>
                                <option value="nirma_tech">Nirma Technology</option>
                                <option value="nirma_support">Nirma Support</option>
                            </select>
                            <div className="button-group">
                                <button className="secondary" onClick={() => setStep(1)}>Back</button>
                                <button onClick={handleSubmit} disabled={!formData.university}>Complete</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OnboardingModal;