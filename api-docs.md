# Documentación de la API SAE

Esta documentación describe todos los endpoints disponibles, agrupados por interfaz.

---

## Interfaz de Empleados

### Registro de Empleado
**POST** `/api/registro`

**Body:**
```json
{
  "fullName": "Nombre Ejemplo",
  "username": "usuario_ejemplo",
  "documentNumber": "12345678",
  "email": "ejemplo@correo.com",
  "role": "empleado",
  "phoneNumber": "1234567890",
  "password": "contraseña123"
}
```
**Descripción:** Registra un nuevo empleado en el sistema.

**Respuesta:**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "userId": 1
}
```

---

### Login de Empleado
**POST** `/api/login`

**Body:**
```json
{
  "username": "usuario_ejemplo",
  "password": "contraseña123",
  "role": "empleado"
}
```
**Descripción:** Autentica un empleado y retorna sus datos (sin contraseña).

**Respuesta:**
```json
{
  "mensaje": "Inicio de sesión exitoso",
  "usuario": { /* datos del usuario */ }
}
```

---

### Obtener todos los empleados
**GET** `/api/empleados`

**Descripción:** Retorna una lista de todos los empleados registrados.

**Respuesta:**
```json
{
  "empleados": [ /* empleados */ ]
}
```

---

### Obtener un empleado por ID
**GET** `/api/empleados/:id`

**Descripción:** Obtiene la información de un empleado específico.

**Respuesta:**
```json
{
  "empleado": { /* datos del empleado */ }
}
```

---

### Actualizar un empleado
**PUT** `/api/empleados/:id`

**Body:**
```json
{
  "nombreCompleto": "Nuevo Nombre",
  "nombreUsuario": "nuevo_usuario",
  "numeroDocumento": "87654321",
  "correoElectronico": "nuevo@correo.com",
  "tipoUsuario": "empleado",
  "telefono": "0987654321"
}
```
**Descripción:** Actualiza la información de un empleado existente.

**Respuesta:**
```json
{
  "mensaje": "Empleado actualizado exitosamente"
}
```

---

### Eliminar un empleado
**DELETE** `/api/empleados/:id`

**Descripción:** Elimina un empleado del sistema.

**Respuesta:**
```json
{
  "mensaje": "Empleado eliminado exitosamente"
}
```

---

## Interfaz de Tickets

### Registrar ingreso de vehículo y ticket
**POST** `/api/tickets`

**Body:**
```json
{
  "placa": "ABC123",
  "tipoVehiculo": "CARRO",
  "plaza": "P001",
  "id_Empleado": 1
}
```
**Descripción:** Registra el ingreso de un vehículo y crea un ticket asociado.

**Respuesta:**
```json
{
  "mensaje": "Ingreso registrado",
  "id_Ticket": 123
}
```

---

### Marcar salida de vehículo
**PUT** `/api/tickets/:id/salida`

**Descripción:** Marca la salida de un vehículo y actualiza el ticket correspondiente.

**Respuesta:**
```json
{
  "mensaje": "Salida registrada"
}
```

---

### Eliminar ticket
**DELETE** `/api/tickets/:id`

**Descripción:** Elimina un ticket del sistema.

**Respuesta:**
```json
{
  "mensaje": "Ticket eliminado"
}
```

---

### Obtener todos los tickets
**GET** `/api/tickets`

**Descripción:** Obtiene una lista de todos los tickets registrados.

**Respuesta:**
```json
{
  "tickets": [ /* tickets */ ]
}
```

---

### Obtener todos los vehículos
**GET** `/api/tickets/vehiculos`

**Descripción:** Obtiene una lista de todos los vehículos registrados en tickets.

**Respuesta:**
```json
{
  "vehiculos": [ /* vehículos */ ]
}
```

---

### Obtener todos los tickets con detalles de vehículo y plaza
**GET** `/api/tickets/detalles`

**Descripción:** Obtiene todos los tickets junto con los detalles del vehículo y la plaza asociada.

**Respuesta:**
```json
{
  "tickets": [ /* tickets con detalles */ ]
}
```

---

### Exportar tickets (CSV/XLSX)
**GET** `/api/tickets/exportar?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD&formato=csv|xlsx`

**Descripción:** Descarga un archivo con los tickets del rango de fechas indicado en formato CSV o Excel (XLSX).

**Parámetros:**
- `fechaInicio` (requerido): Fecha inicial (YYYY-MM-DD)
- `fechaFin` (requerido): Fecha final (YYYY-MM-DD)
- `formato` (opcional): `csv` o `xlsx` (por defecto xlsx)

**Respuesta:**
- Descarga directa del archivo solicitado.

---

## Interfaz de Estadísticas

### Obtener estadísticas generales
**GET** `/api/estadisticas`

**Descripción:** Retorna un objeto con estadísticas en tiempo real del sistema de parqueadero, incluyendo ocupación, historial mensual, ranking por tipo de vehículo, ocupación por horas y conteo actual de vehículos por tipo.

**Respuesta:**
```json
{
  "occupancyPercentage": 65,
  "historyData": [
    { "month": "Ene", "count": 120 },
    { "month": "Feb", "count": 150 }
    // ...
  ],
  "rankingData": [
    { "tipoVehiculo": "CARRO", "count": 450 },
    { "tipoVehiculo": "MOTO", "count": 320 }
    // ...
  ],
  "hourlyData": [
    { "hour": 8, "count": 15 },
    { "hour": 9, "count": 25 }
    // ...
  ],
  "averages": {
    "cars": 45,
    "motorcycles": 32,
    "bicycles": 18
  }
}
```