import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';

interface SortableItemProps {
  id: string;
  className?: string;
  children: (args: { dragHandleProps: Record<string, unknown> }) => ReactNode;
}

function SortableItem({ id, children, className }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} className={className} style={style}>
      {children({ dragHandleProps: { ...attributes, ...listeners } })}
    </div>
  );
}

interface DropAndSortProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  children: (item: T, dragHandleProps: Record<string, unknown>) => ReactNode;
  mode?: 'list' | 'grid';
  wrapClassName?: string;
}

export default function DropAndSort<T extends { id: string }>({
  items,
  onReorder,
  children,
  mode = 'list',
  wrapClassName = '',
}: DropAndSortProps<T>) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);

    onReorder(newItems);
  };

  const containerClass = mode === 'grid' ? 'flex flex-wrap -m-2' : 'space-y-4';

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className={containerClass}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} className={wrapClassName}>
              {(props) => children(item, props.dragHandleProps)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
