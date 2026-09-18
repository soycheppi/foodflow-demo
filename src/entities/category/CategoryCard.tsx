import { useNavigate } from 'react-router-dom';
import { IconPen, IconDragHandle } from '@/shared/icons/ActionIcons';
import { Category } from '@/core/types/catalog';
import AppImage from '@/shared/ui/AppImage';
import { t } from '@/config/locales';

interface CategoryCardProps {
  category: Category;
  dragHandleProps?: Record<string, unknown>;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, dragHandleProps }) => {
  const navigate = useNavigate();

  if (!category || !category.nombre) {
    console.warn('Invalid category:', category);
    return null;
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/categories/edit/${category.id}`);
  };

  const handleClick = () => navigate(`/admin/products/${category.id || ''}`);

  return (
    <div
      className="group relative aspect-3/2 w-full overflow-hidden rounded-2xl bg-white dark:bg-[#1a1c21] shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-gray-200 dark:border-white/5"
      onClick={handleClick}
    >
      {}
      <AppImage
        src={category.imagenUrl}
        aspect="3/2"
        containerClassName="absolute inset-0"
        className="group-hover:scale-110"
      />

      {}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      {}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <h5 className="text-xl font-bold text-white mb-0 drop-shadow-md tracking-wide uppercase">
          {category.nombre}
        </h5>
      </div>

      {}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div
          {...dragHandleProps}
          onPointerDown={(e) => {
            e.stopPropagation();
            if (typeof dragHandleProps?.onPointerDown === 'function') {
              dragHandleProps.onPointerDown(e);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40 cursor-grab active:cursor-grabbing transition-colors"
          title={t.common.actions}
        >
          <IconDragHandle size={16} />
        </div>

        <button
          onClick={handleEdit}
          className="p-2 bg-brand-red text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors"
          title={t.admin.editCategory}
        >
          <IconPen size={14} />
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
