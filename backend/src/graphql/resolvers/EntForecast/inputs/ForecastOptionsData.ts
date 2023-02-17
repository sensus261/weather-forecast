import { IsUUID } from 'class-validator';
import { InputType, Field, ID } from 'type-graphql';

@InputType()
class ForecastOptionsData {
  @Field(() => ID)
  @IsUUID(4)
  cityId: string;
}

export default ForecastOptionsData;
