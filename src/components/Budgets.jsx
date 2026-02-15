import React from 'react'
import { Target, Flag, AlertCircle, Plus, Edit2, Trash2 } from 'lucide-react'

export function BudgetsView({ budgets, transactions, onAddBudget, onEditBudget, onDeleteBudget }) {

    const calculateCurrent = (budget) => {
        const relevantTrans = transactions.filter(t => {
            const transDate = new Date(t.date)
            const isSameMonth = transDate.getMonth() + 1 === budget.month
            const isSameYear = transDate.getFullYear() === budget.year
            const isSameType = (budget.type === 'sales_goal' && t.type === 'income') ||
                (budget.type === 'expense_limit' && t.type === 'expense')
            const isSameCategory = !budget.category_id || t.category_id === budget.category_id

            return isSameMonth && isSameYear && isSameType && isSameCategory
        })

        return relevantTrans.reduce((sum, t) => sum + Number(t.amount), 0)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={onAddBudget} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    Nuevo Objetivo/Límite
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {budgets.length === 0 ? (
                    <div className="card" style={{ gridColumn: 'span 3', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No hay objetivos configurados.
                    </div>
                ) : (
                    budgets.map(b => (
                        <TargetCard
                            key={b.id}
                            title={`${b.type === 'sales_goal' ? 'Meta Ventas' : 'Límite Gastos'} - ${b.month}/${b.year}`}
                            current={calculateCurrent(b)}
                            target={Number(b.amount)}
                            isExpense={b.type === 'expense_limit'}
                            onEdit={() => onEditBudget(b)}
                            onDelete={() => {
                                if (window.confirm('¿Estás seguro de eliminar esta meta?')) {
                                    onDeleteBudget(b.id)
                                }
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

function TargetCard({ title, current, target, isExpense, onEdit, onDelete }) {
    const percentage = Math.min((current / target) * 100, 100)
    const isOver = isExpense && current > target
    const isReached = !isExpense && current >= target

    return (
        <div className="card glass-card" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={onEdit}
                    style={{ padding: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    <Edit2 size={14} />
                </button>
                <button
                    onClick={onDelete}
                    style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingRight: '3.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>{title}</h3>
                {isExpense ? <AlertCircle color="var(--warning)" size={18} /> : <Flag color="var(--success)" size={18} />}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${current.toLocaleString()}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>objetivo: ${target.toLocaleString()}</div>
            </div>

            <div style={{ height: '8px', background: 'var(--background)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <div
                    style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: isOver ? 'var(--danger)' : isReached ? 'var(--success)' : 'var(--primary)',
                        transition: 'width 0.5s ease'
                    }}
                />
            </div>

            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: isOver ? 'var(--danger)' : isReached ? 'var(--success)' : 'var(--text)' }}>
                {percentage.toFixed(1)}% completado
            </div>
        </div>
    )
}
