import React, { useState } from 'react'
import { X } from 'lucide-react'

export function BudgetModal({ onClose, onSave, categories, initialData }) {
    const [formData, setFormData] = useState(initialData || {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        type: 'sales_goal',
        category_id: '',
        amount: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({
            ...formData,
            amount: parseFloat(formData.amount),
            month: parseInt(formData.month),
            year: parseInt(formData.year)
        })
    }

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card glass-card" style={{ width: '400px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{initialData ? 'Editar Meta' : 'Nuevo Objetivo/Límite'}</h3>
                    <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <button
                            type="button"
                            className={formData.type === 'expense_limit' ? 'primary' : ''}
                            style={{
                                backgroundColor: formData.type === 'expense_limit' ? 'var(--danger)' : 'var(--surface)',
                                color: formData.type === 'expense_limit' ? 'white' : 'var(--text-muted)'
                            }}
                            onClick={() => setFormData({ ...formData, type: 'expense_limit' })}
                        >
                            Límite Gasto
                        </button>
                        <button
                            type="button"
                            className={formData.type === 'sales_goal' ? 'primary' : ''}
                            style={{
                                backgroundColor: formData.type === 'sales_goal' ? 'var(--success)' : 'var(--surface)',
                                color: formData.type === 'sales_goal' ? 'white' : 'var(--text-muted)'
                            }}
                            onClick={() => setFormData({ ...formData, type: 'sales_goal' })}
                        >
                            Meta Ventas
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Mes</label>
                            <select
                                style={{ width: '100%', padding: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'white' }}
                                value={formData.month}
                                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                            >
                                {months.map((m, i) => (
                                    <option key={i + 1} value={i + 1}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Año</label>
                            <input
                                type="number"
                                style={{ width: '100%', padding: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'white' }}
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Categoría (Opcional)</label>
                        <select
                            style={{ width: '100%', padding: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'white' }}
                            value={formData.category_id || ''}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value || null })}
                        >
                            <option value="">Todas las categorías</option>
                            {categories.filter(c => (formData.type === 'sales_goal' ? c.type === 'income' : c.type === 'expense')).map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Monto Objetivo</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            style={{ width: '100%', padding: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'white' }}
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0,00 €"
                        />
                    </div>

                    <button type="submit" className="primary" style={{ marginTop: '1rem', padding: '1rem' }}>
                        {initialData ? 'Actualizar Meta' : 'Crear Meta'}
                    </button>
                </form>
            </div>
        </div>
    )
}
