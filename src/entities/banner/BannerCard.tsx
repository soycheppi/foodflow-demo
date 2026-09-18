import { useNavigate } from 'react-router-dom';
import { IconPen, IconDragHandle, IconTrash } from '@/shared/icons/ActionIcons';
import { Banner } from '@/core/types/banner';
import AppImage from '@/shared/ui/AppImage';
import { useDeleteBanner, useUpdateBanner } from '@/entities/banner/bannerHooks';
import { t } from '@/config/locales';

interface BannerCardProps {
  banner: Banner;
  dragHandleProps?: Record<string, unknown>;
}

const BannerCard: React.FC<BannerCardProps> = ({ banner, dragHandleProps }) => {
  const navigate = useNavigate();
  const { mutate: deleteBanner } = useDeleteBanner();
  const { mutate: updateBanner } = useUpdateBanner();
  const isDefault = banner.id === 'default';

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/banners/edit/${banner.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.admin.deleteConfirmBanner)) {
      deleteBanner(banner.id);
    }
  };

  const toggleActive = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateBanner({ id: banner.id, updates: { active: !banner.active } });
  };

  return (
    <div
      className={`group relative aspect-video w-full overflow-hidden rounded-2xl bg-white dark:bg-[#1a1c21] shadow-md transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-white/5 ${!banner.active ? 'opacity-50 grayscale' : ''}`}
    >
      {}
      <AppImage
        src={banner.imageUrl}
        aspect="video"
        containerClassName="absolute inset-0"
        className="group-hover:scale-105 transition-transform duration-700"
      />

      {}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      {}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h5 className="text-2xl font-black text-white mb-1 drop-shadow-lg tracking-tight uppercase">
          {banner.title}
        </h5>
        {banner.description && (
          <p className="text-white/80 text-sm font-medium line-clamp-2 max-w-lg drop-shadow-md">
            {banner.description}
          </p>
        )}
      </div>

      {}
      <div className="absolute top-4 left-4">
        <button
          onClick={toggleActive}
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
            banner.active
              ? 'bg-green-500/20 text-green-400 border-green-500/30'
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}
        >
          {banner.active ? t.common.available : t.common.outOfStock}
        </button>
      </div>

      {}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2.5 group-hover:translate-y-0">
        {!isDefault && (
          <div
            {...dragHandleProps}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (typeof dragHandleProps?.onPointerDown === 'function') {
                dragHandleProps.onPointerDown(e);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 cursor-grab active:cursor-grabbing transition-colors shadow-lg"
            title={t.common.actions}
          >
            <IconDragHandle size={18} />
          </div>
        )}

        {}
        <button
          onClick={handleEdit}
          className="p-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl shadow-lg hover:bg-white/40 transition-colors"
          title={t.admin.editBanner}
        >
          <IconPen size={16} />
        </button>

        {}
        {!isDefault && (
          <button
            onClick={handleDelete}
            className="p-2.5 bg-brand-red/80 backdrop-blur-md text-white rounded-xl shadow-lg hover:bg-brand-red transition-colors"
            title={t.common.delete}
          >
            <IconTrash size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BannerCard;
