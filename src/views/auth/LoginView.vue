<template>
  <div class="login-container">
    <div class="login-content">
      <div class="left-panel">
        <div class="logo-section">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 4L12 8L8 12V4Z" fill="#0EA5E9" />
              <path d="M16 4L12 8L16 12V4Z" fill="#10B981" />
            </svg>
          </div>
          <h1 class="logo-text">AIDP</h1>
          <p class="logo-subtitle">{{ t('common.welcome') }} - {{ t('auth.login') }}</p>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              :placeholder="t('auth.pleaseEnterUsername')"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              :placeholder="t('auth.pleaseEnterPassword')"
              size="large"
              show-password
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="captcha">
            <div class="captcha-wrapper">
              <el-input
                v-model="loginForm.captcha"
                :placeholder="t('auth.pleaseEnterCaptcha')"
                size="large"
                clearable
              >
                <template #prefix>
                  <el-icon><Key /></el-icon>
                </template>
              </el-input>
              <div class="captcha-image">{{ mockCaptcha }}</div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="login-button"
              :loading="loading"
              @click="handleLogin"
            >
              {{ t('auth.login') }}
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="init-button"
              plain
              @click="goToInitialization"
            >
              {{ t('auth.goToInitialization') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="right-panel">
        <h2 class="right-title">[GIN] Hello World!</h2>

        <div class="tv-graphic">
          <div class="tv-frame">
            <div class="tv-screen">
              <svg class="tv-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4L12 8L8 12V4Z" fill="white" />
                <path d="M16 4L12 8L16 12V4Z" fill="white" />
              </svg>
            </div>
            <div class="tv-antenna-left"></div>
            <div class="tv-antenna-right"></div>
          </div>
        </div>

        <div class="code-section">
          <div class="code-header">
            <span>images</span>
            <span>></span>
            <span>GinVueAdmin.go...</span>
          </div>
          <pre class="code-content">
 1  type GinVueAdmin struct {
 2      gorm.Model
 3      Name    string `mapstructure:"name"`
 4      Version string `mapstructure:"version"`
 5  }</pre>
        </div>

        <div class="background-decoration decoration-1"></div>
        <div class="background-decoration decoration-2"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const mockCaptcha = ref('')

const loginForm = reactive({
  username: 'admin',
  password: '',
  captcha: '',
})

const loginRules: FormRules = {
  username: [
    { required: true, message: t('auth.pleaseEnterUsername'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('auth.pleaseEnterPassword'), trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: t('auth.pleaseEnterCaptcha'), trigger: 'blur' },
  ],
}

function generateCaptcha() {
  const chars = '0123456789'
  let result = ''
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  mockCaptcha.value = result
}

async function handleLogin() {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      await authStore.login({
        username: loginForm.username,
        password: loginForm.password,
        captcha: loginForm.captcha,
      })

      ElMessage.success(t('auth.loginSuccess'))

      const redirect = (route.query.redirect as string) || '/chat'
      router.push(redirect)
    } catch (error) {
      ElMessage.error(t('auth.loginFailed'))
      generateCaptcha()
    } finally {
      loading.value = false
    }
  })
}

function goToInitialization() {
  ElMessage.info('初始化功能待实现')
}

onMounted(() => {
  generateCaptcha()
})
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: #fff;
}

.login-content {
  display: flex;
  height: 100%;
}

.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #fff;
}

.right-panel {
  flex: 1;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 3rem;
  overflow: hidden;
}

.logo-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.logo-icon svg {
  width: 2.5rem;
  height: 2.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.logo-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.login-form {
  width: 100%;
  max-width: 20rem;
}

.captcha-wrapper {
  display: flex;
  gap: 0.5rem;
}

.captcha-wrapper :deep(.el-input) {
  flex: 1;
}

.captcha-image {
  width: 6rem;
  height: 2.5rem;
  background: #e5e7eb;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #4b5563;
  font-family: monospace;
  letter-spacing: 0.125rem;
}

.login-button,
.init-button {
  width: 100%;
}

.login-button {
  margin-bottom: 0.75rem;
}

.right-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 3rem;
}

.tv-graphic {
  margin-bottom: 2.5rem;
}

.tv-frame {
  width: 16rem;
  height: 16rem;
  background: rgba(30, 58, 144, 0.5);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tv-screen {
  width: 12rem;
  height: 9rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tv-logo {
  width: 2rem;
  height: 2rem;
}

.tv-antenna-left,
.tv-antenna-right {
  position: absolute;
  top: -1.5rem;
  width: 2rem;
  height: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
}

.tv-antenna-left {
  left: 50%;
  transform: translateX(-100%) rotate(45deg);
}

.tv-antenna-right {
  left: 50%;
  transform: rotate(-45deg);
}

.code-section {
  width: 100%;
  max-width: 28rem;
  font-size: 0.875rem;
  font-family: monospace;
  background: rgba(30, 58, 144, 0.3);
  padding: 1rem;
  border-radius: 0.5rem;
}

.code-header {
  display: flex;
  align-items: center;
  color: #d1d5db;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
}

.code-header span {
  margin-right: 0.5rem;
}

.code-content {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.5;
}

.background-decoration {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
}

.decoration-1 {
  top: 2.5rem;
  right: 2.5rem;
  width: 5rem;
  height: 5rem;
  background: rgba(255, 255, 255, 0.1);
}

.decoration-2 {
  bottom: 2.5rem;
  left: 2.5rem;
  width: 8rem;
  height: 8rem;
  background: rgba(255, 255, 255, 0.05);
}
</style>