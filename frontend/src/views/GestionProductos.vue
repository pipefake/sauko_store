<script setup lang="ts">
//IMPORTS
import { AdvancedImage } from '@cloudinary/vue'
import { Cloudinary } from '@cloudinary/url-gen'
import { sepia } from '@cloudinary/url-gen/actions/effect'
import { ref, reactive, computed, onMounted } from 'vue'
import { default as CreateProduct } from '../components/CreateProduct.vue'
import { default as EditProduct } from '../components/EditProduct.vue'
import { default as Header } from '../components/Header.vue'
import 'axios'
import axiosInstance from '../helpers/axiosInstance'
import {
  Calendar,
  Search,
  UploadFilled,
  CirclePlusFilled,
  Expand,
  DeleteFilled,
  Document,
  EditPen,
  Menu as IconMenu,
  Message,
  Setting,
  Location,
} from '@element-plus/icons-vue'
import axios from 'axios'
import { columns } from 'element-plus/es/components/table-v2/src/common.mjs'
import { ElMessage } from 'element-plus'

//INTERRFACES
interface productInterface {
  nombre: string
  descripcion: string
  marca: string
  precio: number
  categorias: [string]
  id_estado: boolean
  id_producto: number
  image: string
}

//REFERENCIAS
const search = ref('')
const tableData = ref<productInterface[]>([])

onMounted(() => {
  consultarProductos()
})

const consultarProductos = async () => {
  try {
    const response = await axiosInstance.get('/productos_admin')
    tableData.value = response.data
  } catch (error) {
    console.error('Error al cargar los productos:', error)
    throw error
  }
}

const actualizarProducto = async (id_producto: number) => {
  try {
    const response = await axiosInstance.put('/producto/' + id_producto)
    if (response.status === 200) {
      // console.log('Producto actualizado con éxito')
      ElMessage({
        message: 'Producto actualizado con éxito.',
        type: 'success',
      })
      consultarProductos()
    } else {
      console.error('Error al actualizar el producto:', response)
      ElMessage.error('Hubo un error al actualizar el producto.')
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error)
  }
}

const filterTableData = computed(() =>
  tableData.value.filter(
    (data) => !search.value || data.nombre.toLowerCase().includes(search.value.toLowerCase())
  )
)
// Create a Cloudinary instance and set your cloud name.
const cld = new Cloudinary({
  cloud: {
    cloudName: 'demo',
  },
})
const isCollapse = ref(false)
// Instantiate a CloudinaryImage object for the image with the public ID, 'front_face'.
const myImg = cld.image('front_face')

// Apply a sepia effect.
myImg.effect(sepia())

const handleDelete = async (id_producto: number) => {
  try {
    const response = await axiosInstance.delete('/producto/' + id_producto)

    if (response.status === 200) {
      consultarProductos()
      ElMessage({
        message: 'Producto eliminado con éxito.',
        type: 'success',
      })
    } else {
      console.error('Error al eliminar el producto:', response)
      ElMessage.error('Hubo un error al eliminar el product.')
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error)
  }
}

const handleCreateProduct = (product: productInterface) => {
  console.log(product)
}

const formProduct = reactive({
  nombre: '',
  descripcion: '',
  marca: '',
  precio: 0,
  categoria: '',
  categorias: [],
})

const filterTag = (value: string, row: User) => {
  return row.tag === value
}
const onSubmit = () => {
  console.log('submit!')
}
</script>
<template>
  <div class="app common-layout">
    <el-container>
      <el-container>
        <el-header class="headerContainer">
          <Header :isBuscador="false" />
        </el-header>

        <el-container>
          <el-container>
            <el-main
              style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
              "
            >
              <el-card style="width: 80vw" shadow="always">
                <template #header>
                  <el-container>
                    <el-row :gutter="10" style="width: 100%">
                      <el-col :span="12">
                        <CreateProduct @updateFiltro="consultarProductos" />
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content ep-bg-purple">
                          <el-input
                            v-model="search"
                            size="large"
                            placeholder="Escribe para buscar"
                          />
                        </div>
                      </el-col>
                    </el-row>
                  </el-container>
                </template>

                <el-table :data="filterTableData" style="width: 100%" height="400">
                  <el-table-column prop="nombre" label="Nombre " sortable />
                  <el-table-column prop="descripcion" label="Descripción" />
                  <el-table-column prop="marca" label="Marca" sortable />
                  <el-table-column
                    prop="precio"
                    label="Precio"
                    :sortable="true"
                    :sort-method="(a, b) => a.precio - b.precio"
                  >
                    <template #default="scope"> ${{ scope.row.precio }} </template>
                  </el-table-column>
                  <el-table-column
                    prop="categorias"
                    label="Categoria"
                    :filters="[
                      { text: 'Home', value: 'Home' },
                      { text: 'Comida', value: 'Comida' },
                    ]"
                    :filter-method="filterTag"
                    filter-placement="bottom-end"
                  >
                    <template #default="scope">
                      <el-tag
                        :type="scope.row.categorias === 'Aseo' ? 'primary' : 'success'"
                        disable-transitions
                        >{{ scope.row.categorias }}</el-tag
                      >
                    </template>
                  </el-table-column>
                  <el-table-column prop="id_estado" label="Estado" el-table-column sortable>
                    <template #default="scope">
                      <el-switch
                        v-model="scope.row.id_estado"
                        class="ml-2"
                        inline-prompt
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                        @change="actualizarProducto(scope.row.id_producto)"
                        active-text="Y"
                        inactive-text="N"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="Operations">
                    <template #default="scope">
                      <el-row>
                        <EditProduct @updateFiltro="consultarProductos" :productProps="scope.row" />
                        <el-popconfirm
                          class="box-item"
                          title="¿Estás seguro de que quieres eliminar este producto?"
                          placement="bottom"
                          @confirm="handleDelete(scope.row.id_producto)"
                        >
                          <template #reference>
                            <el-button size="small" type="danger">
                              <el-icon><DeleteFilled /></el-icon>
                            </el-button>
                          </template>
                        </el-popconfirm>
                      </el-row>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-main>
          </el-container>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<style>
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
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.headerContainer {
  background-color: #6c48ba;
  color: #fff;
  padding: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  height: auto;
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