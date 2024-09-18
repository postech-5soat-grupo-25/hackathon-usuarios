import { z } from 'zod';

export const CrmSchema = z.string().refine((value) => {
  const crm = value.replace(/[^\d]+/g, '');
  if (crm.length !== 7) {
    return false;
  }

  return true;
});