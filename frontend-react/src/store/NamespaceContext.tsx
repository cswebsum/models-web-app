import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NamespaceContextType {
  selectedNamespace: string;
  setSelectedNamespace: (namespace: string) => void;
}

// Defaulting to 'kubeflow-user', but this will be updated by the provider.
const NamespaceContext = createContext<NamespaceContextType | undefined>(undefined);

export const NamespaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Set a default namespace. In a real app, this might be fetched or come from user preferences.
  const [selectedNamespace, setSelectedNamespace] = useState<string>('kubeflow-user');

  const value = { selectedNamespace, setSelectedNamespace };

  return (
    <NamespaceContext.Provider value={value}>
      {children}
    </NamespaceContext.Provider>
  );
};

export const useNamespace = (): NamespaceContextType => {
  const context = useContext(NamespaceContext);
  if (context === undefined) {
    throw new Error('useNamespace must be used within a NamespaceProvider');
  }
  return context;
};
