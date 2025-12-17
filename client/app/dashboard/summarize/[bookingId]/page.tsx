"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useToast } from "../../../../context/ToastContext";
import Button from "../../../../components/ui/Button";
import PageHeader from "../../../../components/ui/PageHeader";

export default function SummarizePage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (inputText.trim().length < 50) {
      showToast("Please enter at least 50 characters to summarize.", "error");
      return;
    }
    setIsLoading(true);
    setSummary("");

    try {
      const config = {
        headers: { Authorization: `Bearer ${session!.user.token}` },
      };
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/summarize`,
        { text: inputText },
        config
      );
      setSummary(data.summary);
      showToast("Summary generated successfully!", "success");
    } catch (error) {
      showToast("Failed to generate summary.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="AI Session Summarizer"
          description="Paste your notes to get a concise summary and actionable next steps."
        />
        <div className="mt-8">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={15}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Paste your chat log or session notes here..."
          />
        </div>

        <div className="mt-4">
          <Button onClick={handleSummarize} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Summary"}
          </Button>
        </div>

        {summary && (
          <div className="mt-10 bg-white p-6 rounded-xl shadow border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-700">
              Your Summary
            </h2>
            <div className="prose prose-sky mt-4 max-w-none">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
