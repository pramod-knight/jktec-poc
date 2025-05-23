import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, StreamableFile, Put, HttpStatus } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleCheckGuard } from '../auth/role.guard';
import { RoleEnum } from '../enum/role.enum';
import { Roles } from '../auth/role.decorator';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags("document")
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard,RoleCheckGuard)
  @UseGuards(ThrottlerGuard)
  @Roles([RoleEnum.ADMIN,RoleEnum.EDITOR])
  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBearerAuth()
  @ApiBody({
    description: "Upload new document",
    schema: {
      type: "object",
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async create(@UploadedFile() document: Express.Multer.File) {
    const newDocument = await this.documentsService.create(document);

    return {
      status:1,
      message: "Document created",
      document: {
        id: newDocument.id,
      },
    };
  };

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard,RoleCheckGuard)
  @UseGuards(ThrottlerGuard)
  @Roles([RoleEnum.ADMIN,RoleEnum.EDITOR,RoleEnum.VISITOR])
  async getDocumentById(@Param('id') id:string){
    const file = await this.documentsService.retrieveDocumentById(id);

    return new StreamableFile(file);
  }

  @Put(":id")
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Upload new document to update",
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "document updated",
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
  })
  @ApiResponse({status:401,description:'Aunthorized to access'})
  @ApiResponse({status:400,description:'Validation failed'})
  @ApiResponse({status:403,description:'Resource access denied'})
  @ApiResponse({status:429,description:'To many requests'})
  @UseGuards(JwtAuthGuard,RoleCheckGuard)
  @UseGuards(ThrottlerGuard)
  @Roles([RoleEnum.ADMIN,RoleEnum.EDITOR])
  @UseInterceptors(FileInterceptor("file"))
  async updateDocument(
    @Param("id") id: string,
    @UploadedFile() document: Express.Multer.File,
  ) {
    await this.documentsService.updateDocument(id, document);

    return {
      status:1,
      message: "Document updated",
    };
  };

  @Delete(":id")
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: "document deleted",
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
  })
  @ApiResponse({status:401,description:'Aunthorized to access'})
  @ApiResponse({status:400,description:'Validation failed'})
  @ApiResponse({status:403,description:'Resource access denied'})
  @ApiResponse({status:429,description:'To many requests'})
  @UseGuards(JwtAuthGuard,RoleCheckGuard)
  @UseGuards(ThrottlerGuard)
  @Roles([RoleEnum.ADMIN,RoleEnum.EDITOR])
  async deleteDocument(@Param("id") id: string) {
    await this.documentsService.deleteDocument(id);

    return {
      status:1,
      message: "Document deleted",
    };
  }

}

