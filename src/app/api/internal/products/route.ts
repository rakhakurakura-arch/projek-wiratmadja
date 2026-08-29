import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: { name: true, slug: true },
        },
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching internal products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, description, price, stock, imageUrl, categoryId, isFeatured, variants } = body;

    if (!title || !price || !imageUrl || !categoryId) {
      return NextResponse.json({ error: 'Field mandatory tidak lengkap.' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        description,
        price,
        stock,
        imageUrl,
        categoryId,
        isFeatured: Boolean(isFeatured),
        variants: {
          create: (variants || []).map((v: any) => ({
            name: v.name || 'Varian',
            value: v.value,
            price: v.price || null,
            stock: v.stock || 10,
          })),
        },
      },
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'CREATE_PRODUCT',
        details: `Menambahkan produk baru: "${title}" (Rp ${price.toLocaleString('id-ID')})`,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Gagal menambahkan produk' }, { status: 500 });
  }
}
