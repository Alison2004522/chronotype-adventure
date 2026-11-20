// build_assets.js
// Generates SVG graphics and sound files for 《名畫變裝大師》（Masterpiece Makeover）

const fs = require('fs');
const path = require('path');

const propsDir = path.join(__dirname, 'assets', 'props');
const charsDir = path.join(__dirname, 'assets', 'characters');
const soundsDir = path.join(__dirname, 'assets', 'sounds');
const paintingsDir = path.join(__dirname, 'assets', 'paintings');

[propsDir, charsDir, soundsDir, paintingsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function writeSvg(filePath, content) {
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  console.log('Created:', path.relative(__dirname, filePath));
}

// -------------------------------------------------------------
// 1. PROPS SVGs (20 款精美日系手繪日常道具)
// -------------------------------------------------------------

writeSvg(path.join(propsDir, 'blue_towel.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="100%" height="100%">
  <defs>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4A90E2"/>
      <stop offset="50%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.25"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <path d="M 30,105 C 15,60 45,20 100,20 C 155,20 185,60 170,105 C 160,115 140,118 100,118 C 60,118 40,115 30,105 Z" 
          fill="url(#blueGrad)" stroke="#1E3A8A" stroke-width="4" stroke-linejoin="round"/>
    <path d="M 40,75 C 65,45 135,45 160,75" fill="none" stroke="#60A5FA" stroke-width="5" stroke-linecap="round"/>
    <path d="M 45,90 C 75,65 125,65 155,90" fill="none" stroke="#1E3A8A" stroke-width="3" stroke-linecap="round"/>
    <path d="M 32,102 C 55,115 145,115 168,102" fill="none" stroke="#93C5FD" stroke-width="6" stroke-linecap="round"/>
    <rect x="155" y="98" width="12" height="16" rx="2" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" transform="rotate(15 155 98)"/>
    <line x1="158" y1="104" x2="164" y2="104" stroke="#CBD5E1" stroke-width="1"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'yellow_cloth.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 220" width="100%" height="100%">
  <defs>
    <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 80,15 C 110,25 130,60 125,120 C 120,170 95,205 75,210 C 65,212 55,190 60,150 C 65,110 50,60 80,15 Z"
          fill="url(#yellowGrad)" stroke="#B45309" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M 85,25 C 105,65 105,130 90,185" fill="none" stroke="#FDE68A" stroke-width="4" stroke-linecap="round"/>
    <path d="M 70,70 C 80,110 80,160 70,195" fill="none" stroke="#92400E" stroke-width="2" stroke-linecap="round"/>
    <circle cx="72" cy="208" r="4" fill="#FCD34D" stroke="#B45309" stroke-width="1.5"/>
    <circle cx="82" cy="206" r="4" fill="#FCD34D" stroke="#B45309" stroke-width="1.5"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'pearl_earring.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130" width="100%" height="100%">
  <defs>
    <radialGradient id="pearlGleam" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="35%" stop-color="#F8FAFC"/>
      <stop offset="70%" stop-color="#CBD5E1"/>
      <stop offset="90%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#475569"/>
    </radialGradient>
    <filter id="pearlGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <g filter="url(#pearlGlow)">
    <path d="M 48,15 C 48,8 58,8 58,18 L 52,42" fill="none" stroke="#D97706" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="51" cy="42" r="3.5" fill="#F59E0B" stroke="#B45309" stroke-width="1"/>
    <path d="M 50,42 C 68,42 76,65 74,85 C 72,108 58,118 50,118 C 42,118 28,108 26,85 C 24,65 32,42 50,42 Z"
          fill="url(#pearlGleam)" stroke="#64748B" stroke-width="2.5"/>
    <ellipse cx="42" cy="62" rx="6" ry="10" transform="rotate(-25 42 62)" fill="#FFFFFF" opacity="0.9"/>
    <circle cx="48" cy="82" r="3" fill="#FFFFFF" opacity="0.75"/>
    <path d="M 34,92 C 40,110 60,110 66,95" fill="none" stroke="#E2E8F0" stroke-width="2.5" opacity="0.6"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'red_cap.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140" width="100%" height="100%">
  <defs>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EF4444"/>
      <stop offset="100%" stop-color="#B91C1C"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 40,90 C 35,40 70,25 90,25 C 110,25 145,40 140,90 Z" fill="url(#redGrad)" stroke="#7F1D1D" stroke-width="4"/>
    <path d="M 30,90 C 30,85 100,85 160,95 C 165,108 120,118 30,105 Z" fill="#DC2626" stroke="#7F1D1D" stroke-width="3.5" stroke-linejoin="round"/>
    <circle cx="90" cy="24" r="6" fill="#FEE2E2" stroke="#7F1D1D" stroke-width="2"/>
    <circle cx="70" cy="55" r="3" fill="#7F1D1D"/>
    <circle cx="110" cy="55" r="3" fill="#7F1D1D"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'sunglasses.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="100%" height="100%">
  <defs>
    <linearGradient id="lensGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 65,30 Q 80,24 95,30" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
    <rect x="20" y="22" width="48" height="38" rx="14" fill="url(#lensGrad)" stroke="#F59E0B" stroke-width="3.5"/>
    <rect x="92" y="22" width="48" height="38" rx="14" fill="url(#lensGrad)" stroke="#F59E0B" stroke-width="3.5"/>
    <path d="M 28,28 L 52,52" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
    <path d="M 38,26 L 56,44" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.9"/>
    <path d="M 100,28 L 124,52" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
    <path d="M 110,26 L 128,44" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.9"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'flower_hairpin.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <g transform="translate(60,60)">
    <path d="M 15,-15 C 35,-35 45,-15 35,5 Z" fill="#22C55E" stroke="#15803D" stroke-width="2"/>
    <path d="M -15,15 C -35,35 -45,15 -35,-5 Z" fill="#16A34A" stroke="#15803D" stroke-width="2"/>
    <circle cx="0" cy="-22" r="16" fill="#F472B6" stroke="#DB2777" stroke-width="2.5"/>
    <circle cx="21" cy="-7" r="16" fill="#F472B6" stroke="#DB2777" stroke-width="2.5"/>
    <circle cx="13" cy="18" r="16" fill="#F472B6" stroke="#DB2777" stroke-width="2.5"/>
    <circle cx="-13" cy="18" r="16" fill="#F472B6" stroke="#DB2777" stroke-width="2.5"/>
    <circle cx="-21" cy="-7" r="16" fill="#F472B6" stroke="#DB2777" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="12" fill="#FBBF24" stroke="#D97706" stroke-width="2.5"/>
    <circle cx="-3" cy="-3" r="2" fill="#FFFFFF"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'white_bonnet.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="100%" height="100%">
  <defs>
    <linearGradient id="whiteCloth" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="80%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 35,95 C 25,50 50,20 100,20 C 150,20 175,50 165,95 C 150,110 50,110 35,95 Z"
          fill="url(#whiteCloth)" stroke="#94A3B8" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M 32,85 C 15,95 20,135 45,130 C 52,128 50,105 45,95 Z"
          fill="#FFFFFF" stroke="#94A3B8" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 168,85 C 185,95 180,135 155,130 C 148,128 150,105 155,95 Z"
          fill="#F8FAFC" stroke="#94A3B8" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 60,40 C 100,50 140,40 140,40" fill="none" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
    <path d="M 45,75 C 100,90 155,75 155,75" fill="none" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'blue_apron.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="100%" height="100%">
  <defs>
    <linearGradient id="apronBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="50%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
  </defs>
  <g>
    <rect x="45" y="40" width="110" height="20" rx="6" fill="#1E40AF" stroke="#172554" stroke-width="3"/>
    <path d="M 45,50 C 20,60 10,90 15,120" fill="none" stroke="#1E40AF" stroke-width="3" stroke-dasharray="4,4"/>
    <path d="M 155,50 C 180,60 190,90 185,120" fill="none" stroke="#1E40AF" stroke-width="3" stroke-dasharray="4,4"/>
    <path d="M 48,58 L 25,200 C 25,225 175,225 175,200 L 152,58 Z"
          fill="url(#apronBlue)" stroke="#172554" stroke-width="4" stroke-linejoin="round"/>
    <rect x="75" y="105" width="50" height="55" rx="8" fill="#1D4ED8" stroke="#172554" stroke-width="2.5"/>
    <path d="M 75,105 L 125,105" stroke="#93C5FD" stroke-width="3"/>
    <path d="M 60,75 C 65,130 55,185 50,210" fill="none" stroke="#1E40AF" stroke-width="3" stroke-linecap="round"/>
    <path d="M 140,75 C 135,130 145,185 150,210" fill="none" stroke="#60A5FA" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'milk_jug.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200" width="100%" height="100%">
  <defs>
    <linearGradient id="jugClay" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D97706"/>
      <stop offset="50%" stop-color="#B45309"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 45,55 C 15,55 15,115 45,125" fill="none" stroke="#92400E" stroke-width="10" stroke-linecap="round"/>
    <path d="M 45,55 C 20,55 20,115 45,125" fill="none" stroke="#B45309" stroke-width="6" stroke-linecap="round"/>
    <path d="M 50,45 L 95,45 C 110,70 120,95 110,135 C 105,155 90,165 72,165 C 55,165 40,155 35,135 C 25,95 38,70 50,45 Z"
          fill="url(#jugClay)" stroke="#451A03" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M 48,65 C 42,95 48,130 55,145" fill="none" stroke="#FDE68A" stroke-width="3.5" stroke-linecap="round" opacity="0.8"/>
    <ellipse cx="72" cy="45" rx="22" ry="7" fill="#78350F" stroke="#451A03" stroke-width="2"/>
    <ellipse cx="72" cy="45" rx="16" ry="4" fill="#FEF3C7"/>
    <path d="M 88,48 C 115,70 125,120 120,190 C 117,192 112,192 112,185 C 116,125 105,80 82,53 Z"
          fill="#FFFBEB" stroke="#FDE68A" stroke-width="1.5"/>
    <circle cx="121" cy="195" r="3" fill="#FFFBEB"/>
    <circle cx="114" cy="198" r="2" fill="#FFFBEB"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'bread_basket.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140" width="100%" height="100%">
  <defs>
    <linearGradient id="crustGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="60%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#92400E"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 45,70 C 45,30 135,30 135,70 Z" fill="url(#crustGrad)" stroke="#78350F" stroke-width="3.5"/>
    <path d="M 65,45 Q 75,55 70,68" stroke="#FEF3C7" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 90,40 Q 100,52 95,68" stroke="#FEF3C7" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 115,45 Q 125,55 120,68" stroke="#FEF3C7" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 30,68 L 45,115 C 50,128 130,128 135,115 L 150,68 Z"
          fill="#B45309" stroke="#78350F" stroke-width="3.5" stroke-linejoin="round"/>
    <ellipse cx="90" cy="68" rx="60" ry="12" fill="#D97706" stroke="#78350F" stroke-width="3"/>
    <path d="M 50,85 L 130,85" stroke="#78350F" stroke-width="2.5" stroke-dasharray="6,4"/>
    <path d="M 58,102 L 122,102" stroke="#78350F" stroke-width="2.5" stroke-dasharray="6,4"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'soccer_ball.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="100%" height="100%">
  <g>
    <circle cx="70" cy="70" r="55" fill="#F8FAFC" stroke="#1E293B" stroke-width="4"/>
    <polygon points="70,52 85,63 80,81 60,81 55,63" fill="#1E293B"/>
    <line x1="70" y1="52" x2="70" y2="28" stroke="#1E293B" stroke-width="3"/>
    <line x1="85" y1="63" x2="110" y2="55" stroke="#1E293B" stroke-width="3"/>
    <line x1="80" y1="81" x2="102" y2="105" stroke="#1E293B" stroke-width="3"/>
    <line x1="60" y1="81" x2="38" y2="105" stroke="#1E293B" stroke-width="3"/>
    <line x1="55" y1="63" x2="30" y2="55" stroke="#1E293B" stroke-width="3"/>
    <ellipse cx="50" cy="40" rx="14" ry="7" fill="#FFFFFF" opacity="0.6" transform="rotate(-30 50 40)"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'toy_car.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120" width="100%" height="100%">
  <g>
    <path d="M 25,85 L 25,65 C 35,65 45,55 60,35 C 75,30 115,30 135,50 C 150,55 160,65 160,85 Z"
          fill="#EF4444" stroke="#991B1B" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M 65,40 L 105,40 L 128,55 L 65,55 Z" fill="#7DD3FC" stroke="#0284C7" stroke-width="2"/>
    <circle cx="155" cy="72" r="6" fill="#FDE047" stroke="#CA8A04" stroke-width="1.5"/>
    <circle cx="55" cy="88" r="18" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
    <circle cx="55" cy="88" r="7" fill="#94A3B8"/>
    <circle cx="130" cy="88" r="18" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
    <circle cx="130" cy="88" r="7" fill="#94A3B8"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'plush_bear.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 160" width="100%" height="100%">
  <defs>
    <linearGradient id="bearFur" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
  </defs>
  <g>
    <circle cx="45" cy="40" r="16" fill="url(#bearFur)" stroke="#78350F" stroke-width="3"/>
    <circle cx="45" cy="40" r="8" fill="#FDE68A"/>
    <circle cx="95" cy="40" r="16" fill="url(#bearFur)" stroke="#78350F" stroke-width="3"/>
    <circle cx="95" cy="40" r="8" fill="#FDE68A"/>
    <circle cx="70" cy="110" r="35" fill="url(#bearFur)" stroke="#78350F" stroke-width="3"/>
    <circle cx="70" cy="110" r="20" fill="#FDE68A"/>
    <circle cx="70" cy="62" r="32" fill="url(#bearFur)" stroke="#78350F" stroke-width="3"/>
    <ellipse cx="70" cy="70" rx="14" ry="10" fill="#FEF3C7" stroke="#78350F" stroke-width="2"/>
    <ellipse cx="70" cy="66" rx="5" ry="3.5" fill="#451A03"/>
    <circle cx="58" cy="58" r="4" fill="#1E293B"/>
    <circle cx="57" cy="56" r="1.5" fill="#FFFFFF"/>
    <circle cx="82" cy="58" r="4" fill="#1E293B"/>
    <circle cx="81" cy="56" r="1.5" fill="#FFFFFF"/>
    <polygon points="58,90 70,86 82,90 70,94" fill="#EF4444" stroke="#991B1B" stroke-width="2"/>
    <circle cx="70" cy="90" r="4" fill="#DC2626"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'grey_hat.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" width="100%" height="100%">
  <defs>
    <linearGradient id="feltGrey" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#94A3B8"/>
      <stop offset="60%" stop-color="#64748B"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 52,95 C 48,35 68,20 100,20 C 132,20 152,35 148,95 Z"
          fill="url(#feltGrey)" stroke="#334155" stroke-width="4" stroke-linejoin="round"/>
    <path d="M 80,30 C 100,42 120,30 120,30" fill="none" stroke="#334155" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 50,90 C 80,98 120,98 150,90 L 151,102 C 120,110 80,110 49,102 Z"
          fill="#78350F" stroke="#451A03" stroke-width="2"/>
    <path d="M 20,105 C 50,95 150,95 180,105 C 190,115 170,128 100,128 C 30,128 10,115 20,105 Z"
          fill="#64748B" stroke="#334155" stroke-width="4" stroke-linejoin="round"/>
    <line x1="75" y1="55" x2="85" y2="50" stroke="#F97316" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="110" y1="60" x2="120" y2="55" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="90" y1="75" x2="105" y2="72" stroke="#FDE047" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'blue_jacket.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" width="100%" height="100%">
  <defs>
    <linearGradient id="jacketBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="50%" stop-color="#1E40AF"/>
      <stop offset="100%" stop-color="#1E3A8A"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 60,35 L 20,120 L 40,210 L 180,210 L 200,120 L 160,35 C 130,55 90,55 60,35 Z"
          fill="url(#jacketBlue)" stroke="#0F172A" stroke-width="4" stroke-linejoin="round"/>
    <path d="M 60,35 L 85,115 L 110,65 Z" fill="#1D4ED8" stroke="#0F172A" stroke-width="3"/>
    <path d="M 160,35 L 135,115 L 110,65 Z" fill="#1D4ED8" stroke="#0F172A" stroke-width="3"/>
    <circle cx="110" cy="135" r="5" fill="#F59E0B" stroke="#B45309" stroke-width="2"/>
    <circle cx="110" cy="170" r="5" fill="#F59E0B" stroke="#B45309" stroke-width="2"/>
    <line x1="50" y1="130" x2="65" y2="155" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="170" y1="130" x2="155" y2="155" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="80" y1="175" x2="95" y2="195" stroke="#60A5FA" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="140" y1="175" x2="125" y2="195" stroke="#60A5FA" stroke-width="2.5" stroke-linecap="round"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'white_scarf.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" width="100%" height="100%">
  <defs>
    <linearGradient id="scarfWhite" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 40,30 C 40,15 120,15 120,30 C 130,45 130,70 120,80 C 100,90 60,90 40,80 C 30,70 30,45 40,30 Z"
          fill="url(#scarfWhite)" stroke="#94A3B8" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M 70,75 L 60,130 L 95,130 L 88,75 Z"
          fill="#F8FAFC" stroke="#94A3B8" stroke-width="3" stroke-linejoin="round"/>
    <line x1="65" y1="130" x2="65" y2="136" stroke="#94A3B8" stroke-width="2"/>
    <line x1="75" y1="130" x2="75" y2="136" stroke="#94A3B8" stroke-width="2"/>
    <line x1="85" y1="130" x2="85" y2="136" stroke="#94A3B8" stroke-width="2"/>
    <line x1="90" y1="130" x2="90" y2="136" stroke="#94A3B8" stroke-width="2"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'red_baseball_cap.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 130" width="100%" height="100%">
  <g>
    <path d="M 45,85 C 40,35 80,25 90,25 C 100,25 140,35 135,85 Z" fill="#DC2626" stroke="#7F1D1D" stroke-width="4"/>
    <rect x="25" y="85" width="130" height="20" rx="8" fill="#B91C1C" stroke="#7F1D1D" stroke-width="3"/>
    <circle cx="125" cy="95" r="6" fill="#FBBF24" stroke="#D97706" stroke-width="1.5"/>
    <circle cx="90" cy="55" r="14" fill="#FFFFFF"/>
    <path d="M 85,55 L 90,45 L 95,55 L 85,55 Z" fill="#DC2626"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'yellow_raincoat.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" width="100%" height="100%">
  <defs>
    <linearGradient id="raincoatYellow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FACC15"/>
      <stop offset="100%" stop-color="#EAB308"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 50,45 C 50,20 150,20 150,45 Z" fill="#FDE047" stroke="#CA8A04" stroke-width="3"/>
    <path d="M 45,45 L 20,130 L 35,210 L 165,210 L 180,130 L 155,45 Z"
          fill="url(#raincoatYellow)" stroke="#A16207" stroke-width="4" stroke-linejoin="round"/>
    <rect x="90" y="75" width="20" height="8" rx="4" fill="#78350F"/>
    <rect x="90" y="115" width="20" height="8" rx="4" fill="#78350F"/>
    <rect x="90" y="155" width="20" height="8" rx="4" fill="#78350F"/>
    <ellipse cx="65" cy="110" rx="3" ry="6" fill="#67E8F9" opacity="0.8"/>
    <ellipse cx="145" cy="140" rx="3" ry="6" fill="#67E8F9" opacity="0.8"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'palette.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 150" width="100%" height="100%">
  <defs>
    <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="60%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 40,80 C 20,40 60,15 110,20 C 160,25 175,70 155,110 C 135,145 90,145 70,125 C 60,115 50,115 40,125 C 25,130 20,105 40,80 Z"
          fill="url(#woodGrad)" stroke="#78350F" stroke-width="3.5" stroke-linejoin="round"/>
    <ellipse cx="50" cy="115" rx="10" ry="14" fill="#FEF3C7" stroke="#78350F" stroke-width="2.5" transform="rotate(20 50 115)"/>
    <circle cx="75" cy="35" r="10" fill="#EF4444" stroke="#B91C1C" stroke-width="1.5"/>
    <circle cx="105" cy="32" r="10" fill="#F59E0B" stroke="#D97706" stroke-width="1.5"/>
    <circle cx="135" cy="45" r="10" fill="#3B82F6" stroke="#1D4ED8" stroke-width="1.5"/>
    <circle cx="150" cy="75" r="10" fill="#22C55E" stroke="#15803D" stroke-width="1.5"/>
    <circle cx="140" cy="105" r="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <line x1="30" y1="30" x2="130" y2="130" stroke="#78350F" stroke-width="6" stroke-linecap="round"/>
    <polygon points="25,25 35,35 25,40" fill="#3B82F6"/>
  </g>
</svg>
`);

writeSvg(path.join(propsDir, 'brown_jacket.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" width="100%" height="100%">
  <defs>
    <linearGradient id="brownShawl" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B45309"/>
      <stop offset="60%" stop-color="#92400E"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
  </defs>
  <g>
    <path d="M 55,30 C 40,90 20,150 25,210 L 175,210 C 180,150 160,90 145,30 C 120,48 80,48 55,30 Z"
          fill="url(#brownShawl)" stroke="#451A03" stroke-width="4" stroke-linejoin="round"/>
    <path d="M 75,36 C 85,55 115,55 125,36" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
    <path d="M 65,85 C 85,140 80,190 75,210" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>
`);

console.log('Props generated successfully!');

// -------------------------------------------------------------
// 2. CHARACTER SVGs
// -------------------------------------------------------------

writeSvg(path.join(charsDir, 'chibi_artist_neutral.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="100%" height="100%">
  <defs>
    <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF0E5"/>
      <stop offset="100%" stop-color="#FCD5CE"/>
    </linearGradient>
    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6F4E37"/>
      <stop offset="100%" stop-color="#4A3525"/>
    </linearGradient>
  </defs>
  <g id="character-root">
    <path d="M 110,230 L 90,360 L 230,360 L 210,230 Z" fill="#E2E8F0" stroke="#334155" stroke-width="4"/>
    <line x1="125" y1="230" x2="120" y2="360" stroke="#CBD5E1" stroke-width="6"/>
    <line x1="195" y1="230" x2="200" y2="360" stroke="#CBD5E1" stroke-width="6"/>
    <rect x="140" y="200" width="40" height="35" rx="6" fill="url(#skinGrad)" stroke="#334155" stroke-width="3"/>
    <ellipse cx="160" cy="140" rx="75" ry="70" fill="url(#skinGrad)" stroke="#334155" stroke-width="4"/>
    <circle cx="85" cy="142" r="16" fill="url(#skinGrad)" stroke="#334155" stroke-width="3"/>
    <circle cx="235" cy="142" r="16" fill="url(#skinGrad)" stroke="#334155" stroke-width="3"/>
    <ellipse cx="115" cy="155" rx="14" ry="9" fill="#FF8A8A" opacity="0.6"/>
    <ellipse cx="205" cy="155" rx="14" ry="9" fill="#FF8A8A" opacity="0.6"/>
    <ellipse cx="125" cy="135" rx="10" ry="14" fill="#2B2D42"/>
    <circle cx="122" cy="130" r="4.5" fill="#FFFFFF"/>
    <ellipse cx="195" cy="135" rx="10" ry="14" fill="#2B2D42"/>
    <circle cx="192" cy="130" r="4.5" fill="#FFFFFF"/>
    <path d="M 115,115 Q 128,110 138,115" fill="none" stroke="#4A3525" stroke-width="3" stroke-linecap="round"/>
    <path d="M 182,115 Q 192,110 205,115" fill="none" stroke="#4A3525" stroke-width="3" stroke-linecap="round"/>
    <path d="M 150,165 Q 160,175 170,165" fill="none" stroke="#7A3E26" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 85,120 C 85,60 235,60 235,120 C 215,95 195,115 160,95 C 125,115 105,95 85,120 Z"
          fill="url(#hairGrad)" stroke="#334155" stroke-width="4" stroke-linejoin="round"/>
  </g>
</svg>
`);

writeSvg(path.join(charsDir, 'pose_pearl_target.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="100%" height="100%">
  <defs>
    <linearGradient id="skin1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF3EB"/><stop offset="100%" stop-color="#FED7CE"/>
    </linearGradient>
    <linearGradient id="hair1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6B4423"/><stop offset="100%" stop-color="#422814"/>
    </linearGradient>
  </defs>
  <g id="chibi-pearl">
    <path d="M 100,230 C 80,260 70,360 70,370 L 220,370 C 230,340 240,280 200,230 C 170,210 130,210 100,230 Z" fill="#D97706" stroke="#451A03" stroke-width="4" stroke-linejoin="round"/>
    <path d="M 120,215 C 135,230 165,230 180,215" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
    <rect x="130" y="190" width="36" height="35" rx="8" fill="url(#skin1)" stroke="#451A03" stroke-width="3" transform="rotate(-8 148 207)"/>
    <ellipse cx="150" cy="135" rx="72" ry="68" fill="url(#skin1)" stroke="#451A03" stroke-width="4" transform="rotate(-5 150 135)"/>
    <ellipse cx="185" cy="150" rx="14" ry="8" fill="#FF8A8A" opacity="0.6"/>
    <ellipse cx="110" cy="150" rx="10" ry="6" fill="#FF8A8A" opacity="0.5"/>
    <ellipse cx="218" cy="138" rx="15" ry="18" fill="url(#skin1)" stroke="#451A03" stroke-width="3" transform="rotate(10 218 138)"/>
    <ellipse cx="135" cy="130" rx="11" ry="15" fill="#2B2D42"/>
    <circle cx="132" cy="124" r="5" fill="#FFFFFF"/>
    <ellipse cx="185" cy="130" rx="11" ry="15" fill="#2B2D42"/>
    <circle cx="182" cy="124" r="5" fill="#FFFFFF"/>
    <path d="M 122,110 Q 135,104 148,110" fill="none" stroke="#422814" stroke-width="3" stroke-linecap="round"/>
    <path d="M 172,110 Q 185,104 198,110" fill="none" stroke="#422814" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="160" cy="162" rx="7" ry="4" fill="#EF4444" opacity="0.8"/>
    <circle cx="159" cy="161" r="1.5" fill="#FFFFFF" opacity="0.9"/>
    <path d="M 85,120 C 80,60 215,60 220,120 C 205,90 175,100 150,85 C 120,100 95,90 85,120 Z" fill="url(#hair1)" stroke="#451A03" stroke-width="4"/>
  </g>
</svg>
`);

writeSvg(path.join(charsDir, 'pose_milkmaid_target.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="100%" height="100%">
  <defs>
    <linearGradient id="skin2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF0E5"/><stop offset="100%" stop-color="#FCD5CE"/>
    </linearGradient>
    <linearGradient id="bodice" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
  </defs>
  <g id="chibi-milkmaid">
    <path d="M 105,220 L 80,370 L 240,370 L 215,220 Z" fill="url(#bodice)" stroke="#78350F" stroke-width="4" stroke-linejoin="round"/>
    <rect x="75" y="350" width="170" height="25" fill="#B91C1C" stroke="#7F1D1D" stroke-width="2"/>
    <path d="M 90,225 C 75,260 90,300 120,310" fill="none" stroke="#15803D" stroke-width="18" stroke-linecap="round"/>
    <path d="M 230,225 C 245,260 230,300 200,310" fill="none" stroke="#15803D" stroke-width="18" stroke-linecap="round"/>
    <path d="M 120,310 L 140,320" fill="none" stroke="url(#skin2)" stroke-width="12" stroke-linecap="round"/>
    <path d="M 200,310 L 180,320" fill="none" stroke="url(#skin2)" stroke-width="12" stroke-linecap="round"/>
    <ellipse cx="160" cy="135" rx="72" ry="68" fill="url(#skin2)" stroke="#451A03" stroke-width="4"/>
    <ellipse cx="120" cy="155" rx="14" ry="8" fill="#FF8A8A" opacity="0.6"/>
    <ellipse cx="200" cy="155" rx="14" ry="8" fill="#FF8A8A" opacity="0.6"/>
    <path d="M 120,135 Q 132,145 144,135" fill="none" stroke="#2B2D42" stroke-width="4" stroke-linecap="round"/>
    <path d="M 176,135 Q 188,145 200,135" fill="none" stroke="#2B2D42" stroke-width="4" stroke-linecap="round"/>
    <path d="M 118,120 Q 132,116 144,122" fill="none" stroke="#451A03" stroke-width="3" stroke-linecap="round"/>
    <path d="M 176,122 Q 188,116 202,120" fill="none" stroke="#451A03" stroke-width="3" stroke-linecap="round"/>
    <path d="M 152,165 Q 160,172 168,165" fill="none" stroke="#78350F" stroke-width="3" stroke-linecap="round"/>
    <path d="M 88,110 C 88,60 232,60 232,110 C 210,85 180,95 160,85 C 140,95 110,85 88,110 Z" fill="#78350F" stroke="#451A03" stroke-width="4"/>
  </g>
</svg>
`);

writeSvg(path.join(charsDir, 'pose_vangogh_target.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="100%" height="100%">
  <defs>
    <linearGradient id="skin3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF4E6"/><stop offset="100%" stop-color="#FED7AA"/>
    </linearGradient>
    <linearGradient id="beardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EA580C"/><stop offset="100%" stop-color="#C2410C"/>
    </linearGradient>
  </defs>
  <g id="chibi-vangogh">
    <path d="M 100,230 L 70,380 L 250,380 L 220,230 Z" fill="#1E3A8A" stroke="#0F172A" stroke-width="4" stroke-linejoin="round"/>
    <rect x="135" y="190" width="45" height="42" rx="6" fill="url(#skin3)" stroke="#0F172A" stroke-width="3"/>
    <ellipse cx="158" cy="135" rx="70" ry="68" fill="url(#skin3)" stroke="#0F172A" stroke-width="4"/>
    <path d="M 115,160 C 110,195 140,210 160,210 C 180,210 205,195 200,160 C 190,175 130,175 115,160 Z" fill="url(#beardGrad)" stroke="#9A3412" stroke-width="3"/>
    <path d="M 135,162 Q 158,168 180,162 Q 158,155 135,162 Z" fill="#C2410C" stroke="#9A3412" stroke-width="2"/>
    <ellipse cx="118" cy="150" rx="10" ry="7" fill="#FB923C" opacity="0.6"/>
    <ellipse cx="198" cy="150" rx="10" ry="7" fill="#FB923C" opacity="0.6"/>
    <ellipse cx="130" cy="128" rx="11" ry="13" fill="#047857" stroke="#065F46" stroke-width="2"/>
    <circle cx="130" cy="128" r="6" fill="#064E3B"/>
    <circle cx="127" cy="124" r="3.5" fill="#FFFFFF"/>
    <ellipse cx="185" cy="128" rx="11" ry="13" fill="#047857" stroke="#065F46" stroke-width="2"/>
    <circle cx="185" cy="128" r="6" fill="#064E3B"/>
    <circle cx="182" cy="124" r="3.5" fill="#FFFFFF"/>
    <path d="M 118,110 L 145,115" stroke="#9A3412" stroke-width="4" stroke-linecap="round"/>
    <path d="M 198,110 L 170,115" stroke="#9A3412" stroke-width="4" stroke-linecap="round"/>
    <line x1="150" y1="175" x2="166" y2="175" stroke="#7C2D12" stroke-width="3" stroke-linecap="round"/>
    <path d="M 88,115 C 88,60 228,60 228,115 C 205,88 180,95 158,85 C 135,95 110,88 88,115 Z" fill="url(#beardGrad)" stroke="#9A3412" stroke-width="3.5"/>
  </g>
</svg>
`);

console.log('Character pose SVGs generated!');

// -------------------------------------------------------------
// 3. SOUND EFFECTS GENERATOR
// -------------------------------------------------------------

function createWavBuffer(sampleRate, durationSec, waveformFn) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataByteSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataByteSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataByteSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataByteSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, waveformFn(t, durationSec)));
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

const SR = 22050;

fs.writeFileSync(path.join(soundsDir, 'click.wav'), createWavBuffer(SR, 0.06, (t, dur) => {
  const env = Math.exp(-t * 80);
  return Math.sin(2 * Math.PI * 800 * t) * env;
}));

fs.writeFileSync(path.join(soundsDir, 'snap.wav'), createWavBuffer(SR, 0.12, (t, dur) => {
  const env = Math.exp(-t * 30);
  const freq = 400 + 600 * (1 - t / dur);
  return Math.sin(2 * Math.PI * freq * t) * env;
}));

fs.writeFileSync(path.join(soundsDir, 'score.wav'), createWavBuffer(SR, 0.35, (t, dur) => {
  const env = Math.exp(-t * 8);
  const freq = t < 0.1 ? 523.25 : t < 0.2 ? 659.25 : 783.99;
  return Math.sin(2 * Math.PI * freq * t) * env;
}));

fs.writeFileSync(path.join(soundsDir, 'success.wav'), createWavBuffer(SR, 0.6, (t, dur) => {
  const env = Math.exp(-t * 5);
  return 0.3 * (
    Math.sin(2 * Math.PI * 523.25 * t) +
    Math.sin(2 * Math.PI * 659.25 * t) +
    Math.sin(2 * Math.PI * 783.99 * t) +
    Math.sin(2 * Math.PI * 1046.50 * t)
  ) * env;
}));

fs.writeFileSync(path.join(soundsDir, 'fanfare.wav'), createWavBuffer(SR, 1.2, (t, dur) => {
  const env = Math.min(1, t * 15) * Math.exp(-t * 2.5);
  const note = t < 0.2 ? 523.25 : t < 0.4 ? 659.25 : t < 0.6 ? 783.99 : 1046.5;
  return (Math.sin(2 * Math.PI * note * t) + 0.4 * Math.sin(2 * Math.PI * note * 2 * t)) * env;
}));

console.log('All SVGs and Sound FX created successfully!');
