
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const MESSAGES = [
  {
    title: "Happy Birthday Brooooo!",
    body: "Whoohoooo ⸜(｡˃ ᵕ ˂ )",
    sticker: "🎂",
    photo: "/photos/photo1.JPG" ,
  },
  {
    title: "Silver Jubliee which means…",
    body: "You are 25 now lmao unc.",
    sticker: "( ๑ ｀∇´๑)",
    photo: "/photos/photo2.JPG",
  },
  {
    title: "So now,",
    body: "Please stop saying you are a teenage sensation!! 😭",
    sticker: "(¬⤙¬ )",
    photo: "/photos/photo3.jpg",  
  },
  {
    title: "And please....",
    body: "Try not to eat a lot of unhealty food and stop giving mummy papa stress by not answering their call or replying to texts!!!",
    sticker: "人(´∀｀)",
    photo: "/photos/photo4.JPG",
  },
];

interface Sparkle {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

function SparkleTrail() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const idRef = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime.current < 50) return;
      lastTime.current = now;

      const s: Sparkle = {
        id: idRef.current++,
        x: e.clientX,
        y: e.clientY,
        createdAt: now,
      };

      setSparkles(prev => [...prev.slice(-15), s]);
    };

    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      setSparkles(prev => prev.filter(s => now - s.createdAt < 600));
    }, 100);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {sparkles.map(s => (
        <div
          key={s.id}
          className="sparkle-particle"
          style={{
            left: s.x - 4,
            top: s.y - 4,
            animation: 'sparkle-fade 0.6s ease-out forwards',
          }}
        />
      ))}
    </>
  );
}

