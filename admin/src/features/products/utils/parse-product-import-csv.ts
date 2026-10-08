import type { ProductType } from "@/features/products/types/products.types";

export type ProductImportCsvRow = {
  rowNumber: number;
  data: Record<string, string>;
};

export type ProductImportPreviewGroup = {
  id: string;
  titleEn: string;
  titleAr: string;
  type: ProductType | string;
  brand: string;
  categories: string;
  tags: string;
  rowNumbers: number[];
  variantCount: number;
  validationErrors: string[];
  rows: Record<string, string>[];
};

export type ParsedProductImportCsv = {
  header: string[];
  groups: ProductImportPreviewGroup[];
};

const VALID_TYPES: ProductType[] = ["SIMPLE", "VARIABLE_PRODUCT"];

function parseCsvRecords(content: string): string[][] {
  const records: string[][] = [];
  let currentRecord: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const nextChar = content[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRecord.push(currentField);
      currentField = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      currentRecord.push(currentField);
      currentField = "";

      if (currentRecord.some((value) => value.trim() !== "")) {
        records.push(currentRecord);
      }
      currentRecord = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRecord.length > 0) {
    currentRecord.push(currentField);
    if (currentRecord.some((value) => value.trim() !== "")) {
      records.push(currentRecord);
    }
  }

  return records;
}

function getProductGroupKey(data: Record<string, string>): string {
  const title = (data.translations_en_title ?? "").trim().toLowerCase();
  const type = (data.type ?? "").trim();
  const brand = (data.brand_en ?? data.brand ?? "").trim().toLowerCase();
  return `${title}|${type}|${brand}`;
}

function validateProductGroup(group: Omit<ProductImportPreviewGroup, "validationErrors">): string[] {
  const errors: string[] = [];
  const main = group.rows[0] ?? {};

  if (!group.titleEn.trim()) {
    errors.push("translations_en_title is required.");
  }

  if (!VALID_TYPES.includes(group.type as ProductType)) {
    errors.push('type must be SIMPLE or VARIABLE_PRODUCT.');
  }

  if (!group.brand.trim()) {
    errors.push("brand is required.");
  }

  if (!group.categories.trim()) {
    errors.push("categories is required.");
  }

  if (!group.tags.trim()) {
    errors.push("tags is required.");
  }

  if (group.type === "SIMPLE") {
    if (group.variantCount > 1) {
      errors.push("SIMPLE products should have only one CSV row.");
    }

    const price = (main.price ?? "").trim();
    const stock = (main.stock ?? "").trim();

    if (!price || !stock) {
      errors.push("SIMPLE products require price and stock.");
    }
  }

  if (group.type === "VARIABLE_PRODUCT") {
    group.rows.forEach((row, index) => {
      const variantNumber = index + 1;
      const price = (row.variant_price ?? "").trim();
      const stock = (row.variant_stock ?? "").trim();
      const attributeNames = (row.variant_attribute_names_en ?? row.variant_attribute_names ?? "").trim();
      const attributeValues = (
        row.variant_attribute_value_names_en ??
        row.variant_attribute_value_names ??
        ""
      ).trim();

      if (!price || !stock) {
        errors.push(
          `Variant #${variantNumber} requires variant_price and variant_stock.`,
        );
      }

      if (!attributeNames || !attributeValues) {
        errors.push(
          `Variant #${variantNumber} requires variant_attribute_names and variant_attribute_value_names.`,
        );
      }
    });
  }

  return errors;
}

export function groupProductImportRows(rows: ProductImportCsvRow[]): ProductImportPreviewGroup[] {
  const grouped = new Map<string, ProductImportPreviewGroup>();

  for (const row of rows) {
    const key = getProductGroupKey(row.data);

    if (!grouped.has(key)) {
      const main = row.data;
      grouped.set(key, {
        id: key,
        titleEn: (main.translations_en_title ?? "").trim(),
        titleAr: (main.translations_ar_title ?? "").trim(),
        type: (main.type ?? "").trim(),
        brand: (main.brand_en ?? main.brand ?? "").trim(),
        categories: (main.categories_en ?? main.categories ?? "").trim(),
        tags: (main.tags_en ?? main.tags ?? "").trim(),
        rowNumbers: [],
        variantCount: 0,
        validationErrors: [],
        rows: [],
      });
    }

    const group = grouped.get(key)!;
    group.rowNumbers.push(row.rowNumber);
    group.rows.push(row.data);
    group.variantCount = group.rows.length;
  }

  return Array.from(grouped.values()).map((group) => ({
    ...group,
    validationErrors: validateProductGroup(group),
  }));
}

export async function parseProductImportCsvFile(file: File): Promise<ParsedProductImportCsv> {
  const content = await file.text();
  const records = parseCsvRecords(content);

  if (records.length === 0) {
    throw new Error("The CSV file is empty.");
  }

  const header = records[0].map((column) => column.trim());
  const parsedRows: ProductImportCsvRow[] = [];

  records.slice(1).forEach((record, index) => {
    const rowNumber = index + 2;
    const data: Record<string, string> = {};

    header.forEach((column, columnIndex) => {
      data[column] = (record[columnIndex] ?? "").trim();
    });

    const hasContent = Object.values(data).some((value) => value.trim() !== "");
    if (!hasContent) {
      return;
    }

    parsedRows.push({ rowNumber, data });
  });

  if (parsedRows.length === 0) {
    throw new Error("The CSV file has no product rows.");
  }

  return {
    header,
    groups: groupProductImportRows(parsedRows),
  };
}

function escapeCsvValue(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildProductImportCsvFile(
  header: string[],
  groups: ProductImportPreviewGroup[],
  fileName: string,
): File {
  const lines = [header.map(escapeCsvValue).join(",")];

  for (const group of groups) {
    for (const row of group.rows) {
      const values = header.map((column) => escapeCsvValue(row[column] ?? ""));
      lines.push(values.join(","));
    }
  }

  return new File([lines.join("\n")], fileName, { type: "text/csv" });
}

export function formatImportRowRange(rowNumbers: number[]): string {
  if (rowNumbers.length === 0) return "—";
  if (rowNumbers.length === 1) return String(rowNumbers[0]);
  return `${rowNumbers[0]}-${rowNumbers[rowNumbers.length - 1]}`;
}
