import React, { useRef } from "react";

const BasicHeader: React.FC = () => {
    const pageReference = useRef<HTMLDivElement>(null);

    return (
        <div className="basic-page-header">
            <div className="page-header-image" ref={pageReference} />
        </div>
    );
};

export default BasicHeader;
