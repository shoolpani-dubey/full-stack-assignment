import { useEffect, useId, useRef, useState } from "react";
import {
  addOpenStreepMapLayer,
  addSarImageLayer,
  centerMapAroundSarBounds,
  createMapInstance,
} from "./App.service";
import { mapCenter } from "./App.constants";
import appStyle from "./App.module.scss";

export const App = (): JSX.Element => {
  const mapID = useId();
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    if (!mapInstance) {
      return;
    }
    addOpenStreepMapLayer(mapInstance);
    addSarImageLayer(mapInstance);
    centerMapAroundSarBounds(mapInstance);
  }, [mapInstance]);

  useEffect(() => {
    if (!mapRef?.current) {
      return;
    }
    // We create map instance once dom is ready
    const _instance = createMapInstance(mapID, mapCenter);
    setMapInstance(_instance);
  }, [mapRef]);

  return <div id={mapID} className={appStyle.mapRoot} ref={mapRef} />;
};
