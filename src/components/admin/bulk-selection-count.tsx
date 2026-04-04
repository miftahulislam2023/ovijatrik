"use client";

import { useEffect, useMemo, useState } from "react";

type BulkSelectionCountProps = {
  formId: string;
  name?: string;
  emptyLabel: string;
  selectedLabelTemplate?: string;
  className?: string;
};

export function BulkSelectionCount({
  formId,
  name = "ids",
  emptyLabel,
  selectedLabelTemplate = "{count} selected",
  className,
}: BulkSelectionCountProps) {
  const [selectedCount, setSelectedCount] = useState(0);

  const selector = useMemo(
    () => `input[type=\"checkbox\"][name=\"${name}\"][form=\"${formId}\"]`,
    [formId, name],
  );

  useEffect(() => {
    const updateCount = () => {
      const checkboxes = Array.from(
        document.querySelectorAll<HTMLInputElement>(selector),
      );
      const checked = checkboxes.filter((checkbox) => checkbox.checked).length;
      setSelectedCount(checked);
    };

    updateCount();

    const controller = new AbortController();
    document.addEventListener("change", updateCount, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [selector]);

  return (
    <span className={className}>
      {selectedCount > 0
        ? selectedLabelTemplate.replace("{count}", String(selectedCount))
        : emptyLabel}
    </span>
  );
}
