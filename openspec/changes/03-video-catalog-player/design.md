## Context

Movyra é uma plataforma de streaming (estilo Netflix) em desenvolvimento para estudo. Atualmente, a infraestrutura básica do projeto está configurada com Next.js 16.2.6 (App Router), React 19.2.4, TypeScript 5, PostgreSQL com Prisma ORM, e Tailwind CSS 4.

Esta change implementa as funcionalidades centrais da plataforma: catálogo de conteúdo, páginas de detalhes de títulos, player de vídeo com suporte a HLS, pipeline de codificação de vídeo e painel administrativo para gestão de conteúdo.

**Constraints:**
- Depende de `project-foundation-setup` (infraestrutura base) e `user-auth-profiles` (autenticação)
- Deve suportar streaming adaptativo com múltiplos bitrates (HLS)
- Deve seguir WCAG 2.1 AA para acessibilidade
- Performance alvo: Lighthouse > 90

**Stakeholders:**
- Frontend UI (catálogo, player, admin)
- Backend API (rotas de catálogo, upload, metadados)
- Video Engineering (FFmpeg, HLS, CDN)
- DevOps/Infra (storage S3/R2, CDN configuration)

## Goals / Non-Goals

**Goals:**
- Implementar catálogo navegável com categorias, filtros e busca
- Criar páginas de detalhes para filmes e séries (com episódios)
- Implementar player HLS com controles completos (play/pause, seek, volume, fullscreen, seleção de qualidade, legendas)
- Configurar pipeline de encoding com FFmpeg para múltiplos bitrates
- Configurar storage (S3/R2) e CDN para delivery de vídeo
- Implementar painel admin para upload e gestão de conteúdo

**Non-Goals:**
- DRM (Digital Rights Management) - fora do escopo inicial
- Download offline de conteúdo
- Transmissão ao vivo (live streaming)
- Recomendações baseadas em ML/AI
- Perfis múltiplos por conta de usuário
- Integração com gateways de pagamento

## Decisions

### 1. Video Storage: Cloudflare R2 vs AWS S3

**Decision:** Usar Cloudflare R2 como storage primário para vídeos.

**Rationale:** R2 oferece egress bandwidth gratuito, o que é crítico para uma plataforma de streaming onde os custos de egress podem ser significativos. A API é compatível com S3, facilitando migração futura se necessário.

**Alternatives considered:**
- AWS S3: Mais maduro, mas custos de egress elevados para streaming
- AWS S3 + CloudFront: Solução completa mas mais cara e complexa

### 2. Video Player: HLS.js vs Video.js vs Native HTML5

**Decision:** Usar HLS.js como biblioteca principal para o player de vídeo.

**Rationale:** HLS.js é leve, bem mantido, e oferece controle granular sobre o streaming HLS (seleção de qualidade, eventos de buffering, etc). É a escolha padrão para streaming HLS em browsers que não suportam HLS nativamente.

**Alternatives considered:**
- Video.js: Mais pesado, mas com mais plugins. Overkill para o escopo atual.
- Native HTML5 `<video>`: Suporte HLS apenas em Safari. Não atende cross-browser.

### 3. Video Encoding: Server-side FFmpeg vs AWS MediaConvert

**Decision:** Usar FFmpeg executado via worker/fila assíncrona para encoding.

**Rationale:** FFmpeg é open-source, flexível, e permite controle total sobre o pipeline de encoding. Usar uma fila (Redis + BullMQ) para processamento assíncrono evita bloquear requests HTTP durante o encoding.

**Alternatives considered:**
- AWS MediaConvert: Serviço gerenciado, mas caro e vendor lock-in
- Encoding síncrono: Bloquearia o servidor durante processamento de vídeos longos

### 4. Database Schema: Prisma Models

**Decision:** Seguir o schema Prisma proposto com models: Title, Episode, Category, Genre, CastMember, VideoVersion.

