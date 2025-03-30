<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <el-row>
    <el-col :span="12">
      <div class="grid-content ep-bg-purple" />
      <h1>hola</h1>
    </el-col>
    <el-col :span="12">
      <div class="grid-content ep-bg-purple-light" />
      <h2>comoesta</h2>
    </el-col>
  </el-row>
</template>
