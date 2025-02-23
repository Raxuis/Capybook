import React, {useState, useEffect, useRef, ReactNode, HTMLAttributes} from "react";

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    padding?: number;
    disabled?: boolean;
    magnetStrength?: number;
    activeTransition?: string;
    inactiveTransition?: string;
    wrapperClassName?: string;
    innerClassName?: string;
    parentRef?: React.RefObject<HTMLElement | null>; // Ajout d'un ref parent pour éviter que le bouton ne sorte du header
}

export const MagneticButton: React.FC<MagnetProps> = ({
                                                          children,
                                                          padding = 100,
                                                          disabled = false,
                                                          magnetStrength = 2,
                                                          activeTransition = "transform 0.3s ease-out",
                                                          inactiveTransition = "transform 0.5s ease-in-out",
                                                          wrapperClassName = "",
                                                          innerClassName = "",
                                                          parentRef, // 🔹 Ajout de la ref du parent
                                                          ...props
                                                      }) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [position, setPosition] = useState<{ x: number; y: number }>({x: 0, y: 0});
    const magnetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled) {
            setPosition({x: 0, y: 0});
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!magnetRef.current || !parentRef?.current) return;

            const magnetRect = magnetRef.current.getBoundingClientRect();
            const parentRect = parentRef.current.getBoundingClientRect(); // 🔹 Dimensions du parent

            const centerX = magnetRect.left + magnetRect.width / 2;
            const centerY = magnetRect.top + magnetRect.height / 2;

            const distX = Math.abs(centerX - e.clientX);
            const distY = Math.abs(centerY - e.clientY);

            if (distX < magnetRect.width / 2 + padding && distY < magnetRect.height / 2 + padding) {
                setIsActive(true);

                let offsetX = (e.clientX - centerX) / magnetStrength;
                let offsetY = (e.clientY - centerY) / magnetStrength;

                // 🔹 Empêcher le bouton de dépasser du parent
                offsetX = Math.max(-magnetRect.left + parentRect.left, Math.min(offsetX, parentRect.right - magnetRect.right));
                offsetY = Math.max(-magnetRect.top + parentRect.top, Math.min(offsetY, parentRect.bottom - magnetRect.bottom));

                setPosition({x: offsetX, y: offsetY});
            } else {
                setIsActive(false);
                setPosition({x: 0, y: 0});
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [padding, disabled, magnetStrength, parentRef]);

    const transitionStyle = isActive ? activeTransition : inactiveTransition;

    return (
        <div ref={magnetRef} className={wrapperClassName}
             style={{position: "relative", display: "inline-block"}} {...props}>
            <div
                className={innerClassName}
                style={{
                    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                    transition: transitionStyle,
                    willChange: "transform",
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default MagneticButton;
