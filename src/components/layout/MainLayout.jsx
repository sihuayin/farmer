export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen">
      <main className="flex-grow relative">
        {children}
      </main>
    </div>
  )
}
