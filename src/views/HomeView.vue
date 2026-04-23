<template>
  <div class="home-container">
    <h1>Bem-vindo à Home!</h1>
    <p>Você está logado com sucesso no sistema.</p>
    <button @click="handleLogout">Sair</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'

const router = useRouter()

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
.home-container {
  text-align: center;
  margin-top: 100px;
  font-family: sans-serif;
}

button {
  padding: 0.5rem 1.5rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>