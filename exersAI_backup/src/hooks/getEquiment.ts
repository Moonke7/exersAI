import { apiFetch } from '../utils/api';
import { Equipment } from '../types/equipment';

export async function getEquipment(): Promise<Equipment[]> {
  try {
    const response = await apiFetch('/api/exercises/all-equipment', {
      method: 'GET',
      authenticated: false, // Público por ahora
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return [];
  }
}
