export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  routes: number[];
  savedLocations: number[];
}