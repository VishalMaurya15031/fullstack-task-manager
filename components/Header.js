'use client'

export default function Header({ tasks, onAddTask }) {
  const total = tasks.length
  const todo = tasks.filter((t) => t.status === 'todo').length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const completed = tasks.filter((t) => t.status === 'completed').length

  return (
    <header className="header">
      <div className="header-inner">
        {/* Brand */}
        <div className="header-brand">
          <div className="header-logo" aria-hidden="true">⚡</div>
          <div>
            <h1 className="header-title">TaskFlow</h1>
            <p className="header-subtitle">Mini Task Management Dashboard</p>
          </div>
        </div>

        {/* Stats */}
        <div className="header-stats" role="status" aria-label="Task statistics">
          <div className="stat-chip total" title="Total tasks">
            <span className="stat-dot" aria-hidden="true" />
            <span>{total} Total</span>
          </div>
          <div className="stat-chip todo" title="Todo tasks">
            <span className="stat-dot" aria-hidden="true" />
            <span>{todo} Todo</span>
          </div>
          <div className="stat-chip inprogress" title="In Progress tasks">
            <span className="stat-dot" aria-hidden="true" />
            <span>{inProgress} In Progress</span>
          </div>
          <div className="stat-chip completed" title="Completed tasks">
            <span className="stat-dot" aria-hidden="true" />
            <span>{completed} Done</span>
          </div>
        </div>

        {/* Add Task CTA */}
        <button
          id="btn-add-task-header"
          className="btn-add-task"
          onClick={onAddTask}
          aria-label="Create new task"
        >
          <span className="icon" aria-hidden="true">+</span>
          New Task
        </button>
      </div>
    </header>
  )
}
