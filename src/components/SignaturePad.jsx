import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser, Check } from 'lucide-react';

const SignaturePad = forwardRef(({ label, onClear }, ref) => {
    const sigCanvas = useRef(null);

    useImperativeHandle(ref, () => ({
        isEmpty: () => sigCanvas.current ? sigCanvas.current.isEmpty() : true,
        getDataUrl: () => {
            if (!sigCanvas.current || sigCanvas.current.isEmpty()) return null;
            // Bypass getTrimmedCanvas() due to trim-canvas dependency issue in Vite
            return sigCanvas.current.getCanvas().toDataURL('image/png');
        },
        clear: () => {
            if (sigCanvas.current) {
                sigCanvas.current.clear();
            }
            if (onClear) onClear();
        }
    }));

    const clear = () => {
        if (sigCanvas.current) sigCanvas.current.clear();
        if (onClear) onClear();
    };

    return (
        <div className="signature-pad-wrapper">
            <label className="signature-label">{label}</label>
            <div className="signature-pad-container">
                <SignatureCanvas
                    ref={sigCanvas}
                    penColor="#1E3A8A"
                    canvasProps={{ className: 'signature-canvas' }}
                />
            </div>
            <div className="signature-pad-actions">
                <button type="button" className="btn-icon" onClick={clear} title="Clear Signature">
                    <Eraser size={16} /> Clear
                </button>
                <div className="signature-status">
                    <Check size={14} color="var(--secondary-green)" /> Ready
                </div>
            </div>
        </div>
    );
});

export default SignaturePad;
