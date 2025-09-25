import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import UserRegistration from '../components/UserRegistration';

// Mock fetch global
global.fetch = jest.fn();

describe('UserRegistration', () => {
  beforeEach(() => {
    // Limpiar los mocks antes de cada prueba
    jest.clearAllMocks();
    // Configurar el mock de fetch para devolver una respuesta exitosa por defecto
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ mensaje: 'Usuario registrado exitosamente' }),
      status: 200,
      statusText: 'OK',
      headers: new Map([['Content-Type', 'application/json']])
    });
  });

  test('debería mostrar todos los campos del formulario', () => {
    render(<UserRegistration />);
    
    // Verificar que todos los campos necesarios estén presentes
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/número de documento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rol/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirmar contraseña$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/acepto las políticas/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar/i })).toBeInTheDocument();
  });

  test('debería mostrar error cuando faltan campos requeridos', async () => {
    render(<UserRegistration />);
    
    // Intentar enviar el formulario vacío
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    // Verificar que se muestre el mensaje de error
    expect(await screen.findByRole('alert')).toHaveTextContent('Por favor, complete todos los campos');
  });

  test('debería mostrar error cuando las contraseñas no coinciden', async () => {
    render(<UserRegistration />);
    
    // Llenar todos los campos excepto confirmar contraseña
    await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez');
    await userEvent.type(screen.getByLabelText(/nombre de usuario/i), 'juanperez');
    await userEvent.type(screen.getByLabelText(/número de documento/i), '123456789');
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com');
    await userEvent.type(screen.getByLabelText(/teléfono/i), '1234567890');
    await userEvent.type(screen.getByLabelText(/^contraseña$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'password124');
    fireEvent.click(screen.getByLabelText(/acepto las políticas/i));
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /registrar/i }));
    
    // Verificar que se muestre el error de contraseñas
    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument();
  });

  test('debería mostrar error cuando no se aceptan las políticas', async () => {
    render(<UserRegistration />);
    
    // Llenar todos los campos pero no aceptar las políticas
    await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez');
    await userEvent.type(screen.getByLabelText(/nombre de usuario/i), 'juanperez');
    await userEvent.type(screen.getByLabelText(/número de documento/i), '123456789');
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com');
    await userEvent.type(screen.getByLabelText(/teléfono/i), '1234567890');
    await userEvent.type(screen.getByLabelText(/^contraseña$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /registrar/i }));
    
    // Verificar que se muestre el error de políticas
    expect(await screen.findByText('Debe aceptar las políticas de privacidad')).toBeInTheDocument();
  });

  test('debería registrar usuario exitosamente', async () => {
    render(<UserRegistration />);
    
    // Llenar todos los campos correctamente
    await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez');
    await userEvent.type(screen.getByLabelText(/nombre de usuario/i), 'juanperez');
    await userEvent.type(screen.getByLabelText(/número de documento/i), '123456789');
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com');
    await userEvent.type(screen.getByLabelText(/teléfono/i), '1234567890');
    await userEvent.type(screen.getByLabelText(/^contraseña$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
    fireEvent.click(screen.getByLabelText(/acepto las políticas/i));
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /registrar/i }));
    
    // Verificar que se llame a fetch con los datos correctos
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: 'Juan Pérez',
          username: 'juanperez',
          documentNumber: '123456789',
          email: 'juan@example.com',
          role: 'empleado',
          phoneNumber: '1234567890',
          password: 'password123'
        }),
        mode: 'cors',
        credentials: 'omit'
      });
    });
    
    // Verificar que se muestre el mensaje de éxito
    expect(await screen.findByText('Usuario registrado exitosamente')).toBeInTheDocument();
  });

  test('debería manejar errores del servidor', async () => {
    // Configurar el mock para simular un error del servidor
    global.fetch.mockRejectedValueOnce(new Error('Error de conexión'));
    
    render(<UserRegistration />);
    
    // Llenar todos los campos correctamente
    await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez');
    await userEvent.type(screen.getByLabelText(/nombre de usuario/i), 'juanperez');
    await userEvent.type(screen.getByLabelText(/número de documento/i), '123456789');
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com');
    await userEvent.type(screen.getByLabelText(/teléfono/i), '1234567890');
    await userEvent.type(screen.getByLabelText(/^contraseña$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'password123');
    fireEvent.click(screen.getByLabelText(/acepto las políticas/i));
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /registrar/i }));
    
    // Verificar que se muestre el mensaje de error
    expect(await screen.findByText('Error de conexión')).toBeInTheDocument();
  });
});
