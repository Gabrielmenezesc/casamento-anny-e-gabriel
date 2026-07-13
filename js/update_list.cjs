const fs = require('fs');

const rawList = `🏠 Eletrodomésticos e Móveis
Liquidificador
Cafeteira
Sanduicheira
Batedeira
Processador de alimentos
Espremedor de frutas
Purificador/Filtro de água
Bebedouro
Sofá
Mesa de jantar
Cadeiras para mesa
Rack para TV
Guarda-roupa
Criado-mudo
Escrivaninha
Cadeira de escritório
Estante
Aparador
Sapateira

🍳 Cozinha
Jogo de panelas
Panela de pressão
Frigideiras
Assadeiras
Formas
Travessas
Refratários
Pratos
Pratos fundos
Pratos sobremesa
Tigelas
Copos
Taças
Canecas
Xícaras
Faqueiro
Facas
Conchas
Espátulas
Pegadores
Tábuas
Escorredor
Ralador
Abridor
Descascador
Potes
Jarras
Garrafa térmica
Porta-temperos
Lixeira

🛏 Quarto
Jogo de lençóis
Fronhas
Travesseiros
Edredom
Cobertor
Colcha
Mantas
Cabides

🚿 Banheiro
Toalhas
Tapetes
Cortina Box
Lixeira
Porta sabonete
Porta escovas
Cesto de roupas

🛋 Sala
Cortinas
Tapete
Almofadas
Mesa de centro
Mesa lateral
Luminária

🧺 Lavanderia
Varal
Ferro
Tábua
Balde
Vassoura
Rodo
Mop
Pá
Panos
Esponjas

📦 Diversos
Kit Ferramentas
Filtro de Linha
Extensão
Escada
Espelho
Relógio
Organizadores`;

const lines = rawList.split('\n');
let currentCat = '';
let items = [];

for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('🏠') || t.startsWith('🍳') || t.startsWith('🛏') || t.startsWith('🚿') || t.startsWith('🛋') || t.startsWith('🧺') || t.startsWith('📦')) {
        currentCat = t;
    } else {
        items.push(`  { name: "${t}", cat: "${currentCat}" }`);
    }
}

const itemsString = `const RAW_ITEMS = [\n${items.join(',\n')}\n];`;

const content = fs.readFileSync('C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium\\js\\presentes.js', 'utf-8');
const updatedContent = content.replace(/const RAW_ITEMS = \[\s*\{\s*name:\s*"Test",\s*cat:\s*"Test"\s*\}\s*\];/, itemsString);
fs.writeFileSync('C:\\Users\\ENGEFIELD\\Downloads\\GL\\casamento-premium\\js\\presentes.js', updatedContent);
console.log('updated');
