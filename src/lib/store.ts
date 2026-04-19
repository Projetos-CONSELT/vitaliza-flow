import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Appointment,
  AppointmentStatus,
  Patient,
  Professional,
  Service,
  User,
  UserRole,
} from "./types";
import { addDays, format } from "date-fns";

const today = new Date();
const d = (offset: number) => format(addDays(today, offset), "yyyy-MM-dd");

const seedProfessionals: Professional[] = [
  { id: "p1", name: "Dra. Juliana Costa", specialty: "Fisioterapia Ortopédica", workingHours: { start: "08:00", end: "18:00" }, color: "primary" },
  { id: "p2", name: "Dr. Rafael Lima", specialty: "Reabilitação Pós-cirúrgica", workingHours: { start: "08:00", end: "18:00" }, color: "secondary" },
  { id: "p3", name: "Dra. Camila Rocha", specialty: "RPG e Pilates Clínico", workingHours: { start: "09:00", end: "19:00" }, color: "warning" },
  { id: "p4", name: "Dr. Bruno Martins", specialty: "Fisioterapia Esportiva", workingHours: { start: "07:00", end: "17:00" }, color: "success" },
];

const seedServices: Service[] = [
  { id: "s1", name: "Fisioterapia Ortopédica", durationMin: 50, price: 150 },
  { id: "s2", name: "Fisioterapia Esportiva", durationMin: 50, price: 160 },
  { id: "s3", name: "Reabilitação Pós-cirúrgica", durationMin: 60, price: 180 },
  { id: "s4", name: "Pilates Clínico", durationMin: 50, price: 140 },
  { id: "s5", name: "RPG (Reeducação Postural Global)", durationMin: 60, price: 170 },
  { id: "s6", name: "Atendimento Domiciliar", durationMin: 60, price: 220 },
];

const seedPatients: Patient[] = [
  { id: "pt1", name: "Ana Paula Souza", phone: "(34) 98856-1234", notes: "Hérnia de disco lombar", createdAt: d(-90) },
  { id: "pt2", name: "Carlos Mendes", phone: "(34) 99777-4321", notes: "Pós-cirúrgico de joelho", createdAt: d(-60) },
  { id: "pt3", name: "Maria Fernanda Lima", phone: "(34) 99888-7654", notes: "Pilates por dor lombar crônica", createdAt: d(-50) },
  { id: "pt4", name: "João Pedro Alves", phone: "(34) 99666-1111", notes: "Atleta amador, lesão de ombro", createdAt: d(-40) },
  { id: "pt5", name: "Beatriz Andrade", phone: "(34) 99933-2222", notes: "Postura e cervicalgia", createdAt: d(-30) },
  { id: "pt6", name: "Pedro Henrique", phone: "(34) 99111-3333", notes: "", createdAt: d(-20) },
  { id: "pt7", name: "Fernanda Lopes", phone: "(34) 99222-4444", notes: "Tendinite no punho", createdAt: d(-10) },
  { id: "pt8", name: "Rafaela Pinto", phone: "(34) 99333-5555", notes: "", createdAt: d(-5) },
];

const seedAppointments: Appointment[] = [
  { id: "a1", patientId: "pt1", serviceId: "s1", professionalId: "p1", date: d(0), time: "08:00", status: "confirmado" },
  { id: "a2", patientId: "pt2", serviceId: "s3", professionalId: "p2", date: d(0), time: "09:00", status: "confirmado" },
  { id: "a3", patientId: "pt3", serviceId: "s4", professionalId: "p1", date: d(0), time: "10:00", status: "confirmado" },
  { id: "a4", patientId: "pt4", serviceId: "s2", professionalId: "p4", date: d(0), time: "11:00", status: "confirmado" },
  { id: "a5", patientId: "pt5", serviceId: "s5", professionalId: "p3", date: d(0), time: "14:00", status: "confirmado" },
  { id: "a6", patientId: "pt6", serviceId: "s1", professionalId: "p1", date: d(0), time: "15:00", status: "pendente" },
  { id: "a7", patientId: "pt7", serviceId: "s4", professionalId: "p3", date: d(1), time: "09:00", status: "confirmado" },
  { id: "a8", patientId: "pt8", serviceId: "s2", professionalId: "p4", date: d(1), time: "10:00", status: "confirmado" },
  { id: "a9", patientId: "pt1", serviceId: "s1", professionalId: "p1", date: d(2), time: "08:00", status: "confirmado" },
  { id: "a10", patientId: "pt2", serviceId: "s3", professionalId: "p2", date: d(3), time: "11:00", status: "confirmado" },
  { id: "a11", patientId: "pt3", serviceId: "s4", professionalId: "p1", date: d(-1), time: "10:00", status: "realizado" },
  { id: "a12", patientId: "pt4", serviceId: "s2", professionalId: "p4", date: d(-1), time: "14:00", status: "falta" },
  { id: "a13", patientId: "pt5", serviceId: "s5", professionalId: "p3", date: d(-2), time: "09:00", status: "realizado" },
  { id: "a14", patientId: "pt6", serviceId: "s1", professionalId: "p1", date: d(-3), time: "15:00", status: "realizado" },
  { id: "a15", patientId: "pt7", serviceId: "s4", professionalId: "p3", date: d(-4), time: "11:00", status: "realizado" },
];

