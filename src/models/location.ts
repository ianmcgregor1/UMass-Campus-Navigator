interface Location {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  type: string;
}