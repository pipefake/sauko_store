<template>
  <div class="grid-content ep-bg-purple">
    <el-button size="small" @click="handleEditProduct">
      <el-icon><EditPen /></el-icon>
    </el-button>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="Rellene el formulario para actualizar producto"
    style="min-width: 250px; max-width: 40vw"
    :before-close="handleClose"
    justify-content="center"
    append-to-body
  >
    <el-form
      :inline="true"
      ref="ruleFormRef"
      :model="product"
      :rules="rules"
      enctype="multipart/form-data"
      label-position="top"
      class="demo-form-inline"
    >
      <el-row>
        <!-- <el-col :span="8" :xs="24">
          
        </el-col> -->
        <el-col :span="12" :xs="24">
          <el-form-item prop="nombre" label="Nombre">
            <el-input
              show-word-limit
              maxlength="15"
              v-model="product.nombre"
              placeholder="Nombre"
              clearable
            />
          </el-form-item>

          <el-form-item prop="marca" label="Marca">
            <el-input
              show-word-limit
              maxlength="15"
              v-model="product.marca"
              placeholder="Marca"
              clearable
            />
          </el-form-item>

          <el-form-item prop="precio" label="Precio">
            <el-input
              show-word-limit
              maxlength="10"
              v-model="product.precio"
              placeholder="Precio"
              :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
              clearable
            />
          </el-form-item>
          <el-form-item prop="categorias" label="Categoría">
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
            <el-input
              show-word-limit
              maxlength="24"
              v-model="product.descripcion"
              placeholder="Descripción"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col :span="12" :xs="24">
          <el-form-item label="Subir foto">
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
          <el-image fit="contain" :src="product.image" style="width: 100px; height: 100px" />
        </el-col>
        <el-alert
          v-if="isError"
          title="El formulario está mal diligenciado"
          type="error"
          show-icon
        />
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="handleUpdateProduct">Actualizar Producto</el-button>
      </div>
    </template>
  </el-dialog>
</template>
    
<script setup lang="ts">
//IMPORTS
import { ref, reactive, toRefs, onMounted } from 'vue'
import { UploadFilled, CirclePlusFilled, EditPen } from '@element-plus/icons-vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import axiosInstance from '../helpers/AxiosInstance'
import { ElMessage } from 'element-plus'
//PROPS
const props = defineProps<{
  productProps: Product
}>()

//INTERFACES

interface Product {
  nombre: string
  descripcion: string
  marca: string
  precio: number
  categorias: string
  id_estado: boolean
  id_producto: number
  image: string
}

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

//REFERENCIAS
const stateCategoria = ref<CategoriaInterface>({
  value: 0,
  nombre: '',
})
const product = ref<Product>(props.productProps) // Referencia al producto
const image = ref<File>() // Referencia a la imagen
const dialogVisible = ref(false)
const isError = ref(false)
const categorias = ref<CategoriaInterface[]>([])
const newCategoria = ref('') // Variable reactiva para nueva categoría
const emit = defineEmits<{
  (e: 'updateFiltro'): void
}>()

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  nombre: '',
  descripcion: '',
  marca: '',
  precio: 0,
  categorias: 0,
})

const rules = reactive<FormRules<RuleForm>>({
  nombre: [{ required: true, message: 'Por favor ingrese el nombre', trigger: 'blur' }],
  descripcion: [{ required: true, message: 'Por favor ingrese una descripción', trigger: 'blur' }],
  marca: [{ required: true, message: 'Por favor ingrese la marca', trigger: 'blur' }],
  precio: [{ required: true, message: 'Por favor ingrese el precio', trigger: 'blur' }],
  categorias: [{ required: true, message: 'Por favor ingrese la categoría', trigger: 'blur' }],
})
// Definición del formulario reactivo para el producto

// const emit = defineEmits(['actualizarData'])

//MÉTODOS

const emitValor = () => {
  emit('updateFiltro')
}

// Evento cuando se cierra el modal
const handleClose = () => {
  dialogVisible.value = false
}

const handleEditProduct = async () => {
  await consultarCategorias()
  // Abrir el diálogo
  dialogVisible.value = true
  //Buscar la categoría que viene desde las props
  const selectedCategoria = categorias.value.find(
    (item) => item.nombre === product.value.categorias
  )
  // Objeto categoría para el autocompletar
  if (selectedCategoria) {
    stateCategoria.value = { ...selectedCategoria } // Asignar solo el valor a stateCategoria
    console.log('Categoría seleccionada:', stateCategoria.value) // Mostrar el nombre en el input
  }
  product.value = { ...props.productProps } // Asignar el producto a editar al formulario
}
// Manejo de la creación del producto
const handleUpdateProduct = () => {
  const formData = new FormData()
  formData.append('nombre', product.value.nombre)
  formData.append('descripcion', product.value.descripcion)
  formData.append('marca', product.value.marca)
  formData.append('precio', product.value.precio.toString())
  if (image.value) {
    formData.append('image', image.value)
  }
  formData.append('categorias', stateCategoria.value.value.toString())
  formData.append('id_producto', product.value.id_producto.toString())

  // console.log(ruleFormRef.value)

  ruleFormRef.value?.validate((valid) => {
    if (valid && stateCategoria.value.nombre) {
      axiosInstance
        .post('/actualizarproducto', formData)
        .then((response) => {
          ElMessage({
            message: 'Producto actualizado con éxito.',
            type: 'success',
          })
          dialogVisible.value = false
          emitValor()
          console.log('Producto actualizado con éxito:', response.data)
        })
        .catch((error) => {
          isError.value = true
          console.error('Error al actualizar el producto:', error)
        })
    } else {
      isError.value = true
      console.log('Validación fallida')
    }
  })

  // limpiarFormulario() // Limpiar el formulario después de crear el producto
}

// Manejo del cambio de archivo
const handleFileChange = (file: File) => {
  image.value = file.raw
}

// const categorias = ref<CategoriaProducto[]>([])
const querySearch = (queryString: string, cb: any) => {
  // console.log('queryString', queryString)
  // console.log('categorias', categorias.value)
  const results = queryString
    ? categorias.value.filter((categoria) => {
        return categoria.nombre.toLowerCase().indexOf(queryString.toLowerCase()) > -1
      })
    : categorias.value
  console.log('categorias.value:', categorias.value)
  cb(results)
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
    categorias.value = [
      { value: 1, nombre: 'Aseo' },
      { value: 2, nombre: 'ddd' },
      { value: 3, nombre: 'Mecato' },
    ]
  }
}

const handleSelect = (item: { value: number; nombre: string }) => {
  stateCategoria.value.nombre = item.nombre
  stateCategoria.value.value = item.value
  console.log('Categoría seleccionada:', product.value.categorias)
}

onMounted(() => {})

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

  // Aquí guardamos el archivo en el product
  image.value = file
  return false // IMPORTANTE: evitar subida automática
}

const limpiarFormulario = () => {
  product.value.nombre = ''
  product.value.descripcion = ''
  product.value.marca = ''
  product.value.precio = 0
  product.value.categorias = 0
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
    