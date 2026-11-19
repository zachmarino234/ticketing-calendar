import PerformanceCalendar from '../react/PerformanceCalendar/PerformanceCalendar'
import { usePerformances } from '../react/usePerformances'


function App() {

  const { performances, loading, error } = usePerformances();

  if (loading) return <p>Loading performances…</p>
  if (error) return <p>Couldn't load performances.</p>

  return (
    <PerformanceCalendar performances={performances} year={2026} month={11} />
  )
}

export default App
