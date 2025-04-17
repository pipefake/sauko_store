<template>
  <el-button type="primary" style="margin-left: 16px" @click="drawer = true"> open </el-button>

  <el-drawer open-delay="500" direction="btt" v-model="drawer" title="I am the title" size="50%">
    <span>Hi there!</span>
  </el-drawer>
</template>

<script lang="ts" setup name="Carrito">
// import { useCarritoStore } from '@/stores/carritoStore'
import { ref } from 'vue'
const drawer = ref(false)
</script>