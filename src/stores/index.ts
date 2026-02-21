import { createPinia } from 'pinia'

export default createPinia()

// 导出所有 store
export * from './modules/app'
export * from './modules/news'
export * from './modules/products'
