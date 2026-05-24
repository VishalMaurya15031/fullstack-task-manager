import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET /api/tasks - fetch all tasks ordered by created_at
export async function GET() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/tasks - create a new task
export async function POST(request) {
  const body = await request.json()
  const { title, description, status, due_date } = body

  if (!title || title.trim() === '') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || 'todo',
        due_date: due_date || null,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
