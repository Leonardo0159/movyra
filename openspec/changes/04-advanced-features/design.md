## Context

O projeto Movyra é uma plataforma de streaming (estilo Netflix) em desenvolvimento. Após a implementação do catálogo básico, player de vídeo e autenticação de usuários, é necessário adicionar funcionalidades avançadas de personalização: histórico de visualização, sistema de recomendações, lista de favoritos e controle parental.

Estado atual:
- Catálogo de vídeos com navegação por gêneros implementado
- Player de vídeo com suporte a HLS e adaptive bitrate
- Autenticação e perfis de usuário configurados
- Banco de dados PostgreSQL com Prisma ORM
- Redis disponível para caching

Restrições:
- Next.js 16.2.6 App Router com Server Components como padrão
- Server Actions para mutações de dados
- shadcn/ui + Tailwind CSS 4 para interface
- WCAG 2.1 AA para acessibilidade
- Performance: Lighthouse > 90

## Goals / Non-Goals

**Goals:**
- Implementar rastreamento de histórico de visualização com progresso de reprodução
- Criar recurso "Continue Assistindo" na página inicial
- Construir sistema básico de recomendações baseado em gêneros e histórico
- Implementar funcionalidade "Minha Lista" para favoritos
- Adicionar controles parentais com PIN e restrição por classificação etária
- Manter conformidade com arquitetura existente e padrões de código

**Non-Goals:**
- Algoritmos complexos de recomendação com machine learning
- Compartilhamento de listas entre usuários
- Controle parental por dispositivo específico
- Sincronização offline de histórico
- Interface administrativa para gerenciar recomendações

## Decisions

### 1. Modelo de Dados para WatchHistory
**Decisão:** Criar modelo `WatchHistory` com campos: `userId`, `contentId`, `progressSeconds`, `totalDuration`, `lastWatchedAt`, `completed`.

**Rationale:** Armazenar progresso em segundos permite precisão para retomar reprodução. O campo `completed` permite filtrar conteúdo já assistido. `lastWatchedAt` permite ordenar por mais recente para "Continue Assistindo".

**Alternativas consideradas:**
- Armazenar progresso como porcentagem: menos preciso para diferentes qualidades de vídeo
- Armazenar apenas timestamps de início/fim: não permite retomar no ponto exato

### 2. Sistema de Recomendações
**Decisão:** Implementar recomendações baseadas em regras simples: gêneros mais assistidos + conteúdo similar ao histórico recente. Cache em Redis com TTL de 1 hora.

**Rationale:** Abordagem simples e eficaz para MVP. Redis reduz carga no banco de dados e melhora performance. TTL de 1 hora equilibra frescor dos dados com performance.

**Alternativas consideradas:**
- Collaborative filtering: complexo demais para MVP, requer mais dados de usuários
- Recomendações em tempo real: impacto de performance desnecessário
- Sem cache: consultas frequentes ao banco degradariam performance

### 3. API para Histórico e Favoritos
**Decisão:** Usar Server Actions para mutações (adicionar/atualizar histórico, adicionar/remover favoritos) e Route Handlers GET para consultas.

**Rationale:** Server Actions são a abordagem recomendada pelo Next.js para mutações, com validação automática e integração com React. Route Handlers GET permitem caching e otimização de consultas.

**Alternativas consideradas:**
- API Routes para tudo: Server Actions oferecem melhor DX com React
- Client-side mutations apenas: menos seguro, não aproveita Server Components

### 4. Controle Parental - Armazenamento de PIN
**Decisão:** Armazenar PIN como hash bcrypt no banco de dados, associado ao perfil do usuário.

**Rationale:** Segurança é crítica para controle parental. bcrypt é padrão da indústria para hashing de senhas/PINs. Associar ao perfil permite configurações diferentes por perfil.

**Alternativas consideradas:**
- PIN em texto plano: risco de segurança inaceitável
- PIN em variável de ambiente: não permite configurações por perfil
- Usar provedor externo de autenticação: complexidade desnecessária para PIN simples

### 5. Estrutura de Cache Redis
**Decisão:** Usar chaves padronizadas: `history:{userId}`, `recommendations:{userId}`, `favorites:{userId}`.

**Rationale:** Namespace por tipo de dado e usuário facilita invalidação e debugging. Chaves simples permitem operações eficientes.

**Alternativas consideradas:**
- Cache em memória do servidor: não escala com múltiplas instâncias
- Sem cache: consultas frequentes ao banco degradariam performance

### 6. UI Components
**Decisão:** Reutilizar componentes existentes de catálogo (ContentCard, ContentRow) para histórico, recomendações e favoritos. Criar componente específico `ParentalControlSettings` para configurações de controle parental.

**Rationale:** Consistência visual e redução de código duplicado. Componentes existentes já suportam acessibilidade e responsividade.

**Alternativas consideradas:**
- Componentes dedicados para cada feature: manutenção mais complexa, inconsistência visual

## Risks / Trade-offs

- [Performance com histórico frequente] → Usar debounce no reporte de progresso (a cada 10-15 segundos) e batch updates quando possível
- [Cache stale de recomendações] → TTL de 1 hora pode mostrar recomendações desatualizadas; mitigar com invalidação manual quando histórico muda significativamente
- [PIN esquecido pelo usuário] → Implementar fluxo de recuperação via email (depende de serviço de email configurado)
- [Crescimento do histórico] → Implementar limpeza automática de registros antigos (>6 meses) via job agendado
- [Complexidade do Prisma com queries complexas] → Usar queries raw SQL se necessário para recomendações, mantendo Prisma para operações CRUD simples
