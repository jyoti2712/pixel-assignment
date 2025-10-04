'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

const UpdateWorkOrderSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['LOW', 'MED', 'HIGH']),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE']).optional(),
  assignedToId: z.string().optional(),
});

export async function getOrderById(id: string) {
  const session = await getServerSession();
  if (!session?.user) throw new Error('Unauthenticated');

  const where: Prisma.WorkOrderWhereUniqueInput = { id };
  if (session.user.role === 'USER') {
    (where as any).createdById = session.user.id;
  }

  return await prisma.workOrder.findUnique({
    where,
    include: { createdBy: true, assignedTo: true },
  });
}

export async function getUsers() {
  const session = await getServerSession();
  if (session?.user.role !== 'MANAGER') return [];
  return await prisma.user.findMany();
}

export async function updateWorkOrder(prevState: any, formData: FormData) {
  const session = await getServerSession();
  if (!session?.user) throw new Error('Unauthenticated');

  const validatedFields = UpdateWorkOrderSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...data } = validatedFields.data;

  try {
    const order = await prisma.workOrder.findUnique({ where: { id } });
    if (!order) throw new Error('Order not found');

    if (session.user.role === 'USER' && order.createdById !== session.user.id) {
      throw new Error('Unauthorized');
    }

    const updateData: Prisma.WorkOrderUpdateInput = {
      title: data.title,
      description: data.description,
      priority: data.priority,
    };

    if (session.user.role === 'MANAGER') {
      updateData.status = data.status;
      updateData.assignedToId = data.assignedToId || null;
    }

    await prisma.workOrder.update({
      where: { id },
      data: updateData,
    });
  } catch (error) {
    return {
      message: 'Failed to update work order.',
    };
  }

  revalidatePath(`/orders/${id}`);
  revalidatePath('/orders');
  return {
    message: null,
    errors: {},
  };
}