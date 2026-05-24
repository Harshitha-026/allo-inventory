import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const warehouse = await prisma.warehouse.create({
    data: {
      name: 'Warehouse A',
      location: 'Bangalore',
    },
  })

  const product = await prisma.product.create({
    data: {
      name: 'iPhone 15',
      description: 'Apple smartphone',
    },
  })

  await prisma.inventory.create({
    data: {
      productId: product.id,
      warehouseId: warehouse.id,
      totalQuantity: 5,
    },
  })
}

main()