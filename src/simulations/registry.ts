import type { SimulationMeta } from '../types/visualizer';

export const CURATED_SIMULATIONS: Record<string, SimulationMeta> = {
  'pendulum-projectile': {
    id: 'pendulum-projectile',
    title: 'Projectile Motion in a Pendulum',
    subtitle: 'Ch. 4, 6 & 7 • Circular Swing → String Cut → Parabolic Trajectory',
    chapterRefs: [4, 6, 7],
    supports3d: true,
    defaultDimension: '2d',
    hotspots: [
      {
        id: 'bob',
        label: 'Pendulum Bob (Mass m)',
        category: 'object',
        explanation:
          'While attached, the bob moves along a circular arc. At the instant the string is cut, no tension pulls it inward—so by Newton’s First Law it keeps its instantaneous tangential velocity and becomes a projectile!',
        formula: 'v = √(2 · g · Δh)',
        liveMetrics: { Mass: '1.0 kg', Speed: '3.1 m/s' },
      },
      {
        id: 'tension',
        label: 'String Tension (T)',
        category: 'vector',
        explanation:
          'Tension always pulls the bob toward the pivot, providing the centripetal force needed to curve its path. When the string is cut, T drops to 0 N immediately.',
        formula: 'T = m·g·cos(θ) + m·v²/L',
      },
      {
        id: 'gravity',
        label: 'Gravity (mg)',
        category: 'vector',
        explanation:
          'Gravity always pulls straight down. During the swing it accelerates the bob downward; after the string is cut, it is the only force acting, curving the path into a parabola.',
        formula: 'F_g = m · g',
      },
      {
        id: 'velocity',
        label: 'Velocity Vector (vₓ, vᵧ)',
        category: 'vector',
        explanation:
          'After release, horizontal velocity vₓ stays constant (no horizontal force) while vertical velocity vᵧ changes at g = 9.8 m/s².',
        formula: 'x(t) = vₓ·t,  y(t) = y₀ + vᵧ·t - ½g·t²',
      },
      {
        id: 'energy',
        label: 'KE ↔ PE Bar',
        category: 'energy',
        explanation:
          'Mechanical energy is conserved: Potential Energy (mgh) at the highest point converts into Kinetic Energy (½mv²) at the bottom—and stays conserved during projectile flight.',
        formula: 'PE + KE = mgh + ½mv² = constant',
      },
    ],
    controls: [
      { id: 'length', label: 'String Length (L)', type: 'slider', min: 1, max: 5, step: 0.2, unit: 'm', defaultValue: 2.4 },
      { id: 'angle', label: 'Start Angle (θ₀)', type: 'slider', min: 15, max: 85, step: 1, unit: '°', defaultValue: 55 },
      { id: 'gravity', label: 'Gravity (g)', type: 'slider', min: 1.6, max: 20, step: 0.2, unit: 'm/s²', defaultValue: 9.8 },
      { id: 'mass', label: 'Bob Mass (m)', type: 'slider', min: 0.5, max: 5, step: 0.5, unit: 'kg', defaultValue: 1.5 },
      { id: 'showVectors', label: 'Show Force & Velocity Vectors', type: 'toggle', defaultValue: true },
      { id: 'showTrail', label: 'Show Trajectory Trail', type: 'toggle', defaultValue: true },
      { id: 'cutString', label: '✂️ Cut String Now!', type: 'button' },
    ],
    experiments: [
      {
        id: 'exp-lowest',
        title: 'Cut at the Lowest Point',
        prompt: 'Cut the string right as the bob passes the bottom (θ = 0°). Notice the projectile launches purely horizontally!',
        hint: 'At θ = 0°, velocity is 100% horizontal and speed is at its maximum.',
      },
      {
        id: 'exp-mass',
        title: 'Does Mass Change the Landing Spot?',
        prompt: 'Double the bob mass from 1.5 kg to 3.0 kg and cut at the same angle. Does the landing distance change?',
        hint: 'Both KE and PE scale with m, so mass cancels out in both swing speed and projectile motion!',
      },
    ],
  },
  'motion-graphs': {
    id: 'motion-graphs',
    title: 'Describing Motion & Graphs',
    subtitle: 'Ch. 4 • Position-Time & Velocity-Time Motion Lab',
    chapterRefs: [4],
    supports3d: false,
    defaultDimension: '2d',
    hotspots: [
      {
        id: 'slope',
        label: 'Slope of x-t Graph',
        category: 'concept',
        explanation: 'The steepness (slope) of a Position-Time graph equals the object’s velocity. A flat line means the object is at rest.',
        formula: 'v = Δx / Δt',
      },
    ],
    controls: [
      { id: 'velocity', label: 'Initial Velocity (u)', type: 'slider', min: 0, max: 20, step: 1, unit: 'm/s', defaultValue: 5 },
      { id: 'accel', label: 'Acceleration (a)', type: 'slider', min: -5, max: 5, step: 0.5, unit: 'm/s²', defaultValue: 1.5 },
    ],
    experiments: [
      {
        id: 'exp-const-v',
        title: 'Zero Acceleration',
        prompt: 'Set acceleration a = 0 m/s². What shape does the Position-Time graph make?',
        hint: 'Constant velocity produces a straight diagonal line on x-t and a flat line on v-t.',
      },
    ],
  },
  'forces-newton': {
    id: 'forces-newton',
    title: 'How Forces Affect Motion',
    subtitle: 'Ch. 6 • Free-Body Diagram, Friction & Newton’s Laws',
    chapterRefs: [6],
    supports3d: false,
    defaultDimension: '2d',
    hotspots: [
      {
        id: 'net-force',
        label: 'Net Force (F_net)',
        category: 'vector',
        explanation: 'An object accelerates only when forces are unbalanced (F_net ≠ 0).',
        formula: 'F_net = m · a',
      },
    ],
    controls: [
      { id: 'appliedForce', label: 'Applied Force', type: 'slider', min: 0, max: 100, step: 2, unit: 'N', defaultValue: 40 },
      { id: 'friction', label: 'Friction Coefficient (μ)', type: 'slider', min: 0, max: 0.8, step: 0.05, unit: '', defaultValue: 0.2 },
    ],
    experiments: [],
  },
  'work-energy': {
    id: 'work-energy',
    title: 'Work, Energy & Simple Machines',
    subtitle: 'Ch. 7 • Inclined Plane, Lever & Energy Conservation',
    chapterRefs: [7],
    supports3d: false,
    defaultDimension: '2d',
    hotspots: [
      {
        id: 'ramp',
        label: 'Inclined Plane',
        category: 'object',
        explanation: 'A ramp reduces the effort force needed by increasing the distance over which you push—total work remains W = mgh (ignoring friction).',
        formula: 'W = F · d = m · g · h',
      },
    ],
    controls: [
      { id: 'incline', label: 'Ramp Angle', type: 'slider', min: 10, max: 60, step: 1, unit: '°', defaultValue: 25 },
    ],
    experiments: [],
  },
  'bohr-atom': {
    id: 'bohr-atom',
    title: 'Journey Inside the Atom',
    subtitle: 'Ch. 8 & 9 • Interactive 3D Atomic Shell & Octet Explorer',
    chapterRefs: [8, 9],
    supports3d: true,
    defaultDimension: '3d',
    hotspots: [
      {
        id: 'nucleus',
        label: 'Nucleus (Protons + Neutrons)',
        category: 'object',
        explanation: 'Almost all of the atom’s mass sits in the tiny positively charged nucleus at the center.',
        formula: 'Mass Number A = Z + N',
      },
    ],
    controls: [
      { id: 'atomicNumber', label: 'Atomic Number (Z)', type: 'slider', min: 1, max: 18, step: 1, unit: '', defaultValue: 6 },
    ],
    experiments: [],
  },
  'sound-waves': {
    id: 'sound-waves',
    title: 'Sound Waves & Characteristics',
    subtitle: 'Ch. 10 • Frequency, Amplitude, Wavelength & Compressions',
    chapterRefs: [10],
    supports3d: false,
    defaultDimension: '2d',
    hotspots: [
      {
        id: 'wavelength',
        label: 'Wavelength (λ)',
        category: 'concept',
        explanation: 'Distance between two consecutive compressions (or crests). Higher frequency means shorter wavelength.',
        formula: 'v = f · λ',
      },
    ],
    controls: [
      { id: 'frequency', label: 'Frequency (f)', type: 'slider', min: 100, max: 1000, step: 25, unit: 'Hz', defaultValue: 440 },
      { id: 'amplitude', label: 'Amplitude', type: 'slider', min: 10, max: 100, step: 5, unit: '%', defaultValue: 60 },
    ],
    experiments: [],
  },
  'scientific-inquiry': {
    id: 'scientific-inquiry',
    title: 'Scientific Inquiry & Modeling',
    subtitle: 'Ch. 1 • Variables, Experiments & Data Plotting',
    chapterRefs: [1],
    supports3d: false,
    defaultDimension: '2d',
    hotspots: [
      {
        id: 'variables',
        label: 'Independent & Dependent Variables',
        category: 'concept',
        explanation: 'Change one variable at a time (ramp angle) while keeping others controlled (drop height) to test your hypothesis fairly.',
      },
      {
        id: 'model',
        label: 'Physical Model & Data Plot',
        category: 'object',
        explanation: 'Scientists build models and plot trial data to spot patterns and predict outcomes.',
      },
    ],
    controls: [
      { id: 'dropHeight', label: 'Drop Height', type: 'slider', min: 1, max: 6, step: 0.5, unit: 'm', defaultValue: 4 },
      { id: 'rampAngle', label: 'Ramp Angle', type: 'slider', min: 10, max: 65, step: 5, unit: '°', defaultValue: 30 },
    ],
    experiments: [],
  },
  'cell-explorer': {
    id: 'cell-explorer',
    title: 'Cell: The Building Block of Life',
    subtitle: 'Ch. 2 • Organelles, Osmosis, Mitosis & Cell Size Scale',
    chapterRefs: [2],
    supports3d: false,
    defaultDimension: '2d',
    hotspots: [
      {
        id: 'nucleus',
        label: 'Nucleus',
        category: 'object',
        explanation: 'The nucleus contains most of the cell’s DNA. These instructions guide growth and the work of other cell structures.',
      },
      ...[
        ['wall', 'Cell wall', 'The rigid wall outside a plant cell’s membrane supports the cell and helps it keep its shape.'],
        ['chloroplast', 'Chloroplast', 'A chloroplast absorbs light energy to help the plant make sugars. Animal cells do not have chloroplasts.'],
        ['vacuole', 'Central vacuole', 'This water-filled compartment helps press the plant cell against its supporting wall.'],
        ['mitochondrion', 'Mitochondrion', 'Here the cell transfers energy from nutrients into ATP, a form it can use for its work.'],
        ['scale', 'Microscope scale', 'Compare the specimen’s width with the scale bar. Zooming enlarges the image, not the actual cell.'],
      ].map(([id, label, explanation]) => ({ id, label, explanation, category: 'object' as const })),
      {
        id: 'membrane',
        label: 'Cell Membrane & Osmosis',
        category: 'concept',
        explanation: 'The selectively permeable membrane lets water move from lower solute concentration (hypotonic) to higher solute concentration (hypertonic).',
      },
      {
        id: 'division',
        label: 'Cell Division (Mitosis)',
        category: 'concept',
        explanation: 'Cells grow and divide into two identical daughter cells for growth and tissue repair.',
      },
    ],
    controls: [
      { id: 'solute', label: 'Outside Solute Concentration', type: 'slider', min: 10, max: 90, step: 5, unit: '%', defaultValue: 50 },
      { id: 'mitosisStage', label: 'Cell cycle step (0–5)', type: 'slider', min: 0, max: 5, step: 1, defaultValue: 0 },
    ],
    experiments: [],
  },
  'tissues-joints': {
    id: 'tissues-joints',
    title: 'Tissues in Action & Joints',
    subtitle: 'Ch. 3 • Plant Meristems, Animal Tissues & Musculoskeletal Joints',
    chapterRefs: [3],
    supports3d: false,
    defaultDimension: '2d',
    hotspots: [
      {
        id: 'joint',
        label: 'Joints & Muscle Action',
        category: 'object',
        explanation: 'Joints connect bones and allow movement: hinge joints bend in one plane (elbow/knee), ball-and-socket rotate in 360° (shoulder/hip), and fixed joints lock bones (skull).',
      },
    ],
    controls: [
      { id: 'flexAngle', label: 'Joint Flexion Angle', type: 'slider', min: 10, max: 120, step: 5, unit: '°', defaultValue: 45 },
    ],
    experiments: [],
  },
  'mixtures-lab': {
    id: 'mixtures-lab',
    title: 'Mixtures & Separation Lab',
    subtitle: 'Ch. 5 • Distillation, Chromatography, Tyndall Effect & Solubility',
    chapterRefs: [5],
    supports3d: false,
    defaultDimension: '2d',
    hotspots: [
      {
        id: 'separation',
        label: 'Separation Principle',
        category: 'concept',
        explanation: 'Mixtures separate by physical differences: distillation uses boiling point, chromatography uses solvent mobility, and the Tyndall effect distinguishes colloids from true solutions.',
      },
    ],
    controls: [
      { id: 'temperature', label: 'Temperature', type: 'slider', min: 20, max: 100, step: 2, unit: '°C', defaultValue: 78 },
    ],
    experiments: [],
  },
  'reproduction-life': {
    id: 'reproduction-life',
    title: 'Reproduction: How Life Continues',
    subtitle: 'Ch. 11 • Pollination, Asexual Division, Meiosis & Fertilisation',
    chapterRefs: [11],
    supports3d: false,
    defaultDimension: '2d',
    hotspots: [
      {
        id: 'pollination',
        label: 'Pollination & Fertilisation',
        category: 'concept',
        explanation: 'Pollen from the anther lands on the stigma and grows a pollen tube down to the ovule, where male and female gametes fuse to form a seed.',
      },
    ],
    controls: [
      { id: 'reproStage', label: 'Pollen Tube / Fusion Progress', type: 'slider', min: 0, max: 100, step: 5, unit: '%', defaultValue: 50 },
    ],
    experiments: [],
  },
  'biodiversity-tree': {
    id: 'biodiversity-tree',
    title: 'Diversity & Classification',
    subtitle: 'Ch. 12 • Five Kingdoms, Taxonomic Hierarchy & Binomial Naming',
    chapterRefs: [12],
    supports3d: false,
    defaultDimension: '2d',
    hotspots: [
      {
        id: 'five-kingdoms',
        label: 'Five Kingdom Classification',
        category: 'concept',
        explanation: 'Organisms are grouped into Monera, Protista, Fungi, Plantae, and Animalia based on cell type (prokaryotic/eukaryotic), body organization, and mode of nutrition.',
      },
    ],
    controls: [
      { id: 'taxonLevel', label: 'Hierarchy Depth (Kingdom → Species)', type: 'slider', min: 0, max: 6, step: 1, unit: '', defaultValue: 3 },
    ],
    experiments: [],
  },
  'earth-system': {
    id: 'earth-system',
    title: 'Earth as a System',
    subtitle: 'Ch. 13 • Interacting Spheres, Winds & Biogeochemical Cycles',
    chapterRefs: [13],
    supports3d: false,
    defaultDimension: '2d',
    hotspots: [
      {
        id: 'spheres',
        label: 'Earth’s 5 Interacting Spheres',
        category: 'concept',
        explanation: 'Geosphere, Hydrosphere, Cryosphere, Atmosphere, and Biosphere are tightly linked—warming the atmosphere melts glaciers (cryosphere) and raises ocean levels (hydrosphere).',
      },
    ],
    controls: [
      { id: 'warming', label: 'Temperature Anomaly (ΔT)', type: 'slider', min: 0, max: 4, step: 0.2, unit: '°C', defaultValue: 1.5 },
    ],
    experiments: [],
  },
};
