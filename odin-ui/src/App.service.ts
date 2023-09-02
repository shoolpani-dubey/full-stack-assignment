import { mapCenter, sarCornerCoordinates } from "./App.constants";

declare const L: any;

const createMapInstance = (domID: string, center: number[]): L.Map => {
  return L.map(domID).setView(center, 10);
};

const addOpenStreepMapLayer = (mapInstance: L.Map) => {
  const tileLayer = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }
  );
  tileLayer.addTo(mapInstance);
  return tileLayer;
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
  const sarImageUrl = process.env.REACT_APP_SAR_URL;
  const sarImageBounds = getSarImageBounds();
  const imageLayer = L.imageOverlay(sarImageUrl, sarImageBounds, {
    opacity: 0.7,
  });
  imageLayer.addTo(mapInstance);
  return imageLayer;
};

const centerMapAroundSarBounds = (mapInstance: L.Map) => {
  mapInstance.fitBounds(calculateSarBoundsFromRectangleCoordinates());
};

const addLayerGroupControl = (
  mapInstance: L.Map,
  mapLayer: L.TileLayer,
  imageLayer: L.ImageOverlay
) => {
  L.control
    .layers(
      {
        "World Map": mapLayer,
      },
      {
        "Sar Image": imageLayer,
      }
    )
    .addTo(mapInstance);
};

export {
  createMapInstance,
  addOpenStreepMapLayer,
  addSarImageLayer,
  centerMapAroundSarBounds,
  addLayerGroupControl,
};
