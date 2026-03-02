---
title: "Eucal AI 新增 Python SDK，开发者可 5 分钟快速接入"
date: "2026-02-24"
category: "产品动态"
coverImage: ""
---

## SDK 发布

为帮助开发者更快速地接入 Eucal AI 推理服务，我们正式发布 Python SDK。

### 安装简单

```bash
pip install eucal-ai
```

### 快速开始

```python
from eucal import EucalAI

client = EucalAI(api_key="your-api-key")
response = client.chat.completions.create(
    model="tierflow-pro",
    messages=[{"role": "user", "content": "你好"}]
)
print(response.choices[0].message.content)
```

### 主要特性

- **完全兼容 OpenAI API**：只需修改 base_url 即可迁移
- **丰富的错误处理**：完善的异常处理机制，调试更轻松
- **异步支持**：支持异步调用，满足高性能需求
- **详细文档**：完整的 API 文档和示例代码

### 更多语言

JavaScript/TypeScript、Go、Java 等语言的 SDK 正在开发中，即将发布。

### 反馈与支持

如有任何问题，欢迎通过 GitHub Issues 或技术文档页面联系我们。
