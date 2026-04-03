import React, { useState, useMemo, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { ShoppingCart, PenTool, X, CheckCircle } from 'lucide-react';
import SignaturePad from './SignaturePad';

const RecordSale = ({ onNavigate }) => {
  const { products, recordSale } = useInventory();
  const [formData, setFormData] = useState({ productId: '', quantity: 1 });
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [success, setSuccess] = useState('');

  const merchantSigRef = useRef(null);
  const customerSigRef = useRef(null);

  const [modalError, setModalError] = useState('');

  const selectedProduct = useMemo(() =>
    products.find(p => p.id === formData.productId),
    [products, formData.productId]
  );

  const totalPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    return selectedProduct.price * formData.quantity;
  }, [selectedProduct, formData.quantity]);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!formData.productId || formData.quantity < 1) return;

    // Check stock before opening signature modal
    const product = products.find(p => p.id === formData.productId);
    if (!product || product.quantity < formData.quantity) {
      alert("Insufficient stock!");
      return;
    }

    setModalError('');
    setShowSignatureModal(true);
  };

  const handleFinalizeSale = () => {
    const mSig = merchantSigRef.current ? merchantSigRef.current.getDataUrl() : null;
    const cSig = customerSigRef.current ? customerSigRef.current.getDataUrl() : null;

    const missing = [];
    if (!formData.merchantName || !formData.merchantName.trim()) missing.push(formData.merchantName === undefined ? "Seller Name" : "Seller Name"); // using the latter mostly
    if (!formData.customerName || !formData.customerName.trim()) missing.push("Buyer Name");
    if (!mSig) missing.push("Merchant Signature");
    if (!cSig) missing.push("Customer Signature");

    if (missing.length > 0) {
      setModalError(`Please complete all fields. Missing: ${missing.join(', ')}`);
      return;
    }

    const saleData = { ...formData };
    const transactionInfo = {
      merchantSignature: mSig,
      customerSignature: cSig,
      merchantName: formData.merchantName.trim(),
      customerName: formData.customerName.trim()
    };

    console.log("Finalizing sale...");
    const result = recordSale(saleData, transactionInfo);
    console.log("Sale record result:", result);

    if (result) {
      setSuccess('Transaction completed successfully! Redirecting...');
      setFormData({ productId: '', quantity: 1, merchantName: '', customerName: '' });
      setModalError('');
      setShowSignatureModal(false);

      // Auto redirect to sales history after a brief delay
      setTimeout(() => {
        setSuccess('');
        if (onNavigate) {
          onNavigate('sales-history');
        }
      }, 1500);
    } else {
      setModalError("Failed to record sale. Please check stock or product selection.");
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <ShoppingCart size={32} color="var(--primary-blue)" />
        <h1>Record Sale</h1>
      </div>

      <div className="card">
        {success && (
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#D1FAE5',
            color: '#065F46',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle size={20} /> {success}
          </div>
        )}
        <form onSubmit={handleInitialSubmit}>
          <label htmlFor="product">Product to Sell</label>
          <select
            id="product"
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            required
          >
            <option value="">-- Choose from available stock --</option>
            {products.map(p => (
              <option key={p.id} value={p.id} disabled={p.quantity === 0}>
                {p.name} ({p.price.toLocaleString()} FCFA) — {p.quantity} available
              </option>
            ))}
          </select>

          <label htmlFor="quantity">Sale Quantity</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            required
          />

          {selectedProduct && (
            <div style={{
              background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
              padding: '1.5rem',
              borderRadius: '15px',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #E5E7EB'
            }}>
              <div>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 600 }}>Total To Pay</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  {totalPrice.toLocaleString()} FCFA
                </p>
              </div>
              <ShoppingCart size={32} color="#E5E7EB" />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={!formData.productId}>
            <PenTool size={20} /> Continue to Signatures
          </button>
        </form>
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ background: 'var(--white)', padding: '1.25rem', borderRadius: '24px', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Authorize Transaction</h2>
              <button className="btn-icon" onClick={() => setShowSignatureModal(false)}>
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div style={{ padding: '0.8rem', background: '#FEE2E2', color: '#991B1B', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #FCA5A5' }}>
                {modalError}
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="signature-label" style={{ marginBottom: '0.4rem', display: 'block' }}>Seller (Merchant) Name</label>
              <input
                type="text"
                placeholder="Enter merchant name"
                value={formData.merchantName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, merchantName: e.target.value }))}
                style={{
                  marginBottom: '1rem',
                  padding: '0.6rem',
                  border: (!formData.merchantName && modalError) ? '1px solid #EF4444' : '1px solid var(--border-color)'
                }}
              />

              <label className="signature-label" style={{ marginBottom: '0.4rem', display: 'block' }}>Buyer (Customer) Name</label>
              <input
                type="text"
                placeholder="Enter customer name"
                value={formData.customerName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                style={{
                  marginBottom: '1rem',
                  padding: '0.6rem',
                  border: (!formData.customerName && modalError) ? '1px solid #EF4444' : '1px solid var(--border-color)'
                }}
              />
            </div>

            <div className="signature-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div style={{ borderRadius: '12px' }}>
                <SignaturePad
                  ref={merchantSigRef}
                  label="Merchant (Manager)"
                />
              </div>
              <div style={{ borderRadius: '12px' }}>
                <SignaturePad
                  ref={customerSigRef}
                  label="Customer Signature"
                />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '0.6rem' }} onClick={() => setShowSignatureModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 2, padding: '0.6rem' }}
                onClick={handleFinalizeSale}
              >
                <CheckCircle size={18} /> Confirm & Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordSale;
