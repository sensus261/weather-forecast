import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  schema: process.env.VITE_GRAPHQL_ENDPOINT,
  documents: 'src/apollo/graphql/**/*.graphql',
  generates: {
    'src/apollo/graphql/types/': {
      preset: 'client',
      plugins: [],
    },
  },
}

export default config
