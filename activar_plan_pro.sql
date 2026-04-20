-- ─── Activar Plan Pro ─────────────────────────────────────────────────────────
-- 1. Primero buscá el ID del negocio que querés activar:
SELECT id, nombre, plan FROM "Proveedor" ORDER BY "createdAt" DESC;

-- 2. Activar Pro (reemplazá el ID):
UPDATE "Proveedor"
SET plan = 'PRO'::"PlanTipo", "planVence" = NOW() + INTERVAL '1 month'
WHERE id = 'PEGAR_ID_ACÁ';

-- Para 3 meses: INTERVAL '3 months'
-- Para 1 año:   INTERVAL '1 year'

-- 3. Verificar:
SELECT id, nombre, plan, "planVence" FROM "Proveedor" WHERE id = 'PEGAR_ID_ACÁ';


-- ─── Volver a FREE ────────────────────────────────────────────────────────────
-- UPDATE "Proveedor"
-- SET plan = 'FREE'::"PlanTipo", "planVence" = NULL
-- WHERE id = 'PEGAR_ID_ACÁ';
