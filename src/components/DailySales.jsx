import React from 'react'
import { Plus, TrendingUp, Calendar, Edit2, Trash2, DollarSign } from 'lucide-react'

export function DailySalesView({ sales, onAddSale, onEditSale, onDeleteSale }) {
    const totalSales = sales.reduce((sum, s) => sum + Number(s.amount), 0)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Cajas Diarias</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Registro de ingresos por ventas</p>
                </div>
                <button onClick={onAddSale} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} />
                    Nueva Caja
                </button>
            </div>

            {/* Summary Card */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--primary)', color: 'white' }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={32} />
                </div>
                <div>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Ventas (Periodo)</p>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>${totalSales.toLocaleString()}</h2>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--surface-hover)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Fecha</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Notas</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Monto</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No hay registros de caja todavía.
                                </td>
                            </tr>
                        ) : (
                            sales.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={16} color="var(--primary)" />
                                            <span style={{ fontWeight: 500 }}>{new Date(s.date).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        {s.notes || '-'}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--success)' }}>
                                        ${Number(s.amount).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button onClick={() => onEditSale(s)} style={{ padding: '0.4rem', background: 'transparent', color: 'var(--text-muted)' }}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => { if (confirm('¿Seguro?')) onDeleteSale(s.id) }} style={{ padding: '0.4rem', background: 'transparent', color: 'var(--danger)' }}>
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
