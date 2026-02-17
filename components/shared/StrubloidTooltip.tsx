import React, { useState, useCallback, useRef, PropsWithChildren } from "react";
import { Tooltip } from "reactstrap";

interface StrubloidTooltipProps {
    target: string;
}

const DISPLAY_DURATION_MS = 1000;

const StrubloidTooltip: React.FC<PropsWithChildren<StrubloidTooltipProps>> = ({ target, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const toggle = useCallback(() => {
        if (!isOpen) {
            setIsOpen(true);
        } else {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setIsOpen(false), DISPLAY_DURATION_MS);
        }
    }, [isOpen]);

    return (
        <Tooltip isOpen={isOpen} toggle={toggle} target={target}>
            {children}
        </Tooltip>
    );
};

export default StrubloidTooltip;
