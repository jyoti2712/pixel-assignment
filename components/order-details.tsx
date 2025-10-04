'use client';

import { useState } from 'react';
// 1. Import `useActionState` from `react` instead of `useFormState` from `react-dom`
import { useActionState } from 'react';
import { WorkOrder, User } from '@prisma/client';
import { updateWorkOrder } from '@/app/orders/[id]/actions';
import { useSession } from 'next-auth/react';

const initialState = {
  message: null,
  errors: {},
};

export function OrderDetails({
  order,
  users,
}: {
  order: WorkOrder & { createdBy: User; assignedTo: User | null };
  users: User[];
}) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  // 2. Rename the hook here
  const [state, formAction] = useActionState(updateWorkOrder, initialState);

  const canEdit =
    session?.user.role === 'MANAGER' || (session?.user.role === 'USER' && session.user.id === order.createdById);

  return (
    <div>
      {isEditing ? (
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={order.id} />
          <div>
            <label htmlFor="title" className="label">
              Title
            </label>
            <input id="title" name="title" defaultValue={order.title} className="input" />
            {state.errors?.title && <p className="text-red-500 text-xs mt-1">{state.errors.title}</p>}
          </div>
          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={order.description}
              className="input"
            />
            {state.errors?.description && (
              <p className="text-red-500 text-xs mt-1">{state.errors.description}</p>
            )}
          </div>
          <div>
            <label htmlFor="priority" className="label">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue={order.priority}
              className="input"
            >
              <option value="LOW">Low</option>
              <option value="MED">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          {session?.user.role === 'MANAGER' && (
            <>
              <div>
                <label htmlFor="status" className="label">
                  Status
                </label>
                <select id="status" name="status" defaultValue={order.status} className="input">
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div>
                <label htmlFor="assignedToId" className="label">
                  Assigned To
                </label>
                <select
                  id="assignedToId"
                  name="assignedToId"
                  defaultValue={order.assignedToId ?? ''}
                  className="input"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn">
              Cancel
            </button>
          </div>
          {state.message && <p className="text-red-500 text-xs mt-1">{state.message}</p>}
        </form>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">{order.title}</h1>
            {canEdit && (
              <button onClick={() => setIsEditing(true)} className="btn">
                Edit
              </button>
            )}
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">{order.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="label">Priority</p>
              <p>{order.priority}</p>
            </div>
            <div>
              <p className="label">Status</p>
              <p>{order.status}</p>
            </div>
            <div>
              <p className="label">Created By</p>
              <p>{order.createdBy.email}</p>
            </div>
            <div>
              <p className="label">Assigned To</p>
              <p>{order.assignedTo?.email ?? 'Unassigned'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}