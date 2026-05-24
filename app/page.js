'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import TaskBoard from '@/components/TaskBoard'
import TaskModal from '@/components/TaskModal'

// ─── Toast helper ────────────────────────────────────────────────────────────
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className={`toast ${type}`} role="alert" aria-live="polite">
      <span aria-hidden="true">{type === 'success' ? '✅' : '❌'}</span>
      {message}
    </div>
  )
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
function ConfirmDeleteDialog({ task, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="confirm-dialog">
        <div className="confirm-dialog-icon" aria-hidden="true">🗑️</div>
        <h2 className="confirm-dialog-title" id="confirm-title">Delete Task?</h2>
        <p className="confirm-dialog-msg">
          Are you sure you want to delete{' '}
          <strong>&ldquo;{task.title}&rdquo;</strong>?{' '}
          This action cannot be undone.
        </p>
        <div className="form-actions" style={{ justifyContent: 'center' }}>
          <button
            id="btn-confirm-cancel"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            id="btn-confirm-delete"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? '⏳ Deleting…' : '🗑️ Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [tasks, setTasks] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [pageError, setPageError] = useState(null)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Delete confirm state
  const [deletingTask, setDeletingTask] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Toast state
  const [toast, setToast] = useState(null)

  // ── Fetch tasks ──────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error(`Failed to load tasks (${res.status})`)
      const data = await res.json()
      setTasks(data)
      setPageError(null)
    } catch (err) {
      setPageError(err.message)
    } finally {
      setPageLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // ── Toast helper ─────────────────────────────────────────────────────────
  function showToast(message, type = 'success') {
    setToast({ message, type, key: Date.now() })
  }

  // ── Open modal to create ─────────────────────────────────────────────────
  function handleAddTask() {
    setEditingTask(null)
    setModalOpen(true)
  }

  // ── Open modal to edit ───────────────────────────────────────────────────
  function handleEditTask(task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  // ── Save (create or update) ──────────────────────────────────────────────
  async function handleSaveTask(formData, taskId) {
    if (taskId) {
      // UPDATE
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update task')

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? data : t))
      )
      showToast('Task updated successfully!')
    } else {
      // CREATE
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create task')

      setTasks((prev) => [data, ...prev])
      showToast('Task created successfully!')
    }
  }

  // ── Request delete (show confirm) ────────────────────────────────────────
  function handleRequestDelete(task) {
    setDeletingTask(task)
  }

  // ── Confirm delete ───────────────────────────────────────────────────────
  async function handleConfirmDelete() {
    if (!deletingTask) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/tasks/${deletingTask.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete task')
      }
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id))
      showToast('Task deleted.', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setDeleteLoading(false)
      setDeletingTask(null)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="app-wrapper">
      <Header tasks={tasks} onAddTask={handleAddTask} />

      <main className="main-content" id="main-content">
        {/* Page error */}
        {pageError && (
          <div className="error-banner" role="alert">
            ⚠️ {pageError}
            <button
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={fetchTasks}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {pageLoading ? (
          <div className="loading-state" aria-live="polite" aria-label="Loading tasks">
            <div className="spinner" aria-hidden="true" />
            <p className="loading-text">Loading your tasks…</p>
          </div>
        ) : (
          <TaskBoard
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleRequestDelete}
          />
        )}
      </main>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={modalOpen}
        task={editingTask}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
      />

      {/* Delete Confirm Dialog */}
      {deletingTask && (
        <ConfirmDeleteDialog
          task={deletingTask}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingTask(null)}
          loading={deleteLoading}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  )
}