const seedUsers: User[] = [
  { id: "u1", name: "Mariana Silva", email: "mariana@vitaliza.com", role: "recepcionista" },
  { id: "u2", name: "Dra. Juliana Costa", email: "juliana@vitaliza.com", role: "fisioterapeuta" },
  { id: "u3", name: "Roberto Almeida", email: "roberto@vitaliza.com", role: "gestor" },
];

interface ClinicSettings {
  openingTime: string;
  closingTime: string;
  slotMinutes: number;
  clinicName: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  patients: Patient[];
  professionals: Professional[];
  services: Service[];
  appointments: Appointment[];
  settings: ClinicSettings;

  login: (role: UserRole) => void;
  logout: () => void;

  addPatient: (p: Omit<Patient, "id" | "createdAt">) => Patient;
  updatePatient: (id: string, patch: Partial<Patient>) => void;
  removePatient: (id: string) => void;

  addProfessional: (p: Omit<Professional, "id">) => void;
  updateProfessional: (id: string, patch: Partial<Professional>) => void;
  removeProfessional: (id: string) => void;

  addService: (s: Omit<Service, "id">) => void;
  updateService: (id: string, patch: Partial<Service>) => void;
  removeService: (id: string) => void;

  addAppointment: (a: Omit<Appointment, "id" | "status"> & { status?: AppointmentStatus }) => Appointment;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  removeAppointment: (id: string) => void;

  updateSettings: (patch: Partial<ClinicSettings>) => void;
  resetData: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: seedUsers,
      patients: seedPatients,
      professionals: seedProfessionals,
      services: seedServices,
      appointments: seedAppointments,
      settings: {
        openingTime: "07:00",
        closingTime: "19:00",
        slotMinutes: 30,
        clinicName: "Vitaliza Fisioterapia",
      },

      login: (role) => {
        const user = get().users.find((u) => u.role === role) ?? get().users[0];
        set({ currentUser: user });
      },
      logout: () => set({ currentUser: null }),

      addPatient: (p) => {
        const patient: Patient = { ...p, id: uid(), createdAt: format(new Date(), "yyyy-MM-dd") };
        set((s) => ({ patients: [patient, ...s.patients] }));
        return patient;
      },
      updatePatient: (id, patch) =>
        set((s) => ({ patients: s.patients.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      removePatient: (id) => set((s) => ({ patients: s.patients.filter((p) => p.id !== id) })),

      addProfessional: (p) =>
        set((s) => ({ professionals: [...s.professionals, { ...p, id: uid() }] })),
      updateProfessional: (id, patch) =>
        set((s) => ({
          professionals: s.professionals.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removeProfessional: (id) =>
        set((s) => ({ professionals: s.professionals.filter((p) => p.id !== id) })),

      addService: (sv) => set((s) => ({ services: [...s.services, { ...sv, id: uid() }] })),
      updateService: (id, patch) =>
        set((s) => ({ services: s.services.map((sv) => (sv.id === id ? { ...sv, ...patch } : sv)) })),
      removeService: (id) => set((s) => ({ services: s.services.filter((sv) => sv.id !== id) })),

      addAppointment: (a) => {
        const appt: Appointment = { ...a, id: uid(), status: a.status ?? "confirmado" };
        set((s) => ({ appointments: [...s.appointments, appt] }));
        return appt;
      },
      updateAppointment: (id, patch) =>
        set((s) => ({
          appointments: s.appointments.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      cancelAppointment: (id) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, status: "cancelado" } : a
          ),
        })),
      removeAppointment: (id) =>
        set((s) => ({ appointments: s.appointments.filter((a) => a.id !== id) })),

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      resetData: () =>
        set({
          patients: seedPatients,
          professionals: seedProfessionals,
          services: seedServices,
          appointments: seedAppointments,
          users: seedUsers,
        }),
    }),
    { name: "vitaliza-app" }
  )
);

/* Helpers */
export function getServiceDuration(serviceId: string, services: Service[]) {
  return services.find((s) => s.id === serviceId)?.durationMin ?? 50;
}

export function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(min: number) {
  const h = Math.floor(min / 60).toString().padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function hasConflict(
  appointments: Appointment[],
  services: Service[],
  data: { professionalId: string; date: string; time: string; serviceId: string; ignoreId?: string }
) {
  const start = timeToMinutes(data.time);
  const end = start + getServiceDuration(data.serviceId, services);
  return appointments.some((a) => {
    if (a.id === data.ignoreId) return false;
    if (a.status === "cancelado") return false;
    if (a.professionalId !== data.professionalId || a.date !== data.date) return false;
    const aStart = timeToMinutes(a.time);
    const aEnd = aStart + getServiceDuration(a.serviceId, services);
    return start < aEnd && end > aStart;
  });
}

export function suggestTimes(
  appointments: Appointment[],
  services: Service[],
  professional: Professional | undefined,
  date: string,
  serviceId: string,
  slotMinutes = 30
): string[] {
  if (!professional) return [];
  const dur = getServiceDuration(serviceId, services);
  const startM = timeToMinutes(professional.workingHours.start);
  const endM = timeToMinutes(professional.workingHours.end);
  const slots: string[] = [];
  for (let t = startM; t + dur <= endM; t += slotMinutes) {
    const time = minutesToTime(t);
    const conflict = hasConflict(appointments, services, {
      professionalId: professional.id,
      date,
      time,
      serviceId,
    });
    if (!conflict) slots.push(time);
  }
  return slots;
}
