-- schema-zyx-logistics.sql
-- Schema para ZYX Logística
-- Foco: CRUD básico para demonstração técnica
-- Autor: Victor Luiz de França
-- Data: 04/12/2025

-- ============================================================================
-- 1. LIMPEZA (apenas para ambiente de desenvolvimento)
-- ============================================================================
DROP TABLE IF EXISTS shipment_tracking CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;

-- ============================================================================
-- 2. TABELA PRINCIPAL - SHIPMENTS (CARGAS/ENVIOS)
-- ============================================================================
CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    product_description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    weight_kg DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'PENDING',
    estimated_arrival DATE NOT NULL,
    actual_arrival DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints de validação
    CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_weight_positive CHECK (weight_kg > 0),
    CONSTRAINT chk_status_values CHECK (
        status IN ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')
    )
);

-- Comentários das colunas (separados da criação)
COMMENT ON TABLE shipments IS 'Registro principal de cargas/envios da ZYX Logística';
COMMENT ON COLUMN shipments.origin IS 'Local de origem da carga';
COMMENT ON COLUMN shipments.destination IS 'Destino final da carga';
COMMENT ON COLUMN shipments.product_description IS 'Descrição dos produtos';
COMMENT ON COLUMN shipments.estimated_arrival IS 'Data estimada de chegada';
COMMENT ON COLUMN shipments.actual_arrival IS 'Data real de chegada (preenchida quando entregue)';

-- ============================================================================
-- 3. TABELA DE RASTREAMENTO - SHIPMENT_TRACKING (HISTÓRICO)
-- ============================================================================
CREATE TABLE shipment_tracking (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    location VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    tracking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_tracking_status_values CHECK (
        status IN ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')
    )
);

COMMENT ON TABLE shipment_tracking IS 'Histórico completo de rastreamento das cargas';
COMMENT ON COLUMN shipment_tracking.location IS 'Local onde a carga está/saiu';
COMMENT ON COLUMN shipment_tracking.notes IS 'Detalhes da movimentação';

-- ============================================================================
-- 4. ÍNDICES PARA PERFORMANCE
-- ============================================================================
-- Para tabela shipments
CREATE INDEX idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_customer ON shipments(customer_name);
CREATE INDEX idx_shipments_estimated_arrival ON shipments(estimated_arrival);
CREATE INDEX idx_shipments_created_at ON shipments(created_at DESC);

-- Para tabela shipment_tracking
CREATE INDEX idx_tracking_shipment_id ON shipment_tracking(shipment_id);
CREATE INDEX idx_tracking_date ON shipment_tracking(tracking_date DESC);
CREATE INDEX idx_tracking_status ON shipment_tracking(status);

-- ============================================================================
-- 5. TRIGGER PARA ATUALIZAR UPDATED_AT AUTOMATICAMENTE
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_shipments_updated_at
    BEFORE UPDATE ON shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. DADOS DE EXEMPLO PARA DEMONSTRAÇÃO
-- ============================================================================
INSERT INTO shipments (
    tracking_number,
    customer_name,
    origin,
    destination,
    product_description,
    quantity,
    weight_kg,
    status,
    estimated_arrival,
    actual_arrival,
    notes
) VALUES
('ZYX202512001', 'Tech Solutions Ltda', 'São Paulo - SP', 'Rio de Janeiro - RJ',
 'Notebooks Dell XPS 15 - Lote produção', 10, 25.5, 'DELIVERED',
 '2025-12-01', '2025-12-01', 'Entrega realizada com sucesso'),

('ZYX202512002', 'Global Import Export', 'Santos - SP', 'Curitiba - PR',
 'Peças automotivas para montadora', 50, 1500.0, 'IN_TRANSIT',
 '2025-12-10', NULL, 'Carga especial - requer cuidado'),

('ZYX202512003', 'E-commerce Express', 'Belo Horizonte - MG', 'Brasília - DF',
 'Smartphones iPhone 15 e acessórios', 200, 100.0, 'PENDING',
 '2025-12-15', NULL, 'Aguardando documentação alfandegária'),

('ZYX202512004', 'Indústria ABC', 'Porto Alegre - RS', 'Florianópolis - SC',
 'Máquinas industriais CNC', 5, 5000.0, 'IN_TRANSIT',
 '2025-12-12', NULL, 'Carga de grande porte - transporte especial'),

