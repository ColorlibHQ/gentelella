// Gentelella v4 — TypeScript declarations for the public JS surface.
//
// Drop this file at `types/gentelella.d.ts` and add `"types": "types/gentelella.d.ts"`
// to `package.json` (already done). VS Code then resolves type info for every
// `import { ... } from 'src/v4/...'` automatically — no tsconfig needed,
// no .ts files required, IntelliSense + parameter hints just work.
//
// If you DO use TypeScript, you can also `import type { ModalAction } from
// 'gentelella'` etc. — the named exports below are reachable via the
// per-module declarations.

// ────────────────────────────────────────────────────────────────────────
//  shell.js — admin shell mount + sidebar/topbar/footer render
// ────────────────────────────────────────────────────────────────────────

declare module 'gentelella/v4/shell' {
  /**
   * Mount the admin shell (sidebar + topbar + footer + interactivity).
   * Reads body data attributes:
   *   `data-shell="admin"` — opt-in (no-op without it)
   *   `data-page="key"`     — matches a NAV item to highlight
   *   `data-breadcrumb="A > B > C"` — `>`-separated breadcrumb
   * Idempotent: skips re-rendering if the build-time plugin already injected the shell.
   */
  export function mountShell(): void;
}

declare module 'gentelella/v4/shell-render' {
  export interface NavBadge { text: string; cls: 'badge-red' | 'badge-teal' | 'badge-blue' }

  export interface NavLeaf {
    key: string;
    href: string;
    text: string;
    icon?: keyof typeof ICONS;
    badge?: NavBadge;
  }

  export interface NavParent {
    text: string;
    icon?: keyof typeof ICONS;
    badge?: NavBadge;
    children: Array<Omit<NavLeaf, 'icon'>>;
  }

  export type NavItem = NavLeaf | NavParent;

  export interface NavGroup {
    label: string;
    items: NavItem[];
  }

  export const NAV: readonly NavGroup[];
  export const ICONS: Readonly<Record<string, string>>;

  export interface ShellRenderOptions {
    activeKey?: string;
    breadcrumb?: string[];
  }

  export interface ShellHtml {
    sidebar: string;
    topbar: string;
    footer: string;
  }

  export function renderShell(opts?: ShellRenderOptions): ShellHtml;
  export function renderSidebar(activeKey: string): string;
  export function renderTopbar(breadcrumb: string[]): string;
  export function renderFooter(): string;

  /**
   * Parse `data-shell="admin" data-page="…" data-breadcrumb="…"` from a body
   * tag's attribute string. Returns `null` when shell is not opt-in.
   */
  export function parseShellAttrs(attrs: string): {
    activeKey: string;
    breadcrumb: string[];
  } | null;
}

// ────────────────────────────────────────────────────────────────────────
//  toast.js — transient notifications
// ────────────────────────────────────────────────────────────────────────

declare module 'gentelella/v4/toast' {
  export interface ToastOptions {
    /** Visual style. Defaults to `'default'`. */
    variant?: 'default' | 'success' | 'error' | 'info' | 'warning';
    /** ms before auto-dismiss. Click also dismisses. Defaults to 2600. */
    duration?: number;
  }

  /**
   * Show a transient toast at the top-right.
   * @returns the toast element (so the caller can dismiss it early).
   */
  export function showToast(message: string, opts?: ToastOptions): HTMLDivElement;
}

// ────────────────────────────────────────────────────────────────────────
//  modal.js — focus-trapped dialog
// ────────────────────────────────────────────────────────────────────────

declare module 'gentelella/v4/modal' {
  export interface ModalActionContext {
    dialog: HTMLElement;
    body: HTMLElement;
    close: () => void;
  }

  export interface ModalAction {
    label: string;
    variant?: 'primary' | 'outline' | 'danger' | 'ghost';
    /**
     * Return `false` to keep the modal open (e.g. validation failed).
     * Otherwise the modal closes after the handler runs.
     */
    action?: (ctx: ModalActionContext) => unknown;
    /** Default `true`. Set false to keep the modal open after `action`. */
    closeOnAction?: boolean;
  }

