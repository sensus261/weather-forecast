import { IsNumber, IsOptional } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class EntityPaginationInput {
  @Field()
  @IsNumber()
  first: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  after?: number;
}
