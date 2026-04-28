export default function FAB() {
  return (
    <button className="fixed bottom-8 right-8 w-16 h-16 bg-secondary text-on-secondary rounded-full shadow-2xl flex items-center justify-center tactile-btn-lg z-50 hover:scale-110 transition-transform active:scale-90 group">
      <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
      <div className="absolute right-20 bg-secondary text-on-secondary px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
        Quick Action
      </div>
    </button>
  )
}
