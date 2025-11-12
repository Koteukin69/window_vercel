"use client";

import { useEffect, useState } from "react";

export default function Back() {
    const [display, setDisplay] = useState("none");
    
    useEffect(() => {
        if (typeof window == "undefined") return;
        setDisplay((window.location.pathname == "/") ? "none" : "block");
    }, []);

    return <a href="./.." className="absolute left-[100px] top-[60px] text-[24px] font-bold" style={{display}}>{"< Back"}</a>
}