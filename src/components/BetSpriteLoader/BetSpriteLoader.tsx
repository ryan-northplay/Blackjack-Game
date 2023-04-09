import React, { useEffect, useRef } from "react";

interface BetSpriteLoaderProps {
    classNames?: string;
    overWriteNumber?: number;
    type: "bet-1" | "bet-5" | "bet-10" | "bet-25" | "bet-100" | "bet-500";
    width: string;
    height: string;
}

const BetSpriteLoader: React.FC<BetSpriteLoaderProps> = ({ classNames, type, width, height, overWriteNumber }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (svgRef.current && overWriteNumber) {
            // accessing shadow DOM to overwrite original number?
            // needs further research
        }
    }, [overWriteNumber]);

    switch (type) {
        case "bet-1":
            return (
                <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" ref={svgRef}>
                    <use
                        href="./Graphics/chipSprite.svg#chip-pink-g"
                        style={{ transform: "translate(-72px, -9px)" }}
                        className={classNames}
                    />
                </svg>
            );
        case "bet-5":
            return (
                <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" ref={svgRef}>
                    <use
                        href="./Graphics/chipSprite.svg#chip-red-g"
                        style={{ transform: "translate(-136px, -74px)" }}
                        className={classNames}
                    />
                </svg>
            );
        case "bet-10":
            return (
                <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" ref={svgRef}>
                    <use
                        href="./Graphics/chipSprite.svg#chip-cyan-g"
                        style={{ transform: "translate(-7px, -74px)" }}
                        className={classNames}
                    />
                </svg>
            );
        case "bet-25":
            return (
                <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" ref={svgRef}>
                    <use
                        href="./Graphics/chipSprite.svg#chip-darkred-g"
                        style={{ transform: "translate(-7px, -8px)" }}
                        className={classNames}
                    />
                </svg>
            );
        case "bet-100":
            return (
                <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" ref={svgRef}>
                    <use
                        href="./Graphics/chipSprite.svg#chip-blue-g"
                        style={{ transform: "translate(-136px, -8px)" }}
                        className={classNames}
                    />
                </svg>
            );
        case "bet-500":
            return (
                <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" ref={svgRef}>
                    <use
                        href="./Graphics/chipSprite.svg#chip-purple-g"
                        style={{ transform: "translate(-72px, -74px)" }}
                        className={classNames}
                    />
                </svg>
            );
    }
};

export { BetSpriteLoader };
