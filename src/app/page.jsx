
"use client"
import { motion, useInView } from "framer-motion";
import Wave from "./components/dualWaveAnimation";
import { useRef } from "react";


export default function Home() {


  const container = useRef(null);

  const isInView = useInView(container, { once: true, margin: "-50%" })

  const animation = {

    initial: { y: "100%" },

    enter: i => ({ y: "0", transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1], delay: 0.075 * i } })

  }

  return (
    <main>
      <div className="h-[70svh]" />
      <Wave />
      <div  className="p-20 flex justify-center items-center h-[100svh]">
        <div  ref={container} className="overflow-hidden">
          <motion.h1 className="text-[6vw]" variants={animation} initial="initial" animate={isInView ? "enter" : ""} >Done by Noor</motion.h1>
        </div>
      </div>
    </main>
  );
}
