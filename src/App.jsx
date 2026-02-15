import React, { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Receipt,
  Plus,
  Wallet,
  Loader2,
  Package,
  Users,
  Target,
  Download,
  Sun,
  Moon,
  Search,
  Menu,
  X
} from 'lucide-react'
import { supabase } from './lib/supabase'
import { DashboardView } from './components/Dashboard'
import { TransactionsView } from './components/Transactions'
import { InventoryView } from './components/Inventory'
import { SuppliersView } from './components/Suppliers'
import { BudgetsView } from './components/Budgets'
import { ProductModal } from './components/ProductModal'
import { SupplierModal } from './components/SupplierModal'
import { BudgetModal } from './components/BudgetModal'
import { TransactionForm } from './components/TransactionForm'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showForm, setShowForm] = useState(false)
  const [productModal, setProductModal] = useState({ show: false, initialData: null })
  const [supplierModal, setSupplierModal] = useState({ show: false, initialData: null })
  const [budgetModal, setBudgetModal] = useState({ show: false, initialData: null })
  const [loading, setLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Data State
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [budgets, setBudgets] = useState([])

  // Stats State
  const [stats, setStats] = useState({ profit: 0, expenses: 0, income: 0 })
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
  }, [isDarkMode])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: catData } = await supabase.from('blue_market.categories').select('*').order('name')
      const { data: transData } = await supabase
        .from('blue_market.transactions')
        .select(`*, categories: category_id(*)`)
        .order('date', { ascending: false })
      const { data: prodData } = await supabase
        .from('blue_market.products')
        .select(`*, categories: category_id(*), suppliers: supplier_id(*)`)
        .order('name')
      const { data: suppData } = await supabase.from('blue_market.suppliers').select('*').order('name')
      const { data: budgetData } = await supabase.from('blue_market.targets').select('*').order('year', { ascending: false }).order('month', { ascending: false })

      setCategories(catData || [])
      setTransactions(transData || [])
      setProducts(prodData || [])
      setSuppliers(suppData || [])
      setBudgets(budgetData || [])

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

  const handleSaveProduct = async (formData) => {
    const isEditing = !!formData.id
    if (isEditing) {
      await supabase.from('blue_market.products').update(formData).eq('id', formData.id)
    } else {
      await supabase.from('blue_market.products').insert([formData])
    }
    setProductModal({ show: false, initialData: null })
    fetchData()
  }

  const handleDeleteProduct = async (id) => {
    await supabase.from('blue_market.products').delete().eq('id', id)
    fetchData()
  }

  const handleSaveSupplier = async (formData) => {
    const isEditing = !!formData.id
    if (isEditing) {
      await supabase.from('blue_market.suppliers').update(formData).eq('id', formData.id)
    } else {
      await supabase.from('blue_market.suppliers').insert([formData])
    }
    setSupplierModal({ show: false, initialData: null })
    fetchData()
  }

  const handleDeleteSupplier = async (id) => {
    await supabase.from('blue_market.suppliers').delete().eq('id', id)
    fetchData()
  }

  const handleSaveBudget = async (formData) => {
    const isEditing = !!formData.id
    if (isEditing) {
      await supabase.from('blue_market.targets').update(formData).eq('id', formData.id)
    } else {
      await supabase.from('blue_market.targets').insert([formData])
    }
    setBudgetModal({ show: false, initialData: null })
    fetchData()
  }

  const handleDeleteBudget = async (id) => {
    await supabase.from('blue_market.targets').delete().eq('id', id)
    fetchData()
  }

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(item => Object.values(item).map(val => `"${val}"`).join(','))
    const csvContent = [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()
  }

  if (loading && transactions.length === 0) {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    )
  }

  const filteredTransactions = transactions.filter(t =>
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSuppliers = suppliers.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView stats={stats} chartData={chartData} products={products} budgets={budgets} transactions={transactions} />
      case 'transactions': return <TransactionsView transactions={filteredTransactions} />
      case 'inventory': return (
        <InventoryView
          products={filteredProducts}
          categories={categories.filter(c => c.type === 'expense')}
          suppliers={suppliers}
          onAddProduct={() => setProductModal({ show: true, initialData: null })}
          onEditProduct={(p) => setProductModal({ show: true, initialData: p })}
          onDeleteProduct={handleDeleteProduct}
        />
      )
      case 'suppliers': return (
        <SuppliersView
          suppliers={filteredSuppliers}
          onAddSupplier={() => setSupplierModal({ show: true, initialData: null })}
          onEditSupplier={(s) => setSupplierModal({ show: true, initialData: s })}
          onDeleteSupplier={handleDeleteSupplier}
        />
      )
      case 'budgets': return (
        <BudgetsView
          budgets={budgets}
          transactions={transactions}
          onAddBudget={() => setBudgetModal({ show: true, initialData: null })}
          onEditBudget={(b) => setBudgetModal({ show: true, initialData: b })}
          onDeleteBudget={handleDeleteBudget}
        />
      )
      default: return <DashboardView stats={stats} chartData={chartData} products={products} budgets={budgets} transactions={transactions} />
    }
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Panel de Control'
      case 'transactions': return 'Historial de Transacciones'
      case 'inventory': return 'Gestión de Inventario'
      case 'suppliers': return 'Proveedores'
      case 'budgets': return 'Presupuestos y Metas'
      default: return ''
    }
  }

  return (
    <div className="app-container" style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="sidebar-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
        style={{
          width: '280px',
          borderRight: '1px solid var(--border)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          position: 'sticky',
          top: 0,
          height: '100vh',
          backgroundColor: 'var(--surface)',
          zIndex: 50,
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
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
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Blue Market ERP</h1>
          </div>
          <button
            className="mobile-only"
            onClick={() => setIsSidebarOpen(false)}
            style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-muted)' }}
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Contabilidad"
            active={activeTab === 'dashboard'}
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
          />
          <NavItem
            icon={<Receipt size={20} />}
            label="Transacciones"
            active={activeTab === 'transactions'}
            onClick={() => { setActiveTab('transactions'); setIsSidebarOpen(false); }}
          />
          <div style={{ margin: '1rem 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, paddingLeft: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Operaciones
          </div>
          <NavItem
            icon={<Package size={20} />}
            label="Inventario"
            active={activeTab === 'inventory'}
            onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Proveedores"
            active={activeTab === 'suppliers'}
            onClick={() => { setActiveTab('suppliers'); setIsSidebarOpen(false); }}
          />
          <NavItem
            icon={<Target size={20} />}
            label="Presupuestos"
            active={activeTab === 'budgets'}
            onClick={() => { setActiveTab('budgets'); setIsSidebarOpen(false); }}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }} className="main-content">
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="mobile-only"
              onClick={() => setIsSidebarOpen(true)}
              style={{ padding: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 'var(--radius)' }}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>{getPageTitle()}</h2>
              <p style={{ color: 'var(--text-muted)' }} className="desktop-only">Blue Market Supermarket Management System</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {activeTab !== 'dashboard' && activeTab !== 'budgets' && (
              <div style={{ position: 'relative' }} className="search-container">
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', width: '250px' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{ padding: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 'var(--radius)' }}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {(activeTab === 'transactions' || activeTab === 'inventory' || activeTab === 'suppliers' || activeTab === 'budgets') && (
                <button
                  onClick={() => {
                    const exportData = activeTab === 'transactions' ? filteredTransactions : activeTab === 'inventory' ? filteredProducts : activeTab === 'suppliers' ? filteredSuppliers : budgets
                    exportToCSV(exportData, activeTab)
                  }}
                  className="desktop-only"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  <Download size={20} />
                  Exportar CSV
                </button>
              )}

              <button
                onClick={() => {
                  if (activeTab === 'inventory') setProductModal({ show: true, initialData: null })
                  else if (activeTab === 'suppliers') setSupplierModal({ show: true, initialData: null })
                  else if (activeTab === 'budgets') setBudgetModal({ show: true, initialData: null })
                  else setShowForm(true)
                }}
                className="primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
              >
                <Plus size={20} />
                <span className="desktop-only">Acción Rápida</span>
              </button>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveTransaction}
          categories={categories}
        />
      )}

      {productModal.show && (
        <ProductModal
          onClose={() => setProductModal({ show: false, initialData: null })}
          onSave={handleSaveProduct}
          categories={categories.filter(c => c.type === 'expense')}
          suppliers={suppliers}
          initialData={productModal.initialData}
        />
      )}

      {supplierModal.show && (
        <SupplierModal
          onClose={() => setSupplierModal({ show: false, initialData: null })}
          onSave={handleSaveSupplier}
          initialData={supplierModal.initialData}
        />
      )}

      {budgetModal.show && (
        <BudgetModal
          onClose={() => setBudgetModal({ show: false, initialData: null })}
          onSave={handleSaveBudget}
          categories={categories}
          initialData={budgetModal.initialData}
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
        transition: 'all 0.2s ease',
        marginBottom: '0.25rem'
      }}>
      {icon}
      <span style={{ fontWeight: 500 }}>{label}</span>
    </div>
  )
}


export default App
