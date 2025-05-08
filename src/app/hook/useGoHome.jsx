'use client'

import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { getHomePath } from '@/utils/getHomePath'

export function useGoHome() {
    const router = useRouter()
    const slug = useSelector((state) => state.params.slug)

    return useCallback(() => {
        router.push(getHomePath(slug))
    }, [router, slug])
}
