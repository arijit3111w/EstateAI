declare module 'react-leaflet' {
  import { ComponentType, ReactNode } from 'react';
  import * as L from 'leaflet';

  export interface MapContainerProps {
    center?: L.LatLngExpression;
    zoom?: number;
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
  }

  export interface TileLayerProps {
    url: string;
    attribution?: string;
    [key: string]: any;
  }

  export interface CircleMarkerProps {
    center?: L.LatLngExpression;
    radius?: number;
    pathOptions?: L.PathOptions;
    children?: ReactNode;
    [key: string]: any;
  }

  export interface PopupProps {
    children?: ReactNode;
    [key: string]: any;
  }

  export interface MarkerProps {
    position?: L.LatLngExpression;
    children?: ReactNode;
    [key: string]: any;
  }

  export const MapContainer: ComponentType<MapContainerProps>;
  export const TileLayer: ComponentType<TileLayerProps>;
  export const CircleMarker: ComponentType<CircleMarkerProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const Popup: ComponentType<PopupProps>;
}
