"use client";

import React, { useEffect, useState } from "react";
import { getSystemString } from "./browserInfo";

const SystemString: React.FC<{ className?: string }> = ({ className }) => {
  const [str, setStr] = useState<string>("");

  useEffect(() => {
    setStr(getSystemString());
  }, []);

  return <div className={className}>{str}</div>;
};

export default SystemString; 