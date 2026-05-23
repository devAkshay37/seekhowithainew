import type { Profile } from '@/types';

export const defaultProfile: Profile = {
  id: '',
  full_name: '',
  board: 'CBSE',
  classes: ['6', '7', '8'],
  subjects: ['Science', 'Maths'],
  language_preference: 'English',
  onboarding_complete: false,
  created_at: '',
};
