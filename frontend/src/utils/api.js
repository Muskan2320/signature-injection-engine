const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function signPdf(payload) {
  const response = await fetch(`${BACKEND_URL}/api/sign-pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to sign PDF");
  }

  return response.json();
}
