# Talent Academy

Sistema para gestão de cursos, treinamentos e capacitações.  
Projeto desenvolvido para estudos de arquitetura front-end, back-end e integração com banco de dados.

## Tecnologias Utilizadas

### **Backend**
- Node.js
- Express
- PostgreSQL
- pg (driver PostgreSQL)
- Cors
- Dotenv

# Talent Academy

Sistema para gestão de cursos, treinamentos e capacitações — projeto focado em arquitetura
front-end, back-end e integração com banco de dados.

## Última atualização

Este README foi atualizado automaticamente para documentar funcionalidades adicionadas
desde a versão anterior. Revise as seções abaixo e ajuste detalhes de execução conforme
seu ambiente local.

## Tecnologias utilizadas

**Backend**
- Node.js
- Express
- PostgreSQL (via `pg`)
- Cors
- dotenv

**Frontend**
- HTML5, CSS3, JavaScript (Vanilla)
- Bootstrap 5
- Tom Select
- Vanilla Masker

## Novidades / Funcionalidades detectadas

- Backend
    - Endpoints e rotas para: `curso`, `local`, `professor`, `turma` (arquivos em `backend/src/routes`).
    - Conexão com banco em `backend/src/db.js` e utilitários `ajusteDatas.js` e `comparaRegistros.js`.

- Frontend
    - APIs de cliente para: `curso`, `local`, `professor`, `turma`, `cidade`, `uf`, `modalidade`, `usuarios` (em `frontend/src/api`).
    - Páginas e telas: listagem e detalhamento de `cursos`, `locais`, `professores` e `turmas` (`frontend/src/pages`).
    - Formulário de usuário e componentes de UI: `usuario-form`, `render-usuarios.component`, `gerar-input-html.component`.
    - Serviços para comunicação com o backend: `curso.service.js`, `local.service.js`, `professor.service.js`, `turma.service.js`.
    - Vários utilitários: carregamento de selects, cache de usuários, modais e tratamento de datas.

- Assets e deploy
    - Integração com bibliotecas locais em `frontend/assets/lib` (Bootstrap, Tom Select, Vanilla Masker).
    - Arquivo de configuração para deploy: `vercel.json`.

## Estrutura do projeto (resumida)

talent-academy/
- backend/
    - package.json
    - src/
        - server.js
        - db.js
        - routes/
            - curso.routes.js
            - local.routes.js
            - professor.routes.js
            - turma.routes.js
        - utils/
            - ajusteDatas.js
            - comparaRegistros.js

- frontend/
    - vercel.json
    - assets/
        - css/
        - img/
        - lib/
            - bootstrap/
            - tom-select/
            - vanilla-masker/
    - components/
    - src/
        - api/
        - main/
        - pages/
        - service/
        - ui/
        - utils/

## Como executar (local)

Backend (exemplo)

1. Entre na pasta do backend:

```powershell
cd backend
```

2. Instale dependências e inicie (ajuste conforme seu `package.json`):

```powershell
npm install
npm start
```

Frontend (exemplo)

- Abra `frontend/src/pages/index.html` (ou o `frontend/index.html`) em um servidor estático
    ou diretamente no navegador durante desenvolvimento.

## Observações e próximos passos

- Confirme se os scripts em `backend/package.json` são `start`/`dev` e ajuste os comandos acima.
- Se desejar, posso:
    - gerar um CHANGELOG com as diferenças detectadas entre a documentação antiga e o código atual;
    - preparar um commit com esta atualização do README;
    - completar instruções de execução (variáveis de ambiente, exemplos de `.env`).

---

Arquivo atualizado: [talent-academy/readme.md](talent-academy/readme.md)
