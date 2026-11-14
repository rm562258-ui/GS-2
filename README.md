# Nexus Verde

Aplicativo mobile desenvolvido em **React Native + Expo** para a **Global Solution 2026/2 (CitizenTech)** da FIAP, na disciplina de **Mobile Application Development**.

O Nexus Verde ajuda a garantir o acesso à água potável em situações de crise, como enchentes e secas. O aplicativo conecta cidadãos sem água às equipes de apoio, mostra onde há água disponível e informa quais regiões estão afetadas.

> **Escopo deste repositório:** aplicativo mobile da solução. O backend (API REST em Java com Spring Boot) é desenvolvido na disciplina de Java Advanced e consumido por este app.

## Problema

Mesmo com grandes reservas de água doce, milhões de brasileiros têm dificuldade de acesso à água potável, principalmente durante desastres. As enchentes no Rio Grande do Sul mostraram como uma catástrofe compromete o abastecimento, contamina fontes de água e deixa comunidades inteiras sem um recurso essencial.

O problema não é só a falta de água, mas também a dificuldade de saber **onde ela está disponível**, **quem precisa de ajuda** e **como organizar a distribuição**.

## Solução

O Nexus Verde reúne em um único aplicativo:

- **Pedidos de ajuda:** o cidadão informa que está sem água potável, com a quantidade de pessoas, a urgência, se há pessoas vulneráveis e o endereço (com localização opcional pelo GPS).
- **Fila de atendimento:** a equipe de apoio vê todos os pedidos ordenados por prioridade e acompanha o atendimento (aberto, em atendimento, atendido).
- **Pontos de água potável:** postos de distribuição, caminhões-pipa, reservatórios e abrigos, com estoque disponível, horário, distância do usuário e rota pelo app de mapas.
- **Alertas de regiões afetadas:** áreas com abastecimento interrompido ou água imprópria, por nível de risco.

### Objetivos de Desenvolvimento Sustentável (ONU)

- **ODS 6 – Água potável e saneamento:** facilita o acesso à água segura em emergências.
- **ODS 11 – Cidades e comunidades sustentáveis:** apoia a resposta a desastres e a proteção das comunidades vulneráveis.
- **ODS 13 – Ação contra a mudança global do clima:** fortalece a capacidade de reação a eventos climáticos extremos.

## Perfis de usuário

| Perfil              | Como acessa                                                                          | O que faz                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Cidadão**         | Cria a conta na tela de cadastro                                                     | Pede ajuda (cadastra, consulta, edita e exclui os próprios pedidos), encontra pontos de água e acompanha os alertas |
| **Equipe de apoio** | Conta cadastrada pela organização (não é possível se cadastrar como equipe pelo app) | Atende a fila de pedidos por prioridade, atualiza o status dos pedidos e cadastra, edita e exclui pontos de água    |

## Funcionalidades

### Autenticação

- Cadastro de cidadão com nome, e-mail, telefone, cidade e senha.
- Login com e-mail e senha, com validação dos campos e mensagens de erro.
- Sessão salva no armazenamento seguro do aparelho e restaurada ao abrir o app.
- Logout com confirmação, que apaga o token e limpa os dados em cache.
- Rotas protegidas: as telas internas só existem na navegação quando há usuário autenticado.
- Se a API recusar o token (HTTP 401), a sessão é encerrada e o usuário volta ao login.

### Pedidos de ajuda (CRUD)

- **Cadastrar:** tipo de ajuda, urgência, número de pessoas, presença de pessoas vulneráveis, descrição, endereço, cidade e localização opcional.
- **Consultar:** lista com filtros por status, atualização ao puxar a tela e detalhes do pedido.
- **Editar e excluir:** permitidos ao cidadão enquanto o pedido ainda está aberto.
- **Prioridade:** cada pedido exibe a prioridade calculada (0 a 100) para orientar o atendimento.
- **Atendimento (equipe):** iniciar atendimento, marcar como atendido ou cancelar, com confirmação.

### Pontos de água (CRUD da equipe)

- Lista com busca por nome, bairro ou cidade e filtros por situação do estoque.
- Ordenação pela distância do usuário quando a localização é permitida.
- Barra de estoque disponível em relação à capacidade.
- "Como chegar" abre o app de mapas do celular; "Ligar" inicia a chamada para o ponto.
- A última lista recebida fica salva no aparelho e é exibida quando não há conexão, com aviso da data.
- A equipe cadastra, edita e exclui pontos, com validação (por exemplo, o estoque não pode ser maior que a capacidade).

### Alertas e tela inicial

- Regiões afetadas ordenadas por nível de risco, com situação e população afetada.
- Início do cidadão: atalho para pedir ajuda, resumo dos próprios pedidos, alertas graves e pontos com água disponível.
- Início da equipe: indicadores (pedidos aguardando, em atendimento e regiões críticas), pedidos mais urgentes e pontos que precisam de reabastecimento.

### Perfil, aparência e Sobre o App

