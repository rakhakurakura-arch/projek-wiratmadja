import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
  }

  const resolvedParams = await params;
  const targetId = resolvedParams.id;

  if (targetId === session.id) {
    return NextResponse.json({ error: 'Tidak dapat menghapus akun sendiri.' }, { status: 400 });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { id: targetId } });
    if (!existing) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: targetId } });

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'DELETE_USER',
        details: `Menghapus kontributor internal: "${existing.name}" (${existing.email})`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Gagal menghapus pengguna' }, { status: 500 });
  }
}
