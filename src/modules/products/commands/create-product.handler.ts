import { ConflictException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(readonly productRepository: ProductRepository) {}

  async execute(command: CreateProductCommand) {
    const { name, handle, url, companyId } = command;

    const checkHandle =
      await this.productRepository.getProductByProductHandle(handle);

    if (checkHandle) {
      throw new ConflictException('this handle already exists');
    }

    const product = await this.productRepository.createProduct(
      name,
      handle,
      url,
      companyId,
    );

    const productId = Number(product.insertId);

    return { message: 'product created successfully', productId };
  }
}
