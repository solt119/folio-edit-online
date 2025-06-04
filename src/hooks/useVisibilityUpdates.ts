
import { useCallback } from 'react';
import { FieldVisibility } from '@/types/visibility';

interface UseVisibilityUpdatesProps {
  fieldVisibility: FieldVisibility;
  setFieldVisibility: (visibility: FieldVisibility) => Promise<void>;
}

export const useVisibilityUpdates = ({
  fieldVisibility,
  setFieldVisibility
}: UseVisibilityUpdatesProps) => {
  
  const updateFieldVisibility = useCallback(async (
    section: keyof FieldVisibility,
    field: string,
    visible: boolean
  ) => {
    const updatedVisibility = {
      ...fieldVisibility,
      [section]: {
        ...fieldVisibility[section],
        [field]: visible
      }
    };
    
    console.log('Updating visibility:', { section, field, visible, updatedVisibility });
    await setFieldVisibility(updatedVisibility);
  }, [fieldVisibility, setFieldVisibility]);

  return {
    updateFieldVisibility
  };
};
