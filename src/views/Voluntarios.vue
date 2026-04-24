<template>
  <div class="app-container">
    <!-- Componente do Menu Lateral -->
    <div class="sidebar-wrapper">
      <MenuLateral />
    </div>
    
    <main class="content-wrapper">
      <header class="header-section">
        <div class="header-content">
          <div class="brand-area">
            <div class="icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div class="titles">
              <h1>Gestão de Voluntários</h1>
              <p>Administre a equipa e os seus contactos</p>
            </div>
          </div>
          
          <div class="action-area">
            <div class="search-container">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Procurar voluntário..." />
            </div>
            <button @click="openAddModal" class="btn-new">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Adicionar Voluntário
            </button>
          </div>
        </div>
      </header>

      <!-- Corpo Principal e Tabela -->
      <div class="scroll-area custom-scroll">
        <div class="table-card">
          <div class="table-responsive">
            <table class="modern-table" v-if="voluntarios.length > 0">
              <thead>
                <tr>
                  <th>Voluntário</th>
                  <th>Especialidade / Categoria</th>
                  <th>Agenda</th>
                  <th>Telefone</th>
                  <th>Observações</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr class="table-row" v-for="voluntario in voluntarios" :key="voluntario.id">
                  <td>
                    <div class="user-info">
                      <div class="avatar">
                        {{ voluntario.nome ? voluntario.nome.charAt(0).toUpperCase() : 'V' }}
                      </div>
                      <div class="details">
                        <span class="name">{{ voluntario.nome }}</span>
                        <span class="subtext">ID: {{ voluntario.id.substring(0, 5).toUpperCase() }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="specialty-box">
                      <span class="main-spec">{{ voluntario.especialidade }}</span>
                      <span class="tag">{{ voluntario.categoria }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="details">
                      <span class="name">{{ voluntario.diaSemana }}</span>
                      <span class="subtext">{{ voluntario.horarioEntrada }} - {{ voluntario.horarioSaida }} ({{ voluntario.tempoConsulta }} min)</span>
                    </div>
                  </td>
                  <td>
                    <div class="details">
                      <span class="name">{{ voluntario.telefone }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="status-wrapper">
                      <div :class="['status-indicator', voluntario.observacoes === 'Inativo' ? 'is-inactive' : 'is-active']"></div>
                      <span class="status-text">{{ voluntario.observacoes }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="btn-group">
                      <button @click="editVoluntario(voluntario)" class="btn-icon btn-edit" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button @click="deleteVoluntario(voluntario.id)" class="btn-icon btn-delete" title="Eliminar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div v-else style="padding: 4rem; text-align: center; color: #94a3b8; font-weight: 600;">
              Nenhum voluntário registado no momento.
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Formulário para Criar/Editar -->
      <transition name="fade">
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-window">
            <div class="modal-header">
              <div class="modal-title">
                <h2>{{ isEditing ? 'Editar Voluntário' : 'Novo Voluntário' }}</h2>
                <p>Preencha os dados do voluntário abaixo</p>
              </div>
              <button @click="closeModal" class="close-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div class="modal-body custom-scroll">
              <form @submit.prevent="saveVoluntario" class="grid-form" id="voluntario-form">
                <!-- Nome -->
                <div class="form-group full-width">
                  <label>Nome Completo</label>
                  <input v-model="form.nome" type="text" required placeholder="Ex: João Silva" />
                </div>
                
                <!-- Especialidade -->
                <div class="form-group">
                  <label>Especialidade</label>
                  <select v-model="form.especialidade" required class="accent-select">
                    <option value="" disabled>Selecione</option>
                    <option value="Clínica Médica">Clínica Médica</option>
                    <option value="Dermatologia">Dermatologia</option>
                    <option value="Endocrinologia">Endocrinologia</option>
                    <option value="Ginecologia">Ginecologia</option>
                    <option value="Nutrição">Nutrição</option>
                    <option value="Psicologia">Psicologia</option>
                    <option value="Reumatologia">Reumatologia</option>
                    <option value="Fisioterapia">Fisioterapia</option>
                    <option value="Gastroenterologia">Gastroenterologia</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <!-- Categoria -->
                <div class="form-group">
                  <label>Categoria</label>
                  <select v-model="form.categoria" required class="accent-select">
                    <option value="" disabled>Selecione</option>
                    <option value="Adultos">Adultos</option>
                    <option value="Pediatria">Pediatria</option>
                    <option value="Adulto e Pediatria">Adulto e Pediatria</option>
                  </select>
                </div>

                <!-- Dia da Semana -->
                <div class="form-group">
                  <label>Dia da Semana</label>
                  <select v-model="form.diaSemana" required class="accent-select">
                    <option value="" disabled>Selecione</option>
                    <option value="Segunda-feira">Segunda-feira</option>
                    <option value="Terça-feira">Terça-feira</option>
                    <option value="Quarta-feira">Quarta-feira</option>
                    <option value="Quinta-feira">Quinta-feira</option>
                    <option value="Sexta-feira">Sexta-feira</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                  </select>
                </div>

                <!-- Tempo de Consulta -->
                <div class="form-group">
                  <label>Tempo de Consulta (min)</label>
                  <input v-model="form.tempoConsulta" type="number" min="1" required placeholder="Ex: 30" />
                </div>

                <!-- Horário de Entrada -->
                <div class="form-group">
                  <label>Horário (Entrada)</label>
                  <input v-model="form.horarioEntrada" type="time" required />
                </div>

                <!-- Horário de Saída -->
                <div class="form-group">
                  <label>Horário (Saída)</label>
                  <input v-model="form.horarioSaida" type="time" required />
                </div>
                
                <!-- Telefone -->
                <div class="form-group">
                  <label>Telefone</label>
                  <input v-model="form.telefone" type="text" required placeholder="Ex: 912 345 678" />
                </div>

                <!-- Observações -->
                <div class="form-group full-width">
                  <label>Observações</label>
                  <select v-model="form.observacoes" required class="accent-select">
                    <option value="" disabled>Selecione</option>
                    <option value="Semanal">Semanal</option>
                    <option value="15 em 15 dias">15 em 15 dias</option>
                    <option value="1 vez por mês">1 vez por mês</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </form>
            </div>
            
            <div class="modal-footer">
              <button type="button" @click="closeModal" class="btn-cancel">Cancelar</button>
              <button type="submit" form="voluntario-form" class="btn-save">
                {{ isEditing ? 'Guardar Alterações' : 'Adicionar Voluntário' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MenuLateral from '../components/MenuLateral.vue';
import { db } from '../firebase'; 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Estado Reativo
const voluntarios = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const currentId = ref(null);

// Dados do formulário atualizados com os novos campos
const form = ref({
  nome: '',
  especialidade: '',
  categoria: '',
  diaSemana: '',
  horarioEntrada: '',
  horarioSaida: '',
  tempoConsulta: '',
  telefone: '',
  observacoes: ''
});

// Referência à coleção "voluntarios" na Firestore
const voluntariosCol = collection(db, 'voluntarios');

// Buscar os dados à Firebase
const fetchVoluntarios = async () => {
  try {
    const snapshot = await getDocs(voluntariosCol);
    voluntarios.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao buscar voluntários:", error);
  }
};

// Preparar modal para nova adição
const openAddModal = () => {
  isEditing.value = false;
  currentId.value = null;
  form.value = { 
    nome: '',
    especialidade: '',
    categoria: '',
    diaSemana: '',
    horarioEntrada: '',
    horarioSaida: '',
    tempoConsulta: '',
    telefone: '',
    observacoes: ''
  };
  showModal.value = true;
};

// Preparar modal para edição
const editVoluntario = (voluntario) => {
  isEditing.value = true;
  currentId.value = voluntario.id;
  form.value = { ...voluntario }; // Clona os dados para o form
  showModal.value = true;
};

// Fechar o modal
const closeModal = () => {
  showModal.value = false;
};

// Guardar ou Atualizar registo na Firebase
const saveVoluntario = async () => {
  try {
    if (isEditing.value) {
      // Atualizar documento existente
      const docRef = doc(db, 'voluntarios', currentId.value);
      await updateDoc(docRef, form.value);
    } else {
      // Adicionar novo documento
      await addDoc(voluntariosCol, form.value);
    }
    await fetchVoluntarios(); // Recarrega a lista após a gravação
    closeModal();
  } catch (error) {
    console.error("Erro ao guardar voluntário:", error);
    alert("Ocorreu um erro ao guardar o voluntário.");
  }
};

// Eliminar registo na Firebase
const deleteVoluntario = async (id) => {
  if (confirm('Tem a certeza que deseja eliminar este voluntário? Esta ação é irreversível.')) {
    try {
      const docRef = doc(db, 'voluntarios', id);
      await deleteDoc(docRef);
      await fetchVoluntarios(); // Recarrega a lista após eliminar
    } catch (error) {
      console.error("Erro ao eliminar voluntário:", error);
      alert("Ocorreu um erro ao eliminar o voluntário.");
    }
  }
};

// Ao montar a página (iniciar o componente), carrega logo a lista
onMounted(() => {
  fetchVoluntarios();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

/* Reset e Estrutura Base */
.app-container {
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100vh;
  width: 100vw;
  background-color: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow: hidden;
}

.sidebar-wrapper {
  background: white;
  border-right: 1px solid #e2e8f0;
  z-index: 10;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 0;
  background: radial-gradient(circle at 50% -20%, #f1f5f9, #f8fafc);
}

/* Header Section */
.header-section {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding: 1.5rem 2rem;
  z-index: 5;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.brand-area {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.icon-box {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 0.75rem;
  border-radius: 1rem;
  box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.4);
}

.titles h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  line-height: 1;
}

.titles p {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  margin-top: 0.25rem;
}

.action-area {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-container {
  margin-right: 100px;
  position: relative;
  width: 350px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-container input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  outline: none;
}

.search-container input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
}

.btn-new {
  background: #0f172a;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.btn-new:hover {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
}

/* Dashboard Body */
.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.table-card {
  background: white;
  border-radius: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.02), 0 4px 6px -2px rgba(0,0,0,0.02);
  max-width: 1600px;
  margin: 0 auto;
  overflow: hidden;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table th {
  padding: 1.25rem 2rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.modern-table td {
  padding: 1.5rem 2rem;
  vertical-align: middle;
}

.table-row {
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.table-row:hover {
  background-color: #f8fafc;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  color: #475569;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
}

.details {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.938rem;
}

.subtext {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.specialty-box .main-spec {
  display: block;
  font-weight: 700;
  color: #334155;
  font-size: 0.875rem;
}

.tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  color: #3b82f6;
  background: #eff6ff;
  padding: 2px 8px;
  border-radius: 6px;
  margin-top: 4px;
  text-transform: uppercase;
}

.schedule-box .day {
  display: block;
  font-weight: 700;
  font-size: 0.875rem;
  color: #1e293b;
}

.schedule-box .time {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.status-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.is-active { background: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
.is-inactive { background: #ef4444; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }

.status-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
}

.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit:hover {
  background: #eff6ff;
  color: #3b82f6;
  border-color: #3b82f6;
}

.btn-delete:hover {
  background: #fef2f2;
  color: #ef4444;
  border-color: #ef4444;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 2rem;
}

.modal-window {
  background: white;
  width: 100%;
  max-width: 700px;
  border-radius: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  padding: 2rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
}

.modal-title h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
}

.modal-title p {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.close-btn {
  background: #f8fafc;
  border: none;
  color: #94a3b8;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.modal-body {
  padding: 2rem 2.5rem;
  overflow-y: auto;
}

.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.full-width {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input, .form-group select {
  padding: 0.875rem 1rem;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  font-size: 0.938rem;
  font-weight: 600;
  color: #1e293b;
  outline: none;
  transition: all 0.2s;
  background: #f8fafc;
}

.form-group input:focus, .form-group select:focus {
  background: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.accent-select {
  background: #f0f9ff !important;
  color: #0369a1 !important;
  border-color: #bae6fd !important;
}

/* Estilo específico para input de time e date manterem o aspeto */
input[type="time"], input[type="date"] {
  font-family: inherit;
}

/* Estilo para input disabled (Data de Registo) */
input:disabled {
  background-color: #e2e8f0;
  color: #64748b;
  cursor: not-allowed;
}

.modal-footer {
  padding: 1.5rem 2.5rem;
  background: #f8fafc;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid #f1f5f9;
}

.btn-cancel {
  padding: 0.875rem 1.5rem;
  font-weight: 700;
  color: #64748b;
  background: transparent;
  border: none;
  cursor: pointer;
}

.btn-save {
  padding: 0.875rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save:hover {
  background: #2563eb;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
}

/* Custom Scrollbar */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.orbit-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #3b82f6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .search-container { width: 100%; }
  .grid-form { grid-template-columns: 1fr; }
  .full-width { grid-column: span 1; }
  .modal-window { border-radius: 1.5rem; }
}
</style>