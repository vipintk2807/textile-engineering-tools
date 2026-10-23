import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/tokens.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';

const container = document.getElementById('root');
if (container === null) {
  throw new Error('Root element #root was not found in index.html.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
