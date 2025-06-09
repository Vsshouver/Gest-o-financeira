# Sistema de Gestão Financeira Pessoal

## Funcionalidades Principais

### 1. Dashboard Principal
- **Resumo financeiro**: Saldo atual, receitas do mês, despesas do mês
- **Gráficos visuais**: 
  - Gráfico de pizza para categorias de gastos
  - Gráfico de linha para evolução mensal
  - Gráfico de barras para comparação receitas vs despesas
- **Indicadores**: Percentual de economia, maior gasto do mês, categoria que mais consome
- **Alertas**: Avisos sobre gastos excessivos ou metas não cumpridas

### 2. Gestão de Receitas
- **Cadastro de receitas**: Salário, freelances, investimentos, outras fontes
- **Categorização**: Trabalho, investimentos, vendas, outros
- **Recorrência**: Receitas fixas mensais, pontuais
- **Histórico completo** com filtros por período e categoria

### 3. Gestão de Despesas
- **Cadastro de despesas**: Valor, descrição, categoria, data
- **Categorias predefinidas**: 
  - Moradia (aluguel, condomínio, IPTU)
  - Alimentação (mercado, restaurantes)
  - Transporte (combustível, transporte público)
  - Saúde (plano, medicamentos, consultas)
  - Educação (cursos, livros)
  - Lazer (cinema, viagens, hobbies)
  - Vestuário
  - Outros
- **Despesas recorrentes**: Contas fixas mensais
- **Anexos**: Possibilidade de adicionar notas

### 4. Planejamento e Metas
- **Orçamento mensal**: Definir limites por categoria
- **Metas de economia**: Objetivos de poupança
- **Acompanhamento**: Progresso em relação às metas
- **Projeções**: Estimativas baseadas no histórico

### 5. Relatórios e Análises
- **Relatórios mensais/anuais**
- **Comparativos entre períodos**
- **Análise de tendências**
- **Exportação de dados**

### 6. Configurações
- **Perfil do usuário**
- **Categorias personalizadas**
- **Configurações de notificações**
- **Backup de dados**

## Estrutura de Dados

### Transação
- ID único
- Tipo (receita/despesa)
- Valor
- Descrição
- Categoria
- Data
- Recorrente (sim/não)
- Observações

### Categoria
- ID único
- Nome
- Tipo (receita/despesa)
- Cor (para gráficos)
- Ícone

### Meta
- ID único
- Descrição
- Valor objetivo
- Prazo
- Categoria relacionada
- Status

### Orçamento
- ID único
- Mês/Ano
- Categoria
- Valor limite
- Valor gasto atual

## Design e Interface

### Paleta de Cores
- **Primária**: Verde (#10B981) - representa crescimento financeiro
- **Secundária**: Azul (#3B82F6) - confiança e estabilidade
- **Accent**: Laranja (#F59E0B) - alertas e destaques
- **Neutros**: Cinzas (#6B7280, #F3F4F6) - textos e backgrounds
- **Sucesso**: Verde claro (#34D399)
- **Erro**: Vermelho (#EF4444)

### Tipografia
- **Títulos**: Inter Bold
- **Texto**: Inter Regular
- **Números**: Mono font para valores monetários

### Layout
- **Responsivo**: Mobile-first design
- **Sidebar**: Navegação principal
- **Cards**: Para exibir informações resumidas
- **Modais**: Para formulários de entrada
- **Animações**: Transições suaves entre telas

