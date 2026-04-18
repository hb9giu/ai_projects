"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  pointerWithin,
  rectIntersection,
  MeasuringStrategy,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "@/components/KanbanColumn";
import { KanbanCardPreview } from "@/components/KanbanCardPreview";
import { createId, moveCard, type BoardData, type Column } from "@/lib/kanban";

type KanbanBoardProps = {
  board: BoardData;
  onBoardChange: React.Dispatch<React.SetStateAction<BoardData>>;
  onLogout?: () => void;
  onRenameColumn?: (columnId: string, title: string) => void;
  onAddCard?: (columnId: string, title: string, details: string) => void;
  onDeleteCard?: (columnId: string, cardId: string) => void;
  onMoveCard?: (activeId: string, overId: string, nextColumns: Column[]) => void;
  sidebar?: ReactNode;
};

export const KanbanBoard = ({
  board,
  onBoardChange,
  onLogout,
  onRenameColumn,
  onAddCard,
  onDeleteCard,
  onMoveCard,
  sidebar,
}: KanbanBoardProps) => {
  const setBoard = onBoardChange;
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const cardsById = useMemo(() => board.cards, [board.cards]);
  const lastOverId = useRef<string | null>(null);

  const collisionDetection: CollisionDetection = useMemo(
    () => (args) => {
      const filtered = {
        ...args,
        droppableContainers: args.droppableContainers.filter(
          (container) => container.id !== args.active.id
        ),
      };
      const pointerCollisions = pointerWithin(filtered);
      if (pointerCollisions.length > 0) {
        return pointerCollisions;
      }
      const intersections = rectIntersection(filtered);
      if (intersections.length > 0) {
        return intersections;
      }
      return closestCorners(filtered);
    },
    []
  );

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.data.current?.cardId as string | undefined;
    if (!activeId) {
      return;
    }
    setActiveCardId(activeId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCardId(null);

    const activeId = active.data.current?.cardId as string | undefined;
    const activeColumnId = active.data.current?.columnId as string | undefined;
    const overIdFromData = over?.data.current?.cardId as string | undefined;
    const overColumnFromData = over?.data.current?.columnId as string | undefined;
    const isCrossColumn =
      activeColumnId && overColumnFromData && activeColumnId !== overColumnFromData;
    const resolvedOverId =
      (overIdFromData && overIdFromData !== activeId && !isCrossColumn
        ? overIdFromData
        : undefined) ??
      overColumnFromData ??
      lastOverId.current;
    if (!activeId || !resolvedOverId || activeId === resolvedOverId) {
      lastOverId.current = null;
      return;
    }

    const overId = resolvedOverId;

    setBoard((prev) => {
      const nextColumns = moveCard(prev.columns, activeId, overId);
      onMoveCard?.(activeId, overId, nextColumns);
      return {
        ...prev,
        columns: nextColumns,
      };
    });

    lastOverId.current = null;
  };

  const handleDragOver = (event: { active: DragEndEvent["active"]; over: DragEndEvent["over"] }) => {
    if (event.over) {
      const activeColumnId = event.active.data.current?.columnId as string | undefined;
      const overCardId = event.over.data.current?.cardId as string | undefined;
      const overColumnId = event.over.data.current?.columnId as string | undefined;
      if (activeColumnId && overColumnId && activeColumnId !== overColumnId) {
        lastOverId.current = overColumnId;
        return;
      }
      lastOverId.current = overCardId ?? overColumnId ?? null;
    }
  };

  const handleRenameColumn = (columnId: string, title: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((column) =>
        column.id === columnId ? { ...column, title } : column
      ),
    }));
    onRenameColumn?.(columnId, title);
  };

  const handleAddCard = (columnId: string, title: string, details: string) => {
    if (onAddCard) {
      onAddCard(columnId, title, details);
      return;
    }
    const id = createId("card");
    setBoard((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [id]: { id, title, details: details || "No details yet." },
      },
      columns: prev.columns.map((column) =>
        column.id === columnId
          ? { ...column, cardIds: [...column.cardIds, id] }
          : column
      ),
    }));
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    setBoard((prev) => {
      return {
        ...prev,
        cards: Object.fromEntries(
          Object.entries(prev.cards).filter(([id]) => id !== cardId)
        ),
        columns: prev.columns.map((column) =>
          column.id === columnId
            ? {
              ...column,
              cardIds: column.cardIds.filter((id) => id !== cardId),
            }
            : column
        ),
      };
    });
    onDeleteCard?.(columnId, cardId);
  };

  const activeCard = activeCardId ? cardsById[activeCardId] : null;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 h-[420px] w-[420px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,_rgba(32,157,215,0.25)_0%,_rgba(32,157,215,0.05)_55%,_transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[520px] w-[520px] translate-x-1/4 translate-y-1/4 rounded-full bg-[radial-gradient(circle,_rgba(117,57,145,0.18)_0%,_rgba(117,57,145,0.05)_55%,_transparent_75%)]" />

      <main className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col gap-6 px-6 pb-12 pt-6">
        <header className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--stroke)] bg-white/80 px-5 py-3 shadow-[var(--shadow)] backdrop-blur">
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--navy-dark)]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="1" y="2" width="4" height="12" rx="1.5" fill="white" fillOpacity="0.9"/>
                <rect x="6" y="2" width="4" height="8" rx="1.5" fill="white" fillOpacity="0.9"/>
                <rect x="11" y="2" width="4" height="10" rx="1.5" fill="white" fillOpacity="0.9"/>
              </svg>
            </div>
            <div>
              <h1 className="font-display text-base font-semibold leading-tight text-[var(--navy-dark)]">Kanban Studio</h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--gray-text)]">Single Board</p>
            </div>
          </div>
          <div className="mx-1 h-6 w-px shrink-0 bg-[var(--stroke)]" />
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {board.columns.map((column) => (
              <div
                key={column.id}
                className="flex items-center gap-1.5 rounded-full border border-[var(--stroke)] px-3 py-1 text-[11px] font-semibold text-[var(--navy-dark)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-yellow)]" />
                {column.title}
              </div>
            ))}
          </div>
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--stroke)] px-4 py-1.5 text-xs font-semibold text-[var(--navy-dark)] transition hover:border-[var(--primary-blue)] hover:text-[var(--primary-blue)]"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M5 6.5H11M11 6.5L8.5 4M11 6.5L8.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 2H3C2.44772 2 2 2.44772 2 3V10C2 10.5523 2.44772 11 3 11H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Log out
            </button>
          ) : null}
        </header>

        <div className={sidebar ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]" : ""}>
          <DndContext
            sensors={sensors}
            measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
            collisionDetection={collisionDetection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="overflow-x-auto pb-1">
              <section className="grid gap-4" style={{ gridTemplateColumns: `repeat(${board.columns.length}, minmax(200px, 1fr))`, minWidth: `${board.columns.length * 210}px` }}>
                {board.columns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    cards={column.cardIds.map((cardId) => board.cards[cardId])}
                    onRename={handleRenameColumn}
                    onAddCard={handleAddCard}
                    onDeleteCard={handleDeleteCard}
                  />
                ))}
              </section>
            </div>
            <DragOverlay>
              {activeCard ? (
                <div className="w-[260px]">
                  <KanbanCardPreview card={activeCard} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
          {sidebar ? (
            <div className="lg:sticky lg:top-10 lg:self-start">
              {sidebar}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};
