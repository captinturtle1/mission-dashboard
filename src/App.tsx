import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Mission from './pages/Mission';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mission/:id" element={<Mission />} />
      </Routes>
    </div>
  )
}

export default App