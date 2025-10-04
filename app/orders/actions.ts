'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SearchParams } from '@/types';
import { Prisma } from '@prisma/client';

const WorkOrderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['LOW', 'MED', 'HIGH']),
});

export async function getWorkOrders(searchParams: SearchParams) {
  const session = await getServerSession();
  if (!session?.user) throw new Error('Unauthenticated');

  const { search, status, priority, page = '1' } = searchParams;
  const currentPage = parseInt(page);
  const pageSize = 10;

  const where: Prisma.WorkOrderWhereInput = {
    ...(session.user.role === 'USER' && { createdById: session.user.id }),
    ...(search && {
      OR: [
        // The `mode: 'insensitive'` option has been removed from these two blocks
        { title: { contains: search } },
        { description: { contains: search } },
      ],
    }),
    ...(status && { status }),
    ...(priority && { priority }),
  };

  const [orders, total] = await Promise.all([
    prisma.workOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { createdBy: true, assignedTo: true },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    }),
    prisma.workOrder.count({ where }),
  ]);

  return {
    orders,
    totalPages: Math.ceil(total / pageSize),
    currentPage,
  };
}

export async function createWorkOrder(prevState: any, formData: FormData) {
  const session = await getServerSession();
  if (!session?.user) throw new Error('Unauthenticated');

  const validatedFields = WorkOrderSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.workOrder.create({
      data: {
        ...validatedFields.data,
        status: 'OPEN',
        createdById: session.user.id,
      },
    });
  } catch (error) {
    return {
      message: 'Failed to create work order.',
    };
  }

  revalidatePath('/orders');
  redirect('/orders');
}