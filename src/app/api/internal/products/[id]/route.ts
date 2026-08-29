import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  const productId = resolvedParams.id;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Gagal mengambil data produk' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  const productId = resolvedParams.id;

  try {
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    const body = await request.json();
    const { title, slug, description, price, stock, imageUrl, categoryId, isFeatured, variants } = body;

    if (!title || !price || !imageUrl || !categoryId) {
      return NextResponse.json({ error: 'Field mandatory tidak lengkap.' }, { status: 400 });
    }

    // Delete existing variants and re-create updated ones
    await prisma.productVariant.deleteMany({ where: { productId } });

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
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
      include: {
        variants: true,
      },
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE_PRODUCT',
        details: `Mengubah produk: "${title}" (Rp ${price.toLocaleString('id-ID')})`,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Gagal mengubah produk' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  const productId = resolvedParams.id;

  try {
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: productId } });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'DELETE_PRODUCT',
        details: `Menghapus produk: "${existingProduct.title}"`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Gagal menghapus produk' }, { status: 500 });
  }
}
