'use client'

import Link from 'next/link'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { useAuthStore } from '@/stores/auth'

export default function Platform() {
  const { isAuthenticated, hydrated } = useAuthStore()

  // 判断是否已登录（认证状态由后端通过 Cookie 管理）
  const isLoggedIn = hydrated && isAuthenticated

  return (
    <main className="flex flex-col items-center w-full overflow-y-auto flex-1 pb-[160px] min-h-screen">
      {/* 1. 标题区域 */}
      <div className="px-[20px] lg:px-0 lg:w-[1000px] flex flex-col items-center mt-[80px]">
        {/* 主标题 */}
        <h1 className="m-0 p-0 text-center text-[#181E25] text-[54px] font-[500] leading-[86.4px] pb-[12px] max-w-[900px]">
          Eucal AI 开放平台
        </h1>

        {/* 副标题 */}
        <p className="text-[#181E25] text-[18px] font-[300] leading-[32px] text-center mb-[32px] max-w-[700px]">
          通过简洁的 API 接口，快速接入 TierFlow 的智能推理优化能力
        </p>

        {/* 描述 */}
        <p className="text-[#666] text-[16px] font-[300] leading-[28px] text-center mb-[32px] max-w-[700px]">
          我们提供与 OpenAI 兼容的 API 格式，支持多种编程语言的 SDK，让您在几分钟内完成接入，即刻享受 70% 的成本降低和毫秒级响应速度。
        </p>

        {/* CTA 按钮 */}
        <div className="flex items-center justify-center py-[16px]">
          <a
            href="https://neofii.github.io/TierFlow-Doc/"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline p-[8px_24px] rounded-full flex items-center gap-2 bg-[#181E25] text-white mr-[16px] hover:opacity-90 transition-all duration-300"
          >
            <p className="p-0 m-0 text-[16px] font-[400] leading-[19px]">查看文档</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
              <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </a>
          {isLoggedIn ? (
            <a
              href="/console/account/basic-information"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline p-[8px_24px] rounded-full flex items-center gap-2 border border-solid border-[#181E25]/80 text-[#181E25] hover:bg-[#F7F8FA] transition-all duration-300"
            >
              <p className="p-0 m-0 text-[16px] font-[400] leading-[19px]">获取 API Key</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </a>
          ) : (
            <Link
              href="/login"
              className="no-underline p-[8px_24px] rounded-full flex items-center gap-2 border border-solid border-[#181E25]/80 text-[#181E25] hover:bg-[#F7F8FA] transition-all duration-300"
            >
              <p className="p-0 m-0 text-[16px] font-[400] leading-[19px]">获取 API Key</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* 2. 核心数据展示 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[48px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center p-8 bg-[#F7F8FA] rounded-[12px]">
            <div className="text-[36px] font-[500] text-[#181E25] mb-2">
              70<span style={{ fontSize: '24px' }}>%</span>
            </div>
            <div className="text-[14px] text-[#666]">成本降低</div>
          </div>
          <div className="text-center p-8 bg-[#F7F8FA] rounded-[12px]">
            <div className="text-[36px] font-[500] text-[#181E25] mb-2">
              50<span style={{ fontSize: '24px' }}>ms</span>
            </div>
            <div className="text-[14px] text-[#666]">平均响应</div>
          </div>
          <div className="text-center p-8 bg-[#F7F8FA] rounded-[12px]">
            <div className="text-[36px] font-[500] text-[#181E25] mb-2">
              99.9<span style={{ fontSize: '24px' }}>%</span>
            </div>
            <div className="text-[14px] text-[#666]">服务可用性</div>
          </div>
          <div className="text-center p-8 bg-[#F7F8FA] rounded-[12px]">
            <div className="text-[36px] font-[500] text-[#181E25] mb-2">
              10<span style={{ fontSize: '24px' }}>万+</span>
            </div>
            <div className="text-[14px] text-[#666]">QPS 并发</div>
          </div>
        </div>
      </div>

      {/* 3. 平台优势 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[32px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">为什么选择我们</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-[#F7F8FA] rounded-[16px] hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">OpenAI 兼容</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  完全兼容 OpenAI API 格式，只需修改 base_url 和 api_key，现有代码无需任何改动即可接入
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#F7F8FA] rounded-[16px] hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">多语言 SDK</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  提供 Python、Node.js、Go、Java 等多种语言的官方 SDK，集成更简单，开发更高效
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#F7F8FA] rounded-[16px] hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">企业级安全</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  通过 ISO 27001 安全认证，提供完善的数据加密和访问控制，确保企业数据安全
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#F7F8FA] rounded-[16px] hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#181E25] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[18px] font-[500] text-[#181E25] mb-2">7×24 技术支持</h3>
                <p className="text-[14px] text-[#666] leading-[24px]">
                  专业技术支持团队全天候在线，及时响应您的任何问题，确保业务稳定运行
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 快速开始 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[768px] py-[48px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">快速开始</h2>

        <div className="bg-[#F7F8FA] rounded-[16px] p-8">
          <h3 className="text-[18px] font-[500] text-[#181E25] mb-4">安装 Python</h3>
          <MarkdownRenderer content={`\`\`\`bash
pip install eucal-ai
\`\`\``} />

          <h3 className="text-[18px] font-[500] text-[#181E25] mb-4 mt-8">快速调用</h3>
          <MarkdownRenderer content={`\`\`\`python
from eucal import EucalAI

client = EucalAI(api_key="your-api-key")
response = client.chat.completions.create(
    model="tierflow-pro",
    messages=[{"role": "user", "content": "你好"}]
)
print(response.choices[0].message.content)
\`\`\``} />
        </div>
      </div>

      {/* 5. API 端点 */}
      <div className="w-full px-[20px] lg:px-0 lg:w-[1000px] py-[48px]">
        <h2 className="text-[32px] font-[500] text-[#181E25] text-center mb-[48px]">API 端点</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F7F8FA] rounded-[16px] p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-green-500 text-white text-[12px] rounded-[8px] font-[500]">POST</span>
              <span className="text-[16px] font-mono text-[#181E25]">/v1/chat/completions</span>
            </div>
            <p className="text-[14px] text-[#666] leading-[24px]">
              创建聊天完成，返回模型生成的响应。支持多轮对话和流式输出。
            </p>
          </div>

          <div className="bg-[#F7F8FA] rounded-[16px] p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-green-500 text-white text-[12px] rounded-[8px] font-[500]">POST</span>
              <span className="text-[16px] font-mono text-[#181E25]">/v1/completions</span>
            </div>
            <p className="text-[14px] text-[#666] leading-[24px]">
              创建文本补全，根据提示生成完整的文本内容。
            </p>
          </div>

          <div className="bg-[#F7F8FA] rounded-[16px] p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-500 text-white text-[12px] rounded-[8px] font-[500]">GET</span>
              <span className="text-[16px] font-mono text-[#181E25]">/v1/models</span>
            </div>
            <p className="text-[14px] text-[#666] leading-[24px]">
              列出所有可用的模型，获取模型信息和使用限制。
            </p>
          </div>

          <div className="bg-[#F7F8FA] rounded-[16px] p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-green-500 text-white text-[12px] rounded-[8px] font-[500]">POST</span>
              <span className="text-[16px] font-mono text-[#181E25]">/v1/embeddings</span>
            </div>
            <p className="text-[14px] text-[#666] leading-[24px]">
              创建向量嵌入，将文本转换为向量表示，用于相似度计算等场景。
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
