"use client";

import { useState, useCallback } from "react";

function extractFileId(url: string): string | null {
  const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/);
  return match ? match[1] : null;
}

function isValidGdriveUrl(url: string): boolean {
  return url.includes("drive.google.com");
}

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(() => {
    setError("");
    setCopied(false);

    if (!inputUrl.trim()) {
      setError("Please enter a Google Drive URL");
      return;
    }

    if (!isValidGdriveUrl(inputUrl)) {
      setError("Please enter a valid Google Drive URL");
      return;
    }

    const fileId = extractFileId(inputUrl);
    if (!fileId) {
      setError("Could not extract file ID from URL");
      return;
    }

    setOutputUrl(`https://drive.google.com/uc?export=download&id=${fileId}`);
  }, [inputUrl]);

  const handleOutputClick = useCallback(async () => {
    if (!outputUrl) return;
    await navigator.clipboard.writeText(outputUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [outputUrl]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleConvert();
      }
    },
    [handleConvert]
  );

  return (
    <main className="min-h-screen bg-neutral-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-neutral-100 mb-2 text-center">
          GDrive Direct Link Generator
        </h1>
        <p className="text-neutral-400 text-sm mb-8 text-center">
          Convert Google Drive sharing links to direct download URLs
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Google Drive URL
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            onClick={handleConvert}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Convert
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {outputUrl && (
            <div className="mt-6">
              <label className="block text-sm text-neutral-400 mb-2">
                Direct Download Link {copied && <span className="text-green-400">(Copied!)</span>}
              </label>
              <input
                type="text"
                value={outputUrl}
                readOnly
                onClick={handleOutputClick}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none cursor-pointer hover:border-blue-500 transition-colors"
              />
            </div>
          )}

          <div className="mt-6 p-4 bg-amber-900/20 border border-amber-700/50 rounded-lg">
            <p className="text-amber-400 text-sm">
              Make sure the file is set to{" "}
              <span className="font-medium">&quot;Anyone with the link&quot;</span> in
              Google Drive before downloading.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