  export interface ModalOptions {
    title?: string;
    /** HTML string (assigned via innerHTML — must be trusted) or HTMLElement. */
    body?: string | HTMLElement;
    actions?: ModalAction[];
    size?: 'sm' | 'md' | 'lg';
    /** Fires after the modal is dismissed (any reason). */
    onClose?: () => void;
  }

  export interface ModalHandle {
    dialog: HTMLElement;
    body: HTMLElement;
    close: () => void;
  }

  export function showModal(opts?: ModalOptions): ModalHandle;
  export function closeModal(opts?: { skipHook?: boolean }): void;
  export function isModalOpen(): boolean;
}

// ────────────────────────────────────────────────────────────────────────
//  menus.js — popover menu + side panel
// ────────────────────────────────────────────────────────────────────────

declare module 'gentelella/v4/menus' {
  /** A clickable menu entry; `action` defaults to a no-op when omitted. */
  export interface MenuItem {
    label: string;
    /** Receives the trigger element that opened the menu. */
    action?: (trigger: HTMLElement | null) => void;
  }

  /** A divider; pass the literal string `'-'` between groups. */
  export type MenuEntry = MenuItem | '-';

  /**
   * Open a popover menu anchored to a trigger element. Toggles closed if
   * called again with the same trigger. Auto-closes on outside click,
   * Escape, scroll, or resize.
   */
  export function openMenu(trigger: HTMLElement, items: MenuEntry[]): void;

  /**
   * Like {@link openMenu} but renders arbitrary content inside a wider
   * container (notification panels, message previews, user menus).
   */
  export function openPanel(
    trigger: HTMLElement,
    content: HTMLElement | string,
    opts?: { className?: string; width?: number }
  ): void;

  export function closeMenu(): void;

  /** Default Refresh / Move up / Move down / Hide-card menu used by `.card-opt-btn`. */
  export const DEFAULT_CARD_MENU: readonly MenuEntry[];
}

// ────────────────────────────────────────────────────────────────────────
//  charts.js — ECharts factories + auto-init
// ────────────────────────────────────────────────────────────────────────

declare module 'gentelella/v4/charts' {
  /**
   * Mount ECharts on every `<div data-chart="…">` on the page. Lazy-imports
   * `echarts/core` plus the chart types and components actually needed.
   * Re-paints on `data-theme` mutation and on a `themechange` custom event.
   */
  export function initCharts(): Promise<void>;
}

// ────────────────────────────────────────────────────────────────────────
//  tables.js — DataTables auto-init
// ────────────────────────────────────────────────────────────────────────

declare module 'gentelella/v4/tables' {
  /**
   * Wire DataTables on every `<table data-datatable>`.
   * Opt-in extras via attribute on the `<table>`:
   *   `data-page-length="25"`       — rows per page
   *   `data-selectable`             — wire row checkboxes
   *   `data-export="filename"`      — show a CSV export button
   * Plus `<th data-orderable="false">` to disable sort per column.
   */
  export function initTables(): Promise<void>;
}

// ────────────────────────────────────────────────────────────────────────
//  command-palette.js — ⌘K / Ctrl+K
// ────────────────────────────────────────────────────────────────────────

declare module 'gentelella/v4/command-palette' {
  /** Wire the global ⌘K shortcut + topbar search-input opener. Idempotent. */
  export function initCommandPalette(): void;
  /** Open programmatically. */
  export function openCommandPalette(): void;
  /** Close programmatically. */
  export function closeCommandPalette(): void;
}

// ────────────────────────────────────────────────────────────────────────
//  page-actions.js — global Print / Export / Compose / etc. dispatcher
// ────────────────────────────────────────────────────────────────────────

