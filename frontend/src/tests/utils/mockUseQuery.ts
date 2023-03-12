import { OperationVariables } from '@apollo/client'
import { useQuery, UseQueryReturn } from '@vue/apollo-composable'
import { Mock, MockedFunction, vi } from 'vitest'
import { ref } from 'vue'

export type MockedUseQueryOptions<T> = {
  result: T
  loading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch?: Mock<any[], any>
  error?: Error | null
}

export const mockUseQuery = <T>(options: MockedUseQueryOptions<T>) => {
  vi.mock('@vue/apollo-composable', async () => {
    const actual = await vi.importActual('@vue/apollo-composable')
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ...actual,
      useQuery: vi.fn(),
    }
  })

  const refetch = vi.fn()

  const mockUseQuery = useQuery as unknown as MockedFunction<typeof useQuery>
  mockUseQuery.mockReturnValue({
    loading: ref(options.loading || false),
    result: ref(options.result),
    refetch: options.refetch || refetch,
    error: ref(options.error),
  } as unknown as UseQueryReturn<unknown, OperationVariables>)

  return mockUseQuery
}
