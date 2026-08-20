# 🌿 Vitaliza Fisioterapia — Flow (Projeto Fantasma de Demonstração)

> ⚠️ **Aviso de Projeto Fantasma (MVP / Demonstração):**  
> Este projeto é uma **aplicação fantasma de demonstração comercial (Mockup Interativo / MVP)** desenvolvida para ilustrar as capacidades de um sistema digital sob medida para clínicas de fisioterapia e reabilitação. Todos os dados, pacientes, agendamentos, profissionais e relatórios financeiros presentes são **fictícios (seeds de simulação)** para fins de validação de interface (UI/UX) e apresentação para clientes.

---

## 🚀 Demonstração Online

Acesse o sistema de demonstração interativo publicado e pronto para uso:  
👉 **[Acessar Vitaliza Flow no GitHub Pages](https://projetos-conselt.github.io/vitaliza-flow/)**

---

## 🎯 Objetivo e Proposta da Demonstração

O **Vitaliza Flow** foi concebido como um **protótipo funcional de alta fidelidade** com o objetivo de apresentar a diretores e profissionais de saúde como a tecnologia pode transformar uma clínica real, substituindo rotinas manuais, papéis e planilhas por um sistema centralizado, moderno e responsivo.

### Principais Pilares Demonstrados:
1. **Agilidade no Atendimento:** Agendamento rápido com detecção inteligente de conflitos de horários em tempo real.
2. **Personalização por Nível de Acesso:** Simulação de interfaces distintas para Recepcionistas, Fisioterapeutas e Gestores.
3. **Visão Financeira & Gerencial:** Dashboards e gráficos interativos com simulação de métricas de ocupação, faturamento e absenteísmo.
4. **Prontuário & Pacientes:** Histórico clínico simulado com queixas frequentes e evolução de tratamentos.

---

## 👥 Perfis de Acesso para Demonstração

Para facilitar a apresentação ao cliente, a tela de login possui um **pop-up de credenciais interativo** que permite selecionar qualquer perfil com um único clique:

| Nível de Acesso | Usuário Simulado | Módulos e Permissões Visíveis |
| :--- | :--- | :--- |
| **👩‍💼 Recepcionista** | `mariana@vitaliza.com` / `vitaliza` | • **Dashboard Geral:** Visão do dia, faltas e horários livres<br>• **Agenda:** Marcação, reagendamento e cancelamento<br>• **Pacientes:** Cadastro rápido e listagem<br>• **Profissionais & Serviços:** Consulta de tabela e horários |
| **🩺 Fisioterapeuta** | `juliana@vitaliza.com` / `vitaliza` | • **Dashboard Clínico:** Próximos atendimentos do dia<br>• **Agenda do Terapeuta:** Visualização semanal e diária focada em atendimento<br>• **Prontuário de Pacientes:** Acompanhamento de evolução e notas |
| **📊 Gestor / Administrador** | `roberto@vitaliza.com` / `vitaliza` | • **Todos os módulos anteriores**<br>• **Relatórios:** Gráficos de faturamento por serviço, ocupação e metas<br>• **Configurações:** Horário de funcionamento e intervalos de atendimento<br>• **Gestão de Equipe:** Tabela de preços e profissionais |

---

## 🛠️ Funcionalidades Simuladas no Protótipo

### 1. 📅 Agenda Inteligente & Conflitos
- Visualização semanal e diária com dados simulados.
- Filtro rápido por fisioterapeuta responsável.
- **Detecção automática de sobreposição:** o sistema impede o agendamento em horários conflitantes para o mesmo profissional.
- **Sugestão de horários livres:** algoritmo em JavaScript que calcula janelas de tempo disponíveis no expediente.

### 2. 👥 Gestão de Pacientes
- Base de pacientes fictícios com telefones e queixas simuladas (ex.: hérnia de disco lombar, pós-cirúrgico de joelho, pilates por dor crônica).

### 3. 💼 Serviços & Procedimentos
- Catálogo de procedimentos com durações e valores de tabela demonstrativos.

### 4. 📈 Relatórios & Analytics
- Gráficos interativos (Recharts) demonstrando faturamento mensal, serviços mais procurados e taxa de faltas.

---

## 🗄️ Estrutura do Banco de Dados (Supabase / PostgreSQL)

Mesmo sendo uma demonstração, a arquitetura está preparada para virar um sistema em produção completo com backend **Supabase**:

- `users`: Usuários do sistema e seus níveis de permissão (`recepcionista`, `fisioterapeuta`, `gestor`).
- `patients`: Cadastro de pacientes e observações clínicas.
- `professionals`: Especialidades, horários de expediente e cores na agenda.
- `services`: Procedimentos, durações e preços.
- `appointments`: Agendamentos com status (`confirmado`, `pendente`, `cancelado`, `falta`, `realizado`).
- `clinic_settings`: Horários de funcionamento da clínica.

> 📄 O script SQL com a modelagem relacional completa e dados de teste está disponível em [`supabase/schema.sql`](./supabase/schema.sql).

---

## 💻 Tecnologias Utilizadas

- **Frontend:** React 19 + TypeScript
- **Roteamento:** TanStack Router (SPA com HTML5 History)
- **Estilização:** Tailwind CSS v4 + Radix UI
- **Ícones & Gráficos:** Lucide React & Recharts
- **Gerenciamento de Estado:** Zustand (armazenamento local simulado com persistência)
- **Manipulação de Datas:** Date-fns (pt-BR)
- **Build Tool:** Vite
- **Hospedagem & CI/CD:** GitHub Pages + GitHub Actions

---

## 📦 Como Executar o Protótipo Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Projetos-CONSELT/vitaliza-flow.git
   cd vitaliza-flow
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o ambiente de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   `http://localhost:5173` ou `http://localhost:8080`

---

## 🏢 Sobre o Desenvolvimento

Projeto desenvolvido como **material de demonstração e validação de solução digital** pela **CONSELT** — Consultoria e Soluções em Engenharia.
