import { Info, Plus } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { CreateAttributeValueDialog } from "@/features/attributes/components/CreateAttributeValueDialog";
import { CreateAttributeWithValuesDialog } from "@/features/attributes/components/CreateAttributeWithValuesDialog";
import { attributesService } from "@/features/attributes/services/attributes.service";
import type { Attribute } from "@/features/attributes/types/attributes.types";
import type { AttributeValue } from "@/features/attribute-values/types/attribute-values.types";
import {
  buildAttributeSeedsFromPoolIds,
  mergeAttributeCatalog,
} from "@/features/products/utils/build-attribute-seeds-from-product";
import {
  Alert,
  AlertDescription,
  AppBadge,
  AppButton,
  FormField,
  SelectField,
} from "@/shared/components";
import { useCrudQuery } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import {
  formatBilingualLabel,
  getBilingualTitle,
} from "@/shared/lib/translation-display.utils";
import { cn } from "@/shared/design-system/components/ui/utils";

export type AttributeValueSelectionMode = "single" | "multi";

type AttributeValueSelectorProps = {
  attributeIds: number[];
  attributeValueIds: number[];
  onChange: (attributeIds: number[], attributeValueIds: number[]) => void;
  disabled?: boolean;
  error?: string;
  /** Single value per attribute (variants). Multi values per attribute (product attribute pool). */
  selectionMode?: AttributeValueSelectionMode;
  /** Limit which attributes appear (variant tab uses the configured pool). */
  allowedAttributeIds?: number[];
  /** Limit which values appear per attribute. */
  allowedAttributeValueIds?: number[];
  /** Product/edit seeds — used before catalog fetch completes. */
  seedAttributes?: Attribute[];
  /** Defer catalog fetch until tab/panel is active. */
  enabled?: boolean;
  /** Unique key per variant row — keeps dropdown state isolated across rows. */
  instanceKey?: string;
  label?: string;
  required?: boolean;
  /**
   * When true (typically Simple products), show an info alert on any attribute
   * that has more than one selected value, explaining Variable Product is required
   * for customer choice.
   */
  showVariableProductHint?: boolean;
  /** Allow creating catalog attributes/values via Attributes API from this selector. */
  allowCreateAttribute?: boolean;
};

function getAttributeLabel(attribute: Attribute): string {
  return formatBilingualLabel(getBilingualTitle(attribute.translations, attribute.title));
}

function getValueLabel(value: NonNullable<Attribute["values"]>[number]): string {
  return formatBilingualLabel(getBilingualTitle(value.translations, value.title));
}

