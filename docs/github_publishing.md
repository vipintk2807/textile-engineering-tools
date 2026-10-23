# Publishing to GitHub (account `vipintk2807`)

No credentials, tokens or keys are stored in this project or needed in these instructions. Authentication uses your existing SSH setup (the `github-vipintk2807` host alias in your SSH config).

## Before the first push

1. **Create the repository on GitHub** named `textile-engineering-tools` under `vipintk2807`. Create it **empty**: do not tick "Add a README", ".gitignore" or "licence" (the project already has them, and a non-empty remote makes the first push fail).
2. **Generate the lockfile** (the ZIP does not contain one; see windows_setup.md):
   ```powershell
   cd "C:\path\to\extracted\textile-engineering-tools"
   npm install
   ```
   Confirm `package-lock.json` now exists. `git add .` below will then include it.
3. Optional but recommended: run `npm run lint`, `npm run typecheck`, `npm run test:run` and `npm run build` first, and fix anything that fails.

## Push commands

Your commands, with the repository name filled in:

```powershell
cd "C:\path\to\your\extracted\project"

git init

git config user.name "Vipin T K"
git config user.email "vipintk2807@gmail.com"

git remote add origin "git@github-vipintk2807:vipintk2807/textile-engineering-tools.git"

git remote -v

git add .

git commit -m "Initial commit"

git branch -M main

git push -u origin main
```

Notes:

- Before `git commit`, run `git status` and confirm `node_modules/` and `dist/` are **not** listed (they are in `.gitignore`).
- If `git remote add origin` says the remote already exists, use `git remote set-url origin "git@github-vipintk2807:vipintk2807/textile-engineering-tools.git"`.
- If the push is rejected because the remote already contains commits, do not force-push. Look at what is on GitHub first.
- The licence in the project is MIT, chosen as a default. Confirm or change `LICENSE` and the `license` field in `package.json` before making the repository public.

## Later changes

```powershell
git add .
git commit -m "Describe the change"
git push
```

## Optional: GitHub Pages (not set up or tested)

The build uses relative asset paths (`base: './'`) and hash-based navigation, so the contents of `dist/` are designed to work from a sub-path. No deployment workflow is included and no deployment has been tried. If you add one later, document its trigger, build command (`npm run build`), output directory (`dist`) and how you verified the result.
