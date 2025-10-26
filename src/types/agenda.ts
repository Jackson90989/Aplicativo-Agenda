
export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'personal' | 'work' | 'health' | 'other';
  status: 'pending' | 'completed' | 'cancelled';
}

export type AppointmentType = 'personal' | 'work' | 'health' | 'other';
export type AppointmentStatus = 'pending' | 'completed' | 'cancelled';