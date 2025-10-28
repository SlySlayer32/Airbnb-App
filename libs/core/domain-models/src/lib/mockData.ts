import {
  CleaningTask,
  Invoice,
  MaintenanceTicket,
  Property,
  TeamMember,
} from '../types';

export const properties: Property[] = [
  {
    id: '1',
    name: 'Sunset Villa',
    address: '123 Ocean Drive, Miami Beach, FL',
    rooms: 3,
    bathrooms: 2,
    imageUrl:
      'https://d64gsuwffb70l.cloudfront.net/68c9667bc6549ed6e63cf24e_1758029471470_af27c278.webp',
    status: 'active',
    nextClean: new Date('2024-01-20'),
    assignedCleaners: ['1', '2'],
    specialInstructions: 'Check pool area, replace towels daily',
  },
  {
    id: '2',
    name: 'Mountain Retreat',
    address: '456 Alpine Way, Aspen, CO',
    rooms: 4,
    bathrooms: 3,
    imageUrl:
      'https://d64gsuwffb70l.cloudfront.net/68c9667bc6549ed6e63cf24e_1758029473332_ae33dd49.webp',
    status: 'occupied',
    nextClean: new Date('2024-01-22'),
    assignedCleaners: ['1'],
    specialInstructions: 'Hot tub maintenance weekly',
  },
  {
    id: '3',
    name: 'Urban Loft',
    address: '789 Downtown St, NYC, NY',
    rooms: 2,
    bathrooms: 1,
    imageUrl:
      'https://d64gsuwffb70l.cloudfront.net/68c9667bc6549ed6e63cf24e_1758029475150_00e72d9c.webp',
    status: 'maintenance',
    nextClean: new Date('2024-01-25'),
    assignedCleaners: ['3'],
    specialInstructions: 'Elevator access only',
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@cleanpro.com',
    phone: '(555) 123-4567',
    role: 'cleaner',
    imageUrl:
      'https://d64gsuwffb70l.cloudfront.net/68c9667bc6549ed6e63cf24e_1758029489423_7299df8b.webp',
    assignedProperties: ['1', '2'],
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria@cleanteam.com',
    phone: '(555) 234-5678',
    role: 'cleaner',
    imageUrl:
      'https://d64gsuwffb70l.cloudfront.net/68c9667bc6549ed6e63cf24e_1758029491309_db62d18d.webp',
    assignedProperties: ['1'],
    rating: 4.8,
  },
];
