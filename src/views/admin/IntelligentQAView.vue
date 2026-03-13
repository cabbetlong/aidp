<template>
  <div class="intelligent-qa-container">
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('admin.intelligentQA') }}</span>
          <el-button type="primary" :icon="Plus">{{ t('common.add') }}</el-button>
        </div>
      </template>

      <el-empty description="智能问数功能待实现" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'

const { t } = useI18n()
</script>

<style scoped>
.intelligent-qa-container {
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