# CI/CD Setup Guide for Dasyl

This guide will help you set up automated NPM publishing using GitHub Actions.

## 📋 Prerequisites

1. **NPM Account** - [Sign up at npmjs.com](https://www.npmjs.com/signup)
2. **GitHub Repository** - Your dasyl repository
3. **Admin Access** - To configure repository secrets

---

## 🔑 Step 1: Generate NPM Access Token

### Option A: Classic Token (Recommended for now)

1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Click your profile icon → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select **Automation** type
5. Copy the token (starts with `npm_...`)
6. **Save it securely** - you won't see it again!

### Option B: Granular Token (Modern approach)

1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Click your profile icon → **Access Tokens**
3. Click **Generate New Token** → **Granular Access Token**
4. Configure:
   - **Name:** `dasyl-github-actions`
   - **Expiration:** Choose duration (or No expiration)
   - **Packages and scopes:**
     - Select: `Read and write` for `dasyl`
5. Click **Generate Token**
6. Copy and save the token

---

## 🔐 Step 2: Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add secret:
   - **Name:** `NPM_TOKEN`
   - **Value:** Paste your NPM token
5. Click **Add secret**

---

## 📝 Step 3: Update Package.json (if needed)

Make sure your `package.json` has:

```json
{
  "name": "dasyl",
  "version": "1.5.3",
  "publishConfig": {
    "access": "public"
  }
}
```

---

## 🚀 How to Use the CI/CD Workflows

### Method 1: Manual Workflow (Recommended)

This is the **easiest and safest** way:

1. Go to **Actions** tab in GitHub
2. Select **Version Bump and Release** workflow
3. Click **Run workflow**
4. Choose version type:
   - **patch** (1.5.3 → 1.5.4) - Bug fixes
   - **minor** (1.5.3 → 1.6.0) - New features
   - **major** (1.5.3 → 2.0.0) - Breaking changes
5. Click **Run workflow**

**What happens:**
- ✅ Bumps version in package.json
- ✅ Creates git commit
- ✅ Creates and pushes git tag (e.g., v1.5.4)
- ✅ Creates GitHub Release
- ✅ Triggers NPM publish automatically

### Method 2: Manual Tag Creation

1. Update version in `package.json` manually:
   ```bash
   # Edit package.json
   nano package.json  # Change version
   ```

2. Commit and push:
   ```bash
   git add package.json
   git commit -m "chore: Bump version to 1.5.4"
   git push origin main
   ```

3. Create and push tag:
   ```bash
   git tag v1.5.4
   git push origin v1.5.4
   ```

4. The **Publish to NPM** workflow runs automatically when tag is pushed

### Method 3: Using npm version command

```bash
# Patch release (1.5.3 → 1.5.4)
npm version patch -m "chore: Bump version to %s"

# Minor release (1.5.3 → 1.6.0)
npm version minor -m "chore: Bump version to %s"

# Major release (1.5.3 → 2.0.0)
npm version major -m "chore: Bump version to %s"

# Push changes and tags
git push origin main --follow-tags
```

---

## 🌐 Deploying to Go54 cPanel

The **Deploy to Go54 cPanel** workflow (`deploy-cpanel.yml`) automatically deploys your website to a Go54 cPanel hosting account via FTP every time you push to the `main` branch. It can also be triggered manually from the Actions tab.

### Required GitHub Secrets

Add the following secrets under **Settings → Secrets and variables → Actions**:

| Secret | Description | Example |
|---|---|---|
| `FTP_SERVER` | FTP hostname from Go54 cPanel | `ftp.yourdomain.com` |
| `FTP_USERNAME` | FTP account username | `user@yourdomain.com` |
| `FTP_PASSWORD` | FTP account password | *(your FTP password)* |
| `FTP_SERVER_DIR` | Remote directory to deploy into | `/public_html/` |

### Finding Your FTP Credentials on Go54

1. Log in to your **Go54 cPanel** account
2. Navigate to **Files → FTP Accounts**
3. Use the main cPanel username and password, or create a dedicated FTP account
4. The FTP hostname is typically `ftp.yourdomain.com` or the server hostname shown in cPanel

### What the Workflow Deploys

All repository files are deployed **excluding**:
- `.git` directory and metadata
- `node_modules/`
- `.github/`

---

## 📊 Workflow Overview

### 1. **CI Workflow** (`ci.yml`)

**Triggers:** Push/PR to main or develop branch

**What it does:**
- ✅ Tests on Ubuntu, Windows, macOS
- ✅ Tests on Node.js 18, 20, 21
- ✅ Verifies package integrity
- ✅ Checks syntax
- ✅ Validates package.json
- ✅ Checks required files

### 2. **Publish Workflow** (`publish.yml`)

**Triggers:** Push of version tag (e.g., `v1.5.4`)

**What it does:**
- ✅ Verifies tag matches package.json version
- ✅ Installs dependencies
- ✅ Publishes to NPM with provenance
- ✅ Creates GitHub Release

### 3. **Deploy to Go54 cPanel Workflow** (`deploy-cpanel.yml`)

**Triggers:** Push to `main` branch, or manual dispatch

**What it does:**
- ✅ Deploys all website files to Go54 cPanel via FTP
- ✅ Excludes `.git`, `node_modules/`, and `.github/`

### 4. **Version Bump Workflow** (`version-bump.yml`)

**Triggers:** Manual dispatch from Actions tab

**What it does:**
- ✅ Bumps version in package.json
- ✅ Commits and pushes changes
- ✅ Creates and pushes version tag
- ✅ Creates GitHub Release
- ✅ Triggers NPM publish (via tag)

---

## 🎯 Recommended Publishing Flow

### For Bug Fixes (Patch):
```bash
# 1. Fix bug in code
# 2. Commit changes
git add .
git commit -m "fix: Resolve issue with validation"
git push

# 3. Go to GitHub Actions
# 4. Run "Version Bump and Release" with "patch"
```

### For New Features (Minor):
```bash
# 1. Develop feature
# 2. Commit changes
git add .
git commit -m "feat: Add Next.js support"
git push

# 3. Go to GitHub Actions
# 4. Run "Version Bump and Release" with "minor"
```

### For Breaking Changes (Major):
```bash
# 1. Implement breaking changes
# 2. Update documentation
# 3. Commit changes
git add .
git commit -m "feat!: Complete API redesign (BREAKING CHANGE)"
git push

# 4. Go to GitHub Actions
# 5. Run "Version Bump and Release" with "major"
```

---

## 🔍 Verify Everything Works

### Test 1: Check CI
```bash
# Make a small change and push
echo "# Test" >> README.md
git add README.md
git commit -m "test: CI workflow"
git push
```
✅ Check Actions tab - CI should run

### Test 2: Dry Run Publish
```bash
# Test local npm publish
npm pack --dry-run
```
✅ Should show what would be published

### Test 3: Create a Test Release
```bash
# Create a test version
npm version prerelease --preid=beta -m "chore: Test release v%s"
git push origin main --follow-tags
```
✅ Check if workflow publishes to NPM

---

## 🛠️ Troubleshooting

### Issue: "npm publish" fails with 403

**Solution:**
- Check NPM_TOKEN in GitHub Secrets
- Verify token has write permissions
- Make sure package name is available on NPM
- Check if you're a collaborator on the package

### Issue: Tag doesn't trigger workflow

**Solution:**
- Verify workflow file exists in `.github/workflows/`
- Check tag format is `v*.*.*` (e.g., v1.5.4)
- Make sure workflow is enabled in Actions settings

### Issue: Version mismatch error

**Solution:**
- Ensure package.json version matches the git tag
- Don't manually edit version without creating matching tag

### Issue: CI fails on Windows

**Solution:**
- Check for Windows-specific path issues
- Use cross-platform path handling
- Test locally on Windows if possible

---

## 📚 Additional Resources

- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🎉 You're All Set!

Your CI/CD pipeline is now configured. Every time you push a version tag, your package will automatically be published to NPM!

### Quick Reference Card

```bash
# Recommended: Use GitHub Actions UI
1. Go to Actions → Version Bump and Release
2. Select version type (patch/minor/major)
3. Click Run workflow

# Alternative: Manual command
npm version patch -m "chore: Bump to %s"
git push --follow-tags

# Check status
npm view dasyl version  # Current NPM version
git describe --tags      # Latest tag
```

---

**Need Help?** Open an issue on [GitHub](https://github.com/SeniorCub/dasyl/issues)
