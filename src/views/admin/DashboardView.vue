<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="stat in stats" :key="stat.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon :size="24"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <span>{{ t('common.welcome') }}</span>
          </template>
          <div class="chart-placeholder">
            <el-icon :size="64" color="#ccc"><TrendCharts /></el-icon>
            <p>{{ t('admin.dashboard') }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>Quick Actions</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" :icon="Plus">New Knowledge Base</el-button>
            <el-button :icon="User">Add User</el-button>
            <el-button :icon="Setting">Configure Model</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TrendCharts, Plus, User, Setting, Document, ChatLineRound, UserFilled, DataBoard } from '@element-plus/icons-vue'

const { t } = useI18n()

const stats = ref([
  { title: 'Total Users', value: 1234, icon: UserFilled, color: '#1677ff' },
  { title: 'Knowledge Bases', value: 56, icon: Document, color: '#52c41a' },
  { title: 'Total Questions', value: 7890, icon: ChatLineRound, color: '#faad14' },
  { title: 'Active Sessions', value: 345, icon: DataBoard, color: '#722ed1' },
])
</script>

<style scoped>
.dashboard-container {
  height: 100%;
}

.stats-row {
  margin-bottom: 1.5rem;
}

.stat-card {
  border-radius: 8px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d2129;
}

.stat-title {
  font-size: 0.875rem;
  color: #4e5969;
  margin-top: 0.25rem;
}

.charts-row {
  height: calc(100% - 150px);
}

.chart-card {
  height: 100%;
  border-radius: 8px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #999;
}

.chart-placeholder p {
  margin-top: 1rem;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quick-actions .el-button {
  width: 100%;
  justify-content: flex-start;
}
</style>