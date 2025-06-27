# Población de Plazas - Sistema de Estacionamiento

## Descripción
Este script pobla automáticamente la tabla `Plaza` con todas las plazas necesarias para el sistema de estacionamiento.

## Estructura de Plazas

### Áreas para Carros (A, B)
- **A 1** a **A 20** (20 plazas)
- **B 1** a **B 20** (20 plazas)
- **Total: 40 plazas**

### Área para Motos y Bicicletas (C)
- **C 1** a **C 20** (20 plazas)
- **Total: 20 plazas**

### Total General
- **60 plazas** en estado "libre"

## Cómo Ejecutar

### Opción 1: Usando npm script
```bash
cd api-autenticacion
npm run populate-plazas
```

### Opción 2: Ejecutar directamente
```bash
cd api-autenticacion
node src/config/populatePlazas.js
```

## Resultado Esperado
```
Iniciando población de plazas...
✅ Se insertaron/actualizaron 60 plazas
📋 Resumen de plazas creadas:
   - Áreas A, B: 40 plazas (para carros)
   - Área C: 20 plazas (para motos y bicicletas)
   - Total: 60 plazas
🏁 Proceso completado
```

## Notas Importantes

1. **Ejecutar una sola vez**: Este script está diseñado para ejecutarse una sola vez durante la instalación del sistema.

2. **Estado inicial**: Todas las plazas se crean con estado "libre".

3. **Duplicados**: El script usa `ON DUPLICATE KEY UPDATE` para evitar errores si se ejecuta múltiples veces.

4. **Base de datos**: Asegúrate de que la tabla `Plaza` exista antes de ejecutar el script.

## Estructura de la Tabla Plaza
```sql
CREATE TABLE Plaza (
  id_Plaza INT PRIMARY KEY AUTO_INCREMENT,
  plaza VARCHAR(10) NOT NULL UNIQUE,
  estado ENUM('libre', 'ocupado') DEFAULT 'libre'
);
```

## Solución de Problemas

### Error: "plaza no encontrada"
Si sigues viendo este error después de ejecutar el script:
1. Verifica que el script se ejecutó correctamente
2. Revisa los logs para confirmar que se insertaron las plazas
3. Verifica la conexión a la base de datos
4. Asegúrate de que la tabla `Plaza` existe y tiene la estructura correcta 