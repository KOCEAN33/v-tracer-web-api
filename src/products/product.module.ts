import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";

const commandHandlers = []

const queryHandlers = []

const eventHandlers = []

@Module({
  imports: [],
  controllers:[ProductController],
  providers:[]
})

export class ProductModule {}