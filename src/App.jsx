import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import { FarmProvider } from './hooks/useFarm'
import { I18nProvider } from './i18n'
import MainLayout from './components/layout/MainLayout'
import OverviewPage from './pages/harvesthub/OverviewPage'
import CropsPage from './pages/harvesthub/CropsPage'
import LivestockPage from './pages/harvesthub/LivestockPage'
import InventoryPage from './pages/harvesthub/InventoryPage'
import PanoramaPage from './pages/harvesthub/PanoramaPage'

export default function App() {
  return (
    <I18nProvider>
      <FarmProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout><OverviewPage /></MainLayout>} />
            <Route path="/crops" element={<MainLayout><CropsPage /></MainLayout>} />
            <Route path="/livestock" element={<MainLayout><LivestockPage /></MainLayout>} />
            <Route path="/inventory" element={<MainLayout><InventoryPage /></MainLayout>} />
            <Route path="/panorama" element={<MainLayout><PanoramaPage /></MainLayout>} />
          </Routes>
        </BrowserRouter>
      </FarmProvider>
    </I18nProvider>
  )
}
