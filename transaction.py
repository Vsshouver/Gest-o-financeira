from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from src.models.user import db
from src.models.transaction import Transaction, Category
from datetime import datetime
from sqlalchemy import func, extract

transaction_bp = Blueprint('transaction', __name__)

# Rotas para Transações
@transaction_bp.route('/transactions', methods=['GET'])
@cross_origin()
def get_transactions():
    transactions = Transaction.query.order_by(Transaction.date.desc()).all()
    return jsonify([transaction.to_dict() for transaction in transactions])

@transaction_bp.route('/transactions', methods=['POST'])
@cross_origin()
def create_transaction():
    data = request.json
    
    # Converter string de data para objeto date
    date_obj = datetime.strptime(data['date'], '%Y-%m-%d').date()
    
    transaction = Transaction(
        type=data['type'],
        amount=float(data['amount']),
        description=data['description'],
        category=data['category'],
        date=date_obj
    )
    
    db.session.add(transaction)
    db.session.commit()
    return jsonify(transaction.to_dict()), 201

@transaction_bp.route('/transactions/<int:transaction_id>', methods=['GET'])
@cross_origin()
def get_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    return jsonify(transaction.to_dict())

@transaction_bp.route('/transactions/<int:transaction_id>', methods=['PUT'])
@cross_origin()
def update_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    data = request.json
    
    transaction.type = data.get('type', transaction.type)
    transaction.amount = float(data.get('amount', transaction.amount))
    transaction.description = data.get('description', transaction.description)
    transaction.category = data.get('category', transaction.category)
    
    if 'date' in data:
        transaction.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    
    db.session.commit()
    return jsonify(transaction.to_dict())

@transaction_bp.route('/transactions/<int:transaction_id>', methods=['DELETE'])
@cross_origin()
def delete_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)
    db.session.delete(transaction)
    db.session.commit()
    return '', 204

# Rotas para Relatórios e Análises
@transaction_bp.route('/dashboard/summary', methods=['GET'])
@cross_origin()
def get_dashboard_summary():
    # Calcular totais
    receitas = db.session.query(func.sum(Transaction.amount)).filter(Transaction.type == 'receita').scalar() or 0
    despesas = db.session.query(func.sum(Transaction.amount)).filter(Transaction.type == 'despesa').scalar() or 0
    saldo = receitas - despesas
    
    # Gastos por categoria
    gastos_categoria = db.session.query(
        Transaction.category,
        func.sum(Transaction.amount).label('total')
    ).filter(Transaction.type == 'despesa').group_by(Transaction.category).all()
    
    categoria_data = [{'name': cat, 'value': float(total)} for cat, total in gastos_categoria]
    
    # Dados mensais (últimos 2 meses para exemplo)
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    receitas_mes_atual = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.type == 'receita',
        extract('month', Transaction.date) == current_month,
        extract('year', Transaction.date) == current_year
    ).scalar() or 0
    
    despesas_mes_atual = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.type == 'despesa',
        extract('month', Transaction.date) == current_month,
        extract('year', Transaction.date) == current_year
    ).scalar() or 0
    
    # Mês anterior
    prev_month = current_month - 1 if current_month > 1 else 12
    prev_year = current_year if current_month > 1 else current_year - 1
    
    receitas_mes_anterior = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.type == 'receita',
        extract('month', Transaction.date) == prev_month,
        extract('year', Transaction.date) == prev_year
    ).scalar() or 0
    
    despesas_mes_anterior = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.type == 'despesa',
        extract('month', Transaction.date) == prev_month,
        extract('year', Transaction.date) == prev_year
    ).scalar() or 0
    
    monthly_data = [
        {
            'month': 'Mês Anterior',
            'receitas': float(receitas_mes_anterior),
            'despesas': float(despesas_mes_anterior)
        },
        {
            'month': 'Mês Atual',
            'receitas': float(receitas_mes_atual),
            'despesas': float(despesas_mes_atual)
        }
    ]
    
    return jsonify({
        'totals': {
            'receitas': float(receitas),
            'despesas': float(despesas),
            'saldo': float(saldo)
        },
        'categories': categoria_data,
        'monthly': monthly_data
    })

# Rotas para Categorias
@transaction_bp.route('/categories', methods=['GET'])
@cross_origin()
def get_categories():
    categories = Category.query.all()
    return jsonify([category.to_dict() for category in categories])

@transaction_bp.route('/categories', methods=['POST'])
@cross_origin()
def create_category():
    data = request.json
    category = Category(
        name=data['name'],
        type=data['type'],
        color=data.get('color', '#10B981')
    )
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201

@transaction_bp.route('/categories/seed', methods=['POST'])
@cross_origin()
def seed_categories():
    """Criar categorias padrão"""
    default_categories = [
        # Categorias de Receita
        {'name': 'Trabalho', 'type': 'receita', 'color': '#10B981'},
        {'name': 'Investimentos', 'type': 'receita', 'color': '#3B82F6'},
        {'name': 'Vendas', 'type': 'receita', 'color': '#8B5CF6'},
        {'name': 'Outros', 'type': 'receita', 'color': '#6B7280'},
        
        # Categorias de Despesa
        {'name': 'Moradia', 'type': 'despesa', 'color': '#EF4444'},
        {'name': 'Alimentação', 'type': 'despesa', 'color': '#F59E0B'},
        {'name': 'Transporte', 'type': 'despesa', 'color': '#06B6D4'},
        {'name': 'Saúde', 'type': 'despesa', 'color': '#EC4899'},
        {'name': 'Educação', 'type': 'despesa', 'color': '#8B5CF6'},
        {'name': 'Lazer', 'type': 'despesa', 'color': '#10B981'},
        {'name': 'Vestuário', 'type': 'despesa', 'color': '#F97316'},
        {'name': 'Outros', 'type': 'despesa', 'color': '#6B7280'},
    ]
    
    for cat_data in default_categories:
        # Verificar se a categoria já existe
        existing = Category.query.filter_by(name=cat_data['name'], type=cat_data['type']).first()
        if not existing:
            category = Category(**cat_data)
            db.session.add(category)
    
    db.session.commit()
    return jsonify({'message': 'Categorias padrão criadas com sucesso'}), 201

