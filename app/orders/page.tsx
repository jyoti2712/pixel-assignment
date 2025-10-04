import { Suspense } from 'react';
import Link from 'next/link';
import { OrdersList } from '@/components/orders-list';
import { SearchParams } from '@/types';

export default function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Work Orders</h1>
        <Link href="/orders/new" className="btn btn-primary">
          New Order
        </Link>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <OrdersList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}