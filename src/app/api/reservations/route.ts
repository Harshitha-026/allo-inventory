import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { inventoryId, quantity } = body

    const result = await prisma.$transaction(
      async (tx) => {
        const inventory =
          await tx.inventory.findUnique({
            where: {
              id: inventoryId,
            },
          })

        if (!inventory) {
          return {
            error: 'Inventory not found',
            status: 404,
          }
        }

        const available =
          inventory.totalQuantity -
          inventory.reservedQuantity

        if (available < quantity) {
          return {
            error: 'Not enough stock',
            status: 409,
          }
        }

        await tx.inventory.update({
          where: {
            id: inventoryId,
          },
          data: {
            reservedQuantity: {
              increment: quantity,
            },
          },
        })

        const reservation =
          await tx.reservation.create({
            data: {
              inventoryId,
              quantity,
              expiresAt: new Date(
                Date.now() + 10 * 60 * 1000,
              ),
            },
          })

        return {
          reservation,
          status: 200,
        }
      },
    )

    if ('error' in result) {
      return NextResponse.json(
        {
          error: result.error,
        },
        {
          status: result.status,
        },
      )
    }

    return NextResponse.json(
      result.reservation,
    )
  } catch {
    return NextResponse.json(
      {
        error: 'Server error',
      },
      {
        status: 500,
      },
    )
  }
}