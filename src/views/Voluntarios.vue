<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query 
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';

// Importando componentes globais
import MenuLateral from '../components/MenuLateral.vue';

// Configurações Globais do Firebase
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const appId = typeof __app_id !== 'undefined' ? __app_id : 'smc-padre-pio';

// Estado Reativo
const voluntarios = ref([]);
const loading = ref(true);
const showModal = ref(false);
const isEditing = ref(false);
const searchTerm = ref('');
const user = ref(null);

// Dados do Formulário
const initialForm = {
  nome: '',
  especialidade: '',
  categoria: '',
  diaSemana: '',
  horario: '',
  tempoConsulta: 20,
  telefone: '',
  observacoes: ''
};
const form = ref({ ...initialForm });
const currentId = ref(null);

// Opções Pré-definidas
const especialidades = [
  'Clínica Médica', 'Dermatologia', 'Endocrinologia', 'Ginecologia', 
  'Nutrição', 'Psicologia', 'Reumatologia', 'Fisioterapia', 
  'Gastroenterologia', 'Outros'
];
const categorias = ['Adultos', 'Pediatria', 'Adulto e Pediatria'];
const diasSemana = [
  'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
  'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
];
const listaObservacoes = ['Semanal', '15 em 15 dias', '1 vez por mês', 'Inativo'];

// Inicialização do Firebase e Firestore
let db;
let auth;

onMounted(async () => {
  const { initializeApp } = await import('firebase/app');
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);

  onAuthStateChanged(auth, (u) => {
    user.value = u;
    if (u) {
      listenToVoluntarios();
    } else {
      signInAnonymously(auth);
    }
  });
});

const listenToVoluntarios = () => {
  if (!user.value) return;
  const colRef = collection(db, 'artifacts', appId, 'public', 'data', 'voluntarios');
  const q = query(colRef);
  
  onSnapshot(q, (snapshot) => {
    voluntarios.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    loading.value = false;
  }, (error) => {
    console.error("Erro ao escutar voluntários:", error);
    loading.value = false;
  });
};

const openAddModal = () => {
  isEditing.value = false;
  form.value = { ...initialForm };
  showModal.value = true;
};

const openEditModal = (voluntario) => {
  isEditing.value = true;
  currentId.value = voluntario.id;
  form.value = { ...voluntario };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSubmit = async () => {
  if (!user.value) return;
  try {
    const colRef = collection(db, 'artifacts', appId, 'public', 'data', 'voluntarios');
    if (isEditing.value) {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'voluntarios', currentId.value);
      await updateDoc(docRef, { ...form.value });
    } else {
      await addDoc(colRef, { ...form.value, createdAt: new Date().toISOString() });
    }
    closeModal();
  } catch (error) {
    console.error("Erro ao processar voluntário:", error);
  }
};

const deleteVoluntario = async (id) => {
  if (!confirm("Tem certeza que deseja eliminar este voluntário?")) return;
  try {
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'voluntarios', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Erro ao eliminar documento:", error);
  }
};

const filteredVoluntarios = computed(() => {
  if (!searchTerm.value) return voluntarios.value;
  const term = searchTerm.value.toLowerCase();
  return voluntarios.value.filter(v => 
    v.nome.toLowerCase().includes(term) || 
    v.especialidade.toLowerCase().includes(term)
  );
});
</script>