('ZYX202512005', 'Distribuidora XYZ', 'Fortaleza - CE', 'Salvador - BA',
 'Produtos alimentícios perecíveis', 1000, 800.0, 'DELIVERED',
 '2025-12-03', '2025-12-03', 'Transporte refrigerado - temperatura controlada');

-- Histórico de rastreamento (exemplo realista)
INSERT INTO shipment_tracking (shipment_id, location, status, notes, tracking_date) VALUES
(1, 'Centro de Distribuição SP', 'PENDING', 'Carga recebida para processamento inicial', '2025-11-28 09:00:00'),
(1, 'São Paulo - SP', 'IN_TRANSIT', 'Despachada para Rio de Janeiro via transporte terrestre', '2025-11-29 14:30:00'),
(1, 'Rio de Janeiro - RJ', 'DELIVERED', 'Entrega concluída - assinatura do recebedor confirmada', '2025-12-01 11:20:00'),

(2, 'Porto de Santos - SP', 'PENDING', 'Carga em área de embarque - aguardando vistoria', '2025-12-05 08:15:00'),
(2, 'Rodovia BR-116', 'IN_TRANSIT', 'Em trânsito - previsão de chegada em Curitiba: 48h', '2025-12-06 10:00:00'),

(3, 'Centro Logístico BH', 'PENDING', 'Aguardando liberação fiscal para embarque', '2025-12-04 09:00:00'),

(4, 'Porto Alegre - RS', 'PENDING', 'Documentação concluída - carga preparada para transporte', '2025-12-07 07:30:00'),
(4, 'Rodovia BR-101', 'IN_TRANSIT', 'Transporte especial em andamento - acompanhamento via GPS', '2025-12-08 16:45:00'),

(5, 'Fortaleza - CE', 'PENDING', 'Carga perecível - verificação de temperatura inicial', '2025-12-01 10:00:00'),
(5, 'Salvador - BA', 'DELIVERED', 'Entrega realizada dentro do prazo - produto em condições ideais', '2025-12-03 15:30:00');

-- ============================================================================
-- 7. VIEW ÚTIL PARA CONSULTAS FREQUENTES
-- ============================================================================
CREATE OR REPLACE VIEW vw_shipment_dashboard AS
SELECT
    s.id,
    s.tracking_number,
    s.customer_name,
    s.origin,
    s.destination,
    s.status,
    s.estimated_arrival,
    s.actual_arrival,
    CASE
        WHEN s.actual_arrival IS NOT NULL THEN 'Concluído'
        WHEN s.estimated_arrival < CURRENT_DATE THEN 'Atrasado'
        WHEN s.status = 'IN_TRANSIT' THEN 'Em Andamento'
        WHEN s.status = 'PENDING' THEN 'Aguardando'
        ELSE s.status
    END as delivery_status,
    (
        SELECT location
        FROM shipment_tracking st
        WHERE st.shipment_id = s.id
        ORDER BY tracking_date DESC
        LIMIT 1
    ) as last_known_location,
    (
        SELECT tracking_date
        FROM shipment_tracking st
        WHERE st.shipment_id = s.id
        ORDER BY tracking_date DESC
        LIMIT 1
    ) as last_update_time
FROM shipments s
ORDER BY
    CASE
        WHEN s.actual_arrival IS NULL AND s.estimated_arrival < CURRENT_DATE THEN 1
        WHEN s.actual_arrival IS NULL THEN 2
        ELSE 3
    END,
    s.estimated_arrival ASC;

-- ============================================================================
-- 8. VALIDAÇÃO FINAL
-- ============================================================================
DO $$
DECLARE
    shipment_count INTEGER;
    tracking_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO shipment_count FROM shipments;
    SELECT COUNT(*) INTO tracking_count FROM shipment_tracking;

    RAISE NOTICE '=========================================';
    RAISE NOTICE 'SCHEMA ZYX LOGÍSTICA - IMPLANTADO COM SUCESSO';
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'Tabelas criadas: shipments, shipment_tracking';
    RAISE NOTICE 'Dados de demonstração: % cargas, % registros de rastreamento',
                 shipment_count, tracking_count;
    RAISE NOTICE 'View disponível: vw_shipment_dashboard';
    RAISE NOTICE 'Índices otimizados para consultas rápidas';
    RAISE NOTICE 'Pronto para desenvolvimento da API REST!';
    RAISE NOTICE '=========================================';
END $$;
