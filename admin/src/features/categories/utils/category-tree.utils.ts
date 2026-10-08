import type { Category } from "@/features/categories/types/categories.types";

export type CategoryTreeRow = {
  id: number;
  category: Category;
  treeDepth: number;
  hasChildren: boolean;
};

export const CATEGORY_TREE_INDENT_REM = 1.25;

const CATEGORY_TREE_ROW_DEPTH_CLASSES: Record<number, string> = {
  1: "bg-muted/30 hover:bg-muted/40 data-[state=selected]:bg-muted/50",
  2: "bg-muted/45 hover:bg-muted/55 data-[state=selected]:bg-muted/65",
  3: "bg-muted/60 hover:bg-muted/70 data-[state=selected]:bg-muted/80",
};

export function getCategoryTreeRowClassName(treeDepth: number): string | undefined {
  if (treeDepth <= 0) return undefined;

  return CATEGORY_TREE_ROW_DEPTH_CLASSES[treeDepth] ?? CATEGORY_TREE_ROW_DEPTH_CLASSES[3];
}

export function flattenCategoryTree(categories: Category[]): Category[] {
  const flattened: Category[] = [];

  const visit = (category: Category) => {
    flattened.push(category);

    for (const child of category.children ?? []) {
      visit(child);
    }
  };

  for (const category of categories) {
    visit(category);
  }

  return flattened;
}

export function getCategoryChildren(category: Category): Category[] {
  return category.children ?? [];
}

/** All nested descendant ids under `category` (does not include `category.id`). */
export function collectCategoryDescendantIds(category: Category): number[] {
  const ids: number[] = [];

  const visit = (node: Category) => {
    for (const child of node.children ?? []) {
      ids.push(child.id);
      visit(child);
    }
  };

  visit(category);
  return ids;
}

/**
 * Ids that must not be chosen as parents when editing `category`:
 * the category itself plus every descendant (prevents hierarchy cycles).
 */
export function buildForbiddenParentIds(category: Category): Set<number> {
  const forbidden = new Set<number>([category.id]);
  for (const id of collectCategoryDescendantIds(category)) {
    forbidden.add(id);
  }
  return forbidden;
}

/** True when child entities are already present on the category. */
export function categoryHasLoadedChildren(category: Category): boolean {
  return (category.children?.length ?? 0) > 0;
}

/**
 * True when the category can show an expand control — either children are
 * already embedded, or the backend reported that children exist.
 */
export function categoryCanExpand(category: Category): boolean {
  if (categoryHasLoadedChildren(category)) return true;
  if (category.hasChildren === true) return true;
  if (typeof category.childrenCount === "number" && category.childrenCount > 0) return true;
  return false;
}

/** @deprecated Prefer categoryCanExpand / categoryHasLoadedChildren. */
export function categoryHasChildren(category: Category): boolean {
  return categoryCanExpand(category);
}

export function collectParentCategoryIds(categories: Category[]): number[] {
  return flattenCategoryTree(categories)
    .filter((category) => categoryHasLoadedChildren(category))
    .map((category) => category.id);
}

export function buildVisibleCategoryTreeRows(
  categories: Category[],
  expandedIds: ReadonlySet<number>,
  resolveChildren: (category: Category) => Category[],
  resolveCategory: (category: Category) => Category = (category) => category,
  treeDepth = 0,
): CategoryTreeRow[] {
  const rows: CategoryTreeRow[] = [];

  for (const category of categories) {
    const resolved = resolveCategory(category);
    const children = resolveChildren(category);
    const hasChildren = categoryCanExpand(resolved);

    rows.push({ id: category.id, category: resolved, treeDepth, hasChildren });

    if (expandedIds.has(category.id) && (children.length > 0 || hasChildren)) {
      if (children.length > 0) {
        rows.push(
          ...buildVisibleCategoryTreeRows(
            children,
            expandedIds,
            resolveChildren,
            resolveCategory,
            treeDepth + 1,
          ),
        );
      }
    }
  }

  return rows;
}

/** Immutably patch a category (and nested children) by id. */
export function patchCategoryInTree(
  categories: Category[],
  categoryId: number,
  patch: Partial<Category>,
): Category[] {
  let didChange = false;

  const next = categories.map((category) => {
    if (category.id === categoryId) {
      didChange = true;
      return { ...category, ...patch };
    }

    if (!category.children?.length) {
      return category;
    }

    const children = patchCategoryInTree(category.children, categoryId, patch);
    if (children === category.children) {
      return category;
    }

    didChange = true;
    return { ...category, children };
  });

  return didChange ? next : categories;
}

/**
 * Patch a category in the expansion loaded-cache: top-level entries and any
 * nested `children` arrays so nested toggles stay in sync with the UI tree.
 */
export function patchCategoryInLoadedMap(
  loaded: Record<number, Category>,
  categoryId: number,
  patch: Partial<Category>,
): Record<number, Category> {
  let didChange = false;
  const next: Record<number, Category> = {};

  for (const [key, category] of Object.entries(loaded)) {
    const id = Number(key);
    let updated = category;

    if (id === categoryId) {
      updated = { ...category, ...patch };
      didChange = true;
    }

    if (updated.children?.length) {
      const children = patchCategoryInTree(updated.children, categoryId, patch);
      if (children !== updated.children) {
        updated = { ...updated, children };
        didChange = true;
      }
    }

    next[id] = updated;
  }

  return didChange ? next : loaded;
}
