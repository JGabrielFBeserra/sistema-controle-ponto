// Global state
let currentUser = null;
let isLoggedIn = false;

// inicializa o dom e apis
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setDefaultPDFMonth();
});

// functions de UI
function showLoading() {
    document.getElementById('loadingMsg').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingMsg').style.display = 'none';
}

function showError(message) {
    const errorEl = document.getElementById('errorMsg');
    errorEl.textContent = `❌ ${message}`;
    errorEl.style.display = 'block';
    setTimeout(() => errorEl.style.display = 'none', 7000); // Mais tempo para ler mensagens longas
    
    // Auto logout em caso de token expirado ou inválido
    if (message.includes('Token') || message.includes('login') || message.includes('Não autorizado')) {
        setTimeout(() => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            showLogin();
        }, 2000);
    }
}

function showSuccess(message) {
    const successEl = document.getElementById('successMsg');
    successEl.textContent = `✅ ${message}`;
    successEl.style.display = 'block';
    setTimeout(() => successEl.style.display = 'none', 3000);
}

function clearMessages() {
    document.getElementById('errorMsg').style.display = 'none';
    document.getElementById('successMsg').style.display = 'none';
}

// Auth functions
function checkAuth() {
    // check simples se o usuário está logado
    const loginSection = document.getElementById('loginSection');
    const userSection = document.getElementById('userSection');
    
    // para agora mas apenas para de fins de login
    loginSection.style.display = 'flex';
    userSection.style.display = 'none';
    isLoggedIn = false;
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showError('Preencha email e senha');
        return;
    }

    try {
        await authAPI.login(email, password);
        currentUser = { email };
        isLoggedIn = true;
        
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('userSection').style.display = 'flex';
        document.getElementById('userName').textContent = email;
        
        showSuccess('Login realizado com sucesso!');
        loadAllData();
    } catch (error) {
        showError('Erro no login: ' + error.message);
    }
}

async function logout() {
    try {
        await authAPI.logout();
        currentUser = null;
        isLoggedIn = false;
        
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('userSection').style.display = 'none';
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        
        showSuccess('Logout realizado com sucesso!');
        clearAllLists();
    } catch (error) {
        showError('Erro no logout: ' + error.message);
    }
}

function showRegister() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeRegister() {
    document.getElementById('registerModal').style.display = 'none';
}

async function register(event) {
    event.preventDefault();
    
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    try {
        await authAPI.register(email, password, role);
        showSuccess('Usuário registrado com sucesso!');
        closeRegister();
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
    } catch (error) {
        showError('Erro no registro: ' + error.message);
    }
}

// chat gpt V 

// Tab navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Load data for the selected tab
    if (isLoggedIn) {
        switch(tabName) {
            case 'departamentos':
                loadDepartamentos();
                break;
            case 'usuarios':
                loadUsuarios();
                break;
            case 'funcionarios':
                loadFuncionarios();
                loadDepartamentosForSelect();
                loadUsuariosForSelect();
                break;
            case 'relatorios':
                loadRelatorios();
                break;
        }
    }
}

// carregar todos os dados ao iniciar
async function loadAllData() {
    await loadDepartamentos();
}

function clearAllLists() {
    document.getElementById('departamentosList').innerHTML = '';
    document.getElementById('usuariosList').innerHTML = '';
    document.getElementById('funcionariosList').innerHTML = '';
    document.getElementById('relatoriosList').innerHTML = '';
}

// funcoes do dep
async function loadDepartamentos() {
    try {
        const departamentos = await departamentosAPI.getAll();
        displayDepartamentos(departamentos);
    } catch (error) {
        showError('Erro ao carregar departamentos: ' + error.message);
    }
}

// Exibe a lista de departamentos
function displayDepartamentos(departamentos) {
    const container = document.getElementById('departamentosList');
    
    if (departamentos.length === 0) {
        container.innerHTML = '<p>Nenhum departamento encontrado.</p>';
        return;
    }

    container.innerHTML = departamentos.map(dept => `
        <div class="item-card">
            <h3>🏢 ${dept.nome}</h3>
            <p><strong>Descrição:</strong> ${dept.descricao || 'Sem descrição'}</p>
            <p><strong>ID:</strong> ${dept.id}</p>
            <div class="actions">
                <button class="btn-edit" onclick="editDepartamento(${dept.id}, '${dept.nome}', '${dept.descricao || ''}')">✏️ Editar</button>
                <button class="btn-danger" onclick="deleteDepartamento(${dept.id})">🗑️ Excluir</button>
            </div>
        </div>
    `).join('');
}

