<template>
  <div class="login-page">
    <div class="login-split">
      
      <!-- Lado esquerdo: Banner Institucional com Foto -->
      <div class="login-banner">
        <div class="banner-overlay"></div>
        <div class="banner-content">
          <h1>Sistema de Gestão Ambulatorial</h1>
          <p>Eficiência, cuidado e tecnologia a favor da vida.</p>
        </div>
      </div>

      <!-- Lado direito: Formulário de Login -->
      <div class="login-form-container">
        <div class="form-wrapper">
          
          <div class="form-header">
            <!-- Logo Grande -->
            <img src="@/assets/LogoBanner.png" alt="Logo Hospitalar" class="large-logo" />
            <h2>Acesso ao Sistema</h2>
            <p>Insira suas credenciais para continuar</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="input-group">
              <label for="email">E-mail Corporativo</label>
              <div class="input-field">
                <!-- Ícone SVG de email -->
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input 
                  type="email" 
                  id="email" 
                  v-model="email" 
                  required 
                  placeholder="exemplo@hospital.com.br" 
                />
              </div>
            </div>

            <div class="input-group">
              <label for="password">Senha</label>
              <div class="input-field">
                <!-- Ícone SVG de cadeado -->
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model="password" 
                  required 
                  placeholder="Sua senha secreta" 
                />
                
                <!-- Botão de mostrar/ocultar senha -->
                <button type="button" class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
                  <!-- Olho aberto -->
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <!-- Olho fechado -->
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                </button>
              </div>
            </div>

            <div class="form-actions">
              <label class="remember-checkbox">
                <input type="checkbox" v-model="rememberMe" />
                <span class="checkmark"></span>
                Lembrar minhas credenciais
              </label>
              <a href="#" @click.prevent="showForgotPasswordModal = true" class="forgot-password">Esqueceu a senha?</a>
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              <span v-if="!isLoading">Entrar no Sistema</span>
              <span v-else class="loader"></span>
            </button>

            <div v-if="errorMessage" class="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              {{ errorMessage }}
            </div>
          </form>

        </div>
      </div>

    </div>

    <!-- Modal Esqueceu a Senha -->
    <div v-if="showForgotPasswordModal" class="modal-overlay" @click.self="showForgotPasswordModal = false">
      <div class="modal-content">
        <button class="close-btn" @click="showForgotPasswordModal = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <Esqueceu />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'
import { 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence 
} from 'firebase/auth'
import Esqueceu from '@/components/Esqueceu.vue' // Importando o componente

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const showForgotPasswordModal = ref(false) // Estado para controlar o modal

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const persistenceType = rememberMe.value ? browserLocalPersistence : browserSessionPersistence
    await setPersistence(auth, persistenceType)

    await signInWithEmailAndPassword(auth, email.value, password.value)
    
    router.push('/home')
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    // Mensagens de erro mais amigáveis
    if(error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'){
        errorMessage.value = "Credenciais inválidas. Verifique seu e-mail e senha."
    } else {
        errorMessage.value = "Ocorreu um erro ao tentar acessar. Tente novamente mais tarde."
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Container Principal (e declaração das variáveis para o Scoped funcionar) */
.login-page {
  /* Variáveis de Cor - Azul e Verde Hospitalar */
  --primary-blue: #0A3A6A; /* Azul marinho profundo */
  --secondary-blue: #1C658C; /* Azul intermediário */
  --accent-green: #00A884; /* Verde saúde/tecnologia */
  --light-bg: #F4F7F6;
  --text-dark: #333333;
  --text-light: #7A8B99;

  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-bg);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.login-split {
  display: flex;
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  min-height: 600px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(10, 58, 106, 0.1);
  overflow: hidden;
}

/* Lado Esquerdo - Banner */
.login-banner {
  flex: 1;
  background-image: url('@/assets/FotoFundoInicial.png');
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: white;
  text-align: center;
}

/* Sobreposição na foto (Gradiente Azul e Verde) */
.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(10, 58, 106, 0.85) 0%, rgba(0, 168, 132, 0.7) 100%);
  z-index: 0;
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 400px;
}

.banner-content h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.banner-content p {
  font-size: 1.1rem;
  font-weight: 300;
  opacity: 0.9;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

/* Lado Direito - Formulário */
.login-form-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: white;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.large-logo {
  height: 80px;
  max-width: 100%;
  object-fit: contain;
  margin-bottom: 20px;
}

.form-header h2 {
  color: var(--primary-blue);
  font-size: 1.8rem;
  margin: 0 0 8px 0;
}

.form-header p {
  color: var(--text-light);
  margin: 0;
  font-size: 0.95rem;
}

/* Inputs */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-blue);
}

.input-field {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: var(--text-light);
  transition: color 0.3s;
}

.input-field input {
  width: 100%;
  padding: 14px 45px 14px 45px; /* Espaço para os dois ícones */
  border: 2px solid #E1E8ED;
  border-radius: 10px;
  font-size: 1rem;
  color: var(--text-dark);
  transition: all 0.3s ease;
  background-color: #FAFAFA;
}

.input-field input:focus {
  outline: none;
  border-color: var(--accent-green);
  background-color: white;
  box-shadow: 0 0 0 4px rgba(0, 168, 132, 0.1);
}

.input-field input:focus + .input-icon,
.input-field input:not(:placeholder-shown) + .input-icon {
  color: var(--accent-green);
}

/* Ícone de mostrar/ocultar senha */
.toggle-password {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: color 0.3s;
}

.toggle-password:hover {
  color: var(--accent-green);
}

/* Ações (Lembrar / Esqueci a senha) */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 15px;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-dark);
}

.remember-checkbox input {
  accent-color: var(--accent-green);
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.forgot-password {
  color: var(--primary-blue);
  font-size: 0.9rem;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.forgot-password:hover {
  color: var(--accent-green);
  text-decoration: underline;
}

/* Botão de Submit */
.submit-btn {
  background-color: var(--accent-green); /* O verde agora vai funcionar perfeitamente */
  color: #ffffff !important;
  border: none;
  padding: 16px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 54px;
  box-shadow: 0 4px 10px rgba(0, 168, 132, 0.2);
}

.submit-btn:hover:not(:disabled) {
  background-color: #008f6f;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 168, 132, 0.4);
}

.submit-btn:disabled {
  background-color: #A0B3C1;
  cursor: not-allowed;
  box-shadow: none;
}

/* Loading Spinner */
.loader {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Mensagem de Erro */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #D32F2F;
  background-color: #FFEBEE;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-top: 10px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Estilos do Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 58, 106, 0.6); /* Azul com transparência */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Garante que fique por cima de tudo */
  backdrop-filter: blur(4px); /* Efeito de desfoque no fundo */
}

.modal-content {
  position: relative;
  background-color: transparent; /* O componente Esqueceu já tem fundo branco */
  border-radius: 12px;
  animation: modalFadeIn 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #7A8B99;
  cursor: pointer;
  padding: 5px;
  z-index: 10;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #D32F2F;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Responsividade para telas menores */
@media (max-width: 900px) {
  .login-split {
    flex-direction: column;
    height: auto;
    min-height: auto;
    width: 95%;
  }

  .login-banner {
    padding: 30px 20px;
  }

  .banner-content h1 {
    font-size: 1.8rem;
  }

  .login-form-container {
    padding: 30px 20px;
  }
}
</style>