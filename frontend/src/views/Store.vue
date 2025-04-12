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
          <el-container> </el-container>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
const isCollapse = ref(false)
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
