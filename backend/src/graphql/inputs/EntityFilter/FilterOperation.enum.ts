import { registerEnumType } from 'type-graphql';

export enum StringFilterOperation {
  EQUALS = 'equals',
  CONTAINS = 'contains',
}

registerEnumType(StringFilterOperation, {
  name: 'StringFilterOperation',
  description: 'The filter operation of a field',
});

// TODO: Add support for more filter operations (such as numeric, date, etc.)
export type FilterOperation = StringFilterOperation;
