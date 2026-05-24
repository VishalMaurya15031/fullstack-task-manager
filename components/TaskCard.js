'use client'

const STATUS_LABELS = {
  todo: 'Todo',
  in_progress: 'In Progress',
  completed: 'Completed',
}

function formatDueDate(dateStr, status) {
  if (!dateStr) return null

  const due = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diffMs = due - today
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  let label = ''
  if (diffDays === 0) label = 'Due today'
  else if (diffDays === 1) label = 'Due tomorrow'
  else if (diffDays === -1) label = '1 day overdue'
  else if (diffDays < -1) label = `${Math.abs(diffDays)} days overdue`
  else label = due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  let className = 'task-due-date'
  if (status === 'completed') className += ' completed-date'
  else if (diffDays < 0) className += ' overdue'
  else if (diffDays <= 2) className += ' due-soon'

  return { label, className }
}

export default function TaskCard({ task, onEdit, onDelete }) {
  const { id, title, description, status, due_date } = task
  const dueDateInfo = formatDueDate(due_date, status)

  function handleEdit(e) {
    e.stopPropagation()
    onEdit(task)
  }

  function handleDelete(e) {
    e.stopPropagation()
    onDelete(task)
  }

  return (
    <article
      className={`task-card ${status}`}
      role="article"
      aria-label={`Task: ${title}`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onEdit(task) }}
    >
      {/* Top row: title + action buttons */}
      <div className="task-card-top">
        <h3 className={`task-title ${status === 'completed' ? 'completed' : ''}`}>
          {title}
        </h3>
        <div className="task-actions" role="group" aria-label="Task actions">
          <button
            id={`btn-edit-task-${id}`}
            className="task-action-btn"
            onClick={handleEdit}
            aria-label={`Edit task: ${title}`}
            title="Edit task"
          >
            ✏️
          </button>
          <button
            id={`btn-delete-task-${id}`}
            className="task-action-btn delete"
            onClick={handleDelete}
            aria-label={`Delete task: ${title}`}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="task-description">{description}</p>
      )}

      {/* Footer: due date + status badge */}
      <div className="task-footer">
        {dueDateInfo ? (
          <span className={dueDateInfo.className}>
            <span className="task-due-icon" aria-hidden="true">📅</span>
            {dueDateInfo.label}
          </span>
        ) : (
          <span className="task-due-date">
            <span className="task-due-icon" aria-hidden="true">📅</span>
            No due date
          </span>
        )}

        <span className={`status-badge ${status}`} aria-label={`Status: ${STATUS_LABELS[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>
    </article>
  )
}
