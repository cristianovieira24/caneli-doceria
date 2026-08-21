# Caneli Doceria — website

Site institucional + cardápio + pedidos por WhatsApp + painel
administrativo, para a Caneli Doceria (Goiânia).

## Status deste pacote

Este projeto está sendo construído em fases, combinadas com você no chat.
**Esta entrega é a Fase 1**: fundação técnica + design system + páginas
públicas com dados reais.

| Fase | Conteúdo | Status |
|---|---|---|
| 1 | Design system, schema completo do banco (RLS incluída), seed com dados reais, páginas públicas (Home, Cardápio, Unidades, Encomendas, Sobre, Contato) consumindo Supabase | ✅ Entregue |
| 2 | Cardápio interativo (seletor de unidade, busca, filtros por categoria e dietas), página de produto (variações/adicionais), carrinho e finalização pelo WhatsApp | ✅ Entregue |
| 3 | Painel administrativo completo: login + recuperação de senha, CRUD de produtos/categorias/unidades/campanhas, horário por dia da semana, upload real de fotos, importação/exportação CSV de produtos, exportação CSV de encomendas, gestão de usuários e papéis | ✅ Entregue |
| 4 | Sitemap/robots.txt, dados estruturados (schema.org: Bakery, Product, FAQPage, Breadcrumb), FAQ pública + painel, analytics com aviso de cookies (só carrega após consentimento), páginas de Privacidade/Termos, acessibilidade (link "pular para o conteúdo") | ✅ Entregue |

As 4 fases combinadas estão completas. O que resta é o que só a Caneli (ou alguém técnico) consegue fazer — ver "O que ainda depende de dados reais" e "Rodando localmente" abaixo — e itens menores listados no final deste README, em "Próximos polimentos (opcionais)".

Peça para eu continuar quando quiser seguir para a próxima fase.

## Como funciona o pedido (Fase 2)

- O cliente escolhe a unidade no cardápio; a escolha fica salva no
  navegador (assim como o carrinho) e some se ele trocar de unidade,
  já que preço e disponibilidade podem mudar entre lojas.
- Produtos sem linha em `store_products` para a unidade escolhida
  aparecem como "Indisponível nesta unidade" — nada é assumido.
- O carrinho é só do navegador (não grava pedido no banco ainda); ao
  finalizar, ele monta a mensagem exigida no briefing e abre o
  WhatsApp da unidade escolhida com o texto pronto.

## Painel administrativo (Fase 3)

- Acesse em `/admin`. Antes de logar pela primeira vez, siga "Configurando
  o Supabase" abaixo para criar seu usuário e virar `proprietario`.
- Papéis: **proprietário** (acesso total, inclusive gerenciar usuários),
  **administrador** (produtos, categorias, unidades, campanhas,
  encomendas) e **editor** (mesmas telas de conteúdo, sem excluir
  registros críticos). Tudo isso é reforçado por Row Level Security —
  mesmo com o link de uma ação, ninguém executa sem o papel certo.
- **Fotos**: upload real (arrasta/seleciona o arquivo, vai para o
  Supabase Storage, bucket `media`) em produtos, categorias, unidades e
  campanhas.
- **Horário**: em Unidades → editar uma loja → seção "Horário de
  funcionamento", um campo por dia da semana.
- **Campanhas**: crie com data de início/término — elas aparecem e somem
  sozinhas conforme a data, sem precisar voltar para trocar o status.
- **CSV**: em Produtos, "Exportar CSV" baixa tudo; "Importar CSV" sobe
  uma planilha (tem um modelo pra baixar na própria tela) — linhas com
  slug existente atualizam o produto, as novas são criadas; erros por
  linha aparecem num relatório, nada é importado sem passar pela
  validação.
- **Usuários**: só o proprietário vê a tela `/admin/usuarios`. Ao atribuir
  um papel para um e-mail que ainda não existe no Supabase Auth, o painel
  cria a conta e envia automaticamente o convite para definir a senha.
- A gestão de usuários usa a `SUPABASE_SERVICE_ROLE_KEY` — preencha essa
  variável no `.env.local` (nunca no navegador) para essa tela funcionar.

## SEO e analytics (Fase 4)

- `/sitemap.xml` e `/robots.txt` são gerados automaticamente a partir do
  banco (produtos publicados e unidades ativas).
- Cada produto e cada unidade tem dados estruturados (schema.org) e
  breadcrumbs — ajuda o Google a entender preço, endereço e horário.
- Analytics (Google Tag Manager) só carrega depois que o visitante aceita
  o aviso de cookies. Preencha `NEXT_PUBLIC_GTM_ID` no `.env.local` para
  ativar; deixando em branco, nenhum script de terceiro carrega.
