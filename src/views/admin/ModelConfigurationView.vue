<template>
  <div class="model-configuration-container">
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('admin.modelConfiguration') }}</span>
          <el-button type="primary" :icon="Plus">{{ t('common.add') }}</el-button>
        </div>
      </template>

      <el-empty description="模型配置功能待实现" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'

const { t } = useI18n()
</script>

<style scoped>
.model-configuration-container {
  height: 100%;
}

.content-card {
  height: 100%;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>