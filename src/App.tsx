import { HelmetProvider } from 'react-helmet-async';
import MeripassCalculator from './components/MeripassCalculator';

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <MeripassCalculator />
      </div>
    </HelmetProvider>
  );
}

export default App;