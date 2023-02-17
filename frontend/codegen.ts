
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3001/api",
  documents: "src/apollo/graphql/**/*.graphql",
  generates: {
    "src/apollo/graphql/types/": {
      preset: "client",
      plugins: [],
    }
  }
};

export default config;