// exibe o formulário de adicionar departamento
function showAddDepartamento() {
    document.getElementById('addDepartamento').style.display = 'block';
    document.getElementById('editDepartamento').style.display = 'none';
}

// cancela o formulário de adicionar ou editar departamento
function cancelAdd(formId) {
    document.getElementById(formId).style.display = 'none';
    // Clear form
    document.querySelector(`#${formId} form`).reset();
}

function cancelEdit(formId) {
    document.getElementById(formId).style.display = 'none';
    // Clear form
    document.querySelector(`#${formId} form`).reset();
}

// Adiciona um novo departamento
async function addDepartamento(event) {
    event.preventDefault();
    
    const nome = document.getElementById('deptNome').value;
    const descricao = document.getElementById('deptDescricao').value;

    try {
        await departamentosAPI.create(nome, descricao);
        showSuccess('Departamento criado com sucesso!');
        cancelAdd('addDepartamento');
        loadDepartamentos();
    } catch (error) {
        showError('Erro ao criar departamento: ' + error.message);
    }
}

// Edita um departamento existente
function editDepartamento(id, nome, descricao) {
    document.getElementById('addDepartamento').style.display = 'none';
    document.getElementById('editDepartamento').style.display = 'block';
    
    document.getElementById('editDeptId').value = id;
    document.getElementById('editDeptNome').value = nome;
    document.getElementById('editDeptDescricao').value = descricao;
}

// Atualiza um departamento existente
async function updateDepartamento(event) {
    event.preventDefault();
    
    const id = document.getElementById('editDeptId').value;
    const nome = document.getElementById('editDeptNome').value;
    const descricao = document.getElementById('editDeptDescricao').value;

    try {
        await departamentosAPI.update(id, nome, descricao);
        showSuccess('Departamento atualizado com sucesso!');
        cancelEdit('editDepartamento');
        loadDepartamentos();
    } catch (error) {
        showError('Erro ao atualizar departamento: ' + error.message);
    }
}

async function deleteDepartamento(id) {
    if (!confirm('Tem certeza que deseja excluir este departamento?')) {
        return;
    }

    try {
        await departamentosAPI.delete(id);
        showSuccess('Departamento excluído com sucesso!');
        loadDepartamentos();
    } catch (error) {
        showError('Erro ao excluir departamento: ' + error.message);
    }
}

// funcoes de usuarios
async function loadUsuarios() {
    try {
        const usuarios = await usuariosAPI.getAll();
        displayUsuarios(usuarios);
    } catch (error) {
        showError('Erro ao carregar usuários: ' + error.message);
    }
}

function displayUsuarios(usuarios) {
    const container = document.getElementById('usuariosList');
    
    if (usuarios.length === 0) {
        container.innerHTML = '<p>Nenhum usuário encontrado.</p>';
        return;
    }

    container.innerHTML = usuarios.map(user => `
        <div class="item-card">
            <h3>👤 ${user.email}</h3>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>ID:</strong> ${user.id}</p>
            <div class="actions">
                <button class="btn-edit" onclick="editUsuario(${user.id}, '${user.email}', '${user.role}')">✏️ Editar</button>
                <button class="btn-danger" onclick="deleteUsuario(${user.id})">🗑️ Excluir</button>
            </div>
        </div>
    `).join('');
}

function showAddUsuario() {
    document.getElementById('addUsuario').style.display = 'block';
    document.getElementById('editUsuario').style.display = 'none';
}

async function addUsuario(event) {
    event.preventDefault();
    
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;

    try {
        await usuariosAPI.create(email, password, role);
        showSuccess('Usuário criado com sucesso!');
        cancelAdd('addUsuario');
        loadUsuarios();
    } catch (error) {
        showError('Erro ao criar usuário: ' + error.message);
    }
}

function editUsuario(id, email, role) {
    document.getElementById('addUsuario').style.display = 'none';
    document.getElementById('editUsuario').style.display = 'block';
    
    document.getElementById('editUserId').value = id;
    document.getElementById('editUserEmail').value = email;
    document.getElementById('editUserRole').value = role;
}

async function updateUsuario(event) {
    event.preventDefault();
    
    const id = document.getElementById('editUserId').value;
    const email = document.getElementById('editUserEmail').value;
    const role = document.getElementById('editUserRole').value;

    try {
        await usuariosAPI.update(id, email, role);
        showSuccess('Usuário atualizado com sucesso!');
        cancelEdit('editUsuario');
        loadUsuarios();
    } catch (error) {
        showError('Erro ao atualizar usuário: ' + error.message);
    }
}

