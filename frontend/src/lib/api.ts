export interface InferenceResponse {
  response: string;
}

export async function generateInference(
  prompt: string
): Promise<InferenceResponse> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      typeof data?.error === "string"
        ? data.error
        : data?.error?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  if (!data?.response) {
    throw new Error("Backend returned an empty response");
  }

  return data as InferenceResponse;
}
