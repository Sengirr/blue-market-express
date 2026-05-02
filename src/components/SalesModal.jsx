import React, { useState, useEffect } from 'react'
import { X, Euro, CreditCard, Banknote, User, Clock, AlertTriangle } from 'lucide-react'

export function SalesModal({ onClose, onSave, initialData, employees }) {
    const [formData, setFormData] = useState({
        date: initialData?.date || new Date().toISOString().split('T')[0],
        shift: initialData?.shift || 'mañana',
        employee_id: initialData?.employee_id || '',
        cash_amount: initialData?.cash_amount || '',
        card_amount: initialData?.card_amount || '',
        amount: initialData?.amount || '',
        difference: initialData?.difference || '',
        difference_type: (initialData?.difference || 0) < 0 ? 'faltante' : (initialData?.difference || 0) > 0 ? 'sobrante' : 'cuadre',
        notes: initialData?.notes || ''
    })

    // Calcular el monto total automáticamente cuando cambian efectivo o tarjeta
    useEffect(() => {
        // Solo sobrescribir si el usuario ha tocado efectivo o tarjeta, 
        // para no machacar históricos que solo tienen "amount"
        if (formData.cash_amount !== '' || formData.card_amount !== '') {
            const cash = parseFloat(formData.cash_amount) || 0;
            const card = parseFloat(formData.card_amount) || 0;
            setFormData(prev => ({ ...prev, amount: (cash + card).toFixed(2) }))
        }
    }, [formData.cash_amount, formData.card_amount])

    const handleSubmit = (e) => {
        e.preventDefault()

        let diffValue = 0;
        if (formData.difference_type !== 'cuadre') {
            diffValue = Math.abs(parseFloat(formData.difference) || 0);
            if (formData.difference_type === 'faltante') diffValue = -diffValue;
        }

        const payload = {
            date: formData.date,
            shift: formData.shift,
            employee_id: formData.employee_id || null,
            cash_amount: parseFloat(formData.cash_amount) || 0,
            card_amount: parseFloat(formData.card_amount) || 0,
            amount: parseFloat(formData.amount) || 0,
            difference: diffValue,
            notes: formData.notes
        }

        if (initialData?.id) {
            payload.id = initialData.id
        }

        onSave(payload)
    }

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card glass-card" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--surface)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{initialData ? 'Editar Caja' : 'Nueva Caja Diaria'}</h3>
                    <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    
                    {/* Fecha y Turno */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Fecha</label>
                            <input
                                required
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Clock size={14} /> Turno
                            </label>
                            <select
                                required
                                value={formData.shift}
                                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                            >
                                <option value="mañana">Mañana</option>
                                <option value="tarde">Tarde</option>
                            </select>
                        </div>
                    </div>

                    {/* Empleado */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <User size={14} /> Empleado que cierra
                        </label>
                        <select
                            required
                            value={formData.employee_id}
                            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                        >
                            <option value="">-- Seleccionar empleado --</option>
                            {employees && employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Desglose de Ventas */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Banknote size={14} /> Efectivo
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Euro size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.cash_amount}
                                    onChange={(e) => setFormData({ ...formData, cash_amount: e.target.value })}
                                    style={{ padding: '0.75rem 0.75rem 0.75rem 2.25rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', width: '100%' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <CreditCard size={14} /> Tarjeta
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Euro size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.card_amount}
                                    onChange={(e) => setFormData({ ...formData, card_amount: e.target.value })}
                                    style={{ padding: '0.75rem 0.75rem 0.75rem 2.25rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Importe Total</label>
                        <div style={{ position: 'relative' }}>
                            <Euro size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                            <input
                                required
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                style={{ padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--primary)', background: 'var(--primary-light)', color: 'var(--primary)', width: '100%', fontWeight: 'bold' }}
                            />
                        </div>
                    </div>

                    {/* Cuadre */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <AlertTriangle size={14} /> Cuadre de Caja
                        </label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <select
                                value={formData.difference_type}
                                onChange={(e) => setFormData({ ...formData, difference_type: e.target.value })}
                                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                            >
                                <option value="cuadre">Cuadró perfecto</option>
                                <option value="faltante">Faltó dinero (-)</option>
                                <option value="sobrante">Sobró dinero (+)</option>
                            </select>

                            {formData.difference_type !== 'cuadre' && (
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <Euro size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        placeholder="Cantidad..."
                                        value={Math.abs(formData.difference) || ''}
                                        onChange={(e) => setFormData({ ...formData, difference: e.target.value })}
                                        style={{ padding: '0.75rem 0.75rem 0.75rem 2.25rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', width: '100%' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Notas / Observaciones</label>
                        <textarea
                            rows="2"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Ej. Venta tarde lluviosa..."
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', resize: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, backgroundColor: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                            Cancelar
                        </button>
                        <button type="submit" className="primary" style={{ flex: 1 }}>
                            Guardar Caja
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
