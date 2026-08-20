# 🌿 Vitaliza Fisioterapia — Flow (Gestão Clínica Digital)

Sistema completo e moderno para gestão clínica de fisioterapia, reabilitação e pilates. Desenvolvido para organizar o fluxo de trabalho de ponta a ponta: desde a recepção e agendamento de pacientes até o acompanhamento do histórico clínico e relatórios gerenciais/financeiros.

---

## 🚀 Demonstração Online

Acesse o sistema publicado e pronto para uso:
👉 **[Vitaliza Fisioterapia no GitHub Pages](https://projetos-conselt.github.io/vitaliza-flow/)**

---

## 🎯 Objetivo e Proposta de Valor

A **Vitaliza Flow** foi projetada para eliminar o uso de planilhas manuais, papel e conflitos de horários em clínicas de fisioterapia. O sistema centraliza:
1. **Agilidade no Atendimento:** Agendamento rápido com detecção inteligente de conflitos de horários.
2. **Personalização por Nível de Acesso:** Telas e permissões personalizadas para Recepcionistas, Fisioterapeutas e Gestores.
3. **Visão Financeira & Gerencial:** Métricas de ocupação, faturamento mensal, faltas e desempenho por profissional.
4. **Prontuário & Pacientes:** Histórico de consultas, queixas clínicas e contatos em um só lugar.

---

## 👥 Perfis de Acesso e Permissões

O sistema conta com controle de acesso baseado em papéis (*Role-Based Access Control*):

| Nível de Acesso | Usuário Exemplo | Módulos e Permissões |
| :--- | :--- | :--- |
| **👩‍💼 Recepcionista** | `mariana@vitaliza.com` / `vitaliza` | • **Dashboard Geral:** Visão do dia, faltas e horários livres<br>• **Agenda:** Marcação, reagendamento e cancelamento<br>• **Pacientes:** Cadastro rápido e listagem<br>• **Profissionais & Serviços:** Consulta de tabela e horários |
| **🩺 Fisioterapeuta** | `juliana@vitaliza.com` / `vitaliza` | • **Dashboard Clínico:** Próximos pacientes do dia<br>• **Agenda do Terapeuta:** Visualização semanal e diária<br>• **Prontuário de Pacientes:** Acompanhamento de evolução e notas |
| **📊 Gestor / Administrador** | `roberto@vitaliza.com` / `vitaliza` | • **Todos os módulos anteriores**<br>• **Relatórios:** Faturamento, gráficos de faturamento por serviço e ocupação<br>• **Configurações:** Horário de funcionamento da clínica e intervalos de atendimento<br>• **Gerenciamento de Profissionais e Serviços:** Valores e durações |

---

## 🛠️ Funcionalidades Principais

### 1. 📅 Agenda Inteligente & Conflitos
- Visualização por **Semana** ou por **Dia**.
- Filtro rápido por fisioterapeuta responsável.
- **Detecção automática de sobreposição:** o sistema impede o agendamento em horários conflitantes para o mesmo profissional.
- **Sugestão de horários livres:** sugestões automáticas baseadas na duração do procedimento e no expediente da clínica.

### 2. 👥 Gestão de Pacientes
- Cadastro completo com telefone, observações clínicas (ex.: hérnia lombar, pós-operatório, tendinites).
- Histórico de atendimentos realizados e faltas registradas.

### 3. 💼 Serviços & Procedimentos
- Gestão de durações (ex.: 50 min, 60 min) e preços de cada procedimento (Fisioterapia Ortopédica, Esportiva, RPG, Pilates Clínico, Atendimento Domiciliar).

### 4. 📈 Relatórios & Analytics
- Gráficos interativos com métricas de desempenho.
- Comparativos mensais de faturamento e índice de absenteísmo (faltas).

---

## 🗄️ Estrutura do Banco de Dados (Supabase / PostgreSQL)

O projeto possui integração nativa e arquivos SQL prontos na pasta `supabase/`:

- `users`: Usuários do sistema e seus níveis de permissão (`recepcionista`, `fisioterapeuta`, `gestor`).
- `patients`: Cadastro de pacientes e observações clínicas.
- `professionals`: Especialidades, horários de expediente e cores de identificação na agenda.
- `services`: Catálogo de procedimentos com tempo de duração e valores.
- `appointments`: Agendamentos com data, hora, profissional, serviço, paciente e status (`confirmado`, `pendente`, `cancelado`, `falta`, `realizado`).
- `clinic_settings`: Horários de abertura, fechamento e tamanho padrão dos blocos de horário.

> 📄 O script completo de criação com permissões RLS (Row Level Security) e dados de demonstração está disponível em [`supabase/schema.sql`](./supabase/schema.sql).

---

## 💻 Tecnologias Utilizadas

- **Frontend:** React 19 + TypeScript
- **Roteamento:** TanStack Router
- **Estilização:** Tailwind CSS v4 + Radix UI (Componentes acessíveis)
- **Ícones & Gráficos:** Lucide React & Recharts
- **Gerenciamento de Estado:** Zustand (com persistência local e suporte a Supabase)
- **Manipulação de Datas:** Date-fns (pt-BR)
- **Build Tool:** Vite
- **Hospedagem & CI/CD:** GitHub Pages + GitHub Actions

---

## 📦 Como Rodar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Projetos-CONSELT/vitaliza-flow.git
   cd vitaliza-flow
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Abra no navegador:**
   `http://localhost:5173` ou `http://localhost:8080`

---

## 📄 Licença & Desenvolvimento

Desenvolvido para a **Clínica Vitaliza Fisioterapia** pela **CONSELT** — Consultoria e Soluções em Engenharia.
