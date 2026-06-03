"use client";

import { useState } from "react";

import AppLayout from "@/components/layout/app-layout";

import api from "@/services/api";

import { toast } from "sonner";

export default function AssistantPage() {
  const [prompt, setPrompt] = useState("");

  const [response, setResponse] = useState("");

  const [loading, setLoading] = useState(false);

  const askAssistant = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);

      const result = await api.post("/ai/assistant", {
        prompt,
      });

      setResponse(result.data.response);
      toast.success(
        "Response generated successfully",
      );
    } catch {
      toast.error("Failed to query assistant");
    } finally {
      setLoading(false);
    }
  };

  const runQuickAction = async (action: string) => {
    setPrompt(action);

    try {
      setLoading(true);

      const result = await api.post("/ai/assistant", {
        prompt: action,
      });

      setResponse(result.data.response);
      toast.success(
        "AI insights generated",
      );
    } catch {
      toast.error("Failed to run action");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">AI CRM Assistant</h1>

          <p className="text-gray-500 mt-2">
            Ask questions about your CRM and sales workflow.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask your CRM assistant..."
            className="w-full h-40 bg-gray-50 border border-gray-100 rounded-2xl p-4 resize-none outline-none focus:ring-2 focus:ring-black/10 transition"
          />

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => runQuickAction("Summarize my sales pipeline")}
              className="border border-gray-100 bg-gray-50 px-4 py-2 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              Pipeline Summary
            </button>

            <button
              onClick={() =>
                runQuickAction("Which leads need urgent follow-up?")
              }
              className="border border-gray-100 bg-gray-50 px-4 py-2 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              Priority Leads
            </button>

            <button
              onClick={() =>
                runQuickAction(
                  "Give sales strategy advice based on current CRM data",
                )
              }
              className="border border-gray-100 bg-gray-50 px-4 py-2 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              Sales Advice
            </button>

            <button
              onClick={() =>
                runQuickAction("Analyze risks in my current pipeline")
              }
              className="border border-gray-100 bg-gray-50 px-4 py-2 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              Pipeline Risks
            </button>
          </div>

          <button
            onClick={askAssistant}
            disabled={loading}
            className="mt-4 bg-[#111827] hover:bg-[#1f2937] text-white px-6 py-3 rounded-2xl shadow-sm hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask Assistant"}
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 mt-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Response</h2>

          {response ? (
            <div className="whitespace-pre-wrap text-gray-700 leading-7">{response}</div>
          ) : (
            <p className="text-gray-500">
  Ask the assistant about lead prioritization,
  sales strategy, pipeline analysis, or follow-up
  recommendations.
</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
