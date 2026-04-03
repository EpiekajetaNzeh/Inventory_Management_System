import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Receipt from './Receipt';
import { toPng } from 'html-to-image';
import { Download, AlertCircle, Loader } from 'lucide-react';

const PublicReceiptViewer = () => {
    const [saleData, setSaleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchReceipt = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const receiptId = urlParams.get('receipt');

            if (!receiptId) {
                setError('No receipt ID provided in URL.');
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('receipts')
                    .select('sale_data')
                    .eq('id', receiptId)
                    .single();

                if (error) throw error;

                if (data && data.sale_data) {
                    setSaleData(data.sale_data);
                } else {
                    setError('Receipt not found. It may have been deleted or the ID is incorrect.');
                }
            } catch (err) {
                console.error("Error fetching receipt:", err);
                setError('Failed to load receipt from the server.');
            } finally {
                setLoading(false);
            }
        };

        fetchReceipt();
    }, []);

    const handleDownload = async () => {
        if (!saleData) return;
        setDownloading(true);
        try {
            const element = document.getElementById(`receipt-${saleData.id}`);
            if (element) {
                const dataUrl = await toPng(element, {
                    quality: 1.0,
                    pixelRatio: 2,
                    backgroundColor: '#ffffff'
                });
                const link = document.createElement('a');
                link.download = `Receipt_${saleData.id}.png`;
                link.href = dataUrl;
                link.click();
            }
        } catch (err) {
            console.error("Failed to download receipt:", err);
            alert("Something went wrong while generating the receipt download.");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F9FAFB' }}>
                <Loader size={40} color="var(--primary-blue)" className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '1rem', color: '#666', fontWeight: 500 }}>Locating Digital Receipt...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F9FAFB', padding: '2rem' }}>
                <div style={{ background: '#FEE2E2', padding: '2rem', borderRadius: '16px', textAlign: 'center', maxWidth: '400px', border: '1px solid #FCA5A5' }}>
                    <AlertCircle size={48} color="#DC2626" style={{ margin: '0 auto 1rem' }} />
                    <h2 style={{ color: '#991B1B', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Receipt Not Found</h2>
                    <p style={{ color: '#7F1D1D', fontSize: '0.9rem' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F3F4F6', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, color: 'var(--text-dark)' }}>Verified Receipt</h1>
                <button
                    className="btn btn-primary"
                    onClick={handleDownload}
                    disabled={downloading}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                    <Download size={16} /> {downloading ? 'Preparing...' : 'Download Image'}
                </button>
            </div>

            <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <Receipt sale={saleData} />
            </div>

            <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#9CA3AF' }}>Powered by EasySale Systems</p>
        </div>
    );
};

export default PublicReceiptViewer;
