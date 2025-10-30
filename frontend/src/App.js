import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard';
import Inventario from './pages/Inventario';
import Ventas from './pages/Ventas';
import Remisiones from './pages/Remisiones';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';
import Login from './pages/Login';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Inventario />} />
            <Route path="inventario" element={<Inventario />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="remisiones" element={<Remisiones />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;