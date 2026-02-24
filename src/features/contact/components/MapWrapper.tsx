import React, { useEffect, useRef } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import type { IGoogleKeyProps } from "@shared-types";

declare global {
    interface Window {
        google: any;
    }
}

const MapComponent: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const map = useRef<any>(null);

    useEffect(() => {
        if (!mapRef.current || !window.google) return;

        // Cork, Ireland - 10 Camden Court, Knaps Square coordinates
        const location = { lat: 51.901, lng: -8.4705 };

        // Initialize map
        map.current = new window.google.maps.Map(mapRef.current, {
            zoom: 15,
            center: location,
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: false,
            styles: [
                {
                    featureType: "all",
                    elementType: "geometry",
                    stylers: [{ color: "#f5f5f5" }],
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#e0f7fa" }],
                },
            ],
        });

        // Add marker
        new window.google.maps.Marker({
            position: location,
            map: map.current,
            title: "Camden Court, Knaps Square, Cork, Ireland",
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#e07b4c",
                fillOpacity: 1,
                strokeColor: "#fff",
                strokeWeight: 2,
            },
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
            content: `
                <div style="padding: 8px; font-family: Arial; font-size: 14px;">
                    <strong>Camden Court</strong><br/>
                    Knaps Square<br/>
                    Cork, Ireland
                </div>
            `,
            position: location,
        });
        infoWindow.open(map.current);
    }, []);

    return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

const renderMap = (status: Status) => {
    if (status === Status.LOADING) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "400px",
                    background: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                }}
            >
                Loading map...
            </div>
        );
    }
    if (status === Status.FAILURE) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "400px",
                    background: "#fff3cd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#856404",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <p>Unable to load map</p>
                    <p style={{ fontSize: "12px", marginTop: "8px" }}>
                        Cork, Ireland
                        <br />
                        Camden Court, Knaps Square
                    </p>
                </div>
            </div>
        );
    }
    return <MapComponent />;
};

export const MapWrapper: React.FC<IGoogleKeyProps> = ({ googleKey }) => (
    <Wrapper apiKey={googleKey ?? ""} render={renderMap}>
        <MapComponent />
    </Wrapper>
);
