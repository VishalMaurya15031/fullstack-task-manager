import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// PUT /api/tasks/[id] - update a task
export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const { title, description, status, due_date } = body

  if (!title || title.trim() === '') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({
      title: title.trim(),
      description: description?.trim() || null,
      status: status || 'todo',
      due_date: due_date || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

// DELETE /api/tasks/[id] - delete a task
export async function DELETE(request, { params }) {
  const { id } = await params

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Task deleted successfully' })
}
