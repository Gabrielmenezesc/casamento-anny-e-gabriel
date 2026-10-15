# Backend de contribuições automáticas

Este Worker usa a API oficial de Payments do Mercado Pago. Ele cria um PIX único por contribuição, valida a assinatura `x-signature` do webhook e consulta novamente o pagamento na API antes de gravar qualquer confirmação. O valor no site é sempre a soma do banco D1; o navegador não tem autoridade para confirmar pagamentos.

## Implantação

1. Crie uma base D1 e substitua `database_id` em `wrangler.toml`.
2. Rode `npx wrangler d1 execute casamento-contributions --remote --file=schema.sql`.
3. Cadastre cada presente em `gifts`. `target_amount_cents` deve ser informado em centavos pelos noivos; mantenha `NULL` enquanto não houver meta. Não registre preço de loja como meta sem confirmação dos noivos.
4. Defina os segredos no Worker: `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `MP_COLLECTOR_ID` e `PUBLIC_API_URL` (URL HTTPS pública do Worker).
5. No painel Mercado Pago, cadastre `https://SEU-WORKER/webhooks/mercadopago` em Webhooks para o tópico `payment`. A chave de assinatura desse painel é `MP_WEBHOOK_SECRET`.
6. Em `js/contributions-config.js`, defina a URL HTTPS do Worker e publique o site.

O Worker reconcilia cobranças pendentes a cada 10 minutos. Webhooks repetidos não duplicam contribuições porque `provider_payment_id`, `charge_id` e `event_id` são únicos. Estornos parciais reduzem o valor líquido e estornos totais removem o valor líquido do total público.

## Compras em lojas

Os links atuais são buscas em Amazon, Mercado Livre, Shopee e Magalu, sem ID de pedido nem credencial de vendedor. Eles não oferecem neste projeto uma integração oficial que associe um pedido a um presente; por isso permanecem apenas como consulta externa e nunca alteram o estado. Uma integração futura só deve inserir em `external_orders` um pedido consultado pela API oficial da loja, com `payment_status='paid'`; entrega deve ser registrada separadamente em `delivery_status`.
