-- ─── Agregar nuevas categorías a TuServicioHoy ───────────────────────────────
-- Ejecutar en Supabase SQL Editor
-- ON CONFLICT DO NOTHING: seguro de ejecutar múltiples veces

INSERT INTO "Categoria" (id, nombre, slug, icono, color, tint)
VALUES
  (gen_random_uuid(), 'Electricidad',  'electricidad',  'bolt',    '#C17A1A', '#F7ECD0'),
  (gen_random_uuid(), 'Plomería',      'plomeria',      'droplet', '#2A6FB8', '#DCE9F4'),
  (gen_random_uuid(), 'Limpieza',      'limpieza',      'sparkle', '#3D8B6E', '#E0EEE8'),
  (gen_random_uuid(), 'Fotografía',    'fotografia',    'camera',  '#7B5EA7', '#EDE8F7'),
  (gen_random_uuid(), 'Contabilidad',  'contabilidad',  'chart',   '#2A6B8B', '#DCE9F0'),
  (gen_random_uuid(), 'Informática',   'informatica',   'monitor', '#4A5568', '#E8EAED'),
  (gen_random_uuid(), 'Eventos',       'eventos',       'music',   '#C4732A', '#F5E6D8')
ON CONFLICT (slug) DO NOTHING;

-- Verificar resultado:
SELECT nombre, slug, icono, color FROM "Categoria" ORDER BY nombre;
