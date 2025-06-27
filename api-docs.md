# Documentación de la API de Empleados

Esta documentación describe todos los endpoints disponibles en la API de gestión de empleados.

## Autenticación

### Registro de Empleado
```
URL: http://localhost:3000/api/registro
Método: POST
Headers: 
  Content-Type: application/json
Body:
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
**Descripción**: Registra un nuevo empleado en el sistema.

### Login de Empleado
```
URL: http://localhost:3000/api/login
Método: POST
Headers:
  Content-Type: application/json
Body:
{
    "username": "usuario_ejemplo",
    "password": "contraseña123",
    "role": "empleado"
}
```
**Descripción**: Autentica un empleado en el sistema.

## Gestión de Empleados

### Obtener Todos los Empleados
```
URL: http://localhost:3000/api/empleados
Método: GET
```
**Descripción**: Retorna una lista de todos los empleados registrados.
**Respuesta**: Lista de empleados sin incluir contraseñas.

### Obtener un Empleado Específico
```
URL: http://localhost:3000/api/empleados/:id
Método: GET
```
**Descripción**: Obtiene la información de un empleado específico.
**Parámetros**: 
- `:id` - ID del empleado a consultar
**Respuesta**: Datos del empleado sin incluir contraseña.

### Actualizar un Empleado
```
URL: http://localhost:3000/api/empleados/:id
Método: PUT
Headers:
  Content-Type: application/json
Body:
{
    "nombreCompleto": "Nuevo Nombre",
    "nombreUsuario": "nuevo_usuario",
    "numeroDocumento": "87654321",
    "correoElectronico": "nuevo@correo.com",
    "tipoUsuario": "empleado",
    "telefono": "0987654321"
}
```
**Descripción**: Actualiza la información de un empleado existente.
**Parámetros**:
- `:id` - ID del empleado a actualizar
**Notas**: 
- Solo se actualizarán los campos incluidos en el body
- La contraseña no se puede actualizar por esta ruta

### Eliminar un Empleado
```
URL: http://localhost:3000/api/empleados/:id
Método: DELETE
```
**Descripción**: Elimina un empleado del sistema.
**Parámetros**:
- `:id` - ID del empleado a eliminar

## Códigos de Respuesta

- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error en la solicitud (datos inválidos)
- `401`: No autorizado
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

## Ejemplos de Uso

### Ejemplo de Registro Exitoso
```json

// Solicitud POST a /api/registro
{
    "fullName": "Juan Pérez",
    "username": "jperez",
    "documentNumber": "12345678",
    "email": "juan@ejemplo.com",
    "role": "empleado",
    "phoneNumber": "1234567890",
    "password": "contraseña123"
}

// Respuesta
{
    "mensaje": "Usuario registrado exitosamente"
}
```

### Ejemplo de Login Exitoso
```json
// Solicitud POST a /api/login
{
    "username": "jperez",
    "password": "contraseña123",
    "role": "empleado"
}

// Respuesta
{
    "mensaje": "Inicio de sesión exitoso",
    "usuario": {
        "id_Empleado": 1,
        "nombreCompleto": "Juan Pérez",
        "nombreUsuario": "jperez",
        // ... otros datos del usuario
    }
}
```

### Ejemplo de Actualización
```json
// Solicitud PUT a /api/empleados/1
{
    "telefono": "9876543210",
    "correoElectronico": "nuevo@ejemplo.com"
}

// Respuesta
{
    "mensaje": "Empleado actualizado exitosamente"
}
```
