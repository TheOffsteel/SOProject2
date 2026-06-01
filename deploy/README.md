# OS Monitor — Node/Express

Dashboard de monitoramento seguindo `AGENTS.md` (JS puro + Express) e `DESIGN.md`
(sistema NVIDIA: preto/branco + verde `#76b900`, geometria angular 2px).

## Estrutura

```
deploy/
├── server.js                       # entry
├── routes/monitor.js               # GET /api/monitor
├── controllers/monitorController.js
├── services/monitorService.js      # fetch + parse HTML do host
└── public/
    ├── index.html                  # view
    ├── css/styles.css
    └── js/app.js
```

## Rodar local

```bash
npm install
npm start
# http://localhost:3000
```

## Deploy no Render

1. Faça push do repositório no GitHub.
2. No Render: **New → Web Service**, conecte o repo, defina **Root Directory** = `deploy`.
3. Build: `npm install` · Start: `npm start` · Runtime: Node 18+.
4. (Opcional) Variável `SOURCE_URL` se quiser apontar para outro host.
