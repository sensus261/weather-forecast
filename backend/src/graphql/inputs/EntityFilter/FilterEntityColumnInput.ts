import { InputType, Field } from 'type-graphql';

import { FilterOperation, StringFilterOperation } from './FilterOperation.enum';

export const FilterEntityColumnInput = <
  T extends string,
  G extends FilterOperation
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ColumnType: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ColumnFilterOperation: any
) => {
  @InputType({ isAbstract: true })
  abstract class FilterEntityColumnInputClass {
    @Field(() => ColumnFilterOperation)
    operation: G;

    @Field(() => ColumnType)
    value: T;
  }

  return FilterEntityColumnInputClass;
};

@InputType()
export class StringFilterEntityColumnInput extends FilterEntityColumnInput(
  String,
  StringFilterOperation
) {}
