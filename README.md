# 🌸 Juju Girl Fit - PWA de Treino e Dieta Feminina

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FC35E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A67D8?style=for-the-badge&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

> **Aplicação PWA completa voltada para mulheres que desejam manter uma vida saudável através de treinos personalizados e planos alimentares.**

## 🎯 **Sobre o Projeto**

O **Juju Girl Fit** é uma Progressive Web App (PWA) desenvolvida especificamente para o público feminino, oferecendo uma experiência completa de wellness com foco em treinos e alimentação saudável. A aplicação combina design moderno, funcionalidade robusta e performance otimizada.

### ✨ **Principais Características**

- 📱 **100% Mobile-First**: Interface otimizada para dispositivos móveis
- 🌐 **PWA Completa**: Funciona offline e pode ser instalada como app nativo
- 🎨 **Design Feminino**: Paleta de cores rosa/gradientes e UX intuitiva
- ⚡ **Performance**: Bundle otimizado e carregamento rápido
- 🔐 **Seguro**: Autenticação completa via Supabase
- 📊 **Analytics**: Dashboard com métricas e progressos

## 🚀 **Funcionalidades**

### 🏠 **Dashboard Principal**
- Visão geral do progresso diário
- Estatísticas de treinos e alimentação
- Calendário de progresso interativo
- Sistema de navegação dock personalizado

### 🍎 **Sistema Alimentar**
- Quiz personalizado (6 perguntas otimizadas)
- Planos alimentares customizados
- Tracking de refeições diárias
- Sugestões baseadas em restrições/alergias

### 💪 **Sistema de Treinos**
- Quiz de avaliação física completo
- Planos de treino semanais
- Tabela de exercícios detalhada
- Acompanhamento de progressos

### 📸 **Avaliação Corporal**
- Upload de fotos de progresso
- Compressão automática de imagens
- Sistema de antes/depois
- Histórico de evolução

### 👤 **Perfil de Usuário**
- Dados pessoais personalizáveis
- Histórico de atividades
- Configurações de preferências
- Sistema de onboarding

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **React 18** - Library principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Framer Motion** - Animações fluidas

### **UI/UX**
- **Shadcn/UI** - Componentes reutilizáveis
- **Lucide React** - Ícones modernos
- **Responsive Design** - Mobile-first approach

### **Backend & Database**
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database relacional
- **Row Level Security** - Segurança de dados

### **PWA & Performance**
- **Service Worker** - Cache inteligente e offline
- **Web App Manifest** - Instalação nativa
- **Image Optimization** - Compressão automática

## 📱 **Recursos PWA**

- ✅ **Instalável** - Pode ser adicionado à tela inicial
- ✅ **Offline** - Funciona sem conexão com internet
- ✅ **Responsivo** - Adapta-se a qualquer dispositivo
- ✅ **Seguro** - Servido via HTTPS
- ✅ **Performático** - Cache estratégico de recursos

## 🎨 **Design System**

### **Paleta de Cores**
- **Primary**: Rosa/Pink (#ec4899)
- **Secondary**: Azul/Blue (#3b82f6)
- **Gradients**: Combinações harmoniosas
- **Neutral**: Cinzas para textos e backgrounds

### **Tipografia**
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700, 800, 900
- **Responsiva**: Escala fluida entre dispositivos

## 🚀 **Como Executar**

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta Supabase configurada

### **Instalação**

1. **Clone o repositório**
```bash
git clone https://github.com/CruzAprc/metodobj.git
cd metodobj
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie .env.local baseado em .env.example
cp .env.example .env.local
```

4. **Configure o Supabase**
- Crie um projeto em [supabase.com](https://supabase.com)
- Execute as migrations em `supabase/migrations/`
- Atualize as URLs no arquivo `.env.local`

5. **Execute o projeto**
```bash
npm run dev
```

6. **Acesse a aplicação**
```
http://localhost:5173
```

### **Build para Produção**
```bash
npm run build
npm run preview
```

## 📱 **Instalação como PWA**

### **Android**
1. Abra o app no Chrome
2. Toque no menu (3 pontos)
3. Selecione "Adicionar à tela inicial"

### **iOS**
1. Abra o app no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela de Início"

### **Desktop**
1. Abra no Chrome/Edge
2. Clique no ícone de instalação na barra de endereço
3. Confirme a instalação

## 🗂️ **Estrutura do Projeto**

```
juju-girl-fit/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── offline.html           # Página offline
│   └── icons/                 # Ícones PWA
├── src/
│   ├── components/
│   │   ├── ui/                # Shadcn components
│   │   ├── Header.tsx         # Cabeçalho
│   │   ├── LoadingState.tsx   # Estados de loading
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard.tsx      # Dashboard principal
│   │   ├── QuizAlimentar.tsx  # Quiz alimentação
│   │   ├── QuizTreino.tsx     # Quiz treinos
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.tsx        # Autenticação
│   │   ├── useUserData.ts     # Dados do usuário
│   │   └── ...
│   ├── types/
│   │   └── index.ts           # Tipos TypeScript
│   ├── theme/
│   │   └── colors.ts          # Paleta de cores
│   └── utils/
│       └── imageUtils.ts      # Utilitários de imagem
├── supabase/
│   └── migrations/            # Migrations do banco
└── ...
```

## 🔐 **Configuração do Supabase**

### **Tabelas Principais**
- `profiles` - Dados dos usuários
- `quiz_alimentar` - Respostas do quiz alimentar
- `quiz_treino` - Respostas do quiz treino
- `user_photos` - Fotos de progresso
- `progress_tracking` - Acompanhamento diário

### **Autenticação**
- Email/Password
- Row Level Security habilitada
- Políticas de acesso por usuário

## 🎯 **Roadmap**

### **Versão Atual (v1.0)**
- ✅ PWA completa
- ✅ Sistema de quiz personalizado
- ✅ Dashboard interativo
- ✅ Upload de fotos
- ✅ Autenticação segura

### **Próximas Features**
- 🔄 Notificações push
- 🔄 Integração com wearables
- 🔄 Compartilhamento social
- 🔄 Planos premium
- 🔄 Chat com nutricionista

## 👥 **Contribuição**

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 **Contato**

**Pedro Cruz** - Desenvolvedor Principal
- GitHub: [@CruzAprc](https://github.com/CruzAprc)
- Email: [seu-email@exemplo.com](mailto:seu-email@exemplo.com)

---

<p align="center">
  <img src="public/favicon.ico" alt="Juju Girl Fit" width="50">
  <br>
  <strong>🌸 Transformando vidas através do wellness feminino 🌸</strong>
</p>

---

**⭐ Se este projeto te ajudou, deixe uma estrela no repositório!**
