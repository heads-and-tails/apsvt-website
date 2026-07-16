# АПСВТ editorial website

Public multi-page website for the Academy of Labour, Social Relations and Tourism.

The `/panel` route is protected server-side and allows only `vportnaia@kse.org.ua` to create, edit, publish, and delete articles. Posts are stored in D1 and article photographs are stored in R2.

## Local development

```bash
npm run dev
```

## Validation

```bash
npx tsc --noEmit
npm run build
```
