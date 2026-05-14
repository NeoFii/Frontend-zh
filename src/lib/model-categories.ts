import type {
  ModelCategory,
  ModelCategoryBrief,
  ModelDetail,
  ModelListItem,
} from '@/types/model'

const CATEGORY_NAME_BY_KEY: Record<string, string> = {
  reasoning: '逻辑推理与规划',
  coding: '编程',
  tool_use: '工具调用',
  instruction_following: '复杂指令遵循',
}

export const DEFAULT_MODEL_CATEGORIES: ModelCategory[] = [
  { id: 1, key: 'reasoning', name: CATEGORY_NAME_BY_KEY.reasoning, sort_order: 1, is_active: true },
  { id: 2, key: 'coding', name: CATEGORY_NAME_BY_KEY.coding, sort_order: 2, is_active: true },
  { id: 3, key: 'tool_use', name: CATEGORY_NAME_BY_KEY.tool_use, sort_order: 3, is_active: true },
  {
    id: 4,
    key: 'instruction_following',
    name: CATEGORY_NAME_BY_KEY.instruction_following,
    sort_order: 4,
    is_active: true,
  },
]

export function getModelCategoryDisplayName(key: string, fallback?: string): string {
  return CATEGORY_NAME_BY_KEY[key] ?? fallback ?? key
}

export function normalizeModelCategory<T extends ModelCategory | ModelCategoryBrief>(category: T): T {
  return {
    ...category,
    name: getModelCategoryDisplayName(category.key, category.name),
  }
}

export function normalizeModelCategories<T extends ModelCategory | ModelCategoryBrief>(
  categories: T[] | undefined
): T[] {
  return (categories ?? []).map((category) => normalizeModelCategory(category))
}

export function normalizeModelListItem(model: ModelListItem): ModelListItem {
  const raw = model as unknown as Record<string, unknown>
  return {
    ...model,
    price_input_per_m_fen: model.price_input_per_m_fen ?? (raw.sale_input_per_million as number | null) ?? null,
    price_output_per_m_fen: model.price_output_per_m_fen ?? (raw.sale_output_per_million as number | null) ?? null,
    price_cached_input_per_m_fen: model.price_cached_input_per_m_fen ?? (raw.sale_cached_input_per_million as number | null) ?? null,
    categories: normalizeModelCategories(model.categories),
  }
}

export function normalizeModelDetail(model: ModelDetail): ModelDetail {
  const raw = model as unknown as Record<string, unknown>
  return {
    ...model,
    price_input_per_m_fen: model.price_input_per_m_fen ?? (raw.sale_input_per_million as number | null) ?? null,
    price_output_per_m_fen: model.price_output_per_m_fen ?? (raw.sale_output_per_million as number | null) ?? null,
    price_cached_input_per_m_fen: model.price_cached_input_per_m_fen ?? (raw.sale_cached_input_per_million as number | null) ?? null,
    categories: normalizeModelCategories(model.categories),
  }
}
