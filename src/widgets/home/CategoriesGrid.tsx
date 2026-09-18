import { memo } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@/shared/icons/ActionIcons';
import { useCategories } from '@/features/catalog-filters/catalogHooks';
import AppImage from '@/shared/ui/AppImage';
import { Category } from '@/core/types/catalog';
import { t } from '@/config/locales';

interface CategoriesGridProps {
  searchTerm: string;
}

const CategoriesGrid: React.FC<CategoriesGridProps> = memo(({ searchTerm }) => {
  const { data: categories = [], isLoading } = useCategories();

  const filtered = categories.filter((c) =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="container mx-auto px-4 pb-16 md:pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {t.catalog.featuredCategories}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t.catalog.featuredCategoriesSubtitle}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-48 sm:h-64 bg-gray-200 dark:bg-white/5 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length > 0 ? (
            filtered.map((cat: Category) => (
              <Link
                to={`/category/${cat.id}`}
                key={cat.id}
                className="group relative aspect-2/1 sm:aspect-3/2 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 block"
              >
                <AppImage
                  src={cat.imagenUrl}
                  alt={cat.nombre}
                  aspect="auto"
                  containerClassName="w-full h-full"
                  className="group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-2xl font-black text-white mb-1 group-hover:text-brand-red transition-colors">
                    {cat.nombre}
                  </h3>
                  <div className="flex items-center text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    <span>{t.common.viewAll}</span>
                    <IconArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform -translate-y-2.5 group-hover:translate-y-0">
                  <IconArrowRight size={14} className="-rotate-45" />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400 dark:text-gray-500">
              <p className="text-xl">{t.catalog.noCategoriesFound}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
});

CategoriesGrid.displayName = 'CategoriesGrid';

export default CategoriesGrid;
