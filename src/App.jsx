import React, { useState } from 'react'
import { InventoryProvider } from './context/InventoryContext'
import Dashboard from './components/Dashboard'
import AddProduct from './components/AddProduct'
import RecordSale from './components/RecordSale'
import SalesHistory from './components/SalesHistory'
import PublicReceiptViewer from './components/PublicReceiptViewer'
import { LayoutDashboard, PlusCircle, ShoppingCart, History, Trash2, X, Menu } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isPublicReceiptRoute = new URLSearchParams(window.location.search).has('receipt');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />
      case 'add-product': return <AddProduct />
      case 'record-sale': return <RecordSale onNavigate={handleTabChange} />
      case 'sales-history': return <SalesHistory />
      default: return <Dashboard />
    }
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setIsMenuOpen(false)
  }

  if (isPublicReceiptRoute) {
    return <PublicReceiptViewer />
  }

  return (
    <InventoryProvider>
      <header className="mobile-header">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>EasySale</h2>
        <button
          onClick={toggleMenu}
          className="btn"
          style={{ padding: '0.5rem', background: 'var(--bg-color)', color: 'var(--text-dark)', borderRadius: '10px' }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 0.5rem' }}>
          <h2 style={{ color: 'white', marginBottom: '2.5rem', fontSize: '1.75rem', fontWeight: 800 }}>EasySale</h2>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#" className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}>
                <LayoutDashboard size={20} /> Dashboard
              </a>
            </li>
            <li>
              <a href="#" className={activeTab === 'add-product' ? 'active' : ''} onClick={() => handleTabChange('add-product')}>
                <PlusCircle size={20} /> Add Product
              </a>
            </li>
            <li>
              <a href="#" className={activeTab === 'record-sale' ? 'active' : ''} onClick={() => handleTabChange('record-sale')}>
                <ShoppingCart size={20} /> Record Sale
              </a>
            </li>
            <li>
              <a href="#" className={activeTab === 'sales-history' ? 'active' : ''} onClick={() => handleTabChange('sales-history')}>
                <History size={20} /> Sales History
              </a>
            </li>
          </ul>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
            &copy; 2026 EasySale Tracking
          </p>
        </div>
      </div>

      <main className="main-content">
        {renderContent()}
      </main>
    </InventoryProvider>
  )
}

export default App
