'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ConsolePage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/console/account/basic-information')
  }, [router])

  return null
}
