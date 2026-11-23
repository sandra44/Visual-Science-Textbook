import { topicStories } from './topicStories';

// Reader links are opt-in: a chapter-level simulation is not a page association.
const sections: Record<string, { lab: string; label: string; film?: string }> = {
  'Activity 2.1': { lab: 'cell-explorer', film: 'cell-size', label: 'Measure a cell' },
  '2.2': { lab: 'cell-explorer', film: 'cell-structure', label: 'Inside a cell' },
  '2.2.2': { lab: 'cell-explorer', label: 'Inspect the cell wall' },
  '2.4.1': { lab: 'cell-explorer', film: 'cell-explorer', label: 'Watch cell division' },
  '3.5.2': { lab: 'tissues-joints', film: 'tissues-joints', label: 'Bend the elbow' },
  '4.2.2': { lab: 'motion-graphs', film: 'motion-graphs', label: 'Trace a moving cart' },
  '5.2.3': { lab: 'mixtures-lab', label: 'Explore solubility' },
  '5.3.2': { lab: 'mixtures-lab', label: 'Explore distillation' },
  '5.3.3': { lab: 'mixtures-lab', film: 'mixtures-lab', label: 'Separate ink by chromatography' },
  '5.5': { lab: 'mixtures-lab', label: 'See light scattering' },
  '6.2': { lab: 'forces-newton', film: 'forces-newton', label: 'Compare forces on a crate' },
  '7.6.2': { lab: 'work-energy', film: 'work-energy', label: 'Compare inclined planes' },
  '8.7.1': { lab: 'bohr-atom', film: 'bohr-atom', label: 'Build a carbon atom' },
  '10.3': { lab: 'sound-waves', film: 'sound-waves', label: 'Follow a sound wave' },
  '11.2.1': { lab: 'reproduction-life', label: 'Explore meiosis' },
  '11.2.5': { lab: 'reproduction-life', film: 'reproduction-life', label: 'Follow pollen to fertilisation' },
  '12.7.1': { lab: 'biodiversity-tree', film: 'biodiversity-tree', label: 'Classify a mango tree' },
  '13.3.1': { lab: 'earth-system', film: 'earth-system', label: 'Follow the water cycle' },
};

export function bookVisual(lab: string | null, number: string) {
  const section = sections[number];
  if(section) return section.lab===lab ? section : undefined;
  const story=topicStories[number];
  return story && lab ? {lab,label:story.title,film:`topic:${number}`} : undefined;
}
