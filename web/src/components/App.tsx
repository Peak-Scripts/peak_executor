import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchNui } from "../utils/fetchNui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeOutput } from "./CodeOutput";
import { debugData } from "../utils/debugData";
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-lua';
import { useVisibility } from "../providers/VisibilityProvider";

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
    <div className="nui-wrapper">
      <Card className="w-[900px] h-[650px] rounded-xl border-zinc-700 bg-zinc-900">
        <CardHeader className="bg-zinc-800 rounded-lg border-b border-zinc-700">
          <CardTitle className="text-white">Code Executor</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col flex-1 h-[calc(100%-80px)] rounded-lg">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary" 
                onClick={executeCode}
                className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
              >
                Execute
              </Button>
            </div>
            
            <div className="relative flex-1">
              <ScrollArea className="absolute inset-0 rounded-lg border border-zinc-700">
                <div className="h-[395px] overflow-x-auto bg-zinc-800">
                  <Editor
                    value={codeState.code}
                    onValueChange={code => setCodeState(prev => ({ ...prev, code }))}
                    highlight={code => Prism.highlight(code, Prism.languages.lua, 'lua')}
                    padding={16}
                    style={{
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: '14px',
                      color: '#fff',
                      whiteSpace: 'pre',
                      minWidth: '100%'
                    }}
                    textareaClassName="focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace') {
                        e.stopPropagation();
                      }
                    }}
                  />
                </div>
              </ScrollArea>
            </div>

            <div className="h-[60px]">
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
