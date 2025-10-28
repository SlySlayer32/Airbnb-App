- x] Remove root `app.json` and keep `apps/mobile/app.json`
- [x] Fix asset paths in `apps/mobile/app.json` to `./assets/images/...`
- [x] Remove or correct unsupported `@/…` aliases in Metro/Babel; rely on `@airbnb/*`
- [x] Prefer Nx commands in tasks: `nx run mobile:start`, `nx run mobile:run-android`,
      `nx run mobile:run-ios`
- [x] Remove per-app dependencies in `apps/mobile/package.json` (or remove the file)
- [x] Add/point `apps/mobile/project.json` to a valid Jest config (e.g.,
      `apps/mobile/jest.config.js` with `jest-expo`)
- [x] Remove `"main"` from root `package.json` to avoid root startup
- [x] (Optional) Migrate `apps/mobile/app.json` → `app.config.ts` for env-driven config
