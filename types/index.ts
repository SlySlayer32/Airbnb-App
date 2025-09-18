export interface Property {
  id: string;
  name: string;
  address: string;
  rooms: number;
  bathrooms: number;
  imageUrl: string;
  specialInstructions?: string;
  status: 'active' | 'maintenance' | 'occupied';
  nextClean?: Date;
  assignedCleaners: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'cleaner' | 'cohost' | 'contractor';
  imageUrl: string;
  assignedProperties: string[];
  rating: number;
}

export interface CleaningTask {
  id: string;
  propertyId: string;
  cleanerId: string;
  scheduledDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  type: 'checkout' | 'checkin' | 'maintenance' | 'deep-clean';
  checklist: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  notes?: string;
  photoUrl?: string;
}

export interface Invoice {
  id: string;
  propertyId: string;
  cleanerId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: Date;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdDate: Date;
  photos: string[];
}