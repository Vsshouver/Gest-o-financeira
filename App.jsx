import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Home, 
  CreditCard, 
  Target, 
  BarChart3,
  Settings,
  Wallet,
  PiggyBank
} from 'lucide-react'
import './App.css'

const API_BASE_URL = 'https://5001-i759d97jwrldt5r6eyudr-941dbb97.manusvm.computer/api'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [dashboardData, setDashboardData] = useState({
    totals: { receitas: 0, despesas: 0, saldo: 0 },
    categories: [],
    monthly: []
  })
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [newTransaction, setNewTransaction] = useState({
    type: 'despesa',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Carregar categorias
      const categoriesResponse = await fetch(`${API_BASE_URL}/categories`)
      const categoriesData = await categoriesResponse.json()
      setCategories(categoriesData)
      
      // Carregar transações
      const transactionsResponse = await fetch(`${API_BASE_URL}/transactions`)
      const transactionsData = await transactionsResponse.json()
      setTransactions(transactionsData)
      
      // Carregar dados do dashboard
      const dashboardResponse = await fetch(`${API_BASE_URL}/dashboard/summary`)
      const dashboardInfo = await dashboardResponse.json()
      setDashboardData(dashboardInfo)
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTransaction = async () => {
    if (newTransaction.amount && newTransaction.description && newTransaction.category) {
      try {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTransaction)
        })
        
        if (response.ok) {
          // Recarregar dados após adicionar transação
          await loadInitialData()
          
          // Limpar formulário
          setNewTransaction({
            type: 'despesa',
            amount: '',
            description: '',
            category: '',
            date: new Date().toISOString().split('T')[0]
          })
          
          // Fechar dialog
          setDialogOpen(false)
        }
      } catch (error) {
        console.error('Erro ao adicionar transação:', error)
      }
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transacoes', label: 'Transações', icon: CreditCard },
    { id: 'metas', label: 'Metas', icon: Target },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ]

  const getCategoriesByType = (type) => {
    return categories.filter(cat => cat.type === type)
  }

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Wallet className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-gray-900">FinanceFlow</h1>
          </div>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === item.id ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Nova Transação</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Transação</DialogTitle>
                      <DialogDescription>
                        Registre uma nova receita ou despesa
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="type">Tipo</Label>
                        <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({...newTransaction, type: value, category: ''})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="receita">Receita</SelectItem>
                            <SelectItem value="despesa">Despesa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="amount">Valor</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0,00"
                          value={newTransaction.amount}
                          onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                          id="description"
                          placeholder="Ex: Salário, Aluguel, Mercado..."
                          value={newTransaction.description}
                          onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoria</Label>
                        <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {getCategoriesByType(newTransaction.type).map((cat) => (
                              <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="date">Data</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newTransaction.date}
                          onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                        />
                      </div>
                      <Button onClick={addTransaction} className="w-full">
                        Adicionar Transação
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${dashboardData.totals.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(dashboardData.totals.saldo)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardData.totals.saldo >= 0 ? '+' : ''}{dashboardData.totals.receitas > 0 ? ((dashboardData.totals.saldo / dashboardData.totals.receitas) * 100).toFixed(1) : 0}% do total de receitas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(dashboardData.totals.receitas)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total de receitas registradas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(dashboardData.totals.despesas)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total de despesas registradas
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gastos por Categoria</CardTitle>
                    <CardDescription>Distribuição das suas despesas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.categories.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={dashboardData.categories}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {dashboardData.categories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-gray-500">
                        Nenhuma despesa registrada
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Receitas vs Despesas</CardTitle>
                    <CardDescription>Comparação mensal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dashboardData.monthly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
                        <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Transações Recentes */}
              <Card>
                <CardHeader>
                  <CardTitle>Transações Recentes</CardTitle>
                  <CardDescription>Suas últimas movimentações financeiras</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${transaction.type === 'receita' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <div className={`font-bold ${transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'transacoes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Transações</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Nova Transação</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Transação</DialogTitle>
                      <DialogDescription>
                        Registre uma nova receita ou despesa
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="type">Tipo</Label>
                        <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({...newTransaction, type: value, category: ''})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="receita">Receita</SelectItem>
                            <SelectItem value="despesa">Despesa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="amount">Valor</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0,00"
                          value={newTransaction.amount}
                          onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                          id="description"
                          placeholder="Ex: Salário, Aluguel, Mercado..."
                          value={newTransaction.description}
                          onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoria</Label>
                        <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {getCategoriesByType(newTransaction.type).map((cat) => (
                              <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="date">Data</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newTransaction.date}
                          onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                        />
                      </div>
                      <Button onClick={addTransaction} className="w-full">
                        Adicionar Transação
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Todas as Transações</CardTitle>
                  <CardDescription>Histórico completo de movimentações</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className={`w-4 h-4 rounded-full ${transaction.type === 'receita' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div>
                            <p className="font-medium text-lg">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <div className={`font-bold text-lg ${transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'metas' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Metas Financeiras</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PiggyBank className="h-5 w-5" />
                    <span>Em Desenvolvimento</span>
                  </CardTitle>
                  <CardDescription>
                    Esta funcionalidade estará disponível em breve. Aqui você poderá definir e acompanhar suas metas de economia e investimento.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}

          {activeTab === 'relatorios' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Relatórios</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Em Desenvolvimento</span>
                  </CardTitle>
                  <CardDescription>
                    Esta funcionalidade estará disponível em breve. Aqui você terá acesso a relatórios detalhados e análises avançadas.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}

          {activeTab === 'configuracoes' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Configurações</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Em Desenvolvimento</span>
                  </CardTitle>
                  <CardDescription>
                    Esta funcionalidade estará disponível em breve. Aqui você poderá personalizar categorias, notificações e outras preferências.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

