<template>
  <div class="app common-layout">
    <el-container>
      <el-container>
        <el-header height="20%" class="headerContainer">
          <Header :isBuscador="true" @updateFiltro="filtrarLista" />
        </el-header>
        <el-container height="80%">
          <el-container
            justify="center"
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              overflow-y: auto;
              max-height: calc(90vh - 20px);
              padding: 10px;
            "
          >
            <el-row style="width: 90vw; height: 100%" :gutter="20" justify="left" wrap>
              <el-col
                v-for="item of filterTableData"
                :key="item.id_producto"
                :xs="12"
                :sm="6"
                :md="4"
                :lg="4"
                :xl="4"
                style="
                  padding: 1vh;
                  height: 300px;
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  align-items: start;
                  align-content: start;
                  justify-content: flex-start;
                "
              >
                <el-card
                  class="radius grid-content"
                  style="
                    border-radius: 12px;
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    align-content: center;
                    justify-content: center;
                  "
                >
                  <el-row style="padding: 0 4%" :gutter="10">
                    <el-col style="width: 100%" :md="12" :xs="24" :sm="24" :lg="24" :xl="24">
                      <el-image
                        fit="contain"
                        :src="item.image"
                        style="width: 100%; height: 140px"
                      />
                    </el-col>
                    <el-col :md="12" :xs="24" :sm="24" :lg="24" :xl="24">
                      <el-text size="large" tag="b">{{ item.nombre }}</el-text>

                      <el-text size="small" tag="p">{{
                        new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                        }).format(item.precio)
                      }}</el-text>
                      <el-text size="small" tag="p" style="width: 150px" truncated>{{
                        item.descripcion
                      }}</el-text>
                    </el-col>
                    <el-col
                      :md="12"
                      :xs="24"
                      :sm="24"
                      :lg="24"
                      :xl="24"
                      style="text-align: center; padding: 5px"
                    >
                      <el-button
                        type="primary"
                        style="
                          background-color: #6c48ba;
                          width: 100%;
                          padding: 5px 10px;
                          font-size: 0.8rem;
                        "
                      >
                        + Agregar Producto
                      </el-button>
                    </el-col>
                  </el-row>
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
import Header from '../components/Header.vue'
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
  id_producto: string
  nombre: string
  descripcion: string
  marca: string
  precio: number
  image?: string
  categorias: string
  id_estado: boolean
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

const filterTableData = ref<productInterface[]>([])

const filtrarLista = (valor: string) => {
  filterTableData.value = tableData.value.filter((item) =>
    item.nombre.toLowerCase().includes(valor.toLowerCase())
  )
}
const consultarProductos = async () => {
  try {
    const response = await axiosInstance.get('/productos')
    tableData.value = response.data
    filterTableData.value = response.data
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
  