<template>
  <div class="app-container">
    <!-- Sidebar -->
    <aside class="sidebar-wrapper">
      <MenuLateral />
    </aside>

    <!-- Main Content -->
    <main class="content-wrapper">
      <!-- Top Header Area -->
      <header class="header-section">
        <div class="header-content">
          <div class="brand-area">
            <div class="icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="titles">
              <h1>Voluntários</h1>
              <p>Gestão Inteligente de Equipa</p>
            </div>
          </div>

          <div class="action-area">
            <div class="search-container">
              <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                v-model="searchTerm"
                type="text" 
                placeholder="Procurar por nome ou área..."
              >
            </div>
            <button @click="openAddModal" class="btn-new">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              <span>Novo Voluntário</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Dashboard Body -->
      <div class="scroll-area custom-scroll">
        <div class="table-card">
          <div v-if="loading" class="loader-container">
            <div class="orbit-spinner"></div>
            <span>Sincronizando...</span>
          </div>

          <div v-else-if="filteredVoluntarios.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3>Nada encontrado</h3>
            <p>Não existem voluntários registados com este critério.</p>
            <button @click="searchTerm = ''" class="btn-clear">Limpar Pesquisa</button>
          </div>

          <div v-else class="table-responsive">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Identificação</th>
                  <th>Especialidade</th>
                  <th>Escala</th>
                  <th>Disponibilidade</th>
                  <th class="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="v in filteredVoluntarios" :key="v.id" class="table-row">
                  <td>
                    <div class="user-info">
                      <div class="avatar">{{ v.nome.charAt(0) }}</div>
                      <div class="details">
                        <span class="name">{{ v.nome }}</span>
                        <span class="subtext">{{ v.telefone || 'Sem contacto' }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="specialty-box">
                      <span class="main-spec">{{ v.especialidade }}</span>
                      <span class="tag">{{ v.categoria }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="schedule-box">
                      <span class="day">{{ v.diaSemana }}</span>
                      <span class="time">{{ v.horario }} <small>({{ v.tempoConsulta }}m)</small></span>
                    </div>
                  </td>
                  <td>
                    <div class="status-wrapper">
                      <span class="status-indicator" :class="v.observacoes === 'Inativo' ? 'is-inactive' : 'is-active'"></span>
                      <span class="status-text">{{ v.observacoes }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="btn-group">
                      <button @click="openEditModal(v)" class="btn-icon btn-edit" title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      </button>
                      <button @click="deleteVoluntario(v.id)" class="btn-icon btn-delete" title="Excluir">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Futuristic Modal -->
    <transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-window">
          <header class="modal-header">
            <div class="modal-title">
              <h2>{{ isEditing ? 'Editar Perfil' : 'Novo Voluntário' }}</h2>
              <p>Controle de Acesso e Escala</p>
            </div>
            <button @click="closeModal" class="close-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </header>

          <div class="modal-body custom-scroll">
            <form @submit.prevent="handleSubmit" id="vForm" class="grid-form">
              <div class="form-group full-width">
                <label>Nome Completo</label>
                <input v-model="form.nome" type="text" required placeholder="Ex: Dr. António Costa">
              </div>

              <div class="form-group">
                <label>Especialidade</label>
                <select v-model="form.especialidade" required>
                  <option value="" disabled>Selecione...</option>
                  <option v-for="esp in especialidades" :key="esp" :value="esp">{{ esp }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Público Alvo</label>
                <select v-model="form.categoria" required>
                  <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Dia de Atendimento</label>
                <select v-model="form.diaSemana" required>
                  <option v-for="dia in diasSemana" :key="dia" :value="dia">{{ dia }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Horário (HH:MM-HH:MM)</label>
                <input v-model="form.horario" type="text" placeholder="Ex: 08:00-12:00" required>
              </div>

              <div class="form-group">
                <label>Janela de Consulta (min)</label>
                <input v-model.number="form.tempoConsulta" type="number" required>
              </div>

              <div class="form-group">
                <label>Contacto Telefónico</label>
                <input v-model="form.telefone" type="text" placeholder="+351 000 000 000">
              </div>

              <div class="form-group full-width">
                <label>Periodicidade / Status</label>
                <select v-model="form.observacoes" required class="accent-select">
                  <option v-for="obs in listaObservacoes" :key="obs" :value="obs">{{ obs }}</option>
                </select>
              </div>
            </form>
          </div>

          <footer class="modal-footer">
            <button type="button" @click="closeModal" class="btn-cancel">Cancelar</button>
            <button type="submit" form="vForm" class="btn-save">
              {{ isEditing ? 'Guardar Alterações' : 'Concluir Registo' }}
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </div>
</template>

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