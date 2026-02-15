import React, { useState, useEffect } from 'react'
import { LayoutDashboard, Receipt, TrendingUp, TrendingDown, Plus, Wallet, Loader2 } from 'lucide-react'
import { supabase } from './lib/supabase'
import { DashboardView } from './components/Dashboard'
import { TransactionForm } from './components/TransactionForm'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({ profit: 0, expenses: 0, income: 0 })
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: catData, error: catError } = await supabase.from('blue_market.categories').select('*')
      if (catError) throw catError

      const { data: transData, error: transError } = await supabase
        .from('blue_market.transactions')
        .select(`*, categories:category_id (*)`)
        .order('date', { ascending: false })
      if (transError) throw transError

      setCategories(catData || [])
      setTransactions(transData || [])
      calculateStats(transData || [])
      processChartData(transData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data) => {
    const income = data.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
    const expenses = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
    setStats({
      income,
      expenses,
      profit: income - expenses
    })
  }

  const processChartData = (data) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const last6Months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthLabel = months[d.getMonth()]

      const monthTrans = data.filter(t => {
        const transDate = new Date(t.date)
        return transDate.getMonth() === d.getMonth() && transDate.getFullYear() === d.getFullYear()
      })

      const net = monthTrans.reduce((sum, t) => {
        return sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount))
      }, 0)

      last6Months.push({ month: monthLabel, net })
    }
    setChartData(last6Months)
  }

  const handleSaveTransaction = async (formData) => {
    const { error } = await supabase.from('blue_market.transactions').insert([formData])
    if (!error) {
      setShowForm(false)
      fetchData()
    } else {
      alert('Error al guardar: ' + error.message)
    }
  }

  if (loading && transactions.length === 0) {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    )
  }

  return (
    <div className="app-container" style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        borderRight: '1px solid var(--border)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--primary)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wallet size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Blue Market</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <NavItem
            icon={<Receipt size={20} />}
            label="Transacciones"
            active={activeTab === 'transactions'}
            onClick={() => setActiveTab('transactions')}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>
              {activeTab === 'dashboard' ? 'Panel de Control' : 'Historial de Transacciones'}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>Contabilidad interna Blue Market</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
          >
            <Plus size={20} />
            Nueva Entrada
          </button>
        </header>

        {activeTab === 'dashboard' ? (
          <DashboardView stats={stats} chartData={chartData} />
        ) : (
          <TransactionsView transactions={transactions} />
        )}
      </main>

      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveTransaction}
          categories={categories}
        />
      )}
    </div>
  )
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        backgroundColor: active ? 'var(--primary-light)' : 'transparent',
        color: active ? 'var(--primary)' : 'var(--text-muted)',
        transition: 'all 0.2s ease'
      }}>
      {icon}
      <span style={{ fontWeight: 500 }}>{label}</span>
    </div>
  )
}

function TransactionsView({ transactions }) {
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
                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{t.date}</td>
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

export default App