declare module 'gentelella/v4/page-actions' {
  /**
   * Wire shared button-intent handlers (Print / Export / Refresh / Share /
   * Compose / `New <thing>` / Invite). Buttons that don't match an intent
   * pass through unhandled.
   */
  export function initPageActions(): void;
}

// ────────────────────────────────────────────────────────────────────────
//  data-adapter.js — seed ↔ http data source pattern
// ────────────────────────────────────────────────────────────────────────

declare module 'gentelella/v4/data-adapter' {
  /** True when `?api=1` in URL or `window.__GENTELELLA_API__ = true`. */
  export function useApiMode(): boolean;

  /** Unified surface every adapter implements — keeps render code the same. */
  export interface Adapter<T = unknown> {
    list(query?: Record<string, unknown>): Promise<T[]>;
    get(id: string | number): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: string | number, patch: Partial<T>): Promise<T | null>;
    remove(id: string | number): Promise<boolean | { ok: true }>;
  }

  export interface SeedAdapter<T> extends Adapter<T> {
    /** Reset to the original seed array. Useful for tests / demos. */
    reset(): void;
  }

  /**
   * In-memory adapter backed by a hardcoded array. Default for demo pages.
   * `filter` is consulted when `list({...query})` is called so the same
   * adapter can power per-folder / per-status views.
   */
  export function seedAdapter<T>(
    seed: T[],
    filter?: (item: T, query: Record<string, unknown>) => boolean
  ): SeedAdapter<T>;

  export interface HttpAdapterOptions {
    /** Extract the array from `{ <key>: [...] }` on `list`. */
    listKey?: string;
    /** Inject a custom fetch (useful for auth headers, retries). */
    fetch?: typeof fetch;
  }

  /** REST-conventions adapter against a JSON endpoint. */
  export function httpAdapter<T>(baseUrl: string, opts?: HttpAdapterOptions): Adapter<T>;

  /** Thrown by `httpAdapter` on non-2xx responses. */
  export class HttpError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
  }
}

// ────────────────────────────────────────────────────────────────────────
//  Lazy-loaded page modules (init functions)
// ────────────────────────────────────────────────────────────────────────

declare module 'gentelella/v4/inbox' {
  /**
   * Mount the interactive inbox into `#inbox-root`. With `?api=1`, hydrates
   * initial messages from `/api/messages`; otherwise uses the seed array.
   */
  export function initInbox(): Promise<void>;
}

declare module 'gentelella/v4/kanban' {
  export function initKanban(): void;
}

declare module 'gentelella/v4/calendar' {
  export function initCalendar(): void;
}

declare module 'gentelella/v4/file-manager' {
  export function initFileManager(): void;
}

declare module 'gentelella/v4/settings' {
  /** Wire all settings interactions: persistence, save/cancel, integrations, etc. Idempotent. */
  export function initSettings(): void;
}

declare module 'gentelella/v4/form-controls' {
  /**
   * Auto-init advanced form controls:
   *   `[data-date-range]`    — two-month range picker with presets
   *   `[data-rich-text]`     — toolbar editor (bold / italic / lists / link / code)
   *   `[data-multi-select]`  — chip-input with autocomplete
   * Idempotent — safe to call multiple times.
   */
  export function initFormControls(): void;
}

declare module 'gentelella/v4/details' {
  export interface ProjectDetail {
    title: string; client: string; status: string; sCls: string;
    desc: string; pct: number; due: string;
    members: Array<{ name: string; ini: string; color: string }>;
  }
  export interface ContactDetail {
    name: string; ini: string; color: string; role: string;
    projects: number; tasks: number; msgs: number;
  }
  export function openProjectModal(d: ProjectDetail): void;
  export function openContactModal(d: ContactDetail): void;
}

// ────────────────────────────────────────────────────────────────────────
//  CSS custom properties — typed for IDE autocomplete on style.setProperty()
// ────────────────────────────────────────────────────────────────────────

/**
 * Design tokens declared on `:root` in `_tokens.scss`. Use these names
 * with `style.setProperty()` or in `var(--…)` references for autocomplete.
 *
 * @example
 * document.documentElement.style.setProperty('--primary', '#ff0066');
 */