**Rationale:** Schema normalizado permite queries eficientes para catálogo (filtragem por gênero/categoria) e suporte a séries com episódios. Prisma oferece type-safety e migrations.

**Schema overview:**
- `Title`: id, type (movie/series/documentary), title, synopsis, releaseYear, duration, rating, posterUrl, backdropUrl, status, createdAt, updatedAt
- `Episode`: id, titleId, seasonNumber, episodeNumber, title, synopsis, duration, videoVersionId
- `Category`: id, name, slug
- `Genre`: id, name, slug
- `CastMember`: id, name, role, imageUrl
- `VideoVersion`: id, titleId/episodeId, resolution, bitrate, hlsManifestUrl, storageKey

### 5. API Architecture: Server Components + API Routes

**Decision:** Usar React Server Components para páginas de catálogo e detalhes, com API Routes para operações dinâmicas (busca, filtros, upload).

**Rationale:** Server Components permitem fetch direto do banco sem client-side waterfalls, melhorando performance. API Routes são necessárias para operações que requerem interatividade ou upload de arquivos.

**Alternatives considered:**
- Client-side fetching com SWR/React Query: Mais waterfalls, pior performance inicial
- Server Actions para tudo: Limitações com upload de arquivos grandes

### 6. CDN Strategy

**Decision:** Usar Cloudflare CDN em frente ao R2 para cache de manifests HLS e segmentos de vídeo.

**Rationale:** Cloudflare CDN oferece cache global gratuito, reduz latência de entrega e diminui requests diretos ao storage. Manifests HLS (.m3u8) são cacheáveis e mudam pouco.

### 7. Content Upload Flow

**Decision:** Upload via presigned URLs diretamente do browser para R2, seguido de trigger assíncrono para encoding.

**Rationale:** Evita passar o arquivo pelo servidor Next.js, reduzindo memória e tempo de request. O servidor apenas gera a presigned URL e gerencia metadados.

**Flow:**
1. Admin inicia upload via painel
2. Server action gera presigned URL do R2
3. Browser faz upload direto para R2
4. Webhook/queue trigger inicia encoding FFmpeg
5. Encoding gera múltiplas resoluções + HLS manifest
6. Metadados atualizados no banco

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| FFmpeg encoding consome muitos recursos de CPU | Alto | Usar fila com workers dedicados; limitar jobs concorrentes |
| Custos de storage crescem com catálogo | Médio | Implementar políticas de retenção; compressão eficiente |
| HLS.js não funciona em todos os browsers | Baixo | Fallback para MP4 progressivo em browsers sem MediaSource |
| Presigned URLs expiram durante upload lento | Médio | Configurar timeout generoso (1h); retry logic no client |
| CDN cache de manifests stale após re-encoding | Baixo | Invalidar cache via API Cloudflare; versionar manifests |
| Schema Prisma não suporta futuras features (ex: DRM) | Baixo | Schema extensível; migrations permitem evolução |

## Migration Plan

**Deploy steps:**
1. Deploy database migrations (Prisma)
2. Deploy storage configuration (R2 buckets, CDN)
3. Deploy encoding worker service
4. Deploy API routes e server components
5. Deploy admin upload panel
6. Smoke test: upload de vídeo de teste, verificar encoding e playback

**Rollback strategy:**
- Reverter deploy da aplicação (padrão Next.js)
- Database: reverter migrations se necessário (Prisma suporta rollback)
- Storage: vídeos já uploadados permanecem; podem ser removidos manualmente

## Open Questions

1. **Qual resolução máxima suportar inicialmente?** 1080p é suficiente ou incluir 4K?
2. **Qual política de subtitles?** Upload de arquivos .srt/.vtt pelo admin ou geração automática?
3. **Thumbnail generation?** Gerar thumbnails automaticamente durante encoding ou upload manual?
4. **Rate limiting para API de catálogo?** Necessário proteger contra scraping?
