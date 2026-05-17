# PRD: Plataforma de Streaming (MVP)

## Overview
Plataforma de streaming de vídeo sob demanda (VOD) para estudo, inspirada em Netflix, Prime Video e HBO. O MVP foca em catálogo, player de vídeo, perfis de usuário e sistema de recomendação básico.

## Goals
- Construir uma plataforma funcional de streaming para portfólio/estudo
- Implementar arquitetura escalável de vídeo (upload, encoding, delivery)
- Criar experiência de usuário similar às grandes plataformas

## Non-Goals
- Monetização e gateway de pagamento real
- Licenciamento de conteúdo comercial
- Aplicativos mobile nativos (foco em web responsiva no MVP)
- Conteúdo ao vivo (live streaming)
- Download offline

## Target Users
- **Estudante/Desenvolvedor**: Explora a plataforma para entender arquitetura de streaming
- **Usuário final simulado**: Navega catálogo, assiste conteúdo, usa perfis

## User Stories
1. Como usuário, quero me cadastrar e fazer login para acessar o catálogo
2. Como usuário, quero criar múltiplos perfis para personalizar recomendações
3. Como usuário, quero navegar por categorias e buscar conteúdo
4. Como usuário, quero assistir vídeos com player completo (play, pause, seek, legendas)
5. Como usuário, quero ver recomendações baseadas no meu histórico
6. Como usuário, quero marcar conteúdo como favorito e criar lista de assistir depois
7. Como administrador, quero fazer upload e gerenciar conteúdo no catálogo
8. Como usuário, quero controle parental para restringir conteúdo por classificação

## Requirements

### Funcionais
- **FR-1**: Autenticação (registro, login, logout)
- **FR-2**: Gestão de perfis (criar, editar, deletar, avatar)
- **FR-3**: Catálogo com categorias (filmes, séries, documentários), filtros e busca
- **FR-4**: Página de detalhes do título (sinopse, elenco, duração, classificação, episódios para séries)
- **FR-5**: Player de vídeo com controles (play/pause, seek, volume, tela cheia, qualidade, legendas)
- **FR-6**: Histórico de visualização e continuação de reprodução ("continue assistindo")
- **FR-7**: Sistema de recomendação básico (baseado em gênero/histórico)
- **FR-8**: Lista "Minha Lista" (favoritos)
- **FR-9**: Painel admin para upload e gestão de conteúdo
- **FR-10**: Controle parental por PIN e classificação etária
- **FR-11**: Watch Party (assistir sincronizado com outros usuários + chat)

### Não-Funcionais
- **NF-1**: Player deve iniciar reprodução em menos de 2 segundos (primeiro frame)
- **NF-2**: Suporte a streaming adaptativo (HLS/DASH) com qualidade automática
- **NF-3**: Interface responsiva (mobile, tablet, desktop)
- **NF-4**: Acessibilidade WCAG 2.1 AA (legendas, navegação por teclado, screen reader)
- **NF-5**: CDN para distribuição de vídeo com baixa latência
- **NF-6**: Banco de dados otimizado para queries de catálogo e busca

## Success Metrics
- Tempo de carregamento do player < 2s
- Taxa de buffering < 1% do tempo total de reprodução
- 100% das funcionalidades do MVP operacionais
- Lighthouse score > 90 em performance e acessibilidade

## Dependencies
- **UI Component Library**: shadcn/ui + Tailwind CSS 4 + Radix UI primitives
- **ORM**: Prisma (type-safe database client, migrations, seeding)
- **Monitoring**: Sentry (error tracking, performance monitoring, release health)
- **Storage de vídeo**: AWS S3, Cloudflare R2 ou similar
- **Encoding/Transcoding**: FFmpeg (self-hosted) ou serviço como AWS MediaConvert, Mux, ou Cloudflare Stream
- **CDN**: CloudFront, Cloudflare ou equivalente
- **Player de vídeo**: Video.js, Plyr, ou hls.js
- **Autenticação**: JWT com bcrypt ou NextAuth (sem serviço de e-mail no MVP)
- **Banco de dados**: PostgreSQL (relacional para catálogo) + Redis (cache/sessões)
- **Busca**: PostgreSQL full-text search ou Elasticsearch/Meilisearch

## Timeline & Milestones

### Fase 1: Fundação (Semanas 1-3)
- Setup do projeto (Next.js, TypeScript, Tailwind, PostgreSQL)
- Autenticação e gestão de perfis
- Schema do banco de dados (usuários, perfis, títulos, episódios)
- Painel admin básico com upload de vídeo

### Fase 2: Catálogo e Player (Semanas 4-6)
- Encoding/transcoding de vídeo (HLS com múltiplas qualidades)
- Catálogo com navegação, busca e filtros
- Página de detalhes do título
- Player de vídeo com HLS.js e controles completos

### Fase 3: Features Avançadas (Semanas 7-9)
- Histórico de visualização e "continue assistindo"
- Sistema de recomendação básico
- Lista "Minha Lista"
- Controle parental

### Fase 4: Social e Polimento (Semanas 10-12)
- Watch Party com sincronização em tempo real (WebSockets)
- Chat durante Watch Party
- Melhorias de performance e acessibilidade
- Testes e documentação

## Open Questions
- **OQ-1**: Qual serviço de storage/CDN usar? (AWS é mais completo, Cloudflare R2 é mais barato para estudo)
- **OQ-2**: Encoding self-hosted com FFmpeg ou serviço gerenciado (Mux, Cloudflare Stream)? Para estudo, FFmpeg local dá mais aprendizado; serviço gerenciado é mais rápido
- **OQ-3**: Conteúdo de teste: usar vídeos de domínio público (Big Buck Bunny, Sintel) ou gerar conteúdo placeholder?
- **OQ-4**: Watch Party requer servidor WebSocket dedicado ou pode usar Server-Sent Events / WebRTC?
- **OQ-5**: O sistema de recomendação será baseado em regras simples (mesmo gênero) ou machine learning (collaborative filtering)?
