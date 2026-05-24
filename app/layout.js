import './globals.css'

export const metadata = {
  title: 'TaskFlow — Mini Task Management Dashboard',
  description: 'A beautiful full-stack task management dashboard to create, track, and manage your tasks with ease.',
  keywords: 'task manager, todo, productivity, project management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
