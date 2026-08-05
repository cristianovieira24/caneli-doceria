-- seed.sql
-- Real data only, sourced from:
--   • https://linktr.ee/doceriacaneli (units, WhatsApp numbers, addresses)
--   • https://www.vucafood.com.br/canelidoceria/2556/cardapio-digital
--     (Loja Matriz menu — categories, product names, descriptions, prices)
--
-- IMPORTANT — read before running against production:
-- 1. The VucaFood cardápio is published for LOJA MATRIZ only. This seed
--    therefore links every seeded product to Loja Matriz via
--    store_products, and leaves the other 3 units WITHOUT availability
--    rows. The Caneli team must confirm, per unit, which of these
--    products are sold there (and at what price) before publishing —
--    per the project brief, prices/availability are not assumed to be
--    universal across units.
-- 2. Store hours, "Dia dos Pais" pricing (seasonal) and the exact opening
--    time shown on VucaFood ("Aberto") were not captured with enough
--    structure to seed reliably — store_hours is left empty; fill it in
--    via the admin panel from confirmed hours.
-- 3. This is a representative subset of the full cardápio (the source
--    has 100+ items across 20+ categories) — enough to populate and
--    demo every part of the storefront. Import the remaining items via
--    the CSV importer (phase 2) once the client confirms per-unit
--    availability and pricing.

-- ── Stores ──────────────────────────────────────────────────────────
insert into stores (slug, name, neighborhood, address, whatsapp, order_mode, status, display_order) values
  ('matriz', 'Loja Matriz', 'Alto do Vale', 'Av. Fonte Nova, Quadra 16 - Lote 35 - St. Alto do Vale, Goiânia', '5562996448093', 'whatsapp', 'active', 0),
  ('candida-de-morais', 'Loja Cândida de Morais', 'Cândida de Morais', 'L. 04 - Av. Cm 12, Esq. c/ Rua Palmares Qd. 5b, Rua Cândida de Morais, Sala 3, Goiânia', '5562991002838', 'whatsapp', 'active', 1),
  ('vera-cruz', 'Loja Vera Cruz', 'Vera Cruz', 'Avenida Gercina Borges Teixeira qd QC 46 Lt 01 c-2 Conjunto Vera Cruz 2, Goiânia', '5562992029362', 'whatsapp', 'active', 2),
  ('goiania-2', 'Loja Goiânia 2', 'Goiânia 2', 'Av. Blvd. Conde dos Arcos, Qd. 25 - Lt. 01, Nº C1 - Sala 04 - St. Goiânia 2, Goiânia', '5562992871038', 'whatsapp', 'active', 3);

insert into external_links (store_id, label, url, display_order)
  select id, 'Cardápio VucaFood', 'https://www.vucafood.com.br/canelidoceria/2556/cardapio-digital', 0
  from stores where slug = 'matriz';

-- ── Categories (from the real VucaFood category list) ──────────────
insert into categories (slug, name, display_order) values
  ('bebidas-quentes', 'Bebidas Quentes', 0),
  ('salgados-assados', 'Salgados Assados', 1),
  ('croissants', 'Croissants | Assados na Hora', 2),
  ('tortas-de-fatias', 'Tortas de Fatias', 3),
  ('mini-croissants', 'Mini Croissants', 4),
  ('milks-gelados-e-frappes', 'Milks Gelados e Frappes', 5),
  ('sobremesas-de-brownies', 'Sobremesas de Brownies', 6),
  ('produtos-zero', 'Produtos Zero', 7),
  ('bolo-no-acetato', 'Bolo no Acetato', 8),
  ('doces-de-vitrine', 'Doces de Vitrine', 9),
  ('tortas-sobremesa', 'Tortas Sobremesa', 10);

insert into tags (slug, name) values
  ('zero-acucar', 'Zero adição de açúcar'),
  ('zero-lactose', 'Zero lactose'),
  ('sem-gluten', 'Sem glúten');

