-- 1. Ver si la columna y el enum existen
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_name = 'Proveedor' AND column_name = 'plan';

-- 2. Ver los valores actuales de todos los proveedores
SELECT id, nombre, plan FROM "Proveedor";

-- 3. Ver los enums que existen en la DB
SELECT typname FROM pg_type WHERE typtype = 'e';
