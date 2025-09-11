# Functional README — *Sandbox DAO Transparency Dashboard*

**Purpose:** Describe the app’s functional flows with step‑by‑step instructions and annotated screenshots so Product, QA, and onboarding share a single source of truth.

---

## Table of Contents
1. [Overview](#overview)
2. [Audience & Use Cases](#audience--use-cases)
3. [Tech Stack & Environments](#tech-stack--environments)
4. [Roles & Permissions](#roles--permissions)
5. [Functional Flows](#functional-flows)
   - [Authentication (Sign up / Sign in / Recovery)](#authentication-sign-up--sign-in--recovery)
   - [Onboarding](#onboarding)
   - [Dashboard / Home](#dashboard--home)
     - [Public View — Executed Tasks](#public-view--executed-tasks)
     - [Task Details (modal)](#task-details-modal)
   - [Task Execution & History (Admin & Consultants)](#task-execution--history-admin--consultants)
   - [Create New Tasks (Batch)](#create-new-tasks-batch)
   - [Notifications / Emails](#notifications--emails)
   - [Account Settings / Profile](#account-settings--profile)
   - [Administration](#administration)
     - [Users — Role Management (Admin only)](#users--role-management-admin-only)
6. [Business Rules](#business-rules)
7. [Empty States, Errors & Edge Cases](#empty-states-errors--edge-cases)
8. [Analytics & Events](#analytics--events)
9. [Accessibility & i18n](#accessibility--i18n)
10. [Conventions for Screenshots](#conventions-for-screenshots)
11. [Glossary](#glossary)
12. [Changelog](#changelog)

---

## Overview
**Short summary:** _What problem the webapp solves in one or two sentences._

**Scope:** _Which modules/features are covered in this README (in scope / out of scope)._ 

**High‑level architecture:** _Frontend / Backend / External services (brief)._ 

---

## Audience & Use Cases
- **User types:** Public/Visitor, Authenticated User, **Consultant**, **Admin**.
- **Primary use cases:** View public executed tasks; upload execution proofs; batch-create tasks; manage users/roles (admins).

---

## Tech Stack & Environments
- **UI / Frontend:** React (Vite), **Web3Auth** for authentication & wallet/social login.
- **API / Backend:** Node.js on **AWS Serverless Lambdas** using **Hono** as the HTTP framework.
- **Storage:** **Amazon S3** for file uploads (execution proofs, images, etc.).
- **Database:** **Neon** (serverless Postgres) as the primary relational store.
- **Smart Contracts:** Deployed on **Polygon Mainnet** and **Polygon Amoy (testnet)**.

**Environments**
- **Staging:** Pre‑production testing environment mirroring production contracts/services where possible.
- **Production:** Live environment serving end users.

---

## Roles & Permissions
| Role | Key permissions | Restrictions |
|-----|------------------|--------------|
| Public/Visitor | Read‑only public pages (Public Dashboard) | No mutations; no admin routes |
| Consultant | View all tasks; upload execution proofs; create batch tasks | No user/role management |
| Admin | Full management, including Users/Roles | — |

> Exact role names can be adapted to the project’s IAM model.

---

## Functional Flows
Each flow includes **Objective**, **Preconditions**, **Step‑by‑step** with screenshots, **Validations/Errors**, and **Expected Result**.

### Authentication (Sign up / Sign in / Recovery)

#### Sign‑in Modal (Admin access)
**Objective**  
Allow users to authenticate via supported providers to access **restricted Admin/Consultant** features.

**Preconditions**
- User attempts to open the **Admin** section or any route requiring authentication.

**Entry behavior**
- If **unauthenticated**, the app opens a centered **Sign in** modal.
- If **authenticated but unauthorized**, the app displays an **Access Denied** state and does **not** show admin data.

**Supported methods (as displayed)**
- **Google**, **X (Twitter)**

**Step‑by‑step**
1. Navigate to an Admin page (e.g., from a top‑right action or direct URL).
2. The **Sign in** modal appears. Choose a provider.
3. Complete the provider flow (popup/redirect). On success, the app stores the session.
4. The backend/authorization layer checks **roles/allowlist**.
5. If the user has the required role, they are routed to the **Admin** view. Otherwise, show **Access Denied**.

**Validations & Errors**
- Handle provider cancellation, popup blockers, and network errors.
- Show clear messaging for **not authorized** vs **not signed in**.
- Persist session across refresh; offer a sign‑out control.

**Expected Result**
- Only **authenticated _and_ authorized** users can access Admin screens; others see Sign‑in or Access Denied, and no privileged data is leaked.

### Home

#### Public View — Executed Tasks
**Objective**  
Provide a **public, read‑only dashboard** showing executed on‑chain tasks with filters, search, and pagination.

**Preconditions**
- No authentication required (public page).

**Step‑by‑step**
1. **Open the DAO Transparency Dashboard (Home).**  
2. **Search by Transaction ID.** Use the input **“Enter Transaction ID…”** to filter results by an internal/semantic transaction identifier.
3. **Filter by Task Type.** Toggle one of the pills: **All Types**, **Liquidation**, **Acquisition**, **Authorization**, or **Arbitrage**. The list updates instantly.
4. **Review the results summary.** The line above the table shows the number of matches, e.g., **“Found 2 tasks.”**
5. **Scan the results table.** Columns:
   - **Transaction ID** (human‑readable, e.g., `0001_Liquidation_Potatoz6`).
   - **Task Type** (e.g., `LIQUIDATION`).
   - **Task Hash** (internal ID, truncated; copy icon).
   - **Transaction Hash** (on‑chain hash, truncated; copy icon).
   - **Created At** (date).
   - **Actions** → **View More** (navigates to Task Details; see below).
6. **Copy identifiers** if needed (copy icon tooltip/toast).
7. **Paginate** using the bottom‑right controls.

**Validations & Errors**
- Empty state when no matches with guidance to adjust filters or search.

**Expected Result**
- The table displays **filtered, paginated** tasks according to selection. **View More** opens **Task Details**.

#### Task Details (modal)
**Objective**  
Display **complete metadata and artifacts** of a selected task in a read‑only modal.

**Entry point**  
From **Dashboard → View More** on any row.

**Fields**
- **Created by**, **Transaction ID**, **Priority**, **Task Type**, **Created At**.
- **Task Hash** and **Transaction Hash** (truncated) with copy icons.
- **Task Data**: read‑only JSON (chain, platform, tokenId, collection, target price, verification flags, etc.).
- **Execution Proofs**: list of items (content/attachment, uploader, timestamp).

**Interactions**
1. Copy identifiers with the copy icons.
2. Scroll within the modal to review long JSON or many proofs.
3. Close with the **X** icon.

**Validations & Errors**
- Show placeholders for unavailable fields.
- Copy action gives visual confirmation.

**Expected Result**
- Users can **audit** all relevant data and capture hashes for verification.

---

### Task Execution & History (Admin & Consultants)
**Objective**  
Enable **Admins and Consultants** to view **all tasks** (pending & executed), filter/search them, inspect details inline, and upload **execution proofs**.

**Access**  
Restricted to **authenticated & authorized** roles: *Admin* and *Consultant*.

**Layout & Controls**
- **Tabs:** *Tasks* (active), *Users*.
- **Search Transaction ID**.
- **Filters:** Task Type (All Types, Liquidation, Acquisition, Authorization, Arbitrage) and Task State (All States, Pending, Executed).
- **Create New Task** button (top‑right).
- **Accordion rows** per transaction with badges (Type, **Priority** like *High 24h*/*Medium 48h*), **State** (*Executed*/*Pending*), and inline summary (**Task ID**, **Chain**, **Created**, **Platform**). Each row includes **View More**.

**Upload Execution Proof** (within an expanded row)
1. Choose **Image** or **Text**.
2. **Image:** drag & drop into the dashed area or click **Choose File**.
3. **Text:** type/paste the proof text.
4. Submit (implicit on upload or via Save, per implementation).
5. Proof appears in **Task Details → Execution Proofs** with uploader & timestamp.

**Validations & Errors**
- Enforce allowed file types & size; descriptive errors.
- Filter combinations update counts and pagination correctly.

**Expected Result**
- Admins/Consultants can search/filter the backlog, expand rows, upload proofs, and open **Task Details**.

---

### Create New Tasks (Batch)
**Objective**  
Allow **Admins/Consultants** to create multiple tasks at once by **copy‑pasting rows** from Excel (or any spreadsheet) into a validated form.

**Access**  
Restricted to **authenticated & authorized** roles: *Admin* and *Consultant*.

**Step‑by‑step**
1. Open **Create New Task** from the Tasks page (top‑right).
2. **Select Task Type** (e.g., *Liquidation*, *Acquisition*, *Authorization*, *Arbitrage*). Required columns are shown as chips.
3. **Copy rows from Excel** matching the column order shown.
4. **Paste** the rows into the textarea. The system parses and validates automatically.
5. Review the **Data Preview**: totals, valid/invalid counts, and parsed values. A green badge indicates **Valid data**.
6. Fix invalid rows by editing the pasted text or spreadsheet and re‑paste.
7. Click **Create N Tasks** to submit the batch.

**Validation Rules & Limits**
- **Column order must match** the chips for the selected type.
- **Max 20 tasks per batch** (per the Instructions card).
- Types & formats: `tokenType` (`ERC721`), `chain` (`ETH`), `platform` (`Opensea`), `targetPriceEth` (number), `dateDeadline` (`DD/MM/YYYY`), `priority` (e.g., `High 24h`), `technicalVerification` (`TRUE`/`FALSE`).

**Expected Result**
- On success, **N tasks** are created and appear in **Task Execution & History** (and public dashboard once executed).

---

### Notifications in App
- **Triggering events:** Task executed; proof uploaded; batch creation success/failure; role changes.
- **Templates:** Short toast confirmations with direct links to the task or admin page.

---

### Account Settings / Profile
**Objective:** Check personal data; sign out;

### Administration
**Objective:** Provide internal operations (user management, etc.) to authorized personnel only.

#### Access Control & Entry Flow
- **AuthN required:** Users must be **signed in**. Unauthenticated users see the **Sign‑in modal**.
- **AuthZ required:** Users must hold **Admin** role. Unauthorized users see **Access Denied** and cannot query admin data.
- **Direct URL protection:** Visiting `/admin` or deep links enforces the same checks.

#### Users — Role Management (Admin only)
**Screenshot**  

**Layout & Controls**
- **Tabs:** *Tasks* and **Users**.
- **Table columns:** **User** (avatar, name, email), **Address** (wallet, copy icon), **Role** (dropdown: Admin, Consultant), **Created**.
- **Batch Actions** and **Save Changes** (enabled once there are staged edits).
- Optional **Remove** per row (red icon), if policy allows.

**Change a role**
1. Open **Users** tab → locate user.
2. Use the **Role** dropdown to select a new role.
3. Repeat as needed → click **Save Changes** to persist.

**Expected Result**
- Only Admins can modify roles; changes apply immediately to protected routes.

---

## Empty States, Errors & Edge Cases
- **Search with no results** → helpful empty state, quick “Clear filters” action.
- **Pagination boundaries** → disable prev/next appropriately.
- **Upload limits** → reject oversize/unsupported files with descriptive errors.
- **Network failures** → retry and clear error banners/toasts.
- **Unauthorized access** → Access Denied (no data leakage).

---

## Accessibility & i18n
- Ensure **keyboard navigation** and focus order for search, filters, table, pagination, and modals.
- Provide **ARIA labels** for filter pills, copy icons, and modal controls.
- Externalize UI strings for **localization** (en/es).

---

## Glossary
- **Task Hash** — Internal identifier for a scheduled/executed task.
- **Transaction Hash** — On‑chain transaction identifier.
- **AuthN** — Authentication (identity verification).
- **AuthZ** — Authorization (permission to access a resource).

---

## Changelog
- **2025‑09‑11**: Added Public Dashboard, Task Details modal, Admin Tasks list, Create New Tasks (batch), Admin Sign‑in, Users — Role Management, and Tech Stack/Environments.
