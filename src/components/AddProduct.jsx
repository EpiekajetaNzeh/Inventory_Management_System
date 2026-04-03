import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { PlusCircle } from 'lucide-react';

const AddProduct = () => {
  const { addProduct } = useInventory();
  const [formData, setFormData] = useState({ name: '', price: '', quantity: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.quantity) return;

    addProduct(formData);
    setFormData({ name: '', price: '', quantity: '' });
    setMessage('Product added to inventory successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <PlusCircle size={32} color="var(--secondary-green)" />
        <h1>Add Product</h1>
      </div>

      <div className="card">
        {message && (
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#D1FAE5',
            color: '#065F46',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Premium Desk Chair"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="responsive-form-grid">
            <div>
              <label htmlFor="price">Price (FCFA)</label>
              <input
                id="price"
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <PlusCircle size={20} /> Add Product to System
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
