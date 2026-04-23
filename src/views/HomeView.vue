<template>
  <div class="home-layout">
    <!-- Menu Lateral Embutido -->
    <MenuLateral />

    <!-- Área de Conteúdo Principal -->
    <main class="main-content">
      
      <!-- Cabeçalho da Home -->
      <header class="top-bar">
        <div class="header-titles">
          <h1>Painel Geral</h1>
          <p>Visão geral do sistema ambulatorial SMC</p>
        </div>
        <div class="user-profile">
          <div class="avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="user-info">
            <span class="user-name">Voluntário Ativo</span>
            <span class="user-email">{{ userEmail }}</span>
          </div>
        </div>
      </header>

      <!-- Barra de Busca de Pacientes -->
      <section class="search-section">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar paciente por P ou CPF..." 
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="search-btn">Buscar</button>
        </div>
      </section>

      <!-- Cards de Resumo (Dashboard) -->
      <section class="dashboard-cards">
        
        <!-- Card 1: Pacientes -->
        <div class="card">
          <div class="card-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="card-details">
            <h3>Total de Pacientes</h3>
            <p class="card-number">0</p>
            <span class="card-trend neutral">Sem registros nesta semana</span>
          </div>
        </div>

        <!-- Card 2: Agendamentos de Hoje -->
        <div class="card">
          <div class="card-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
          </div>
          <div class="card-details">
            <h3>Agendamentos (Hoje)</h3>
            <p class="card-number">0</p>
            <span class="card-trend neutral">0 aguardando triagem</span>
          </div>
        </div>

        <!-- Card 3: Voluntários -->
        <div class="card">
          <div class="card-icon light-blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <div class="card-details">
            <h3>Equipe Voluntária</h3>
            <p class="card-number">0</p>
            <span class="card-trend neutral">Nenhum médico plantonista</span>
          </div>
        </div>

      </section>

      <!-- Ações Rápidas -->
      <section class="quick-actions">
        <h2>Ações Rápidas</h2>
        <div class="action-buttons">
          <button class="action-btn primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Novo Paciente
          </button>
          <button class="action-btn secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Agendar Consulta
          </button>
          <button class="action-btn secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            Fazer Evolução
          </button>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '@/firebase'
import MenuLateral from '@/components/MenuLateral.vue'

const userEmail = ref('Carregando...')
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Buscando paciente por:', searchQuery.value)
    // Aqui você pode adicionar a lógica para redirecionar ou buscar no banco
    // Exemplo: router.push(`/pacientes?busca=${searchQuery.value}`)
  }
}

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      userEmail.value = user.email
    } else {
      userEmail.value = 'Usuário não logado'
    }
  })
})
</script>

<style scoped>
.home-layout {
  --primary-blue: #0A3A6A;
  --secondary-blue: #1C658C;
  --accent-green: #00A884;
  --bg-color: #F4F7F6;
  --text-dark: #333333;
  --text-light: #7A8B99;

  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background-color: var(--bg-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
}

.main-content {
  flex: 1;
  padding: 40px;
  min-width: 0;
  box-sizing: border-box;
}

/* Cabeçalho */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-titles h1 {
  margin: 0;
  color: var(--primary-blue);
  font-size: 2rem;
}

.header-titles p {
  margin: 5px 0 0 0;
  color: var(--text-light);
  font-size: 1rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: white;
  padding: 10px 20px;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.avatar {
  background-color: var(--accent-green);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: var(--primary-blue);
  font-size: 0.95rem;
}

.user-email {
  color: var(--text-light);
  font-size: 0.8rem;
}

/* Seção de Busca */
.search-section {
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  padding: 8px 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 1px solid #E1E8ED;
  max-width: 600px;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.search-box:focus-within {
  border-color: var(--accent-green);
  box-shadow: 0 0 0 4px rgba(0, 168, 132, 0.1);
}

.search-icon {
  color: var(--text-light);
  margin-right: 10px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1.05rem;
  color: var(--text-dark);
  padding: 10px 0;
  background: transparent;
}

.search-input::placeholder {
  color: #A0B3C1;
}

.search-btn {
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background-color: var(--secondary-blue);
}

/* Cards do Dashboard */
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.card {
  background-color: white;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  border: 1px solid #E1E8ED;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon.blue { background-color: rgba(10, 58, 106, 0.1); color: var(--primary-blue); }
.card-icon.green { background-color: rgba(0, 168, 132, 0.1); color: var(--accent-green); }
.card-icon.light-blue { background-color: rgba(28, 101, 140, 0.1); color: var(--secondary-blue); }

.card-details h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-light);
  font-weight: 500;
}

.card-number {
  margin: 5px 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-blue);
}

.card-trend {
  font-size: 0.85rem;
  font-weight: 600;
}

.card-trend.positive { color: var(--accent-green); }
.card-trend.neutral { color: #7A8B99; }

/* Ações Rápidas */
.quick-actions h2 {
  color: var(--primary-blue);
  font-size: 1.4rem;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background-color: var(--accent-green);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 168, 132, 0.2);
}

.action-btn.primary:hover {
  background-color: #008f6f;
  transform: translateY(-2px);
}

.action-btn.secondary {
  background-color: white;
  color: var(--primary-blue);
  border: 1px solid #E1E8ED;
}

.action-btn.secondary:hover {
  border-color: var(--primary-blue);
  background-color: rgba(10, 58, 106, 0.05);
}

/* Responsividade */
@media (max-width: 1024px) {
  .main-content {
    padding: 20px;
  }
  
  .top-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .search-box {
    max-width: 100%;
  }
}
</style>