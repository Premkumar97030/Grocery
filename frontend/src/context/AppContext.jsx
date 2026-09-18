import { createContext, useContext, useMemo, useState } from 'react';
const AppContext = createContext(null);
export function AppProvider({ children }) { const [apiStatus, setApiStatus] = useState('checking'); const value = useMemo(() => ({ apiStatus, setApiStatus }), [apiStatus]); return <AppContext.Provider value={value}>{children}</AppContext.Provider>; }
export const useApp = () => useContext(AppContext);
