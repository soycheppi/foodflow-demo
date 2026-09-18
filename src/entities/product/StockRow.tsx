import { useNavigate, useLocation } from 'react-router-dom';
import { IconPen, IconDragHandle } from '@/shared/icons/ActionIcons';
import { Product } from '@/core/types/catalog';
import { t } from '@/config/locales';

interface StockRowProps {
  product: Product;
  category: string;
  dragHandleProps?: Record<string, unknown>;
}

const StockRow: React.FC<StockRowProps> = ({ product, category, dragHandleProps }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isBack = location.pathname.startsWith('/admin');

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/products/${category}/edit/${product.id}`);
  };

  const stopDrag = (e: React.MouseEvent | React.PointerEvent) => e.stopPropagation();

  const isLowStock = product.stock < 5;
  const statusBorder = isLowStock
    ? 'border-l-4 border-l-brand-red'
    : 'border-l-4 border-l-transparent hover:border-l-gray-300 dark:hover:border-l-gray-700';

  return (
    <div
      className={`group relative flex items-center justify-between p-4 bg-white dark:bg-[#1a1c21] rounded-2xl shadow-sm border-y border-r border-gray-100 dark:border-white/5 transition-all hover:shadow-md ${statusBorder}`}
    >
      {}
      <div className="grow min-w-0 pr-4">
        <h5 className="font-bold text-gray-900 dark:text-white truncate">{product.nombre}</h5>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-mono bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">
            ${typeof product.precio === 'number' ? product.precio.toFixed(2) : '—'}
          </span>
          {product.imagenUrl && (
            <span className="text-xs text-brand-blue dark:text-brand-red flex items-center gap-1">
              {t.catalog.imageLoaded}
            </span>
          )}
        </div>
      </div>

      {}
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right mr-2 hidden sm:block">
          <span className="block text-xs uppercase tracking-wider font-bold text-gray-400">
            {t.admin.stockLabel.split(' ')[0]}
          </span>
          <span
            className={`font-mono font-bold ${product.stock < 5 ? 'text-red-500' : 'text-green-500'}`}
          >
            {product.stock}
          </span>
        </div>

        {isBack && (
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-gray-400 hover:text-brand-blue dark:hover:text-brand-red hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              draggable="false"
              onPointerDown={stopDrag}
              onClick={handleEdit}
              title={t.admin.editProduct}
            >
              <IconPen size={16} />
            </button>

            <div
              className="p-2 text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              {...dragHandleProps}
              onPointerDown={(e) => {
                stopDrag(e);
                if (typeof dragHandleProps?.onPointerDown === 'function') {
                  dragHandleProps.onPointerDown(e);
                }
              }}
              title={t.common.actions}
            >
              <IconDragHandle size={20} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockRow;
