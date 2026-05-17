## Context

O sistema Movyra é uma plataforma de streaming (estilo Netflix) para estudos que atualmente não possui autenticação ou perfis de usuário. Toda a funcionalidade de personalização — recomendações, histórico de visualização, watch parties — depende de um sistema robusto de identidade de usuário.

Este change introduz autenticação JWT com bcrypt, gerenciamento de perfis via Prisma/PostgreSQL, e sessões via Redis (já configurado no foundation). A arquitetura usa Next.js 16.2.6 App Router com Server Actions para fluxos de auth e API Routes RESTful para operações de perfil.

**Constraints:**
- Deve seguir OWASP Authentication Cheat Sheet
- Senhas devem ser hash com bcrypt (custo >= 12)
- JWTs devem ter TTL curto (15min access, 7d refresh)
- Perfis seguem modelo Netflix-style (múltiplos perfis por conta)
- UI deve usar shadcn/ui components
- Acessibilidade WCAG 2.1 AA obrigatória

**Stakeholders:** backend-api agent, frontend-ui agent

## Goals / Non-Goals

**Goals:**
- Implementar registro, login, logout com JWT + bcrypt
- Suportar múltiplos perfis por conta de usuário
- Permitir CRUD completo de perfis com avatar selection
- Criar middleware de proteção de rotas no App Router
- Fornecer profile switching UI (seleção de perfil estilo Netflix)
- Integrar com Redis para session management e token blacklist

**Non-Goals:**
- OAuth / social login (Google, Facebook, etc.) — futuro
- Two-factor authentication (2FA) — futuro
- Email verification flow — futuro
- Password reset / forgot password — futuro
- Admin panel para gestão de usuários — futuro
- Paginação de perfis (assume-se <= 5 perfis por conta)

## Decisions

### D1: Server Actions vs API Routes para Auth

**Decisão:** Usar Server Actions para login, registro e logout. Usar API Routes (`/api/profiles/*`) para operações de perfil.

**Rationale:** Server Actions são ideais para formulários de auth pois eliminam a necessidade de criar endpoints separados e permitem validação + mutation no mesmo fluxo. API Routes para perfis porque são operações CRUD que podem ser chamadas por clientes diversos e se beneficiam de contratos REST claros.

**Alternativas consideradas:**
- API Routes para tudo: mais boilerplate, mas mais testável. Rejeitado porque Server Actions simplificam o fluxo de formulários no App Router.
- Server Actions para tudo: possível, mas perfis são melhor servidos como API para reuso e caching.

### D2: JWT Storage Strategy

**Decisão:** Access token em memory (React state / context). Refresh token em httpOnly, secure, sameSite=strict cookie.

**Rationale:** Access tokens em memory previnem XSS. Refresh tokens em httpOnly cookies previnem acesso via JavaScript. O refresh token é armazenado no Redis com TTL para permitir revogação imediata.

**Alternativas consideradas:**
- Ambos em localStorage: vulnerável a XSS. Rejeitado.
- Ambos em cookies: CSRF risk, requer tokens CSRF adicionais. Rejeitado por complexidade.

### D3: Profile Model Design

**Decisão:** Modelo `Profile` separado de `User`, com relação 1:N (um User tem muitos Profiles). Cada Profile tem nome, avatar (enum de predefinidos), e perfil ativo boolean.

**Rationale:** Segue o padrão Netflix onde uma conta tem múltiplos perfis. Permite personalização por perfil (histórico, preferências) no futuro.

**Schema Prisma:**
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  profiles      Profile[]
}

model Profile {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String
  avatar      String   // enum key: "avatar1".."avatar6"
  isActive    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, name])
}
```

**Alternativas consideradas:**
- Profile inline no User: não suporta múltiplos perfis. Rejeitado.

### D4: Route Protection Strategy

**Decisão:** Middleware `middleware.ts` na raiz do App Router para verificar sessão via cookie. Server component `AuthCheck` para proteção granular dentro de layouts.

**Rationale:** Middleware é executado antes de qualquer render, ideal para redirecionar usuários não autenticados. Server components permitem verificação adicional de perfil selecionado.

**Rotas protegidas:** `/dashboard`, `/profile/*`, `/watch`, `/settings`
**Rotas públicas:** `/`, `/login`, `/register`, `/api/health`
**Rotas de auth:** `/login`, `/register` — redirecionam para `/select-profile` se já autenticado

### D5: Avatar System

**Decisão:** Avatares predefinidos (6 opções) armazenados como strings de enum. Sem upload de imagem customizada nesta fase.

**Rationale:** Simplifica storage (não precisa de S3/blob storage nesta fase). Avatares são SVGs inline no bundle.

**Alternativas consideradas:**
- Upload de avatar customizado: requer storage, validação de imagem, resize. Rejeitado para MVP.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| JWT secret exposto em variável de ambiente | Usar `.env.local`, nunca commitar, validar no build |
| Refresh token não revogado no logout | Blacklist no Redis no logout, TTL automático |
| Race condition em profile switching | Usar transação Prisma para `isActive` toggle |
| XSS via nome de perfil | Sanitizar input, usar `zod` para validação, max 30 chars |
| CSRF em Server Actions | Next.js built-in CSRF protection para Server Actions |
| Performance: verificação de sessão em cada request | Cache do Redis com TTL curto, middleware é edge-compatible |
| Múltiplos perfis ativos simultaneamente | Constraint: apenas 1 profile `isActive=true` por user, enforced no server |
