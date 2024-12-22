import React from 'react';
import { Check, X } from 'lucide-react';

interface DiffViewerProps {
  original: string;
  feedback: string;
  rewrite: string;
  onAcceptRewrite: () => void;
}

export default function DiffViewer({ original, feedback, rewrite, onAcceptRewrite }: DiffViewerProps) {
  const feedbackPoints = feedback.split('\n').filter(line => line.trim().length > 0);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">AI Feedback</h3>
        <div className="space-y-3">
          {feedbackPoints.map((point, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800">{point}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Complete Rewrite</h3>
          <button
            onClick={onAcceptRewrite}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            Accept Rewrite
          </button>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <pre className="whitespace-pre-wrap text-green-800 font-sans">{rewrite}</pre>
        </div>
      </div>
    </div>
  );
}