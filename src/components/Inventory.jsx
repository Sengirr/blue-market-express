import React, { useState } from 'react'
import { Plus, Package, AlertTriangle, Search, Filter, Edit2, Trash2 } from 'lucide-react'

export function InventoryView({ products, categories, suppliers, onAddProduct, onEditProduct, onDeleteProduct }) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'white' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={onAddProduct} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    Añadir Producto
                </button>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Producto</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>SKU/Barras</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Stock</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Precio</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Estado</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No hay productos registrados.
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.description || 'Sin descripción'}</div>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        {p.sku || '-'}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                                        {p.stock} uds.
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                        ${Number(p.price).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {p.stock <= p.min_stock ? (
                                            <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem', width: 'fit-content' }}>
                                                <AlertTriangle size={14} /> Stock Bajo
                                            </span>
                                        ) : (
                                            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', width: 'fit-content' }}>
                                                Disponible
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => onEditProduct(p)}
                                                style={{ padding: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
                                                        onDeleteProduct(p.id)
                                                    }
                                                }}
                                                style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
