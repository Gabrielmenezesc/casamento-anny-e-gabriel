/* Existing gift catalogue. Financial targets intentionally remain unset. */
window.WEDDING_GIFT_CATALOG = `Liquidificador|🏠 Eletrodomésticos e Móveis
Cafeteira|🏠 Eletrodomésticos e Móveis
Sanduicheira|🏠 Eletrodomésticos e Móveis
Batedeira|🏠 Eletrodomésticos e Móveis
Processador de alimentos|🏠 Eletrodomésticos e Móveis
Espremedor de frutas|🏠 Eletrodomésticos e Móveis
Purificador de água|🏠 Eletrodomésticos e Móveis
Bebedouro|🏠 Eletrodomésticos e Móveis
Sofá|🏠 Eletrodomésticos e Móveis
Mesa de jantar|🏠 Eletrodomésticos e Móveis
Cadeiras para mesa|🏠 Eletrodomésticos e Móveis
Rack para TV|🏠 Eletrodomésticos e Móveis
Guarda-roupa|🏠 Eletrodomésticos e Móveis
Criado-mudo|🏠 Eletrodomésticos e Móveis
Escrivaninha|🏠 Eletrodomésticos e Móveis
Cadeira de escritório|🏠 Eletrodomésticos e Móveis
Estante|🏠 Eletrodomésticos e Móveis
Aparador|🏠 Eletrodomésticos e Móveis
Sapateira|🏠 Eletrodomésticos e Móveis
Jogo de panelas|🍳 Cozinha
Panela de pressão|🍳 Cozinha
Frigideiras|🍳 Cozinha
Assadeiras|🍳 Cozinha
Formas de bolo|🍳 Cozinha
Travessas|🍳 Cozinha
Refratários|🍳 Cozinha
Jogo de pratos|🍳 Cozinha
Tigelas|🍳 Cozinha
Copos|🍳 Cozinha
Taças|🍳 Cozinha
Canecas|🍳 Cozinha
Xícaras|🍳 Cozinha
Faqueiro|🍳 Cozinha
Facas de cozinha|🍳 Cozinha
Conchas e pegadores|🍳 Cozinha
Tábua de corte|🍳 Cozinha
Escorredor|🍳 Cozinha
Potes e jarras|🍳 Cozinha
Garrafa térmica|🍳 Cozinha
Porta-temperos|🍳 Cozinha
Jogo de lençóis|🛏 Quarto
Travesseiros|🛏 Quarto
Edredom|🛏 Quarto
Cobertor|🛏 Quarto
Colcha de cama|🛏 Quarto
Mantas decorativas|🛏 Quarto
Cabides|🛏 Quarto
Toalhas de banho|🚿 Banheiro
Tapete de banheiro|🚿 Banheiro
Cortina Box|🚿 Banheiro
Porta sabonete|🚿 Banheiro
Cesto de roupas|🚿 Banheiro
Cortinas|🛋 Sala
Tapete de sala|🛋 Sala
Almofadas|🛋 Sala
Mesa de centro|🛋 Sala
Mesa lateral|🛋 Sala
Luminária|🛋 Sala
Ferro de passar|🧺 Lavanderia
Tábua de passar|🧺 Lavanderia
Vassoura e rodo|🧺 Lavanderia
Panos e esponjas|🧺 Lavanderia
Kit Ferramentas|📦 Diversos
Filtro de Linha|📦 Diversos
Espelho|📦 Diversos
Relógio de parede|📦 Diversos
Organizadores|📦 Diversos`.split("\n").map((row, index) => { const [name, category] = row.split("|"); return { id: `g_${String(index + 1).padStart(3, "0")}`, name, category, description: "Item especial para nossa nova jornada.", target_amount_cents: null, confirmed_amount_cents: 0 }; });
