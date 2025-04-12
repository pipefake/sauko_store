<template>
  <div class="app common-layout">
    <el-container>
      <el-container>
        <el-header height="20%" class="headerContainer">
          <el-row padding="0" justify="space-between" align="middle">
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
                <el-input v-model="search" style="width: 400px" placeholder="Escribe algo">
                  <template #prefix>
                    <el-icon class="el-input__icon"><search /></el-icon>
                  </template>
                </el-input>
              </div>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-col style="height: 100%" justify="end">
                <el-col>
                  <div class="grid-content ep-bg-purple">
                    <el-button @click="salir">
                      <el-icon><SwitchButton /></el-icon>
                    </el-button>

                    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
                    <el-radio-button :value="false">expand</el-radio-button>
                    <el-radio-button :value="true">collapse</el-radio-button>
                  </el-radio-group> -->
                    <!-- <AdvancedImage :cldImg="myImg" /> -->
                  </div>
                </el-col>
              </el-col>
            </el-col>
          </el-row>
        </el-header>
        <el-container height="80%">
          <el-aside width="200px">
            <el-scrollbar>
                <el-menu
                :collapse="isCollapse"
                style="background-color: white; height: '100vh'"
                :default-openeds="['2', '3']"
              >
                <el-sub-menu index="2">
                  <template #title>
                    <el-icon><icon-menu /></el-icon>Navegador
                  </template>
                  <el-menu-item-group>
                    <template #title>Grupo 1</template>
                    <el-menu-item index="2-1">Opción 1</el-menu-item>
                    <el-menu-item index="2-2">Opción 2</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="Grupo 2">
                    <el-menu-item index="2-3">Opción 3</el-menu-item>
                  </el-menu-item-group>
                  <el-sub-menu index="2-4">
                    <template #title>Opción 4</template>
                    <el-menu-item index="2-4-1">Opción 4-1</el-menu-item>
                  </el-sub-menu>
                </el-sub-menu>
              </el-menu>
            </el-scrollbar>
          </el-aside>
          <el-container style="overflow-y: auto; max-height: calc(90vh - 20px); padding: 10px">
            <el-row gutter="20" justify="start" align="start" wrap style="row-gap: 20px">
              <el-col
                v-for="item of filterTableData"
                :key="item.id_producto"
                :xs="24"
                :sm="12"
                :md="4"
                :lg="4"
              >
                <el-card class="radius" :style="{ borderRadius: '12px' }">
                  <el-image fit="contain" :src="item.image" style="width: 100%; height: 150px" />
                  <el-text size="large" tag="b">{{ item.nombre }}</el-text>
                  <el-text size="small" tag="p">{{
                    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                      item.precio
                    )
                  }}</el-text>
                  <el-text size="small" tag="p">{{ item.descripcion }}</el-text>
                  <el-button type="primary">+ Agregar Producto</el-button>
                </el-card>
              </el-col>
            </el-row>
          </el-container>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
  <script setup lang="ts">
import axiosInstance from '../helpers/axiosInstance'
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
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
  SwitchButton,
  Setting,
  Location,
} from '@element-plus/icons-vue'
const isCollapse = ref(false)
const authStore = useAuthStore()
interface productInterface {
  nombre: string
  descripcion: string
  marca: string
  precio: string
  image: string
  categorias: [string]
}

const filterTableData = computed(() =>
  tableData.value.filter(
    (data) => !search.value || data.nombre.toLowerCase().includes(search.value.toLowerCase())
  )
)
const salir = () => {
  authStore.logOut(router)
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
</script>
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
  