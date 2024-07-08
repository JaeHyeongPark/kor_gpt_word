import React from "react";
import Image from "next/image";

const SpeakerIcon: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <Image
      src="/icons/Speaker_icon.svg"
      alt="speaker"
      onClick={onClick}
      width={20}
      height={20}
    />
  );
};

export default SpeakerIcon;
