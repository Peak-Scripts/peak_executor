import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchNui } from "../utils/fetchNui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeOutput } from "./CodeOutput";
import { debugData } from "../utils/debugData";
import Editor from "@monaco-editor/react";
import { useVisibility } from "../providers/VisibilityProvider";
import { Terminal, Play } from "lucide-react";

debugData([
  {
    action: 'setVisible',
    data: true,
  },
]);

interface CodeState {
  code: string;
  output: string;
  outputType: 'success' | 'error';
  showOutput: boolean;
}

const App: React.FC = () => {
  const { visible } = useVisibility();
  const [codeState, setCodeState] = useState<CodeState>({
    code: "",
    output: "",
    outputType: 'success',
    showOutput: false
  });

  useEffect(() => {
    const preventBackspace = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        const target = e.target as HTMLElement;
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
        
        if (!isInput) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    window.addEventListener('keydown', preventBackspace, true);
    return () => window.removeEventListener('keydown', preventBackspace, true);
  }, []);

  const executeCode = async () => {
    if (!codeState.code.trim()) {
      setCodeState(prev => ({
        ...prev,
        output: "Please enter some code to execute",
        outputType: 'error',
        showOutput: true
      }));
      return;
    }

    try {
      const response = await fetchNui<{ success: boolean; output: string }>("executeCode", {
        code: codeState.code
      });
      
      setCodeState(prev => ({
        ...prev,
        output: response.output || "Code executed successfully",
        outputType: response.success ? 'success' : 'error',
        showOutput: true
      }));
    } catch (e) {
      console.error(e);
      setCodeState(prev => ({
        ...prev,
        output: "Failed to execute code. Check F8 console.",
        outputType: 'error',
        showOutput: true
      }));
    }
  };

  if (!visible) return null;

  return (
    <div style={{ background: 'none' }} className="nui-wrapper flex items-center justify-center">
      <Card className="w-[900px] h-[650px] rounded-xl border-zinc-700 bg-zinc-900">
        <CardHeader className="bg-zinc-800 rounded-t-xl border-b border-zinc-700/50 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-zinc-900">
                <Terminal className="w-5 h-5 text-zinc-400" />
              </div>
              <CardTitle className="text-zinc-100 tracking-tight">Code Executor</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 flex flex-col flex-1 h-[calc(100%-80px)] rounded-lg">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary" 
                onClick={executeCode}
                className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700/50 px-6 
                         transition-all duration-200 hover:shadow-lg hover:border-zinc-600 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Execute
              </Button>
            </div>
            
            <div className="relative flex-1">
              <div className="absolute inset-0 rounded-xl border border-zinc-700/50 bg-zinc-800 overflow-hidden">
                <Editor
                  className="rounded-xl"
                  height="330px"
                  defaultLanguage="lua"
                  theme="vs-dark"
                  value={codeState.code}
                  onChange={(value) => setCodeState(prev => ({ ...prev, code: value || "" }))}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    lineNumbersMinChars: 4,
                    padding: { top: 8, bottom: 8 },
                    lineDecorationsWidth: 10,
                    scrollbar: {
                      vertical: 'visible',
                      horizontal: 'visible',
                      verticalScrollbarSize: 8,
                      horizontalScrollbarSize: 8,
                      useShadows: false
                    },
                    overviewRulerLanes: 0,
                    overviewRulerBorder: false,
                    glyphMargin: false,
                    folding: false,
                  }}
                />
              </div>
            </div>

            <div className="h-[120px]">
              <CodeOutput 
                output={codeState.output}
                type={codeState.outputType}
                show={codeState.showOutput}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;