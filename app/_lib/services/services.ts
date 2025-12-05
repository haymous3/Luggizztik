import axios from "axios";

export async function getCoordinates(address: string) {
  const response = await axios.get(
    "https://api.openrouteservice.org/geocode/search",
    {
      params: {
        api_key: process.env.OPENROUTESERVICE_API_KEY,
        text: address,
      },
    }
  );

  const location = response.data.features[0];
  return {
    coordinate: location.geometry.coordinates, // [lng, lat]
    name: location.properties.label,
  };
}

export async function getDistanceMatrix(origin: string, destination: string) {
  const [originCoords, destinationCoords] = await Promise.all([
    getCoordinates(origin),
    getCoordinates(destination),
  ]);

  const response = await axios.post(
    "https://api.openrouteservice.org/v2/matrix/driving-car",
    {
      locations: [originCoords.coordinate, destinationCoords.coordinate],
      metrics: ["distance", "duration"],
    },
    {
      headers: {
        Authorization: process.env.OPENROUTESERVICE_API_KEY!,
        "Content-Type": "application/json",
      },
    }
  );

  const distanceInMeters = response.data.distances[0][1];
  const distanceInKm = Math.round(distanceInMeters / 1000);

  return distanceInKm; 
}

// Example:
getDistanceMatrix("Lagos", "Abuja").then(console.log);
