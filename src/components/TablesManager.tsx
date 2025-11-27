import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Download, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useTables } from '../hooks/useTables';

interface TablesManagerProps {
  onBack: () => void;
}

const TablesManager: React.FC<TablesManagerProps> = ({ onBack }) => {
  const { tables, loading, addTable, deleteTable } = useTables();
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleAddTable = async () => {
    try {
      setIsAdding(true);
      await addTable();
    } catch (error) {
      alert('Failed to add table. Please try again.');
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTable = async (id: number) => {
    if (!confirm(`Are you sure you want to delete ${tables.find(t => t.id === id)?.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteTable(id);
    } catch (error) {
      alert('Failed to delete table. Please try again.');
      console.error(error);
    }
  };

  const handleCopyLink = async (qrUrl: string, id: number) => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      alert('Failed to copy link. Please try again.');
    }
  };

  const downloadQRCode = (tableName: string, qrUrl: string, tableId: number) => {
    // Find the QR code SVG element
    const qrContainer = document.getElementById(`qr-${tableId}`);
    if (!qrContainer) {
      alert('QR code not found. Please try again.');
      return;
    }

    const svgElement = qrContainer.querySelector('svg');
    if (!svgElement) {
      alert('QR code SVG not found. Please try again.');
      return;
    }

    // Serialize SVG to string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    
    // Create blob from SVG
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    // Convert SVG to PNG using canvas
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        URL.revokeObjectURL(url);
        return;
      }

      // Fill white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 256, 256);
      
      // Draw the QR code image
      ctx.drawImage(img, 0, 0, 256, 256);
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `${tableName.replace(/\s+/g, '_')}_QR.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
        }
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert('Failed to generate QR code image. Please try again.');
    };
    
    img.src = url;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              <h1 className="text-2xl font-playfair font-semibold text-black">Table Management</h1>
            </div>
            <button
              onClick={handleAddTable}
              disabled={isAdding}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              <span>{isAdding ? 'Adding...' : 'Add Table'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tables...</p>
          </div>
        ) : tables.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No tables found. Add your first table to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
              <div key={table.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{table.name}</h3>
                  <button
                    onClick={() => handleDeleteTable(table.id)}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete table"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex justify-center mb-4 bg-white p-4 rounded-lg border border-gray-200" id={`qr-${table.id}`}>
                  <QRCodeSVG
                    value={table.qr_url}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">QR URL:</span>
                    <p className="text-gray-600 break-all text-xs mt-1">{table.qr_url}</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Table ID:</span>
                    <span className="text-gray-600 ml-2">#{table.id}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadQRCode(table.name, table.qr_url, table.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleCopyLink(table.qr_url, table.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                  >
                    {copiedId === table.id ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TablesManager;

