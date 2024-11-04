import React from "react";
import Image from "next/image";
function Empty() {
  return (
    <div className="border-conversation-border border-l w-full bg-panel-header-background flex flex-col h-[100dvh] border-b-4 border-b-icon-green items-center justify-center">
      <div className="flex items-center justify-center gap-2 text-white">
        <Image src="/whatsapp.gif" alt="whatsapp" height={300} width={300} />
        <span className="text-7xl">Whatsapp</span>
      </div>
    </div>
  );
}

export default Empty;
