import { getAuth } from "firebase/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:8080";

const getAuthHeaders = async (): Promise<HeadersInit> => {
  if (typeof window === "undefined") return {};

  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return {};

  const token = await user.getIdToken();
  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
};

function parseFilename(contentDisposition: string | null, fallback: string) {
  if (!contentDisposition) return fallback;
  const m = /filename="([^"]+)"/i.exec(contentDisposition);
  return m?.[1] ?? fallback;
}

// Fetch work order PDF as Blob
export async function fetchWorkOrderPdf(id: string): Promise<{ blob: Blob; filename: string }> {
  const res = await fetch(`${API_BASE}/workorders/${encodeURIComponent(id)}/pdf`, {
    method: "GET",
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /workorders/${id}/pdf failed: ${res.status} ${text}`);
  }

  const blob = await res.blob();
  const filename = parseFilename(res.headers.get("content-disposition"), `workorder-${id}.pdf`);
  return { blob, filename };
}
// trigger browser download
export async function downloadWorkOrderPdf(id: string) {
  const { blob, filename } = await fetchWorkOrderPdf(id);

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
// POST /workorders/{id}/email-report
export async function sendWorkOrderReportEmail(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/workorders/${encodeURIComponent(id)}/email-report`, {
    method: "POST",
    headers: await getAuthHeaders(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST /workorders/${id}/email-report failed: ${res.status} ${text}`);
  }

  return res.json().catch(() => ({ message: "sent" }));
}