- Perfil com os dados do usuário e o papel (Cidadão ou Equipe de apoio).
- Tema Sistema, Claro ou Escuro, salvo no aparelho.
- Tela **Sobre o App** com versão, data da build, **hash do commit de referência** (curto e completo), link do repositório, ODS e integrantes.

## Telas

| Área    | Tela                 | Descrição                                               |
| ------- | -------------------- | ------------------------------------------------------- |
| Pública | Login                | Entrada com e-mail e senha                              |
| Pública | Cadastro             | Criação da conta de cidadão                             |
| Abas    | Início               | Resumo conforme o perfil                                |
| Abas    | Pedidos              | Meus pedidos (cidadão) ou fila de pedidos (equipe)      |
| Abas    | Pontos de água       | Lista, busca, filtros e distância                       |
| Abas    | Alertas              | Regiões afetadas por nível de risco                     |
| Abas    | Perfil               | Dados do usuário, aparência e saída                     |
| Pilha   | Detalhes do pedido   | Informações, mapa e ações de edição ou atendimento      |
| Pilha   | Formulário de pedido | Novo pedido ou edição                                   |
| Pilha   | Detalhes do ponto    | Estoque, distância, rota, telefone e gestão             |
| Pilha   | Formulário de ponto  | Cadastro e edição de pontos (somente equipe)            |
| Pilha   | Sobre o App          | Versão e hash do commit (não conta como tela funcional) |

## Tecnologias

| Biblioteca                                        | Para que é usada                                                        |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| React Native 0.88 + Expo SDK 58                   | Base do aplicativo                                                      |
| TypeScript (strict)                               | Tipagem e segurança no código                                           |
| React Navigation 7 (native-stack e bottom-tabs)   | Navegação entre telas e rotas protegidas                                |
| Axios                                             | Comunicação HTTP com a API (camada de acesso em `src/api`)              |
| TanStack Query                                    | Cache, carregamento, erros e atualização das listas após cada alteração |
| React Hook Form + Zod                             | Formulários e validação dos campos                                      |
| expo-secure-store                                 | Armazenamento seguro do token de sessão                                 |
| AsyncStorage                                      | Preferência de tema e cópia offline dos pontos de água                  |
| expo-location                                     | Distância até os pontos e localização do pedido                         |
| expo-font, expo-splash-screen, @expo/vector-icons | Fonte própria, tela de abertura e ícones                                |
| expo-constants                                    | Dados da build exibidos em Sobre o App                                  |
| ESLint (eslint-config-expo) + Prettier            | Padronização e formatação do código                                     |

O mapa não é exibido dentro do app para não depender de chave paga da Google Maps Platform: o botão **Como chegar** abre o aplicativo de mapas do próprio celular.

## Identidade visual

- **Cores:** verde (ação, natureza) e azul (água), com paleta própria para os temas claro e escuro em `src/theme/colors.ts`.
- **Fonte:** Plus Jakarta Sans (licença OFL), em `assets/fonts`.
- **Imagens:** logo (gota com uma rede de conexões, o "nexus"), ícones do app, splash e ilustrações em `assets/images`.
- **Acessibilidade:** áreas de toque de no mínimo 48 dp, rótulos para leitores de tela, mensagens de erro anunciadas e contraste adequado nos dois temas, seguindo as guidelines do Material Design e da Apple.

## Arquitetura

```text
GS-2/
├── assets/
│   ├── fonts/              # Fonte Plus Jakarta Sans e licença
│   └── images/             # Logo, ícones, splash e ilustrações
├── src/
│   ├── api/                # Rotas da API
│   ├── components/
│   │   ├── ui/             # Componentes reutilizáveis (botão, campo, cartão, estados de tela...)
│   │   ├── form/           # Campos ligados ao React Hook Form
│   │   └── ...             # Componentes por funcionalidade (pedidos, pontos, alertas, início)
│   ├── config/             # TanStack Query e dados da build
│   ├── constants/          # Rótulos dos status, equipe e ODS
│   ├── contexts/           # Autenticação, tema e avisos (toast)
│   ├── hooks/              # Consultas e alterações com TanStack Query, localização
│   ├── navigation/         # Pilha raiz, abas, tema da navegação e tipagem das rotas
│   ├── schemas/            # Regras de validação dos formulários (Zod)
│   ├── screens/            # Telas, agrupadas por funcionalidade
│   ├── services/           # Acesso aos dados, sessão, localização e conversão do JSON da API
│   ├── theme/              # Cores, tipografia, espaçamentos e sombras
│   ├── types/              # Modelos do app e formato do JSON da API
│   └── utils/              # Erros, datas, distância, mapas e formatação
├── App.tsx                 # Provedores e navegação
├── app.json                # Configuração do Expo
├── app.config.ts           # Inclui hash do commit e data da build na configuração
└── package.json
```

### Fluxo dos dados

```text
Tela → Hook (TanStack Query) → Service → Cliente da API → API REST
```

