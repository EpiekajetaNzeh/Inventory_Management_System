import React from 'react';
import { Share2, Download, Printer, CheckCircle, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const Receipt = ({ sale, onDownload }) => {
  if (!sale) return null;

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="receipt-container" id={`receipt-${sale.id}`}>
      {/* Receipt Header */}
      <div className="receipt-header">
        <div className="brand-logo">
          <div className="logo-icon">ES</div>
        </div>
        <div className="brand-info">
          <h1>EasySale Tracking</h1>
          <p className="address">Ndongo Quarter 3</p>
          <p className="contact">Phone: 671683311</p>
        </div>
      </div>

      <div className="receipt-divider"></div>

      {/* Transaction Summary */}
      <div className="receipt-summary">
        <div className="summary-item">
          <span className="label">Transaction ID</span>
          <span className="value">#TRS-{sale.id.slice(-6)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Date & Time</span>
          <span className="value">{formatDate(sale.soldAt)}</span>
        </div>
        <div className="summary-item">
          <span className="label">Status</span>
          <span className="value status-paid">
            <CheckCircle size={12} /> PAID
          </span>
        </div>
      </div>

      <div className="receipt-divider"></div>

      {/* Item Table */}
      <div className="receipt-items">
        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Price</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="item-name">{sale.productName}</span>
              </td>
              <td style={{ textAlign: 'center' }}>{sale.quantity}</td>
              <td style={{ textAlign: 'right' }}>{(sale.unitPrice || (sale.total / sale.quantity)).toLocaleString()}</td>
              <td style={{ textAlign: 'right', fontWeight: '700' }}>{sale.total.toLocaleString()} FCFA</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="receipt-total-section">
        <div className="total-row">
          <span>Subtotal</span>
          <span>{sale.total.toLocaleString()} FCFA</span>
        </div>
        <div className="total-row main-total">
          <span>Amount Paid</span>
          <span>{sale.total.toLocaleString()} FCFA</span>
        </div>
      </div>

      {/* Signature Section */}
      <div className="signature-section">
        <div className="signature-box">
          {sale.merchantSignature ? (
            <img src={sale.merchantSignature} alt="Merchant Signature" className="captured-signature" style={{ height: '80px', width: 'auto', borderBottom: '1px solid #ddd' }} />
          ) : (
            <div className="signature-line" style={{ height: '80px', borderBottom: '1px dashed #ccc' }}></div>
          )}
          <div style={{ textAlign: 'center' }}>
            <p className="signature-label-text" style={{ marginBottom: '0.2rem' }}>Authorized Merchant</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-blue)' }}>{sale.merchantName || 'N/A'}</p>
          </div>
        </div>

        <div className="signature-box">
          {sale.customerSignature ? (
            <img src={sale.customerSignature} alt="Customer Signature" className="captured-signature" style={{ height: '80px', width: 'auto', borderBottom: '1px solid #ddd' }} />
          ) : (
            <div className="signature-line" style={{ height: '80px', borderBottom: '1px dashed #ccc' }}></div>
          )}
          <div style={{ textAlign: 'center' }}>
            <p className="signature-label-text" style={{ marginBottom: '0.2rem' }}>Customer Signature</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-blue)' }}>{sale.customerName || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="receipt-footer" style={{ borderTop: '2px solid #f0f0f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <QrCode size={14} /> Digital Verification
          </p>
          <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.2rem' }}>Scan to download original receipt</p>
        </div>
        <div style={{ background: '#fff', padding: '0.4rem', borderRadius: '8px', border: '1px solid #eee' }}>
          <QRCodeSVG
            value={`https://inventorysystemapp1.netlify.app/?receipt=${sale.id}`}
            size={56}
            level="M"
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem', color: '#999', fontSize: '0.65rem' }}>
        <p>Thank you for shopping at EasySale!</p>
        <p>Ndongo Quarter 3 — 671683311</p>
      </div>
    </div>
  );
};

export default Receipt;
