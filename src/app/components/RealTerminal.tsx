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
    console.log("🔧 RealTerminal: useEffect triggered, isVisible:", isVisible);
    if (!isVisible) return;

    const connectWebSocket = () => {
      console.log("🔌 RealTerminal: Attempting to connect WebSocket...");
      try {
        // First, initialize the WebSocket server
        console.log("📡 RealTerminal: Fetching /api/terminal...");
        fetch("/api/terminal")
          .then((response) => {
            console.log("📡 RealTerminal: /api/terminal response:", response.status, response.statusText);
            if (!response.ok) {
              throw new Error(`API responded with status: ${response.status}`);
            }
            // Connect to WebSocket
            console.log("🔌 RealTerminal: Creating WebSocket connection to ws://localhost:3001");
            wsRef.current = new WebSocket("ws://localhost:3001");

            wsRef.current.onopen = () => {
              console.log("✅ RealTerminal: WebSocket connection established!");
              setIsConnected(true);
            };

            wsRef.current.onmessage = (event) => {
              console.log("📨 RealTerminal: WebSocket message received:", event.data);
              try {
                const { type, data } = JSON.parse(event.data);
                console.log("📨 RealTerminal: Parsed message - type:", type, "data:", data);

                if (type === "clear") {
                  console.log("🧹 RealTerminal: Clearing terminal output");
                  setOutput([]);
                  return;
                }

                if (type === "output" || type === "error") {
                  const lines = data.split("\n").filter((line: string) => line !== "");
                  console.log("📝 RealTerminal: Adding lines to output:", lines);
                  setOutput((prev) => [...prev, ...lines]);
                }
              } catch (error) {
                console.error("❌ RealTerminal: Error parsing WebSocket message:", error);
              }
            };

            wsRef.current.onclose = () => {
              console.log("🔌 RealTerminal: WebSocket connection closed");
              setIsConnected(false);
              setOutput((prev) => [...prev, "Connection closed. Attempting to reconnect..."]);

              // Attempt to reconnect after 3 seconds
              console.log("🔄 RealTerminal: Scheduling reconnection in 3 seconds...");
              setTimeout(connectWebSocket, 3000);
            };

            wsRef.current.onerror = (error) => {
              console.error("❌ RealTerminal: WebSocket error:", error);
              setOutput((prev) => [...prev, "Connection error. Check if server is running."]);
            };
          })
          .catch((error) => {
            console.error("❌ RealTerminal: Failed to initialize WebSocket server:", error);
            setOutput((prev) => [...prev, "Failed to initialize WebSocket server."]);
          });
      } catch (error) {
        console.error("❌ RealTerminal: Connection error:", error);
        setOutput((prev) => [...prev, "Failed to connect to terminal."]);
      }
    };

    connectWebSocket();

    return () => {
      console.log("🧹 RealTerminal: Cleaning up WebSocket connection");
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isVisible]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      console.log("📜 RealTerminal: Auto-scrolling terminal to bottom");
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input when terminal becomes visible
  useEffect(() => {
    console.log("🎯 RealTerminal: Focus effect triggered, isVisible:", isVisible);
    if (isVisible && inputRef.current) {
      setTimeout(() => {
        console.log("🎯 RealTerminal: Focusing input field");
        inputRef.current?.focus();
      }, 300);
    }
  }, [isVisible]);

  // Refactor to avoid state updates during render
  useEffect(() => {
    if (isConnected) {
      const initialOutput = ["Terminal connected. Real Node.js environment ready."];
      setOutput(initialOutput);
      onOutputChange(initialOutput);
    }
  }, [isConnected]);

  useEffect(() => {
    if (output.length > 0) {
      onOutputChange(output);
    }
  }, [output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("⌨️ RealTerminal: Form submitted with input:", input);

    if (!input.trim() || !wsRef.current || !isConnected) {
      console.log("⚠️ RealTerminal: Command rejected - input:", input.trim(), "wsRef:", !!wsRef.current, "isConnected:", isConnected);
      return;
    }

    // Add command to output
    const commandOutput = `${currentPath}$ ${input}`;
    console.log("📝 RealTerminal: Adding command to output:", commandOutput);
    setOutput((prev) => [...prev, commandOutput]);

    // Send command to WebSocket server
    const message = JSON.stringify({
      type: "command",
      data: input,
    });
    console.log("📤 RealTerminal: Sending command to WebSocket:", message);
    wsRef.current.send(message);

    setInput("");
  };

  const executeQuickCommand = (command: string) => {
    console.log("🚀 RealTerminal: Executing quick command:", command);
    if (!wsRef.current || !isConnected) {
      console.log("⚠️ RealTerminal: Quick command rejected - wsRef:", !!wsRef.current, "isConnected:", isConnected);
      return;
    }

    const commandOutput = `${currentPath}$ ${command}`;
    console.log("📝 RealTerminal: Adding quick command to output:", commandOutput);
    setOutput((prev) => [...prev, commandOutput]);

    const message = JSON.stringify({
      type: "command",
      data: command,
    });
    console.log("📤 RealTerminal: Sending quick command to WebSocket:", message);
    wsRef.current.send(message);
  };

  if (!isVisible) {
    console.log("👁️ RealTerminal: Component not visible, returning null");
    return null;
  }

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
          {["whoami", "profile", "projects", "help"].map((cmd) => (
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
            placeholder={isConnected ? "Enter command (try: whoami, profile, projects)" : "Connecting..."}
            disabled={!isConnected}
          />
        </form>

        {!isConnected && <div className="mt-2 text-xs text-gray-500">Tip: Make sure your Next.js dev server is running for WebSocket connection</div>}
      </div>
    </div>
  );
};

export default RealTerminal;
