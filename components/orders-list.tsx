import Link from 'next/link';
import { getWorkOrders } from '@/app/orders/actions';
import { SearchParams } from '@/types';

export async function OrdersList({ searchParams }: { searchParams: SearchParams }) {
  const { orders, totalPages, currentPage } = await getWorkOrders(searchParams);

  return (
    <div>
      <form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          name="search"
          placeholder="Search..."
          defaultValue={searchParams.search}
          className="input"
        />
        <select name="status" defaultValue={searchParams.status} className="input">
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <select name="priority" defaultValue={searchParams.priority} className="input">
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MED">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <button type="submit" className="btn">
          Filter
        </button>
      </form>

      {orders.length === 0 ? (
        <p className="text-sm text-zinc-500">No orders found.</p>
      ) : (
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {orders.map((o) => (
            <Link
              href={`/orders/${o.id}`}
              key={o.id}
              className="py-3 flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <div>
                <div className="font-medium">{o.title}</div>
                <div className="text-xs text-zinc-500">
                  Created by {o.createdBy?.email} · Assigned to {o.assignedTo?.email ?? '—'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge">{o.status.toLowerCase()}</span>
                <span className="badge">{o.priority.toLowerCase()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-zinc-500">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          {currentPage > 1 && (
            <Link
              href={`/orders?page=${currentPage - 1}`}
              className="btn"
            >
              Previous
            </Link>
          )}
          {currentPage < totalPages && (
            <Link
              href={`/orders?page=${currentPage + 1}`}
              className="btn"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}