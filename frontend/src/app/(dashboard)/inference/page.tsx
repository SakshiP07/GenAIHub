"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateInference } from "@/lib/api";

export default function InferencePage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const data = await generateInference(prompt);
      setResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout title="AI Prompt Service">
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter a prompt and get a response.
        </p>

        <Card className="rounded-lg shadow-none">
          <CardHeader>
            <CardTitle>Enter Your Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your question here..."
              className="resize-none"
            />
            <Button
              type="button"
              size="lg"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
            >
              {loading ? "Please wait..." : "Generate Response"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-none">
          <CardHeader>
            <CardTitle>Generated Response</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[120px]">
            {loading && (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}
            {!loading && error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {!loading && !error && response && (
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {response}
              </p>
            )}
            {!loading && !error && !response && (
              <p className="text-sm text-muted-foreground">
                Response will show here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
