const fs = require('fs');
let html = fs.readFileSync('C:/Users/ianwo/Downloads/portfolio-main/portfolio-main/index.html', 'utf8');

// 1. Replace all em-dashes
html = html.replace(/\u2014/g, '-');
html = html.replace(/&mdash;/g, '-');
console.log('1. Em-dashes replaced');

// 2. Tagline
html = html.replace(
  'Embedded Systems | FPGA Design | Controls Engineering | Microelectronic Fabrication',
  'FPGA Design &amp; Embedded Systems | Low-Level Programming | Controls Engineering | Microelectronic Fabrication'
);
console.log('2. Tagline updated');

// 3. About objective
html = html.replace(
  'Computer Engineering graduate (RIT, May 2026) with hands-on experience across embedded systems, industrial controls, and semiconductor fabrication.',
  'Computer Engineering graduate (RIT, May 2026). Primarily interested in FPGA development, embedded systems, and low-level hardware/software integration.'
);
console.log('3. Objective updated');

// 4+5. About paragraphs
const oldP1 = 'At RIT I built custom VHDL IP cores integrated with Nios II soft processors via Avalon memory-mapped interfaces, wrote bare-metal C interrupt drivers, and worked with FreeRTOS on STM32 for real-time control. I also completed hands-on PMOS transistor fabrication in the RIT cleanroom - oxidation, photolithography, boron diffusion, and drive-in - verified against Athena TCAD simulations.';
const newP1 = 'Most of my academic work has been in hardware design and embedded programming. In ESD I, I built a custom VHDL servo controller IP core, integrated it with a Nios II soft processor on the DE1-SoC via Avalon MM interfaces in Platform Designer, and wrote the bare-metal C ISR driver. I have also worked with FreeRTOS on STM32, designed FIR/IIR digital filters in MATLAB, and done hands-on PMOS transistor fabrication in the RIT cleanroom.';
if (html.includes(oldP1)) { html = html.replace(oldP1, newP1); console.log('4. P1 updated'); }
else console.log('4. P1 NOT FOUND');

const oldP2 = "On the industry side, I built and deployed PLC ladder logic and HMI systems at RS Automation. At Johnson &amp; Johnson I worked on enterprise IT automation and AI tooling - a different kind of systems work, but the problem-solving is the same. I am most interested in roles involving firmware close to the metal, digital logic design, or embedded Linux/SoC platforms.";
if (!html.includes(oldP2)) {
  const oldP2b = "Professionally, I've built and deployed PLC ladder logic and HMI systems at RS Automation, and led automation and AI tooling work at Johnson &amp; Johnson. I'm drawn to roles where the gap between hardware and software matters - embedded firmware, semiconductor process engineering, or controls systems where precision and reliability are non-negotiable.";
  const newP2 = "On the industry side, I built and deployed PLC ladder logic and HMI systems at RS Automation. At Johnson &amp; Johnson I worked on enterprise IT automation and AI tooling - a different kind of systems work, but the problem-solving approach is the same. I am most interested in roles involving firmware, digital logic design, or embedded Linux/SoC platforms.";
  if (html.includes(oldP2b)) { html = html.replace(oldP2b, newP2); console.log('5. P2 updated'); }
  else console.log('5. P2 NOT FOUND');
} else console.log('5. P2 already correct');

// 6. Related courses
html = html.replace(
  'ESD I, RTOS, DSP, Signals, Systems &amp; Transforms, Electronic Devices, Microcontroller Systems',
  'Digital Systems Design, ESD I &amp; II, RTOS, DSP, Signals &amp; Systems, Electronic Devices, Microcontroller Systems, IC Technology'
);
console.log('6. Courses updated');

// 7. Contact intro
html = html.replace(
  'Open to full-time opportunities and internships in embedded systems and hardware/software engineering.',
  'Open to full-time roles in embedded systems, FPGA development, and hardware/software engineering.'
);
console.log('7. Contact updated');

// 8. PMOS in-progress badge
if (!html.includes('PMOS Transistor Fabrication <span class="badge-inprogress">')) {
  html = html.replace(
    '<h3 class="project-title">PMOS Transistor Fabrication</h3>',
    '<h3 class="project-title">PMOS Transistor Fabrication <span class="badge-inprogress">In Progress</span></h3>'
  );
  console.log('8. PMOS badge added');
} else console.log('8. PMOS badge already present');

// 9. J&J title
html = html.replace('TS Enterprise Architecture CO-OP', 'Enterprise Architecture CO-OP');
console.log('9. J&J title updated');

// 10. J&J tech stack
html = html.replace('<span class="tech-badge">Automation</span>', '<span class="tech-badge">Enterprise Automation</span>');
html = html.replace('<span class="tech-badge">Process Optimization</span>', '<span class="tech-badge">Digital Transformation</span>');
console.log('10. J&J tech updated');

// 11. Hobbies text
const oldHobbies = 'Passionate about personal growth and diverse activities including golf, chess, fitness, and photography. These pursuits complement my technical skills by fostering strategic thinking, attention to detail, and creative problem-solving.';
const newHobbies = 'Outside of engineering, I have played golf since I was a kid - the combination of precision, course management, and the mental side of the game keeps me hooked. I play chess regularly online and enjoy the strategic depth. I stay active through lifting and fitness, and picked up photography as a way to slow down and pay attention to detail - mostly landscapes and whatever catches my eye. I also like pulling things apart to understand how they work, which probably explains the career path.';
if (html.includes(oldHobbies)) { html = html.replace(oldHobbies, newHobbies); console.log('11. Hobbies updated'); }
else console.log('11. Hobbies NOT FOUND');

// 12. Hobbies card - span full width
html = html.replace(
  'community-title">Hobbies &amp; Interests</h3>',
  'community-title">Hobbies &amp; Interests</h3>'
);
// Add hobbies-card class
const hobbyCardOld = '<div class="community-card">\n                        <div class="community-header">\n                            <h3 class="community-title">Hobbies &amp; Interests</h3>';
const hobbyCardNew = '<div class="community-card hobbies-card">\n                        <div class="community-header">\n                            <h3 class="community-title">Hobbies &amp; Interests</h3>';
if (html.includes(hobbyCardOld)) { html = html.replace(hobbyCardOld, hobbyCardNew); console.log('12. Hobbies class added'); }
else console.log('12. Hobbies card class NOT FOUND (may already be set)');

fs.writeFileSync('C:/Users/ianwo/Downloads/portfolio-main/portfolio-main/index.html', html, 'utf8');
console.log('All done.');
