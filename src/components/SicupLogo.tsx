import React from 'react';
interface Props {
  textSize?: string;
  width?: string;
}
const SicupLogo = ({ textSize = 'xl', width = '24' }: Props) => {
  return (
    <div
      className={`w-${width} h-${width} rounded-full bg-primary flex items-center justify-center`}
    >
      <span className={`text-black text-${textSize} font-bold`}>SiC-up</span>
    </div>
  );
};

export default SicupLogo;
