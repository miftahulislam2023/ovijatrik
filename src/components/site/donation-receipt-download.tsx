"use client";

import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { useState } from "react";

type DonationReceiptDownloadProps = {
  receiptId: string;
  amount: number;
  trxid?: string | null;
  donorName: string;
  donationFor: string;
  medium: string;
  dateIso: string;
  buttonLabel: string;
  generatingLabel: string;
  language?: "en" | "bn";
};

const HIND_SILIGURI_FONT_URL =
  "https://fonts.gstatic.com/ea/hindsiliguri/v3/HindSiliguri-Regular.ttf";

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    image.src = url;
  });
}

async function loadBanglaCanvasFont() {
  try {
    const font = new FontFace(
      "HindSiliguriReceipt",
      `url(${HIND_SILIGURI_FONT_URL}) format("truetype")`,
    );
    const loaded = await font.load();
    document.fonts.add(loaded);
    await document.fonts.ready;
    return true;
  } catch {
    return false;
  }
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(/\s+/).filter(Boolean);
  let line = "";
  let currentY = y;

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = candidate;
    }
  }

  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }

  return currentY;
}

function drawCenteredWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) {
    lines.push(line);
  }

  const previousAlign = ctx.textAlign;
  ctx.textAlign = "center";

  let currentY = y;
  for (const wrappedLine of lines) {
    ctx.fillText(wrappedLine, centerX, currentY);
    currentY += lineHeight;
  }

  ctx.textAlign = previousAlign;
  return currentY;
}