export function AttributeValueSelector({
  attributeIds,
  attributeValueIds,
  onChange,
  disabled = false,
  error,
  selectionMode = "single",
  allowedAttributeIds,
  allowedAttributeValueIds,
  seedAttributes = [],
  enabled = true,
  instanceKey,
  label,
  required = true,
  showVariableProductHint = false,
  allowCreateAttribute = false,
}: AttributeValueSelectorProps) {
  const t = useTranslation();
  const fieldId = useId();
  const selectInstanceKey = instanceKey ?? fieldId;
  const allowedAttributeIdsKey = allowedAttributeIds?.join(",") ?? "";
  const [isCreateAttributeOpen, setIsCreateAttributeOpen] = useState(false);
  const [addValueAttribute, setAddValueAttribute] = useState<Attribute | null>(null);

  const attributesQuery = useCrudQuery({
    queryKey: ["attributes", "value-selector"],
    queryFn: async () => {
      const result = await attributesService.list({
        limit: 100,
        publish: true,
        sort: "id",
        direction: "asc",
      });
      return {
        ...result,
        data: [...result.data].sort((left, right) =>
          getAttributeLabel(left).localeCompare(getAttributeLabel(right)),
        ),
      };
    },
    enabled,
  });

  const resolvedSeeds = useMemo(() => {
    const fetched = attributesQuery.data?.data ?? [];
    if (
      selectionMode === "single" &&
      allowedAttributeIds?.length &&
      allowedAttributeValueIds?.length
    ) {
      const poolSeeds = buildAttributeSeedsFromPoolIds(
        fetched,
        allowedAttributeIds,
        allowedAttributeValueIds,
      );
      return mergeAttributeCatalog(seedAttributes, poolSeeds);
    }
    return seedAttributes;
  }, [
    allowedAttributeIds,
    allowedAttributeValueIds,
    attributesQuery.data?.data,
    seedAttributes,
    selectionMode,
  ]);

  const attributes = useMemo(() => {
    const fetched = attributesQuery.data?.data ?? [];
    const merged = mergeAttributeCatalog(resolvedSeeds, fetched);
    const allowedAttributeIdSet = allowedAttributeIds?.length
      ? new Set(allowedAttributeIds)
      : null;

    return merged
      .filter((attribute) => {
        if (allowedAttributeIdSet && !allowedAttributeIdSet.has(attribute.id)) {
          return false;
        }
        return true;
      })
      .sort((left, right) => getAttributeLabel(left).localeCompare(getAttributeLabel(right)));
  }, [allowedAttributeIdsKey, attributesQuery.data?.data, resolvedSeeds]);

  const getVisibleValues = (attribute: Attribute) => {
    const values = attribute.values ?? [];
    const allowedValueIdSet = allowedAttributeValueIds?.length
      ? new Set(allowedAttributeValueIds)
      : null;

    if (!allowedValueIdSet) return values;

    const poolValues = values.filter((value) => allowedValueIdSet.has(value.id));

    if (selectionMode !== "single") {
      return poolValues;
    }

    const selectedForAttribute = values.filter((value) => attributeValueIds.includes(value.id));
    const mergedById = new Map(poolValues.map((value) => [value.id, value]));
    for (const value of selectedForAttribute) {
      mergedById.set(value.id, value);
    }

    return [...mergedById.values()].sort((left, right) =>
      getValueLabel(left).localeCompare(getValueLabel(right)),
    );
  };

  const toggleAttribute = (attributeId: number, checked: boolean) => {
    if (!checked) {
      const attribute = attributes.find((entry) => entry.id === attributeId);
      const valueIdsToRemove = new Set((attribute?.values ?? []).map((value) => value.id));
      onChange(
        attributeIds.filter((id) => id !== attributeId),
        attributeValueIds.filter((id) => !valueIdsToRemove.has(id)),
      );
      return;
    }

    onChange(
      attributeIds.includes(attributeId) ? attributeIds : [...attributeIds, attributeId],
      attributeValueIds,
    );
  };

  const toggleValue = (attributeId: number, valueId: number, checked: boolean) => {
    const attribute = attributes.find((entry) => entry.id === attributeId);
    const valueIdsForAttribute = new Set((attribute?.values ?? []).map((value) => value.id));

    if (selectionMode === "multi") {
      const nextValueIds = checked
        ? attributeValueIds.includes(valueId)
          ? attributeValueIds
          : [...attributeValueIds, valueId]
        : attributeValueIds.filter((id) => id !== valueId);

      const hasAnyForAttribute = nextValueIds.some((id) => valueIdsForAttribute.has(id));
      const nextAttributeIds = hasAnyForAttribute
        ? attributeIds.includes(attributeId)
          ? attributeIds
          : [...attributeIds, attributeId]
        : attributeIds.filter((id) => id !== attributeId);

      onChange(nextAttributeIds, nextValueIds);
      return;
    }

    const nextValueIds = attributeValueIds.filter((id) => !valueIdsForAttribute.has(id));
    if (checked) {
      nextValueIds.push(valueId);
    }

    const nextAttributeIds = attributeIds.includes(attributeId)
      ? attributeIds
      : [...attributeIds, attributeId];

    onChange(nextAttributeIds, nextValueIds);
  };

  const selectAllValuesForAttribute = (attributeId: number) => {
    const attribute = attributes.find((entry) => entry.id === attributeId);
    const visibleValues = attribute ? getVisibleValues(attribute) : [];
    const visibleValueIds = visibleValues.map((value) => value.id);
    const valueIdsForAttribute = new Set((attribute?.values ?? []).map((value) => value.id));
    const nextValueIds = [
      ...attributeValueIds.filter((id) => !valueIdsForAttribute.has(id)),
      ...visibleValueIds,
    ];
    const nextAttributeIds = attributeIds.includes(attributeId)
      ? attributeIds
      : [...attributeIds, attributeId];
    onChange(nextAttributeIds, nextValueIds);
  };

  const clearValuesForAttribute = (attributeId: number) => {
    const attribute = attributes.find((entry) => entry.id === attributeId);
    const valueIdsToRemove = new Set((attribute?.values ?? []).map((value) => value.id));
    onChange(
      attributeIds.includes(attributeId) ? attributeIds : [...attributeIds, attributeId],
      attributeValueIds.filter((id) => !valueIdsToRemove.has(id)),
    );
  };

  const clearAllAttributeValues = () => {
    onChange(attributeIds, []);
  };

  const hasSelectedValues = attributeValueIds.length > 0;

  const selectCreatedAttribute = (
    attribute: Attribute,
    createdValues: AttributeValue[],
  ) => {
    const attributeWithValues: Attribute = {
      ...attribute,
      values: createdValues.map((value) => ({
        id: value.id,
        title: value.title,
        translations: value.translations,
      })),
    };

    attributesQuery.patchData((previous) => ({
      ...previous,
      data: mergeAttributeCatalog(previous.data, [attributeWithValues]),
      total: previous.total + (previous.data.some((entry) => entry.id === attribute.id) ? 0 : 1),
    }));

    const nextValueIds = createdValues.map((value) => value.id);
    onChange(
      attributeIds.includes(attribute.id) ? attributeIds : [...attributeIds, attribute.id],
      [...new Set([...attributeValueIds, ...nextValueIds])],
    );
  };

  const selectCreatedAttributeValue = (attributeId: number, createdValue: AttributeValue) => {
    attributesQuery.patchData((previous) => ({
      ...previous,
      data: previous.data.map((attribute) => {
        if (attribute.id !== attributeId) return attribute;
        const existingValues = attribute.values ?? [];
        if (existingValues.some((value) => value.id === createdValue.id)) {
          return attribute;
        }
        return {
          ...attribute,
          values: [
            ...existingValues,
            {
              id: createdValue.id,
              title: createdValue.title,
              translations: createdValue.translations,
            },
          ],
        };
      }),
    }));

    onChange(
      attributeIds.includes(attributeId) ? attributeIds : [...attributeIds, attributeId],
      attributeValueIds.includes(createdValue.id)
        ? attributeValueIds
        : [...attributeValueIds, createdValue.id],
    );
  };

  const isValueSelected = (valueId: number) => attributeValueIds.includes(valueId);

  const selectedValueForAttribute = (attributeId: number): string => {
    const attribute = attributes.find((entry) => entry.id === attributeId);
    const selected = (attribute?.values ?? []).find((value) => attributeValueIds.includes(value.id));
    return selected ? String(selected.id) : "";
  };

  const selectSingleValue = (attributeId: number, valueId: number) => {
    const attribute = attributes.find((entry) => entry.id === attributeId);
    const valueIdsForAttribute = new Set((attribute?.values ?? []).map((value) => value.id));
    const nextValueIds = [
      ...attributeValueIds.filter((id) => !valueIdsForAttribute.has(id)),
      valueId,
    ];
    const nextAttributeIds = attributeIds.includes(attributeId)
      ? attributeIds
      : [...attributeIds, attributeId];

    onChange(nextAttributeIds, nextValueIds);
  };

  if (enabled && attributesQuery.isLoading && !attributes.length) {
    return <p className="text-sm text-muted-foreground">{t.loadingMessage}</p>;
  }

  const fieldLabel = label ?? t.productAttributes;

  if (!attributes.length) {
    if (selectionMode === "multi" && allowCreateAttribute) {
      return (
        <FormField label={fieldLabel} fieldId={fieldId} error={error} required={required}>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{t.noAttributesAvailable}</p>
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => setIsCreateAttributeOpen(true)}
            >
              <Plus className="size-4" aria-hidden="true" />
              {t.addAttribute}
            </AppButton>
          </div>
          <CreateAttributeWithValuesDialog
            open={isCreateAttributeOpen}
            onOpenChange={setIsCreateAttributeOpen}
            onCreated={selectCreatedAttribute}
          />
        </FormField>
      );
    }

    return <p className="text-sm text-muted-foreground">{t.noAttributesAvailable}</p>;
  }

  if (selectionMode === "single") {
    return (
      <FormField label={fieldLabel} fieldId={fieldId} error={error} required={required}>
        <div className="grid gap-4 sm:grid-cols-2">
          {attributes.map((attribute) => {
            const visibleValues = getVisibleValues(attribute);

            return (
              <SelectField
                key={`${selectInstanceKey}-${attribute.id}`}
                label={getAttributeLabel(attribute)}
                value={selectedValueForAttribute(attribute.id)}
                onValueChange={(valueId) => selectSingleValue(attribute.id, Number(valueId))}
                options={visibleValues.map((value) => ({
                  value: String(value.id),
                  label: getValueLabel(value),
                }))}
                placeholder={t.selectAttributeValue}
                disabled={disabled || visibleValues.length === 0}
                required={required}
              />
            );
          })}
        </div>
      </FormField>
    );
  }

  return (
    <FormField label={fieldLabel} fieldId={fieldId} error={error} required={required}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {allowCreateAttribute ? (
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => setIsCreateAttributeOpen(true)}
            >
              <Plus className="size-4" aria-hidden="true" />
              {t.addAttribute}
            </AppButton>
          ) : (
            <span />
          )}
          {hasSelectedValues ? (
            <button
              type="button"
              className="text-xs font-medium text-destructive hover:underline"
              disabled={disabled}
              onClick={clearAllAttributeValues}
            >
              {t.clearAllAttributeValues}
            </button>
          ) : null}
        </div>

        {attributes.map((attribute) => {
          const visibleValues = getVisibleValues(attribute);
          const isAttributeEnabled =
            attributeIds.includes(attribute.id) ||
            visibleValues.some((value) => isValueSelected(value.id));
          const selectedCount = visibleValues.filter((value) => isValueSelected(value.id)).length;

          return (
            <div
              key={attribute.id}
              className="rounded-xl border border-border/70 bg-muted/10 p-3 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={isAttributeEnabled}
                    disabled={disabled}
                    onChange={(event) => toggleAttribute(attribute.id, event.target.checked)}
                    className="size-4 rounded border-border"
                  />
                  {getAttributeLabel(attribute)}
                </label>

                {isAttributeEnabled ? (
                  <div className="flex flex-wrap items-center gap-3">
                    {allowCreateAttribute ? (
                      <button
                        type="button"
                        className="text-xs font-medium text-primary hover:underline"
                        disabled={disabled}
                        onClick={() => setAddValueAttribute(attribute)}
                      >
                        {t.addAttributeValue}
                      </button>
                    ) : null}
                    {visibleValues.length > 0 ? (
                      <button
                        type="button"
                        className="text-xs font-medium text-primary hover:underline"
                        disabled={disabled}
                        onClick={() => selectAllValuesForAttribute(attribute.id)}
                      >
                        {t.selectAllAttributeValues}
                      </button>
                    ) : null}
                    {selectedCount > 0 ? (
                      <button
                        type="button"
                        className="text-xs font-medium text-destructive hover:underline"
                        disabled={disabled}
                        onClick={() => clearValuesForAttribute(attribute.id)}
                      >
                        {t.clearAttributeValues}
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {isAttributeEnabled ? (
                <div className="flex flex-wrap gap-2">
                  {visibleValues.length === 0 ? (
                    <p className="text-xs text-muted-foreground">{t.noData}</p>
                  ) : (
                    visibleValues.map((value) => {
                      const checked = isValueSelected(value.id);
                      const title = getBilingualTitle(value.translations, value.title);
                      return (
                        <label
                          key={value.id}
                          className={cn(
                            "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                            checked
                              ? "border-primary/40 bg-primary/10 text-foreground"
                              : "border-border bg-background text-muted-foreground hover:border-border/80",
                            disabled && "cursor-not-allowed opacity-60",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={(event) =>
                              toggleValue(attribute.id, value.id, event.target.checked)
                            }
                            className="size-4 rounded border-border"
                          />
                          <span className="flex flex-wrap items-center gap-1.5">
                            {title.en ? <AppBadge label={title.en} variant="brand" /> : null}
                            {title.ar ? (
                              <span dir="rtl">
                                <AppBadge label={title.ar} variant="neutral" />
                              </span>
                            ) : null}
                            {!title.en && !title.ar ? getValueLabel(value) : null}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              ) : null}

              {selectedCount > 0 ? (
                <p className="text-xs text-muted-foreground">
                  {t.selectedAttributeValuesCount.replace("{count}", String(selectedCount))}
                </p>
              ) : null}

              {showVariableProductHint && selectedCount > 1 ? (
                <Alert variant="info">
                  <Info aria-hidden="true" />
                  <AlertDescription>{t.attributeMultiValueVariableProductHint}</AlertDescription>
                </Alert>
              ) : null}
            </div>
          );
        })}
      </div>

      {allowCreateAttribute ? (
        <>
          <CreateAttributeWithValuesDialog
            open={isCreateAttributeOpen}
            onOpenChange={setIsCreateAttributeOpen}
            onCreated={selectCreatedAttribute}
          />
          {addValueAttribute ? (
            <CreateAttributeValueDialog
              open={Boolean(addValueAttribute)}
              onOpenChange={(open) => {
                if (!open) setAddValueAttribute(null);
              }}
              attributeId={addValueAttribute.id}
              attributeLabel={getAttributeLabel(addValueAttribute)}
              onCreated={(value) => selectCreatedAttributeValue(addValueAttribute.id, value)}
            />
          ) : null}
        </>
      ) : null}
    </FormField>
  );
}
