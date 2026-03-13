# AIDP AI Q&A System - Agent Guide

## Build & Test Commands

### Development
- `bun run dev` - Start dev server (port 3000)
- `bun run build` - Build for production (runs type check + vite build)
- `bun run preview` - Preview production build

### Testing
- `bun run test` - Run all unit tests
- `bun run test:ui` - Run tests with Vitest UI
- `bun run test:coverage` - Generate coverage report
- `bun run test:e2e` - Run Playwright E2E tests

**Run a single test file:**
```bash
bun run test path/to/test.spec.ts
# or
vitest run path/to/test.spec.ts
```

**Run tests matching a pattern:**
```bash
vitest run --grep "test name pattern"
```

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode**: Enabled (`strict: true`)
- **Unused checks**: `noUnusedLocals`, `noUnusedParameters` enforced
- **Module resolution**: Bundler mode, ESNext target
- **Imports**: Use path alias `@/` for `src/` directory

### Vue Components
- Use `<script setup lang="ts">` syntax
- Prefer Composition API over Options API
- Use `ref()` for reactive primitives, `reactive()` for objects
- Scoped styles with `<style scoped>`
- Component imports: Auto-imported via `unplugin-vue-components`

### Pinia Stores
- Use setup syntax: `defineStore('name', () => { ... })`
- Return object with: state, computed getters, actions
- Example pattern:
```typescript
export const useXStore = defineStore('x', () => {
  const state = ref(...)
  const getter = computed(() => ...)
  function action() { ... }
  return { state, getter, action }
})
```

### Vue Router
- **Navigation guards**: Return values instead of `next()` callback
```typescript
router.beforeEach((to, _from) => {
  if (condition) return '/destination'
  return true
})
```
- Route definitions: Type with `RouteRecordRaw[]`
- Programmatic navigation: Use `router.push()` or `router.replace()`

### Imports & Dependencies
- **Auto-imported**: `ref`, `computed`, `watch`, etc. (Vue composables)
- **Explicit imports**: Third-party icons, utilities, types
- **Icons**: Import from `@element-plus/icons-vue`
  - Available icons: Check `node_modules/@element-plus/icons-vue/dist/types/components/`
  - Common icons: User, Setting, Edit, Delete, ChatDotRound, etc.
  - Note: Some expected icons may not exist (e.g., Robot, Globe) - verify first

### Error Handling
- Use try/catch for async operations
- Log errors: `console.error('Context:', error)`
- Re-throw after logging if caller needs to handle
- User feedback: Use Element Plus `ElMessage.error()` for UI errors

### Naming Conventions
- **Files**: `PascalCase.vue` for components, `kebab-case.ts` for utils/stores
- **Components**: PascalCase in imports/usage
- **Functions/Variables**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE or camelCase for module-scoped

### Styling
- Use scoped CSS in `.vue` files
- CSS class names: kebab-case (`class-name`)
- Use CSS variables for theming (defined in `@/assets/styles/variables.scss`)
- Avoid inline styles except for dynamic values
- Transitions/Animations: Use CSS keyframes or Vue `<Transition>` components

### Type Safety
- Use `type` for type aliases, `interface` for object shapes
- Explicit type annotations for function parameters and return types
- Prefer `Omit<T, 'prop'>` or `Pick<T, 'prop'>` over inline type definitions
- Use generics where appropriate

### File Organization
```
src/
├── assets/          # Static assets, SCSS variables
├── components/      # Reusable components (common/, business/)
├── composables/     # Vue composables
├── layouts/         # Layout components (ChatLayout, AdminLayout)
├── router/          # Route configuration
├── stores/          # Pinia stores
├── views/           # Page components (auth/, chat/, admin/)
├── types/           # TypeScript type definitions (index.ts)
├── i18n/            # Internationalization
└── utils/           # Utility functions
```

### Internationalization
- Use `useI18n()` composable
- Translation keys: `t('namespace.key')`
- Supported locales: `zh-CN` (default), `en`
- Switch locale via `locale.value = 'code'`

### Authentication & Authorization
- Use `useAuthStore()` for auth state
- Check auth: `authStore.isAuthenticated`
- Check roles: `authStore.hasRole('admin')` or `authStore.hasAnyRole(['admin', 'user'])`
- Protected routes: `meta: { requiresAuth: true }`
- Role-protected routes: `meta: { requiresAuth: true, roles: ['admin'] }`

## Common Patterns

### Mock APIs
Mock API functions are defined alongside stores (e.g., `mockLoginApi`, `mockAIApi`, `mockFetchUsersApi`).
Use `setTimeout()` to simulate network delays (typically 500-1000ms).

```typescript
async function mockXxxApi(params: Type): Promise<Result> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  // Return mock data
  return mockData
}
```

### Store CRUD Pattern
Consistent pattern for Pinia stores with CRUD operations:
```typescript
export const useXStore = defineStore('x', () => {
  const items = ref<Item[]>([])
  const loading = ref(false)
  
  async function fetchItems() { /* ... */ }
  async function addItem(item) { /* ... */ }
  async function updateItem(id, item) { /* ... */ }
  async function deleteItem(id) { /* ... */ }
  
  return { items, loading, fetchItems, addItem, updateItem, deleteItem }
})
```

### Element Plus Components
Auto-imported via unplugin. Just use `<el-button>`, `<el-input>`, etc. in templates.
For explicit imports, use: `import { ElMessage } from 'element-plus'`

### Form Validation Pattern
```typescript
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const formRules: FormRules = {
  field: [
    { required: true, message: t('xxx.required'), trigger: 'blur' },
    { type: 'email', message: 'Invalid email', trigger: 'blur' },
  ]
}

// In submit handler
await formRef.value.validate(async (valid) => {
  if (valid) { /* ... */ }
})
```

### Dialog Pattern
Always handle dialog close with form reset:
```vue
<el-dialog v-model="visible" @close="resetForm">
  <!-- form content -->
</el-dialog>

function resetForm() {
  form.value = { /* initial values */ }
  formRef.value?.resetFields()
}
```

### Table with Pagination
```vue
<el-table :data="paginatedItems" v-loading="loading">
  <!-- columns -->
</el-table>

<el-pagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="items.length"
  @size-change="handleSizeChange"
/>

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return items.value.slice(start, start + pageSize.value)
})
```

### Search/Filter Pattern
```typescript
const searchKeyword = ref('')

const filteredItems = computed(() => {
  if (!searchKeyword.value) return items.value
  const keyword = searchKeyword.value.toLowerCase()
  return items.value.filter(item =>
    item.field.toLowerCase().includes(keyword)
  )
})

function handleSearch() {
  currentPage.value = 1
}
```

### TDD Requirements
For any new code or new features added, corresponding test code (including unit tests (UT) and end-to-end (E2E) tests) must be written simultaneously. Additionally, all test code must be executed and pass successfully.

### Testing Patterns
- **Store tests**: Use `vi.useFakeTimers()` for async mock APIs, test loading states
- **Component tests**: Mock Element Plus components with stubs, mock stores
- **Test naming**: `should <action> when <condition>`