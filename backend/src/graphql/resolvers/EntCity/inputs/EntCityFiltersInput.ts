import { IsObject } from 'class-validator';
import { InputType, Field } from 'type-graphql';

import { StringFilterEntityColumnInput } from '@src/graphql/inputs/EntityFilter/FilterEntityColumnInput';

@InputType()
class EntCityFiltersInput {
  @Field(() => StringFilterEntityColumnInput)
  @IsObject()
  name: StringFilterEntityColumnInput;
}

export default EntCityFiltersInput;
