import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DisplayAll from './components/DisplayAll'
import NewPoll from './components/NewPoll'
import OnePoll from './components/OnePoll'
import Results from './components/Results'

function App() {
  return (
    <>
      <h2>Voting Dojo</h2>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DisplayAll />} />
          <Route path="/new" element={<NewPoll />} />
          <Route path="/poll/:id" element={<OnePoll />} />
          <Route path="/poll/:id" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
