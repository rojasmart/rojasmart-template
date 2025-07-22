# Terminal Real - rojasmart.dev

## Visão Geral

O site rojasmart.dev funciona com um **Terminal Real** usando uma interface dividida:

- **Lado Esquerdo**: Exibe o output dos comandos executados no terminal
- **Lado Direito**: Interface de input de comandos com WebSocket

### Como Funciona

1. **Digite comandos** no terminal à direita
2. **Veja os resultados** na área principal à esquerda
3. **Sessão persistente** mantém o contexto entre comandos

### 1. Instalar Dependências

```bash
npm install ws @types/ws
```

### 2. Iniciar o Servidor

```bash
npm run dev
```

### 3. Usar o Terminal

1. **Interface dividida**:

   - Lado esquerdo: Output dos comandos
   - Lado direito: Input de comandos (área de digitação)

2. Aguarde a conexão WebSocket ser estabelecida (indicador verde = conectado)

3. Use comandos reais como:
   - `ls -la` - listar ficheiros
   - `pwd` - mostrar directório atual
   - `whoami` - mostrar utilizador
   - `node --version` - versão do Node.js
   - `npm --version` - versão do npm
   - `cat package.json` - ler ficheiros
   - `mkdir test` - criar diretório
   - `echo "Hello" > test.txt` - criar ficheiros

### 4. Funcionalidades

- ✅ **Execução de comandos reais do sistema**
- ✅ **Interface dividida**: comandos à direita, output à esquerda
- ✅ **Sessão persistente** - mantém o contexto entre comandos
- ✅ **Botões rápidos** para comandos comuns
- ✅ **Indicador de conexão** (verde = conectado, vermelho = desconectado)
- ✅ **Auto-reconexão** se a conexão falhar
- ✅ **Suporte completo para Node.js, npm, e comandos do sistema**
- ✅ **Output em tempo real** na área principal

### 5. Segurança

⚠️ **Aviso**: O terminal real executa comandos no servidor. Use apenas em ambiente de desenvolvimento.

Para produção, considere:

- Containerização (Docker)
- Restrições de comandos
- Autenticação
- Limitações de recursos

### 6. Resolução de Problemas

**Problema**: "Connection error. Check if server is running."
**Solução**: Certifique-se que o servidor Next.js está rodando (`npm run dev`)

**Problema**: "Failed to initialize WebSocket server."
**Solução**: Verifique se a porta 3001 está disponível

**Problema**: Comandos não respondem
**Solução**: Verifique o console do navegador para erros WebSocket

### 7. Comandos Úteis para Testar

```bash
# Informações do sistema
uname -a
whoami
pwd

# Node.js
node --version
npm --version
node -e "console.log('Hello from Node.js!')"

# Operações de ficheiros
ls -la
cat package.json
mkdir test-folder
echo "Test content" > test.txt
cat test.txt

# Git (se disponível)
git --version
git status

# Limpeza
clear
```

### 8. Arquitetura

```
┌─────────────────┬──────────────────┐
│                 │                  │
│   OUTPUT        │   INPUT          │
│   (Esquerda)    │   (Direita)      │
│                 │                  │
│   Mostra        │   Terminal       │
│   resultados    │   para           │
│   dos comandos  │   digitar        │
│                 │   comandos       │
└─────────────────┴──────────────────┘
        ↓                    ↓
   Browser (React) ←→ WebSocket ←→ Next.js API ←→ Node.js Child Process ←→ Sistema Operativo
```

O terminal funciona com uma **interface dividida**:

- **Esquerda**: Exibe o output dos comandos em tempo real
- **Direita**: Interface para digitação de comandos
- **WebSocket**: Comunicação bidirecional entre browser e servidor Node.js
