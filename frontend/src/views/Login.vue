<template>
  <el-row :gutter="0" style="margin: 0">
    <el-col :span="24" style="padding: 0">
      <el-image
        style="width: 100%; height: 100vh; object-fit: cover; margin: 0"
        :src="foto"
        fit="cover"
      />
    </el-col>
  </el-row>

  <el-row type="flex" justify="center" align="middle" style="height: 100vh">
    <el-col :span="24" justify="center" align="middle">
      <div>
        <el-card style="max-width: 400px" shadow="hover">
          <template #header v-if="!swLogin">
            <el-col justify="center" align="middle">
              <el-row class="text-center" justify="center">
                <el-text size="large">Bienvenidos a</el-text>
              </el-row>
              <el-row class="text-center mt-3" justify="center">
                <el-image style="width: 100px; height: 100px" :src="logo" fit="contain" />
              </el-row>
              <el-row class="text-center" justify="center">
                <el-text size="small">ONLINE</el-text>
              </el-row>
              <el-row class="text-center" justify="center">
                <el-text size="small">donde las compras son más fáciles</el-text>
              </el-row>
            </el-col>
          </template>
          <template #header v-else>
            <el-col justify="center" align="middle">
              <el-row class="text-center" justify="center">
                <el-text size="large">Regístrate</el-text>
              </el-row>
            </el-col>
          </template>
          <el-form label-position="top" label-width="auto" @submit.native.prevent="submitForm">
            <el-form-item v-if="swLogin">
              <el-input
                v-model="name"
                size="large"
                type="name"
                autocomplete="off"
                placeholder="Nombre"
              />
            </el-form-item>
            <el-form-item v-if="swLogin">
              <el-input
                v-model="last_name"
                size="large"
                type="last_name"
                autocomplete="off"
                placeholder="Apellido"
              />
            </el-form-item>
            <el-form-item v-if="swLogin">
              <el-input
                v-model="phone_number"
                size="large"
                type="phone_number"
                autocomplete="off"
                placeholder="Celular"
              />
            </el-form-item>
            <el-form-item
              size="large"
              :rules="[
                { required: true, message: 'Por favor ingrese el correo', trigger: 'blur' },
                {
                  type: 'email',
                  message: 'Por favor ingrese un correo válido',
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <el-input v-model="email" placeholder="Correo" :disabled="loading" />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="password"
                size="large"
                type="password"
                autocomplete="off"
                placeholder="Contraseña"
                :disabled="loading"
              />
            </el-form-item>
            <el-form-item>
              <el-radio value="Sponsor">Mantener sesión</el-radio>
            </el-form-item>
            <el-form-item v-if="!swLogin">
              <el-row style="width: 100%" justify="center" align="middle">
                <el-col class="text-center">
                  <el-button
                    style="width: 100%"
                    color="#7451B0"
                    type="success"
                    :loading="loading"
                    :disabled="!isValidForm"
                    @click="loginForm"
                  >
                    Iniciar sesión
                  </el-button>
                </el-col>
                <el-col class="text-center mt-2">
                  <el-button
                    @click="swLogin = true"
                    style="width: 100%"
                    color="#7451B0"
                    type="success"
                    plain
                  >
                    Registrarse
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-else>
              <el-row style="width: 100%" justify="center" align="middle">
                <el-col class="text-center">
                  <el-button
                    style="width: 100%"
                    color="#7451B0"
                    type="success"
                    :loading="loading"
                    :disabled="!isValidForm"
                    @click="registerForm"
                    >Registrarse
                  </el-button>
                </el-col>
                <el-col class="text-center mt-2">
                  <el-button
                    @click="swLogin = false"
                    style="width: 100%"
                    color="#7451B0"
                    type="success"
                    plain
                  >
                    Iniciar sesión
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div v-if="errorMessage" style="color: red; text-align: center; margin-top: 10px">
            {{ errorMessage }}
          </div>
        </el-card>
        <!-- <el-card style="max-width: 400px" shadow="hover">
          <template #header>
            <el-col justify="center" align="middle">
              <el-row class="text-center" justify="center">
                <el-text size="large">Regístrate</el-text>
              </el-row>
            </el-col>
          </template>
          <el-form label-position="top" label-width="auto" @submit.native.prevent="submitForm">
            <el-form-item>
              <el-input
                v-model="name"
                size="large"
                type="name"
                autocomplete="off"
                placeholder="Nombre"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="last_name"
                size="large"
                type="last_name"
                autocomplete="off"
                placeholder="Apellido"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="phone_number"
                size="large"
                type="phone_number"
                autocomplete="off"
                placeholder="Celular"
              />
            </el-form-item>
            <el-form-item
              size="large"
              :rules="[
                { required: true, message: 'Por favor ingrese el correo', trigger: 'blur' },
                {
                  type: 'email',
                  message: 'Por favor ingrese un correo válido',
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <el-input v-model="email" placeholder="Correo" :disabled="loading" />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="password"
                size="large"
                type="password"
                autocomplete="off"
                placeholder="Contraseña"
                :disabled="loading"
              />
            </el-form-item>
            <el-form-item>
              <el-radio value="Sponsor">Mantener sesión</el-radio>
            </el-form-item>
            <el-form-item>
              <el-row style="width: 100%" justify="center" align="middle">
                <el-col class="text-center">
                  <el-button
                    style="width: 100%"
                    color="#7451B0"
                    type="success"
                    :loading="loading"
                    :disabled="!isValidForm"
                    @click="registerForm"
                  >
                    Registrarme
                  </el-button>
                </el-col>
                <el-col class="text-center mt-2">
                  <el-button style="width: 100%" color="#7451B0" type="success" plain>
                    Iniciar sesión
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div v-if="errorMessage" style="color: red; text-align: center; margin-top: 10px">
            {{ errorMessage }}
          </div>
        </el-card> -->
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'

import logo from '@/assets/logoSauko.png'
import foto from '@/assets/fotoLogin.jpg'

// Reactive variables
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

//Variables de registro
const name = ref('')
const last_name = ref('')
const phone_number = ref('')
const swLogin = ref(false)

// Computed to check if the form is valid
const isValidForm = computed(() => {
  return email.value !== '' && password.value !== ''
})

// Method to handle form submission
const loginForm = async () => {
  if (!isValidForm.value) return

  loading.value = true
  errorMessage.value = '' // Clear previous errors

  try {
    const response = await axios.post(
      'http://localhost:3001/usuarios/login',
      {
        email: email.value,
        password: password.value,
      },
      {
        headers: {
          'Content-Type': 'application/json', // This header ensures the body is sent as JSON
        },
      }
    )

    console.log('Login exitoso', response.data)
    // You can redirect the user here after a successful login, e.g., using Vue Router
  } catch (error) {
    console.error('Hubo un error:', error)
    errorMessage.value = 'Hubo un error al intentar iniciar sesión. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}

const submitForm = async () => {
  if (!isValidForm.value) return

  loading.value = true
  errorMessage.value = '' // Clear previous errors

  try {
    const response = await axios.post(
      'http://localhost:3001/usuarios/login',
      {
        email: email.value,
        password: password.value,
      },
      {
        headers: {
          'Content-Type': 'application/json', // This header ensures the body is sent as JSON
        },
      }
    )

    console.log('Login exitoso', response.data)
    // You can redirect the user here after a successful login, e.g., using Vue Router
  } catch (error) {
    console.error('Hubo un error:', error)
    errorMessage.value = 'Hubo un error al intentar iniciar sesión. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.demo-image .block {
  padding: 0;
  text-align: center;
  width: 100%;
  height: 100vh;
}

.demo-image .block:last-child {
  border-right: none;
}

.demo-image .demonstration {
  display: block;
}
</style>
