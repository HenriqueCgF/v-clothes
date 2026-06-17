# 🚀 Como rodar o V-Clothes no seu computador

## Passo 1 — Instalar o Node.js

1. Acesse: **https://nodejs.org**
2. Clique no botão verde **"LTS"** (versão recomendada)
3. Baixe e instale normalmente (avançar, avançar, finalizar)
4. Para confirmar que funcionou, abra o Terminal (ou Prompt de Comando) e digite:
   ```
   node --version
   ```
   Deve aparecer algo como `v20.x.x`

---

## Passo 2 — Abrir a pasta do projeto no Terminal

### Windows:
1. Abra a pasta **V-clothes** no Explorador de Arquivos
2. Clique na barra de endereço no topo
3. Digite `cmd` e pressione Enter
4. Um terminal vai abrir já na pasta certa

### Mac:
1. Clique com botão direito na pasta **V-clothes**
2. Selecione "Novo Terminal na Pasta"

---

## Passo 3 — Instalar as dependências

No terminal, digite o comando abaixo e pressione Enter:

```
npm install
```

Aguarde (pode demorar 1-2 minutos na primeira vez). Você verá uma pasta chamada `node_modules` ser criada.

---

## Passo 4 — Iniciar o site

No terminal, digite:

```
npm run dev
```

Você verá algo como:
```
▲ Next.js 14.2.5
- Local: http://localhost:3000
```

---

## Passo 5 — Abrir no navegador

Abra o seu navegador e acesse:

```
http://localhost:3000
```

**Pronto! O site está rodando!** 🎉

---

## Gerando o QR Code para a Feira

Com o site rodando, você pode usar qualquer gerador de QR code online para criar um código que aponte para `http://localhost:3000`.

**Dica:** Para que outras pessoas na feira acessem pelo celular, você vai precisar que o celular esteja na mesma rede Wi-Fi que o computador. Nesse caso:
1. Descubra o IP do seu computador (no Windows: `ipconfig`, no Mac: `ifconfig`)
2. Use `http://SEU-IP:3000` no lugar de `localhost:3000`

---

## Estrutura dos arquivos

```
V-clothes/
├── app/              → Páginas do site
├── components/       → Seções da landing page
├── lib/
│   └── i18n.ts       → Todos os textos em PT e EN
├── COMO-RODAR.md     → Este arquivo
└── package.json      → Configuração do projeto
```

Para alterar qualquer texto do site, edite o arquivo **`lib/i18n.ts`** — lá estão todos os textos em português e inglês.

---

## Problemas comuns

**`npm: command not found`** → Node.js não foi instalado. Volte ao Passo 1.

**Porta 3000 em uso** → No terminal, tente `npm run dev -- --port 3001`

**Erro na instalação** → Tente deletar a pasta `node_modules` e rodar `npm install` novamente.
