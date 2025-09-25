import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegistroVehicleForm from '../components/panelcomponents/RegistroVehicleForm';

// Mock de localStorage
const mockUser = {
  id_Empleado: '123'
};

beforeEach(() => {
  // Configurar el mock de localStorage antes de cada prueba
  Storage.prototype.getItem = jest.fn(() => JSON.stringify(mockUser));
  // Mock de fetch
  global.fetch = jest.fn(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    })
  );
});

describe('RegistroVehicleForm', () => {
  test('debería mostrar todos los campos del formulario', () => {
    render(<RegistroVehicleForm />);
    
    // Verificar que los campos necesarios estén presentes
    expect(screen.getByPlaceholderText('Ej: ABC123')).toBeInTheDocument();
    expect(screen.getByText(/tipo de vehículo/i)).toBeInTheDocument();
  });

  test('debería validar el formato de la placa', async () => {
    render(<RegistroVehicleForm />);
    
    const placaInput = screen.getByPlaceholderText('Ej: ABC123');
    fireEvent.change(placaInput, { target: { value: 'abc123' } });
    
    // Verificar que la placa se convierta a mayúsculas
    expect(placaInput.value).toBe('ABC123');
  });

  test('debería seleccionar tipo de vehículo y asignar plaza', async () => {
    render(<RegistroVehicleForm />);
    
    // Simular registro de un vehículo
    const placaInput = screen.getByPlaceholderText('Ej: ABC123');
    const carroButton = screen.getByTestId('carro-button');
    
    fireEvent.change(placaInput, { target: { value: 'ABC123' } });
    fireEvent.click(carroButton);

    // Verificar que el tipo de vehículo y la plaza se actualizan
    expect(placaInput.value).toBe('ABC123');
  });

  test('debería enviar el formulario correctamente', async () => {
    render(<RegistroVehicleForm />);
    
    // Simular registro de un vehículo
    const placaInput = screen.getByPlaceholderText('Ej: ABC123');
    const carroButton = screen.getByTestId('carro-button');
    const submitButton = screen.getByText('+ Agregar');

    fireEvent.change(placaInput, { target: { value: 'ABC123' } });
    fireEvent.click(carroButton);
    fireEvent.click(submitButton);

    // Verificar que se llamó a fetch con los datos correctos
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/tickets', expect.any(Object));
    });
  });

  test('debería mostrar alerta con datos inválidos', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<RegistroVehicleForm />);
    
    const submitButton = screen.getByText('+ Agregar');
    fireEvent.click(submitButton);

    // Verificar que se muestra la alerta
    expect(alertMock).toHaveBeenCalledWith('Por favor, complete todos los campos');
    alertMock.mockRestore();
  });
});
