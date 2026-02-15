import React from 'react'
import { Plus, User, Phone, CreditCard, Calendar, Edit2, Trash2 } from 'lucide-react'

export function EmployeesView({ employees, onAddEmployee, onEditEmployee, onDeleteEmployee }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Gestión de Empleados</h3>
                <button onClick={onAddEmployee} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} />
                    Nuevo Empleado
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {employees.length === 0 ? (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No hay empleados registrados.
                    </div>
                ) : (
                    employees.map(emp => (
                        <div key={emp.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{emp.name}</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Empleado</p>
                                </div>
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => onEditEmployee(emp)} style={{ padding: '0.4rem', background: 'transparent', color: 'var(--text-muted)' }}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => { if (confirm('¿Seguro?')) onDeleteEmployee(emp.id) }} style={{ padding: '0.4rem', background: 'transparent', color: 'var(--danger)' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                                    <Phone size={16} color="var(--text-muted)" />
                                    <span>{emp.phone || 'Sin teléfono'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                                    <CreditCard size={16} color="var(--text-muted)" />
                                    <span style={{ fontFamily: 'monospace' }}>{emp.bank_account || 'Sin cuenta'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                                    <Calendar size={16} color="var(--text-muted)" />
                                    <span>Descanso: <strong>{emp.rest_day || 'No definido'}</strong></span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
