"use client"
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "./smoothScroll";
import { preloadImages } from "../lib/utils";
import Image from "next/image";


export default function Wave() {

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });
    const leftTextRefs = useRef([]);
    const rightTextRefs = useRef([]);

    const [focusedIndex, setFocusedIndex] = useState(0);
    const [activeImage, setActiveImage] = useState("/1.webp");

    const thumbY = useMotionValue(0);
    const thumbRef = useRef(null);



    useMotionValueEvent(scrollYProgress, "change", () => {
        if (!leftTextRefs.current) return;

        const viewportCenter = window.innerHeight / 2;
        let closestIndex = 0;
        let minDistance = Infinity;

        leftTextRefs.current.forEach((el, idx) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const dist = Math.abs((rect.top + rect.height / 2) - viewportCenter);
            if (dist < minDistance) {
                minDistance = dist;
                closestIndex = idx;
            }
        });

        if (thumbRef.current && containerRef.current) {
            const wrapperRect = containerRef.current.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const thumbnailHeight = thumbRef.current.offsetHeight;
            const wrapperHeight = containerRef.current.offsetHeight;

            const idealY = viewportCenter - wrapperRect.top - thumbnailHeight / 2;

            const minY = -thumbnailHeight / 2;
            const maxY = wrapperHeight - thumbnailHeight / 2;
            const clampedY = Math.max(minY, Math.min(maxY, idealY));

            thumbY.set(clampedY)
        }

        setFocusedIndex(closestIndex);
    });



    const waveNumber = 12
    const waveSpeed = 1;



    const leftTexts = [
        { text: "Volt R2", image: "/tesla.webp" },
        { text: "Éclat", image: "/chanel.webp" },
        { text: "Project Ion", image: "/apple.webp" },
        { text: "AeroLine", image: "/BMW.webp" },
        { text: "Série Noir", image: "/YSL.webp" },
        { text: "UltraRun", image: "/nike.webp" },
        { text: "Atelier 03", image: "/hermes.webp" },
        { text: "Pulse One", image: "/adidas.webp" },
        { text: "Linea 24", image: "/prada.webp" },
        { text: "Echo Series", image: "/google.webp" },
        { text: "Zero", image: "/polestar.webp" },
        { text: "Shift/Black", image: "/balenciaga.webp" },
        { text: "Solar Drift", image: "/audi.webp" },
        { text: "Nº 27", image: "/valentino.webp" },
        { text: "Mode/3", image: "/samsung.webp" },
        { text: "Pure Form", image: "/bottega.webp" },
        { text: "Edge", image: "/sony.webp" },
        { text: "Stillwater", image: "/aesop.webp" },
        { text: "Parfum Nº8", image: "/dior.webp" },
        { text: "Vantage", image: "/porsche.webp" },
        { text: "Core", image: "/microsoft.webp" },
        { text: "Archive Green", image: "/lexus.webp" },
        { text: "Rosso Linea", image: "/mercedes.webp" },
        { text: "A-17", image: "/huawei.webp" },
    ];

    const rightTexts = [
        "Tesla", "Chanel", "Apple", "BMW", "Saint Laurent", "Nike", "Hermès",
        "Adidas", "Prada", "Google", "Polestar", "Balenciaga", "Audi", "Valentino",
        "Samsung", "Bottega Veneta", "Sony", "Aesop", "Dior", "Porsche", "Microsoft",
        "Lexus", "Mercedes-Benz", "Huawei",
    ];

    useEffect(() => {
        Promise.all(
            leftTexts.map(({ image }) => {
                return new Promise((resolve) => {
                    const img = new window.Image();

                    img.onload = resolve;
                    img.onerror = resolve;

                    img.src = image;
                });
            })
        ).then(() => {
            console.log("All images loaded");
        });
    }, []);



    const fullLeft = useMemo(() => [...leftTexts, ...leftTexts], []);
    const fullRight = useMemo(() => [...rightTexts, ...rightTexts], []);

    useEffect(() => {
        if (fullLeft[focusedIndex]) {
            setActiveImage(fullLeft[focusedIndex].image);
        }
    }, [focusedIndex, fullLeft]);


    // const imageY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

    return (
        <div ref={containerRef} className="flex w-full gap-[25vw] relative  max-lg:gap-[10vw]">
            <div className="flex-1 flex flex-col gap-5 items-start relative text-[clamp(2rem,10vw,3rem)] font-normal leading-[0.7] max-lg:gap-10 max-lg:text-[5vw]">

                {fullLeft.map((text, i) => (
                    <WaveText
                        side="left"
                        waveNumber={waveNumber}
                        waveSpeed={waveSpeed}
                        scrollProgress={scrollYProgress}
                        index={i}
                        text={text.text}
                        key={i}
                        allTextRefs={leftTextRefs}
                        isClosest={focusedIndex === i}
                    />
                ))}
            </div>
            <motion.div
                ref={thumbRef}
                className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none"
                style={{ top: 0, y: thumbY }}  // imageY اتشالت، thumbY بيتحكم في كل حاجة
            >
                <img src={activeImage} alt="Campaign Image" className=" w-auto h-auto max-w-full max-h-[30vh]" />
            </motion.div>
            <div className="flex-1 flex flex-col gap-5 items-end relative z-[100] text-[clamp(2rem,10vw,3rem)] font-normal leading-[0.7] max-lg:gap-10 max-lg:text-[5vw]">

                {fullRight.map((text, i) => (
                    <WaveText
                        side="right"
                        waveNumber={waveNumber}
                        waveSpeed={waveSpeed}
                        scrollProgress={scrollYProgress}
                        index={i}
                        text={text}
                        key={i}
                        allTextRefs={rightTextRefs}
                        isClosest={focusedIndex === i}
                    />
                ))}
            </div>
        </div >
    )
}



function WaveText({ text, side, index, scrollProgress, waveNumber,
    waveSpeed, allTextRefs, isClosest }) {  // isClosest جاي من الأب

    const textRef = useRef(null);
    const [range, setRange] = useState({ minX: 0, maxX: 0 });

    // تسجيل الـ ref بس
    useEffect(() => {
        if (textRef.current && allTextRefs) {
            allTextRefs.current[index] = textRef.current;
        }
    }, [index, allTextRefs]);

    // حساب الـ range مرة واحدة
    useEffect(() => {
        const calculateRange = () => {
            if (textRef.current) {
                const parent = textRef.current.parentElement;
                const maxWidth = parent.offsetWidth - textRef.current.offsetWidth;
                setRange({ minX: 0, maxX: maxWidth });
            }
        };

        calculateRange();
        window.addEventListener("resize", calculateRange);
        return () => window.removeEventListener("resize", calculateRange);
    }, []);

    const x = useTransform(scrollProgress, (progress) => {
        if (range.maxX === 0) return 0;
        const phase = index * waveNumber + waveSpeed * progress * Math.PI * 2 - Math.PI / 2;
        const wave = Math.sin(phase);
        const cycleProgress = (wave + 1) / 2;
        const rawX = range.minX + cycleProgress * range.maxX;
        return side === "left" ? rawX : -rawX;
    });

    return (
        <motion.div
            className={`w-max uppercase transition-colors duration-200
                        ${isClosest ? "text-white" : "text-[#4d4d4d]"}`}
            ref={textRef}
            style={{ x }}
        >
            {text}
        </motion.div>
    );
}