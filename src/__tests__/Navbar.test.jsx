import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../components/panelcomponents/Navbar';

// Mock de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  BrowserRouter: ({ children }) => <div>{children}</div>
}));

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// No necesitamos mockear window.location ya que estamos usando useNavigate

describe('Navbar', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    // Restaurar el valor por defecto de localStorage
    localStorage.getItem.mockReturnValue(JSON.stringify({ role: 'admin' }));
  });

  const renderNavbar = () => {
    render(<Navbar />);
  };

  test('debería renderizar el título correctamente', () => {
    renderNavbar();
    expect(screen.getByText('Sistema Automático de Estacionamiento')).toBeInTheDocument();
  });

  test('debería mostrar el menú al hacer clic en el botón de hamburguesa', () => {
    renderNavbar();
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    // Inicialmente el menú no debería estar visible
    expect(screen.queryByText('Registros')).not.toBeInTheDocument();
    
    // Clic en el botón de menú
    fireEvent.click(menuButton);
    
    // Ahora el menú debería ser visible
    expect(screen.getByText('Registros')).toBeInTheDocument();
    expect(screen.getByText('Estadística')).toBeInTheDocument();
    expect(screen.getByText('Reporte')).toBeInTheDocument();
  });

  test('debería mostrar las notificaciones al hacer clic en el botón de campana', () => {
    renderNavbar();
    const bellButton = screen.getByRole('button', { name: /notifications/i });
    
    // Inicialmente las notificaciones no deberían estar visibles
    expect(screen.queryByText('Notificaciones')).not.toBeInTheDocument();
    
    // Clic en el botón de notificaciones
    fireEvent.click(bellButton);
    
    // Ahora las notificaciones deberían ser visibles
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    expect(screen.getByText('Nueva actualización disponible')).toBeInTheDocument();
  });

  test('debería mostrar el menú de perfil al hacer clic en el botón de usuario', () => {
    renderNavbar();
    const profileButton = screen.getByText('Admin');
    
    // Inicialmente el menú de perfil no debería estar visible
    expect(screen.queryByText('Configuración')).not.toBeInTheDocument();
    
    // Clic en el botón de perfil
    fireEvent.click(profileButton);
    
    // Ahora el menú de perfil debería ser visible
    expect(screen.getByText('Configuración')).toBeInTheDocument();
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
  });

  test('debería cambiar el tipo de usuario según el role en localStorage', () => {
    // Simular un usuario empleado
    localStorage.getItem.mockReturnValue(JSON.stringify({ role: 'empleado' }));
    
    renderNavbar();
    expect(screen.getByText('Emple')).toBeInTheDocument();
  });

  test('debería cerrar sesión correctamente', () => {
    renderNavbar();
    const profileButton = screen.getByText('Admin');
    
    // Abrir el menú de perfil
    fireEvent.click(profileButton);
    
    // Hacer clic en cerrar sesión
    const logoutButton = screen.getByText('Cerrar sesión');
    fireEvent.click(logoutButton);
    
    // Verificar que se haya limpiado el localStorage
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    
    // Verificar la redirección
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('debería navegar a las diferentes secciones', () => {
    renderNavbar();
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    // Abrir el menú
    fireEvent.click(menuButton);
    
    // Clic en los diferentes enlaces
    fireEvent.click(screen.getByText('Registros'));
    expect(mockNavigate).toHaveBeenCalledWith('/panel');
    
    fireEvent.click(screen.getByText('Estadística'));
    expect(mockNavigate).toHaveBeenCalledWith('/estadisticas');
  });

  test('debería cerrar el menú de notificaciones al abrir el menú de perfil', () => {
    renderNavbar();
    
    // Abrir notificaciones
    const bellButton = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(bellButton);
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    
    // Abrir menú de perfil
    const profileButton = screen.getByText('Admin');
    fireEvent.click(profileButton);
    
    // Verificar que las notificaciones se hayan cerrado
    expect(screen.queryByText('Notificaciones')).not.toBeInTheDocument();
    expect(screen.getByText('Configuración')).toBeInTheDocument();
  });
});
