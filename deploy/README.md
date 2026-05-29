# OS Monitor — Node/Express (deploy no Render)

Versão standalone em **Node + Express**, pronta para deploy no Render como Web Service.

## Estrutura
- `server.js` — Express servindo `/api/monitor` (proxy + parser HTML) e estáticos
- `public/index.html` — dashboard (Tailwind via CDN, sem build)
- `package.json` — apenas `express`

## Rodar local
```bash
cd deploy
npm install
npm start
# http://localhost:3000
```

## Deploy no Render
1. Suba esta pasta (ou o repo inteiro) no GitHub.
2. No Render: **New → Web Service** → conecte o repo.
3. Configure:
   - **Root Directory**: `deploy` (se subiu o repo inteiro)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Opcional — variável `SOURCE_URL` para apontar para outro host (default: `https://soproject2.onrender.com`).
6. Deploy. Render injeta `PORT` automaticamente.

Pronto.
