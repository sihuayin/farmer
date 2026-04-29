import SideNavBar from './SideNavBar'
import TopAppBar from './TopAppBar'

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SideNavBar />
      <TopAppBar />
      <main className="md:ml-64 flex-grow relative">
        {children}
      </main>
    </div>
  )
}
