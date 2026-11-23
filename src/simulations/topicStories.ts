// Each row describes the entities and the two relationships in a single textbook heading.
// A leading A distinguishes an activity from a numbered section on the same page.
const rows = `
A1.1|Model the ride home|School|Bicycle 🚲|Home|Distance and average speed are the useful inputs.|Travel time is distance divided by average speed; the bicycle's colour is irrelevant.
2.1|See what a microscope changes|Specimen|Objective lens 🔬|Magnified image|The objective gathers light from a tiny area.|Magnification enlarges the image, not the cell.
2.2.1|Trace a membrane crossing|Outside fluid|Cell membrane|Cytoplasm|A small oxygen molecule diffuses toward the membrane.|Oxygen can cross the lipid layer; not every dissolved particle can.
A2.2|What happens to a potato in fresh and salty water?|Plain water|Potato pieces|20% salt solution|Start with two roughly equal pieces. Soak one in plain water and one in 20% salt solution for about an hour.|Compare with the starting outlines. Water crosses the cell membranes by osmosis: the piece in plain water gains water and swells; the piece in salt solution loses water and shrinks.
A2.3|Compare microscope slides|Onion peel 🧅|Cell boundaries|Cheek cells|Onion cells have rigid walls outside their membranes.|Cheek cells have membranes but no cell walls.
2.3|Follow a cell's export pathway|Rough ER|Golgi stacks|Cell surface|A newly made secreted protein travels in a vesicle.|The Golgi sorts it for delivery to the cell surface.
A2.4|Compare three cell plans|Bacterium|Animal cell|Plant cell 🌿|Unlike bacteria, animal and plant cells enclose DNA in a nucleus.|Plant cells also have a cell wall and typically a large central vacuole.
2.3.1|See why compartments matter|Food particle|Digestive vesicle|Reusable units|A membrane encloses digestive enzymes with their target.|Small products enter the cytoplasm without exposing the whole cell to digestion.
2.4|From one growing cell to two|Growing cell|Copied DNA|Two cells|The cell grows and copies its genetic information.|Nuclear and cell division distribute copies to the daughters.
A2.5|Where an onion root gets longer|Onion bulb 🧅|Root tip|Longer root|New cells form near the root tip.|Cells behind the tip elongate, extending the root.
2.5|Trace cells back to cells|Existing cell|Daughter cells|Living tissue|Cells arise from pre-existing cells.|Cells together form the living structure of an organism.
2.5.1|When does a cell stop dividing?|Growth signal|Cell checkpoint|Pause or divide|A signal alone is not sufficient to start division.|A checkpoint can stop division if DNA is damaged.
3.1|Compare support and movement|Plant stem 🌱|Support tissue|Animal limb|Thick walls help a plant stay upright.|Moving animals use muscles and flexible connections for support in motion.
3.2|Locate zones of growth|Shoot tip 🌱|Dividing cells|Longer shoot|Cells in the apical meristem divide.|Their descendants elongate and specialise.
A3.1|Compare intact and cut root tips|Two bulbs 🧅|Intact root tip|Cut root tip|An intact tip contains dividing meristem cells.|Removing the tip removes the main growing region of that root.
3.2.2|Watch a stem thicken|Cambium ring|New tissue|Wider stem 🌳|Lateral meristem adds layers along the sides.|The stem increases in girth rather than length.
3.2.3|How grass regrows after grazing|Cut blade|Basal meristem|New blade 🌱|The growing region at the base survives grazing.|New cells extend the blade above the cut.
3.2.4|From growth to specialisation|Meristem cell|Differentiation|Xylem vessel|A daughter cell develops specialised walls.|Mature conducting vessels transport water.
3.3|How tissues cooperate in a limb|Nerve signal|Muscle fibres|Connective tissue|A motor signal activates muscle fibres.|Tendons transmit their pull to a bone.
3.3.1|See a protective cell sheet|Outer surface|Packed cells|Underlying tissue|Closely joined epithelial cells make a continuous boundary.|The sheet protects the tissue below.
3.3.2|How tissues connect|Bone 🦴|Ligament|Second bone|A ligament spans the joint.|It connects bone to bone and limits excessive motion.
A3.2|Trace the response to a scrape|Skin|Blood vessels|Clot|A scrape may break tiny vessels beneath the surface.|Clot formation helps seal the opening.
A3.3|Feel the link during movement|Calf muscle|Achilles tendon|Heel bone|Muscle contraction tightens the tendon.|The tendon pulls the heel as you rise onto your toes.
3.3.3|Compare voluntary and involuntary motion|Decision|Arm muscle 💪|Heartbeat|A voluntary signal can raise your arm.|The heart beats without a separate decision for each beat.
3.3.4|Follow a sensory signal|Skin receptor|Sensory neuron|Central nervous system|A receptor detects a stimulus.|A nerve impulse conveys information for processing.
3.4|Assemble a moving limb|Bones 🦴|Joint|Muscles|Bones meet at a joint.|Muscles pull through tendons to rotate one bone relative to another.
A3.4|Interpret a body-mass percentage|Body mass|Tissue fraction|Tissue mass|Use an estimated fraction, not a universal constant.|For example, 15% of 40 kg corresponds to 6 kg.
3.4.1|Watch opposing muscles cooperate|Biceps|Bent elbow|Triceps|The biceps shortens to flex the elbow.|The triceps can shorten to extend it again.
A3.5|Compare movements you can observe|Elbow|Neck|Shoulder|Your elbow bends and straightens; your neck can turn.|Your shoulder allows motion in many directions.
3.5|Compare joint freedoms|Hinge joint|Pivot joint|Ball and socket|A hinge bends while a pivot rotates about an axis.|A ball and socket allows rotation about several axes.
3.5.1|Trace shoulder movement|Upper arm 🦴|Rounded head|Shoulder socket|The head fits into the socket.|The upper arm can sweep through many planes.
3.5.3|Turn the head|Atlas|Axis|Rotating head|The atlas rotates around a projection of the axis.|This pivot contributes to turning your head side to side.
3.5.4|Why skull bones stay put|Skull bone|Interlocking suture|Adjacent bone|The edges fit together at a fibrous joint.|Little movement helps maintain a protective case.
3.6|Trace the protective skeleton|Skull|Vertebral column|Rib cage|The skull encloses the brain and the spine protects the spinal cord.|Ribs surround the heart and lungs.
4.1|Follow a straight track|Start flag|Cart|Finish flag|The cart changes position along one axis.|Only one coordinate is needed to locate it.
4.1.1|Choose an origin|Reference post|Positive direction|Position|Choose zero and a direction first.|The position is a signed distance from that origin.
4.1.2|Walk out and back|Home|Turnaround|Home again|Distance accumulates on both legs of the trip.|Displacement is zero when the final position equals the start.
A4.1|Follow a ball up and down|Launch point|Highest point|Return point|The ball travels vertically up before reversing.|On return the displacement is zero, despite a nonzero distance.
4.1.3|Compare two trip averages|Total path|Elapsed time|Net change|Distance divided by time gives average speed.|Displacement divided by the same time gives average velocity.
4.1.4|Measure a change of velocity|Initial velocity|Time interval|Final velocity|Subtract initial velocity from final velocity.|Divide that change by elapsed time to get average acceleration.
A4.2|Compare car acceleration times|Car at rest 🚗|Stopwatch|100 km/h|Both cars undergo the same change in speed.|The shorter time means greater average acceleration.
4.2|Turn observations into a graph|Clock|Position readings|Plotted trend|Pair each position with its time.|A graph shows how position changes between observations.
4.2.1|Place a measurement on axes|Time coordinate|Position coordinate|Point|Move along the horizontal axis to the measured time.|Move vertically to the position and mark their intersection.
A4.3|Build a graph from readings|Data table|Scaled axes|Measured points|Choose scales that cover the data.|Each row becomes one point, not a picture of the track.
A4.4|Measure the slope between two points|Point A|Rise and run|Point B|Read the vertical change in position and horizontal change in time.|Their ratio gives average velocity over this interval.
4.2.3|Read a velocity–time graph|Velocity axis|Time interval|Signed area|The slope gives acceleration.|The signed area between the trace and time axis gives displacement.
4.3|Predict position under constant acceleration|Starting speed|Constant acceleration|Displacement|Velocity gains equal increments in equal times.|Displacement combines the starting-speed term with half the acceleration times time squared.
4.4|Separate motion into two directions|Horizontal component|Vertical component|Resultant path|Track both coordinates at each instant.|Combining their positions traces a path in a plane.
4.4.1|Follow velocity around a circle|Circular path|Tangent velocity|Inward acceleration|The speed can stay constant while direction changes.|The acceleration points toward the centre.
A4.5|Remove the guiding ring|Marble|Circular guide|Tangent path|The ring pushes the marble inward while in contact.|Without the guide it initially moves along the tangent.
5.1|Sort mixtures by appearance|Salt water|Muddy water|Mixture classes|Salt water appears uniform throughout.|Visible regions or particles indicate a heterogeneous mixture.
A5.1|Compare three beakers|Solution|Colloid|Suspension|Compare the mixtures under a beam of light.|Settling and scattering help distinguish the samples.
5.2|Follow a dissolving crystal|Solute crystal|Water molecules|Uniform solution|Particles leave the crystal and disperse.|The dissolved material is distributed throughout the solvent.
5.2.1|Concentrate a solution|Same solute|Less solvent|Higher concentration|Removing some water leaves the dissolved solute behind.|The solute fraction increases.
5.2.2|Measure mass percent|10 g solute|90 g water|100 g solution|Add the component masses to find solution mass.|10 g out of 100 g is 10% by mass.
A5.2|Compare solubility curves|Temperature axis|Saturation values|Two curves|Plot the amount that dissolves at each temperature.|Different solutes need not have the same trend.
5.3|Choose a separation method|Mixture|Physical property|Separated components|Identify a difference such as boiling point or attraction to paper.|Select a method that uses that difference.
5.3.1|Watch a crystal grow|Concentrated solution|Crystal nucleus|Ordered solid|As a solution becomes supersaturated, crystals can start to form.|More particles join the ordered structure.
A5.3|Recover crystals from solution|Dissolved salt|Cooling solution|Crystals|A concentrated solution can become supersaturated on cooling.|Excess solute joins the crystals rather than staying dissolved.
A5.4|Follow salt through a salt pan|Seawater 🌊|Evaporation ☀️|Salt crystals|Water evaporates while salt stays behind.|Continued evaporation concentrates the brine until crystals appear.
A5.5|Follow ink bands up a strip|Ink spot|Rising solvent|Separated dyes|The solvent carries components away from the starting line.|Different affinities produce bands at different heights.
5.4|Separate a heterogeneous mixture|Mixed phases|Physical boundary|Collected fraction|Find a visible boundary or particle-size difference.|Use it to separate one fraction from another.
5.4.1|Separate two liquid layers|Oil layer|Water layer|Outlet|Immiscible liquids form layers with the denser liquid below.|Opening the tap drains the lower layer first.
A5.6|Track oil in a separating funnel|Mustard oil|Water below|Receiving beaker|Let the two liquids form a clear boundary.|Water leaves first; stop before oil reaches the tap.
5.4.2|Follow a subliming solid|Solid|Vapour|Cool surface|Some solids pass directly into vapour.|On a cool surface the vapour can deposit as solid again.
A5.7|Compare camphor and sand|Mixed solids|Camphor vapour|Solid deposit|Camphor can sublime while sand stays behind.|A cooler surface collects the camphor as a solid.
5.4.3|Watch a suspension settle|Cloudy water|Settling particles|Sediment|Large suspended particles scatter light.|After standing, many settle to the bottom.
A5.8|Follow particles in a centrifuge|Spinning disc|Dense particles|Outer region|Rotation separates particles according to their sedimentation behaviour.|Denser particles can collect farther from the axis.
5.4.4|Look inside a colloid|Dispersed phase|Continuous phase|Scattered light|Fine particles remain distributed through another material.|They can scatter a beam without settling quickly.
A5.9|Identify an unknown mixture|Settling test|Light beam|Classification|Readily settling particles suggest a suspension.|Persistent scattering without rapid settling suggests a colloid.
6.1|See what a push changes|Foot ⚽|Football|Changed velocity|Contact exerts a force on the ball.|An unbalanced force changes its velocity.
6.1.1|Read a spring balance|Load|Spring extension|Force scale|A load stretches a calibrated spring.|Read the scale in newtons.
6.3|Find the direction of friction|Sliding block|Contact surface|Friction force|At the contact, surfaces slide relative to one another.|Sliding friction acts opposite that relative motion.
A6.1|Compare surfaces with a rubber band|Same coins|Different surfaces|Starting stretch|The band must pull hard enough to start the stack moving.|Different starting stretches indicate different limiting friction.
A6.2|Measure sliding friction|Wooden block|Spring balance|Steady speed|While the block moves at constant speed, net force is zero.|The balance reading then matches sliding friction in magnitude.
6.4|Watch an unforced cart coast|Moving cart|Zero net force|Constant velocity|A moving object needs no net force to keep its velocity.|A change of velocity requires a net force.
6.5|Connect force to acceleration|Net force|Mass|Acceleration|For fixed mass, a larger net force produces greater acceleration.|For fixed force, more mass means less acceleration.
A6.3|Change the pull on a cart|Loaded cup|String pull|Cart acceleration|Vary the driving load in a cart-and-cup system.|A greater unbalanced force can give a steeper velocity rise.
A6.4|Change the cart's mass|Same hanging load|Heavier cart|Slower acceleration|Keep the driving load fixed while adding mass to the cart.|The larger system accelerates less.
6.6|Identify an interaction pair|Object A|Interaction|Object B|A pushes B while B pushes A.|The forces are equal and opposite but act on different objects.
A6.5|Push away from a table|Hands|Table|Wheeled chair|The hands push the table forward.|The table pushes the rider backward.
A6.6|Compare linked spring balances|Left balance|Linked hooks|Right balance|The hooks pull on each other.|Both balances read the same tension in equilibrium.
A6.7|Follow a balloon along a string|Inflated balloon 🎈|Escaping air|Moving balloon|The balloon pushes air backward.|The air pushes the balloon forward along the guide.
6.7|Draw a system boundary|Two connected carts|Internal forces|External pull|Forces between the carts cancel in the total for the system.|External net force changes the system's total momentum.
7.1|Move a load with a constant pull|Applied force|Displacement|Work|Only the component along the displacement contributes.|A constant forward pull over twice the distance does twice the work.
7.1.1|Carry a bag horizontally|Upward support|Horizontal motion|Zero support work|The supporting force is perpendicular to displacement.|It does no mechanical work on the bag in that direction.
7.1.2|Compare pushing and braking|Forward push|Moving cart|Braking force|A forward force does positive work on a forward-moving cart.|A backward braking force does negative work.
7.2|Track work into speed|Net work|Moving object|Kinetic energy|Positive net work increases kinetic energy.|Negative net work reduces it.
7.3|Follow energy through a lamp|Battery|Electric current|Light and heat|Chemical energy supplies the circuit.|The lamp transfers energy to its surroundings.
7.4|Follow a falling object|Height|Falling ball|Speed|Gravitational potential energy falls as height decreases.|Ignoring resistance, the same amount appears as kinetic energy.
7.4.1|Compare speeds at equal mass|Speed v|Double speed|Four times KE|Kinetic energy depends on the square of speed.|Doubling speed at fixed mass multiplies kinetic energy by four.
7.4.2|Compare two shelf heights|Same mass|Higher shelf|Greater potential|Lifting requires work against gravity.|Near Earth the energy gain is mass times gravity times height gain.
A7.1|Compare impacts on sand|Raised ball|Falling ball|Sand depression|A greater starting height gives more impact energy.|More energy can move and deform more sand.
7.4.3|Exchange energy on a swing|High point|Lowest point|Opposite high point|Potential energy becomes kinetic energy on descent.|Without losses, the swing reaches the same height on the other side.
A7.2|Watch a pendulum cross a reference line|Release height|Bottom crossing|Return height|The bob is fastest near the low reference line.|Small losses reduce successive peak heights.
7.5|Compare rates of doing work|Same load|Same height|Different times|Both lifts do the same work against gravity.|The faster lift delivers more average power.
7.6|Compare machine trade-offs|Input work|Simple machine|Output work|A machine can redirect force or exchange force for distance.|An ideal machine does not create energy.
7.6.1|Lift with a fixed pulley|Hand pulls down|Turning pulley|Load rises|A fixed pulley changes the direction of the pull.|In an ideal fixed pulley the load rises as much as the free end descends.
A7.3|Pull the same cart up two slopes|Cart|Spring balance|Same final height|Compare the steady pull on a steep and a gentle incline.|The gentler incline trades a smaller pull for a longer distance.
7.6.3|Move a lever's fulcrum|Effort arm|Fulcrum|Load arm|The two forces produce turning effects about the pivot.|A longer effort arm allows a smaller effort to balance the load.
A7.4|Lift a stapler with a ruler|Eraser load|Pencil pivot|Ruler handle|Moving the pivot changes both lever arms.|Placing it nearer the load increases mechanical advantage.
A7.5|Balance coins at different distances|Left coin pan|Pivot|Right coin pan|Compare force times distance on the two sides.|Equal opposing moments balance the scale.
8.1|Trace a particle explanation of matter|Macroscopic sample|Smaller portions|Particle model|Thinking in particles helps explain material behaviour.|The model is an inference, not a photograph of matter.
8.2|Compare successive atomic models|Diffuse positive charge|Nuclear atom|Shell model|Scattering evidence favoured a concentrated nucleus.|Discrete energy levels later helped explain atomic spectra.
8.2.1|Inspect Thomson's atom|Positive sphere|Embedded electrons|Neutral whole|Negative electrons sit within diffuse positive charge in this historical model.|Equal positive and negative charge gives neutrality.
8.2.2|Follow alpha particles past gold|Incoming beam|Thin foil|Scattered tracks|Most particles pass through nearly straight.|Rare large deflections indicate a small concentrated positive nucleus.
8.2.3|Follow an electron energy change|Lower shell|Energy absorbed|Higher shell|The Bohr model allows particular energies.|Returning to a lower energy releases a photon.
8.3|Compare nuclear constituents|Proton|Neutron|Nucleus|Protons carry positive charge and neutrons are neutral.|Together they account for almost all the atom's mass.
8.3.1|Trace evidence for a neutral particle|Neutral radiation|Paraffin target|Recoil protons|The radiation knocked protons from a hydrogen-rich target.|The recoil supported a neutral particle with mass near a proton's.
8.4|Decode an element symbol|Element name|Capital letter|Optional lowercase|A symbol begins with a capital letter.|Co names cobalt; CO instead represents carbon monoxide.
8.5|Identify an atom by proton count|Nucleus|Six protons|Carbon|Atomic number counts protons.|Changing the number of neutrons alone does not change the element.
8.6|Calculate a mass number|Six protons|Seven neutrons|Carbon-13|Count both types of nucleon.|Six plus seven gives mass number thirteen.
8.7|Fill the shells of neon|Ten electrons|Two in first shell|Eight in second|In the shell model the first shell fills at two.|The remaining eight complete neon's second shell.
8.8|Read valency from an outer shell|Oxygen atom|Six outer electrons|Two bonds|Two more electrons complete the outer octet.|Oxygen commonly forms two covalent bonds.
8.9|Separate identity from isotope|Proton count|Neutron count|Nuclear label|Protons determine the element.|Neutrons can vary within atoms of that same element.
8.9.1|Compare carbon isotopes|Carbon-12|Six protons each|Carbon-14|Both nuclei belong to carbon.|Different neutron counts produce different mass numbers.
8.9.2|Compare two isobars|Argon-40|Mass number 40|Calcium-40|The total number of nucleons matches.|The proton counts differ, so these are different elements.
A9.1|Track mass while salt dissolves|Salt and water|Dissolving|Solution on balance|Dispersal changes appearance, not the amount of matter.|If nothing leaves the balance, total mass stays constant.
A9.2|Account for escaping gas|Reactants|Gas bubbles|Open container|A reaction can release gas that leaves the container.|Measure the gas too when accounting for total mass.
9.1|Count atoms before and after|Reactant atoms|Rearrangement|Product atoms|Chemical reactions rearrange atoms.|In a closed system total mass is conserved.
A9.3|Compare a closed flask before and after|Sealed reactants|Reaction|Final reading|Products form without matter leaving the weighed system.|The balance reading stays the same.
9.2|Compare samples of water|Small sample|H:O mass ratio|Large sample|Pure water has the same elemental proportions in either sample.|The hydrogen-to-oxygen mass ratio is about 1 to 8.
9.3|Build a compound in Dalton's model|Element A|Element B|Whole-number ratio|The historical model treats elements as different kinds of atoms.|Compounds form from atoms in simple whole-number ratios.
9.4|Compare two routes to bonding|Outer electrons|Sharing|Transfer|Shared electron pairs form covalent bonds.|Electron transfer can form oppositely charged ions that attract.
9.4.1|Build a hydrogen molecule|Hydrogen atom|Shared pair|Second hydrogen|Each atom contributes one electron.|Both nuclei attract the shared pair.
9.4.2|Track an electron from sodium to chlorine|Sodium|Electron transfer|Chlorine|Sodium loses an outer electron and becomes positive.|Chlorine gains it and becomes negative; opposite ions attract.
9.5|Read a chemical formula|Element symbols|Subscripts|Composition|Symbols identify each element.|A subscript counts atoms, or gives the ratio in an ionic compound.
9.5.1|Write the formula of water|Two H atoms|One O atom|H₂O|Count the atoms in one molecule.|Write the two beside H and omit the one beside O.
9.5.2|Balance charges in magnesium chloride|Mg²⁺|Two Cl⁻ ions|MgCl₂|Each chloride ion balances one unit of positive charge.|Two chlorides are needed for each magnesium ion.
9.6|Compare conductivity in a melt|Solid salt|Molten salt|Mobile ions|Ions in the solid lattice cannot travel freely.|In molten salt mobile ions can carry current.
A9.4|Compare samples in a property test|Salt sample|Sugar sample|Solution conductivity|Both can dissolve in water, so solubility alone is not decisive.|Salt solution contains mobile ions; sugar solution largely does not.
9.7|Add the atomic masses in water|Two hydrogens|One oxygen|18 u|Two hydrogen atoms contribute about 2 u.|Oxygen contributes about 16 u to the molecular mass.
9.8|Add masses in one formula unit|Na⁺|Cl⁻|58.5 u|Use one sodium and one chlorine for the NaCl ratio.|Their approximate atomic masses add to 58.5 u.
10.1|Trace sound from a vibrating source|Moving surface|Nearby air|Pressure disturbance|The surface pushes and pulls on nearby air.|Pressure variations travel away from the source.
A10.1|Watch a plucked rubber band|Stretched band|Release|Fading vibration|Displace the band and release it.|As vibration dies away, so does the sound.
10.1.1|Inspect a vibrating tuning fork|Fork stem|Two prongs|Air disturbance|The prongs move toward and away from one another.|Their periodic motion drives the surrounding air.
A10.2|See fork vibrations in water|Vibrating fork|Water surface|Ripples|A moving prong transfers energy to water it touches.|Surface motion makes the vibration visible.
10.2|Pass a disturbance between neighbours|First particle|Neighbour|Distant listener|Each particle oscillates around its own rest position.|The disturbance travels farther than any one particle.
A10.3|Trace a knock through a desk|Knock|Wooden desktop|Listener|A knock starts vibrations in the solid.|The desk itself transmits sound to the far side.
A10.4|Compare sound paths through media|Tapping spoons|Water|Receiver|Vibrating spoons can launch a disturbance in water.|Sound can propagate through a liquid as well as a gas.
10.2.1|Remove the sound medium|Vibrating source|Fewer particles|Vacuum|Material particles transmit mechanical disturbances.|An ideal vacuum cannot transmit sound.
A10.5|Follow a marked slinky turn|Pushed coils|Marked turn|Travelling compression|The marked turn moves back and forth.|The region of close coils travels along the spring.
10.4|Follow energy carried by sound|Vibrating source|Sound wave|Receiving membrane|The wave transfers energy through the medium.|The receiving membrane begins to vibrate.
A10.6|Make grain motion visible|Sound source|Stretched membrane|Rice grains|Sound sets the membrane in motion.|The grains bounce when the membrane moves.
10.5|Turn pressure into a trace|Microphone|Pressure samples|Time graph|An instrument records pressure changes at one point.|The wave-shaped line is a graph, not the path of air particles.
10.6|Compare pitch and loudness|Wave trace|Frequency|Amplitude|Frequency chiefly affects perceived pitch.|Amplitude affects intensity and can change perceived loudness.
10.6.1|Relate one cycle to one wavelength|One period|Wave speed|Wavelength|In one period the pattern travels one wavelength.|Frequency is the reciprocal of the period.
A10.7|Read a frequency spectrum|Steady tone|Microphone|Frequency peak|A microphone samples the pressure signal.|A spectral peak identifies a strong frequency in the sound.
10.6.2|Increase vibration amplitude|Small vibration|Large vibration|Greater intensity|Greater pressure amplitude carries more energy.|In the same medium intensity scales with amplitude squared.
10.6.3|Measure travel speed|Source pulse|Known distance|Arrival time|Measure how long the pulse takes to cross the distance.|Speed is path length divided by travel time.
10.6.4|From pressure to hearing|Eardrum|Inner ear|Nerve signal|Pressure variations vibrate the eardrum.|The inner ear converts mechanical motion into nerve signals.
A10.8|Compare tones without playing audio|Low frequency|More cycles per second|Higher pitch|Increase frequency while keeping amplitude similar.|Within the audible range the perceived pitch rises.
10.7|Reflect sound from a wall|Incident pulse|Hard surface|Reflected pulse|A pulse reaches a boundary between media.|Part of its energy returns into the first medium.
10.7.1|Time an echo|Caller|Distant wall|Returning sound|The sound travels to the wall and back.|For wall distance, halve the round-trip path length.
10.7.2|Hear why a hall rings|Sound pulse|Many surfaces|Overlapping returns|Reflections travel along paths of different lengths.|Closely spaced returns prolong the sound.
10.8|Compare frequencies outside hearing|Infrasound|Human hearing|Ultrasound|Infrasound is below the typical human hearing range.|Ultrasound is above it; neither term specifies loudness.
10.8.1|Locate prey by echo|Bat 🦇|Flying insect|Returning call|The outgoing call reflects from the insect.|A shorter echo delay indicates a nearer target.
11.1|Follow one parent to offspring|One parent|Cell division|Offspring|Asexual reproduction does not involve fusion of gametes.|Offspring usually inherit nearly the same genetic information.
11.1.1|Grow a plant from a stem|Stem cutting|Roots|New shoot 🌱|Roots can arise from a suitable cutting.|An independent plant develops without a seed.
A11.1|Compare cutting and layering|Parent stem|Buried attached shoot|Rooted plant|In layering the shoot remains attached while roots develop.|A cutting is separated before its new roots develop.
A11.2|Watch yeast budding|Parent yeast|Small bud|Daughter cell|A bud grows from the parent as genetic material is distributed.|The daughter can detach when mature.
A11.3|Trace a bread mould life cycle|Spore|Hyphae|Spore case|A spore can give rise to branching filaments.|Spore-bearing structures produce new dispersal units.
11.2|Combine hereditary information|One gamete|Second gamete|Zygote|Gametes carry half the usual chromosome set.|Fusion restores the paired set in the zygote.
A11.4|Model chromosome assortment with beads|Paired colours|Pair orientation|Gamete sets|Each chromosome pair can orient independently at meiosis I.|Different combinations can enter the gametes.
11.2.2|Identify reproductive parts of a flower|Anther 🌸|Stigma|Ovule|Anthers produce pollen and the stigma receives it.|Fertilisation takes place inside an ovule.
A11.5|Inspect a flower from outside inward|Sepals|Petals|Reproductive organs|Sepals protect the bud and petals often attract visitors.|The inner whorls contain stamens or carpels, or both.
A11.6|Distinguish pollination sources|Flower bud|Pollen access|Seed formation|Compare flowers with different access to pollen.|Seed formation can provide evidence of successful reproduction.
11.2.3|Trace a pollen grain's journey|Anther|Carrier 🐝|Stigma|Pollen leaves the anther on a carrier such as an insect.|Arrival on a suitable stigma is pollination, not yet fertilisation.
11.2.4|Compare wind and insect transfer|Wind dispersal|Pollen delivery|Insect visit|Wind scatters pollen broadly, often with high losses.|An insect can carry pollen between flowers more directly.
A11.7|Compare investment and seed set|Pollen produced|Pollen delivered|Seeds formed|Production alone does not measure pollination success.|Compare seed output alongside pollen production for each strategy.
11.3|Follow an animal life cycle|Gametes|Embryo|Young animal|Fertilisation initiates development of a new individual.|The embryo grows through repeated cell divisions.
11.4|Compare development in different animals|Egg laid outside|Developing embryo|Birth or hatching|Some embryos develop in laid eggs.|Others develop within the parent's body before birth.
11.5|Trace human development|Fertilisation|Implantation|Development|A fertilised egg divides as it travels toward the uterus.|Implantation allows development to continue in the uterine lining.
11.5.1|Distinguish changes at puberty|Hormonal signals|Physical changes|Different timelines|Hormones coordinate changes as the body matures.|The timing and pace differ between individuals.
11.5.2|Trace the male reproductive pathway|Testis|Epididymis|Sperm duct|Sperm form in the testes and mature in the epididymis.|The sperm duct transports them onward.
11.5.3|Trace the female reproductive pathway|Ovary|Oviduct|Uterus|An ovary can release an egg into the oviduct.|The uterus supports an implanted embryo.
11.5.4|From precursor cell to gamete|Paired chromosomes|Meiosis|Gamete|Meiosis separates homologous chromosome pairs and then chromatids.|The resulting cells contain a single chromosome set.
11.5.5|Watch nuclei unite|Egg|Sperm|Zygote|One sperm can fuse with an egg.|Genetic material from both contributes to the zygote.
11.5.6|Follow a cycle without fertilisation|Prepared lining|Hormone decline|Menstruation|Without pregnancy the hormone support for the lining falls.|Part of the uterine lining is shed.
11.5.7|Trace exchange before birth|Maternal circulation|Placenta|Fetal circulation|Oxygen and nutrients cross the placental exchange surface.|Fetal blood carries them through the umbilical cord.
11.5.8|Connect maternal and fetal health|Balanced nutrition|Prenatal care|Healthy development|Nutrition supports the needs of both pregnant person and fetus.|Regular care helps identify problems and provide support.
11.5.9|Distinguish physical and emotional readiness|Physical maturity|Informed choices|Mutual consent|Physical development does not by itself establish readiness.|Respect, communication and freely given consent matter.
11.5.10|Compare protective functions|Barrier method|Pregnancy prevention|Infection risk|Condoms reduce pregnancy risk and risk of many sexually transmitted infections.|Not every contraceptive method also reduces infection risk.
12.1|Connect habitats to biodiversity|Mountain habitat|Coastal habitat|Distinct species|Contrasting habitats support different communities.|A biodiversity hotspot combines high endemism with serious habitat loss.
12.2|Follow inherited variation over generations|Variation|Differential reproduction|Population change|Individuals vary in heritable traits.|Different reproductive success can change trait frequencies over generations.
12.3|Group organisms using evidence|Specimens|Shared traits|Nested groups|Compare traits across organisms rather than relying on one superficial feature.|Patterns of shared ancestry guide modern classification.
A12.1|Sort animals in an ecosystem|Day-active animals|Observed behaviour|Night-active animals|Activity time gives one way to group observations.|A behavioural group need not be a taxonomic group.
12.3.1|Choose traits for classification|Cell structure|Nutrition|Organisation|Compare nucleus and cellular organisation first.|Nutrition and other traits add evidence about relationships.
12.4|Resolve ambiguous common names|Local name|Shared classification|Scientific name|One common name can refer to different organisms.|A shared naming system makes records comparable.
A12.2|Organise observations at Pakke|Bird sightings 🐦|Species identities|Survey record|Distinguish repeated sightings from distinct species.|Consistent classification supports comparisons of biodiversity.
12.5|See why classification systems change|Visible form|Microscope evidence|Molecular evidence|Microscopy revealed groups not apparent from outward form.|New evidence can revise proposed relationships.
12.6|Trace the five-kingdom framework|Cell type|Organisation|Nutrition|The historical framework compares cell structure and number of cells.|Mode of nutrition helps separate fungi, plants and animals.
A12.3|Read a kingdom classification key|Nucleus present?|Single or multicellular?|Nutrition mode|Each decision narrows the set of possible groups.|Use multiple features before assigning a kingdom.
A12.4|Inspect a prokaryotic cell|Cell boundary|Nucleoid|No enclosed nucleus|Bacteria have genetic material in a nucleoid region.|Cyanobacteria can photosynthesise without chloroplasts.
12.6.2|Watch an amoeba feed|Amoeba|Pseudopods|Food vacuole|Temporary projections surround a food particle.|The enclosed particle enters a vacuole in this single eukaryotic cell.
A12.5|Observe protists in a water sample|Microscope field 🔬|Moving cell|Movement pattern|Track a single organism rather than drifting debris.|Cilia, flagella or pseudopods can produce different motion.
12.6.3|Trace feeding in a fungus|Hyphal network|External digestion|Absorption|Enzymes break material down outside the fungal cells.|Small soluble products are absorbed.
12.6.4|Follow energy into a green plant|Sunlight ☀️|Chloroplast|Sugars|Chloroplasts capture light energy.|Photosynthesis uses this energy to make organic material.
A12.6|Inspect a bryophyte|Leafy shoot|Rhizoids|Moist surface|Rhizoids anchor the plant rather than acting as true roots.|Bryophytes lack the vascular tissues of ferns and flowering plants.
A12.7|Compare transport tissues in stems|Fern stem|Vascular tissue|Sunflower stem|Both plants possess tissues that transport water and nutrients.|Their bundle arrangements and reproductive structures differ.
A12.8|Compare leaf vein patterns|Grass leaf|Parallel veins|Net-veined leaf|Parallel venation is common in monocots.|Net-like venation is common in dicots; use other traits too.
A12.9|Compare plant adaptations|Vascular tissue|Seeds|Flowers|Conducting tissues support transport through larger plants.|Seeds protect embryos; flowers aid reproduction in flowering plants.
12.6.5|Trace nutrition in an animal|Food intake|Internal digestion|Absorption|Animals ingest organic material.|Digestion releases small molecules that cells can use.
12.7|Connect inherited structure to function|Variation in beaks|Food source|Feeding success|A beak shape may work better for a particular food.|Across generations inherited differences can influence adaptation.
12.8|Read a binomial name|Genus|Specific epithet|Mangifera indica|Capitalise the genus and use lowercase for the specific epithet.|Together the two words identify the species.
12.9|Read a fossil sequence|Buried remains|Sediment layers|Fossil record|Burial can preserve traces of earlier life.|In undisturbed strata deeper layers are generally older.
12.10|Trace the effect of fragmentation|Continuous habitat|Isolated patches|Smaller populations|Fragmentation can separate formerly connected populations.|Reduced movement and gene flow can increase vulnerability.
A13.1|Follow a change across Earth's spheres|Winter snow|Summer lake|Grass growth|Less snowfall can reduce meltwater entering a lake.|Less available water can affect the living community.
13.1|Compare warming of land and water|Same sunlight|Land surface|Water body|Land and water respond differently to the same energy input.|Their temperature difference can help drive circulation.
13.1.1|Track incoming sunlight|Incoming ray|Reflected energy|Absorbed energy|Part of the incident radiation returns to space.|Absorbed radiation warms the surface.
A13.2|Compare surface albedo|Fresh snow|Incident light|Dark ground|Snow reflects a large fraction of incoming light.|Dark ground generally absorbs a greater fraction.
13.1.2|Spread sunlight across latitudes|Equal-width beam|Near equator|Near pole|Near-normal light is concentrated over a smaller area.|An oblique beam spreads similar energy over a larger area.
13.1.3|Trace radiation through the atmosphere|Sunlight|Warm surface|Infrared radiation|The surface emits infrared radiation as it warms.|Greenhouse gases absorb and re-emit some of it.
13.2|Follow heat-driven circulation|Uneven warming|Density difference|Moving fluid|Temperature and density differences can initiate circulation.|Air and water transport heat as they move.
13.2.1|Trace a daytime sea breeze|Warm land|Rising air|Cool sea air|Air over sun-warmed land rises.|Cooler near-surface air flows inland from the water.
13.2.2|Trace a planetary wind belt|Equatorial heating|Pressure belts|Deflected winds|Uneven heating contributes to broad circulation cells.|Earth's rotation deflects moving air.
13.2.3|Follow a surface current|Wind stress|Ocean current|Heat transport|Persistent winds transfer momentum to surface water.|Currents redistribute heat between regions.
13.3|Follow an atom through a cycle|Physical reservoir|Living organism|Return flow|Atoms move between air, water, land and living things.|Recycling matter is different from the one-way flow of energy.
13.3.2|Follow carbon through a plant|Atmospheric CO₂|Plant carbon 🌿|Respiration|Photosynthesis incorporates carbon into organic molecules.|Respiration releases carbon dioxide back to the environment.
13.3.3|Follow nitrogen into a food web|Atmospheric N₂|Fixed nitrogen|Plant proteins|Nitrogen fixation makes nitrogen available in reactive compounds.|Plants assimilate available nitrogen to build organic molecules.
13.3.4|Trace oxygen exchange|Green leaf|Atmospheric O₂|Respiring cell|Photosynthesis releases oxygen from water.|Aerobic respiration uses oxygen and produces water.
13.4|Trace a human change through the system|Forest removal|Surface runoff|Downstream habitat|Loss of cover can increase erosion and runoff.|Changes in sediment and water flow affect downstream ecosystems.
`.trim();

export interface TopicStory { title: string; nodes: [string,string,string]; captions: [string,string] }
export const topicStories: Record<string, TopicStory> = Object.fromEntries(rows.split('\n').map(row=>{
  const [key,title,a,b,c,first,second]=row.split('|');
  if (!second) throw new Error(`Incomplete textbook visual: ${key}`);
  return [key.replace(/^A/,'Activity '),{title,nodes:[a,b,c],captions:[first,second]}];
}));
