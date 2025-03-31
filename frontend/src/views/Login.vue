
<template>
  <el-row class="imageContainer" :span="24" justify="center" align="middle">
    <el-image
      style="width: 100%; height: 100vh; object-fit: cover; margin: 0"
      :src="foto"
      fit="cover"
    />
  </el-row>
  <el-row class="formContainer" :span="24" justify="center" align="middle">
    <el-card style="min-width: 300px; max-width: 480px" shadow="hover">
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
      <el-form
        class="radius"
        label-position="top"
        label-width="auto"
        :model="ruleForm"
        :size="formSize"
        :rules="rules"
        ref="formRef"
      >
        <!-- Nombre -->
        <el-form-item v-if="swLogin" prop="name">
          <el-input
            v-model="ruleForm.name"
            size="large"
            type="name"
            autocomplete="off"
            placeholder="Nombre"
          />
        </el-form-item>
        <!-- Apellido -->
        <el-form-item v-if="swLogin" prop="last_name">
          <el-input
            v-model="ruleForm.last_name"
            size="large"
            type="last_name"
            autocomplete="off"
            placeholder="Apellido"
          />
        </el-form-item>
        <!-- Celular -->
        <el-form-item v-if="swLogin" prop="phone_number">
          <el-input
            v-model="ruleForm.phone_number"
            size="large"
            type="phone_number"
            autocomplete="off"
            placeholder="Celular"
          />
        </el-form-item>
        <!-- Correo -->
        <el-form-item size="large" prop="email">
          <el-input v-model="ruleForm.email" placeholder="Correo" :disabled="loading" />
        </el-form-item>
        <!-- Contraseña -->
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            size="large"
            type="password"
            autocomplete="off"
            placeholder="Contraseña"
            :disabled="loading"
          />
        </el-form-item>
        <!-- Toggle -->
        <el-form-item>
          <el-radio value="Sponsor">Mantener sesión</el-radio>
        </el-form-item>
        <!-- Botones Login -->
        <el-form-item v-if="!swLogin">
          <el-row style="width: 100%" justify="center" align="middle">
            <el-col class="text-center">
              <el-button
                style="width: 100%"
                color="#7451B0"
                type="success"
                :loading="loading"
                @click="loginForm(formRef)"
              >
                Iniciar sesión
              </el-button>
            </el-col>
            <el-col class="text-center mt-2">
              <el-button
                @click="resetForm(formRef)"
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
        <!-- Botones Register -->
        <el-form-item v-else>
          <el-row style="width: 100%" justify="center" align="middle">
            <el-col class="text-center">
              <el-button
                style="width: 100%"
                color="#7451B0"
                type="success"
                :loading="loading"
                @click="registerForm(formRef)"
              >
                Registrarse
              </el-button>
            </el-col>
            <el-col class="text-center mt-2">
              <el-button
                @click="resetForm(formRef)"
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
  </el-row>
</template>
<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

import logo from '@/assets/logoSauko.png'
import foto from '@/assets/fotoLogin.jpg'

interface RuleForm {
  name: string
  last_name: string
  phone_number: string
  email: string
  password: string
}

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: '',
  last_name: '',
  phone_number: '',
  email: '',
  password: '',
})

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  swLogin.value = !swLogin.value
  formEl.resetFields()
}

// Reactive variables
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

// Variables de registro
const name = ref('')
const last_name = ref('')
const phone_number = ref('')
const swLogin = ref(false)

// Router instance
const router = useRouter()

// Form validation rules
const rules: FormRules<RuleForm> = reactive({
  name: [{ required: true, message: 'Por favor ingresa tu nombre', trigger: 'blur' }],
  last_name: [{ required: true, message: 'Por favor ingresa tu apellido', trigger: 'blur' }],
  phone_number: [
    { required: true, message: 'Por favor ingresa tu número de celular', trigger: 'blur' },
    {
      pattern: /^[0-9]{10}$/,
      message: 'El número de celular debe tener 10 dígitos',
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: 'Por favor ingresa tu correo electrónico', trigger: 'blur' },
    { type: 'email', message: 'El correo electrónico no es válido', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Por favor ingresa tu contraseña', trigger: 'blur' },
    { min: 6, message: 'La contraseña debe tener al menos 6 caracteres', trigger: 'blur' },
  ],
})
const formRef = ref(null)

// Verificar si los campos están bien diligenciados

// Toggle between login and register forms
const swForm = () => {
  name.value = ''
  last_name.value = ''
  phone_number.value = ''
  email.value = ''
  password.value = ''
}

// Method to handle login form submission
const loginForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  try {
    // Validate form asynchronously
    const valid = await formEl.validate()

    if (valid) {
      loading.value = true
      errorMessage.value = ''
      try {
        const response = await axios.post(
          'http://localhost:3001/usuarios/login',
          {
            email: ruleForm.email,
            password: ruleForm.password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        localStorage.setItem('token', response.data.token)
        router.push('/store')

        console.log('Login exitoso', response.data)
      } catch (error) {
        console.error('Hubo un error:', error)
        errorMessage.value = 'Hubo un error al intentar iniciar sesión. Intenta nuevamente.'
      } finally {
        loading.value = false
      }
    } else {
      console.log('error submit!')
      loading.value = false
    }
  } catch (error) {
    console.error('Validation failed', error)
    loading.value = false
  }
}

// Method to handle register form submission
const registerForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  try {
    // Validate form asynchronously
    const valid = await formEl.validate()

    if (valid) {
      loading.value = true
      errorMessage.value = ''
      try {
        const response = await axios.post(
          'http://localhost:3001/usuarios',
          {
            name: ruleForm.name,
            last_name: ruleForm.last_name,
            cedula: '1192804870',
            phone_number: ruleForm.phone_number,
            email: ruleForm.email,
            password: ruleForm.password,
            id_rol: '1',
            image: 'image.png',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        console.log('Register exitoso', response.data)
        // Redirect or other action after successful registration
      } catch (error) {
        console.error('Hubo un error:', error)
        errorMessage.value = 'Hubo un error al intentar iniciar sesión. Intenta nuevamente.'
      } finally {
        loading.value = false
      }
    } else {
      console.log('error submit!')
      loading.value = false
    }
  } catch (error) {
    console.error('Validation failed', error)
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
@media (max-width: 768px) {
  .imageContainer {
    z-index: 0;
    position: fixed;
  }
  .formContainer {
    z-index: 1;
    height: 100vh;
  }
}
</style>
