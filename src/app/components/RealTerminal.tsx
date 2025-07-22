import { useState, useEffect, useRef } from "react";

interface RealTerminalProps {
  theme: any;
  fontSize: string;
  isVisible: boolean;
  onToggle: () => void;
  onOutputChange: (output: string[]) => void;
}

const RealTerminal = ({ theme, fontSize, isVisible, onToggle, onOutputChange }: RealTerminalProps) => {
  const [output, setOutput] = useState<string[]>(["Connecting to terminal..."]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [currentPath, setCurrentPath] = useState("~");
  const wsRef = useRef<WebSocket | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!isVisible) return;

    const connectWebSocket = () => {
      try {
        // First, initialize the WebSocket server
        fetch("/api/terminal")
          .then(() => {
            // Connect to WebSocket
            wsRef.current = new WebSocket("ws://localhost:3001");

            wsRef.current.onopen = () => {
              setIsConnected(true);
              const initialOutput = ["Terminal connected. Real Node.js environment ready."];
              setOutput(initialOutput);
              onOutputChange(initialOutput);
            };

            wsRef.current.onmessage = (event) => {
              try {
                const { type, data } = JSON.parse(event.data);

                if (type === "clear") {
                  setOutput([]);
                  return;
                }

                if (type === "output" || type === "error") {
                  setOutput((prev) => {
                    const lines = data.split("\n").filter((line: string) => line !== "");
                    const newOutput = [...prev, ...lines];
                    onOutputChange(newOutput);
                    return newOutput;
                  });
                }
              } catch (error) {
                console.error("Error parsing WebSocket message:", error);
              }
            };

            wsRef.current.onclose = () => {
              setIsConnected(false);
              setOutput((prev) => [...prev, "Connection closed. Attempting to reconnect..."]);

              // Attempt to reconnect after 3 seconds
              setTimeout(connectWebSocket, 3000);
            };

            wsRef.current.onerror = (error) => {
              console.error("WebSocket error:", error);
              setOutput((prev) => [...prev, "Connection error. Check if server is running."]);
            };
          })
          .catch(() => {
            setOutput((prev) => [...prev, "Failed to initialize WebSocket server."]);
          });
      } catch (error) {
        console.error("Connection error:", error);
        setOutput((prev) => [...prev, "Failed to connect to terminal."]);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isVisible]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input when terminal becomes visible
  useEffect(() => {
    if (isVisible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !wsRef.current || !isConnected) return;

    // Add command to output
    const commandOutput = `${currentPath}$ ${input}`;
    setOutput((prev) => {
      const newOutput = [...prev, commandOutput];
      onOutputChange(newOutput);
      return newOutput;
    });

    // Send command to WebSocket server
    wsRef.current.send(
      JSON.stringify({
        type: "command",
        data: input,
      })
    );

    setInput("");
  };

  const executeQuickCommand = (command: string) => {
    if (!wsRef.current || !isConnected) return;

    const commandOutput = `${currentPath}$ ${command}`;
    setOutput((prev) => {
      const newOutput = [...prev, commandOutput];
      onOutputChange(newOutput);
      return newOutput;
    });

    wsRef.current.send(
      JSON.stringify({
        type: "command",
        data: command,
      })
    );
  };

  if (!isVisible) return null;

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Real Terminal Header */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-600">
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
          <span className="text-gray-400 text-sm font-mono">Real Terminal {isConnected ? "(Connected)" : "(Disconnected)"}</span>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="px-4 py-2 bg-gray-800 border-b border-gray-600">
        <div className="flex flex-wrap gap-2">
          {["ls -la", "pwd", "whoami", "profile", "help", "node --version"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeQuickCommand(cmd)}
              className={`px-2 py-1 text-xs rounded ${theme.border} border ${theme.text} hover:${theme.primary} transition-colors`}
              disabled={!isConnected}
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Output - Minimized display */}
      <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <div className={`text-${fontSize} ${theme.text} font-mono mb-4`}>Terminal output is displayed on the left side →</div>
        {output.slice(-3).map((line, index) => (
          <div
            key={index}
            className={`text-xs leading-relaxed font-mono ${
              line.includes("$") ? theme.primary : line.includes("error") || line.includes("Error") ? "text-red-400" : "text-gray-500"
            }`}
          >
            {line.length > 50 ? line.substring(0, 50) + "..." : line}
          </div>
        ))}
      </div>

      {/* Command Input */}
      <div className="p-4 border-t border-gray-600">
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className={`text-${fontSize} ${theme.primary} font-mono`}>{currentPath}$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`bg-transparent outline-none flex-1 ml-2 ${theme.primary} text-${fontSize} font-mono`}
            placeholder={isConnected ? "Enter command (try: ls, pwd, node -v)" : "Connecting..."}
            disabled={!isConnected}
          />
        </form>

        {!isConnected && <div className="mt-2 text-xs text-gray-500">Tip: Make sure your Next.js dev server is running for WebSocket connection</div>}
      </div>
    </div>
  );
};

export default RealTerminal;
