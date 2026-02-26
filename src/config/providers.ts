/**
 * 第三方 AI 厂商配置列表
 * 用于管理用户配置的第三方 API 服务商
 */

export interface Provider {
  id: string           // 唯一标识
  name: string         // 显示名称
  keyPlaceholder: string  // 输入框提示
  website?: string     // 厂商官网
}

/**
 * 支持的第三方 AI 厂商列表
 */
export const SUPPORTED_PROVIDERS: Provider[] = [
  {
    id: 'ali-bailian',
    name: '阿里云百炼',
    keyPlaceholder: '请输入阿里云百炼 API Key',
    website: 'https://bailian.aliyun.com',
  },
  {
    id: 'silicon-flow',
    name: '硅基流动',
    keyPlaceholder: '请输入硅基流动 API Key',
    website: 'https://siliconflow.cn',
  },
  {
    id: 'morelink',
    name: '模力方舟',
    keyPlaceholder: '请输入模力方舟 API Key',
    website: 'https://morelink.ai',
  },
  {
    id: 'ppio',
    name: 'PPIO派欧云',
    keyPlaceholder: '请输入 PPIO派欧云 API Key',
    website: 'https://ppio.cn',
  },
  {
    id: 'wuxin',
    name: '无问芯穹',
    keyPlaceholder: '请输入无问芯穹 API Key',
    website: 'https://www.infini-ai.com',
  },
  {
    id: 'baidu-cloud',
    name: '百度智能云',
    keyPlaceholder: '请输入百度智能云 API Key',
    website: 'https://cloud.baidu.com',
  },
  {
    id: 'sophnet',
    name: 'SophNet',
    keyPlaceholder: '请输入 SophNet API Key',
    website: 'https://sophnet.com',
  },
  {
    id: 'qiniu',
    name: '七牛云',
    keyPlaceholder: '请输入七牛云 API Key',
    website: 'https://qiniu.com',
  },
  {
    id: 'parallel-cloud',
    name: '并行智算云',
    keyPlaceholder: '请输入并行智算云 API Key',
    website: 'https://parallelcloud.cn',
  },
  {
    id: 'ucloud',
    name: 'UCloud',
    keyPlaceholder: '请输入 UCloud API Key',
    website: 'https://ucloud.cn',
  },
  {
    id: 'xfyun',
    name: '讯飞星辰',
    keyPlaceholder: '请输入讯飞星辰 API Key',
    website: 'https://xinghuo.xfyun.cn',
  },
  {
    id: 'volcano',
    name: '火山方舟',
    keyPlaceholder: '请输入火山方舟 API Key',
    website: 'https://www.volcengine.com',
  },
  {
    id: 'cornerstone',
    name: '基石智算',
    keyPlaceholder: '请输入基石智算 API Key',
    website: 'https://www.corestone.cn',
  },
  {
    id: 'kwai',
    name: '快手万擎',
    keyPlaceholder: '请输入快手万擎 API Key',
    website: 'https://www.kwaikr.com',
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    keyPlaceholder: '请输入 MiniMax API Key',
    website: 'https://www.minimaxi.com',
  },
  {
    id: 'moonshot',
    name: 'Moonshot',
    keyPlaceholder: '请输入 Moonshot (Kimi) API Key',
    website: 'https://www.moonshot.cn',
  },
  {
    id: 'lingyi',
    name: '百灵大模型',
    keyPlaceholder: '请输入百灵大模型 API Key',
    website: 'https://www.douyin.com',
  },
  {
    id: 'stepfun',
    name: '阶跃星辰',
    keyPlaceholder: '请输入阶跃星辰 API Key',
    website: 'https://www.stepfun.com',
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi MiMo',
    keyPlaceholder: '请输入 Xiaomi MiMo API Key',
    website: 'https://www.xiaomi.com',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    keyPlaceholder: '请输入 DeepSeek API Key',
    website: 'https://www.deepseek.com',
  },
]

/**
 * 根据厂商 ID 获取厂商信息
 */
export function getProviderById(id: string): Provider | undefined {
  return SUPPORTED_PROVIDERS.find(p => p.id === id)
}
