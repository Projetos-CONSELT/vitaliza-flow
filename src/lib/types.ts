export type UserRole = "recepcionista" | "fisioterapeuta" | "gestor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  createdAt: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  workingHours: { start: string; end: string };
  color: string; // tailwind class hint
}

export interface Service {
  id: string;
  name: string;
  durationMin: number;
  price?: number;
}

export type AppointmentStatus = "confirmado" | "pendente" | "cancelado" | "falta" | "realizado";

export interface Appointment {
  id: string;
  patientId: string;
  serviceId: string;
  professionalId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  status: AppointmentStatus;
}
