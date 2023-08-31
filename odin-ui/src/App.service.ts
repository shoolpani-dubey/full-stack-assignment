import { mapCenter, sarCornerCoordinates } from "./App.constants";

declare const L: any;

const createMapInstance = (domID: string, center: number[]): L.Map => {
  return L.map(domID).setView(center, 10);
};

const addOpenStreepMapLayer = (mapInstance: L.Map) => {
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(mapInstance);
};

const calculateSarBoundsFromRectangleCoordinates = () => {
  const corner1 = L.latLng(
    sarCornerCoordinates[0][1],
    sarCornerCoordinates[0][0]
  );
  const corner2 = L.latLng(
    sarCornerCoordinates[2][1],
    sarCornerCoordinates[2][0]
  );
  return L.latLngBounds(corner1, corner2);
};

const getSarImageBounds = () => {
  return [mapCenter, calculateSarBoundsFromRectangleCoordinates()];
};

const addSarImageLayer = (mapInstance: L.Map) => {
  const sarImageUrl = "SAR.png";
  const sarImageBounds = getSarImageBounds();
  L.imageOverlay(sarImageUrl, sarImageBounds, {
    opacity: 0.7,
  }).addTo(mapInstance);
};

const centerMapAroundSarBounds = (mapInstance: L.Map) => {
  mapInstance.fitBounds(calculateSarBoundsFromRectangleCoordinates());
};

export {
  createMapInstance,
  addOpenStreepMapLayer,
  addSarImageLayer,
  centerMapAroundSarBounds,
};
