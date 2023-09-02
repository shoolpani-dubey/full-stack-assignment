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

const calculateSarBoundsFromRectangleCoordinates = (
  sarCornerCoordinates: number[][]
) => {
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

const getSarImageBounds = (
  mapCenter: number[],
  sarCornerCoordinates: number[][]
) => {
  return [
    mapCenter,
    calculateSarBoundsFromRectangleCoordinates(sarCornerCoordinates),
  ];
};

const addSarImageLayer = (
  mapInstance: L.Map,
  mapCenter: number[],
  sarCornerCoordinates: number[][]
) => {
  const sarImageUrl = process.env.REACT_APP_SAR_URL;
  const sarImageBounds = getSarImageBounds(mapCenter, sarCornerCoordinates);
  const imageLayer = L.imageOverlay(sarImageUrl, sarImageBounds, {
    opacity: 0.7,
  });
  imageLayer.addTo(mapInstance);
  return imageLayer;
};

const centerMapAroundSarBounds = (
  mapInstance: L.Map,
  sarCornerCoordinates: number[][]
) => {
  mapInstance.fitBounds(
    calculateSarBoundsFromRectangleCoordinates(sarCornerCoordinates)
  );
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

const addShipImageLayer = (mapInstance: L.Map, shipPosition: number[]) => {
  const shipIcon = L.icon({
    iconUrl: "ship.png",
    iconSize: [32, 32],
  });
  const shipMarker = L.marker(shipPosition, { icon: shipIcon });
  shipMarker.addTo(mapInstance);
  // return shipMarker;
};

export {
  createMapInstance,
  addOpenStreepMapLayer,
  addSarImageLayer,
  centerMapAroundSarBounds,
  addLayerGroupControl,
  addShipImageLayer,
};
