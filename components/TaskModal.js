'use client'

import { useState, useEffect, useRef } from 'react'

const INITIAL_FORM = {
  title: '',
  description: '',
  status: 'todo',
  due_date: '',
}

export default function TaskModal({ isOpen, task, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const titleRef = useRef(null)

  const isEditing = Boolean(task)

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setForm({
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'todo',
          due_date: task.due_date || '',
        })
      } else {
        setForm(INITIAL_FORM)
      }
      setError(null)
      // Focus title input after animation
      setTimeout(() => titleRef.current?.focus(), 100)
    }
  }, [isOpen, task])

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Task title is required.')
      titleRef.current?.focus()
      return
    }
    setLoading(true)
    setError(null)
    try {
      await onSave(form, task?.id)
      onClose()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleOverlayClick}
    >
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {isEditing ? '✏️ Edit Task' : '✨ New Task'}
          </h2>
          <button
            id="btn-modal-close"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="error-banner" role="alert" aria-live="polite">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form className="form" onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form-field">
            <label className="form-label" htmlFor="task-title">
              Title <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              id="task-title"
              name="title"
              ref={titleRef}
              type="text"
              className="form-input"
              placeholder="e.g. Design landing page"
              value={form.title}
              onChange={handleChange}
              maxLength={120}
              required
              aria-required="true"
            />
          </div>

          {/* Description */}
          <div className="form-field">
            <label className="form-label" htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              name="description"
              className="form-textarea"
              placeholder="Add a description (optional)…"
              value={form.description}
              onChange={handleChange}
              maxLength={600}
              aria-label="Task description"
            />
          </div>

          {/* Status + Due Date row */}
          <div className="form-row">
            <div className="form-field">
              <label className="form-label" htmlFor="task-status">
                Status
              </label>
              <select
                id="task-status"
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleChange}
                aria-label="Task status"
              >
                <option value="todo">📋 Todo</option>
                <option value="in_progress">🔄 In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="task-due-date">
                Due Date
              </label>
              <input
                id="task-due-date"
                name="due_date"
                type="date"
                className="form-input"
                value={form.due_date}
                onChange={handleChange}
                aria-label="Task due date"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              id="btn-modal-cancel"
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              id="btn-modal-save"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? '⏳ Saving…' : isEditing ? '💾 Save Changes' : '✨ Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