- Eventos já disparando (quando o analytics está ativo): clique no
  WhatsApp, clique no mapa, clique em delivery externo, escolha de
  unidade, abrir produto, adicionar ao carrinho, iniciar checkout, ver
  campanha, enviar formulário de encomenda.

## Próximos polimentos (opcionais)

Tudo que foi combinado nas 4 fases está entregue. Se quiser continuar
depois, isto ainda não foi feito (nenhum é bloqueante para publicar):
- Reordenar categorias arrastando com o mouse (hoje é um número digitado)
- Preview de produto/campanha antes de publicar
- Ampliar o editor de conteúdo para textos além do hero da home e da seção
  principal da página Sobre
- Testes automatizados (o projeto foi validado com `typecheck` e `lint`,
  não há testes end-to-end)

## O que já funciona

- Next.js 14 (App Router) + TypeScript + Tailwind, com um design system
  próprio (cores, tipografia, componentes) derivado do material real da
  marca — ver `tailwind.config.ts`.
- Schema completo do Postgres/Supabase com **Row Level Security** já
  configurada: visitantes só leem conteúdo publicado/ativo; edição exige
  papel de equipe (`editor`, `administrador` ou `proprietario`).
- Dados iniciais **reais**, extraídos de:
  - `https://linktr.ee/doceriacaneli` → as 4 unidades, endereços e WhatsApp;
  - `https://www.vucafood.com.br/canelidoceria/2556/cardapio-digital` →
    categorias, produtos, descrições e preços (cardápio da Loja Matriz).
- Páginas públicas consultando o banco de verdade (sem cardápio fixo no
  código), com estados vazios corretos quando não há dado ainda.
- `npm run typecheck` e `npm run lint` passam limpos.

## O que ainda depende de dados reais (não foi inventado)

- **Horário de funcionamento** por unidade — não veio estruturado nas
  fontes consultadas. Preencha em `store_hours` (via SQL ou, na Fase 3,
  pelo painel).
- **Fotos dos produtos e das lojas** — os prints enviados são posts de
  Instagram, cujas imagens não são URLs estáveis para hot-link. Faça
  upload das fotos reais (ideal: pela galeria de mídia da Fase 3) e
  associe em `product_images` / `stores.photo_url`. Enquanto isso, os
  cards mostram "Foto em breve" em vez de imagem genérica.
- **Cardápio das outras 3 unidades** — o link da VucaFood publica o
  cardápio só da Loja Matriz. O seed vincula todos os produtos apenas a
  ela; confirme com a equipe o que cada unidade vende (e a que preço)
  antes de vincular via `store_products`.
- **Texto da página Sobre** — deixado como placeholder explícito; a
  história da marca deve vir da equipe, não foi inventada.
- **Coordenadas (lat/lng) das lojas**, para mapa embutido — não
  extraídas das fontes; hoje o botão "Ver no mapa" abre uma busca pelo
  endereço no Google Maps, o que já funciona sem coordenadas.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha com as chaves do seu projeto Supabase
npm run dev
```

> Neste ambiente de geração de código eu não tenho acesso a
> `fonts.googleapis.com` nem a `supabase.co`, então não consegui rodar
> `next build` nem testar contra um banco real — validei com
> `tsc --noEmit` e `next lint`, que passam limpos. No seu ambiente
> (Vercel, ou local com internet), o build deve funcionar normalmente.

## Configurando o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, rode as migrations em ordem, de
   `supabase/migrations/001_extensions.sql` até
   `009_integrity_and_security.sql`.
3. Rode `supabase/seed/seed.sql` para carregar os dados reais iniciais.
4. Em **Authentication → Users**, crie o primeiro usuário (você) e depois
   rode:
   ```sql
   insert into user_roles (user_id, role)
   values ('<uuid-do-usuário>', 'proprietario');
   ```
   Depois desse primeiro acesso, novos usuários podem ser convidados pelo
   próprio painel em `/admin/usuarios`.
5. Copie a **Project URL** e a **anon public key** em
   *Settings → API* para o seu `.env.local`.

## Deploy

- **Frontend**: conecte o repositório à [Vercel](https://vercel.com) e
  configure as mesmas variáveis de `.env.example` no painel do projeto.
- **Banco/Auth/Storage**: permanece no Supabase — nenhuma credencial fica
  no código (`.env.local` está no `.gitignore`).

## Estrutura de pastas

```
src/
  app/            páginas (App Router) — cada pasta é uma rota
  components/     componentes de UI compartilhados
  lib/            clientes Supabase, formatação, mensagem de WhatsApp
  types/          tipos TypeScript do domínio (espelham as migrations)
supabase/
  migrations/     schema do banco, em ordem, com RLS
  seed/           dados iniciais reais
```
