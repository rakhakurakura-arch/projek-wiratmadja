import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  const categoryId = resolvedParams.id;

  try {
    const existing = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!existing) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
    }

    const productCount = await prisma.product.count({ where: { categoryId } });
    if (productCount > 0) {
      return NextResponse.json(
        { error: 'Tidak bisa menghapus kategori yang masih memiliki produk, pindahkan produk terlebih dahulu' },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: categoryId } });

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'DELETE_CATEGORY',
        details: `Menghapus kategori: "${existing.name}"`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Gagal menghapus kategori' }, { status: 500 });
  }
}
