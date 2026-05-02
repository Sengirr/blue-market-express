import React from 'react'
import { Plus, TrendingUp, Calendar, Edit2, Trash2, Clock, User, AlertTriangle } from 'lucide-react'

export function DailySalesView({ sales, onAddSale, onEditSale, onDeleteSale, employees }) {
    const totalSales = sales.reduce((sum, s) => sum + Number(s.amount), 0)

    const renderBreakdown = (s) => {
        const total = Number(s.amount) || 0;
        const cash = Number(s.cash_amount) || 0;
        const card = Number(s.card_amount) || 0;

        if (total === 0 || (cash === 0 && card === 0)) {
            return <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sin desglose</span>
        }

        const cashPct = Math.round((cash / total) * 100);
        const cardPct = Math.round((card / total) * 100);

        return (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', gap: '0.5rem' }}>
                <span>Efectivo: {cash.toLocaleString()}€ ({cashPct}%)</span>
                <span>|</span>
                <span>Tarjeta: {card.toLocaleString()}€ ({cardPct}%)</span>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Cajas Diarias</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Registro de ingresos por ventas y cuadres</p>
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
                    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{totalSales.toLocaleString()}€</h2>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--surface-hover)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Fecha y Turno</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Empleado</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Monto y Desglose</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Cuadre</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Notas</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No hay registros de caja todavía.
                                </td>
                            </tr>
                        ) : (
                            sales.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                                <Calendar size={14} color="var(--primary)" />
                                                {new Date(s.date).toLocaleDateString()}
                                            </div>
                                            {s.shift && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                                                    <Clock size={12} /> {s.shift}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {s.super_employees?.name ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <User size={14} color="var(--text-muted)" />
                                                {s.super_employees.name}
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--success)' }}>
                                            {Number(s.amount).toLocaleString()}€
                                        </div>
                                        {renderBreakdown(s)}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {Number(s.difference) !== 0 ? (
                                            <div style={{ 
                                                display: 'inline-flex', 
                                                alignItems: 'center', 
                                                gap: '0.25rem', 
                                                padding: '0.25rem 0.5rem', 
                                                borderRadius: '999px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 600,
                                                backgroundColor: Number(s.difference) > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: Number(s.difference) > 0 ? 'var(--success)' : 'var(--danger)'
                                            }}>
                                                <AlertTriangle size={12} />
                                                {Number(s.difference) > 0 ? `Sobró ${s.difference}€` : `Faltó ${Math.abs(s.difference)}€`}
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>OK</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {s.notes || '-'}
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
