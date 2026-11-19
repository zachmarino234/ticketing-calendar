import raw from '../../fixtures/tt-events.json'
import { toPerformances } from '../adapters/tickettailor/transform'
import type { TicketTailorEvent, TicketTailorList } from '../adapters/tickettailor/raw-types'
import PerformanceCalendar from '../react/PerformanceCalendar/PerformanceCalendar'

const performances = toPerformances(raw as TicketTailorList<TicketTailorEvent>)

function App() {

  return (
    <PerformanceCalendar performances={performances} year={2026} month={11} />
  )
}

export default App
