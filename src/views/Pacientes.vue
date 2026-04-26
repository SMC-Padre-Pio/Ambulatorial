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
            <div class="icon-box paciente-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg>
            </div>
            <div class="titles">
              <h1>Gestão de Pacientes</h1>
              <p>Registo e acompanhamento de pacientes e prontuários</p>
            </div>
          </div>
          
          <div class="action-area">
            <div class="search-container">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Procurar paciente (Nome ou Prontuário)..." v-model="searchQuery" />
            </div>
            <button @click="openAddModal" class="btn-new">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Adicionar Paciente
            </button>
          </div>
        </div>
      </header>

      <!-- Corpo Principal e Tabela -->
      <div class="scroll-area custom-scroll">
        <div class="table-card">
          <div class="table-responsive">
            <table class="modern-table" v-if="filteredPacientes.length > 0">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Idade / Nascimento</th>
                  <th>Contacto</th>
                  <th>Endereço</th>
                  <th>Especialidades</th>
                  <th>Contacto Emergência</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr class="table-row" v-for="paciente in filteredPacientes" :key="paciente.id">
                  <td>
                    <div class="user-info">
                      <div class="avatar" :class="paciente.prontuario?.startsWith('J') ? 'avatar-j' : 'avatar-a'">
                        {{ paciente.nome ? paciente.nome.charAt(0).toUpperCase() : 'P' }}
                      </div>
                      <div class="details">
                        <span class="name">{{ paciente.nome }}</span>
                        <span class="tag-prontuario">{{ paciente.prontuario }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="details">
                      <span class="name">{{ paciente.idade }} anos</span>
                      <span class="subtext">{{ formatarData(paciente.dataNascimento) }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="details">
                      <span class="name">{{ paciente.telefone }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="details">
                      <span class="name" style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" :title="`${paciente.enderecoRua}, ${paciente.enderecoNum} - ${paciente.enderecoBairro}`">
                        {{ paciente.enderecoRua }}, {{ paciente.enderecoNum }}
                      </span>
                      <span class="subtext">{{ paciente.enderecoBairro ? paciente.enderecoBairro + ' | ' : '' }}{{ paciente.enderecoComp || 'S/ Complemento' }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="specialty-box" style="display: flex; flex-wrap: wrap; gap: 4px;">
                      <template v-if="Array.isArray(paciente.especialidade) && paciente.especialidade.length > 0">
                        <span class="tag-spec" v-for="spec in paciente.especialidade" :key="spec">{{ spec }}</span>
                      </template>
                      <template v-else-if="paciente.especialidade && !Array.isArray(paciente.especialidade)">
                        <!-- Fallback para registos antigos guardados como string -->
                        <span class="tag-spec">{{ paciente.especialidade }}</span>
                      </template>
                      <template v-else>
                        <span class="subtext">Nenhuma</span>
                      </template>
                    </div>
                  </td>
                  <td>
                    <div class="details">
                      <span class="name">{{ paciente.emergenciaNome }} ({{ paciente.emergenciaParentesco }})</span>
                      <span class="subtext">{{ paciente.emergenciaNumero }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="btn-group">
                      <button @click="editPaciente(paciente)" class="btn-icon btn-edit" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button @click="deletePaciente(paciente.id)" class="btn-icon btn-delete" title="Eliminar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div v-else style="padding: 4rem; text-align: center; color: #94a3b8; font-weight: 600;">
              Nenhum paciente encontrado.
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
                <h2>{{ isEditing ? 'Editar Paciente' : 'Novo Paciente' }}</h2>
                <p>Preencha os dados pessoais e médicos do paciente</p>
              </div>
              <button @click="closeModal" class="close-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div class="modal-body custom-scroll">
              <form @submit.prevent="savePaciente" class="grid-form" id="paciente-form">
                
                <div class="section-title full-width">Dados Pessoais</div>

                <!-- Nome -->
                <div class="form-group full-width">
                  <label>Nome Completo</label>
                  <input v-model="form.nome" type="text" required placeholder="Ex: Maria dos Santos" />
                </div>
                
                <!-- Data de Nascimento -->
                <div class="form-group">
                  <label>Data de Nascimento</label>
                  <input v-model="form.dataNascimento" type="date" required />
                </div>

                <!-- Idade (Calculada Automaticamente) -->
                <div class="form-group">
                  <label>Idade (Anos)</label>
                  <input :value="idadeCalculada" type="number" disabled placeholder="Calculada auto." class="bg-gray" />
                </div>

                <!-- Telefone -->
                <div class="form-group full-width">
                  <label>Telefone</label>
                  <input v-model="form.telefone" type="text" required placeholder="Ex: 912 345 678" />
                </div>

                <!-- Especialidades (Multipla Seleção via Checkboxes) -->
                <div class="form-group full-width">
                  <label>Especialidades de Acompanhamento</label>
                  <div class="checkbox-grid">
                    <label class="checkbox-label" v-for="spec in especialidadesOpcoes" :key="spec">
                      <input type="checkbox" :value="spec" v-model="form.especialidade" />
                      <span class="checkbox-text">{{ spec }}</span>
                    </label>
                  </div>
                </div>

                <div class="section-title full-width mt-4">Endereço</div>

                <!-- Rua -->
                <div class="form-group full-width">
                  <label>Rua / Avenida</label>
                  <input v-model="form.enderecoRua" type="text" required placeholder="Ex: Rua das Flores" />
                </div>

                <!-- Bairro / Comunidade -->
                <div class="form-group">
                  <label>Bairro / Comunidade</label>
                  <input v-model="form.enderecoBairro" type="text" required placeholder="Ex: Centro" />
                </div>

                <!-- Número -->
                <div class="form-group">
                  <label>Número</label>
                  <input v-model="form.enderecoNum" type="text" required placeholder="Ex: 123" />
                </div>

                <!-- Complemento -->
                <div class="form-group full-width">
                  <label>Complemento</label>
                  <input v-model="form.enderecoComp" type="text" placeholder="Ex: Apt 4B, Bloco 2" />
                </div>

                <div class="section-title full-width mt-4">Contacto de Emergência</div>

                <!-- Nome Emergência -->
                <div class="form-group">
                  <label>Nome do Contacto</label>
                  <input v-model="form.emergenciaNome" type="text" required placeholder="Nome do familiar/amigo" />
                </div>

                <!-- Parentesco Emergência -->
                <div class="form-group">
                  <label>Parentesco</label>
                  <input v-model="form.emergenciaParentesco" type="text" required placeholder="Ex: Mãe, Filho, Cônjuge" />
                </div>

                <!-- Número Emergência -->
                <div class="form-group full-width">
                  <label>Telefone de Emergência</label>
                  <input v-model="form.emergenciaNumero" type="text" required placeholder="Ex: 919 888 777" />
                </div>

              </form>
            </div>
            
            <div class="modal-footer">
              <button type="button" @click="closeModal" class="btn-cancel">Cancelar</button>
              <button type="submit" form="paciente-form" class="btn-save">
                {{ isEditing ? 'Guardar Alterações' : 'Adicionar Paciente' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MenuLateral from '../components/MenuLateral.vue';
import { db } from '../firebase'; 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Estado Reativo
const pacientes = ref([]);
const searchQuery = ref('');
const showModal = ref(false);
const isEditing = ref(false);
const currentId = ref(null);

// Opções de especialidades para os checkboxes
const especialidadesOpcoes = [
  'Clínica Médica', 
  'Dermatologia', 
  'Endocrinologia', 
  'Ginecologia', 
  'Pediatria', 
  'Psicologia', 
  'Outros'
];

// Dados do formulário
const form = ref({
  nome: '',
  dataNascimento: '',
  telefone: '',
  especialidade: [], // Agora é um array para suportar múltiplas opções
  enderecoRua: '',
  enderecoBairro: '', // Novo campo adicionado
  enderecoNum: '',
  enderecoComp: '',
  emergenciaNome: '',
  emergenciaNumero: '',
  emergenciaParentesco: '',
  prontuario: '',
  idade: 0
});

// Referência à coleção "pacientes" na Firestore
const pacientesCol = collection(db, 'pacientes');

// Computed Properties
const idadeCalculada = computed(() => {
  if (!form.value.dataNascimento) return '';
  const hoje = new Date();
  const nasc = new Date(form.value.dataNascimento);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
    idade--;
  }
  return idade;
});

const filteredPacientes = computed(() => {
  if (!searchQuery.value) return pacientes.value;
  const query = searchQuery.value.toLowerCase();
  return pacientes.value.filter(p => 
    p.nome.toLowerCase().includes(query) || 
    (p.prontuario && p.prontuario.toLowerCase().includes(query))
  );
});

// Buscar os dados à Firebase
const fetchPacientes = async () => {
  try {
    const snapshot = await getDocs(pacientesCol);
    pacientes.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => {
      // Ordenar por Prontuário (Número)
      const numA = parseInt((a.prontuario || '0').replace(/\D/g, ''));
      const numB = parseInt((b.prontuario || '0').replace(/\D/g, ''));
      return numB - numA; // Mais recentes primeiro
    });
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
  }
};

// Formatação de Data para a Tabela
const formatarData = (dataStr) => {
  if (!dataStr) return '';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
};

// Lógica de Geração do Prontuário
const gerarNovoProntuario = async (idade) => {
  try {
    const snapshot = await getDocs(pacientesCol);
    let maxNum = 0;
    
    snapshot.forEach(doc => {
      const p = doc.data().prontuario;
      if (p) {
        // Extrai apenas os números da string (Ex: de "A15" ou "J15" tira "15")
        const numMatch = p.match(/\d+/);
        if (numMatch) {
          const num = parseInt(numMatch[0]);
          if (num > maxNum) maxNum = num;
        }
      }
    });
    
    const nextNum = maxNum + 1;
    const prefixo = idade < 16 ? 'J' : 'A';
    
    return `${prefixo}${nextNum}`;
  } catch (error) {
    console.error("Erro ao gerar prontuário:", error);
    // Em caso de falha, usa um fallback com timestamp para não parar o sistema
    const prefixo = idade < 16 ? 'J' : 'A';
    return `${prefixo}${Date.now().toString().slice(-4)}`; 
  }
};

// Preparar modal para nova adição
const openAddModal = () => {
  isEditing.value = false;
  currentId.value = null;
  form.value = { 
    nome: '',
    dataNascimento: '',
    telefone: '',
    especialidade: [], // Iniciar limpo
    enderecoRua: '',
    enderecoBairro: '', // Novo campo limpo
    enderecoNum: '',
    enderecoComp: '',
    emergenciaNome: '',
    emergenciaNumero: '',
    emergenciaParentesco: '',
    prontuario: '',
    idade: 0
  };
  showModal.value = true;
};

// Preparar modal para edição
const editPaciente = (paciente) => {
  isEditing.value = true;
  currentId.value = paciente.id;
  
  // Lidar com registos antigos que podiam ter a especialidade guardada apenas como string
  let specArray = [];
  if (Array.isArray(paciente.especialidade)) {
    specArray = [...paciente.especialidade];
  } else if (paciente.especialidade) {
    specArray = [paciente.especialidade];
  }

  form.value = { 
    ...paciente,
    enderecoBairro: paciente.enderecoBairro || '', // Prevenir erro se for registo antigo
    especialidade: specArray
  };
  showModal.value = true;
};

// Fechar o modal
const closeModal = () => {
  showModal.value = false;
};

// Guardar ou Atualizar registo na Firebase
const savePaciente = async () => {
  try {
    // Atualiza a idade no form antes de salvar
    form.value.idade = idadeCalculada.value;

    if (isEditing.value) {
      const docRef = doc(db, 'pacientes', currentId.value);
      await updateDoc(docRef, form.value);
    } else {
      // Novo registo: Gerar o código de Prontuário "A+Num" ou "J+Num"
      const novoProntuario = await gerarNovoProntuario(form.value.idade);
      form.value.prontuario = novoProntuario;
      
      await addDoc(pacientesCol, form.value);
    }
    await fetchPacientes();
    closeModal();
  } catch (error) {
    console.error("Erro ao guardar paciente:", error);
    alert("Ocorreu um erro ao guardar o paciente.");
  }
};

// Eliminar registo na Firebase
const deletePaciente = async (id) => {
  if (confirm('Tem a certeza que deseja eliminar este paciente? Esta ação é irreversível e o número do prontuário será perdido.')) {
    try {
      const docRef = doc(db, 'pacientes', id);
      await deleteDoc(docRef);
      await fetchPacientes();
    } catch (error) {
      console.error("Erro ao eliminar paciente:", error);
      alert("Ocorreu um erro ao eliminar o paciente.");
    }
  }
};

onMounted(() => {
  fetchPacientes();
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
  padding: 0.75rem;
  border-radius: 1rem;
  color: white;
}

.paciente-icon {
  background: linear-gradient(135deg, #ec4899, #be185d);
  box-shadow: 0 8px 16px -4px rgba(236, 72, 153, 0.4);
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
  margin-right: 15%;
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
  border-color: #ec4899;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.08);
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
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
}

.avatar-a {
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  color: #3730a3;
}

.avatar-j {
  background: linear-gradient(135deg, #fce7f3, #fbcfe8);
  color: #9d174d;
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

.tag-prontuario {
  display: inline-block;
  font-size: 11px;
  font-weight: 800;
  color: #ec4899;
  background: #fdf2f8;
  padding: 2px 8px;
  border-radius: 6px;
  margin-top: 4px;
  width: fit-content;
}

/* Checkbox Grid e Etiquetas de Especialidade */
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #ec4899;
  cursor: pointer;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #334155;
  font-weight: 600;
}

.tag-spec {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #be185d;
  background: #fdf2f8;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #fbcfe8;
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
  background: #fdf2f8;
  color: #ec4899;
  border-color: #ec4899;
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
  max-width: 750px;
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

.mt-4 {
  margin-top: 1rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 800;
  color: #0f172a;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 0.5rem;
  margin-bottom: -0.5rem;
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
  border-color: #ec4899;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
}

.accent-select {
  background: #fdf2f8 !important;
  color: #be185d !important;
  border-color: #fbcfe8 !important;
}

input[type="date"] {
  font-family: inherit;
}

input:disabled, .bg-gray {
  background-color: #e2e8f0 !important;
  color: #64748b !important;
  cursor: not-allowed;
  border-color: #cbd5e1 !important;
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
  background: #ec4899;
  color: white;
  border: none;
  border-radius: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save:hover {
  background: #db2777;
  box-shadow: 0 10px 15px -3px rgba(219, 39, 119, 0.3);
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

@media (max-width: 1024px) {
  .search-container { width: 100%; }
  .grid-form { grid-template-columns: 1fr; }
  .full-width { grid-column: span 1; }
  .modal-window { border-radius: 1.5rem; }
}
</style>