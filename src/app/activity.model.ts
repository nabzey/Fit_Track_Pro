export interface Activity {
  id: string;
  name: string;
  type: 'SPORT' | 'HYDRATATION';
  value: number;
  createdAt: number;
}
