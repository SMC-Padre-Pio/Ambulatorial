<template>
  <div class="esqueceu-container">
    <div class="esqueceu-card">
      <div class="icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lock-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <h2>Esqueceu sua senha?</h2>
      <p class="description">
        Para garantir a segurança dos dados hospitalares, a redefinição de senha é feita diretamente com o suporte.
      </p>
      
      <div class="contact-info">
        <p>Entre em contato com o número:</p>
        <span class="phone-number">(21) 98410-8411</span>
      </div>

      <button @click="openWhatsapp" class="whatsapp-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        Chamar via WhatsApp
      </button>
    </div>
  </div>
</template>

<script setup>
const openWhatsapp = () => {
  const phoneNumber = "5521984108411"
  const message = encodeURIComponent("Olá, preciso de ajuda para recuperar minha senha do sistema.")
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
}
</script>

<style scoped>
.esqueceu-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.esqueceu-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  border: 1px solid #E1E8ED;
}

.icon-wrapper {
  background-color: #F4F7F6;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #0A3A6A;
}

h2 {
  color: #0A3A6A;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.description {
  color: #7A8B99;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

.contact-info {
  background-color: #FAFAFA;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.contact-info p {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 0.9rem;
}

.phone-number {
  font-size: 1.2rem;
  font-weight: bold;
  color: #00A884;
}

.whatsapp-btn {
  background-color: #25D366; /* Cor oficial do WhatsApp */
  color: white;
  border: none;
  padding: 14px 20px;
  width: 100%;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.3s;
}

.whatsapp-btn:hover {
  background-color: #1DA851;
}
</style>