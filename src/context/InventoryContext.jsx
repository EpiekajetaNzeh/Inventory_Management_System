import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';


const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('inventory_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('inventory_sales');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('inventory_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('inventory_sales', JSON.stringify(sales));
  }, [sales]);

  const addProduct = (product) => {
    setProducts((prev) => [
      ...prev,
      {
        ...product,
        id: Date.now().toString(),
        quantity: parseInt(product.quantity),
        createdAt: new Date().toISOString()
      }
    ]);
  };

  const recordSale = (saleData, transactionInfo = {}) => {
    const { productId, quantity } = saleData;
    const { merchantSignature, customerSignature, merchantName, customerName } = transactionInfo;
    const qty = parseInt(quantity);

    const product = products.find(p => p.id === productId);
    if (!product) {
      console.error("Product not found:", productId);
      return false;
    }

    if (product.quantity < qty) {
      console.error("Insufficient stock for product:", product.name, "Current:", product.quantity, "Requested:", qty);
      return false;
    }

    const newQuantity = product.quantity - qty;
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? { ...p, quantity: newQuantity }
          : p
      )
    );

    console.log("Recording sale with signatures:", merchantSignature ? "M-Captured" : "M-Null", customerSignature ? "C-Captured" : "C-Null");

    const newSale = {
      id: Date.now().toString(),
      productId,
      productName: product.name,
      quantity: qty,
      unitPrice: product.price,
      total: product.price * qty,
      remainingStock: newQuantity,
      soldAt: new Date().toISOString(),
      merchantSignature,
      customerSignature,
      merchantName,
      customerName
    };
    setSales(prevSales => [...prevSales, newSale]);

    // Cloud Backup Integration
    const uploadReceiptToCloud = async () => {
      try {
        const { error } = await supabase
          .from('receipts')
          .insert([
            { id: newSale.id, sale_data: newSale }
          ]);
        if (error) {
          console.error("Error uploading receipt to Supabase:", error.message);
        } else {
          console.log("Receipt successfully backed up to cloud!");
        }
      } catch (err) {
        console.error("Cloud synchronization failed:", err);
      }
    };

    uploadReceiptToCloud();

    return true;
  };

  const clearAllData = () => {
    setProducts([]);
    setSales([]);
    localStorage.removeItem('inventory_products');
    localStorage.removeItem('inventory_sales');
  };

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const totalSalesToday = sales
      .filter(s => (s.soldAt || s.date || '').startsWith(today))
      .reduce((sum, s) => sum + s.total, 0);

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);

    return { totalSalesToday, totalProducts, totalStock };
  };

  return (
    <InventoryContext.Provider value={{ products, sales, addProduct, recordSale, clearAllData, getStats }}>
      {children}
    </InventoryContext.Provider>
  );
};