- As telas não fazem chamadas HTTP: usam hooks, que chamam os serviços.
- Os serviços convertem o JSON da API (`src/types/api.ts`) para os modelos do app (`src/types/models.ts`) em `src/services/mappers.ts`. Se a API mudar o formato de algum campo, apenas os conversores precisam ser ajustados.
- Depois de cada cadastro, edição ou exclusão, as listas são atualizadas automaticamente pela invalidação do cache.
- Erros de rede, de validação e de permissão viram mensagens claras na tela (avisos, mensagens nos formulários e estados de erro com "Tentar novamente").

### Autenticação

```text
Login/Cadastro → API devolve token JWT + usuário → token no expo-secure-store
→ token enviado em cada requisição → telas protegidas liberadas
Logout ou HTTP 401 → token apagado + cache limpo → volta ao Login
```

## Integração com a API

O app consome a API REST da disciplina de Java Advanced. As rotas utilizadas estão centralizadas em `src/api/endpoints.ts`:

| Método | Rota                        | Uso                                          |
| ------ | --------------------------- | -------------------------------------------- |
| POST   | `/auth/register`            | Cadastro de cidadão                          |
| POST   | `/auth/login`               | Login (retorna token JWT e usuário)          |
| GET    | `/solicitacoes`             | Pedidos do cidadão ou fila completa (equipe) |
| GET    | `/solicitacoes/{id}`        | Detalhes do pedido                           |
| POST   | `/solicitacoes`             | Novo pedido                                  |
| PUT    | `/solicitacoes/{id}`        | Edição do pedido                             |
| DELETE | `/solicitacoes/{id}`        | Exclusão do pedido                           |
| PATCH  | `/solicitacoes/{id}/status` | Atualização do atendimento (equipe)          |
| GET    | `/pontos-agua`              | Lista de pontos de água                      |
| GET    | `/pontos-agua/{id}`         | Detalhes do ponto                            |
| POST   | `/pontos-agua`              | Novo ponto (equipe)                          |
| PUT    | `/pontos-agua/{id}`         | Edição do ponto (equipe)                     |
| DELETE | `/pontos-agua/{id}`         | Exclusão do ponto (equipe)                   |
| GET    | `/regioes`                  | Regiões afetadas                             |

> **Situação atual:** enquanto a API Java é finalizada, os serviços usam dados provisórios em memória (`src/services/placeholder`), com o mesmo formato de requisição e resposta da API. Esta seção será atualizada com o endereço da API publicada.

## Como executar

### Requisitos

- Node.js 22 LTS ou superior
- Git
- Android Studio com um emulador (ex.: Pixel 6) ou um celular Android com o app **Expo Go**

### Passos

1. Clone o repositório e entre na pasta:

```bash
git clone https://github.com/rm562258-ui/GS-2.git
cd GS-2
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o projeto:

```bash
npm start
```

4. Com o emulador aberto, pressione `a` no terminal. No celular, leia o QR Code com o Expo Go.

### Contas de teste

| Perfil          | E-mail                  | Senha         |
| --------------- | ----------------------- | ------------- |
| Cidadão         | `maria@nexusverde.com`  | `Cidadao@123` |
| Equipe de apoio | `equipe@nexusverde.com` | `Equipe@123`  |

Também é possível criar uma conta de cidadão pela tela de cadastro.

### Scripts

| Comando             | O que faz                                        |
| ------------------- | ------------------------------------------------ |
| `npm start`         | Inicia o Expo                                    |
| `npm run android`   | Inicia o Expo e abre no Android                  |
| `npm run lint`      | Verifica o código com ESLint                     |
| `npm run lint:fix`  | Corrige o que o ESLint consegue corrigir sozinho |
| `npm run format`    | Formata o código com Prettier                    |
| `npm run typecheck` | Verifica os tipos do TypeScript                  |
| `npm run doctor`    | Verifica a configuração do projeto Expo          |

## Fluxo sugerido para testar

1. Criar uma conta de cidadão ou entrar com a conta de teste.
2. No Início, tocar em **Pedir ajuda** e cadastrar um pedido.
3. Abrir o pedido em **Pedidos**, editar e excluir.
4. Em **Pontos de água**, permitir a localização, buscar um ponto, abrir os detalhes e usar **Como chegar**.
5. Consultar os **Alertas**.
6. No **Perfil**, trocar o tema e abrir **Sobre o App** para conferir o hash do commit.
7. Sair e entrar com a conta da **Equipe de apoio**.
8. Na fila de pedidos, abrir o pedido de maior prioridade e iniciar o atendimento.
9. Em **Pontos de água**, cadastrar, editar e excluir um ponto.
10. Sair e confirmar que as telas internas não ficam mais acessíveis.

## Vídeo de demonstração

**YouTube:** _link será adicionado após a gravação_

## Integrantes

| Nome                                 | RM       |
| ------------------------------------ | -------- |
| Carlos Alberto Guedes Neto           | RM566022 |
| Eduardo Novaes Mollo                 | RM561515 |
| Luan Peixoto Marins Rocha            | RM562258 |
| Mathaus Victor Souza Marcelino       | RM564146 |
| Vinicius Luis Exposito Morasi Garcia | RM563340 |
