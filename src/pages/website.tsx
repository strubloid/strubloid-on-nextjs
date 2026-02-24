import React, { useState } from "react";
import websiteInfo from "@backend/data/website-info.json";
import facebookData from "@backend/data/facebook.json";

interface TabType {
    id: string;
    label: string;
    icon?: string;
}

export default function Website() {
    const [activeTab, setActiveTab] = useState<string>("overview");

    const tabs: TabType[] = [
        { id: "overview", label: "📋 Overview" },
        { id: "pages", label: "📄 Pages" },
        { id: "components", label: "⚙️ Components" },
        { id: "techStack", label: "🛠️ Tech Stack" },
        { id: "dataFiles", label: "📊 Data Files" },
        { id: "apis", label: "🔌 APIs" },
        { id: "design", label: "🎨 Design" },
    ];

    return (
        <div className="website-page">
            {/* Hero Header */}
            {facebookData.photos.length > 0 && (
                <div
                    className="website-hero"
                    style={{
                        position: "relative",
                        minHeight: "500px",
                        marginBottom: "0",
                        backgroundImage: `url(${facebookData.photos[Math.floor(Math.random() * facebookData.photos.length)].url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundAttachment: "fixed",
                        overflow: "hidden",
                    }}
                >
                    {/* Overlay */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(135deg, rgba(43, 88, 118, 0.7) 0%, rgba(78, 67, 118, 0.6) 50%, rgba(107, 91, 78, 0.7) 100%)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2,
                        }}
                    >
                        <h1
                            style={{
                                fontSize: "3.5rem",
                                fontWeight: "800",
                                marginBottom: "0.75rem",
                                color: "#FFF8F0",
                                textAlign: "center",
                                letterSpacing: "-0.03em",
                            }}
                        >
                            {websiteInfo.projectName}
                        </h1>
                        <p
                            style={{
                                fontSize: "1.15rem",
                                color: "rgba(255, 248, 240, 0.8)",
                                textAlign: "center",
                                letterSpacing: "0.02em",
                                maxWidth: "600px",
                                padding: "0 2rem",
                            }}
                        >
                            {websiteInfo.projectDescription}
                        </p>
                    </div>
                </div>
            )}

            <div className="website-section">
                {/* Tabs */}
                <div
                    className="website-tabs"
                    style={{
                        display: "flex",
                        gap: "1rem",
                        marginBottom: "2rem",
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className="website-tab-button"
                            onClick={() => setActiveTab(tab.id)}
                            style={activeTab === tab.id ? {
                                background: "linear-gradient(135deg, var(--color-brazil-green), var(--color-brazil-gold))",
                            } : {}}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="website-content">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div>
                            <h2 style={{ marginBottom: "1.5rem" }}>Project Overview</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                                {/* Stats */}
                                <div style={{ background: "rgba(255, 107, 157, 0.05)", padding: "1.5rem", borderRadius: "0.5rem" }}>
                                    <h3>📊 Stats</h3>
                                    <p>Pages: {websiteInfo.pages.length}</p>
                                    <p>Core Components: {websiteInfo.coreComponents.length}</p>
                                    <p>API Endpoints: {websiteInfo.apiEndpoints.length}</p>
                                    <p>Data Files: {websiteInfo.dataFiles.length}</p>
                                    <p>Custom Hooks: {websiteInfo.hooks.length}</p>
                                </div>

                                {/* Highlights */}
                                <div style={{ background: "rgba(168, 218, 220, 0.05)", padding: "1.5rem", borderRadius: "0.5rem" }}>
                                    <h3>✨ Key Features</h3>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        <li>✓ Interactive Timeline</li>
                                        <li>✓ Photo Gallery Integration</li>
                                        <li>✓ Contact Form</li>
                                        <li>✓ Responsive Design</li>
                                        <li>✓ Animation Effects</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pages Tab */}
                    {activeTab === "pages" && (
                        <div>
                            <h2 style={{ marginBottom: "1.5rem" }}>Website Pages</h2>
                            {websiteInfo.pages.map((page, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        background: "rgba(255, 107, 157, 0.05)",
                                        padding: "1.5rem",
                                        marginBottom: "1.5rem",
                                        borderRadius: "0.5rem",
                                        borderLeft: "3px solid #FF6B9D",
                                    }}
                                >
                                    <h3 style={{ margin: "0 0 0.5rem 0" }}>
                                        {page.name} <code style={{ fontSize: "0.9rem" }}>{page.path}</code>
                                    </h3>
                                    <p style={{ margin: "0.5rem 0" }}>{page.description}</p>
                                    {page.features.length > 0 && (
                                        <div style={{ marginTop: "1rem" }}>
                                            <strong>Features:</strong>
                                            <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
                                                {page.features.map((feature, fidx) => (
                                                    <li key={fidx} style={{ color: "#D8D8D8" }}>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {page.components.length > 0 && (
                                        <div style={{ marginTop: "0.5rem" }}>
                                            <strong>Components:</strong>
                                            <div style={{ margin: "0.5rem 0", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                                {page.components.map((comp, cidx) => (
                                                    <code
                                                        key={cidx}
                                                        style={{
                                                            padding: "0.25rem 0.75rem",
                                                            borderRadius: "0.25rem",
                                                            fontSize: "0.85rem",
                                                        }}
                                                    >
                                                        {comp}
                                                    </code>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Components Tab */}
                    {activeTab === "components" && (
                        <div>
                            <h2 style={{ marginBottom: "1.5rem" }}>Core Components</h2>
                            {websiteInfo.coreComponents.map((comp, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        background: "rgba(168, 218, 220, 0.05)",
                                        padding: "1.5rem",
                                        marginBottom: "1.5rem",
                                        borderRadius: "0.5rem",
                                        borderLeft: "3px solid #A8DADC",
                                    }}
                                >
                                    <h3 style={{ margin: "0 0 0.5rem 0" }}>
                                        {comp.name} <code style={{ fontSize: "0.9rem" }}>{comp.file}</code>
                                    </h3>
                                    <p style={{ margin: "0.5rem 0" }}>{comp.purpose}</p>
                                    {comp.features.length > 0 && (
                                        <div style={{ marginTop: "1rem" }}>
                                            <strong>Features:</strong>
                                            <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
                                                {comp.features.map((feature, fidx) => (
                                                    <li key={fidx} style={{ color: "#D8D8D8" }}>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tech Stack Tab */}
                    {activeTab === "techStack" && (
                        <div>
                            <h2 style={{ marginBottom: "1.5rem" }}>Technical Stack</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                                {/* Frontend */}
                                <div style={{ background: "rgba(255, 107, 157, 0.05)", padding: "1.5rem", borderRadius: "0.5rem" }}>
                                    <h3 style={{ marginBottom: "1rem" }}>Frontend</h3>
                                    <p>
                                        <strong>Framework:</strong> {websiteInfo.technicalStack.frontend.framework}
                                    </p>
                                    <p>
                                        <strong>UI Library:</strong> {websiteInfo.technicalStack.frontend.uiLibrary}
                                    </p>
                                    <p>
                                        <strong>Styling:</strong> {websiteInfo.technicalStack.frontend.styling.join(", ")}
                                    </p>
                                    <p>
                                        <strong>Animations:</strong> {websiteInfo.technicalStack.frontend.animationLibraries.join(", ")}
                                    </p>
                                    <p>
                                        <strong>TypeScript:</strong> {websiteInfo.technicalStack.frontend.typeScript}
                                    </p>
                                </div>

                                {/* Backend */}
                                <div style={{ background: "rgba(168, 218, 220, 0.05)", padding: "1.5rem", borderRadius: "0.5rem" }}>
                                    <h3 style={{ marginBottom: "1rem" }}>Backend</h3>
                                    <p>
                                        <strong>Runtime:</strong> {websiteInfo.technicalStack.backend.runtime}
                                    </p>
                                    <p>
                                        <strong>Framework:</strong> {websiteInfo.technicalStack.backend.framework}
                                    </p>
                                    <p>
                                        <strong>Database:</strong> {websiteInfo.technicalStack.backend.database}
                                    </p>
                                </div>

                                {/* Integrations */}
                                <div style={{ background: "rgba(255, 200, 0, 0.05)", padding: "1.5rem", borderRadius: "0.5rem" }}>
                                    <h3 style={{ color: "#FFC800", marginBottom: "1rem" }}>Integrations</h3>
                                    <p>
                                        <strong>Email:</strong> {websiteInfo.technicalStack.integrations.emailService.join(", ")}
                                    </p>
                                    <p>
                                        <strong>APIs:</strong> {websiteInfo.technicalStack.integrations.externalAPIs.join(", ")}
                                    </p>
                                </div>

                                {/* Deployment */}
                                <div style={{ background: "rgba(100, 200, 100, 0.05)", padding: "1.5rem", borderRadius: "0.5rem" }}>
                                    <h3 style={{ color: "#64C864", marginBottom: "1rem" }}>Deployment</h3>
                                    <p>
                                        <strong>Platform:</strong> {websiteInfo.technicalStack.deployment.platform}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Files Tab */}
                    {activeTab === "dataFiles" && (
                        <div>
                            <h2 style={{ marginBottom: "1.5rem" }}>Data Files</h2>
                            {websiteInfo.dataFiles.map((file, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        background: "rgba(255, 107, 157, 0.05)",
                                        padding: "1.5rem",
                                        marginBottom: "1.5rem",
                                        borderRadius: "0.5rem",
                                        borderLeft: "3px solid #FF6B9D",
                                    }}
                                >
                                    <h3 style={{ margin: "0 0 0.5rem 0" }}>
                                        {file.name} <small>({file.size})</small>
                                    </h3>
                                    <p style={{ margin: "0.5rem 0" }}>{file.description}</p>
                                    {file.path && (
                                        <code
                                            style={{
                                                padding: "0.5rem",
                                                borderRadius: "0.25rem",
                                                display: "block",
                                                marginTop: "0.5rem",
                                                fontSize: "0.85rem",
                                            }}
                                        >
                                            {file.path}
                                        </code>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* APIs Tab */}
                    {activeTab === "apis" && (
                        <div>
                            <h2 style={{ marginBottom: "1.5rem" }}>API Endpoints</h2>
                            {websiteInfo.apiEndpoints.map((api, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        background: "rgba(168, 218, 220, 0.05)",
                                        padding: "1.5rem",
                                        marginBottom: "1.5rem",
                                        borderRadius: "0.5rem",
                                        borderLeft: "3px solid #A8DADC",
                                    }}
                                >
                                    <h3 style={{ margin: "0 0 0.5rem 0" }}>
                                        <code style={{ fontSize: "0.9rem" }}>
                                            {api.method} {api.path}
                                        </code>
                                    </h3>
                                    <p style={{ margin: "0.5rem 0" }}>{api.description}</p>
                                    {api.dataSource && (
                                        <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                                            <strong>Data:</strong> {api.dataSource}
                                        </p>
                                    )}
                                    {api.externalAPI && (
                                        <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                                            <strong>External API:</strong> {api.externalAPI}
                                        </p>
                                    )}
                                    {api.integrations && (
                                        <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                                            <strong>Integrations:</strong> {api.integrations.join(", ")}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Design Tab */}
                    {activeTab === "design" && (
                        <div>
                            <h2 style={{ marginBottom: "1.5rem" }}>Design System</h2>

                            <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Color Palette</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                                {Object.entries(websiteInfo.colorPalette).map(([key, color]: any) => (
                                    <div
                                        key={key}
                                        style={{
                                            background: "rgba(255, 107, 157, 0.05)",
                                            padding: "1rem",
                                            borderRadius: "0.5rem",
                                            textAlign: "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "60px",
                                                background: color.hex || color.value,
                                                borderRadius: "0.25rem",
                                                marginBottom: "0.5rem",
                                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                            }}
                                        ></div>
                                        <p style={{ margin: "0.25rem 0", fontWeight: "bold" }}>{color.name || key}</p>
                                        <code style={{ fontSize: "0.85rem" }}>{color.hex || color.value}</code>
                                    </div>
                                ))}
                            </div>

                            <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Design Patterns</h3>
                            {websiteInfo.designPatterns.map((pattern, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        background: "rgba(168, 218, 220, 0.05)",
                                        padding: "1.5rem",
                                        marginBottom: "1rem",
                                        borderRadius: "0.5rem",
                                    }}
                                >
                                    <h4 style={{ margin: "0 0 0.5rem 0" }}>{pattern.name}</h4>
                                    <p style={{ margin: "0.25rem 0" }}>{pattern.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
