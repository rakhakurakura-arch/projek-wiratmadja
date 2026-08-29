import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, address, notes, items } = body;

    if (!customerName || !customerPhone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    let calculatedTotalAmount = 0;
    const verifiedOrderItems: Array<{
      productId: string;
      productName: string;
      variantInfo: string | null;
      price: number;
      quantity: number;
    }> = [];

    for (const item of items) {
      const { productId, variantId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        return NextResponse.json({ error: 'Invalid order item parameters' }, { status: 400 });
      }

      // Fetch product from DB
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { variants: true },
      });

      if (!product) {
        return NextResponse.json({ error: `Produk dengan ID ${productId} tidak ditemukan` }, { status: 404 });
      }

      let itemPrice = product.price;
      let variantInfo: string | null = item.variantInfo || null;

      // If variantId is provided, verify against DB variant price
      if (variantId) {
        const variant = product.variants.find((v) => v.id === variantId);
        if (variant) {
          if (variant.price !== null && variant.price !== undefined) {
            itemPrice = variant.price;
          }
          variantInfo = `${variant.name}: ${variant.value}`;
        }
      }

      const lineTotal = itemPrice * quantity;
      calculatedTotalAmount += lineTotal;

      verifiedOrderItems.push({
        productId: product.id,
        productName: item.productName || product.title,
        variantInfo,
        price: itemPrice,
        quantity,
      });
    }

    const newOrder = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        address,
        notes: notes || null,
        totalAmount: calculatedTotalAmount,
        status: 'PENDING',
        items: {
          create: verifiedOrderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed creating order' }, { status: 500 });
  }
}
