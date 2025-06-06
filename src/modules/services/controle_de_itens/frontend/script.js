/**
 * Configuração da URL base da API
 * Em produção, usa o caminho relativo para que funcione em qualquer domínio
 */
const API_URL = '/api';

/**
 * Variável global para controlar o ID do item em edição
 * null quando estiver criando um novo item
 */
let editingItemId = null;

/**
 * Instância global do modal do Bootstrap
 * Usada para controlar a abertura/fechamento do modal
 */
let modalInstance = null;

/**
 * Carrega a lista de itens do servidor
 * @returns {Promise<Array>} Lista de itens ou array vazio em caso de erro
 */
async function loadItems() {
    try {
        const response = await fetch(`${API_URL}/itens`);
        if (!response.ok) throw new Error('Erro ao carregar itens');
        const items = await response.json();
        displayItems(items);
        return items;
    } catch (error) {
        showAlert('Erro ao carregar itens: ' + error.message, 'danger');
        return [];
    }
}

/**
 * Exibe os itens na tabela
 * @param {Array} items - Lista de itens a serem exibidos
 */
function displayItems(items) {
    const tbody = document.getElementById('itemList');
    tbody.innerHTML = '';

    // Exibe mensagem quando não há itens
    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Nenhum item cadastrado</td>
            </tr>
        `;
        return;
    }

    // Cria as linhas da tabela para cada item
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.descricao || '-'}</td>
            <td><span class="status-badge status-${item.status}">${formatStatus(item.status)}</span></td>
            <td>${item.quantidade}</td>
            <td>${item.usuario || '-'}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="editItem(${item.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Formata o status do item para exibição
 * @param {string} status - Status do item
 * @returns {string} Status formatado em português
 */
function formatStatus(status) {
    const statusMap = {
        'disponivel': 'Disponível',
        'em_uso': 'Em Uso',
        'manutencao': 'Manutenção',
        'descartado': 'Descartado'
    };
    return statusMap[status] || status;
}

/**
 * Exibe um alerta temporário na tela
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo do alerta (success, danger, warning, info)
 */
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const container = document.querySelector('.container');
    const existingAlert = container.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    container.insertBefore(alertDiv, document.querySelector('.row'));
    setTimeout(() => alertDiv.remove(), 3000);
}

/**
 * Limpa o formulário e reseta o estado de edição
 */
function clearForm() {
    document.getElementById('itemForm').reset();
    editingItemId = null;
    document.getElementById('nome').focus();
}

/**
 * Fecha o modal do Bootstrap
 */
function closeModal() {
    if (modalInstance) {
        modalInstance.hide();
    }
}

/**
 * Carrega um item para edição
 * @param {number} id - ID do item a ser editado
 */
async function editItem(id) {
    try {
        const response = await fetch(`${API_URL}/itens/${id}`);
        if (!response.ok) throw new Error('Erro ao carregar item');

        const item = await response.json();
        editingItemId = id;

        // Preenche o formulário com os dados do item
        document.getElementById('nome').value = item.nome;
        document.getElementById('descricao').value = item.descricao || '';
        document.getElementById('status').value = item.status;
        document.getElementById('quantidade').value = item.quantidade;
        document.getElementById('usuario').value = item.usuario || '';
        document.getElementById('observacao').value = item.observacao || '';

        // Abre o modal
        modalInstance = new bootstrap.Modal(document.getElementById('itemModal'));
        modalInstance.show();
    } catch (error) {
        showAlert('Erro ao carregar item para edição: ' + error.message, 'danger');
    }
}

/**
 * Remove um item do sistema
 * @param {number} id - ID do item a ser removido
 */
async function deleteItem(id) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
        // Desabilita o botão para evitar cliques duplos
        const deleteButton = document.querySelector(`button[onclick="deleteItem(${id})"]`);
        if (deleteButton) {
            deleteButton.disabled = true;
        }

        const response = await fetch(`${API_URL}/itens/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao excluir item');
        }

        // Processa a resposta e atualiza a interface
        const result = await response.json();
        await loadItems();
        showAlert(result.message || 'Item excluído com sucesso');
    } catch (error) {
        showAlert('Erro ao excluir item: ' + error.message, 'danger');
        // Reabilita o botão em caso de erro
        const deleteButton = document.querySelector(`button[onclick="deleteItem(${id})"]`);
        if (deleteButton) {
            deleteButton.disabled = false;
        }
    }
}

/**
 * Valida os dados do formulário
 * @param {Object} formData - Dados do formulário
 * @returns {boolean} true se válido, false caso contrário
 */
function validateForm(formData) {
    if (!formData.nome.trim()) {
        showAlert('O nome do item é obrigatório', 'danger');
        document.getElementById('nome').focus();
        return false;
    }
    if (formData.quantidade < 0) {
        showAlert('A quantidade não pode ser negativa', 'danger');
        document.getElementById('quantidade').focus();
        return false;
    }
    return true;
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Carrega a lista inicial de itens
    loadItems();

    // Inicializa o modal do Bootstrap
    modalInstance = new bootstrap.Modal(document.getElementById('itemModal'));

    // Configura o evento de salvar
    document.getElementById('saveItem').addEventListener('click', async () => {
        const formData = {
            nome: document.getElementById('nome').value.trim(),
            descricao: document.getElementById('descricao').value.trim(),
            status: document.getElementById('status').value,
            quantidade: parseInt(document.getElementById('quantidade').value) || 0,
            usuario: document.getElementById('usuario').value.trim(),
            observacao: document.getElementById('observacao').value.trim()
        };

        if (!validateForm(formData)) return;

        try {
            const method = editingItemId ? 'PUT' : 'POST';
            const url = editingItemId ? `${API_URL}/itens/${editingItemId}` : `${API_URL}/itens`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao salvar item');
            }

            closeModal();
            await loadItems();
            showAlert(`Item ${editingItemId ? 'atualizado' : 'cadastrado'} com sucesso`);
            clearForm();
        } catch (error) {
            showAlert(`Erro ao ${editingItemId ? 'atualizar' : 'cadastrar'} item: ${error.message}`, 'danger');
        }
    });

    // Limpa o formulário quando o modal for fechado
    document.getElementById('itemModal').addEventListener('hidden.bs.modal', clearForm);

    // Previne o envio do formulário ao pressionar Enter
    document.getElementById('itemForm').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('saveItem').click();
    });

    // Foca no campo nome quando o modal abrir
    document.getElementById('itemModal').addEventListener('shown.bs.modal', () => {
        document.getElementById('nome').focus();
    });
});