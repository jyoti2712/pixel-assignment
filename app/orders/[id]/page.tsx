import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getOrderById, getUsers } from '@/app/orders/[id]/actions';
import { OrderDetails } from '@/components/order-details';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const users = await getUsers();

  return (
    <div className="card">
      <Suspense fallback={<p>Loading...</p>}>
        <OrderDetails order={order} users={users} />
      </Suspense>
    </div>
  );
}