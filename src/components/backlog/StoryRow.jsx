import React from "react";
import { Draggable } from "@hello-pangea/dnd";

const PRIORITY_CONFIG = {
  critical: {
    dotClass: "prio-dot p-critical",
    badgeClass: "priority-badge priority-critical-badge",
    label: "CRITICAL",
  },
  high: {
    dotClass: "prio-dot p-high",
    badgeClass: "priority-badge priority-high-badge",
    label: "HIGH",
  },
  medium: {
    dotClass: "prio-dot p-med",
    badgeClass: "priority-badge priority-medium-badge",
    label: "MEDIUM",
  },
  low: {
    dotClass: "prio-dot p-low",
    badgeClass: "priority-badge priority-low-badge",
    label: "LOW",
  },
};

const STATUS_CONFIG = {
  "in-progress": { className: "story-status s-prog", label: "En cours" },
  todo: { className: "story-status s-todo", label: "À faire" },
  done: { className: "story-status s-done", label: "Terminé" },
  review: { className: "story-status s-rev", label: "En revue" },
};

const TAG_CONFIG = {
  feature: { className: "tag t-feat", label: "Feature" },
  bug: { className: "tag t-bug", label: "Bug" },
  tech: { className: "tag t-tech", label: "Tech" },
};

function StoryRow({ task, onTagChange, index, isDragDisabled = false, onClick }) {
  if (!task) return null;

  const { id, title, priority, status, tags = [], points, assignee } = task;

  const prio = PRIORITY_CONFIG[priority?.toLowerCase()] ?? PRIORITY_CONFIG.low;
  const stat = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG["todo"];

  const getInitials = (name) =>
    name ? name.substring(0, 2).toUpperCase() : "—";

  const handleTagClick = (index, e) => {
    e.stopPropagation();
    if (!onTagChange) return;

    const types = ["feature", "bug", "tech"];
    const currentTag = tags[index]?.toLowerCase();

    let nextType = "feature";
    const currentIndex = types.indexOf(currentTag);
    if (currentIndex !== -1) {
      nextType = types[(currentIndex + 1) % types.length];
    }

    onTagChange(nextType, index);
  };

  return (
    <Draggable draggableId={task.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div 
          className="story-row"
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            backgroundColor: snapshot.isDragging ? 'var(--color-background-secondary)' : 'var(--color-background-primary)',
          }}
          onClick={onClick}
        >
          <span className="drag-handle" {...provided.dragHandleProps}>⠿</span>
          <div className={prio.dotClass} />
          <span className="story-id">{id}</span>
          <span className={prio.badgeClass}>{prio.label}</span>
          <span className="story-title">{title}</span>

          <div className="story-tags">
            {tags.map((tag, tagIdx) => {
              const t = TAG_CONFIG[tag.toLowerCase()] ?? {
                className: "tag",
                label: tag,
              };
              return (
                <span
                  key={`${tag}-${tagIdx}`}
                  className={t.className}
                  onClick={(e) => handleTagClick(tagIdx, e)}
                  style={{ cursor: "pointer" }}
                  title="Cliquez pour changer le tag"
                >
                  {t.label}
                </span>
              );
            })}
          </div>

          <span className={stat.className}>{stat.label}</span>
          <span className="story-pts">{points ? `${points} pts` : "-"}</span>

          {assignee ? (
            <div
              className="story-av"
              style={{
                background: assignee.bgColor || "#e6f1fb",
                color: assignee.textColor || "#185fa5",
              }}
              title={assignee.name || assignee}
            >
              {assignee.initials || getInitials(assignee.name || assignee)}
            </div>
          ) : (
            <div
              className="story-av"
              style={{ background: "#f4f5f7", color: "#8993a4" }}
            >
              —
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default StoryRow;
