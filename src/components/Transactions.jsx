import React from 'react'

export function TransactionsView({ transactions }) {
    return (
        <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Fecha</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Descripción</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Categoría</th>
                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Monto</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No hay transacciones registradas.
                            </td>
                        </tr>
                    ) : (
                        transactions.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{new Date(t.date).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{t.description || '-'}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span className={`badge badge-${t.type}`}>
                                        {t.categories?.name || 'Varios'}
                                    </span>
                                </td>
                                <td style={{
                                    padding: '1rem',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: t.type === 'income' ? 'var(--success)' : 'var(--danger)'
                                }}>
                                    {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString()}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
