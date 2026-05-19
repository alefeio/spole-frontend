# Features

Cada domínio do Spolê terá uma pasta em `src/features/<nome>/`:

```
features/
  auth/
    api.ts       # POST /auth/login, /auth/register
  events/
    api.ts       # GET /events, GET /events/:id
  <domínio>/
    api.ts       # funções que chamam @/lib/api/client
    types.ts
    components/
    hooks/
```

**Regra:** páginas em `src/app` apenas compõem UI; dados vêm de hooks que usam `api.ts` da feature.
