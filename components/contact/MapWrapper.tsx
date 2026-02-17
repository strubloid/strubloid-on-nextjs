import React from "react";
import type { IGoogleKeyProps } from "../../types";

export const MapWrapper: React.FC<IGoogleKeyProps> = () => (
    <div
        style={{
            width: "100%",
            height: "400px",
            background: "#e5e5e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
            fontSize: "16px",
        }}
    >
        <div style={{ textAlign: "center" }}>
            <p>🗺️ Google Map</p>
            <p style={{ fontSize: "12px", marginTop: "8px" }}>
                Dublin, Ireland
                <br />
                Oak Apple Green, Dublin 6
            </p>
        </div>
    </div>
);
