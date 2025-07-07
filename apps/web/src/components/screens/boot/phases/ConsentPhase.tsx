"use client";

import React, { useEffect, useState } from "react";
import LogoPulse from "../LogoPulse";
import TitleLabel from "../shared/TitleLabel";
import EKGWave from "../EkgWave";
import ConsentForm from "../ConsentForm";

interface ConsentPhaseProps {
  onAccept: () => void;
}

const ConsentPhase: React.FC<ConsentPhaseProps> = ({ onAccept }) => {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShowForm(true), 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white font-home-video text-sm select-none">
      <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <LogoPulse amplitude={0.08} className="scale-75" />
        <TitleLabel />
        <EKGWave intensity={1} />
        {showForm && <ConsentForm onAccept={onAccept} />}
      </div>
    </div>
  );
};

export default ConsentPhase; 