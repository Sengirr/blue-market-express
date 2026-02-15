import React from 'react'
import { Users, Phone, Mail, MapPin, Plus, Edit2, Trash2 } from 'lucide-react'

export function SuppliersView({ suppliers, onAddSupplier, onEditSupplier, onDeleteSupplier }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={onAddSupplier} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    Nuevo Proveedor
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {suppliers.length === 0 ? (
                    <div className="card" style={{ gridColumn: 'span 3', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No hay proveedores registrados.
                    </div>
                ) : (
                    suppliers.map(s => (
                        <div key={s.id} className="card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => onEditSupplier(s)}
                                    style={{ padding: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
                                            onDeleteSupplier(s.id)
                                        }
                                    }}
                                    style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', paddingRight: '4rem' }}>
                                <div style={{ padding: '0.75rem', background: 'var(--primary-light)', borderRadius: '12px' }}>
                                    <Users size={24} color="var(--primary)" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{s.name}</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{s.contact_name || 'Sin contacto'}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {s.phone && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        <Phone size={14} /> {s.phone}
                                    </div>
                                )}
                                {s.email && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        <Mail size={14} /> {s.email}
                                    </div>
                                )}
                                {s.address && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        <MapPin size={14} /> {s.address}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