async function deleteUsuario(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
        return;
    }

    try {
        await usuariosAPI.delete(id);
        showSuccess('Usuário excluído com sucesso!');
        loadUsuarios();
    } catch (error) {
        showError('Erro ao excluir usuário: ' + error.message);
    }
}

// Funcionários functions
async function loadFuncionarios() {
    try {
        const funcionarios = await funcionariosAPI.getAll();
        displayFuncionarios(funcionarios);
    } catch (error) {
        showError('Erro ao carregar funcionários: ' + error.message);
    }
}

function displayFuncionarios(funcionarios) {
    const container = document.getElementById('funcionariosList');
    
    if (funcionarios.length === 0) {
        container.innerHTML = '<p>Nenhum funcionário encontrado.</p>';
        return;
    }

    container.innerHTML = funcionarios.map(func => `
        <div class="item-card">
            <h3>👨‍💼 ${func.nome}</h3>
            <p><strong>Cargo:</strong> ${func.cargo}</p>
            <p><strong>Departamento:</strong> ${func.departamento?.nome || 'N/A'}</p>
            <p><strong>Email:</strong> ${func.usuario?.email || 'N/A'}</p>
            ${func.foto ? `<p><strong>Foto:</strong> <a href="${func.foto}" target="_blank">Ver foto</a></p>` : ''}
            <p><strong>ID do Usuário:</strong> ${func.id}</p>
            <div class="actions">
                <button class="btn-edit" onclick="editFuncionario(${func.id}, '${func.nome}', '${func.cargo}', ${func.departamentoId}, '${func.foto || ''}')">✏️ Editar</button>
                <button class="btn-danger" onclick="deleteFuncionario(${func.id})">🗑️ Excluir</button>
            </div>
        </div>
    `).join('');
}

async function loadDepartamentosForSelect() {
    try {
        const departamentos = await departamentosAPI.getAll();
        const selects = ['funcDepartamento', 'editFuncDepartamento'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Selecione um Departamento</option>';
            departamentos.forEach(dept => {
                select.innerHTML += `<option value="${dept.id}">${dept.nome}</option>`;
            });
        });
    } catch (error) {
        console.error('Erro ao carregar departamentos para select:', error);
    }
}

