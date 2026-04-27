import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import { useFarm } from './hooks/useFarm'
import PreviewPage from './pages/PreviewPage'
import EditorPage from './pages/EditorPage'

export default function App() {
  const { farm, updateCell, clearFarm, updateFarmName } = useFarm()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<PreviewPage farm={farm} updateFarmName={updateFarmName} />}
        />
        <Route
          path="/editor"
          element={
            <EditorPage
              farm={farm}
              updateCell={updateCell}
              clearFarm={clearFarm}
              updateFarmName={updateFarmName}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
