import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber } from "class-validator";

export class CreateIngestionDto {
  
  @ApiProperty({name: 'documentId', type: 'string', required: true,default:"7384549d-8fa5-4c65-9f4a-7cbb3bece301"  })
  @IsNumber()
  @IsDefined()
  documentId: number;
}