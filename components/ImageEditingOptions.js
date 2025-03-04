"use client";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { RiFormula } from "react-icons/ri";
import BgOptionsModal from "../components/modal/BgOptionsModal";

export default function ImageEditingOptions({
  setProcessedImage,
  setIsProcessing,
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="flex-row sm:flex-row gap-3">
      <div className="flex flex-row items-center  gap-1">
        <CiCirclePlus
          className="w-[40px] h-[40px]"
          onClick={(e) => setOpen(!open)}
        />
        <BgOptionsModal
          open={open}
          setOpen={setOpen}
          setProcessedImage={setProcessedImage}
          setIsProcessing={setIsProcessing}
        />
        <span className="font-semibold text-gray-700 text-sm">Background</span>
      </div>

      <div className="flex flex-row items-center gap-1">
        <RiFormula className="w-[40px] h-[40px]" />
        <span className="font-semibold text-gray-700 text-sm">Effects</span>
      </div>
    </section>
  );
}
