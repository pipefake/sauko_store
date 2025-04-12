<template>
  <div class="grid-content ep-bg-purple">
    <el-button type="primary" :icon="CirclePlusFilled" @click="dialogVisible = true"
      >Agregar Producto</el-button
    >
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="Rellene el formulario para crear producto"
    width="600"
    :before-close="handleClose"
    justify-content="center"
  >
    <el-form
      :inline="true"
      :model="formProduct"
      enctype="multipart/form-data"
      label-position="top"
      class="demo-form-inline"
    >
      <el-row>
        <el-col :span="12" :xs="24">
          <el-form-item label="Nombre">
            <el-input v-model="formProduct.nombre" placeholder="Nombre" clearable />
          </el-form-item>

          <el-form-item label="Marca">
            <el-input v-model="formProduct.marca" placeholder="Marca" clearable />
          </el-form-item>

          <el-form-item label="Precio">
            <el-input
              v-model="formProduct.precio"
              placeholder="Precio"
              :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
              clearable
            />
          </el-form-item>

          <el-form-item label="Categoría">
            <el-input v-model="newCategoria" placeholder="Categoría" clearable />
            <el-button @click="addCategoria" type="primary" size="small"
              >Añadir categoría</el-button
            >
            <div v-if="formProduct.categorias.length">
              <el-tag
                v-for="(categoria, index) in formProduct.categorias"
                :key="index"
                closable
                @close="removeCategoria(index)"
              >
                {{ categoria }}
              </el-tag>
            </div>
          </el-form-item>

          <el-form-item label="Descripción">
            <el-input v-model="formProduct.descripcion" placeholder="Descripción" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="12" :xs="24">
          <el-form-item label="Subir fotos">
            <el-upload
              class="upload-demo"
              drag
              :on-change="handleFileChange"
              :before-upload="beforeUpload"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">Suelta el archivo aquí o <em>clic para subir</em></div>
              <template #tip>
                <div class="el-upload__tip">jpg/png archivos con tamaño mejor a 500kb</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="handleCreateProduct">Crear Producto</el-button>
      </div>
    </template>
  </el-dialog>
</template>
  
<script setup lang="ts">
//IMPORTS
import { ref, reactive, toRefs } from 'vue'
import { UploadFilled, CirclePlusFilled } from '@element-plus/icons-vue'
import axiosInstance from '../helpers/axiosInstance'

//PROPS
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number,
})

//REFERENCIAS
const dialogVisible = ref(false)
const newCategoria = ref('') // Variable reactiva para nueva categoría

// Definición del formulario reactivo para el producto
const formProduct = reactive({
  nombre: '',
  descripcion: '',
  marca: '',
  precio: 0,
  image: '',
  categorias: [] as string[], // Categorías como array de strings
})

const emit = defineEmits(['update:dialogVisible'])

//MÉTODOS

// Método para añadir una nueva categoría
const addCategoria = () => {
  if (newCategoria.value.trim()) {
    formProduct.categorias.push(newCategoria.value.trim())
    newCategoria.value = '' // Limpiar el campo
  }
}

// Método para eliminar categoría
const removeCategoria = (index: number) => {
  formProduct.categorias.splice(index, 1)
}

// Evento cuando se cierra el modal
const handleClose = () => {
  // Aquí puedes hacer otras cosas si es necesario cuando se cierra el diálogo
  formProduct.nombre = ''
  formProduct.descripcion = ''
  formProduct.marca = ''
  formProduct.precio = 0
  formProduct.categorias = []
  emit('update:dialogVisible', false) // Cambiar el estado del diálogo al padre
}
// Manejo de la creación del producto
const handleCreateProduct = () => {
  const formData = new FormData()
  formData.append('nombre', formProduct.nombre)
  formData.append('descripcion', formProduct.descripcion)
  formData.append('marca', formProduct.marca)
  formData.append('precio', formProduct.precio.toString())
  formData.append('image', formProduct.image)
  formProduct.categorias.forEach((categoria, index) => {
    formData.append(`categorias[${index}]`, categoria)
  })

  axiosInstance
    .post('/producto', formData)
    .then((response) => {
      console.log('Producto creado con éxito:', response.data)
    })
    .catch((error) => {
      console.error('Error al crear el producto:', error)
    })

  limpiarFormulario() // Limpiar el formulario después de crear el producto

  emit('update:dialogVisible', false) // Cerrar el diálogo
}

// Manejo del cambio de archivo
const handleFileChange = (file) => {
  formProduct.image = file.raw
}

// Validación antes de subir
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt500kb = file.size / 1024 < 500

  if (!isJpgOrPng) {
    ElMessage.error('El archivo debe ser JPG o PNG')
    return false
  }
  if (!isLt500kb) {
    ElMessage.error('El archivo debe ser menor a 500kb')
    return false
  }

  // Aquí guardamos el archivo en el formProduct
  formProduct.image = file
  return false // IMPORTANTE: evitar subida automática
}

const limpiarFormulario = () => {
  formProduct.nombre = ''
  formProduct.descripcion = ''
  formProduct.marca = ''
  formProduct.precio = 0
  formProduct.categorias = []
  dialogVisible.value = false // Cerrar el diálogo
}
</script>
  
  <style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100vw;
  background-color: #f5f5f5;
  color: #333;
  font-size: 14px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.headerContainer {
  background-color: #6c48ba;
  color: #fff;
  padding: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  height: 65px;
  line-height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
  transition: all 0.3s ease;
  background-size: 200% 100%;
  background-position: 100% 0;
}
</style>
  