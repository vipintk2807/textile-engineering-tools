# Windows setup, run, test and build

All commands are for PowerShell or Windows Terminal. Replace `C:\path\to\textile-engineering-tools` with the folder where you extracted the project.

## 1. Install prerequisites (once)

1. **Node.js 22.12 or newer** (LTS recommended): https://nodejs.org. The installer includes npm.
2. **Git for Windows**: https://git-scm.com/download/win
3. A code editor (for example Visual Studio Code, free).

Open a **new** PowerShell window after installing and check:

```powershell
node -v    # must print v22.12.0 or higher
npm -v
git --version
```

## 2. Extract the ZIP

Right-click `textile-engineering-tools.zip` → **Extract All…**. Choose a short path without special restrictions (for example `C:\Projects`). The ZIP contains one root folder, `textile-engineering-tools`.

## 3. Install dependencies

```powershell
cd "C:\path\to\textile-engineering-tools"
npm install
```

Why `npm install` and not `npm ci`: the project was packaged in an environment without internet access, so **`package-lock.json` is not included**. `npm install` reads `package.json`, downloads the packages, and creates `package-lock.json`.

- **Commit the new `package-lock.json`** (it is not ignored by `.gitignore`).
- From then on, and on any other machine, use `npm ci` for reproducible installs.

If `npm install` fails, read the actual error. Dependency versions in `package.json` were chosen without registry access and have not been installed by the implementer, so a version range may need adjusting. Do not delete files or randomly upgrade packages: note the failing package and the message first. See [verification_report.md](verification_report.md).

## 4. Run the app

```powershell
npm run dev
```

Open the **Local** URL printed in the terminal (Vite usually uses port 5173, but use whatever is printed). Stop the server with `Ctrl+C`.

## 5. Run the checks

```powershell
npm run lint
npm run typecheck
npm run test:run
npm run build
npm run preview
```

`npm run test:run` runs once and exits (use it for verification). `npm run test` stays in watch mode. `npm run preview` serves the production build from `dist/`; open the printed URL and check the app there, since a successful dev server is not proof that the production build works.

## 6. Troubleshooting

| Problem | What to try |
|---|---|
| `npm : File ...npm.ps1 cannot be loaded because running scripts is disabled` | Run `npm.cmd install` instead, or in PowerShell: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `node` is not recognised | Close and reopen the terminal after installing Node.js |
| Node version too old | Install Node.js 22.12 or newer; Vite and Vitest need it |
| Port already in use | Vite prints another port; use the printed URL |
| Blank page when opening `dist/index.html` by double-click | Use `npm run preview` instead; some browsers restrict module scripts on `file://` URLs |
| Install errors about a package version | Copy the full error; do not delete `package-lock.json` once it exists |

No GPU, Docker, WSL or paid service is needed.
