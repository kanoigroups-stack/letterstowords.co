import { useEffect, useState, CSSProperties } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = {},
}: AdUnitProps) {
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    try {
      const win = window as any;
      if (win && win.adsbygoogle) {
        win.adsbygoogle.push({});
      }
    } catch (err) {
      console.warn('AdSense block placement warning: ', err);
      setAdError(true);
    }
  }, [slot]);

  return (
    <div
      className={`relative mx-auto my-6 text-center overflow-hidden transition-all duration-100 ${className}`}
      id={`ad-container-${slot}`}
    >
      <div className="text-[10px] uppercase font-bold tracking-widest text-[#9ea8b6] mb-1.5 select-none">
        Sponsored Advertisement
      </div>
      
      <div className="bg-[#faf8ff] border border-dashed border-slate-200 rounded-lg p-2 flex items-center justify-center min-h-[90px] md:min-h-[120px] transition-colors relative">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '250px', ...style }}
          data-ad-client="ca-pub-5183526163868215"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none p-3 text-center bg-[#fafafc]/95 border border-[#e2e8f0] rounded-lg">
          <span className="text-[11px] font-semibold text-[#505f76] uppercase tracking-wide">
            Ad Space (Slot: {slot})
          </span>
          <span className="text-[9px] text-[#919db1] max-w-xs mt-1">
            Replace with your verified Google AdSense Publisher ID to display real ads!
          </span>
        </div>
      </div>
    </div>
  );
}
