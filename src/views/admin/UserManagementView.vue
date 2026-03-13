<template>
  <div class="user-management-container">
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('user.management') }}</span>
          <el-button type="primary" :icon="Plus" @click="handleAddUser">
            {{ t('user.addUser') }}
          </el-button>
        </div>
      </template>

      <div class="toolbar">
        <el-input
          v-model="searchKeyword"
          :placeholder="t('user.search')"
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
          style="width: 300px"
        />
      </div>

      <el-table
        :data="paginatedUsers"
        v-loading="userStore.loading"
        style="width: 100%"
        :header-cell-style="{ background: '#fafafa', color: '#333' }"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" :label="t('user.username')" min-width="120" />
        <el-table-column prop="email" :label="t('user.email')" min-width="180" />
        <el-table-column :label="t('user.role')" width="150">
          <template #default="{ row }">
            <el-tag
              v-for="role in row.roles"
              :key="role"
              :type="role === 'admin' ? 'danger' : 'primary'"
              size="small"
              style="margin-right: 4px"
            >
              {{ role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('user.status')" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="inactive"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column :label="t('user.actions')" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              :icon="Edit"
              @click="handleEditUser(row)"
            >
              {{ t('common.edit') }}
            </el-button>
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click="handleDeleteUser(row)"
            >
              {{ t('common.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="userStore.filteredUsers.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- Add User Dialog -->
    <el-dialog
      v-model="addDialogVisible"
      :title="t('user.addUser')"
      width="500px"
      @close="resetAddForm"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item :label="t('user.username')" prop="username">
          <el-input
            v-model="addForm.username"
            :placeholder="t('user.pleaseEnterUsername')"
          />
        </el-form-item>
        <el-form-item :label="t('user.email')" prop="email">
          <el-input
            v-model="addForm.email"
            :placeholder="t('user.pleaseEnterEmail')"
          />
        </el-form-item>
        <el-form-item :label="t('user.password')" prop="password">
          <el-input
            v-model="addForm.password"
            type="password"
            :placeholder="t('user.pleaseEnterPassword')"
            show-password
          />
        </el-form-item>
        <el-form-item :label="t('user.role')" prop="roles">
          <el-select
            v-model="addForm.roles"
            :placeholder="t('user.pleaseSelectRole')"
            multiple
            style="width: 100%"
          >
            <el-option label="Admin" value="admin" />
            <el-option label="User" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('user.status')" prop="status">
          <el-switch
            v-model="addForm.status"
            active-value="active"
            inactive-value="inactive"
            :active-text="t('user.active')"
            :inactive-text="t('user.inactive')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">
          {{ t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="handleAddSubmit" :loading="userStore.loading">
          {{ t('common.save') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Edit User Dialog -->
    <el-dialog
      v-model="editDialogVisible"
      :title="t('user.editUser')"
      width="500px"
      @close="resetEditForm"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item :label="t('user.username')" prop="username">
          <el-input
            v-model="editForm.username"
            :placeholder="t('user.pleaseEnterUsername')"
          />
        </el-form-item>
        <el-form-item :label="t('user.email')" prop="email">
          <el-input
            v-model="editForm.email"
            :placeholder="t('user.pleaseEnterEmail')"
          />
        </el-form-item>
        <el-form-item :label="t('user.role')" prop="roles">
          <el-select
            v-model="editForm.roles"
            :placeholder="t('user.pleaseSelectRole')"
            multiple
            style="width: 100%"
          >
            <el-option label="Admin" value="admin" />
            <el-option label="User" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('user.status')" prop="status">
          <el-switch
            v-model="editForm.status"
            active-value="active"
            inactive-value="inactive"
            :active-text="t('user.active')"
            :inactive-text="t('user.inactive')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">
          {{ t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="handleEditSubmit" :loading="userStore.loading">
          {{ t('common.save') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Delete Confirm Dialog -->
    <el-dialog
      v-model="deleteDialogVisible"
      :title="t('user.deleteUser')"
      width="400px"
    >
      <p>{{ t('user.confirmDelete') }}</p>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">
          {{ t('common.cancel') }}
        </el-button>
        <el-button type="danger" @click="handleDeleteSubmit" :loading="userStore.loading">
          {{ t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'

const { t } = useI18n()
const userStore = useUserStore()

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const deleteDialogVisible = ref(false)

const addFormRef = ref<FormInstance>()
const editFormRef = ref<FormInstance>()

const currentUser = ref<User | null>(null)

const addForm = ref({
  username: '',
  email: '',
  password: '',
  roles: [] as string[],
  status: 'active' as 'active' | 'inactive',
})

const editForm = ref({
  username: '',
  email: '',
  roles: [] as string[],
  status: 'active' as 'active' | 'inactive',
})

const addFormRules: FormRules = {
  username: [
    { required: true, message: t('user.pleaseEnterUsername'), trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 20', trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('user.pleaseEnterEmail'), trigger: 'blur' },
    { type: 'email', message: 'Please enter correct email', trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('user.pleaseEnterPassword'), trigger: 'blur' },
    { min: 6, max: 20, message: 'Length should be 6 to 20', trigger: 'blur' },
  ],
  roles: [
    { required: true, message: t('user.pleaseSelectRole'), trigger: 'change' },
  ],
}

const editFormRules: FormRules = {
  username: [
    { required: true, message: t('user.pleaseEnterUsername'), trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 20', trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('user.pleaseEnterEmail'), trigger: 'blur' },
    { type: 'email', message: 'Please enter correct email', trigger: 'blur' },
  ],
  roles: [
    { required: true, message: t('user.pleaseSelectRole'), trigger: 'change' },
  ],
}

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return userStore.filteredUsers.slice(start, end)
})

function handleSearch() {
  userStore.searchUsers(searchKeyword.value)
  currentPage.value = 1
}

function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
}

function handlePageChange(page: number) {
  currentPage.value = page
}

function handleAddUser() {
  addDialogVisible.value = true
}

function handleEditUser(user: User) {
  currentUser.value = user
  editForm.value = {
    username: user.username,
    email: user.email || '',
    roles: [...user.roles],
    status: user.status || 'active',
  }
  editDialogVisible.value = true
}

function handleDeleteUser(user: User) {
  currentUser.value = user
  deleteDialogVisible.value = true
}

async function handleStatusChange(user: User) {
  try {
    await userStore.updateUser(user.id, { status: user.status })
    ElMessage.success(t('user.updateSuccess'))
  } catch (error) {
    ElMessage.error('Failed to update status')
    user.status = user.status === 'active' ? 'inactive' : 'active'
  }
}

async function handleAddSubmit() {
  if (!addFormRef.value) return

  await addFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await userStore.addUser({
          username: addForm.value.username,
          email: addForm.value.email,
          roles: addForm.value.roles,
          status: addForm.value.status,
        })
        ElMessage.success(t('user.addSuccess'))
        addDialogVisible.value = false
        resetAddForm()
      } catch (error) {
        ElMessage.error('Failed to add user')
      }
    }
  })
}

async function handleEditSubmit() {
  if (!editFormRef.value || !currentUser.value) return

  await editFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await userStore.updateUser(currentUser.value.id, {
          username: editForm.value.username,
          email: editForm.value.email,
          roles: editForm.value.roles,
          status: editForm.value.status,
        })
        ElMessage.success(t('user.updateSuccess'))
        editDialogVisible.value = false
        resetEditForm()
      } catch (error) {
        ElMessage.error('Failed to update user')
      }
    }
  })
}

async function handleDeleteSubmit() {
  if (!currentUser.value) return

  try {
    await userStore.deleteUser(currentUser.value.id)
    ElMessage.success(t('user.deleteSuccess'))
    deleteDialogVisible.value = false
    currentUser.value = null
  } catch (error) {
    ElMessage.error('Failed to delete user')
  }
}

function resetAddForm() {
  addForm.value = {
    username: '',
    email: '',
    password: '',
    roles: [],
    status: 'active',
  }
  addFormRef.value?.resetFields()
}

function resetEditForm() {
  editForm.value = {
    username: '',
    email: '',
    roles: [],
    status: 'active',
  }
  editFormRef.value?.resetFields()
  currentUser.value = null
}

onMounted(async () => {
  try {
    await userStore.fetchUsers()
  } catch (error) {
    ElMessage.error('Failed to load users')
  }
})
</script>

<style scoped>
.user-management-container {
  height: 100%;
}

.content-card {
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.content-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar {
  margin-bottom: 1rem;
}

.el-table {
  flex: 1;
  overflow: auto;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}
</style>