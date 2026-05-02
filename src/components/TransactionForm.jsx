import React, { useState } from 'react'
import { X } from 'lucide-react'

export function TransactionForm({ onClose, onSave, categories, suppliers, fixedType }) {
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category_id: '',
        supplier_id: '',
        expense_type: 'variable',
        type: fixedType || 'expense',
        date: new Date().toISOString().split('T')[0]
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({ 
            ...formData, 
            amount: parseFloat(formData.amount),
            supplier_id: formData.type === 'expense' && formData.supplier_id ? formData.supplier_id : null,
            expense_type: formData.type === 'expense' ? formData.expense_type : null
        })
    }

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
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                        {fixedType === 'expense' ? 'Nuevo Gasto' : fixedType === 'income' ? 'Nuevo Ingreso' : 'Nueva Entrada'}
                    </h3>
                    <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {!fixedType && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <button
                                type="button"
                                className={formData.type === 'expense' ? 'primary' : ''}
                                style={{
                                    backgroundColor: formData.type === 'expense' ? 'var(--danger)' : 'var(--surface)',
                                    color: formData.type === 'expense' ? 'white' : 'var(--text-muted)'
                                }}
                                onClick={() => setFormData({ ...formData, type: 'expense' })}
                            >
                                Gasto
                            </button>
                            <button
                                type="button"
                                className={formData.type === 'income' ? 'primary' : ''}
                                style={{
                                    backgroundColor: formData.type === 'income' ? 'var(--success)' : 'var(--surface)',
                                    color: formData.type === 'income' ? 'white' : 'var(--text-muted)'
                                }}
                                onClick={() => setFormData({ ...formData, type: 'income' })}
                            >
                                Ingreso
                            </button>
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Cantidad</label>
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

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Categoría</label>
                        <select
                            required
                            style={{ width: '100%', padding: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'white' }}
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        >
                            <option value="">Seleccionar categoría</option>
                            {categories.filter(c => c.type === formData.type).map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Descripción</label>
                        <input
                            type="text"
                            style={{ width: '100%', padding: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'white' }}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Ej. Compra de suministros"
                        />
                    </div>

                    {formData.type === 'expense' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Tipo de Gasto</label>
                                <select
                                    style={{ width: '100%', padding: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'white' }}
                                    value={formData.expense_type}
                                    onChange={(e) => setFormData({ ...formData, expense_type: e.target.value })}
                                >
                                    <option value="variable">Variable</option>
                                    <option value="fixed">Fijo</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Proveedor (Opcional)</label>
                                <select
                                    style={{ width: '100%', padding: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'white' }}
                                    value={formData.supplier_id}
                                    onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                                >
                                    <option value="">Ninguno</option>
                                    {suppliers && suppliers.map(supp => (
                                        <option key={supp.id} value={supp.id}>{supp.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Fecha</label>
                        <input
                            required
                            type="date"
                            style={{ width: '100%', padding: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'white' }}
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="primary" style={{ marginTop: '1rem', padding: '1rem' }}>
                        Guardar Transacción
                    </button>
                </form>
            </div>
        </div>
    )
}
