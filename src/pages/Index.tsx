import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import { extractTranscript, analyzeTranscript, ExtractResponse, AnalyzeResponse } from "@/lib/api";

const Index = () => {
  const [extractData, setExtractData] = useState<ExtractResponse | null>(null);
  const [analyzeData, setAnalyzeData] = useState<AnalyzeResponse | null>(null);

  const extractMutation = useMutation({
    mutationFn: extractTranscript,
    onSuccess: (data) => {
      setExtractData(data);
      analyzeMutation.mutate(data.transcript);
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: analyzeTranscript,
    onSuccess: (data) => setAnalyzeData(data),
  });

  const handleSubmit = (url: string) => {
    setExtractData(null);
    setAnalyzeData(null);
    extractMutation.mutate(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {!extractData ? (
        <Hero onSubmit={handleSubmit} isLoading={extractMutation.isPending} />
      ) : (
        <Dashboard
          extractData={extractData}
          analyzeData={analyzeData}
          isAnalyzing={analyzeMutation.isPending}
        />
      )}
    </div>
  );
};

export default Index;
