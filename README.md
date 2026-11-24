# Marketplace API

API REST para gerenciamento de usuários, lojas e produtos de um marketplace.

## Stack

- Node.js e Express 5
- Prisma ORM
- MySQL
- Zod para validação
- JWT e bcrypt para autenticação
- Vitest e Supertest para testes
- Swagger UI para documentação

## Configuração local

1. Copie o arquivo de ambiente:

   ```bash
   cp .env.example .env
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o MySQL e execute as migrações:

   ```bash
   docker compose up -d mysql
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Inicie a API:

   ```bash
   npm run dev
   ```

A API fica disponível em `http://localhost:3000` e a documentação em
`http://localhost:3000/docs`.

## Docker

Para iniciar toda a aplicação:

```bash
docker compose up --build
```

## Scripts

- `npm run dev`: inicia em modo de desenvolvimento.
- `npm start`: inicia em modo normal.
- `npm test`: executa os testes.
- `npm run lint`: executa o ESLint.
- `npm run format`: formata os arquivos.
- `npm run prisma:migrate`: cria/aplica migrações em desenvolvimento.
- `npm run prisma:deploy`: aplica migrações em produção.

## Autenticação

Crie uma conta em `POST /auth/register` e autentique em `POST /auth/login`.
Envie o token recebido nas rotas protegidas:

```http
Authorization: Bearer <token>
```

## Endpoints principais

| Método | Rota | Autenticação |
|---|---|---|
| `POST` | `/auth/register` | Não |
| `POST` | `/auth/login` | Não |
| `GET` | `/auth/me` | Sim |
| `GET` | `/stores?page=1&limit=20` | Não |
| `POST` | `/stores` | Sim |
| `GET` | `/stores/:id` | Não |
| `PUT` | `/stores/:id` | Sim |
| `DELETE` | `/stores/:id` | Sim |
| `GET` | `/products?page=1&limit=20` | Não |
| `POST` | `/products` | Sim |
| `GET` | `/products/:id` | Não |
| `PUT` | `/products/:id` | Sim |
| `DELETE` | `/products/:id` | Sim |
| `GET` | `/users?page=1&limit=20` | Sim |
| `PUT` | `/users/:id` | Sim |
| `DELETE` | `/users/:id` | Sim |

Cada usuário só pode editar ou excluir sua própria conta, suas lojas e os produtos
dessas lojas.