-- ── Products (real items/descriptions/prices, representative subset) ─
-- Bebidas Quentes
insert into products (slug, name, short_description, category_id, price, status, display_order) values
  ('cappuccino-caneli-tradicional', 'Cappuccino Caneli Tradicional', 'Nosso cappuccino caneli tradicional! Receita criada pelo nosso time para servir vocês com excelência!', (select id from categories where slug = 'bebidas-quentes'), 14.00, 'published', 0),
  ('cafe-espresso-longo', 'Café Espresso Longo', 'Café espresso tirado na hora, sem açúcar.', (select id from categories where slug = 'bebidas-quentes'), 8.00, 'published', 1),
  ('chocolate-quente-cremoso', 'Chocolate Quente Cremoso', 'Chocolate cremoso quentinho feito com mistura de cacau 50% e 100%, doce na medida certa!', (select id from categories where slug = 'bebidas-quentes'), 18.00, 'published', 2),
  ('cafe-latte', 'Café Latte', 'Espresso suave com leite vaporizado.', (select id from categories where slug = 'bebidas-quentes'), 10.00, 'published', 3);

-- Salgados Assados
insert into products (slug, name, short_description, category_id, price, status, display_order) values
  ('esfiha-de-carne', 'Esfiha de Carne', 'Esfiha fechada de carne tradicional', (select id from categories where slug = 'salgados-assados'), 15.00, 'published', 0),
  ('coxinha-de-frango', 'Coxinha de Frango', 'Massa de batata, recheio de frango desfiado cremoso', (select id from categories where slug = 'salgados-assados'), 15.00, 'published', 1),
  ('enroladinho-de-queijo', 'Enroladinho de Queijo', 'Queijo minas derretendo na massa fofinha + calda à sua escolha (coco, doce de leite ou chocolate)', (select id from categories where slug = 'salgados-assados'), 15.00, 'published', 2);

-- Croissants — featured category, real hero product
insert into products (slug, name, short_description, category_id, price, featured, status, display_order) values
  ('croissant-pistache-morangos', 'Croissant com Pistache e Morangos', 'DE PISTACHE! Croissant quentinho assado na hora: recheado com pasta de pistache & morangos! :)', (select id from categories where slug = 'croissants'), 32.00, true, 'published', 0),
  ('croissant-nutella-morangos', 'Croissant com Nutella e Morangos', 'Croissant quentinho assado na hora: recheado com nutella & morangos! :)', (select id from categories where slug = 'croissants'), 32.00, true, 'published', 1),
  ('croissant-tradicional-amanteigado', 'Croissant Tradicional Amanteigado', 'Croissant amanteigado tradicional', (select id from categories where slug = 'croissants'), 20.00, false, 'published', 2),
  ('croissant-biscoff', 'Croissant Amanteigado com Biscoff', 'Croissant amanteigado assado na hora recheado com pasta de biscoff', (select id from categories where slug = 'croissants'), 35.00, true, 'published', 3),
  ('croissant-queijo-duplo', 'Croissant Amanteigado com Queijo Duplo', 'Croissant tradicional amanteigado, recheado com fatias de queijo.', (select id from categories where slug = 'croissants'), 26.00, false, 'published', 4);

-- Tortas de Fatias
insert into products (slug, name, short_description, category_id, price, status, display_order) values
  ('torta-fatia-nutella-morango', 'Torta Fatia Nutella e Morango', 'Torta mousse estilo cheesecake, feita com creme cheese, brigadeiro branco e chantilly, com geleia de morango e cobertura de nutella. 1 fatia = 250g.', (select id from categories where slug = 'tortas-de-fatias'), 25.00, 'published', 0),
  ('fatia-banoffe', 'Fatia de Banoffe', 'Fatia de torta banoffe clássica, feita com banana nanica. Contém canela. 1 fatia = 250g', (select id from categories where slug = 'tortas-de-fatias'), 25.00, 'published', 1);

-- Mini Croissants
insert into products (slug, name, short_description, category_id, price, status, display_order) values
  ('mini-croissant-doce-de-leite-canela', 'Mini Croissant de Doce de Leite e Canela', 'Mini croissant recheado de doce de leite com ou sem canela', (select id from categories where slug = 'mini-croissants'), 16.00, 'published', 0),
  ('mini-croissant-nutella-morangos', 'Mini Croissant de Nutella e Morangos', 'Mini croissant de nutella com morangos', (select id from categories where slug = 'mini-croissants'), 16.00, 'published', 1);

-- Milks Gelados e Frappes
insert into products (slug, name, short_description, category_id, price, status, display_order) values
  ('pink-milk', 'Pink Milk', 'Morangos frescos + sorvete + geleia artesanal + chantilly', (select id from categories where slug = 'milks-gelados-e-frappes'), 22.00, 'published', 0),
  ('frappe-de-nutella', 'Frappe de Nutella', 'Café + nutella + sorvete. Caso queira sem café, avise!', (select id from categories where slug = 'milks-gelados-e-frappes'), 22.00, 'published', 1);