export default function DonationReceiptDownload({
  receiptId,
  amount,
  trxid,
  donorName,
  donationFor,
  medium,
  dateIso,
  buttonLabel,
  generatingLabel,
  language = "bn",
}: DonationReceiptDownloadProps) {
  const [downloading, setDownloading] = useState(false);

  async function downloadReceipt() {
    setDownloading(true);

    try {
      const hasBanglaFont = await loadBanglaCanvasFont();
      const fontFamily = hasBanglaFont
        ? "HindSiliguriReceipt"
        : "Hind Siliguri, Noto Sans Bengali, Nirmala UI, Arial, sans-serif";

      const pageWidth = 1240;
      const pageHeight = 1754;
      const canvas = document.createElement("canvas");
      canvas.width = pageWidth;
      canvas.height = pageHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Unable to initialize receipt canvas.");
      }

      const receiptDate = new Date(dateIso);
      const dateText = new Intl.DateTimeFormat(
        language === "bn" ? "bn-BD" : "en-GB",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        },
      ).format(receiptDate);
      const amountText = new Intl.NumberFormat(
        language === "bn" ? "bn-BD" : "en-US",
      ).format(amount);

      const copy =
        language === "bn"
          ? {
              foundationName: "অভিযাত্রিক ফাউন্ডেশন",
              website: "www.ovijatrik.org",
              address: "Dinajpur, Bangladesh",
              salutation: "আপনার অমূল্য অবদানের জন্য ধন্যবাদ।",
              body: "আপনার সহযোগিতা আমাদের কল্যাণমূলক কাজকে এগিয়ে নিয়ে যেতে বড় ভূমিকা রাখে। এই রিসিটটি আপনার অনুদানের ডিজিটাল প্রমাণপত্র।",
              donor: "দাতার নাম",
              phone: "মোবাইল/ফোন",
              donationType: "অনুদানের ধরন",
              donationAmount: "অনুদানের পরিমাণ",
              donationMedium: "অনুদানের মাধ্যম",
              transactionId: "ট্রানজেকশন আইডি",
              dateAndTime: "তারিখ ও সময়",
              anonymous: "নাম প্রকাশে অনিচ্ছুক",
              verify: "স্ক্যান করে অনুদান যাচাই করুন",
              notesTitle: "NOTES",
              notes:
                "This is a system-generated document and does not require a physical signature.",
              supportTitle: "সহায়তা প্রয়োজন?",
              support: "সহায়তা: 01720803305 | support@ovijatrik.org",
            }
          : {
              foundationName: "Ovijatrik Foundation",
              website: "www.ovijatrik.org",
              address: "Dinajpur, Bangladesh",
              salutation: "Thank you for your generous contribution.",
              body: "Your support helps us continue welfare programs. This receipt serves as a digital record of your donation.",
              donor: "Donor Name",
              phone: "Mobile/Phone",
              donationType: "Donation Type",
              donationAmount: "Donation Amount",
              donationMedium: "Donation Method",
              transactionId: "Transaction ID",
              dateAndTime: "Date & Time",
              anonymous: "Anonymous",
              verify: "Scan to verify donation",
              notesTitle: "NOTES",
              notes:
                "This is a system-generated document and does not require a physical signature.",
              supportTitle: "Need help?",
              support: "Support: 01720803305 | support@ovijatrik.org",
            };

      const donorPhoneMatch = donorName.match(/(01\d{9})/);
      const donorPhone = donorPhoneMatch?.[1] ?? "-";

      const receiptPayload = [
        "https://ovijatrik.com/donation",
        encodeURIComponent(receiptId),
      ].join("/");

      const qrDataUrl = await QRCode.toDataURL(receiptPayload, {
        width: 180,
        margin: 1,
        color: {
          dark: "#1f2937",
          light: "#ffffff",
        },
      });

      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, pageWidth, pageHeight);

      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(240, 0);
      ctx.lineTo(185, 70);
      ctx.lineTo(0, 48);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#84cc16";
      ctx.beginPath();
      ctx.moveTo(260, 0);
      ctx.lineTo(600, 0);
      ctx.lineTo(500, 90);
      ctx.lineTo(200, 70);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.moveTo(610, 0);
      ctx.lineTo(780, 0);
      ctx.lineTo(705, 65);
      ctx.lineTo(560, 45);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#16a34a";
      ctx.beginPath();
      ctx.moveTo(800, 0);
      ctx.lineTo(pageWidth, 0);
      ctx.lineTo(pageWidth - 120, 110);
      ctx.lineTo(760, 50);
      ctx.closePath();
      ctx.fill();

      try {
        const logo = await loadImage("/logo.png");
        ctx.drawImage(logo, 56, 100, 150, 150);
      } catch {
        ctx.fillStyle = "#059669";
        ctx.fillRect(56, 105, 150, 150);
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold 26px ${fontFamily}`;
        ctx.fillText("OVJ", 90, 195);
      }

      ctx.fillStyle = "#111827";
      ctx.font = `700 58px ${fontFamily}`;
      ctx.fillText(copy.foundationName, 230, 165);

      ctx.fillStyle = "#065f46";
      ctx.font = `500 30px ${fontFamily}`;
      ctx.fillText(copy.website, 230, 205);

      ctx.fillStyle = "#374151";
      ctx.font = `400 28px ${fontFamily}`;
      ctx.fillText(copy.address, 230, 242);

      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(56, 272);
      ctx.lineTo(pageWidth - 56, 272);
      ctx.stroke();

      ctx.fillStyle = "#111827";
      ctx.font = `600 35px ${fontFamily}`;
      ctx.fillText(copy.salutation, 56, 345);

      ctx.fillStyle = "#374151";
      ctx.font = `400 29px ${fontFamily}`;
      const paragraphEndY = drawWrappedText(
        ctx,
        copy.body,
        56,
        392,
        pageWidth - 112,
        43,
      );

      ctx.strokeStyle = "#d1d5db";
      ctx.lineWidth = 2;

      const leftX = 56;
      const rightX = 640;
      let rowY = paragraphEndY + 52;

      function drawField(x: number, y: number, label: string, value: string) {
        ctx.fillStyle = "#1f2937";
        ctx.font = `600 30px ${fontFamily}`;
        ctx.fillText(`${label}:`, x, y);

        ctx.fillStyle = "#111827";
        ctx.font = `400 34px ${fontFamily}`;
        const contentBottom = drawWrappedText(ctx, value || "-", x, y + 48, 500, 40);
        const lineY = contentBottom + 8;

        ctx.beginPath();
        ctx.moveTo(x, lineY);
        ctx.lineTo(x + 500, lineY);
        ctx.stroke();

        return lineY;
      }

      const row1Left = drawField(
        leftX,
        rowY,
        copy.donor,
        donorName || copy.anonymous,
      );
      const row1Right = drawField(rightX, rowY, copy.phone, donorPhone);
      rowY = Math.max(row1Left, row1Right) + 42;

      const row2Left = drawField(leftX, rowY, copy.donationType, donationFor);
      const row2Right = drawField(
        rightX,
        rowY,
        copy.donationAmount,
        `${amountText} ${language === "bn" ? "টাকা" : "BDT"}`,
      );
      rowY = Math.max(row2Left, row2Right) + 42;

      const row3Left = drawField(leftX, rowY, copy.donationMedium, medium);
      const row3Right = drawField(rightX, rowY, copy.transactionId, trxid || "N/A");
      rowY = Math.max(row3Left, row3Right) + 42;

      const row4Left = drawField(leftX, rowY, copy.dateAndTime, dateText);

      const qrBoxY = Math.max(row4Left + 80, 1230);

      ctx.globalAlpha = 0.08;
      ctx.fillStyle = "#059669";
      ctx.font = `800 120px ${fontFamily}`;
      ctx.fillText("OVIJATRIK", 220, qrBoxY - 90);
      ctx.globalAlpha = 1;

      const qrImage = await loadImage(qrDataUrl);
      const qrBoxX = pageWidth / 2 - 90;
      const qrCenterX = qrBoxX + 90;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(qrBoxX - 10, qrBoxY - 10, 200, 200);
      ctx.strokeStyle = "#84cc16";
      ctx.lineWidth = 5;
      ctx.strokeRect(qrBoxX - 10, qrBoxY - 10, 200, 200);
      ctx.drawImage(qrImage, qrBoxX, qrBoxY, 180, 180);

      ctx.fillStyle = "#111827";
      ctx.font = `500 18px ${fontFamily}`;
      const captionBottomY = drawCenteredWrappedText(
        ctx,
        copy.verify,
        qrCenterX,
        qrBoxY + 220,
        420,
        26,
      );

      const publicUrl = `ovijatrik.com/donation/${receiptId}`;
      ctx.fillStyle = "#059669";
      ctx.font = `600 16px ${fontFamily}`;
      drawCenteredWrappedText(
        ctx,
        publicUrl,
        qrCenterX,
        captionBottomY + 4,
        560,
        24,
      );

      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 1620);
      ctx.lineTo(pageWidth, 1620);
      ctx.stroke();

      ctx.fillStyle = "#111827";
      ctx.font = "700 22px Inter, Arial, sans-serif";
      ctx.fillText(copy.notesTitle, 36, 1670);

      ctx.font = `400 24px ${fontFamily}`;
      drawWrappedText(ctx, copy.notes, 36, 1710, 640, 30);

      ctx.fillStyle = "#059669";
      ctx.font = `700 22px ${fontFamily}`;
      ctx.textAlign = "right";
      ctx.fillText(copy.supportTitle, pageWidth - 36, 1670);
      ctx.font = `600 24px ${fontFamily}`;
      const supportParts = copy.support.split("|").map((part) => part.trim());
      supportParts.forEach((line, index) => {
        ctx.fillText(line, pageWidth - 36, 1710 + index * 30);
      });
      ctx.textAlign = "left";

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const imageData = canvas.toDataURL("image/png", 1);
      doc.addImage(imageData, "PNG", 0, 0, 210, 297);
      doc.save(`donation-receipt-${receiptId}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={downloadReceipt}
      disabled={downloading}
      className="inline-flex items-center justify-center rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {downloading ? generatingLabel : buttonLabel}
    </button>
  );
}
