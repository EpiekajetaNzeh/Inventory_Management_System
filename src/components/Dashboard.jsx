import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { products, sales, getStats, clearAllData } = useInventory();
  const { totalSalesToday, totalProducts, totalStock } = getStats();

  const handleReset = () => {
    const confirmation = prompt("To confirm system reset, please type 'DELETE ALL':");
    if (confirmation === 'DELETE ALL') {
      clearAllData();
      alert("System has been reset successfully.");
    } else if (confirmation !== null) {
      alert("Incorrect confirmation text. Reset cancelled.");
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString();
  };

  return (
    <div className="fade-in">
      <h1>EasySale Dashboard</h1>
      
      <div className="stat-grid">
        <div className="card">
          <p style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600 }}>Daily Revenue</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary-green)' }}>
            {totalSalesToday.toLocaleString()} FCFA
          </p>
        </div>
        <div className="card">
          <p style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600 }}>Unique Products</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{totalProducts}</p>
        </div>
        <div className="card">
          <p style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: 600 }}>Total Stock</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{totalStock}</p>
        </div>
      </div>

      <div className="card">
        <h2>Inventory Overview</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Date Added</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>No products found. Start by adding one!</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ fontWeight: 500 }}>{Number(p.price).toLocaleString()} FCFA</td>
                    <td style={{ fontWeight: 500 }}>{p.quantity}</td>
                    <td className="timestamp">{formatDate(p.createdAt)}</td>
                    <td>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: p.quantity > 5 ? '#D1FAE5' : '#FEE2E2',
                        color: p.quantity > 5 ? '#065F46' : '#991B1B',
                        textTransform: 'uppercase'
                      }}>
                        {p.quantity > 5 ? 'Stable' : p.quantity === 0 ? 'Out' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ border: '1px solid #FEE2E2', background: '#FFF1F2' }}>
        <h2 style={{ color: '#991B1B' }}>System Security</h2>
        <p style={{ color: '#991B1B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          To prevent unauthorized single-item deletions, you can only perform a complete system reset. This will wipe all products and sales history.
        </p>
        <button onClick={handleReset} className="btn btn-danger">
          <Trash2 size={18} /> Reset All Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
