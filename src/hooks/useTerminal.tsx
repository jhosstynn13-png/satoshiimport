import { useState, useCallback, createContext, useContext, ReactNode } from 'react';

export type LogType = 'success' | 'error' | 'info' | 'warn' | 'process';

export interface TerminalLog {
  id: string;
  timestamp: string;
  type: LogType;
  message: string;
}

interface TerminalContextType {
  logs: TerminalLog[];
  addLog: (message: string, type?: LogType) => void;
  clearLogs: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<TerminalLog[]>([]);

  const addLog = useCallback((message: string, type: LogType = 'info') => {
    const newLog: TerminalLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
    
    // Auto remove logic optionally? No, let's keep it for persistence in session
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  return (
    <TerminalContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    return {
      logs: [],
      addLog: () => {},
      clearLogs: () => {}
    };
  }
  return context;
}
