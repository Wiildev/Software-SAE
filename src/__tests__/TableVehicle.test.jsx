import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableVehicle from '../components/panelcomponents/TableVehicle';

// Mock de fetch para simular las llamadas al backend
global.fetch = jest.fn();

// Datos de prueba
const mockVehicles = [
  {
    id: 1,
    placa: 'ABC123',
    tipoVehiculo: 'CARRO',
    plaza: 'A1',
    fechaIngreso: '2025-08-29T10:00:00Z',
    empleado: {
      nombre: 'Juan',
      apellido: 'Pérez'
    }
  },
  {
    id: 2,
    placa: 'XYZ789',
    tipoVehiculo: 'MOTO',
    plaza: 'B2',
    fechaIngreso: '2025-08-29T11:00:00Z',
    empleado: {
      nombre: 'María',
      apellido: 'González'
    }
  }
];

describe('TableVehicle', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Configurar el mock de fetch para devolver datos de prueba
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ tickets: mockVehicles })
    });
  });

  test('debería cargar y mostrar los vehículos correctamente', async () => {
    render(<TableVehicle />);
    
    // Verificar que se haga la llamada a la API
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/tickets/detalles');
    
    // Esperar a que los datos se muestren
    await waitFor(() => {
      expect(screen.getByText('ABC123')).toBeInTheDocument();
      expect(screen.getByText('XYZ789')).toBeInTheDocument();
    });
  });

  test('debería filtrar vehículos por placa', async () => {
    render(<TableVehicle />);
    
    // Esperar a que los datos se carguen
    await waitFor(() => {
      expect(screen.getByText('ABC123')).toBeInTheDocument();
    });
    
    // Simular búsqueda
    const searchInput = screen.getByPlaceholderText(/buscar por placa/i);
    fireEvent.change(searchInput, { target: { value: 'ABC' } });
    
    // Verificar que solo se muestre el vehículo filtrado
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.queryByText('XYZ789')).not.toBeInTheDocument();
  });

  test('debería llamar a onReload cuando se actualicen los datos', async () => {
    const mockOnReload = jest.fn();
    render(<TableVehicle reload={true} onReload={mockOnReload} />);
    
    // Esperar a que los datos se carguen
    await waitFor(() => {
      expect(screen.getByText('ABC123')).toBeInTheDocument();
    });
    
    // Verificar que se llame a onReload
    expect(mockOnReload).toHaveBeenCalled();
  });

  test('debería mostrar mensaje cuando no hay resultados', async () => {
    // Configurar el mock para devolver un array vacío
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ tickets: [] })
    });
    
    render(<TableVehicle />);
    
    // Esperar a que se muestre el mensaje de no hay resultados
    await waitFor(() => {
      expect(screen.getByText(/no hay vehículos registrados/i)).toBeInTheDocument();
    });
  });

  test('debería manejar errores de la API correctamente', async () => {
    // Configurar el mock para simular un error
    global.fetch.mockRejectedValueOnce(new Error('Error de API'));
    
    render(<TableVehicle />);
    
    // Verificar que se muestre un mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/error al cargar los datos/i)).toBeInTheDocument();
    });
  });
});
