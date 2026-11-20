// build_chronotype_assets.js
// Generates SVG graphics and PCM WAV sound files for 《生理時鐘大冒險》（Chronotype Adventure）

const fs = require('fs');
const path = require('path');

const charsDir = path.join(__dirname, 'assets', 'characters');
const iconsDir = path.join(__dirname, 'assets', 'icons');
const propsDir = path.join(__dirname, 'assets', 'props');
const soundsDir = path.join(__dirname, 'assets', 'sounds');

[charsDir, iconsDir, propsDir, soundsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function writeSvg(filePath, content) {
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  console.log('Created SVG:', path.relative(__dirname, filePath));
}

// -------------------------------------------------------------
// 1. CHARACTERS (Japanese Cute 2D Vector Chibi Style)
// -------------------------------------------------------------

// Inu: Morning Shiba Dog (Warm yellow/orange, sunny bandana, energetic)
writeSvg(path.join(charsDir, 'inu.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" width="100%" height="100%">
  <defs>
    <radialGradient id="inuFur" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FFE7A0"/>
      <stop offset="60%" stop-color="#FFB87A"/>
      <stop offset="100%" stop-color="#E67A26"/>
    </radialGradient>
    <linearGradient id="inuBandana" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B6B"/>
      <stop offset="100%" stop-color="#EE5253"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#8B5E3C" flood-opacity="0.2"/>
    </filter>
  </defs>

  <ellipse cx="100" cy="208" rx="55" ry="10" fill="#E2D4BE" opacity="0.6"/>

  <g filter="url(#softShadow)">
    <!-- Tail wagging -->
    <path d="M 145,150 Q 185,130 175,100 Q 165,85 150,110 Q 140,125 140,145" 
          fill="#FFB87A" stroke="#E67A26" stroke-width="4" stroke-linecap="round"/>
    <path d="M 175,100 Q 170,95 160,105" fill="#FFFBF5"/>

    <!-- Body -->
    <ellipse cx="100" cy="155" rx="46" ry="42" fill="url(#inuFur)" stroke="#D97706" stroke-width="4"/>
    <path d="M 82,140 Q 100,165 118,140 Q 100,185 82,140 Z" fill="#FFFBF5"/>

    <!-- Left Ear -->
    <path d="M 52,65 Q 40,15 65,25 Q 82,38 78,72 Z" fill="#FFB87A" stroke="#D97706" stroke-width="4"/>
    <path d="M 55,60 Q 48,28 65,34 Q 74,45 72,66 Z" fill="#FFC79A"/>
    <!-- Right Ear -->
    <path d="M 148,65 Q 160,15 135,25 Q 118,38 122,72 Z" fill="#FFB87A" stroke="#D97706" stroke-width="4"/>
    <path d="M 145,60 Q 152,28 135,34 Q 126,45 128,66 Z" fill="#FFC79A"/>

    <!-- Head -->
    <circle cx="100" cy="92" r="54" fill="url(#inuFur)" stroke="#D97706" stroke-width="4"/>

    <!-- White muzzle & cheeks -->
    <ellipse cx="80" cy="108" rx="22" ry="18" fill="#FFFBF5"/>
    <ellipse cx="120" cy="108" rx="22" ry="18" fill="#FFFBF5"/>
    <ellipse cx="100" cy="104" rx="24" ry="18" fill="#FFFBF5"/>

    <!-- Cheeks blush -->
    <ellipse cx="68" cy="105" rx="8" ry="5" fill="#FF8A80" opacity="0.6"/>
    <ellipse cx="132" cy="105" rx="8" ry="5" fill="#FF8A80" opacity="0.6"/>

    <!-- Eyebrows (cute Shiba white dots) -->
    <ellipse cx="80" cy="72" rx="6" ry="4" fill="#FFFBF5"/>
    <ellipse cx="120" cy="72" rx="6" ry="4" fill="#FFFBF5"/>

    <!-- Eyes (Big sparky) -->
    <ellipse cx="82" cy="86" rx="6.5" ry="8" fill="#3E2723"/>
    <circle cx="80" cy="83" r="2.5" fill="#FFFFFF"/>
    <circle cx="84" cy="88" r="1.2" fill="#FFFFFF"/>

    <ellipse cx="118" cy="86" rx="6.5" ry="8" fill="#3E2723"/>
    <circle cx="116" cy="83" r="2.5" fill="#FFFFFF"/>
    <circle cx="120" cy="88" r="1.2" fill="#FFFFFF"/>

    <!-- Nose -->
    <path d="M 95,96 Q 100,93 105,96 Q 100,103 95,96 Z" fill="#2E1C0C"/>

    <!-- Happy Mouth -->
    <path d="M 94,103 Q 100,107 100,102 Q 100,107 106,103" fill="none" stroke="#2E1C0C" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 96,106 Q 100,116 104,106 Z" fill="#FF6B8B"/>

    <!-- Sun Bandana -->
    <path d="M 72,128 Q 100,146 128,128 Q 100,165 72,128 Z" fill="url(#inuBandana)" stroke="#B71C1C" stroke-width="2.5"/>
    <circle cx="100" cy="136" r="5" fill="#FFEB3B"/>
    <circle cx="100" cy="136" r="2.5" fill="#FF9800"/>

    <!-- Paws -->
    <ellipse cx="85" cy="182" rx="11" ry="9" fill="#FFFBF5" stroke="#D97706" stroke-width="3"/>
    <ellipse cx="115" cy="182" rx="11" ry="9" fill="#FFFBF5" stroke="#D97706" stroke-width="3"/>
  </g>
</svg>
`);

// Neko: Evening Cat (Lavender/Slate blue, calm, cozy scarf, night owl stars)
writeSvg(path.join(charsDir, 'neko.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" width="100%" height="100%">
  <defs>
    <radialGradient id="nekoFur" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#C7B8F3"/>
      <stop offset="65%" stop-color="#808AB7"/>
      <stop offset="100%" stop-color="#52669B"/>
    </radialGradient>
    <linearGradient id="nekoScarf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF0B5"/>
      <stop offset="100%" stop-color="#FFD54F"/>
    </linearGradient>
    <filter id="nekoShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#283593" flood-opacity="0.25"/>
    </filter>
  </defs>

  <ellipse cx="100" cy="208" rx="55" ry="10" fill="#CFD8DC" opacity="0.6"/>

  <g filter="url(#nekoShadow)">
    <!-- Cat Tail -->
    <path d="M 140,160 C 180,175 190,130 175,115 C 165,105 160,125 145,140" 
          fill="none" stroke="#52669B" stroke-width="12" stroke-linecap="round"/>
    <path d="M 140,160 C 180,175 190,130 175,115 C 165,105 160,125 145,140" 
          fill="none" stroke="#808AB7" stroke-width="7" stroke-linecap="round"/>

    <!-- Body -->
    <ellipse cx="100" cy="155" rx="44" ry="40" fill="url(#nekoFur)" stroke="#3949AB" stroke-width="4"/>
    <ellipse cx="100" cy="160" rx="26" ry="24" fill="#E8EAF6"/>

    <!-- Left Ear -->
    <polygon points="55,80 40,25 80,48" fill="#808AB7" stroke="#3949AB" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="57,75 48,36 75,52" fill="#FF80AB"/>
    <!-- Right Ear -->
    <polygon points="145,80 160,25 120,48" fill="#808AB7" stroke="#3949AB" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="143,75 152,36 125,52" fill="#FF80AB"/>

    <!-- Head -->
    <circle cx="100" cy="94" r="52" fill="url(#nekoFur)" stroke="#3949AB" stroke-width="4"/>

    <!-- Cat Cheeks -->
    <ellipse cx="78" cy="108" rx="18" ry="14" fill="#E8EAF6"/>
    <ellipse cx="122" cy="108" rx="18" ry="14" fill="#E8EAF6"/>

    <!-- Cheeks blush -->
    <ellipse cx="68" cy="106" rx="8" ry="4" fill="#FF80AB" opacity="0.5"/>
    <ellipse cx="132" cy="106" rx="8" ry="4" fill="#FF80AB" opacity="0.5"/>

    <!-- Whiskers -->
    <line x1="55" y1="102" x2="35" y2="98" stroke="#3949AB" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="55" y1="108" x2="33" y2="110" stroke="#3949AB" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="145" y1="102" x2="165" y2="98" stroke="#3949AB" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="145" y1="108" x2="167" y2="110" stroke="#3949AB" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Big Eyes (Teal/Emerald night-cat eyes) -->
    <ellipse cx="80" cy="90" rx="9" ry="11" fill="#4DB6AC"/>
    <ellipse cx="80" cy="90" rx="5" ry="10" fill="#1A237E"/>
    <circle cx="77" cy="85" r="3" fill="#FFF"/>
    <circle cx="82" cy="93" r="1.5" fill="#FFF"/>

    <ellipse cx="120" cy="90" rx="9" ry="11" fill="#4DB6AC"/>
    <ellipse cx="120" cy="90" rx="5" ry="10" fill="#1A237E"/>
    <circle cx="117" cy="85" r="3" fill="#FFF"/>
    <circle cx="122" cy="93" r="1.5" fill="#FFF"/>

    <!-- Nose -->
    <polygon points="100,99 96,95 104,95" fill="#FF80AB"/>

    <!-- Mouth -->
    <path d="M 94,101 Q 97,105 100,102 Q 103,105 106,101" fill="none" stroke="#1A237E" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Warm Scarf with Moon Pin -->
    <path d="M 68,130 C 85,142 115,142 132,130 C 138,138 132,150 118,150 C 95,152 75,145 68,130 Z" 
          fill="url(#nekoScarf)" stroke="#E65100" stroke-width="2.5"/>
    <!-- Moon Pin -->
    <path d="M 120,138 A 6 6 0 0 0 125 146 A 8 8 0 1 1 120 138 Z" fill="#9C27B0"/>

    <!-- Paws -->
    <ellipse cx="84" cy="184" rx="10" ry="8" fill="#E8EAF6" stroke="#3949AB" stroke-width="3"/>
    <ellipse cx="116" cy="184" rx="10" ry="8" fill="#E8EAF6" stroke="#3949AB" stroke-width="3"/>
  </g>
</svg>
`);

// Usagi: Rhythm Helper Bunny (Pure white, pink long ears, clock badge, cheerful)
writeSvg(path.join(charsDir, 'usagi.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" width="100%" height="100%">
  <defs>
    <radialGradient id="usagiWhite" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="75%" stop-color="#FFF9EF"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </radialGradient>
    <filter id="usagiShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#475569" flood-opacity="0.2"/>
    </filter>
  </defs>

  <ellipse cx="100" cy="208" rx="52" ry="10" fill="#E2E8F0" opacity="0.7"/>

  <g filter="url(#usagiShadow)">
    <!-- Bunny Tail -->
    <circle cx="145" cy="165" r="14" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3"/>

    <!-- Body -->
    <ellipse cx="100" cy="155" rx="42" ry="38" fill="url(#usagiWhite)" stroke="#94A3B8" stroke-width="3.5"/>
    <ellipse cx="100" cy="158" rx="24" ry="22" fill="#FCE7F3" opacity="0.6"/>

    <!-- Left Long Ear -->
    <path d="M 68,60 C 50,5 65,-5 82,15 C 92,30 85,55 80,68 Z" fill="url(#usagiWhite)" stroke="#94A3B8" stroke-width="3.5"/>
    <path d="M 70,52 C 58,15 68,6 78,22 C 84,33 80,50 76,58 Z" fill="#F472B6" opacity="0.75"/>
    <!-- Right Long Ear (cute bent tip) -->
    <path d="M 132,60 C 150,5 135,-5 118,15 C 108,30 115,55 120,68 Z" fill="url(#usagiWhite)" stroke="#94A3B8" stroke-width="3.5"/>
    <path d="M 130,52 C 142,15 132,6 122,22 C 116,33 120,50 124,58 Z" fill="#F472B6" opacity="0.75"/>

    <!-- Head -->
    <circle cx="100" cy="95" r="50" fill="url(#usagiWhite)" stroke="#94A3B8" stroke-width="3.5"/>

    <!-- Cheeks blush -->
    <ellipse cx="68" cy="106" rx="9" ry="5" fill="#F472B6" opacity="0.6"/>
    <ellipse cx="132" cy="106" rx="9" ry="5" fill="#F472B6" opacity="0.6"/>

    <!-- Big Ruby/Sparkle Eyes -->
    <ellipse cx="80" cy="90" rx="7" ry="9" fill="#DB2777"/>
    <ellipse cx="80" cy="90" rx="4" ry="7" fill="#831843"/>
    <circle cx="78" cy="86" r="2.5" fill="#FFF"/>
    <circle cx="82" cy="93" r="1.2" fill="#FFF"/>

    <ellipse cx="120" cy="90" rx="7" ry="9" fill="#DB2777"/>
    <ellipse cx="120" cy="90" rx="4" ry="7" fill="#831843"/>
    <circle cx="118" cy="86" r="2.5" fill="#FFF"/>
    <circle cx="122" cy="93" r="1.2" fill="#FFF"/>

    <!-- Nose & Mouth -->
    <ellipse cx="100" cy="98" rx="4" ry="3" fill="#F472B6"/>
    <path d="M 96,102 Q 100,105 100,102 Q 100,105 104,102" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Clock Pin Badge on chest -->
    <g transform="translate(100, 142)">
      <circle cx="0" cy="0" r="11" fill="#FEF08A" stroke="#EAB308" stroke-width="2"/>
      <circle cx="0" cy="0" r="8" fill="#FEF9C3"/>
      <line x1="0" y1="0" x2="0" y2="-5" stroke="#475569" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="3.5" y2="0" stroke="#E11D48" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="1.5" fill="#E11D48"/>
    </g>

    <!-- Paws -->
    <ellipse cx="82" cy="180" rx="10" ry="8" fill="#FFF" stroke="#94A3B8" stroke-width="3"/>
    <ellipse cx="118" cy="180" rx="10" ry="8" fill="#FFF" stroke="#94A3B8" stroke-width="3"/>
  </g>
</svg>
`);

// Trio: Celebration banner illustration
writeSvg(path.join(charsDir, 'trio.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220" width="100%" height="100%">
  <defs>
    <radialGradient id="trioSunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#FEF08A" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="trioMoonGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#C7D2FE" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#C7D2FE" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Left: Morning sun glow -->
  <circle cx="80" cy="60" r="70" fill="url(#trioSunGlow)"/>
  <circle cx="70" cy="50" r="28" fill="#FBBF24"/>
  <g stroke="#F59E0B" stroke-width="3" stroke-linecap="round">
    <line x1="70" y1="12" x2="70" y2="2" />
    <line x1="70" y1="88" x2="70" y2="98" />
    <line x1="32" y1="50" x2="22" y2="50" />
    <line x1="108" y1="50" x2="118" y2="50" />
    <line x1="43" y1="23" x2="35" y2="15" />
    <line x1="97" y1="77" x2="105" y2="85" />
    <line x1="43" y1="77" x2="35" y2="85" />
    <line x1="97" y1="23" x2="105" y2="15" />
  </g>

  <!-- Right: Night moon and stars glow -->
  <circle cx="340" cy="60" r="70" fill="url(#trioMoonGlow)"/>
  <path d="M 345,35 A 25 25 0 0 0 355 70 A 30 30 0 1 1 345 35 Z" fill="#FDE047" stroke="#EAB308" stroke-width="2"/>
  <polygon points="310,40 313,46 320,47 315,52 316,58 310,55 304,58 305,52 300,47 307,46" fill="#FDE047"/>
  <polygon points="380,55 382,60 387,61 383,65 384,70 380,67 376,70 377,65 373,61 378,60" fill="#FDE047"/>

  <!-- Center: Friendly Trio -->
  <!-- Left: Inu -->
  <g transform="translate(45, 45) scale(0.68)">
    <ellipse cx="100" cy="208" rx="55" ry="10" fill="#E2D4BE" opacity="0.6"/>
    <ellipse cx="100" cy="155" rx="46" ry="42" fill="#FFA834" stroke="#D97706" stroke-width="4"/>
    <circle cx="100" cy="92" r="54" fill="#FFA834" stroke="#D97706" stroke-width="4"/>
    <ellipse cx="80" cy="108" rx="22" ry="18" fill="#FFFBF5"/>
    <ellipse cx="120" cy="108" rx="22" ry="18" fill="#FFFBF5"/>
    <ellipse cx="68" cy="105" rx="8" ry="5" fill="#FF8A80" opacity="0.6"/>
    <ellipse cx="132" cy="105" rx="8" ry="5" fill="#FF8A80" opacity="0.6"/>
    <ellipse cx="82" cy="86" rx="6.5" ry="8" fill="#3E2723"/>
    <ellipse cx="118" cy="86" rx="6.5" ry="8" fill="#3E2723"/>
    <circle cx="80" cy="83" r="2.5" fill="#FFFFFF"/>
    <circle cx="116" cy="83" r="2.5" fill="#FFFFFF"/>
    <path d="M 94,103 Q 100,107 100,102 Q 100,107 106,103" fill="none" stroke="#2E1C0C" stroke-width="2.5"/>
    <path d="M 72,128 Q 100,146 128,128 Q 100,165 72,128 Z" fill="#EE5253" stroke="#B71C1C" stroke-width="2.5"/>
  </g>

  <!-- Center: Usagi -->
  <g transform="translate(145, 30) scale(0.72)">
    <ellipse cx="100" cy="208" rx="52" ry="10" fill="#E2E8F0" opacity="0.7"/>
    <ellipse cx="100" cy="155" rx="42" ry="38" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3.5"/>
    <!-- Ears -->
    <path d="M 68,60 C 50,5 65,-5 82,15 C 92,30 85,55 80,68 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3.5"/>
    <path d="M 70,52 C 58,15 68,6 78,22 C 84,33 80,50 76,58 Z" fill="#F472B6" opacity="0.75"/>
    <path d="M 132,60 C 150,5 135,-5 118,15 C 108,30 115,55 120,68 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3.5"/>
    <path d="M 130,52 C 142,15 132,6 122,22 C 116,33 120,50 124,58 Z" fill="#F472B6" opacity="0.75"/>
    <circle cx="100" cy="95" r="50" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3.5"/>
    <ellipse cx="68" cy="106" rx="9" ry="5" fill="#F472B6" opacity="0.6"/>
    <ellipse cx="132" cy="106" rx="9" ry="5" fill="#F472B6" opacity="0.6"/>
    <ellipse cx="80" cy="90" rx="7" ry="9" fill="#DB2777"/>
    <ellipse cx="120" cy="90" rx="7" ry="9" fill="#DB2777"/>
    <circle cx="78" cy="86" r="2.5" fill="#FFF"/>
    <circle cx="118" cy="86" r="2.5" fill="#FFF"/>
    <ellipse cx="100" cy="98" rx="4" ry="3" fill="#F472B6"/>
    <circle cx="100" cy="142" r="9" fill="#FEF08A" stroke="#EAB308" stroke-width="2"/>
  </g>

  <!-- Right: Neko -->
  <g transform="translate(245, 45) scale(0.68)">
    <ellipse cx="100" cy="208" rx="55" ry="10" fill="#CFD8DC" opacity="0.6"/>
    <ellipse cx="100" cy="155" rx="44" ry="40" fill="#6366F1" stroke="#3949AB" stroke-width="4"/>
    <polygon points="55,80 40,25 80,48" fill="#6366F1" stroke="#3949AB" stroke-width="4"/>
    <polygon points="145,80 160,25 120,48" fill="#6366F1" stroke="#3949AB" stroke-width="4"/>
    <circle cx="100" cy="94" r="52" fill="#6366F1" stroke="#3949AB" stroke-width="4"/>
    <ellipse cx="68" cy="108" rx="8" ry="4" fill="#FF80AB" opacity="0.5"/>
    <ellipse cx="130" cy="108" rx="8" ry="4" fill="#FF80AB" opacity="0.5"/>
    <ellipse cx="80" cy="92" rx="9" ry="11" fill="#00BFA5"/>
    <ellipse cx="120" cy="92" rx="9" ry="11" fill="#00BFA5"/>
    <circle cx="77" cy="87" r="3" fill="#FFF"/>
    <circle cx="117" cy="87" r="3" fill="#FFF"/>
    <path d="M 68,132 C 85,142 115,142 132,132 C 136,138 132,148 118,150 C 95,152 75,145 68,132 Z" fill="#FFE082" stroke="#E65100" stroke-width="2"/>
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
// 3. LEVEL 3 BEDROOM INTERACTIVE PROPS
// -------------------------------------------------------------

// Phone - Active (bright blue glare, notification badges, alert)
writeSvg(path.join(propsDir, 'phone_active.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <filter id="phoneGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#38BDF8" flood-opacity="0.8"/>
    </filter>
  </defs>
  <!-- Glow ring -->
  <rect x="25" y="10" width="70" height="100" rx="14" fill="#38BDF8" opacity="0.3" filter="url(#phoneGlow)"/>
  <!-- Phone body -->
  <rect x="30" y="15" width="60" height="90" rx="12" fill="#0F172A" stroke="#38BDF8" stroke-width="3"/>
  <!-- Screen lit -->
  <rect x="35" y="24" width="50" height="72" rx="4" fill="#0284C7"/>
  <!-- Chat bubbles on screen -->
  <rect x="40" y="32" width="30" height="10" rx="4" fill="#E0F2FE"/>
  <rect x="48" y="47" width="32" height="10" rx="4" fill="#38BDF8"/>
  <rect x="38" y="62" width="28" height="10" rx="4" fill="#E0F2FE"/>
  <!-- Alert notification dot -->
  <circle cx="78" cy="22" r="7" fill="#EF4444"/>
  <text x="78" y="26" font-size="10" font-weight="bold" fill="#FFF" text-anchor="middle">!</text>
</svg>
`);

// Phone - Off (dark, tucked away resting quietly)
writeSvg(path.join(propsDir, 'phone_off.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <!-- Resting drawer / cloth -->
  <rect x="15" y="65" width="90" height="45" rx="8" fill="#CBD5E1" stroke="#94A3B8" stroke-width="3"/>
  <line x1="25" y1="85" x2="95" y2="85" stroke="#94A3B8" stroke-width="2"/>
  <circle cx="60" cy="75" r="4" fill="#64748B"/>
  <!-- Phone tucked away inside drawer, screen OFF -->
  <g transform="translate(10, -5)">
    <rect x="30" y="20" width="60" height="60" rx="10" fill="#1E293B" stroke="#475569" stroke-width="2.5"/>
    <rect x="35" y="26" width="50" height="50" rx="4" fill="#334155"/>
    <!-- Gentle Zzz -->
    <text x="60" y="55" font-size="18" font-weight="bold" fill="#94A3B8" text-anchor="middle" font-family="sans-serif">💤</text>
  </g>
  <!-- Green check badge -->
  <circle cx="95" cy="28" r="14" fill="#10B981" stroke="#FFF" stroke-width="2.5"/>
  <polyline points="89,28 93,33 102,23" fill="none" stroke="#FFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`);

// Lamp - Bright (harsh white glare)
writeSvg(path.join(propsDir, 'lamp_bright.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <!-- Harsh bright glare rays -->
  <polygon points="60,40 10,110 110,110" fill="#FEF08A" opacity="0.45"/>
  <circle cx="60" cy="48" r="35" fill="#FFF" opacity="0.5"/>
  <!-- Lamp shade -->
  <path d="M 40,48 L 80,48 L 70,22 L 50,22 Z" fill="#E2E8F0" stroke="#64748B" stroke-width="3"/>
  <!-- Glowing bulb -->
  <circle cx="60" cy="48" r="10" fill="#FFFFFF" stroke="#FDE047" stroke-width="3"/>
  <!-- Pole & base -->
  <path d="M 60,48 L 60,95" stroke="#64748B" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="60" cy="98" rx="22" ry="7" fill="#94A3B8" stroke="#64748B" stroke-width="3"/>
  <!-- Alert icon -->
  <circle cx="95" cy="25" r="12" fill="#F59E0B" stroke="#FFF" stroke-width="2"/>
  <text x="95" y="29" font-size="12" font-weight="bold" fill="#FFF" text-anchor="middle">⚡</text>
</svg>
`);

// Lamp - Soft (warm gentle amber dimmed glow)
writeSvg(path.join(propsDir, 'lamp_soft.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <!-- Cozy soft amber cone -->
  <polygon points="60,40 25,108 95,108" fill="#FDE68A" opacity="0.3"/>
  <circle cx="60" cy="48" r="22" fill="#FDE68A" opacity="0.35"/>
  <!-- Lamp shade -->
  <path d="M 40,48 L 80,48 L 70,22 L 50,22 Z" fill="#F59E0B" stroke="#B45309" stroke-width="3"/>
  <!-- Warm soft bulb -->
  <circle cx="60" cy="48" r="8" fill="#FEF08A" stroke="#F59E0B" stroke-width="2"/>
  <!-- Pole & base -->
  <path d="M 60,48 L 60,95" stroke="#78350F" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="60" cy="98" rx="22" ry="7" fill="#92400E" stroke="#78350F" stroke-width="3"/>
  <!-- Green check badge -->
  <circle cx="95" cy="25" r="14" fill="#10B981" stroke="#FFF" stroke-width="2.5"/>
  <polyline points="89,25 93,30 102,20" fill="none" stroke="#FFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`);

// Book - Closed (on table, idle)
writeSvg(path.join(propsDir, 'book_closed.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <!-- Desk surface -->
  <line x1="10" y1="105" x2="110" y2="105" stroke="#B45309" stroke-width="5" stroke-linecap="round"/>
  <!-- Book closed on desk -->
  <rect x="28" y="55" width="64" height="42" rx="5" fill="#6366F1" stroke="#3730A3" stroke-width="3.5"/>
  <rect x="36" y="50" width="56" height="10" rx="3" fill="#E0E7FF" stroke="#3730A3" stroke-width="2"/>
  <!-- Ribbon marker -->
  <path d="M 70,55 L 70,72 L 75,67 L 80,72 L 80,55 Z" fill="#F43F5E"/>
  <text x="60" y="82" font-size="12" font-weight="bold" fill="#FFF" text-anchor="middle">Story</text>
</svg>
`);

// Book - Open (Reading calmly, soothing atmosphere)
writeSvg(path.join(propsDir, 'book_open.svg'), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <!-- Desk surface -->
  <line x1="10" y1="105" x2="110" y2="105" stroke="#B45309" stroke-width="5" stroke-linecap="round"/>
  <!-- Book open -->
  <path d="M 60,65 C 45,55 25,60 15,68 L 15,96 C 25,88 45,85 60,95 C 75,85 95,88 105,96 L 105,68 C 95,60 75,55 60,65 Z" 
        fill="#FFFBEB" stroke="#78350F" stroke-width="3.5" stroke-linejoin="round"/>
  <line x1="60" y1="65" x2="60" y2="95" stroke="#78350F" stroke-width="3"/>
  <!-- Subtle text lines -->
  <line x1="24" y1="74" x2="52" y2="70" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round"/>
  <line x1="24" y1="82" x2="52" y2="78" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round"/>
  <line x1="68" y1="70" x2="96" y2="74" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round"/>
  <line x1="68" y1="78" x2="96" y2="82" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round"/>
  <!-- Floating relaxing musical notes/stars -->
  <text x="60" y="42" font-size="20" text-anchor="middle">📖✨</text>
  <!-- Green check badge -->
  <circle cx="95" cy="25" r="14" fill="#10B981" stroke="#FFF" stroke-width="2.5"/>
  <polyline points="89,25 93,30 102,20" fill="none" stroke="#FFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`);

// -------------------------------------------------------------
// 4. SOUND SYNTHESIS (PCM WAV, pure Node.js Buffer, 100% offline)
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
