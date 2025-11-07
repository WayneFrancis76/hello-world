// Together We Ride - useImpact Hook
// Hook for accessing impact context

import { useContext } from 'react';
import ImpactContext from '../contexts/ImpactContext';

export const useImpact = () => {
  const context = useContext(ImpactContext);

  if (!context) {
    throw new Error('useImpact must be used within an ImpactProvider');
  }

  return context;
};

export default useImpact;
