declare const L: any;
const createMapInstance = (domID: string, center: number[]): L.Map => {
  return L.map(domID).setView(center, 10);
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
  imageLayer: L.ImageOverlay
) => {
  L.control
    .layers({
      "Sar Image": imageLayer,
    })
    .addTo(mapInstance);
};

const addShipImageLayer = (mapInstance: L.Map, shipPosition: number[]) => {
  const shipIcon = L.icon({
    iconUrl: "ship.png",
    iconSize: [32, 32],
  });
  const shipMarker = L.marker(shipPosition, { icon: shipIcon });
  shipMarker.addTo(mapInstance);
};

const addSeaMarkLayer = async (mapInstance: L.Map) => {
  const lighthouseIcon = L.icon({
    iconUrl: "lh.png",
    iconSize: [24, 24],
  });
  const requestOptions = {
    method: "GET",
  };

  const seamarkResp = await fetch(
    "http://127.0.0.1:8000/seamark",
    requestOptions
  );
  const seamarkJson = await seamarkResp.json();
  if (!seamarkJson?.elements || seamarkJson.elements.length <= 0) {
    return;
  }

  const latLongLayers: L.Marker[] = [];

  seamarkJson.elements.forEach((ele: any) => {
    const lat = ele.lat;
    const lon = ele.lon;
    // console.log(lat, lon);
    if (!lat || !lon) {
      return;
    }
    const position = [lat, lon];
    const markerLayer = L.marker(position, { icon: lighthouseIcon });
    let popup = "";
    Object.keys(ele.tags).forEach((key) => {
      if (!ele.tags[key]?.trim?.()) {
        return;
      }
      popup += `<p>${key} :: ${ele.tags[key]} </p>`;
    });
    markerLayer.bindPopup(popup);
    latLongLayers.push(markerLayer);
  });
  var latLons = L.layerGroup(latLongLayers);
  latLons.addTo(mapInstance);
  return latLons;
};

export {
  createMapInstance,
  addSarImageLayer,
  centerMapAroundSarBounds,
  addLayerGroupControl,
  addShipImageLayer,
  addSeaMarkLayer,
};
