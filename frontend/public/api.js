// rota
const API_BASE_URL = 'http://localhost:3000';

// funcao base de requisições
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        credentials: 'include', // incluir cookies de sessão
        method: 'GET', // método padrão
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
        showLoading();
        const response = await fetch(url, finalOptions);
        
        // chega se a resposta é ok
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            hideLoading();
            //if a resposta não for JSON, trata como erro
            if (!response.ok) {
                throw new Error(`Erro de conexão: ${response.status} - ${response.statusText}`);
            }
            throw new Error('Erro ao processar resposta do servidor');
        }

        if (!response.ok) {
            hideLoading();
            // extrato detalhado do erro
            let errorMessage = 'Erro desconhecido';
            
            if (data.error) {
                errorMessage = data.error;
            } else if (data.message) {
                errorMessage = data.message;
            } else if (data.details && Array.isArray(data.details)) {
                // aqui o zod usa o details para erros de validação
                errorMessage = data.details.map(detail => detail.message).join(', ');
            } else if (response.status === 401) {
                errorMessage = 'Não autorizado - faça login novamente';
            } else if (response.status === 403) {
                errorMessage = 'Acesso negado - permissão insuficiente';
            } else if (response.status === 404) {
                errorMessage = 'Recurso não encontrado';
            } else if (response.status === 500) {
                errorMessage = 'Erro interno do servidor';
            } else {
                errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
            }
            
            throw new Error(errorMessage);
        }

        hideLoading();
        return data;
    } catch (error) {
        hideLoading();
        
        // diferençe tipos de erros
        let errorMessage = error.message;
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            // rede ou CORS
            errorMessage = 'Erro de conexão: Verifique se o servidor está rodando na porta 3000 e se não há problemas de CORS';
        } else if (error.message.includes('CORS')) {
            errorMessage = 'Erro de CORS: Configuração de cross-origin não permitida';
        } else if (error.message.includes('NetworkError')) {
            errorMessage = 'Erro de rede: Não foi possível conectar ao servidor';
        }
        
        showError(errorMessage);
        throw error;
    }
}

// auths
const authAPI = {
    async register(email, password, role) {
        return await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, role })
        });
    },

    async login(email, password) {
        return await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    async logout() {
        return await apiCall('/auth/logout', {
            method: 'POST'
        });
    }
};

// deps
const departamentosAPI = {
    async getAll() {
        return await apiCall('/departamentos');
    },

    async getById(id) {
        return await apiCall(`/departamentos/${id}`);
    },

    async create(nome, descricao) {
        return await apiCall('/departamentos', {
            method: 'POST',
            body: JSON.stringify({ nome, descricao })
        });
    },

    async update(id, nome, descricao) {
        return await apiCall(`/departamentos/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ nome, descricao })
        });
    },

    async delete(id) {
        return await apiCall(`/departamentos/${id}`, {
            method: 'DELETE'
        });
    }
};

// users
const usuariosAPI = {
    async getAll() {
        return await apiCall('/usuarios');
    },

    async getById(id) {
        return await apiCall(`/usuarios/${id}`);
    },

    async create(email, password, role) {
        return await apiCall('/usuarios', {
            method: 'POST',
            body: JSON.stringify({ email, password, role })
        });
    },

    async update(id, email, role) {
        return await apiCall(`/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ email, role })
        });
    },

    async delete(id) {
        return await apiCall(`/usuarios/${id}`, {
            method: 'DELETE'
        });
    }
};

// funcionarios
const funcionariosAPI = {
    async getAll() {
        return await apiCall('/funcionarios');
    },

    async getById(id) {
        return await apiCall(`/funcionarios/${id}`);
    },

    async create(nome, cargo, departamentoId, usuarioId, foto) {
        return await apiCall('/funcionarios', {
            method: 'POST',
            body: JSON.stringify({ nome, cargo, departamentoId, usuarioId, foto })
        });
    },

    async update(id, nome, cargo, departamentoId, foto) {
        return await apiCall(`/funcionarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ nome, cargo, departamentoId, foto })
        });
    },

    async delete(id) {
        return await apiCall(`/funcionarios/${id}`, {
            method: 'DELETE'
        });
    }
};

// relatorios
const relatoriosAPI = {
    async getAll() {
        return await apiCall('/relatorios');
    },

    async getById(id) {
        return await apiCall(`/relatorios/${id}`);
    },

    async create(data, horasTrabalhadas) {
        return await apiCall('/relatorios', {
            method: 'POST',
            body: JSON.stringify({ data, horasTrabalhadas })
        });
    },

    async update(id, data, horasTrabalhadas) {
        return await apiCall(`/relatorios/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ data, horasTrabalhadas })
        });
    },

    async delete(id) {
        return await apiCall(`/relatorios/${id}`, {
            method: 'DELETE'
        });
    },

    async generatePDF(mes) {
        const url = `${API_BASE_URL}/relatorios/pdf?mes=${mes}`;
        
        try {
            showLoading();
            const response = await fetch(url, {
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao gerar PDF');
            }

            // Download the PDF
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `relatorio-${mes}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);

            hideLoading();
            showSuccess('PDF gerado e baixado com sucesso!');
        } catch (error) {
            hideLoading();
            showError(error.message);
        }
    }
};
