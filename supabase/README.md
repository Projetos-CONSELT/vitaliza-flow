# Conexão do Supabase (Vitaliza Flow)

Para conectar o projeto ao Supabase em produção ou desenvolvimento:

1. Acesse seu painel no [Supabase](https://supabase.com/).
2. Abra o **SQL Editor** do projeto e execute o conteúdo de `supabase/schema.sql`.
3. Copie a **URL do Projeto** e a chave **anon key** das configurações de API do Supabase.
4. Adicione as variáveis de ambiente na sua hospedagem ou arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```
