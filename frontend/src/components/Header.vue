<template>
  <el-row>
    <el-col :span="7" :xs="24">
      <div class="grid-content ep-bg-purple">
        <el-button background="#6c48ba" size="small" @click="isCollapse = !isCollapse">
          <el-icon @click="isCollapse = !isCollapse"><Expand /></el-icon>
        </el-button>
        <!-- <AdvancedImage style="width: 200px;" :cldImg="myImg" /> -->
      </div>
    </el-col>
    <el-col :span="10" :xs="24" justify="center">
      <div v-if="isBuscador" class="grid-content ep-bg-purple-light">
        <el-input
          @input="emitValor"
          v-model="search"
          x
          style="width: 100%; background-color: #6c48ba"
          placeholder="Escribe para buscar"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </el-col>
    <el-col :span="7" :xs="24" justify="end">
      <div class="grid-content ep-bg-purple">
        <router-link to="/login" class="btn-login"> Ir al Login </router-link>

        <!-- <Carrito /> -->
        <!-- <el-button @click="salir()" background="#6c48ba" size="small">
          <el-icon><Expand /></el-icon>
        </el-button> -->

        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
                  <el-radio-button :value="false">expand</el-radio-button>
                  <el-radio-button :value="true">collapse</el-radio-button>
                </el-radio-group> -->
        <!-- <AdvancedImage :cldImg="myImg" /> -->
      </div>
      <!-- <el-row style="height: 100%" justify="end">
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
              </el-row> -->
    </el-col>
  </el-row>
</template>
<script setup lang="ts" name="Header">
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
import { ref, defineProps, defineEmits, computed } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'
import { useRoute, useRouter } from 'vue-router'
import { AdvancedImage } from '@cloudinary/vue'
import { Cloudinary } from '@cloudinary/url-gen'
// import { Carrito } from './Carrito.vue'

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
  isBuscador: {
    type: Boolean,
    default: false,
  },
})

const salir = () => {
  authStore.logOut(router)
}
const cld = new Cloudinary({
  cloud: {
    cloudName: 'demo',
  },
})
const myImg = cld.image('docs/models')
const isCollapse = ref(false)
const search = ref('')
const emit = defineEmits<{
  (e: 'updateFiltro', valor: string): void
}>()
const emitValor = () => {
  emit('updateFiltro', search.value)
}
</script>