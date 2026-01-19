import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import ToastContainer from '@/components/ui/Toast'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="pt-16 lg:ml-64 min-h-screen transition-all duration-300">
        <div className="p-4 lg:p-8 pb-24">
          <Outlet />
        </div>
      </main>

      <ToastContainer />
    </div>
  )
}
