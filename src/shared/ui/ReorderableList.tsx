import { useEffect, useState, ReactNode } from 'react';
import DropAndSort from './DropAndSort';
import { t } from '@/config/locales';

interface ReorderableListProps<T> {
  title: string;
  type: 'category' | 'product' | 'banner';
  items: T[];
  updateOrder: (items: T[]) => Promise<void>;
  CreateButton?: React.ComponentType;
  renderRow: (item: T, dragHandleProps: Record<string, unknown>) => ReactNode;
  loading?: boolean;
  error?: string | null;
}

export default function ReorderableList<T extends { id: string }>({
  title,
  type,
  items,
  updateOrder,
  CreateButton,
  renderRow,
  loading = false,
  error = null,
}: ReorderableListProps<T>) {
  const [localItems, setLocalItems] = useState<T[]>(items);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalItems(items);
    setHasChanges(false);
  }, [items]);

  const handleReorder = (newList: T[]) => {
    setLocalItems(newList);
    setHasChanges(true);
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      await updateOrder(localItems);
      setHasChanges(false);
    } catch (err) {
      console.error('Error saving order:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalItems(items);
    setHasChanges(false);
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-400 font-medium animate-pulse">
        {t.common.loading}
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-brand-red font-bold bg-red-50 dark:bg-red-900/10 rounded-xl">
        {error}
      </div>
    );

  const isGrid = type === 'category' || type === 'banner';
  const mode = isGrid ? 'grid' : 'list';
  const wrapClassName =
    type === 'category'
      ? 'w-full md:w-1/2 lg:w-1/3 p-2'
      : type === 'banner'
        ? 'w-full md:w-1/2 p-3'
        : 'w-full mb-2';

  return (
    <div className="w-full animate-fade-in-up">
      {}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h4 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {title}
            </h4>
            {hasChanges && (
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full animate-pulse">
                {t.admin.unsavedChanges}
              </span>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {t.admin.systemManagementOf(type)}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {hasChanges && (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-2 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 py-2 px-5 rounded-xl font-bold shadow-sm hover:bg-gray-300 dark:hover:bg-white/20 transition-all text-sm uppercase tracking-wide disabled:opacity-50"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleSaveOrder}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 text-white py-2 px-5 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all text-sm uppercase tracking-wide disabled:opacity-50"
              >
                {saving ? t.common.saving : `💾 ${t.admin.saveOrder}`}
              </button>
            </>
          )}
          {CreateButton && <CreateButton />}
        </div>
      </div>

      {}
      <div className="bg-white dark:bg-[#1a1c21] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6">
        {localItems.length > 0 ? (
          <DropAndSort
            items={localItems}
            onReorder={handleReorder}
            mode={mode}
            wrapClassName={wrapClassName}
          >
            {(item, dragHandleProps) => renderRow(item, dragHandleProps)}
          </DropAndSort>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                ></path>
              </svg>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {t.admin.noItemsTitle(type)}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t.admin.noItemsSubtitle}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
