import { useEffect, useId, useRef, useState } from "react";
import {
  addLayerGroupControl,
  addSarImageLayer,
  addSeaMarkLayer,
  addShipImageLayer,
  centerMapAroundSarBounds,
  createMapInstance,
} from "./App.service";
import { mapCenter, sarCornerCoordinates, shipPosition } from "./App.constants";
import appStyle from "./App.module.scss";

export const App = (): JSX.Element => {
  const mapID = useId();
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const addLayersToMapInstance = async (mapInstance: L.Map) => {
    const imageLayer = addSarImageLayer(
      mapInstance,
      mapCenter,
      sarCornerCoordinates
    );
    addShipImageLayer(mapInstance, shipPosition);
    addSeaMarkLayer(mapInstance);
    addLayerGroupControl(mapInstance, imageLayer);
    centerMapAroundSarBounds(mapInstance, sarCornerCoordinates);
  };

  useEffect(() => {
    if (!mapInstance) {
      return;
    }
    addLayersToMapInstance(mapInstance);
  }, [mapInstance]);

  useEffect(() => {
    if (!mapRef?.current) {
      return;
    }
    // We create map instance once dom is ready
    const _instance = createMapInstance(mapID, mapCenter);
    setMapInstance(_instance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef]);

  return <div id={mapID} className={appStyle.mapRoot} ref={mapRef} />;
};
