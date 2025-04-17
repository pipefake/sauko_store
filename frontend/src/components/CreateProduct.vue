<template>
  <div class="grid-content ep-bg-purple">
    <el-button type="primary" :icon="CirclePlusFilled" @click="handleOpenModal"
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
      ref="ruleFormRef"
      :rules="rules"
      :model="formProduct"
      enctype="multipart/form-data"
      label-position="top"
      class="demo-form-inline"
    >
      <el-row>
        <el-col :span="12" :xs="24">
          <el-form-item prop="nombre" label="Nombre">
            <el-input
              show-word-limit
              maxlength="15"
              v-model="formProduct.nombre"
              placeholder="Nombre"
              clearable
            />
          </el-form-item>

          <el-form-item prop="marca" label="Marca">
            <el-input
              show-word-limit
              maxlength="15"
              v-model="formProduct.marca"
              placeholder="Marca"
              clearable
            />
          </el-form-item>

          <el-form-item prop="precio" label="Precio">
            <el-input
              show-word-limit
              maxlength="10"
              v-model="formProduct.precio"
              placeholder="Precio"
              :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
              clearable
            />
          </el-form-item>

          <el-form-item label="Categoría">
            <el-select
              v-model="stateCategoria.nombre"
              clearable
              placeholder="Seleccione una categoría"
              class="inline-input w-50"
            >
              <el-option
                v-for="item in categorias"
                :key="item.value"
                :label="item.nombre"
                :value="item.value"
                @click="handleSelect(item)"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="descripcion" label="Descripción">
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
import axiosInstance from '../helpers/AxiosInstance'
import { ElMessage } from 'element-plus'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
//REFERENCIAS
const dialogVisible = ref(false)
const categorias = ref<CategoriaInterface[]>([])
const ruleFormRef = ref<FormInstance>()
const emit = defineEmits<{
  (e: 'updateFiltro'): void
}>()
// Definición del formulario reactivo para el producto
const formProduct = reactive({
  nombre: '',
  descripcion: '',
  marca: '',
  precio: 0,
  image: File,
  categorias: 0,
})
const stateCategoria = ref<CategoriaInterface>({
  value: 0,
  nombre: '',
})
interface CategoriaInterface {
  value: number
  nombre: string
}
interface RuleForm {
  nombre: string
  descripcion: string
  marca: string
  precio: number
  categorias: number
}

const ruleForm = reactive<RuleForm>({
  nombre: '',
  descripcion: '',
  marca: '',
  precio: NaN,
  categorias: 0,
})

const rules = reactive<FormRules<RuleForm>>({
  nombre: [{ required: true, message: 'Por favor ingrese el nombre', trigger: 'blur' }],
  descripcion: [{ required: true, message: 'Por favor ingrese una descripción', trigger: 'blur' }],
  marca: [{ required: true, message: 'Por favor ingrese la marca', trigger: 'blur' }],
  precio: [{ required: true, message: 'Por favor ingrese el precio', trigger: 'blur' }],
  categorias: [{ required: true, message: 'Por favor ingrese la categoría', trigger: 'blur' }],
})

//MÉTODOS

// Método para añadir una nueva categoría
// const addCategoria = () => {
//   if (newCategoria.value.value) {
//     formProduct.categorias = newCategoria.value.value
//   }
// }

// Evento cuando se cierra el modal
const handleClose = () => {
  // Aquí puedes hacer otras cosas si es necesario cuando se cierra el diálogo
  formProduct.nombre = ''
  formProduct.descripcion = ''
  formProduct.marca = ''
  formProduct.precio = 0
  formProduct.categorias = 0
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
  formData.append('categorias', stateCategoria.value.value.toString())

  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      axiosInstance
        .post('/producto', formData)
        .then((response) => {
          console.log('Producto creado con éxito:', response.data)
          ElMessage.success('Producto creado con éxito')
          dialogVisible.value = false
          stateCategoria.value.nombre = ''
          stateCategoria.value.value = 0
          emitValor()
        })
        .catch((error) => {
          console.error('Error al crear el producto:', error)
          ElMessage.error('Error al crear el producto')
        })
    } else {
      console.log('Validación fallida', valid)
      ElMessage.error('Por favor complete todos los campos requeridos')
    }
  })

  // limpiarFormulario() // Limpiar el formulario después de crear el producto

  emit('update:dialogVisible', false) // Cerrar el diálogo
}
const emitValor = () => {
  emit('updateFiltro')
}
const handleSelect = (item: { value: number; nombre: string }) => {
  stateCategoria.value.nombre = item.nombre
  stateCategoria.value.value = item.value
  formProduct.categorias = item.value
  console.log('Categoría seleccionada:', formProduct.categorias)
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
const handleOpenModal = () => {
  consultarCategorias()
  dialogVisible.value = true // Abrir el diálogo
  formProduct.nombre = ''
  formProduct.descripcion = ''
  formProduct.marca = ''
  formProduct.precio = 0
  formProduct.categorias = [] // Limpiar las categorías al abrir el modal
}

const consultarCategorias = async () => {
  try {
    await axiosInstance.get('/categorias').then((response) => {
      console.log('categorias:', response.data)

      categorias.value = response.data.map((item: any) => ({
        value: item.id_categoria,
        nombre: item.nombre,
      }))
    })
  } catch (error) {
    console.error('Error al cargar categorias:', error)
    ElMessage.error('Las categorías no se han podido cargar')
    categorias.value = [
      { value: 1, nombre: 'Aseo' },
      { value: 2, nombre: 'ddd' },
      { value: 3, nombre: 'Mecato' },
    ]
  }
}

const limpiarFormulario = () => {
  formProduct.nombre = ''
  formProduct.descripcion = ''
  formProduct.marca = ''
  formProduct.precio = 0
  formProduct.categorias = 0
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
  