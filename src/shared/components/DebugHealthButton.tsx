import React, { useState } from "react";
import styles from "./DebugHealthButton.module.scss";

interface HealthResponse {
    status: "ok" | "degraded" | "error";
    timestamp: string;
    mongodb: {
        connected: boolean;
        status: string;
        error?: string;
    };
    environment: string;
}

const DebugHealthButton: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [lastStatus, setLastStatus] = useState<HealthResponse | null>(null);

    // Only show in development
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_NODE_ENV !== "development") {
        console.log('Not running')
        return null;
    }

    const checkHealth = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/health");
            const data: HealthResponse = await response.json();

            // Log to console
            console.log("🏥 Health Check Response:", data);
            console.log(`MongoDB Status: ${data.mongodb.status}`);
            if (data.mongodb.error) {
                console.error(`Error: ${data.mongodb.error}`);
            }

            setLastStatus(data);

            // Show visual feedback
            alert(`Health Check: ${data.status.toUpperCase()}\n` + `MongoDB: ${data.mongodb.status}\n` + `Time: ${new Date(data.timestamp).toLocaleTimeString()}`);
        } catch (error) {
            console.error("❌ Health check failed:", error);
            alert("Health check failed. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles["debug-button-container"]}>
            <button
                onClick={checkHealth}
                disabled={isLoading}
                className={`${styles["debug-button"]} ${lastStatus ? styles[`status-${lastStatus.status}`] : ""}`}
                title="Check MongoDB health status (opens console)"
            >
                {isLoading ? "..." : "🏥"}
            </button>

            {lastStatus && (
                <div className={styles["status-tooltip"]}>
                    <div className={styles["status-time"]}>{new Date(lastStatus.timestamp).toLocaleTimeString()}</div>
                    <div className={styles["status-db"]}>DB: {lastStatus.mongodb.status}</div>
                    {lastStatus.mongodb.error && <div className={styles["status-error"]}>{lastStatus.mongodb.error}</div>}
                </div>
            )}
        </div>
    );
};

export default DebugHealthButton;
