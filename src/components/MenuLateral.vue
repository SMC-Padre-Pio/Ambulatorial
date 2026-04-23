<template>
  <aside 
    ref="sidebarRef"
    :class="['sidebar', { 'is-collapsed': isCollapsed }]"
    @click="expandMenu"
  >
    <!-- Cabeçalho do Menu com Logos -->
    <div class="sidebar-header">
      <img 
        v-if="!isCollapsed" 
        src="@/assets/LogoBanner.png" 
        alt="Ambulatorial SMC" 
        class="logo-large"
      />
      <img 
        v-else 
        src="@/assets/LogoSMC.png" 
        alt="SMC" 
        class="logo-small"
      />
    </div>

    <!-- Navegação -->
    <nav class="sidebar-nav">
      <ul class="nav-list">
        
        <li class="nav-item">
          <router-link to="/home" class="nav-link" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span class="nav-text" v-if="!isCollapsed">Início</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/pacientes" class="nav-link" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span class="nav-text" v-if="!isCollapsed">Pacientes</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/agendamentos" class="nav-link" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            <span class="nav-text" v-if="!isCollapsed">Agendamentos</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/voluntarios" class="nav-link" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <span class="nav-text" v-if="!isCollapsed">Equipe Voluntária</span>
          </router-link>
        </li>

      </ul>
    </nav>

    <!-- Rodapé do Menu (Logout) -->
    <div class="sidebar-footer">
      <button @click="handleLogout" class="logout-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        <span class="nav-text" v-if="!isCollapsed">Sair</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'

const router = useRouter()

// Referência do HTML do Menu e Estado
const sidebarRef = ref(null)
const isCollapsed = ref(true) // Começa fechado por padrão

// Função para abrir ao clicar no menu
const expandMenu = () => {
  if (isCollapsed.value) {
    isCollapsed.value = false
  }
}

// Função para fechar ao clicar em qualquer lugar fora
const handleClickOutside = (event) => {
  if (!isCollapsed.value && sidebarRef.value && !sidebarRef.value.contains(event.target)) {
    isCollapsed.value = true
  }
}

// Adiciona e remove os ouvintes de clique global
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/')
  } catch (error) {
    console.error("Erro ao sair:", error)
  }
}
</script>

<style scoped>
.sidebar {
  --primary-blue: #0A3A6A;
  --secondary-blue: #1C658C;
  --accent-green: #00A884;
  --bg-color: #ffffff;
  --hover-bg: #F4F7F6;
  --text-dark: #333333;
  --text-light: #7A8B99;
  --transition-speed: 0.3s;

  display: flex;
  flex-direction: column;
  /* Mudança Crucial: position sticky evita bugar o layout lateralmente */
  position: sticky;
  top: 0;
  height: 100vh;
  width: 260px;
  flex-shrink: 0; /* Impede o menu de amassar */
  background-color: var(--bg-color);
  border-right: 1px solid #E1E8ED;
  transition: width var(--transition-speed) ease;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 2px 0 10px rgba(0,0,0,0.05);
  z-index: 100;
  overflow: hidden;
}

/* Estado Recolhido */
.sidebar.is-collapsed {
  width: 80px;
  cursor: pointer; /* Cursor de "clique" para o usuário saber que abre */
}

/* Desabilita os botões internamente quando encolhido para não navegar acidentalmente ao tentar expandir */
.sidebar.is-collapsed .nav-link,
.sidebar.is-collapsed .logout-btn {
  pointer-events: none;
}

/* Cabeçalho */
.sidebar-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-bottom: 1px solid #E1E8ED;
}

.logo-large {
  max-width: 150px;
  height: auto;
}

.logo-small {
  max-width: 45px;
  height: auto;
}

/* Navegação */
.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.sidebar-nav::-webkit-scrollbar { width: 5px; }
.sidebar-nav::-webkit-scrollbar-thumb { background-color: #ccc; border-radius: 5px; }

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  padding: 0 15px;
}

.sidebar.is-collapsed .nav-item {
  padding: 0 10px;
}

.nav-link, .logout-btn {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  text-decoration: none;
  color: var(--text-light);
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
}

.sidebar.is-collapsed .nav-link,
.sidebar.is-collapsed .logout-btn {
  justify-content: center;
  padding: 12px 0;
}

.nav-icon {
  min-width: 24px;
  color: var(--primary-blue);
}

.nav-text {
  margin-left: 15px;
  font-weight: 500;
  white-space: nowrap;
}

/* Efeitos */
.nav-link:hover, .logout-btn:hover {
  background-color: var(--hover-bg);
  color: var(--primary-blue);
}

.nav-link.active {
  background-color: rgba(0, 168, 132, 0.1);
  color: var(--accent-green);
  border-left: 4px solid var(--accent-green);
}

.nav-link.active .nav-icon {
  color: var(--accent-green);
}

/* Rodapé */
.sidebar-footer {
  padding: 20px 15px;
  border-top: 1px solid #E1E8ED;
}

.sidebar.is-collapsed .sidebar-footer {
  padding: 20px 10px;
}

.logout-btn { color: #D32F2F; }
.logout-btn .nav-icon { color: #D32F2F; }
.logout-btn:hover { background-color: #FFEBEE; color: #B71C1C; }
</style>