import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import type { Card } from "@/lib/kanban";

type KanbanCardProps = {
  card: Card;
  columnId: string;
  onDelete: (cardId: string) => void;
};

export const KanbanCard = ({ card, columnId, onDelete }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: `card-${card.id}`,
      data: { cardId: card.id, columnId },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={clsx(
        "group rounded-2xl border border-transparent bg-white px-4 py-4 shadow-[0_12px_24px_rgba(3,33,71,0.08)]",
        "transition-all duration-150",
        isDragging && "opacity-60 shadow-[0_18px_32px_rgba(3,33,71,0.16)]"
      )}
      {...attributes}
      {...listeners}
      data-testid={`card-${card.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-display text-base font-semibold text-[var(--navy-dark)]">
            {card.title}
          </h4>
          {card.details ? (
            <p className="mt-2 text-sm leading-6 text-[var(--gray-text)]">
              {card.details}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
          className="shrink-0 rounded-lg p-1 text-[var(--gray-text)] opacity-0 transition group-hover:opacity-100 hover:bg-[var(--surface)] hover:text-red-400"
          aria-label={`Delete ${card.title}`}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M2 2L11 11M11 2L2 11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </article>
  );
};