-- Sobremesas de Brownies
insert into products (slug, name, short_description, category_id, price, status, display_order) values
  ('brownie-quentinho', 'Brownie Quentinho', 'Brownie de cacau, quentinho & maravilhoso! Receita criada pelo nosso time de produção desde 2020! :)', (select id from categories where slug = 'sobremesas-de-brownies'), 15.00, 'published', 0),
  ('brownie-com-nutella', 'Brownie com Nutella', 'Brownie de cacau com cobertura de nutella, super quentinho & maravilhoso!', (select id from categories where slug = 'sobremesas-de-brownies'), 18.00, 'published', 1);

-- Produtos Zero
insert into products (slug, name, short_description, category_id, price, status, display_order) values
  ('rocambole-zero', 'Rocambole Zero', 'Leite em pó, leite de coco, chocolate em pó, adoçante xilitol. Zero adição de açúcares, zero lactose, sem glúten. 1 porção = 35 gramas.', (select id from categories where slug = 'produtos-zero'), 20.00, 'published', 0),
  ('cappuccino-zero-lactose', 'Cappuccino Zero Lactose', 'Cappuccino quentinho tradicional, receita caneli. Zero lactose. Contém canela.', (select id from categories where slug = 'produtos-zero'), 15.00, 'published', 1);

-- Bolo no Acetato (uses "a partir de" pricing, as in the source)
insert into products (slug, name, short_description, category_id, price, price_prefix, weight_or_size, status, display_order) values
  ('bolo-acetato-grande', 'Bolo no Acetato Grande', '2,2kg a 2,5kg — consultar sabores na vitrine da loja.', (select id from categories where slug = 'bolo-no-acetato'), 180.00, 'a partir de', '2,2kg a 2,5kg', 'published', 0),
  ('bolo-acetato-medio', 'Bolo no Acetato Médio', 'Aproximadamente 1,5kg — consultar sabores na vitrine da loja.', (select id from categories where slug = 'bolo-no-acetato'), 130.00, 'a partir de', '~1,5kg', 'published', 1),
  ('bolo-acetato-baby', 'Bolo no Acetato Baby', '500g a 600g — consultar sabores na vitrine da loja.', (select id from categories where slug = 'bolo-no-acetato'), 60.00, 'a partir de', '500g a 600g', 'published', 2);

-- Doces de Vitrine
insert into products (slug, name, short_description, category_id, price, status, display_order) values
  ('brigadeiro-tradicional-avulso', 'Brigadeiro Tradicional Avulso', 'Consultar sabores disponíveis no dia!', (select id from categories where slug = 'doces-de-vitrine'), 5.00, 'published', 0),
  ('caixinha-de-docinhos', 'Caixinha de Docinhos', 'Caixinha com 4 docinhos variados', (select id from categories where slug = 'doces-de-vitrine'), 20.00, 'published', 1);

-- Tortas Sobremesa (large-format, serves 10-12 — good candidates for "Encomendas")
insert into products (slug, name, short_description, category_id, price, weight_or_size, yield_info, status, display_order) values
  ('torta-brownie-2', 'Torta Brownie 2', 'Brownie em pedaços + mousse ninho + mousse de chocolate + brigadeiro cremoso com morangos.', (select id from categories where slug = 'tortas-sobremesa'), 115.00, '~1,5kg', 'Serve até 10/12 pessoas', 'published', 0),
  ('torta-prestigio', 'Torta Prestígio', 'Bolo de chocolate + creme de coco + brigadeiro cremoso. Decoração: coco ralado, bicos de chantilly de chocolate.', (select id from categories where slug = 'tortas-sobremesa'), 115.00, '~1,5kg', 'Serve até 10/12 pessoas', 'published', 1);

-- ── Availability: link every seeded product to Loja Matriz ──────────
-- (the only unit the VucaFood cardápio is published for — see note at top)
insert into store_products (store_id, product_id, available)
  select (select id from stores where slug = 'matriz'), id, true from products;

-- ── Primary image placeholders ───────────────────────────────────────
-- No image URLs were provided in a form this seed can safely reuse
-- (Instagram post images are not stable, hot-linkable URLs). Upload real
-- product photos via the admin media library, then set product_images.
-- Left empty intentionally — see README "O que ainda depende de dados reais".
