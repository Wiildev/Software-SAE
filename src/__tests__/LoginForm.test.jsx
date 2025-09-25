import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import LoginForm from '../components/LoginForm';

// Mock de la función global fetch
global.fetch = jest.fn();

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock de la función de navegación
window.navigate = jest.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Configurar el mock de fetch para devolver una respuesta exitosa por defecto
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ 
        mensaje: 'Inicio de sesión exitoso',
        usuario: {
          username: 'testuser',
          role: 'empleado'
        }
      })
    });

    // Configurar timers falsos
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restaurar timers reales después de cada prueba
    jest.useRealTimers();
  });

  test('debería mostrar todos los campos del formulario', () => {
    render(<LoginForm />);
    
    // Verificar que todos los campos necesarios estén presentes
    expect(screen.getByPlaceholderText('Nombre de usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByText(/registrarse/i)).toBeInTheDocument();
    expect(screen.getByText(/recuperar contraseña/i)).toBeInTheDocument();
  });

  test('debería mostrar error cuando faltan campos requeridos', async () => {
    render(<LoginForm />);
    
    // Intentar enviar el formulario vacío
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    // Verificar que se muestre el mensaje de error
    expect(await screen.findByRole('alert')).toHaveTextContent('Por favor, complete todos los campos');
  });

  test('debería manejar un inicio de sesión exitoso', async () => {
    // Aumentar el tiempo de espera para este test
    jest.setTimeout(10000);
    render(<LoginForm />);
    
    // Llenar el formulario
    await userEvent.type(screen.getByPlaceholderText('Nombre de usuario'), 'testuser');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'password123');
    await userEvent.selectOptions(screen.getByRole('combobox'), 'empleado');
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    // Verificar que se haya llamado a fetch con los datos correctos
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
        role: 'empleado'
      })
    });
    
    // Verificar que se muestre el mensaje de éxito
    expect(await screen.findByRole('status')).toHaveTextContent('Inicio de sesión exitoso');
    
    // Verificar que se haya guardado el usuario en localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({
        username: 'testuser',
        role: 'empleado'
      })
    );
    
    // Verificar que se haya configurado el temporizador
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);
    
    // Ejecutar todos los temporizadores pendientes
    jest.runAllTimers();
    
    // Verificar la redirección
    expect(window.navigate).toHaveBeenCalledWith('/panel');
  });

  test('debería manejar errores de autenticación', async () => {
    // Configurar el mock de fetch para devolver un error
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Credenciales inválidas' })
    });
    
    render(<LoginForm />);
    
    // Llenar el formulario
    await userEvent.type(screen.getByPlaceholderText('Nombre de usuario'), 'wronguser');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'wrongpass');
    await userEvent.selectOptions(screen.getByRole('combobox'), 'empleado');
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    // Verificar que se muestre el mensaje de error
    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales inválidas');
  });
});