function BackgroundScene() {
  const [hearts, setHearts] = useState<any[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const spawn = () => {
      setHearts(prev => [
        ...prev.slice(-10),
        { id: idRef.current++, left: Math.random() * 100, duration: 8 + Math.random() * 4 },
      ]);
    };

    const t = setInterval(spawn, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="shimmer-overlay" />

      {/* Clouds */}
      {[1,2,3,4].map((_, i) => (
        <div
          key={i}
          className="cloud"
          style={{
            width: 120 + i * 20,
            height: 40,
            top: `${10 + i * 5}%`,
            left: `${i * 20}%`,
            animation: 'float-cloud 6s ease-in-out infinite',
          }}
        />
      ))}

      {/* Stars */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: `${Math.random() * 40}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Hearts */}
      {hearts.map(h => (
        <div
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            animationDuration: `${h.duration}s`,
          }}
        >
          🩶
        </div>
      ))}
    </div>
  );
}

function ProgressHearts({ currentStep, totalSteps }: any) {
  return (
    <div className="flex gap-2 justify-center mb-4">
      {[...Array(totalSteps)].map((_, i) => (
        <span key={i} className="text-2xl">
          {i <= currentStep ? '🩶' : '🤍'}
        </span>
      ))}
    </div>
  );
}

function Envelope({ onOpen }: any) {
  const [opening, setOpening] = useState(false);

  const click = () => {
    setOpening(true);
    setTimeout(onOpen, 500);
  };

  return (
    <button
      onClick={click}
      className={`envelope w-64 h-48 sm:w-80 sm:h-56 bg-gradient-to-br from-slate-200 to-slate-300 border-4 border-slate-400 rounded-lg shadow-xl flex flex-col items-center justify-center ${opening ? 'envelope-opening' : ''}`}
    >
      <div className="text-6xl">💌</div>
      <p className="text-slate-600 font-bold">Click to open!</p>
    </button>
  );
}

function PhotoDisplay({ src }: { src?: string }) {
  if (!src) return null;

  return (
    <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 flex items-center justify-center">
  <img
    src={src}
    alt="Memory"
    className="max-h-56 w-auto object-contain transition-transform duration-300 hover:scale-105"
  />
</div>
  );
}

function MessagePopup({ message, step, totalSteps, onNext, onClose, isExiting }: any) {
  const isLast = step === totalSteps - 1;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md ${isExiting ? 'popup-exiting' : 'popup-entering'}`}>
        
        <div className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 p-3 flex justify-between">
          <span>🩶🤍🩶</span>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="pt-4">
          <ProgressHearts currentStep={step} totalSteps={totalSteps} />
        </div>

        <div className="p-6 text-center">
          <div className="text-6xl mb-4">{message.sticker}</div>

          <h2 className="text-xl font-bold text-slate-600 mb-3">
            {message.title}
          </h2>

          <p className="text-gray-600 mb-6">
            {message.body}
          </p>

          <PhotoDisplay src={message.photo} />

          <button onClick={isLast ? onClose : onNext} className="kawaii-btn">
            {isLast ? 'Restart 🔄' : 'Next 🩶'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [step, setStep] = useState(-1);
  const [isExiting, setIsExiting] = useState(false);

  const open = () => setStep(0);

  const next = () => {
    setIsExiting(true);
    setTimeout(() => {
      setStep(s => s + 1);
      setIsExiting(false);
    }, 300);
  };

  const close = () => {
    setIsExiting(true);
    setTimeout(() => {
      setStep(-1);
      setIsExiting(false);
    }, 300);
  };

  return (
    <main className="kawaii-cursor min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <BackgroundScene />
      <SparkleTrail />

      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-600 mb-6">
          🎀 A Little Surprise 🎀
        </h1>

        {step === -1 && <Envelope onOpen={open} />}
      </div>

      {step >= 0 && (
        <MessagePopup
          message={MESSAGES[step]}
          step={step}
          totalSteps={MESSAGES.length}
          onNext={next}
          onClose={close}
          isExiting={isExiting}
        />
      )}

      <footer className="absolute bottom-4 text-slate-400 text-sm">
        With Love from Priyanshi
      </footer>
    </main>
  );
}

// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';

// const MESSAGES = [
//   {
//     title: "Happy Birthday Shiyanyaaaaa!",
//     body: "⸜(｡˃ ᵕ ˂ )⸝♡",
//     sticker: "🎂",
//   },
//   {
//     title: "I'm really glad to meet you…",
//     body: "ILY <3<3<3",
//     sticker: "૮ ྀིᴗ͈ . ᴗ͈ ྀིა",
//   },
//   {
//     title: "💌",
//     body: "Thanks for being my friend. We don't have much in common but I really like your vibe, your unhingedness and your unfilter self!! 😭",
//     sticker: "ദ്ദി( •̀ ᴗ - ) ✧",
//   },
//   {
//     title: "You're a gem ⊹ ࣪ ˖",
//     body: "Keeping shinning and being yourself. Here's to more laughs and more memoriess! p.s. I'll really miss your laugh 😭🫶",
//     sticker: "⊹₊˚‧︵‿₊୨ᰔ୧₊‿︵‧˚₊⊹",
//   },
// ];

// interface Sparkle {
//   id: number;
//   x: number;
//   y: number;
//   createdAt: number;
// }

// function SparkleTrail() {
//   const [sparkles, setSparkles] = useState<Sparkle[]>([]);
//   const sparkleIdRef = useRef(0);
//   const lastSparkleTime = useRef(0);

//   useEffect(() => {
//     // Check for reduced motion preference
//     const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//     if (prefersReducedMotion) return;

//     const handleMouseMove = (e: MouseEvent) => {
//       const now = Date.now();
//       // Throttle sparkle creation (every 50ms)
//       if (now - lastSparkleTime.current < 50) return;
//       lastSparkleTime.current = now;

//       const newSparkle: Sparkle = {
//         id: sparkleIdRef.current++,
//         x: e.clientX,
//         y: e.clientY,
//         createdAt: now,
//       };

//       setSparkles(prev => [...prev.slice(-15), newSparkle]); // Keep max 15 sparkles
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   // Clean up old sparkles
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = Date.now();
//       setSparkles(prev => prev.filter(s => now - s.createdAt < 600));
//     }, 100);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       {sparkles.map(sparkle => (
//         <div
//           key={sparkle.id}
//           className="sparkle-particle"
//           style={{
//             left: sparkle.x - 4,
//             top: sparkle.y - 4,
//             animation: 'sparkle-fade 0.6s ease-out forwards',
//           }}
//         />
//       ))}
//     </>
//   );
// }


// function BackgroundScene() {
//   const [hearts, setHearts] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);
//   const heartIdRef = useRef(0);

//   // Spawn floating hearts periodically
//   useEffect(() => {
//     const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//     if (prefersReducedMotion) return;

//     const spawnHeart = () => {
//       const newHeart = {
//         id: heartIdRef.current++,
//         left: Math.random() * 100,
//         delay: 0,
//         duration: 8 + Math.random() * 4,
//       };
//       setHearts(prev => [...prev.slice(-10), newHeart]);
//     };

    
//     for (let i = 0; i < 3; i++) {
//       setTimeout(spawnHeart, i * 2000);
//     }

//     const interval = setInterval(spawnHeart, 4000);
//     return () => clearInterval(interval);
//   }, []);

  
//   useEffect(() => {
//     const cleanup = setInterval(() => {
//       setHearts(prev => prev.slice(-8));
//     }, 10000);
//     return () => clearInterval(cleanup);
//   }, []);

//   return (
//     <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
//       {/* Shimmer overlay */}
//       <div className="shimmer-overlay" />
      
//       {/* Clouds */}
//       <div 
//         className="cloud"
//         style={{
//           width: 120,
//           height: 40,
//           top: '10%',
//           left: '5%',
//           animation: 'float-cloud 6s ease-in-out infinite',
//         }}
//       />
//       <div 
//         className="cloud"
//         style={{
//           width: 180,
//           height: 50,
//           top: '15%',
//           right: '10%',
//           animation: 'float-cloud-slow 8s ease-in-out infinite',
//           animationDelay: '1s',
//         }}
//       />
//       <div 
//         className="cloud"
//         style={{
//           width: 100,
//           height: 35,
//           top: '25%',
//           left: '60%',
//           animation: 'float-cloud 7s ease-in-out infinite',
//           animationDelay: '2s',
//         }}
//       />
//       <div 
//         className="cloud"
//         style={{
//           width: 150,
//           height: 45,
//           top: '8%',
//           left: '35%',
//           animation: 'float-cloud-slow 9s ease-in-out infinite',
//           animationDelay: '0.5s',
//         }}
//       />

//       {/* Twinkling stars */}
//       {[...Array(12)].map((_, i) => (
//         <div
//           key={i}
//           className="star"
//           style={{
//             top: `${5 + Math.random() * 40}%`,
//             left: `${Math.random() * 100}%`,
//             animationDelay: `${Math.random() * 2}s`,
//             animationDuration: `${1.5 + Math.random() * 1.5}s`,
//           }}
//         />
//       ))}

//       {/* Floating hearts */}
//       {hearts.map(heart => (
//         <div
//           key={heart.id}
//           className="floating-heart"
//           style={{
//             left: `${heart.left}%`,
//             animationDuration: `${heart.duration}s`,
//           }}
//         >
//           💕
//         </div>
//       ))}
//     </div>
//   );
// }


// function ProgressHearts({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
//   return (
//     <div 
//       className="flex gap-2 justify-center mb-4"
//       role="progressbar"
//       aria-valuenow={currentStep + 1}
//       aria-valuemin={1}
//       aria-valuemax={totalSteps}
//       aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
//     >
//       {[...Array(totalSteps)].map((_, i) => (
//         <span
//           key={i}
//           className={`text-2xl transition-all duration-300 ${
//             i <= currentStep ? 'heart-filled' : 'opacity-30 grayscale'
//           }`}
//           style={{ animationDelay: `${i * 0.1}s` }}
//         >
//           {i <= currentStep ? '💖' : '🤍'}
//         </span>
//       ))}
//     </div>
//   );
// }


// function CatIcon() {
//   const [showMeow, setShowMeow] = useState(false);

//   return (
//     <div className="relative inline-block">
//       <button
//         className="text-3xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-full p-1"
//         onMouseEnter={() => setShowMeow(true)}
//         onMouseLeave={() => setShowMeow(false)}
//         onFocus={() => setShowMeow(true)}
//         onBlur={() => setShowMeow(false)}
//         aria-label="Cute cat decoration"
//         type="button"
//       >
//         🐱
//       </button>
//       {showMeow && (
//         <span 
//           className="meow-tooltip absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-full text-sm font-bold text-pink-500 shadow-lg whitespace-nowrap"
//           role="tooltip"
//         >
//           Meow! 💕
//         </span>
//       )}
//     </div>
//   );
// }


// function Envelope({ onOpen }: { onOpen: () => void }) {
//   const [isOpening, setIsOpening] = useState(false);

//   const handleClick = () => {
//     setIsOpening(true);
//     // Trigger the popup after envelope animation
//     setTimeout(onOpen, 500);
//   };

//   return (
//     <button
//       onClick={handleClick}
//       disabled={isOpening}
//       className={`
//         envelope relative w-64 h-48 sm:w-80 sm:h-56 
//         bg-gradient-to-br from-pink-200 to-pink-300 
//         rounded-lg shadow-xl 
//         flex flex-col items-center justify-center gap-2
//         border-4 border-pink-400
//         ${isOpening ? 'envelope-opening' : ''}
//         disabled:cursor-default
//       `}
//       aria-label="Click to open surprise envelope"
//     >
//       {/* Envelope flap */}
//       <div 
//         className="absolute -top-0.5 left-0 right-0 h-20 sm:h-24 bg-gradient-to-b from-pink-300 to-pink-200 rounded-t-lg"
//         style={{
//           clipPath: 'polygon(0 100%, 50% 30%, 100% 100%)',
//         }}
//       />
      
//       {/* Heart seal */}
//       <div className="relative z-10 text-5xl sm:text-6xl sticker mt-4">
//         💌
//       </div>
      
//       {/* Prompt text */}
//       <p className="relative z-10 text-pink-700 font-bold text-sm sm:text-base">
//         Click to open!
//       </p>
      
//       {/* Decorative sparkles */}
//       <span className="absolute top-2 right-2 text-xl">✨</span>
//       <span className="absolute bottom-2 left-2 text-xl">✨</span>
//     </button>
//   );
// }


// interface MessagePopupProps {
//   message: typeof MESSAGES[0];
//   step: number;
//   totalSteps: number;
//   onNext: () => void;
//   onClose: () => void;
//   isExiting: boolean;
// }

// function MessagePopup({ message, step, totalSteps, onNext, onClose, isExiting }: MessagePopupProps) {
//   const isLastStep = step === totalSteps - 1;
//   const popupRef = useRef<HTMLDivElement>(null);

//   // Focus trap for accessibility
//   useEffect(() => {
//     const popup = popupRef.current;
//     if (popup) {
//       const focusableElements = popup.querySelectorAll<HTMLElement>(
//         'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
//       );
//       const firstElement = focusableElements[0];
//       const lastElement = focusableElements[focusableElements.length - 1];
      
//       firstElement?.focus();

//       const handleKeyDown = (e: KeyboardEvent) => {
//         if (e.key === 'Tab') {
//           if (e.shiftKey && document.activeElement === firstElement) {
//             e.preventDefault();
//             lastElement?.focus();
//           } else if (!e.shiftKey && document.activeElement === lastElement) {
//             e.preventDefault();
//             firstElement?.focus();
//           }
//         }
//         if (e.key === 'Escape') {
//           onClose();
//         }
//       };

//       document.addEventListener('keydown', handleKeyDown);
//       return () => document.removeEventListener('keydown', handleKeyDown);
//     }
//   }, [onClose]);

//   return (
//     <div 
//       className="fixed inset-0 flex items-center justify-center z-50 p-4"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="popup-title"
//     >
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-black/30 backdrop-blur-sm"
//         onClick={onClose}
//         aria-hidden="true"
//       />
      
//       {/* Popup card */}
//       <div 
//         ref={popupRef}
//         className={`
//           relative bg-white rounded-2xl shadow-2xl 
//           w-full max-w-md overflow-hidden
//           ${isExiting ? 'popup-exiting' : 'popup-entering'}
//         `}
//       >
//         {/* Top bar with hearts decoration */}
//         <div className="bg-gradient-to-r from-pink-400 via-pink-300 to-pink-400 p-3 flex items-center justify-between">
//           <div className="flex gap-1">
//             <span>💖</span>
//             <span>💕</span>
//             <span>💖</span>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-pink-500 font-bold flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
//             aria-label="Close popup"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Progress hearts */}
//         <div className="pt-4">
//           <ProgressHearts currentStep={step} totalSteps={totalSteps} />
//         </div>

//         {/* Message content */}
//         <div className="p-6 text-center">
//           {/* Sticker */}
//           <div className="text-6xl mb-4 sticker">
//             {message.sticker}
//           </div>
          
//           {/* Title */}
//           <h2 
//             id="popup-title"
//             className="text-xl sm:text-2xl font-extrabold text-pink-600 mb-3"
//           >
//             {message.title}
//           </h2>
          
//           {/* Body */}
//           <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
//             {message.body}
//           </p>

//           {/* Action buttons */}
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             {isLastStep ? (
//               <button
//                 onClick={onClose}
//                 className="kawaii-btn"
//               >
//                 Restart 🔄
//               </button>
//             ) : (
//               <button
//                 onClick={onNext}
//                 className="kawaii-btn"
//               >
//                 Next 💕
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Bottom decoration */}
//         <div className="h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300" />
//       </div>
//     </div>
//   );
// }


// export default function BirthdaySurprisePage() {
//   // State management
//   const [currentStep, setCurrentStep] = useState(-1); // -1 = envelope view
//   const [isExiting, setIsExiting] = useState(false);
//   const [showSparkles, setShowSparkles] = useState(false);

//   // Handle envelope open
//   const handleEnvelopeOpen = useCallback(() => {
//     setShowSparkles(true);
//     setCurrentStep(0);
//     setTimeout(() => setShowSparkles(false), 800);
//   }, []);

//   // Handle next message
//   const handleNext = useCallback(() => {
//     setIsExiting(true);
//     setTimeout(() => {
//       setCurrentStep(prev => prev + 1);
//       setIsExiting(false);
//     }, 300);
//   }, []);

//   // Handle close/restart
//   const handleClose = useCallback(() => {
//     setIsExiting(true);
//     setTimeout(() => {
//       setCurrentStep(-1);
//       setIsExiting(false);
//     }, 300);
//   }, []);

//   const showEnvelope = currentStep === -1;
//   const showPopup = currentStep >= 0;

//   return (
//     <main className="kawaii-cursor min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
//       {/* Background scene with clouds, stars, floating hearts */}
//       <BackgroundScene />
      
//       {/* Sparkle trail following cursor */}
//       <SparkleTrail />

//       {/* Sparkle burst effect on open */}
//       {showSparkles && (
//         <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40" aria-hidden="true">
//           {[...Array(8)].map((_, i) => (
//             <span
//               key={i}
//               className="sparkle-burst absolute text-3xl"
//               style={{
//                 transform: `rotate(${i * 45}deg) translateY(-60px)`,
//                 animationDelay: `${i * 0.05}s`,
//               }}
//             >
//               ✨
//             </span>
//           ))}
//         </div>
//       )}

//       {/* Main content area */}
//       <div className="relative z-10 text-center px-4">
//         {/* Header */}
//         <header className="mb-8">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-pink-600 mb-2 drop-shadow-sm">
//             <span className="inline-block animate-bounce" style={{ animationDuration: '2s' }}>🎀</span>
//             {' '}A Little Surprise{' '}
//             <span className="inline-block animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.3s' }}>🎀</span>
//           </h1>
//           <p className="text-pink-500 text-lg">
//             𐔌՞ ܸ.ˬ.ܸ՞𐦯
//           </p>
//         </header>

//         {/* Envelope (shown when no popup is open) */}
//         {showEnvelope && (
//           <div className="flex justify-center">
//             <Envelope onOpen={handleEnvelopeOpen} />
//           </div>
//         )}
//       </div>

//       {/* Message popup */}
//       {showPopup && (
//         <MessagePopup
//           message={MESSAGES[currentStep]}
//           step={currentStep}
//           totalSteps={MESSAGES.length}
//           onNext={handleNext}
//           onClose={handleClose}
//           isExiting={isExiting}
//         />
//       )}

//       {/* Footer */}
//       <footer className="absolute bottom-4 text-center text-pink-400 text-sm">
//         <p>With Love from Priyanshi</p>
//       </footer>
//     </main>
//   );
// }
