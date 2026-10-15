PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS gifts (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, description TEXT,
  target_amount_cents INTEGER CHECK(target_amount_cents IS NULL OR target_amount_cents >= 0),
  external_purchase_url TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS charges (
  id TEXT PRIMARY KEY, gift_id TEXT NOT NULL REFERENCES gifts(id), requested_amount_cents INTEGER NOT NULL CHECK(requested_amount_cents > 0),
  provider_payment_id TEXT UNIQUE, external_reference TEXT NOT NULL UNIQUE, status TEXT NOT NULL,
  payer_email TEXT, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS contributions (
  id TEXT PRIMARY KEY, charge_id TEXT NOT NULL UNIQUE REFERENCES charges(id), gift_id TEXT NOT NULL REFERENCES gifts(id), provider_payment_id TEXT NOT NULL UNIQUE,
  gross_amount_cents INTEGER NOT NULL, refunded_amount_cents INTEGER NOT NULL DEFAULT 0, net_amount_cents INTEGER NOT NULL, currency TEXT NOT NULL, status TEXT NOT NULL,
  confirmed_at TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS webhook_events (event_id TEXT PRIMARY KEY, provider TEXT NOT NULL, payload TEXT NOT NULL, received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS external_orders (id TEXT PRIMARY KEY, gift_id TEXT NOT NULL REFERENCES gifts(id), provider TEXT NOT NULL, provider_order_id TEXT NOT NULL, payment_status TEXT NOT NULL, delivery_status TEXT, confirmed_at TEXT, UNIQUE(provider, provider_order_id));
CREATE INDEX IF NOT EXISTS charges_status_idx ON charges(status, created_at);
CREATE INDEX IF NOT EXISTS contributions_gift_idx ON contributions(gift_id, status);
