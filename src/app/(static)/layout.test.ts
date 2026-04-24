import { generateMetadata } from './layout'

describe('StaticLayout metadata', () => {
  it('leaves the brand suffix to the root layout title template', async () => {
    await expect(generateMetadata()).resolves.toMatchObject({
      title: '一个接口 主流大模型',
    })
  })
})
