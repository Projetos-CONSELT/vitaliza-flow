-- ==============================================================================
-- VITALIZA FISIOTERAPIA - ESQUEMA DE BANCO DE DADOS SUPABASE (POSTGRESQL)
-- ==============================================================================
-- Este script cria todas as tabelas, tipos enumerados, índices, triggers e
-- políticas de segurança (RLS - Row Level Security) para o Supabase, além de 
-- popular o banco com todos os dados iniciais do projeto.

-- 1. ENUMS (TIPOS PERSONALIZADOS)
CREATE TYPE user_role AS ENUM ('recepcionista', 'fisioterapeuta', 'gestor');
CREATE TYPE appointment_status AS ENUM ('confirmado', 'pendente', 'cancelado', 'falta', 'realizado');

-- 2. TABELA DE USUÁRIOS (SISTEMA DE ACESSO)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'recepcionista',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE PACIENTES
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 4. TABELA DE PROFISSIONAIS (FISIOTERAPEUTAS)
CREATE TABLE IF NOT EXISTS public.professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  working_hours_start TIME NOT NULL DEFAULT '08:00',
  working_hours_end TIME NOT NULL DEFAULT '18:00',
  color TEXT NOT NULL DEFAULT 'primary',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE SERVIÇOS (PROCEDIMENTOS E VALORES)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 50,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABELA DE AGENDAMENTOS
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  notes TEXT,
  status appointment_status NOT NULL DEFAULT 'confirmado',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABELA DE CONFIGURAÇÕES DA CLÍNICA
CREATE TABLE IF NOT EXISTS public.clinic_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name TEXT NOT NULL DEFAULT 'Vitaliza Fisioterapia',
  opening_time TIME NOT NULL DEFAULT '07:00',
  closing_time TIME NOT NULL DEFAULT '19:00',
  slot_minutes INTEGER NOT NULL DEFAULT 30,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ÍNDICES DE DESEMPENHO E CONSULTAS
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_professional ON public.appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_name ON public.patients(name);

-- 9. CONFIGURAÇÃO DE SEGURANÇA (RLS - ROW LEVEL SECURITY)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura e escrita públicas (para integração simples com cliente Supabase)
CREATE POLICY "Leitura pública para usuarios" ON public.users FOR SELECT USING (true);
CREATE POLICY "Leitura pública para pacientes" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Escrita pública para pacientes" ON public.patients FOR ALL USING (true);
CREATE POLICY "Leitura pública para profissionais" ON public.professionals FOR SELECT USING (true);
CREATE POLICY "Escrita pública para profissionais" ON public.professionals FOR ALL USING (true);
CREATE POLICY "Leitura pública para servicos" ON public.services FOR SELECT USING (true);
CREATE POLICY "Escrita pública para servicos" ON public.services FOR ALL USING (true);
CREATE POLICY "Leitura pública para agendamentos" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Escrita pública para agendamentos" ON public.appointments FOR ALL USING (true);
CREATE POLICY "Leitura pública para configuracoes" ON public.clinic_settings FOR SELECT USING (true);
CREATE POLICY "Escrita pública para configuracoes" ON public.clinic_settings FOR ALL USING (true);

-- ==============================================================================
-- POPULAÇÃO DE DADOS INICIAIS (SEED DATA)
-- ==============================================================================

-- Inserir Usuários Padrão
INSERT INTO public.users (id, name, email, role) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mariana Silva', 'mariana@vitaliza.com', 'recepcionista'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Dra. Juliana Costa', 'juliana@vitaliza.com', 'fisioterapeuta'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Roberto Almeida', 'roberto@vitaliza.com', 'gestor')
ON CONFLICT (email) DO NOTHING;

-- Inserir Profissionais
INSERT INTO public.professionals (id, name, specialty, working_hours_start, working_hours_end, color) VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Dra. Juliana Costa', 'Fisioterapia Ortopédica', '08:00', '18:00', 'primary'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Dr. Rafael Lima', 'Reabilitação Pós-cirúrgica', '08:00', '18:00', 'secondary'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Dra. Camila Rocha', 'RPG e Pilates Clínico', '09:00', '19:00', 'warning'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Dr. Bruno Martins', 'Fisioterapia Esportiva', '07:00', '17:00', 'success')
ON CONFLICT (id) DO NOTHING;

-- Inserir Serviços
INSERT INTO public.services (id, name, duration_min, price) VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Fisioterapia Ortopédica', 50, 150.00),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Fisioterapia Esportiva', 50, 160.00),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Reabilitação Pós-cirúrgica', 60, 180.00),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Pilates Clínico', 50, 140.00),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'RPG (Reeducação Postural Global)', 60, 170.00),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'Atendimento Domiciliar', 60, 220.00)
ON CONFLICT (id) DO NOTHING;

-- Inserir Pacientes
INSERT INTO public.patients (id, name, phone, notes, created_at) VALUES
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Ana Paula Souza', '(34) 98856-1234', 'Hérnia de disco lombar', CURRENT_DATE - INTERVAL '90 days'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Carlos Mendes', '(34) 99777-4321', 'Pós-cirúrgico de joelho', CURRENT_DATE - INTERVAL '60 days'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Maria Fernanda Lima', '(34) 99888-7654', 'Pilates por dor lombar crônica', CURRENT_DATE - INTERVAL '50 days'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'João Pedro Alves', '(34) 99666-1111', 'Atleta amador, lesão de ombro', CURRENT_DATE - INTERVAL '40 days'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'Beatriz Andrade', '(34) 99933-2222', 'Postura e cervicalgia', CURRENT_DATE - INTERVAL '30 days'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'Pedro Henrique', '(34) 99111-3333', '', CURRENT_DATE - INTERVAL '20 days'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'Fernanda Lopes', '(34) 99222-4444', 'Tendinite no punho', CURRENT_DATE - INTERVAL '10 days'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'Rafaela Pinto', '(34) 99333-5555', '', CURRENT_DATE - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- Inserir Agendamentos Exemplos
INSERT INTO public.appointments (id, patient_id, service_id, professional_id, date, time, status) VALUES
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', CURRENT_DATE, '08:00', 'confirmado'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', CURRENT_DATE, '09:00', 'confirmado'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', CURRENT_DATE, '10:00', 'confirmado'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', CURRENT_DATE, '11:00', 'confirmado')
ON CONFLICT (id) DO NOTHING;

-- Inserir Configurações
INSERT INTO public.clinic_settings (clinic_name, opening_time, closing_time, slot_minutes) VALUES
  ('Vitaliza Fisioterapia', '07:00', '19:00', 30)
ON CONFLICT DO NOTHING;