async function loadUsuariosForSelect() {
    try {
        const usuarios = await usuariosAPI.getAll();
        const select = document.getElementById('funcUsuario');
        select.innerHTML = '<option value="">Selecione um Usuário</option>';
        usuarios.forEach(user => {
            select.innerHTML += `<option value="${user.id}">${user.email}</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar usuários para select:', error);
    }
}

function showAddFuncionario() {
    document.getElementById('addFuncionario').style.display = 'block';
    document.getElementById('editFuncionario').style.display = 'none';
    loadDepartamentosForSelect();
    loadUsuariosForSelect();
}

async function addFuncionario(event) {
    event.preventDefault();
    
    const nome = document.getElementById('funcNome').value;
    const cargo = document.getElementById('funcCargo').value;
    const departamentoId = parseInt(document.getElementById('funcDepartamento').value);
    const usuarioId = parseInt(document.getElementById('funcUsuario').value);
    const foto = document.getElementById('funcFoto').value;

    try {
        await funcionariosAPI.create(nome, cargo, departamentoId, usuarioId, foto);
        showSuccess('Funcionário criado com sucesso!');
        cancelAdd('addFuncionario');
        loadFuncionarios();
    } catch (error) {
        showError('Erro ao criar funcionário: ' + error.message);
    }
}

function editFuncionario(id, nome, cargo, departamentoId, foto) {
    document.getElementById('addFuncionario').style.display = 'none';
    document.getElementById('editFuncionario').style.display = 'block';
    
    loadDepartamentosForSelect().then(() => {
        document.getElementById('editFuncId').value = id;
        document.getElementById('editFuncNome').value = nome;
        document.getElementById('editFuncCargo').value = cargo;
        document.getElementById('editFuncDepartamento').value = departamentoId;
        document.getElementById('editFuncFoto').value = foto;
    });
}

async function updateFuncionario(event) {
    event.preventDefault();
    
    const id = document.getElementById('editFuncId').value;
    const nome = document.getElementById('editFuncNome').value;
    const cargo = document.getElementById('editFuncCargo').value;
    const departamentoId = parseInt(document.getElementById('editFuncDepartamento').value);
    const foto = document.getElementById('editFuncFoto').value;

    try {
        await funcionariosAPI.update(id, nome, cargo, departamentoId, foto);
        showSuccess('Funcionário atualizado com sucesso!');
        cancelEdit('editFuncionario');
        loadFuncionarios();
    } catch (error) {
        showError('Erro ao atualizar funcionário: ' + error.message);
    }
}

async function deleteFuncionario(id) {
    if (!confirm('Tem certeza que deseja excluir este funcionário?')) {
        return;
    }

    try {
        await funcionariosAPI.delete(id);
        showSuccess('Funcionário excluído com sucesso!');
        loadFuncionarios();
    } catch (error) {
        showError('Erro ao excluir funcionário: ' + error.message);
    }
}

// Relatórios functions
async function loadRelatorios() {
    try {
        const relatorios = await relatoriosAPI.getAll();
        displayRelatorios(relatorios);
    } catch (error) {
        showError('Erro ao carregar relatórios: ' + error.message);
    }
}

function displayRelatorios(relatorios) {
    const container = document.getElementById('relatoriosList');
    
    if (relatorios.length === 0) {
        container.innerHTML = '<p>Nenhum relatório encontrado.</p>';
        return;
    }

    container.innerHTML = relatorios.map(rel => {
        const data = new Date(rel.data).toLocaleString('pt-BR');
        return `
            <div class="item-card">
                <h3>📊 Relatório de ${data.split(',')[0]}</h3>
                <p><strong>Data/Hora:</strong> ${data}</p>
                <p><strong>Horas Trabalhadas:</strong> ${rel.horasTrabalhadas}h</p>
                <p><strong>ID:</strong> ${rel.id}</p>
                <div class="actions">
                    <button class="btn-edit" onclick="editRelatorio(${rel.id}, '${rel.data}', ${rel.horasTrabalhadas})">✏️ Editar</button>
                    <button class="btn-danger" onclick="deleteRelatorio(${rel.id})">🗑️ Excluir</button>
                </div>
            </div>
        `;
    }).join('');
}

function showAddRelatorio() {
    document.getElementById('addRelatorio').style.display = 'block';
    document.getElementById('editRelatorio').style.display = 'none';
    
    // Set default datetime to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('relData').value = now.toISOString().slice(0, 16);
}

async function addRelatorio(event) {
    event.preventDefault();
    
    const data = document.getElementById('relData').value;
    const horasTrabalhadas = parseFloat(document.getElementById('relHoras').value);

    try {
        await relatoriosAPI.create(data, horasTrabalhadas);
        showSuccess('Relatório criado com sucesso!');
        cancelAdd('addRelatorio');
        loadRelatorios();
    } catch (error) {
        showError('Erro ao criar relatório: ' + error.message);
    }
}

function editRelatorio(id, data, horasTrabalhadas) {
    document.getElementById('addRelatorio').style.display = 'none';
    document.getElementById('editRelatorio').style.display = 'block';
    
    // Convert ISO date to datetime-local format
    const date = new Date(data);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    
    document.getElementById('editRelId').value = id;
    document.getElementById('editRelData').value = date.toISOString().slice(0, 16);
    document.getElementById('editRelHoras').value = horasTrabalhadas;
}

async function updateRelatorio(event) {
    event.preventDefault();
    
    const id = document.getElementById('editRelId').value;
    const data = document.getElementById('editRelData').value;
    const horasTrabalhadas = parseFloat(document.getElementById('editRelHoras').value);

    try {
        await relatoriosAPI.update(id, data, horasTrabalhadas);
        showSuccess('Relatório atualizado com sucesso!');
        cancelEdit('editRelatorio');
        loadRelatorios();
    } catch (error) {
        showError('Erro ao atualizar relatório: ' + error.message);
    }
}

async function deleteRelatorio(id) {
    if (!confirm('Tem certeza que deseja excluir este relatório?')) {
        return;
    }

    try {
        await relatoriosAPI.delete(id);
        showSuccess('Relatório excluído com sucesso!');
        loadRelatorios();
    } catch (error) {
        showError('Erro ao excluir relatório: ' + error.message);
    }
}

// PDF functions
function setDefaultPDFMonth() {
    const now = new Date();
    const month = now.toISOString().slice(0, 7); // YYYY-MM format
    document.getElementById('pdfMonth').value = month;
}

function generatePDF() {
    showAddRelatorio(); // Show the form to add reports first
}

async function downloadPDF() {
    const mes = document.getElementById('pdfMonth').value;
    
    if (!mes) {
        showError('Selecione um mês para gerar o PDF');
        return;
    }

    try {
        await relatoriosAPI.generatePDF(mes);
    } catch (error) {
        showError('Erro ao gerar PDF: ' + error.message);
    }
}

// click evento para fechar o modal de registro
window.onclick = function(event) {
    const modal = document.getElementById('registerModal');
    if (event.target === modal) {
        closeRegister();
    }
}
