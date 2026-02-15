import React, { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Receipt,
  Plus,
  Wallet,
  Loader2,
  Users,
  Target,
  Download,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  TrendingUp,
  UserPlus,
  Coins
} from 'lucide-react'
import { supabase } from './lib/supabase'
import { DashboardView } from './components/Dashboard'
import { TransactionsView } from './components/Transactions'
import { SuppliersView } from './components/Suppliers'
import { TransactionForm } from './components/TransactionForm'
import { DailySalesView } from './components/DailySales'
import { SalesModal } from './components/SalesModal'
import { EmployeesView } from './components/Employees'
import { EmployeeModal } from './components/EmployeeModal'
import { TransactionForm } from './components/TransactionForm'
import { DailySalesView } from './components/DailySales'
import { SalesModal } from './components/SalesModal'
import { EmployeesView } from './components/Employees'
import { EmployeeModal } from './components/EmployeeModal'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showForm, setShowForm] = useState(false)
  const [salesModal, setSalesModal] = useState({ show: false, initialData: null })
  const [employeeModal, setEmployeeModal] = useState({ show: false, initialData: null })
  const [supplierModal, setSupplierModal] = useState({ show: false, initialData: null })
  const [loading, setLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Data State
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [dailySales, setDailySales] = useState([])
  const [employees, setEmployees] = useState([])

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
      const { data: catData, error: catError } = await supabase.from('categories').select('*').order('name')
      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .select(`*, categories: category_id(*)`)
        .order('date', { ascending: false })
      const { data: suppData, error: suppError } = await supabase.from('suppliers').select('*').order('name')
      const { data: salesData, error: salesError } = await supabase.from('daily_sales').select('*').order('date', { ascending: false })
      const { data: empData, error: empError } = await supabase.from('employees').select('*').order('name')

      if (catError || transError || suppError || salesError || empError) {
        console.error('Error fetching data:', { catError, transError, suppError, salesError, empError })
        alert('Error al cargar datos de la base de datos.')
      }

      setCategories(catData || [])
      setTransactions(transData || [])
      setSuppliers(suppData || [])
      setDailySales(salesData || [])
      setEmployees(empData || [])

      calculateStats(transData || [], salesData || [])
      processChartData(transData || [], salesData || [])
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('Error inesperado al conectar con Supabase.')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (transData, salesData) => {
    const expenses = transData.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
    const directSales = salesData.reduce((sum, s) => sum + Number(s.amount), 0)
    const otherIncome = transData.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)

    const income = directSales + otherIncome
    setStats({
      income,
      expenses,
      profit: income - expenses
    })
  }

  const processChartData = (transData, salesData) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const last6Months = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthLabel = months[d.getMonth()]

      const monthTrans = transData.filter(t => {
        const transDate = new Date(t.date)
        return transDate.getMonth() === d.getMonth() && transDate.getFullYear() === d.getFullYear()
      })

      const monthSales = salesData.filter(s => {
        const saleDate = new Date(s.date)
        return saleDate.getMonth() === d.getMonth() && saleDate.getFullYear() === d.getFullYear()
      })

      const income = monthSales.reduce((sum, s) => sum + Number(s.amount), 0) +
        monthTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)

      const expenses = monthTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

      last6Months.push({ month: monthLabel, net: income - expenses })
    }
    setChartData(last6Months)
  }

  const handleSaveTransaction = async (formData) => {
    const { error } = await supabase.from('transactions').insert([formData])
    if (!error) {
      setShowForm(false)
      fetchData()
    } else {
      alert('Error al guardar: ' + error.message)
    }
  }

  const handleSaveSale = async (formData) => {
    const isEditing = !!formData.id
    const { error } = isEditing
      ? await supabase.from('daily_sales').update(formData).eq('id', formData.id)
      : await supabase.from('daily_sales').insert([formData])

    if (error) {
      alert('Error saving sale: ' + error.message)
      console.error(error)
      return
    }

    setSalesModal({ show: false, initialData: null })
    fetchData()
  }

  const handleDeleteSale = async (id) => {
    await supabase.from('daily_sales').delete().eq('id', id)
    fetchData()
  }

  const handleSaveEmployee = async (formData) => {
    const isEditing = !!formData.id
    const { error } = isEditing
      ? await supabase.from('employees').update(formData).eq('id', formData.id)
      : await supabase.from('employees').insert([formData])

    if (error) {
      alert('Error saving employee: ' + error.message)
      console.error(error)
      return
    }

    setEmployeeModal({ show: false, initialData: null })
    fetchData()
  }

  const handleDeleteEmployee = async (id) => {
    await supabase.from('employees').delete().eq('id', id)
    fetchData()
  }

  const handleSaveSupplier = async (formData) => {
    const isEditing = !!formData.id
    if (isEditing) {
      await supabase.from('suppliers').update(formData).eq('id', formData.id)
    } else {
      await supabase.from('suppliers').insert([formData])
    }
    setSupplierModal({ show: false, initialData: null })
    fetchData()
  }

  const handleDeleteSupplier = async (id) => {
    await supabase.from('suppliers').delete().eq('id', id)
    fetchData()
  }

  const handleDeleteSupplier = async (id) => {
    await supabase.from('suppliers').delete().eq('id', id)
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
    (t.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (t.categories?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const filteredSuppliers = suppliers.filter(s =>
    (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.contact_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const filteredEmployees = employees.filter(e =>
    (e.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (e.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView stats={stats} chartData={chartData} transactions={transactions} sales={dailySales} />
      case 'sales': return (
        <DailySalesView
          sales={dailySales}
          onAddSale={() => setSalesModal({ show: true, initialData: null })}
          onEditSale={(s) => setSalesModal({ show: true, initialData: s })}
          onDeleteSale={handleDeleteSale}
        />
      )
      case 'transactions': return <TransactionsView transactions={filteredTransactions.filter(t => t.type === 'expense')} />
      case 'employees': return (
        <EmployeesView
          employees={filteredEmployees}
          onAddEmployee={() => setEmployeeModal({ show: true, initialData: null })}
          onEditEmployee={(e) => setEmployeeModal({ show: true, initialData: e })}
          onDeleteEmployee={handleDeleteEmployee}
        />
      )
      default: return <DashboardView stats={stats} chartData={chartData} transactions={transactions} sales={dailySales} />
    }
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Panel de Control'
      case 'sales': return 'Cajas Diarias'
      case 'transactions': return 'Gastos y Compras'
      case 'employees': return 'Gestión de Empleados'
      case 'suppliers': return 'Proveedores'
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
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
          />
          <NavItem
            icon={<TrendingUp size={20} />}
            label="Cajas Diarias"
            active={activeTab === 'sales'}
            onClick={() => { setActiveTab('sales'); setIsSidebarOpen(false); }}
          />
          <NavItem
            icon={<Receipt size={20} />}
            label="Gastos"
            active={activeTab === 'transactions'}
            onClick={() => { setActiveTab('transactions'); setIsSidebarOpen(false); }}
          />
          <div style={{ margin: '1rem 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, paddingLeft: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Personal y Otros
          </div>
          <NavItem
            icon={<UserPlus size={20} />}
            label="Empleados"
            active={activeTab === 'employees'}
            onClick={() => { setActiveTab('employees'); setIsSidebarOpen(false); }}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Proveedores"
            active={activeTab === 'suppliers'}
            onClick={() => { setActiveTab('suppliers'); setIsSidebarOpen(false); }}
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
              <p style={{ color: 'var(--text-muted)' }} className="desktop-only">Sistema de Gestión Blue Market</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {(activeTab === 'transactions' || activeTab === 'suppliers' || activeTab === 'employees') && (
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

              {(activeTab === 'sales' || activeTab === 'transactions' || activeTab === 'employees' || activeTab === 'suppliers' || activeTab === 'budgets') && (
                <button
                  onClick={() => {
                    const exportData = activeTab === 'sales' ? dailySales : activeTab === 'transactions' ? filteredTransactions : activeTab === 'employees' ? filteredEmployees : filteredSuppliers
                    exportToCSV(exportData, activeTab)
                  }}
                  className="desktop-only"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  <Download size={20} />
                  Exportar CSV
                </button>
              )}

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

      {salesModal.show && (
        <SalesModal
          onClose={() => setSalesModal({ show: false, initialData: null })}
          onSave={handleSaveSale}
          initialData={salesModal.initialData}
        />
      )}

      {employeeModal.show && (
        <EmployeeModal
          onClose={() => setEmployeeModal({ show: false, initialData: null })}
          onSave={handleSaveEmployee}
          initialData={employeeModal.initialData}
        />
      )}

      {supplierModal.show && (
        <SupplierModal
          onClose={() => setSupplierModal({ show: false, initialData: null })}
          onSave={handleSaveSupplier}
          initialData={supplierModal.initialData}
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
