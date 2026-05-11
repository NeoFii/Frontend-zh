const mockGet = jest.fn()
const mockPost = jest.fn()
const mockPatch = jest.fn()
const mockDelete = jest.fn()

jest.mock('./index', () => ({
  http: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
    patch: (...args: unknown[]) => mockPatch(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}))

describe('user-service backed router console API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('lists user API keys from /keys and normalizes key fields', async () => {
    mockGet.mockResolvedValueOnce({
      code: 200,
      message: 'success',
      data: [
        {
          id: 10,
          key_prefix: 'sk-abc12',
          name: 'prod',
          status: 1,
          quota_mode: 2,
          quota_limit: 5000,
          quota_used: 1200,
          allowed_models: null,
          allow_ips: null,
          expires_at: null,
          last_used_at: null,
          created_at: '2026-04-21T10:00:00Z',
          updated_at: '2026-04-21T10:00:00Z',
        },
      ],
    })

    const { listRouterKeys } = await import('./router')
    const response = await listRouterKeys()

    expect(mockGet).toHaveBeenCalledWith('/keys')
    expect(response.data.items).toEqual([
      expect.objectContaining({
        id: 10,
        name: 'prod',
        token_preview: 'sk-abc12...',
        status: 1,
        is_active: true,
        billing_mode: 'limited',
        quota_limit: 50,
        quota_used: 12,
        balance: 38,
      }),
    ])
  })

  it('creates a user API key through /keys and exposes the one-time secret', async () => {
    mockPost.mockResolvedValueOnce({
      code: 201,
      message: 'created',
      data: {
        key: 'sk-full-secret',
        item: {
          id: 11,
          key_prefix: 'sk-full',
          name: 'test',
          status: 1,
          quota_mode: 1,
          quota_limit: 0,
          quota_used: 0,
          allowed_models: null,
          allow_ips: null,
          expires_at: null,
          last_used_at: null,
          created_at: '2026-04-21T10:00:00Z',
          updated_at: '2026-04-21T10:00:00Z',
        },
      },
    })

    const { createRouterKey } = await import('./router')
    const response = await createRouterKey({ name: 'test' })

    expect(mockPost).toHaveBeenCalledWith('/keys', { name: 'test' })
    expect(response.data.api_key).toBe('sk-full-secret')
    expect(response.data.item.token_preview).toBe('sk-full...')
  })

  it('maps usage logs from /billing/usage/logs into console usage events', async () => {
    mockGet.mockResolvedValueOnce({
      code: 200,
      message: 'success',
      data: {
        items: [
          {
            id: 20,
            request_id: 'req-1',
            api_key_id: 10,
            effective_model: 'gpt-4o-2024-08-06',
            prompt_tokens: 100,
            completion_tokens: 50,
            cached_tokens: 0,
            total_tokens: 150,
            cost: 123,
            status: 200,
            duration_ms: 345,
            is_stream: false,
            routing_tier: 1,
            config_version: 3,
            config_source: 'db',
            router_trace_id: 'trace-abc',
            error_code: null,
            error_msg: null,
            created_at: '2026-04-21T11:00:00Z',
          },
        ],
        total: 1,
        page: 2,
        page_size: 25,
      },
    })

    const { fetchRouterUsageEvents } = await import('./router')
    const response = await fetchRouterUsageEvents({ limit: 25, offset: 25 })

    expect(mockGet).toHaveBeenCalledWith('/billing/usage/logs', {
      params: { page: 2, page_size: 25 },
    })
    expect(response.data.items[0]).toEqual(
      expect.objectContaining({
        api_key_id: 10,
        effective_model: 'gpt-4o-2024-08-06',
        total_tokens: 150,
        cost: 0.000123,
        status: 200,
        duration_ms: 345,
        routing_tier: 1,
        config_version: 3,
        config_source: 'db',
        router_trace_id: 'trace-abc',
      })
    )
  })

  it('forwards effective_model to /billing/usage/logs for actual-model filtering', async () => {
    mockGet.mockResolvedValueOnce({
      code: 200,
      message: 'success',
      data: {
        items: [],
        total: 0,
        page: 1,
        page_size: 20,
      },
    })

    const { fetchRouterUsageEvents } = await import('./router')
    await fetchRouterUsageEvents({
      limit: 20,
      offset: 0,
      effective_model: 'gpt-4.1-mini-2026-04-14',
    })

    expect(mockGet).toHaveBeenCalledWith('/billing/usage/logs', {
      params: {
        page: 1,
        page_size: 20,
        effective_model: 'gpt-4.1-mini-2026-04-14',
      },
    })
  })

  it('maps raw usage stats from /billing/usage and forwards query params', async () => {
    mockGet.mockResolvedValueOnce({
      code: 200,
      message: 'success',
      data: [
        {
          id: 40,
          api_key_id: 10,
          model_name: 'gpt-4o',
          stat_hour: '2026-04-22T10:00:00Z',
          request_count: 12,
          success_count: 11,
          error_count: 1,
          prompt_tokens: 1200,
          completion_tokens: 600,
          cached_tokens: 300,
          total_tokens: 2100,
          total_cost: 345,
        },
      ],
    })

    const { fetchRouterUsageStats } = await import('./router')
    const response = await fetchRouterUsageStats({
      start: '2026-04-22T00:00:00.000Z',
      end: '2026-04-23T00:00:00.000Z',
      apiKeyId: 10,
    })

    expect(mockGet).toHaveBeenCalledWith('/billing/usage', {
      params: {
        start: '2026-04-22T00:00:00.000Z',
        end: '2026-04-23T00:00:00.000Z',
        api_key_id: 10,
      },
    })
    expect(response.data).toEqual([
      {
        stat_hour: '2026-04-22T10:00:00Z',
        request_count: 12,
        success_count: 11,
        error_count: 1,
        prompt_tokens: 1200,
        completion_tokens: 600,
        cached_tokens: 300,
        total_tokens: 2100,
        total_cost: 3.45,
      },
    ])
  })

  it('reduces usage summary totals without double converting total cost', async () => {
    mockGet.mockResolvedValueOnce({
      code: 200,
      message: 'success',
      data: [
        {
          id: 41,
          api_key_id: null,
          model_name: 'gpt-4o',
          stat_hour: '2026-04-22T10:00:00Z',
          request_count: 5,
          success_count: 4,
          error_count: 1,
          prompt_tokens: 500,
          completion_tokens: 200,
          cached_tokens: 50,
          total_tokens: 750,
          total_cost: 345,
        },
      ],
    })

    const { fetchRouterUsageSummary } = await import('./router')
    const response = await fetchRouterUsageSummary()

    expect(response.data).toEqual({
      total_requests: 5,
      success_requests: 4,
      prompt_tokens: 500,
      completion_tokens: 200,
      total_tokens: 750,
      total_cost: 3.45,
      currency: 'CNY',
    })
  })

  it('maps usage analytics from /billing/usage/analytics and converts all cost fields to yuan', async () => {
    mockGet.mockResolvedValueOnce({
      code: 200,
      message: 'success',
      data: {
        range: '8h',
        granularity: 'hour',
        start: '2026-04-24T00:00:00Z',
        end: '2026-04-24T08:00:00Z',
        currency: 'CNY',
        overview: {
          total_requests: 48,
          success_requests: 45,
          success_rate: 0.9375,
          total_cost: 1234,
        },
        models: [
          {
            effective_model: 'gpt-4.1-mini-2026-04-14',
            request_count: 30,
            request_share: 0.625,
            total_cost: 789,
          },
        ],
        buckets: [
          {
            bucket_start: '2026-04-24T00:00:00Z',
            label: '08:00',
            costs: [
              {
                effective_model: 'gpt-4.1-mini-2026-04-14',
                total_cost: 456,
              },
            ],
          },
        ],
      },
    })

    const { fetchRouterUsageAnalytics } = await import('./router')
    const response = await fetchRouterUsageAnalytics({ range: '8h' })

    expect(mockGet).toHaveBeenCalledWith('/billing/usage/analytics', {
      params: {
        range: '8h',
      },
    })
    expect(response.data).toEqual({
      range: '8h',
      granularity: 'hour',
      start: '2026-04-24T00:00:00Z',
      end: '2026-04-24T08:00:00Z',
      currency: 'CNY',
      overview: {
        total_requests: 48,
        success_requests: 45,
        success_rate: 0.9375,
        total_cost: 12.34,
      },
      models: [
        {
          effective_model: 'gpt-4.1-mini-2026-04-14',
          request_count: 30,
          request_share: 0.625,
          total_cost: 7.89,
        },
      ],
      buckets: [
        {
          bucket_start: '2026-04-24T00:00:00Z',
          label: '08:00',
          costs: [
            {
              effective_model: 'gpt-4.1-mini-2026-04-14',
              total_cost: 4.56,
            },
          ],
        },
      ],
    })
  })

  it('maps account balance from /billing/balance and falls back to balance minus frozen amount', async () => {
    mockGet.mockResolvedValueOnce({
      code: 200,
      message: 'success',
      data: {
        balance: 1000,
        frozen_amount: 125,
        used_amount: 250,
        total_requests: 8,
        total_tokens: 4096,
      },
    })

    const { fetchRouterBalance } = await import('./router')
    const response = await fetchRouterBalance()

    expect(mockGet).toHaveBeenCalledWith('/billing/balance')
    expect(response.data).toEqual({
      balance: 10,
      frozen_amount: 1.25,
      used_amount: 2.5,
      available_balance: 8.75,
      total_requests: 8,
      total_tokens: 4096,
      currency: 'CNY',
    })
  })

  it('maps balance transactions from /billing/transactions into ledger items', async () => {
    mockGet.mockResolvedValueOnce({
      code: 200,
      message: 'success',
      data: {
        items: [
          {
            id: 30,
            type: 2,
            amount: -456,
            balance_before: 1000,
            balance_after: 544,
            ref_type: 'api_call',
            ref_id: 'req-1',
            remark: null,
            created_at: '2026-04-21T12:00:00Z',
          },
        ],
        total: 1,
        page: 1,
        page_size: 50,
      },
    })

    const { fetchRouterBillingLedger } = await import('./router')
    const response = await fetchRouterBillingLedger({ limit: 50, offset: 0 })

    expect(mockGet).toHaveBeenCalledWith('/billing/transactions', {
      params: { page: 1, page_size: 50 },
    })
    expect(response.data.items[0]).toEqual(
      expect.objectContaining({
        id: 30,
        type: 2,
        direction: 'debit',
        amount: -4.56,
        balance_before: 10,
        balance_after: 5.44,
        description: null,
        reference_label: '请求 req-1',
      })
    )
  })

  it('passes transaction type to the backend and treats voucher redemptions as credits', async () => {
    mockGet.mockResolvedValueOnce({
      code: 200,
      message: 'success',
      data: {
        items: [
          {
            id: 31,
            type: 7,
            amount: 800,
            balance_before: 1000,
            balance_after: 1800,
            ref_type: 'voucher_code',
            ref_id: '10',
            remark: null,
            created_at: '2026-04-21T12:30:00Z',
          },
        ],
        total: 1,
        page: 2,
        page_size: 25,
      },
    })

    const { fetchRouterBillingLedger, transactionTypeMeta } = await import('./router')
    const response = await fetchRouterBillingLedger({ limit: 25, offset: 25, type: 7 })

    expect(mockGet).toHaveBeenCalledWith('/billing/transactions', {
      params: { page: 2, page_size: 25, type: 7 },
    })
    expect(transactionTypeMeta(7)).toEqual(
      expect.objectContaining({
        label: '代金券',
        tone: expect.stringContaining('emerald'),
      })
    )
    expect(response.data.items[0]).toEqual(
      expect.objectContaining({
        type: 7,
        direction: 'credit',
        amount: 8,
        balance_before: 10,
        balance_after: 18,
      })
    )
  })

  it('maps voucher redemption history and converts amounts to yuan', async () => {
    mockGet.mockResolvedValueOnce({
      code: 200,
      message: 'success',
      data: {
        items: [
          {
            id: 40,
            code_prefix: 'VC-A',
            code_suffix: '0001',
            amount: 800,
            status: 2,
            redeemed_at: '2026-04-22T10:00:00Z',
            created_at: '2026-04-21T10:00:00Z',
          },
        ],
        total: 1,
        page: 1,
        page_size: 20,
      },
    })

    const { fetchVoucherRedemptions } = await import('./router')
    const response = await fetchVoucherRedemptions({ limit: 20, offset: 0 })

    expect(mockGet).toHaveBeenCalledWith('/billing/vouchers/redemptions', {
      params: { page: 1, page_size: 20 },
    })
    expect(response.data.items).toEqual([
      {
        id: 40,
        code_prefix: 'VC-A',
        code_suffix: '0001',
        amount: 8,
        status: 2,
        redeemed_at: '2026-04-22T10:00:00Z',
        created_at: '2026-04-21T10:00:00Z',
      },
    ])
    expect(response.data.total).toBe(1)
  })

  it('uses a 10-item default page size for /billing/topup-orders', async () => {
    mockGet.mockResolvedValueOnce({
      code: 200,
      message: 'success',
      data: {
        items: [
          {
            id: 51,
            order_no: 'TP-20260422',
            amount: 800,
            status: 2,
            payment_channel: 'alipay',
            payment_no: 'pay-1',
            paid_at: '2026-04-22T10:00:00Z',
            remark: null,
            created_at: '2026-04-22T09:50:00Z',
            updated_at: '2026-04-22T10:00:00Z',
          },
        ],
        total: 1,
        page: 1,
        page_size: 10,
      },
    })

    const { fetchTopupOrders } = await import('./router')
    const response = await fetchTopupOrders()

    expect(mockGet).toHaveBeenCalledWith('/billing/topup-orders', {
      params: { page: 1, page_size: 10 },
    })
    expect(response.data.items).toEqual([
      expect.objectContaining({
        id: 51,
        order_no: 'TP-20260422',
        amount: 8,
        status: 2,
        payment_channel: 'alipay',
      }),
    ])
  })

  it('adds display labels for manual topup orders and topup ledger references', async () => {
    mockGet
      .mockResolvedValueOnce({
        code: 200,
        message: 'success',
        data: {
          items: [
            {
              id: 52,
              order_no: 'TP-20260423',
              amount: 1200,
              status: 2,
              payment_channel: 'manual',
              payment_no: null,
              paid_at: '2026-04-23T10:00:00Z',
              remark: null,
              created_at: '2026-04-23T09:50:00Z',
              updated_at: '2026-04-23T10:00:00Z',
            },
          ],
          total: 1,
          page: 1,
          page_size: 10,
        },
      })
      .mockResolvedValueOnce({
        code: 200,
        message: 'success',
        data: {
          items: [
            {
              id: 61,
              type: 1,
              amount: 1200,
              balance_before: 0,
              balance_after: 1200,
              ref_type: 'topup_order',
              ref_id: 'TP-20260423',
              remark: null,
              created_at: '2026-04-23T10:00:00Z',
            },
          ],
          total: 1,
          page: 1,
          page_size: 10,
        },
      })

    const { fetchTopupOrders, fetchRouterBillingLedger } = await import('./router')
    const topupResponse = await fetchTopupOrders()
    const ledgerResponse = await fetchRouterBillingLedger()

    expect(topupResponse.data.items[0]).toEqual(
      expect.objectContaining({
        payment_channel: 'manual',
        payment_channel_label: '管理员代充',
      })
    )
    expect(ledgerResponse.data.items[0]).toEqual(
      expect.objectContaining({
        ref_type: 'topup_order',
        ref_id: 'TP-20260423',
        reference_label: '订单号 TP-20260423',
      })
    )
  })
})
