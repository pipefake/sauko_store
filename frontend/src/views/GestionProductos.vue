<script setup lang="ts">
import { AdvancedImage } from '@cloudinary/vue'
import { Cloudinary } from '@cloudinary/url-gen'
import { sepia } from '@cloudinary/url-gen/actions/effect'
import { ref, reactive, computed, onMounted } from 'vue'
import { default as CreateProduct } from '../components/CreateProduct.vue'
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

interface productInterface {
  nombre: string
  descripcion: string
  marca: string
  precio: string
  categorias: [string]
}

const search = ref('')
const tableData = ref([
  {
    id_producto: '2',
    nombre: 'Crema dental',
    descripcion: 'Crema dental para dientes sensibles',
    marca: 'Frotident',
    precio: 40000,
    categorias: 'Aseo',
    id_estado: true,
  },
  // {
  //   id_producto: '1',
  //   nombre: 'Arena para gato',
  //   descripcion: 'Arena para gato de 10kg',
  //   marca: 'ArenaCat',
  //   precio: 40000,
  //   categorias: 'Comida',
  //   id_estado: true,
  // },
  // {
  //   id_producto: '3',
  //   nombre: 'Salchichas',
  //   descripcion: 'Paquete de 10 salchichas',
  //   marca: 'Zenu',
  //   precio: 40000,
  //   categorias: 'Comida',
  //   id_estado: true,
  // },
  // {
  //   id_producto: '4',
  //   nombre: 'Cocacola',
  //   descripcion: 'Cocacola de 2L',
  //   marca: 'Cocacola',
  //   precio: 40000,
  //   categorias: 'Comida',
  //   id_estado: true,
  // },
])
onMounted(() => {
  consultarProductos()
})
const consultarProductos = async () => {
  try {
    const response = await axiosInstance.get('/productos')
    tableData.value = response.data
  } catch (error) {
    console.error('Error al cargar los productos:', error)
    throw error
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

const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
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
          <el-row>
            <el-col :span="6" :xs="24">
              <div class="grid-content ep-bg-purple">
                <el-button @click="isCollapse = !isCollapse">
                  <el-icon><Expand /></el-icon>
                </el-button>

                <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
                  <el-radio-button :value="false">expand</el-radio-button>
                  <el-radio-button :value="true">collapse</el-radio-button>
                </el-radio-group> -->
                <!-- <AdvancedImage :cldImg="myImg" /> -->
              </div>
            </el-col>
            <el-col :span="10" :xs="24">
              <div class="grid-content ep-bg-purple-light">
                <!-- <el-input v-model="input4" style="width: 400px" placeholder="Type something">
                  <template #prefix>
                    <el-icon class="el-input__icon"><search /></el-icon>
                  </template>
                </el-input> -->
              </div>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-row style="height: 100%" justify="end">
                <el-dropdown>
                  <el-button @click="isCollapse = !isCollapse">
                    <el-icon><Setting /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>View</el-dropdown-item>
                      <el-dropdown-item>Add</el-dropdown-item>
                      <el-dropdown-item>Delete</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-row>
            </el-col>
          </el-row>
        </el-header>
        <el-container>
          <el-aside width="200px">
            <el-scrollbar>
              <el-menu
                :collapse="isCollapse"
                style="background-color: white; height: '100vh'"
                :default-openeds="['2', '3']"
              >
                <el-sub-menu index="2">
                  <template #title>
                    <el-icon><icon-menu /></el-icon>Navigator Two
                  </template>
                  <el-menu-item-group>
                    <template #title>Group 1</template>
                    <el-menu-item index="2-1">Option 1</el-menu-item>
                    <el-menu-item index="2-2">Option 2</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="Group 2">
                    <el-menu-item index="2-3">Option 3</el-menu-item>
                  </el-menu-item-group>
                  <el-sub-menu index="2-4">
                    <template #title>Option 4</template>
                    <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
                  </el-sub-menu>
                </el-sub-menu>
              </el-menu>
            </el-scrollbar>
          </el-aside>
          <el-container>
            <el-main>
              <el-card style="width: 80vw" shadow="always">
                <template #header>
                  <el-container>
                    <el-row :gutter="10" style="width: 100%">
                      <el-col :span="12">
                        <CreateProduct />
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content ep-bg-purple">
                          <el-input v-model="search" size="large" placeholder="Type to search" />
                        </div>
                      </el-col>
                    </el-row>
                  </el-container>
                </template>
                <el-table :data="filterTableData" style="width: 100%">
                  <el-table-column prop="nombre" label="Nombre " sortable />
                  <el-table-column prop="descripcion" label="Descripción" />
                  <el-table-column prop="marca" label="Marca" sortable />
                  <el-table-column prop="precio" label="Precio" sortable>
                    <template #default="scope">
                      ${{ scope.row.precio.toLocaleString('es-CO') }}
                    </template>
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
                        active-text="Y"
                        inactive-text="N"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="Operations">
                    <template #default="scope">
                      <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                        <el-icon><EditPen /></el-icon>
                      </el-button>
                      <el-popconfirm
                        class="box-item"
                        title="Bottom Right prompts info"
                        placement="bottom-end"
                          @confirm="handleDelete(scope.row.id_producto)"
                      >
                        <template #reference>
                          <el-button
                            size="small"
                            type="danger"
                          
                          >
                            <el-icon><DeleteFilled /></el-icon>
                          </el-button>
                        </template>
                      </el-popconfirm>
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