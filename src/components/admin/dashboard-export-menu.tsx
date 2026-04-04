"use client";

import { jsPDF } from "jspdf";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type ExportDonationRow = {
  donor: string;
  amount: number;
  medium: string;
  source: string;
  status: string;
  dateIso: string;
};

type DashboardExportMenuProps = {
  rows: ExportDonationRow[];
  fileBaseName?: string;
};

function sanitizeCsvValue(value: string) {
  const cleaned = value.replace(/\r?\n|\r/g, " ").replace(/"/g, '""');
  return `"${cleaned}"`;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function DashboardExportMenu({
  rows,
  fileBaseName = "donations-export",
}: DashboardExportMenuProps) {
  const exportCsv = () => {
    const header = ["Donor", "Amount", "Medium", "Source", "Status", "Date"];

    const csvRows = [
      header.map(sanitizeCsvValue).join(","),
      ...rows.map((row) =>
        [
          row.donor,
          String(row.amount),
          row.medium,
          row.source,
          row.status,
          row.dateIso.slice(0, 10),
        ]
          .map(sanitizeCsvValue)
          .join(","),
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8",
    });

    downloadBlob(`${fileBaseName}.csv`, blob);
  };

  const exportPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    doc.setFontSize(14);
    doc.text("Recent Donations Export", 40, 40);

    doc.setFontSize(10);
    doc.text(`Rows: ${rows.length}`, 40, 58);

    let y = 84;
    doc.setFont("helvetica", "bold");
    doc.text("Donor", 40, y);
    doc.text("Amount", 210, y);
    doc.text("Medium", 290, y);
    doc.text("Source", 380, y);
    doc.text("Status", 560, y);
    doc.text("Date", 650, y);

    doc.setFont("helvetica", "normal");
    y += 18;

    for (const row of rows) {
      if (y > 560) {
        doc.addPage();
        y = 40;
      }

      doc.text(row.donor.slice(0, 28), 40, y);
      doc.text(`BDT ${row.amount.toLocaleString()}`, 210, y);
      doc.text(row.medium, 290, y);
      doc.text(row.source.slice(0, 30), 380, y);
      doc.text(row.status, 560, y);
      doc.text(row.dateIso.slice(0, 10), 650, y);
      y += 16;
    }

    doc.save(`${fileBaseName}.pdf`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-xl text-xs sm:text-sm"
        onClick={exportCsv}
      >
        <Download className="h-4 w-4" />
        CSV
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-xl text-xs sm:text-sm"
        onClick={exportPdf}
      >
        <Download className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );
}
