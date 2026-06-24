# API Campo Minado
API REST desenvolvida em Node.js para uma plataforma de apostas baseada no jogo Campo Minado.
## Tecnologias Utilizadas
- Node.js (v24.15.0)
- Express.js
- PostgreSQL
- pg
- bcrypt
- cors
- dotenv
- nodemon
## Integrantes
- Luis Felipe de Abreu Mendonça
## Instalação
Clone o repositório:
```bash
git clone https://github.com/usuario/api-campo-minado.git
cd api-campo-minado
npm install
```
## Configuração
Crie um arquivo `.env` na raiz do projeto (use `.env.example` como base):
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campo_minado
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
NODE_ENV=development
```
Crie o banco de dados antes de subir a API:
```sql
CREATE DATABASE campo_minado;
```
As tabelas são criadas automaticamente na primeira execução (migration roda no boot).
Você também pode rodar manualmente:
```bash
npm run migrate
```
## Executando a aplicação
```bash
npm run dev
```
A API estará disponível em `http://localhost:3000`.
## Estrutura do projeto
```
api-campo-minado/
├── src/
│   ├── config/         # conexão com o banco e migrations
│   ├── controllers/    # camada HTTP
│   ├── services/       # regras de negócio
│   ├── repositories/   # acesso ao banco
│   ├── routes/         # mapeamento das rotas
│   ├── middlewares/    # tratamento de erros
│   ├── utils/          # validadores e helpers
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```
## Endpoints
### Autenticação
#### POST /auth/register
Cadastra um novo usuário.
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-01",
  "senha": "Senha@123",
  "confirmacaoSenha": "Senha@123"
}
```
Regras da senha: mínimo 8 caracteres, ao menos 1 maiúscula, 1 número e 1 caractere especial.
#### POST /auth/login
Autentica o usuário.
```json
{ "email": "joao@email.com", "senha": "Senha@123" }
```
#### PATCH /auth/reset-password
Define nova senha (não pode ser igual à atual).
```json
{ "id": 1, "novaSenha": "NovaSenha@123" }
```
### Usuário
#### GET /users/:id
Retorna dados do usuário.
#### GET /users/dashboard?idUser=1
Retorna estatísticas do usuário.
```json
{
  "totalJogos": 20,
  "vitorias": 12,
  "derrotas": 8,
  "valorGanho": 450.00,
  "valorPerdido": 220.00
}
```
#### PUT /users/:id
Atualiza o saldo (não permite negativo, limita a 2 casas decimais).
```json
{ "saldo": 2345.45 }
```
#### DELETE /users/:id
Remove o usuário e todos os jogos vinculados (cascade via FK).
### Jogo
#### POST /games/start
Inicia uma nova aposta. Valida saldo, debita aposta, gera tabuleiro 5x5 (com 5 bombas aleatórias) e bloqueia novas partidas enquanto houver uma em andamento.
```json
{ "idUser": 1, "valorAposta": 100 }
```
Retorno:
```json
{ "gameId": 1 }
```
#### POST /games/:gameId/reveal
Revela uma posição (0..4, 0..4).
```json
{ "linha": 2, "coluna": 3 }
```
Resultado DIAMANTE:
```json
{ "resultado": "DIAMANTE", "diamantesEncontrados": 3, "premioAtual": 199 }
```
Resultado BOMBA:
```json
{ "resultado": "BOMBA", "status": "PERDIDO" }
```
#### POST /games/:gameId/cashout
Finaliza a partida e credita o prêmio acumulado no saldo do usuário.
## Fórmula de premiação
```
premio = valorAposta * (1 + (quantidadeDiamantes * 0.33))
```
Em caso de bomba: `premio = 0`.
## Observações
- O sistema usa IDs gerados automaticamente pelo PostgreSQL (`SERIAL`).
- Senhas são armazenadas com hash `bcrypt`.
- Relacionamento entre `jogos.usuario_id` e `usuarios.id` é feito por chave estrangeira com `ON DELETE CASCADE`.