// build_chronotype_assets.js
// Generates SVG graphics and sound files for 《生理時鐘大冒險》（Chronotype Adventure）

const fs = require('fs');
const path = require('path');

const charsDir = path.join(__dirname, 'assets', 'characters');
const iconsDir = path.join(__dirname, 'assets', 'icons');
const soundsDir = path.join(__dirname, 'assets', 'sounds');

[charsDir, iconsDir, soundsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function writeSvg(filePath, content) {
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  console.log('Created:', path.relative(__dirname, filePath));
}

// -------------------------------------------------------------
// 1. CHARACTERS (Japanese Cute 2D Vector Style)
// -------------------------------------------------------------

// Inu: Morning Shiba Dog (Warm yellow/orange, sunny bandana, energetic)
writeSvg(path.join(charsDir, 'inu.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" width="100%" height="100%">
  <defs>
    <radialGradient id="inuFur" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FFD68A"/>
      <stop offset="70%" stop-color="#FFA834"/>
      <stop offset="100%" stop-color="#E68A00"/>
    </radialGradient>
    <linearGradient id="inuBandana" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5252"/>
      <stop offset="100%" stop-color="#E53935"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#8B5E3C" flood-opacity="0.2"/>
    </filter>
  </defs>

  <ellipse cx="100" cy="208" rx="55" ry="10" fill="#E2D4BE" opacity="0.6"/>

  <g filter="url(#softShadow)">
    <path d="M 145,150 Q 185,130 175,100 Q 165,85 150,110 Q 140,125 140,145" 
          fill="#FFA834" stroke="#E68A00" stroke-width="4" stroke-linecap="round"/>
    <path d="M 175,100 Q 170,95 160,105" fill="#FFF5E6"/>

    <ellipse cx="100" cy="155" rx="46" ry="42" fill="url(#inuFur)" stroke="#D97706" stroke-width="4"/>
    <path d="M 82,140 Q 100,165 118,140 Q 100,185 82,140 Z" fill="#FFFBF5"/>

    <path d="M 52,65 Q 40,15 65,25 Q 82,38 78,72 Z" fill="#FFA834" stroke="#D97706" stroke-width="4"/>
    <path d="M 55,60 Q 48,28 65,34 Q 74,45 72,66 Z" fill="#FFC79A"/>
    <path d="M 148,65 Q 160,15 135,25 Q 118,38 122,72 Z" fill="#FFA834" stroke="#D97706" stroke-width="4"/>
    <path d="M 145,60 Q 152,28 135,34 Q 126,45 128,66 Z" fill="#FFC79A"/>

    <circle cx="100" cy="92" r="54" fill="url(#inuFur)" stroke="#D97706" stroke-width="4"/>

    <ellipse cx="80" cy="108" rx="22" ry="18" fill="#FFFBF5"/>
    <ellipse cx="120" cy="108" rx="22" ry="18" fill="#FFFBF5"/>
    <ellipse cx="100" cy="104" rx="24" ry="18" fill="#FFFBF5"/>

    <ellipse cx="68" cy="105" rx="8" ry="5" fill="#FF8A80" opacity="0.6"/>
    <ellipse cx="132" cy="105" rx="8" ry="5" fill="#FF8A80" opacity="0.6"/>

    <ellipse cx="80" cy="72" rx="6" ry="4" fill="#FFFBF5"/>
    <ellipse cx="120" cy="72" rx="6" ry="4" fill="#FFFBF5"/>

    <ellipse cx="82" cy="86" rx="6.5" ry="8" fill="#3E2723"/>
    <circle cx="80" cy="83" r="2.5" fill="#FFFFFF"/>
    <circle cx="84" cy="88" r="1.2" fill="#FFFFFF"/>

    <ellipse cx="118" cy="86" rx="6.5" ry="8" fill="#3E2723"/>
    <circle cx="116" cy="83" r="2.5" fill="#FFFFFF"/>
    <circle cx="120" cy="88" r="1.2" fill="#FFFFFF"/>

    <path d="M 95,96 Q 100,93 105,96 Q 100,103 95,96 Z" fill="#2E1C0C"/>

    <path d="M 94,103 Q 100,107 100,102 Q 100,107 106,103" fill="none" stroke="#2E1C0C" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 96,106 Q 100,116 104,106 Z" fill="#FF6B8B"/>

    <path d="M 72,128 Q 100,146 128,128 Q 100,165 72,128 Z" fill="url(#inuBandana)" stroke="#B71C1C" stroke-width="2.5"/>
    <circle cx="100" cy="136" r="4.5" fill="#FFD54F"/>
    <circle cx="100" cy="136" r="2" fill="#FF8F00"/>

    <ellipse cx="85" cy="182" rx="11" ry="9" fill="#FFFBF5" stroke="#D97706" stroke-width="3"/>
    <ellipse cx="115" cy="182" rx="11" ry="9" fill="#FFFBF5" stroke="#D97706" stroke-width="3"/>
  </g>
</svg>
`);

// Neko: Evening Cat (Lavender/Slate blue, calm, cozy hoodie/scarf, night owl stars)
writeSvg(path.join(charsDir, 'neko.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" width="100%" height="100%">
  <defs>
    <radialGradient id="nekoFur" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#9FA8DA"/>
      <stop offset="70%" stop-color="#5C6BC0"/>
      <stop offset="100%" stop-color="#3F51B5"/>
    </radialGradient>
    <linearGradient id="nekoScarf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE082"/>
      <stop offset="100%" stop-color="#FFB300"/>
    </linearGradient>
    <filter id="nekoShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#283593" flood-opacity="0.25"/>
    </filter>
  </defs>

  <ellipse cx="100" cy="208" rx="55" ry="10" fill="#C5CAE9" opacity="0.6"/>

  <g filter="url(#nekoShadow)">
    <path d="M 145,160 Q 185,150 180,120 Q 175,98 160,110 Q 155,125 142,145" 
          fill="#5C6BC0" stroke="#3949AB" stroke-width="4" stroke-linecap="round"/>
    <circle cx="180" cy="115" r="7" fill="#FFE082"/>

    <ellipse cx="100" cy="155" rx="44" ry="40" fill="url(#nekoFur)" stroke="#3949AB" stroke-width="4"/>
    <ellipse cx="100" cy="160" rx="20" ry="24" fill="#E8EAF6"/>

    <path d="M 50,68 Q 42,15 72,32 Q 85,42 80,72 Z" fill="#5C6BC0" stroke="#3949AB" stroke-width="4"/>
    <path d="M 55,62 Q 50,28 68,38 Q 76,46 74,66 Z" fill="#FF80AB"/>
    <path d="M 150,68 Q 158,15 128,32 Q 115,42 120,72 Z" fill="#5C6BC0" stroke="#3949AB" stroke-width="4"/>
    <path d="M 145,62 Q 150,28 132,38 Q 124,46 126,66 Z" fill="#FF80AB"/>

    <circle cx="100" cy="94" r="52" fill="url(#nekoFur)" stroke="#3949AB" stroke-width="4"/>

    <polygon points="100,56 103,63 110,64 105,68 107,75 100,71 93,75 95,68 90,64 97,63" fill="#FFE082"/>

    <line x1="50" y1="102" x2="30" y2="99" stroke="#E8EAF6" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="50" y1="108" x2="32" y2="114" stroke="#E8EAF6" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="150" y1="102" x2="170" y2="99" stroke="#E8EAF6" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="150" y1="108" x2="168" y2="114" stroke="#E8EAF6" stroke-width="2.5" stroke-linecap="round"/>

    <ellipse cx="70" cy="108" rx="8" ry="4" fill="#FF80AB" opacity="0.5"/>
    <ellipse cx="130" cy="108" rx="8" ry="4" fill="#FF80AB" opacity="0.5"/>

    <ellipse cx="80" cy="92" rx="9" ry="11" fill="#00BFA5"/>
    <ellipse cx="80" cy="92" rx="5" ry="10" fill="#1A237E"/>
    <circle cx="77" cy="87" r="3" fill="#FFFFFF"/>
    <circle cx="83" cy="95" r="1.5" fill="#FFFFFF"/>

    <ellipse cx="120" cy="92" rx="9" ry="11" fill="#00BFA5"/>
    <ellipse cx="120" cy="92" rx="5" ry="10" fill="#1A237E"/>
    <circle cx="117" cy="87" r="3" fill="#FFFFFF"/>
    <circle cx="123" cy="95" r="1.5" fill="#FFFFFF"/>

    <polygon points="100,101 96,97 104,97" fill="#FF80AB"/>

    <path d="M 94,103 Q 97,106 100,103 Q 103,106 106,103" fill="none" stroke="#1A237E" stroke-width="2.5" stroke-linecap="round"/>

    <path d="M 68,132 C 85,142 115,142 132,132 C 136,138 132,148 118,150 C 95,152 75,145 68,132 Z" 
          fill="url(#nekoScarf)" stroke="#E65100" stroke-width="2"/>
    <path d="M 112,146 L 118,172 L 132,168 L 126,146 Z" fill="url(#nekoScarf)" stroke="#E65100" stroke-width="2"/>
    <path d="M 85,138 A 6 6 0 1 0 91 144 A 4.5 4.5 0 0 1 85 138 Z" fill="#FFF" stroke="#FFB300" stroke-width="1"/>

    <ellipse cx="85" cy="182" rx="10" ry="8" fill="#E8EAF6" stroke="#3949AB" stroke-width="3"/>
    <ellipse cx="115" cy="182" rx="10" ry="8" fill="#E8EAF6" stroke="#3949AB" stroke-width="3"/>
  </g>
</svg>
`);

// Usagi: Friendly Rabbit Mentor (Soft white, pastel pink ears, glasses & notepad, cheerful helper)
writeSvg(path.join(charsDir, 'usagi.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" width="100%" height="100%">
  <defs>
    <radialGradient id="usagiFur" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="80%" stop-color="#F5F5F7"/>
      <stop offset="100%" stop-color="#E0E0E6"/>
    </radialGradient>
    <filter id="usagiShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#E91E63" flood-opacity="0.15"/>
    </filter>
  </defs>

  <ellipse cx="100" cy="208" rx="52" ry="9" fill="#E1BEE7" opacity="0.5"/>

  <g filter="url(#usagiShadow)">
    <path d="M 65,70 C 45,20 55,-5 72,5 C 88,15 88,45 82,75 Z" fill="#FFF" stroke="#D81B60" stroke-width="3.5"/>
    <path d="M 68,62 C 55,25 62,8 72,16 C 80,24 80,45 76,66 Z" fill="#F8BBD0"/>
    <path d="M 135,70 C 150,25 140,-5 125,5 C 112,15 115,45 118,75 Z" fill="#FFF" stroke="#D81B60" stroke-width="3.5"/>
    <path d="M 132,62 C 142,28 135,8 126,16 C 118,24 120,45 122,66 Z" fill="#F8BBD0"/>

    <ellipse cx="100" cy="158" rx="42" ry="38" fill="url(#usagiFur)" stroke="#D81B60" stroke-width="3.5"/>
    <path d="M 75,140 Q 100,150 125,140 L 128,175 Q 100,185 72,175 Z" fill="#F48FB1" stroke="#C2185B" stroke-width="2"/>
    <circle cx="100" cy="155" r="3" fill="#FFF"/>
    <circle cx="100" cy="168" r="3" fill="#FFF"/>

    <circle cx="100" cy="96" r="50" fill="url(#usagiFur)" stroke="#D81B60" stroke-width="3.5"/>

    <circle cx="80" cy="94" r="14" fill="none" stroke="#D81B60" stroke-width="3"/>
    <circle cx="120" cy="94" r="14" fill="none" stroke="#D81B60" stroke-width="3"/>
    <line x1="94" y1="94" x2="106" y2="94" stroke="#D81B60" stroke-width="3"/>

    <circle cx="68" cy="108" r="7" fill="#FF80AB" opacity="0.6"/>
    <circle cx="132" cy="108" r="7" fill="#FF80AB" opacity="0.6"/>

    <path d="M 74,94 Q 80,87 86,94" fill="none" stroke="#880E4F" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 114,94 Q 120,87 126,94" fill="none" stroke="#880E4F" stroke-width="3.5" stroke-linecap="round"/>

    <ellipse cx="100" cy="103" rx="4" ry="3" fill="#FF4081"/>

    <path d="M 95,106 Q 100,109 100,106 Q 100,109 105,106" fill="none" stroke="#880E4F" stroke-width="2.5" stroke-linecap="round"/>

    <g transform="translate(122, 135) rotate(15)">
      <rect x="0" y="0" width="34" height="44" rx="4" fill="#FFE082" stroke="#FFA000" stroke-width="2"/>
      <rect x="10" y="-4" width="14" height="8" rx="2" fill="#78909C"/>
      <line x1="6" y1="12" x2="28" y2="12" stroke="#FFA000" stroke-width="2"/>
      <line x1="6" y1="20" x2="24" y2="20" stroke="#FFA000" stroke-width="2"/>
      <line x1="6" y1="28" x2="26" y2="28" stroke="#FFA000" stroke-width="2"/>
      <circle cx="24" cy="34" r="5" fill="#FFF" stroke="#E91E63" stroke-width="1.5"/>
      <line x1="24" y1="34" x2="24" y2="31" stroke="#E91E63" stroke-width="1.5"/>
      <line x1="24" y1="34" x2="26" y2="34" stroke="#E91E63" stroke-width="1.5"/>
    </g>

    <circle cx="82" cy="170" r="9" fill="#FFF" stroke="#D81B60" stroke-width="3"/>
    <circle cx="118" cy="170" r="9" fill="#FFF" stroke="#D81B60" stroke-width="3"/>
  </g>
</svg>
`);

// Trio banner graphic: Inu, Neko, Usagi together for Start Screen and Celebration Screen
writeSvg(path.join(charsDir, 'trio.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 240" width="100%" height="100%">
  <defs>
    <filter id="groupShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.15"/>
    </filter>
  </defs>

  <g transform="translate(40, 20)">
    <circle cx="30" cy="30" r="22" fill="#FFD54F" stroke="#FFA000" stroke-width="3"/>
    <g stroke="#FFA000" stroke-width="3" stroke-linecap="round">
      <line x1="30" y1="2" x2="30" y2="-6"/>
      <line x1="30" y1="58" x2="30" y2="66"/>
      <line x1="2" y1="30" x2="-6" y2="30"/>
      <line x1="58" y1="30" x2="66" y2="30"/>
      <line x1="10" y1="10" x2="4" y2="4"/>
      <line x1="50" y1="50" x2="56" y2="56"/>
      <line x1="10" y1="50" x2="4" y2="56"/>
      <line x1="50" y1="10" x2="56" y2="4"/>
    </g>
  </g>

  <g transform="translate(440, 15)">
    <path d="M 35,5 A 25 25 0 1 0 60 55 A 20 20 0 0 1 35 5 Z" fill="#FFE082" stroke="#FFB300" stroke-width="2.5"/>
    <polygon points="10,15 13,22 20,23 15,28 16,35 10,31 4,35 5,28 0,23 7,22" fill="#FFF59D"/>
    <polygon points="65,65 67,70 72,71 68,75 69,80 65,77 61,80 62,75 58,71 63,70" fill="#FFF59D"/>
  </g>

  <g filter="url(#groupShadow)">
    <g transform="translate(60, 40) scale(0.85)">
      <ellipse cx="100" cy="155" rx="46" ry="42" fill="#FFA834" stroke="#D97706" stroke-width="4"/>
      <path d="M 82,140 Q 100,165 118,140 Q 100,185 82,140 Z" fill="#FFFBF5"/>
      <path d="M 52,65 Q 40,15 65,25 Q 82,38 78,72 Z" fill="#FFA834" stroke="#D97706" stroke-width="4"/>
      <path d="M 148,65 Q 160,15 135,25 Q 118,38 122,72 Z" fill="#FFA834" stroke="#D97706" stroke-width="4"/>
      <circle cx="100" cy="92" r="54" fill="#FFA834" stroke="#D97706" stroke-width="4"/>
      <ellipse cx="80" cy="108" rx="22" ry="18" fill="#FFFBF5"/>
      <ellipse cx="120" cy="108" rx="22" ry="18" fill="#FFFBF5"/>
      <circle cx="68" cy="105" r="7" fill="#FF8A80" opacity="0.6"/>
      <circle cx="132" cy="105" r="7" fill="#FF8A80" opacity="0.6"/>
      <ellipse cx="82" cy="86" rx="6.5" ry="8" fill="#3E2723"/>
      <circle cx="80" cy="83" r="2.5" fill="#FFF"/>
      <ellipse cx="118" cy="86" rx="6.5" ry="8" fill="#3E2723"/>
      <circle cx="116" cy="83" r="2.5" fill="#FFF"/>
      <path d="M 95,96 Q 100,93 105,96 Q 100,103 95,96 Z" fill="#2E1C0C"/>
      <path d="M 96,106 Q 100,116 104,106 Z" fill="#FF6B8B"/>
      <path d="M 72,128 Q 100,146 128,128 Q 100,165 72,128 Z" fill="#FF5252" stroke="#B71C1C" stroke-width="2.5"/>
      <circle cx="100" cy="136" r="4.5" fill="#FFD54F"/>
    </g>

    <g transform="translate(180, 20) scale(0.9)">
      <path d="M 65,70 C 45,20 55,-5 72,5 C 88,15 88,45 82,75 Z" fill="#FFF" stroke="#D81B60" stroke-width="3.5"/>
      <path d="M 68,62 C 55,25 62,8 72,16 C 80,24 80,45 76,66 Z" fill="#F8BBD0"/>
      <path d="M 135,70 C 150,25 140,-5 125,5 C 112,15 115,45 118,75 Z" fill="#FFF" stroke="#D81B60" stroke-width="3.5"/>
      <path d="M 132,62 C 142,28 135,8 126,16 C 118,24 120,45 122,66 Z" fill="#F8BBD0"/>
      <ellipse cx="100" cy="158" rx="42" ry="38" fill="#FFF" stroke="#D81B60" stroke-width="3.5"/>
      <path d="M 75,140 Q 100,150 125,140 L 128,175 Q 100,185 72,175 Z" fill="#F48FB1" stroke="#C2185B" stroke-width="2"/>
      <circle cx="100" cy="96" r="50" fill="#FFF" stroke="#D81B60" stroke-width="3.5"/>
      <circle cx="80" cy="94" r="14" fill="none" stroke="#D81B60" stroke-width="3"/>
      <circle cx="120" cy="94" r="14" fill="none" stroke="#D81B60" stroke-width="3"/>
      <line x1="94" y1="94" x2="106" y2="94" stroke="#D81B60" stroke-width="3"/>
      <circle cx="68" cy="108" r="7" fill="#FF80AB" opacity="0.6"/>
      <circle cx="132" cy="108" r="7" fill="#FF80AB" opacity="0.6"/>
      <path d="M 74,94 Q 80,87 86,94" fill="none" stroke="#880E4F" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 114,94 Q 120,87 126,94" fill="none" stroke="#880E4F" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="100" cy="103" rx="4" ry="3" fill="#FF4081"/>
      <path d="M 95,106 Q 100,109 100,106 Q 100,109 105,106" fill="none" stroke="#880E4F" stroke-width="2.5" stroke-linecap="round"/>
    </g>

    <g transform="translate(310, 40) scale(0.85)">
      <ellipse cx="100" cy="155" rx="44" ry="40" fill="#5C6BC0" stroke="#3949AB" stroke-width="4"/>
      <ellipse cx="100" cy="160" rx="20" ry="24" fill="#E8EAF6"/>
      <path d="M 50,68 Q 42,15 72,32 Q 85,42 80,72 Z" fill="#5C6BC0" stroke="#3949AB" stroke-width="4"/>
      <path d="M 150,68 Q 158,15 128,32 Q 115,42 120,72 Z" fill="#5C6BC0" stroke="#3949AB" stroke-width="4"/>
      <circle cx="100" cy="94" r="52" fill="#5C6BC0" stroke="#3949AB" stroke-width="4"/>
      <polygon points="100,56 103,63 110,64 105,68 107,75 100,71 93,75 95,68 90,64 97,63" fill="#FFE082"/>
      <ellipse cx="70" cy="108" rx="8" ry="4" fill="#FF80AB" opacity="0.5"/>
      <ellipse cx="130" cy="108" rx="8" ry="4" fill="#FF80AB" opacity="0.5"/>
      <ellipse cx="80" cy="92" rx="9" ry="11" fill="#00BFA5"/>
      <ellipse cx="80" cy="92" rx="5" ry="10" fill="#1A237E"/>
      <circle cx="77" cy="87" r="3" fill="#FFF"/>
      <ellipse cx="120" cy="92" rx="9" ry="11" fill="#00BFA5"/>
      <ellipse cx="120" cy="92" rx="5" ry="10" fill="#1A237E"/>
      <circle cx="117" cy="87" r="3" fill="#FFF"/>
      <polygon points="100,101 96,97 104,97" fill="#FF80AB"/>
      <path d="M 94,103 Q 97,106 100,103 Q 103,106 106,103" fill="none" stroke="#1A237E" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 68,132 C 85,142 115,142 132,132 C 136,138 132,148 118,150 C 95,152 75,145 68,132 Z" fill="#FFE082" stroke="#E65100" stroke-width="2"/>
    </g>
  </g>
</svg>
`);

// -------------------------------------------------------------
// 2. ICONS & BADGES
// -------------------------------------------------------------

writeSvg(path.join(iconsDir, 'clock.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <circle cx="50" cy="50" r="45" fill="#FFF9C4" stroke="#F57F17" stroke-width="6"/>
  <circle cx="50" cy="50" r="38" fill="#FFFDE7"/>
  <line x1="50" y1="18" x2="50" y2="24" stroke="#F57F17" stroke-width="4" stroke-linecap="round"/>
  <line x1="50" y1="82" x2="50" y2="76" stroke="#F57F17" stroke-width="4" stroke-linecap="round"/>
  <line x1="18" y1="50" x2="24" y2="50" stroke="#F57F17" stroke-width="4" stroke-linecap="round"/>
  <line x1="82" y1="50" x2="76" y2="50" stroke="#F57F17" stroke-width="4" stroke-linecap="round"/>
  <line x1="50" y1="50" x2="50" y2="28" stroke="#37474F" stroke-width="5" stroke-linecap="round"/>
  <line x1="50" y1="50" x2="68" y2="50" stroke="#E65100" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="5" fill="#E65100"/>
</svg>
`);

writeSvg(path.join(iconsDir, 'medal.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="100%" height="100%">
  <polygon points="40,20 20,80 45,70 60,85 50,20" fill="#E53935"/>
  <polygon points="80,20 100,80 75,70 60,85 70,20" fill="#C62828"/>
  <circle cx="60" cy="85" r="40" fill="#FFD700" stroke="#FF8F00" stroke-width="6"/>
  <circle cx="60" cy="85" r="32" fill="#FFE082"/>
  <polygon points="60,65 65,77 78,78 68,87 71,99 60,93 49,99 52,87 42,78 55,77" fill="#FF8F00"/>
</svg>
`);

// -------------------------------------------------------------
// 3. SOUND SYNTHESIS (PCM WAV, pure Node.js Buffer, 100% offline)
// -------------------------------------------------------------

function generateWav(filename, durationSec, sampleRate, genSampleFn) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
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
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let val = genSampleFn(t, durationSec);
    val = Math.max(-1, Math.min(1, val));
    buffer.writeInt16LE(Math.floor(val * 32767), 44 + i * 2);
  }

  const outPath = path.join(soundsDir, filename);
  fs.writeFileSync(outPath, buffer);
  console.log('Created Sound:', filename, `(${buffer.length} bytes)`);
}

const SR = 22050;

generateWav('click.wav', 0.08, SR, (t, dur) => {
  const env = Math.exp(-t * 60);
  return Math.sin(2 * Math.PI * 650 * t) * env * 0.7;
});

generateWav('snap.wav', 0.14, SR, (t, dur) => {
  const env = Math.exp(-t * 35);
  const freq = t < 0.06 ? 523.25 : 783.99;
  return Math.sin(2 * Math.PI * freq * t) * env * 0.8;
});

generateWav('success.wav', 0.5, SR, (t, dur) => {
  const env = Math.max(0, 1 - t / dur);
  let freq = 523.25;
  if (t > 0.12) freq = 659.25;
  if (t > 0.24) freq = 783.99;
  if (t > 0.36) freq = 1046.50;
  return (Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(4 * Math.PI * freq * t)) * env * 0.7;
});

generateWav('score.wav', 0.35, SR, (t, dur) => {
  const env = Math.exp(-t * 10);
  return (Math.sin(2 * Math.PI * 880 * t) + 0.5 * Math.sin(2 * Math.PI * 1760 * t)) * env * 0.7;
});

generateWav('fanfare.wav', 1.2, SR, (t, dur) => {
  const env = Math.max(0, 1 - Math.pow(t / dur, 1.8));
  let f1 = 523.25, f2 = 659.25, f3 = 783.99;
  if (t > 0.35 && t <= 0.7) {
    f1 = 587.33; f2 = 739.99; f3 = 880.00;
  } else if (t > 0.7) {
    f1 = 659.25; f2 = 830.61; f3 = 1046.50;
  }
  const s = Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t) + Math.sin(2 * Math.PI * f3 * t);
  return s * 0.3 * env;
});

console.log('All assets built successfully!');
