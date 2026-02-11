import { HelmetProvider } from 'react-helmet-async';
import { AppShell } from './components/layout/AppShell';

function App() {
  return (
    <HelmetProvider>
      <AppShell />
    </HelmetProvider>
  );
}

export default App;
