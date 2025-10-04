'use client';

// 1. Import `useActionState` from `react` instead of `useFormState` from `react-dom`
import { useActionState } from 'react';
import { createWorkOrder } from '@/app/orders/actions';

const initialState = {
  message: null,
  errors: {},
};

export default function NewOrderPage() {
  // 2. Rename the hook here
  const [state, formAction] = useActionState(createWorkOrder, initialState);

  return (
    <div className="card max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-4">New Work Order</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="title" className="label">
            Title
          </label>
          <input id="title" name="title" className="input" />
          {state.errors?.title && <p className="text-red-500 text-xs mt-1">{state.errors.title}</p>}
        </div>
        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea id="description" name="description" className="input" />
          {state.errors?.description && (
            <p className="text-red-500 text-xs mt-1">{state.errors.description}</p>
          )}
        </div>
        <div>
          <label htmlFor="priority" className="label">
            Priority
          </label>
          <select id="priority" name="priority" className="input">
            <option value="LOW">Low</option>
            <option value="MED">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
        {state.message && <p className="text-red-500 text-xs mt-1">{state.message}</p>}
      </form>
    </div>
  );
}