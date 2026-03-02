---
title: "Eucal AI Releases Python SDK - Developers Can Integrate in 5 Minutes"
date: "2026-02-24"
category: "Product Updates"
coverImage: ""
---

## SDK Release

To help developers integrate Eucal AI inference services more quickly, we officially release the Python SDK.

### Simple Installation

```bash
pip install eucal-ai
```

### Quick Start

```python
from eucal import EucalAI

client = EucalAI(api_key="your-api-key")
response = client.chat.completions.create(
    model="tierflow-pro",
    messages=[{"role": "user", "content": "Hello"}]
)
print(response.choices[0].message.content)
```

### Key Features

- **OpenAI API Compatible**: Migrate by simply changing the base_url
- **Rich Error Handling**: Complete exception handling mechanism for easier debugging
- **Async Support**: Supports async calls for high-performance requirements
- **Detailed Documentation**: Complete API documentation and sample code

### More Languages

SDKs for JavaScript/TypeScript, Go, Java and other languages are under development and will be released soon.

### Feedback and Support

If you have any questions, feel free to contact us through GitHub Issues or the technical documentation page.
