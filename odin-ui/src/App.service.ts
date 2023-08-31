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

export { createMapInstance, addOpenStreepMapLayer };
