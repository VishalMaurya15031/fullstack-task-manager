'use client'

import TaskCard from './TaskCard'

const COLUMNS = [
  {
    key: 'todo',
    label: 'Todo',
    emptyIcon: '📋',
    emptyText: 'No tasks yet. Create one!',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    emptyIcon: '🔄',
    emptyText: 'Nothing in progress.',
  },
  {
    key: 'completed',
    label: 'Completed',
    emptyIcon: '✅',
    emptyText: 'No completed tasks yet.',
  },
]

export default function TaskBoard({ tasks, onEdit, onDelete }) {
  return (
    <section aria-label="Task board">
      <div className="board-header">
        <span className="board-title">Board View</span>
      </div>
      <div className="board" role="list">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key)
          return (
            <div
              key={col.key}
              className="column"
              role="listitem"
              aria-label={`${col.label} column`}
            >
              {/* Column header */}
              <div className="column-header">
                <div className="column-title-row">
                  <span
                    className={`column-indicator ${col.key}`}
                    aria-hidden="true"
                  />
                  <span className={`column-name ${col.key}`}>{col.label}</span>
                </div>
                <span
                  className={`column-count ${col.key}`}
                  aria-label={`${colTasks.length} tasks`}
                >
                  {colTasks.length}
                </span>
              </div>

              <hr className={`column-divider ${col.key}`} aria-hidden="true" />

              {/* Task cards */}
              <div className="column-cards" role="list" aria-label={`${col.label} tasks`}>
                {colTasks.length === 0 ? (
                  <div className="column-empty" aria-label={col.emptyText}>
                    <span className="column-empty-icon" aria-hidden="true">
                      {col.emptyIcon}
                    </span>
                    <span className="column-empty-text">{col.emptyText}</span>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