type GentelellaToken =
  // Colors
  | '--primary' | '--primary-lt' | '--primary-dk'
  | '--blue' | '--azure' | '--green' | '--lime' | '--yellow'
  | '--orange' | '--red' | '--pink' | '--purple' | '--indigo' | '--cyan'
  | '--blue-lt' | '--azure-lt' | '--green-lt' | '--yellow-lt'
  | '--red-lt' | '--purple-lt' | '--cyan-lt'
  | '--text' | '--text-secondary' | '--text-muted' | '--text-disabled'
  | '--body-bg' | '--bg-surface' | '--bg-surface-secondary'
  | '--border-color' | '--border-color-light' | '--border-translucent'
  // Sidebar
  | '--sidebar-bg' | '--sidebar-hover' | '--sidebar-active'
  | '--sidebar-text' | '--sidebar-text-hover' | '--sidebar-text-active'
  | '--sidebar-border' | '--sidebar-w'
  // Geometry
  | '--radius' | '--radius-sm' | '--radius-lg'
  | '--space-1' | '--space-2' | '--space-3' | '--space-4'
  | '--space-5' | '--space-6' | '--space-7' | '--space-8'
  // Typography
  | '--font' | '--font-mono' | '--font-size' | '--line-height'
  | '--font-weight-normal' | '--font-weight-medium' | '--font-weight-bold'
  // Effects
  | '--shadow' | '--shadow-card';

interface CSSStyleDeclaration {
  setProperty(property: GentelellaToken, value: string | null, priority?: string): void;
}

// ────────────────────────────────────────────────────────────────────────
//  markup.js — string-returning helpers for repeated markup patterns
// ────────────────────────────────────────────────────────────────────────

declare module 'gentelella/v4/markup' {
  export function escapeHtml(value: unknown): string;

  export type StatColor = 'teal' | 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'pink' | 'azure';
  export type StatusColor = 'green' | 'blue' | 'yellow' | 'red' | 'gray';
  export type BannerVariant = 'danger' | 'warning' | 'info' | 'success';

  export interface PageHeaderOptions {
    title: string;
    pretitle?: string;
    actionsHtml?: string;
  }
  export function pageHeader(opts: PageHeaderOptions): string;

  export interface StatTileOptions {
    label: string;
    value: string;
    color?: StatColor;
    iconHtml?: string;
    subtext?: string;
    change?: { pct: string; direction: 'up' | 'down' };
  }
  export function statTile(opts: StatTileOptions): string;

  export function statusBadge(label: string, color: StatusColor): string;

  export interface CustomerCellOptions {
    name: string;
    initials?: string;
    avatarColor?: string;
  }
  export function customerCell(opts: CustomerCellOptions): string;

  export interface ActivityItemOptions {
    bodyHtml: string;
    time: string;
    initials?: string;
    avatarBg?: string;
  }
  export function activityItem(opts: ActivityItemOptions): string;

  export interface VisitorRowOptions {
    name: string;
    pct: number;
    flag?: string;
  }
  export function visitorRow(opts: VisitorRowOptions): string;

  export interface EmptyStateOptions {
    title: string;
    desc?: string;
    iconHtml?: string;
    actionHtml?: string;
  }
  export function emptyState(opts: EmptyStateOptions): string;

  export interface BannerOptions {
    body: string;
    variant?: BannerVariant;
    title?: string;
    iconHtml?: string;
    actionsHtml?: string;
  }
  export function banner(opts: BannerOptions): string;

  export function skeletonRows(cols: number, rows?: number): string;
}

// ────────────────────────────────────────────────────────────────────────
//  Global window augmentation
// ────────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    /**
     * Set to `true` before the page loads to force API mode without needing
     * `?api=1` in the URL. Honored by `useApiMode()` from data-adapter.
     */
    __GENTELELLA_API__?: boolean;
  }
}

export {};
