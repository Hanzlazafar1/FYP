import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { AnalysisResults } from "@/types";

export async function exportDashboardPDF(
  elementId: string,
  fileName = "speech-analysis-report"
): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) return;

  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#0f172a",
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width / 2, canvas.height / 2],
  });

  pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save(`${fileName}-${Date.now()}.pdf`);
}

export function exportResultsJSON(
  results: AnalysisResults,
  transcript: string,
  fileName = "speech-analysis"
): void {
  const blob = new Blob(
    [JSON.stringify({ transcript, results }, null, 2)],
    { type: "application/json" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
