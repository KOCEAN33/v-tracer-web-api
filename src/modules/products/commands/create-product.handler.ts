import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(readonly productRepository: ProductRepository) {}

  async execute(command: CreateProductCommand): Promise<CreateProductCommand> {
    const { name, url } = command;

    return this.productRepository.createProduct(name, url);
  }
}
