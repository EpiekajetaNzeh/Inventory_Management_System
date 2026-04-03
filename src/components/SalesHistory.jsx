import React, { useState, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { History, Calendar, Eye, Download, X } from 'lucide-react';
import Receipt from './Receipt';
import { toPng } from 'html-to-image';

const SalesHistory = () => {
  const { sales } = useInventory();
  const [selectedSale, setSelectedSale] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef(null);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDownload = async () => {
    if (!selectedSale) return;
    setIsDownloading(true);

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const node = document.getElementById(`receipt-${selectedSale.id}`);
      if (!node) {
        setIsDownloading(false);
        return;
      }

      toPng(node, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: {
          borderRadius: '0',
          boxShadow: 'none',
          margin: '0',
          padding: '2rem'
        }
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `receipt-${selectedSale.id.slice(-6)}.png`;
          link.href = dataUrl;
          link.click();
          setIsDownloading(false);
        })
        .catch((err) => {
          console.error('oops, something went wrong!', err);
          setIsDownloading(false);
        });
    }, 100);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <History size={32} color="var(--primary-blue)" />
        <h1>Sales History</h1>
      </div>

      <div className="card">
        <h2>Full Transaction Log</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th><Calendar size={14} style={{ marginRight: '4px' }} /> Date & Time</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Revenue</th>
                <th>Stock Left</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                    No sales recorded yet. Your transaction history will appear here.
                  </td>
                </tr>
              ) : (
                [...sales].reverse().map((sale) => (
                  <tr key={sale.id}>
                    <td className="timestamp">{formatDate(sale.soldAt || sale.date)}</td>
                    <td style={{ fontWeight: 600 }}>{sale.productName}</td>
                    <td>{sale.quantity}</td>
                    <td style={{ fontWeight: 700, color: 'var(--secondary-green)' }}>
                      {sale.total.toLocaleString()} FCFA
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--text-light)' }}>
                      {sale.remainingStock !== undefined ? sale.remainingStock : 'N/A'}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        onClick={() => setSelectedSale(sale)}
                      >
                        <Eye size={14} /> View Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedSale && (
        <div className="modal-overlay" onClick={() => setSelectedSale(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Receipt sale={selectedSale} />

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedSale(null)}>
                <X size={18} /> Close
              </button>
              <button
                className="btn btn-primary btn-download"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? 'Generating...' : <><Download size={18} /> Download Image</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
