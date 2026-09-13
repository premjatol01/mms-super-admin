import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ModalShell from './ModalShell';

const schema = z.object({
  name: z.string().min(1, 'Feature name is required.'),
  description: z.string().min(1, 'Description is required.'),
  status: z.enum(['Enabled', 'Disabled']),
  displayOrder: z.coerce.number().int().min(1, 'Display order must be at least 1.'),
});

export default function OfferFeatureFormModal({ feature, onClose, onSave }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: feature?.name ?? '',
      description: feature?.description ?? '',
      status: feature?.status ?? 'Enabled',
      displayOrder: feature?.displayOrder ?? 1,
    },
  });

  useEffect(() => {
    if (feature) {
      reset({
        name: feature.name,
        description: feature.description,
        status: feature.status,
        displayOrder: feature.displayOrder,
      });
    }
  }, [feature, reset]);

  if (!feature) return null;

  const onSubmit = (values) => {
    onSave(feature.id, values);
  };

  return (
    <ModalShell title={`Edit ${feature.name}`} onClose={onClose} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-secondary" htmlFor="feature-key">
            Feature Key
          </label>
          <input
            id="feature-key"
            value={feature.key}
            readOnly
            className="mt-1 w-full rounded-lg border border-theme bg-gray-50 px-3 py-2 text-sm text-secondary"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-secondary" htmlFor="feature-name">
            Feature Name
          </label>
          <input
            id="feature-name"
            {...register('name')}
            className="mt-1 w-full rounded-lg border border-theme px-3 py-2 text-sm text-theme focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-secondary" htmlFor="feature-description">
            Description
          </label>
          <textarea
            id="feature-description"
            rows={3}
            {...register('description')}
            className="mt-1 w-full rounded-lg border border-theme px-3 py-2 text-sm text-theme focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-secondary" htmlFor="feature-status">
              Status
            </label>
            <select
              id="feature-status"
              {...register('status')}
              className="mt-1 w-full rounded-lg border border-theme px-3 py-2 text-sm text-theme focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-secondary" htmlFor="feature-order">
              Display Order
            </label>
            <input
              id="feature-order"
              type="number"
              min={1}
              {...register('displayOrder')}
              className="mt-1 w-full rounded-lg border border-theme px-3 py-2 text-sm text-theme focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            {errors.displayOrder && <p className="mt-1 text-xs text-rose-600">{errors.displayOrder.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-theme px-4 py-2 text-sm font-medium text-theme hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors disabled:opacity-60"
          >
            Save changes
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
