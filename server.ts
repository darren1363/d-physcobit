import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize dynamic Gemini client
function getGenAIClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (!key || key.trim() === '') return null;
  return new GoogleGenAI({
    apiKey: key.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Normal language diagnosis with exact problem-based suggestions
function generateNormalLanguageDiagnosis(heartRate: number, sleep: number, exercise: number, stress: string) {
  const isHeartbeatFast = heartRate > 80;
  const isTooStressed = stress === 'High' || stress === 'Severe';
  const isTooLessSleep = sleep < 7.0;
  const isTooLessExercise = exercise < 40;

  const isDanger = (heartRate >= 105) || (heartRate >= 92 && sleep <= 4.5) || (sleep <= 4.0 && isTooStressed);
  const isOtherwiseHealthy = !isHeartbeatFast && !isTooLessSleep && !isTooStressed;
  const hasProblems = !isDanger && !isOtherwiseHealthy;

  // Case 1: Serious / Danger
  if (isDanger) {
    let msg = `Hi, you are in danger!\n\n`;
    msg += `Your vitals are showing critical strain: your heartbeat is ${heartRate} BPM with only ${sleep} hours of sleep and ${stress.toLowerCase()} stress.\n\n`;
    msg += `Here is what you must do right now:\n`;
    if (isHeartbeatFast) msg += `• Your heartbeat is too fast — please take some rest and do deep breathing.\n`;
    if (isTooLessSleep) msg += `• Your sleeping time is too less (${sleep}h) — please go and take more sleep.\n`;
    if (isTooStressed) msg += `• You are feeling too stressed — please play some games and relax.\n`;
    if (isTooLessExercise) msg += `• Please do some light exercise or stretching once your vitals stabilize.\n`;
    msg += `• Stop all strenuous activities immediately, lie down to rest, and notify medical support right away!\n\n`;
    msg += `✨ Every success comes from a dream — take care of your body first!`;
    return msg;
  }

  // Case 2: Healthy overall BUT exercise is too less
  if (isOtherwiseHealthy && isTooLessExercise) {
    let msg = `Hi, your health level is great!\n\n`;
    msg += `Your heartbeat is healthy and normal at ${heartRate} BPM, you had a good ${sleep} hours of sleep, and your stress is ${stress.toLowerCase()}.\n\n`;
    msg += `However, your exercise time is too less (${exercise} mins). Please do some exercise although you are healthy, so your body and muscles can stay strong and active!\n\n`;
    msg += `✨ Every success comes from a dream — keep moving!`;
    return msg;
  }

  // Case 3: Other problems (fast heartbeat, low sleep, or high stress)
  if (hasProblems) {
    let msg = `Hi, you have got some problems with your health condition.\n\n`;
    msg += `Your body is showing some warning signs today:\n\n`;
    if (isHeartbeatFast) {
      msg += `• Your heartbeat is too fast (${heartRate} BPM) — please take some rest and take deep breaths.\n`;
    }
    if (isTooStressed) {
      msg += `• You are feeling too stressed (${stress}) — please play some games, listen to music, and take your mind off work.\n`;
    }
    if (isTooLessSleep) {
      msg += `• Your sleeping time is too less (${sleep} hours) — please go and take more sleep so your body can recharge.\n`;
    }
    if (isTooLessExercise) {
      msg += `• You did too less exercise (${exercise} mins) — please do some exercise to keep your body active.\n`;
    }
    msg += `\n✨ Every success comes from a dream — give your body what it needs today!`;
    return msg;
  }

  // Case 4: Completely Great Condition (all 4 vitals nominal)
  let msg = `Hi, your health level is great!\n\n`;
  msg += `Your heartbeat is healthy and normal at ${heartRate} BPM, you had a good ${sleep} hours of sleep, your ${exercise} minutes of exercise keeps you fit, and your stress level is ${stress.toLowerCase()}.\n\n`;
  msg += `Everything looks wonderful! Please keep up this healthy routine and have an energetic day!\n\n`;
  msg += `✨ Every success comes from a dream — keep shining!`;
  return msg;
}

// Deep, comprehensive spaceflight medical & operational problem solver
function generateTailoredSpaceHealthAnswer(problem: string): string {
  const p = problem.toLowerCase().trim();
  const hasWord = (word: string) => new RegExp(`\\b${word}\\b`, 'i').test(p);

  // === ASTRONAUT FEELINGS, EMOTIONS & PSYCHOLOGICAL SUPPORT ===
  // F1. Overview Effect, feeling small, awe looking at Earth
  if (p.includes('overview effect') || p.includes('in awe') || p.includes('feel small') || p.includes('insignificant') || p.includes('looking at earth') || p.includes('view of earth') || p.includes('fragile planet')) {
    return `Hi astronaut! What you are experiencing is the famous "Overview Effect" — a profound cognitive shift reported by astronauts seeing Earth from orbit.\n\nViewing our fragile blue planet suspended in the deep cosmic void puts human life and unity into unforgettable perspective.\n\nHere is what you should do to embrace this moment:\n• Take a quiet moment at the Cupola window to absorb the beauty without rushing.\n• Write down your feelings and insights in your crew mission journal while the memory is vivid.\n• Take high-resolution photos or audio recordings to share this perspective with people back home.\n\n✨ Every success comes from a dream.`;
  }

  // F2. Loneliness, homesickness, missing family, missing Earth
  if (p.includes('lonely') || p.includes('homesick') || p.includes('miss my family') || p.includes('miss family') || p.includes('miss home') || p.includes('missing earth') || p.includes('miss earth') || p.includes('miss my kids') || p.includes('miss my wife') || p.includes('miss my husband') || p.includes('alone in space') || p.includes('isolated') || p.includes('isolation')) {
    return `Hi astronaut, I hear you deeply. Long-duration isolation in an orbital habitat far from Earth is one of the heaviest emotional challenges.\n\nMissing familiar voices, fresh air, and your loved ones is completely natural and experienced by every crew.\n\nHere is what you can do right now to feel grounded:\n• Visit the Cupola or observation window for 10 minutes to gaze at Earth's continents and blue oceans.\n• Connect with your crewmates for a warm shared meal, or request an IP phone/video link to your family.\n• Listen to your favorite personal music or ambient nature recordings in our Music player.\n\nYou are never alone — the entire mission control family is cheering for you!\n\n✨ Every success comes from a dream.`;
  }

  // F3. Anxiety, fear, panic, nervous, terrified, spacewalk dread
  if (p.includes('anxious') || p.includes('anxiety') || p.includes('scared') || p.includes('fear') || p.includes('panic') || p.includes('nervous') || p.includes('terrified') || p.includes('dread') || p.includes('frightened') || p.includes('freaking out') || p.includes('worried')) {
    return `Hi astronaut, take a slow, deep breath with me. Experiencing anxiety or fear in high-risk orbital environments or before EVAs is a normal human response.\n\nYour body's autonomic nervous system is simply priming for alert readiness.\n\nHere is how you can regain calm and focus right now:\n• Practice Box Breathing: inhale for 4s, hold for 4s, exhale for 4s, hold for 4s (repeat 4 times).\n• Review your immediate checklist or EVA cue cards — structured procedures help ground cognitive focus.\n• Reach out to your Flight Surgeon on the private audio loop; sharing feelings relieves physiological tension.\n\nYou are rigorously trained, highly capable, and fully supported.\n\n✨ Every success comes from a dream.`;
  }

  // F4. Burnout, overwhelmed, timeline pressure, mental exhaustion
  if (p.includes('overwhelm') || p.includes('burnout') || p.includes('too much work') || p.includes('exhaust') || p.includes('timeline') || p.includes('redline') || p.includes('schedule pressure') || p.includes('brain fog') || p.includes('overworked')) {
    return `Hi astronaut, acknowledge your fatigue. Operating on a relentless 5-minute redline timeline in microgravity drains cognitive reserves.\n\nCrew burnout is real, and taking care of your mental stamina is critical for mission safety.\n\nHere is what you should do right now:\n• Call down to CAPCOM / Flight Director to request task de-confliction or timeline pacing.\n• Take a mandatory 15-minute quiet period in your sleep bunk away from computer displays.\n• Drink 250ml of cold electrolyte water and practice 3 minutes of passive muscle relaxation.\n\nPace yourself — you don't have to carry the whole orbital station alone today.\n\n✨ Every success comes from a dream.`;
  }

  // F5. Cabin fever, frustration, irritability, confinement, annoyed with crew
  if (p.includes('cabin fever') || p.includes('irritab') || p.includes('frustrat') || p.includes('annoy') || p.includes('confined') || p.includes('trapped') || p.includes('stuck inside') || p.includes('bored') || p.includes('angry') || p.includes('temper')) {
    return `Hi astronaut! Microgravity confinement with the same small crew inside pressurized metallic modules naturally sparks irritability and cabin fever.\n\nSensory monotony and lack of private physical space are documented spaceflight stressors.\n\nHere is what will help reset your mood right now:\n• Float into an unoccupied module (like the airlock or node) for 10 minutes of sensory solitude.\n• Vent your thoughts in a private flight journal or play our interactive arcade games to release dopamine.\n• Practice reframing: assume positive intent from crewmates before addressing minor friction at dinner.\n\n✨ Every success comes from a dream.`;
  }

  // F6. Sadness, depression, feeling down, crying, emotionally low
  if (p.includes('sad') || p.includes('depress') || p.includes('crying') || hasWord('cry') || p.includes('unhappy') || p.includes('miserable') || hasWord('down') || p.includes('gloomy') || p.includes('hopeless')) {
    return `Hi astronaut, I am right here with you. It is okay to feel sad or shed tears, even millions of miles above the planet.\n\nAltered neurochemistry from circadian disruptions and lack of natural sunlight can lower mood in space.\n\nHere is what you should do right now:\n• Turn your sleep cabin lighting to warm, high-lux daylight mode to stimulate serotonin.\n• Put on comfortable headphones and play soothing music in our entertainment hub.\n• Open your personal crew care package or look at photos of your favorite places on Earth.\n• Don't bottle it up — let your mission commander or flight psychologist support you.\n\n✨ Every success comes from a dream.`;
  }

  // F7. General stress / mental health
  if (p.includes('stress') || p.includes('mental') || hasWord('alone')) {
    return `Hi astronaut, I hear you. Confinement inside an orbiting habitat millions of miles from Earth is an immense psychological challenge.\n\nHere is what will help reset your mental wellbeing:\n• Take 10 minutes at the observatory window to view Earth (the calming "Overview Effect").\n• Switch to our Music tab to listen to your favorite songs, or play a quick stress-relief game.\n• Connect with your crewmates for a casual chat or request an IP phone call with your family.\n\nYou are never alone — the entire mission control family is cheering for you!\n\n✨ Every success comes from a dream.`;
  }

  // === EXERCISE & PHYSICAL FITNESS INQUIRIES ===
  // E1. Can I skip workout / too tired to exercise
  if (p.includes('skip') || p.includes('too tired to exercise') || p.includes('dont want to exercise') || p.includes("don't want to exercise") || p.includes('miss workout') || p.includes('stop exercising')) {
    return `Hi astronaut! In zero-G, skipping your scheduled workout is strongly discouraged and requires flight surgeon approval.\n\nWithout Earth's 1-G gravity load, muscles lose up to 20% of their mass in just 5 to 11 days, and bones shed 1% to 1.5% mineral density each month.\n\nHere is what you should do if you feel fatigued today:\n• Switch to an "Active Recovery" protocol: do 20 minutes of gentle, low-resistance cycling on CEVIS.\n• Perform light mobility stretches and core postural holds on ARED instead of heavy maximum lifts.\n• Hydrate with 300ml of electrolyte water before and after moving.\n\nEven a low-intensity session maintains critical neuromuscular pathways!\n\n✨ Every success comes from a dream.`;
  }

  // E2. How much exercise / daily workout duration and schedule
  if (p.includes('how much exercise') || p.includes('how long exercise') || p.includes('daily workout') || p.includes('exercise schedule') || p.includes('workout routine') || p.includes('exercise each day') || p.includes('exercise time') || p.includes('workout time') || p.includes('how much workout')) {
    return `Hi astronaut! The standard spaceflight countermeasure protocol mandates 2.0 to 2.5 hours of exercise every single day.\n\nThis daily regimen is structured to safeguard both your musculoskeletal and cardiovascular systems:\n• ~60 minutes on ARED (Advanced Resistive Exercise Device) for high-load squats, deadlifts, and heel raises.\n• ~30 to 45 minutes on the T2 Colbert treadmill with bungee harness for bone impact loading.\n• ~30 minutes on the CEVIS cycle ergometer for aerobic endurance and cardiovascular stroke volume.\n\nHere is what you should do today:\n• Check your daily timeline display for your designated exercise module window.\n• Complete your pre-workout equipment calibration and strap in securely.\n\n✨ Every success comes from a dream.`;
  }

  // E3. Bird legs / skinny legs / calf muscle atrophy
  if (p.includes('bird leg') || p.includes('skinny leg') || p.includes('legs thin') || p.includes('legs small') || p.includes('legs shrink') || p.includes('chicken leg') || (p.includes('leg') && p.includes('skinny')) || (p.includes('leg') && p.includes('atrophy'))) {
    return `Hi astronaut! "Bird legs" is an iconic, universal phenomenon of spaceflight.\n\nIt happens because about 1.5 to 2.0 liters of blood and interstitial fluids shift upward from your lower body to your head, combined with calf muscle disuse in zero-G.\n\nHere is what you should do to combat calf and leg muscle atrophy:\n• Perform high-intensity heel raises, calf presses, and deep squats on the ARED device.\n• Use the T2 treadmill with bungee harness loaded to 65-70% body weight to provide heel impact.\n• Eat sufficient protein (1.2 - 1.5g per kg of body mass) to support muscle synthesis.\n\nYour leg fluids will naturally return to normal within 48 hours of landing back on Earth!\n\n✨ Every success comes from a dream.`;
  }

  // E4. Bone density loss / osteoporosis / calcium
  if (p.includes('bone loss') || p.includes('bone density') || p.includes('osteoporos') || p.includes('bone mass') || p.includes('calcium')) {
    return `Hi astronaut! In microgravity, your bones shed between 1.0% and 1.5% of their mineral density each month, especially in the hips, femur, and lumbar spine.\n\nWithout mechanical impact, osteoclasts break down bone tissue faster than osteoblasts can rebuild it.\n\nHere is what you should do right now:\n• Perform heavy mechanical load exercises on ARED (squats, heel strikes, deadlifts) simulating Earth weights up to 600 lbs.\n• Take your daily prescribed Vitamin D3 and calcium supplement rations.\n• Avoid excess dietary sodium, which can accelerate renal calcium excretion into urine.\n\nConsistent resistance workouts are your number one shield against bone loss!\n\n✨ Every success comes from a dream.`;
  }

  // E5. ARED, Treadmill T2, CEVIS cycle, harness pain, foot or shoulder soreness
  if (hasWord('ared') || p.includes('treadmill') || p.includes('cevis') || p.includes('ergometer') || p.includes('harness') || p.includes('bungee') || p.includes('foot hurt') || p.includes('feet hurt') || p.includes('foot sore') || p.includes('shoulder hurt') || p.includes('bruise')) {
    return `Hi astronaut! Working out in microgravity requires specialized gear, and bungee harness straps commonly cause shoulder bruising and foot sole soreness.\n\nThe T2 bungee harness must pull you down with 60% to 70% of your body weight so you don't float off the belt.\n\nHere is what you should do right now:\n• Insert foam padding strips or silicone gel pads under the harness shoulder straps.\n• Wear double-cushioned flight workout socks or insert orthotic insoles into your treadmill shoes.\n• On the CEVIS ergometer, ensure your foot clips and waist restraint tether are snug but not pinching.\n\nIf skin chafing or bruising occurs, apply topical soothing cream from the medical kit.\n\n✨ Every success comes from a dream.`;
  }

  // E6. General fitness, workout routine, cardio, stamina, conditioning
  if (p.includes('fitness') || p.includes('cardio') || p.includes('stamina') || hasWord('workout') || hasWord('workouts') || p.includes('sweat') || hasWord('train') || hasWord('training') || p.includes('aerobic') || (hasWord('exercise') && !p.includes('less') && !p.includes('no'))) {
    return `Hi astronaut! Space fitness is vital because microgravity causes rapid cardiovascular deconditioning and reduces heart stroke volume.\n\nMaintaining your peak VO2 aerobic capacity ensures you are always ready for demanding EVAs or emergency station maneuvers.\n\nHere is what you should do for optimal orbital fitness:\n• Keep your target heart rate between 70% and 85% of max during aerobic intervals on CEVIS.\n• Wipe away perspiration frequently with absorbent towels — sweat clings to skin in zero-G without dripping!\n• Drink 350ml of cool water with minerals and enjoy a protein nutrient pack within 30 minutes post-workout.\n\nKeep pushing — strong muscles and a strong heart make a safe mission!\n\n✨ Every success comes from a dream.`;
  }

  // === PHYSICAL HEALTH & FLIGHT MEDICAL ISSUES ===
  // 1. Teeth, dental, gum bleeding, toothache (checked before ear to avoid baro-conflict)
  if (p.includes('tooth') || p.includes('teeth') || p.includes('dental') || p.includes('gum') || p.includes('mouth')) {
    return `Hi astronaut! Microscopic air bubbles under dental restorations can expand or contract with cabin pressure fluctuations (barodontalgia).\n\nHere is what you should do right now:\n• Rinse your mouth with warm mild saline water.\n• Avoid consuming extremely hot or cold rehydrated packages on the affected side.\n• Use temporary dental analgesic paste from the emergency medical kit if discomfort persists.\n\n✨ Every success comes from a dream.`;
  }

  // 2. Ear popping, barotrauma, airlock pressure, hearing
  if (p.includes('ear') || p.includes('pop') || p.includes('airlock') || p.includes('hearing')) {
    return `Hi astronaut! Pressure adjustments in the airlock or cabin combined with mild Eustachian tube congestion can cause ear fullness and popping.\n\nHere is what you should do right now:\n• Perform a gentle Valsalva maneuver (pinch nostrils gently and blow with mouth closed).\n• Swallow or yawn repeatedly to open the auditory tubes.\n• If pain is sharp or unilateral, notify the medical officer before further pressure changes.\n\n✨ Every success comes from a dream.`;
  }

  // 3. Fingernails, EVA suit gloves, fingers, hand strain
  if (p.includes('fingernail') || p.includes('nail') || p.includes('glove') || (p.includes('finger') && !p.includes('print')) || p.includes('eva')) {
    return `Hi astronaut! Spacesuit glove pressure and fingernail delamination are very common during extravehicular activity (EVA).\n\nWhen working against 4.3 psi suit pressure, the glove rubber resists hand closure, and repetitive tip contact restricts capillary perfusion under your nails.\n\nHere is what you should do right now:\n• Trim your nails short and straight across; never leave jagged edges.\n• Apply silicone protective tape or cushioned dressings over your fingertips before suit operations.\n• Soak your hands in warm water for 10 minutes and perform gentle finger flex extensions.\n\n✨ Every success comes from a dream.`;
  }

  // 4. Cosmic flashes, light streaks, phosphenes, radiation, solar flare
  if (p.includes('flash') || p.includes('radiation') || p.includes('streak') || p.includes('flare') || p.includes('phosphene') || p.includes('dosimeter')) {
    return `Hi astronaut! Seeing light streaks or flashes when your eyes are closed is caused by high-energy cosmic rays (HZE ions) striking your retina.\n\nThese particles pass harmlessly through the spacecraft walls and directly stimulate your retinal photoreceptors.\n\nHere is what you should do right now:\n• Wear your sleep blindfold to help rest your visual cortex.\n• Check your personal radiation dosimeter badge to ensure readings are within nominal thresholds.\n• If a Solar Particle Event (SPE) alert is broadcast, move immediately to the central shielded water-wall quarters.\n\n✨ Every success comes from a dream.`;
  }

  // 5. Vision changes, SANS, blurry eyes, cotton wool spots, optic swelling
  if (p.includes('vision') || p.includes('eye') || p.includes('blur') || p.includes('sans') || p.includes('optic') || p.includes('sight')) {
    return `Hi astronaut! You are describing Spaceflight-Associated Neuro-Ocular Syndrome (SANS).\n\nWithout gravity pulling fluid down, about 2 liters of blood and spinal fluid shift to your head, flattening the back of your eyeballs and causing hyperopic blur.\n\nHere is what you should do right now:\n• Use the onboard adjustable focus glasses ("Super-Specs") for monitor and reading tasks.\n• Lower cabin display brightness and avoid reading small text for extended periods.\n• Log your symptom progression and schedule a quick fundus scope check with medical.\n\n✨ Every success comes from a dream.`;
  }

  // 6. Space Adaptation Syndrome, Nausea, Vertigo, Room Spinning, Dizziness
  if (p.includes('nausea') || p.includes('sick') || p.includes('dizzy') || p.includes('spin') || p.includes('vomit') || p.includes('vertigo') || p.includes('motion') || p.includes('sas')) {
    return `Hi astronaut! What you are feeling is Space Adaptation Syndrome (SAS).\n\nYour inner-ear vestibular otoliths no longer sense gravitational up/down, creating a sensory mismatch with what your eyes see.\n\nHere is what you should do right now:\n• Keep your head relatively steady and avoid rapid pitch or roll rotations.\n• Fix your gaze on a stable interior station bulkhead or reference horizon.\n• Sip chilled electrolyte water slowly and eat small dry snacks like crackers.\n\nMost astronauts adapt fully within 48 to 72 hours. Hang in there!\n\n✨ Every success comes from a dream.`;
  }

  // 7. Head pressure, puffy face, sinus fullness, fluid shift
  if (p.includes('headache') || p.includes('head') || p.includes('pressure') || p.includes('puffy') || p.includes('sinus') || p.includes('stuffy') || p.includes('fluid')) {
    return `Hi astronaut! Experiencing head fullness and sinus congestion is the classic "cephalad fluid shift" of spaceflight.\n\nFluids redistribute from your legs toward your head and chest, causing facial puffiness, nasal swelling, and mild intracranial tension.\n\nHere is what you should do right now:\n• Use a saline nasal spray from the medical kit to moisten and clear nasal passages.\n• Stay well hydrated with sodium-balanced fluids to maintain stable blood viscosity.\n• Perform gentle neck rotations and shoulder rolls to encourage venous drainage.\n\n✨ Every success comes from a dream.`;
  }

  // 8. Sleep disruption, circadian rhythm, bunk air, noise, waking up
  if (p.includes('sleep') || p.includes('insomnia') || p.includes('tired') || p.includes('wake') || p.includes('night') || p.includes('restless') || p.includes('bunk')) {
    return `Hi astronaut! Sleeping in orbit is challenging with 16 daily sunrises and continuous equipment ventilation noise.\n\nAlso, without air convection, exhaled carbon dioxide can form a localized pocket around your head if bunk airflow is insufficient.\n\nHere is what you should do right now:\n• Confirm your sleep cabin ventilation fan is blowing a steady, gentle cross-breeze.\n• Fasten your sleeping bag tether straps snug against your chest to simulate proprioceptive gravity.\n• Put on your blackout eye mask and noise-cancelling earplugs, and avoid tablets 40 minutes prior.\n\n✨ Every success comes from a dream.`;
  }

  // 9. Fast heart rate, palpitations, chest flutter, tachycardia, pulse
  if (p.includes('heart') || p.includes('beat') || p.includes('pulse') || p.includes('flutter') || p.includes('palpitat') || p.includes('chest')) {
    return `Hi astronaut! Heart rate elevations in microgravity often stem from fluid shifts reducing stroke volume or temporary autonomic nervous system stress.\n\nHere is what you should do right now:\n• Cease heavy physical exertion and float motionless in a relaxed posture.\n• Practice 4-7-8 deep breathing: inhale through nose for 4s, hold for 7s, exhale slowly for 8s.\n• Sip 250ml of cool water with electrolytes to support circulatory volume.\n• Take a 2-minute pulse count; if flutter or discomfort persists, contact the ground medical console.\n\n✨ Every success comes from a dream.`;
  }

  // 10. Spine elongation, back pain, taller, lumbar stiffness
  if (p.includes('back') || p.includes('spine') || p.includes('tall') || p.includes('lumbar') || p.includes('elongat')) {
    return `Hi astronaut! You are experiencing space spinal elongation. Without gravity compressing your vertebrae, intervertebral discs expand, lengthening your spine by 2 to 3 inches.\n\nThis places constant tension on your back erector muscles and ligaments.\n\nHere is what you should do right now:\n• Pull your knees tightly up to your chest in zero-G (fetal tuck position) for 5 minutes.\n• Gently flex your pelvis forward and back to decompress the lumbar joints.\n• Use a warm damp towel pack from hygiene to warm your lower back.\n\n✨ Every success comes from a dream.`;
  }

  // 11. Muscle soreness, general aches, cramps
  if (p.includes('muscle') || p.includes('sore') || p.includes('weak') || p.includes('cramp') || p.includes('ache')) {
    return `Hi astronaut! Weightlessness removes the 1-G postural load from your musculoskeletal system, causing rapid muscle disuse if not counteracted.\n\nHere is what you should do right now:\n• Keep up your scheduled daily countermeasure routine with ARED resistance and treadmill.\n• Gently massage sore muscles, and perform slow resistance-band stretches.\n• Increase your dietary protein intake (1.2 to 1.5g per kg) and stay stocked on Vitamin D and calcium.\n\n✨ Every success comes from a dream.`;
  }

  // 12. Food taste, appetite loss, bland meals, digestive issues, bloating
  if (p.includes('food') || p.includes('taste') || p.includes('eat') || p.includes('appetite') || p.includes('bloat') || p.includes('gas') || p.includes('stomach') || p.includes('constipat') || p.includes('digest')) {
    return `Hi astronaut! The cephalad fluid shift congests your olfactory passages, dulling your sense of smell and making station meals taste bland.\n\nAlso, without gravity, gas bubbles do not naturally separate in your stomach, causing bloating.\n\nHere is what you should do right now:\n• Add spicy condiments, horseradish, or hot sauce to stimulate your trigeminal taste nerves.\n• Choose high-fiber rehydratables and drink plenty of warm fluids.\n• Gently massage your abdomen in clockwise circles while floating to assist peristalsis.\n\n✨ Every success comes from a dream.`;
  }

  // 13. Cold, shivering, freezing, ventilation drafts
  if (p.includes('cold') || p.includes('shiver') || p.includes('freeze') || p.includes('draft') || p.includes('chill') || p.includes('temp')) {
    return `Hi astronaut! High ventilation airflow in the module creates significant convective cooling, which can make you feel cold when not exercising.\n\nHere is what you should do right now:\n• Don an extra thermal fleece flight suit layer and warm socks.\n• Adjust your local airflow vent louvers so the high-speed breeze does not blow directly onto your skin.\n• Sip a warm packet of tea or bouillon, and do 2 minutes of brisk stationary calf flexes.\n\n✨ Every success comes from a dream.`;
  }

  // 14. Skin rash, dry skin, peeling, shedding calluses, itching
  if (p.includes('skin') || p.includes('rash') || p.includes('itch') || p.includes('peel') || p.includes('shed') || p.includes('dry')) {
    return `Hi astronaut! Spacecraft cabin air is kept at 40-50% humidity, and microgravity causes changes in skin microbiome and shedding of foot calluses ("space shedding").\n\nHere is what you should do right now:\n• Apply hypoallergenic moisturizing lotion from the hygiene pack to dry areas.\n• Change into a fresh clean inner layer flight garment.\n• Avoid vigorous scratching to prevent micro-abrasions in the spacecraft microbial environment.\n\n✨ Every success comes from a dream.`;
  }

  // 15. Hydration, urine, thirst, water balance, kidney stone risk
  if (p.includes('urine') || p.includes('pee') || p.includes('thirst') || p.includes('dehydrat') || p.includes('water') || p.includes('drink')) {
    return `Hi astronaut! Thirst cues are notoriously suppressed in microgravity because fluid shifting to the chest tricks heart volume receptors into thinking you are fully hydrated.\n\nDark urine indicates concentrated solutes and dehydration, significantly increasing the risk of spaceflight kidney stones.\n\nHere is what you should do right now:\n• Drink 350ml to 500ml of ambient electrolyte-balanced water immediately.\n• Aim for a steady daily intake of at least 2.5 to 3.0 liters of fluids throughout your shift.\n• Monitor your urine color by the Waste Management Compartment until it returns to pale straw yellow.\n\n✨ Every success comes from a dream.`;
  }

  // 16. Dynamic semantic synthesizer for any other astronaut question
  const topicWords = p.replace(/[^a-zA-Z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !['what','when','where','which','could','would','should','have','been','there','about','their'].includes(w));
  const focusTopic = topicWords.slice(0, 3).join(' ') || 'your question';

  return `Hi astronaut! Thank you for sharing your inquiry regarding ${focusTopic}.\n\nIn microgravity, your physical body and emotional state continuously adjust to zero-G forces, fluid shifts, and demanding orbital operations.\n\nHere is what you should do right now:\n• Take a 15-minute rest period in your quarters to let your nervous system recalibrate.\n• Drink 250ml of water with electrolytes to sustain optimal cellular hydration and mental clarity.\n• Log any changes on your daily check-in and notify flight medical if symptoms persist.\n\nYour health, safety, and mission wellbeing come first!\n\n✨ Every success comes from a dream.`;
}

// Endpoint for AI Space Health Analysis
app.post('/api/analyze-health', async (req, res) => {
  try {
    const {
      heartRate = 72,
      sleep = 7,
      exercise = 60,
      stress = 'Low',
    } = req.body;

    const hr = Number(heartRate) || 72;
    const sl = Number(sleep) || 7;
    const ex = Number(exercise) || 60;
    const st = String(stress) || 'Low';

    const aiClient = getGenAIClient();
    if (aiClient) {
      try {
        const prompt = `You are a caring, friendly, direct AI Health Detector for astronaut health.
The user has submitted their 4 vitals:
- Heartbeat: ${hr} BPM
- Sleep: ${sl} hours
- Exercise: ${ex} minutes
- Stress Level: ${st}

DIAGNOSE AND GIVE DIRECT ACTIONABLE SUGGESTIONS BASED ON THE SITUATION:
1. GREETING & STATUS:
- If all vitals are good (heart rate 60-80, sleep >= 7h, exercise >= 40m, stress Low/Med):
  Say: "Hi, your health level is great! Your heartbeat is normal at ${hr} BPM..."
- If vitals are otherwise healthy (heart rate 60-80, sleep >= 7h, stress Low/Med) BUT exercise is too less (< 40 mins):
  CRITICAL RULE: Say: "Hi, your health level is great! Your heartbeat is normal at ${hr} BPM and your sleep is good, but your exercise is too less (${ex} mins). Please do some exercise although you are healthy, so your body and muscles can stay strong and active!"
- If they have other problems (heart rate > 80, sleep < 7h, or stress High/Severe):
  Say: "Hi, you have got some problems with your health condition."
- If very serious / dangerous (heart rate > 105 BPM, or very little sleep <= 4.5h with high heart rate / severe stress):
  Say: "Hi, you are in danger!"

2. SUGGESTIONS BASED ON SPECIFIC PROBLEMS:
- If heartbeat is too fast (> 80 BPM): say "Your heartbeat is too fast (${hr} BPM) — please take some rest and do deep breathing."
- If too stressed (High or Severe): say "You are feeling too stressed — please play some games, listen to music, and relax to ease your mind."
- If too less sleeping time (< 7 hours): say "Your sleeping time is too less (${sl} hours) — please go and take more sleep so your brain and body can recharge."
- If too less exercise (< 40 minutes): say "Please do some exercise although you are healthy (or to stay fit)."

3. FORMAT RULES:
- Use simple, friendly, everyday conversational language.
- Strictly under 16 lines.
- Do NOT answer questions.
- End with: "✨ Every success comes from a dream."`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response && response.text) {
          const lines = response.text.trim().split('\n').slice(0, 16).join('\n');
          return res.json({ analysis: lines });
        }
      } catch (geminiError: any) {
        console.warn('Gemini call error, using diagnostic fallback:', geminiError?.message);
      }
    }

    const normalAnalysis = generateNormalLanguageDiagnosis(hr, sl, ex, st);
    return res.json({ analysis: normalAnalysis });
  } catch (error: any) {
    console.error('Error analyzing health check-in:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to complete analysis.',
    });
  }
});

// Endpoint for AI Space Problem Solver & Health Companion Chat
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { problem } = req.body;

    if (!problem || typeof problem !== 'string' || !problem.trim()) {
      return res.status(400).json({ error: 'Please enter a health problem or question.' });
    }

    const cleanProblem = problem.trim();

    // 1. Try real live Gemini API if key is available
    const aiClient = getGenAIClient();
    if (aiClient) {
      try {
        const prompt = `You are D' Physco-Bit AI, a warm, caring, practical space health and mission companion for astronauts.
An astronaut in orbit has shared the following health problem, feeling, or fitness question:
"${cleanProblem}"

YOUR INSTRUCTIONS:
1. Speak in simple, friendly, warm, everyday conversational language.
2. TAILORED REASONING BASED ON THEIR INQUIRY:
   - If they express FEELINGS (homesickness, loneliness, anxiety, fear before an EVA, burnout, irritability, cabin fever, sadness, or the Overview Effect): Validate their emotion with deep aerospace psychological empathy. Reassure them that emotional stress is normal in isolation and confinement.
   - If they ask about EXERCISE & FITNESS (daily exercise requirements, skipping workouts, bird legs, muscle atrophy, bone density loss, ARED, T2 treadmill, CEVIS, harness discomfort): Explain the spaceflight countermeasure science (2.0-2.5h daily protocol, neuromuscular maintenance, active recovery options, fluid shift dynamics).
   - If they describe PHYSICAL SYMPTOMS: Explain simply why it occurs in microgravity (fluid shifts to head, otolith sensory mismatch, cabin air dynamics, barodontalgia).
3. Provide 2-3 simple, practical, actionable steps they can take right now inside the spacecraft.
4. Keep the entire response simple, concise, and strictly under 15 lines.
5. Conclude with: "✨ Every success comes from a dream."`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response && response.text) {
          const lines = response.text.trim().split('\n').slice(0, 15).join('\n');
          return res.json({ reply: lines });
        }
      } catch (geminiError: any) {
        console.warn('Gemini chat API error, falling back to specialized space health engine:', geminiError?.message);
      }
    }

    // 2. Intelligent, context-aware space medical engine tailored specifically to the user's question
    const tailoredReply = generateTailoredSpaceHealthAnswer(cleanProblem);
    return res.json({ reply: tailoredReply });
  } catch (error: any) {
    console.error('Error in AI chat endpoint:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to complete AI response.',
    });
  }
});

// Comprehensive Space Medical Specialists Fallback Engine (No personal names)
const SPECIALIST_PERSONAS: Record<string, {
  title: string;
  bodyPart: string;
  focus: string;
  promptInstructions: string;
  fallbackHandler: (question: string) => string;
}> = {
  eye: {
    title: 'Eyes & Vision Specialist',
    bodyPart: 'Eyes & Vision',
    focus: 'Spaceflight-Associated Neuro-ocular Syndrome (SANS), optic disc edema, hyperopic shifts, cotton wool spots, and retinal cosmic flashes.',
    promptInstructions: `You are the Eyes & Vision Specialist in the Orbital Medical Bay specializing in SANS (Spaceflight-Associated Neuro-ocular Syndrome).
Speak with authoritative clinical precision and warm, empathetic bedside manner.
CRITICAL: Do NOT invent or use any personal doctor names (no "Dr. Someone"). Address the astronaut directly as the Orbital Eyes & Vision Specialist.
Explain how microgravity cephalad fluid shifts cause posterior globe flattening, optic nerve sheath distension, choroidal folds, and hyperopic vision blur.
Provide actionable countermeasures (e.g. onboard adjustable focus Super-Specs, lowering VDT display luminance, fundoscopy check, avoiding small-print strain, fluid redistribution posture).
Keep response structured, clear, and strictly under 15 lines. End with: "✨ Clear vision for every cosmic dream."`,
    fallbackHandler: (q: string) => {
      const qLower = q.toLowerCase();
      if (qLower.includes('blur') || qLower.includes('read') || qLower.includes('checklist') || qLower.includes('close') || qLower.includes('hyperop')) {
        return `Hello astronaut! You are experiencing hyperopic shift from SANS (Spaceflight-Associated Neuro-ocular Syndrome).\n\nWithout gravity pulling venous volume down, fluid builds up behind your eyes, flattening the posterior globe and shortening the focal length.\n\nRecommended Countermeasures:\n1. Switch to your onboard adjustable focus glasses ("Super-Specs") and dial in +0.50 to +1.25 diopters for near-work.\n2. Increase the font size on your flight laptops and checklists to reduce ciliary muscle fatigue.\n3. Log your vision delta in your daily medical log and schedule a high-res OCT or fundus examination.\n\n✨ Clear vision for every cosmic dream.`;
      }
      if (qLower.includes('flash') || qLower.includes('light') || qLower.includes('streak') || qLower.includes('cosmic') || qLower.includes('phosphene')) {
        return `Hello astronaut! Those light streaks and sparkles you see with closed eyes are cosmic ray phosphenes.\n\nHigh-energy galactic cosmic rays (HZE particles) penetrate the spacecraft hull and directly interact with retinal photoreceptors or the visual cortex.\n\nRecommended Countermeasures:\n1. Wear your padded sleep blindfold during rest to reduce secondary visual cortex stimulation.\n2. Note the frequency of flashes (typically 1 to 3 per hour during solar quiet periods).\n3. Check your personal dosimeter; if flashes spike dramatically, verify radiation storm shelter protocols with Capcom.\n\n✨ Clear vision for every cosmic dream.`;
      }
      if (qLower.includes('dry') || qLower.includes('irritat') || qLower.includes('scratch') || qLower.includes('dust') || qLower.includes('red')) {
        return `Hello astronaut! Eye irritation and dryness are very frequent in orbital modules due to constant convective airflow and low relative humidity (35-45%).\n\nAlso, without convection, tiny floating dust particles can irritate the corneal surface.\n\nRecommended Countermeasures:\n1. Instill 2 drops of preservative-free lubricating artificial tears from Medical Pack Alpha.\n2. Adjust your work station air diffuser louvers so high-velocity cabin air is not blowing directly into your face.\n3. Avoid rubbing your eyes, which can cause micro-abrasions in the presence of floating debris.\n\n✨ Clear vision for every cosmic dream.`;
      }
      return `Hello astronaut! Reviewing your eye & vision symptoms.\n\nIn microgravity, ocular hemodynamics shift significantly as intracranial and ophthalmic venous pressures rise, altering corneal curvature and optic nerve sheath diameter.\n\nRecommended Steps:\n1. Rest your eyes for 10 minutes with eyes closed in reduced ambient cabin light.\n2. Utilize your prescribed orbital vision correction lenses if performing critical station telemetry reviews.\n3. Report any acute visual field defects, flashes with dark spots, or persistent headache to ground medical.\n\n✨ Clear vision for every cosmic dream.`;
    },
  },
  neuro: {
    title: 'Head, Brain & Vestibular Specialist',
    bodyPart: 'Head, Brain & Inner Ear',
    focus: 'Space Motion Sickness (SMS), otolith-visual conflict, vestibular readaptation, cephalad fluid shift headaches, and cognitive overload.',
    promptInstructions: `You are the Head, Brain & Vestibular Specialist in the Orbital Medical Bay.
Speak as an expert space flight neuro-vestibular specialist.
CRITICAL: Do NOT use any personal doctor names (no "Dr. Someone"). Address the astronaut directly.
Explain otolith-semicircular canal sensory mismatch, fluid shift intracranial pressure, and cerebellar compensation.
Offer practical zero-G vestibular stabilization strategies, head movement pacing, Promethazine/Dimenhydrinate guidance if needed, and mental recovery steps.
Strictly under 15 lines. End with: "✨ A steady mind navigates the stars."`,
    fallbackHandler: (q: string) => {
      const qLower = q.toLowerCase();
      if (qLower.includes('dizzy') || qLower.includes('spin') || qLower.includes('nausea') || qLower.includes('sick') || qLower.includes('motion') || qLower.includes('vomit')) {
        return `Hello astronaut! You are experiencing Space Motion Sickness (SMS) caused by neuro-vestibular sensory conflict.\n\nYour inner ear otolith organs are signaling "freefall" while your eyes perceive stable surroundings, confusing your vestibular nucleus.\n\nRecommended Clinical Steps:\n1. Restrict rapid head pitch and yaw rotations; keep your visual focus locked on a stationary station bulkhead.\n2. Maintain an upright body alignment relative to the module interior to minimize visual-proprioceptive discord.\n3. Take a prescribed dose of Promethazine or chewable dimenhydrinate from the SAS medical pouch if nausea intensifies.\n\nOver 70% of astronauts adapt fully within 48 to 72 hours!\n\n✨ A steady mind navigates the stars.`;
      }
      if (qLower.includes('headache') || qLower.includes('pressure') || qLower.includes('throbb') || qLower.includes('congest') || qLower.includes('puffy')) {
        return `Hello astronaut! That cephalad headache and fullness stem from upward hydrostatic fluid redistribution (~1.5L shifting towards the cranium).\n\nThis elevates internal jugular venous pressure and transiently alters cerebral spinal fluid dynamics.\n\nRecommended Countermeasures:\n1. Perform gentle neck lateral stretches and shoulder rolls to encourage venous drainage through collateral pathways.\n2. Hydrate with electrolyte-balanced water to maintain stable serum osmolarity.\n3. Take 400mg Ibuprofen or 500mg Acetaminophen from the analgesics pack if tension impedes sleep.\n\n✨ A steady mind navigates the stars.`;
      }
      return `Hello astronaut! Reviewing your neurological and vestibular inquiry.\n\nWeightlessness challenges the brain's central motor mapping, balance reflexes, and cranial hemodynamics as it recalibrates to 0-G.\n\nRecommended Protocol:\n1. Pace your cognitive tasks; take a 10-minute sensory isolation pause in your bunk.\n2. Avoid sudden rotational maneuvers when navigating between station modules.\n3. Keep a steady sleep-wake schedule to protect your central circadian oscillator.\n\n✨ A steady mind navigates the stars.`;
    },
  },
  cardio: {
    title: 'Heart, Chest & Circulation Specialist',
    bodyPart: 'Heart, Chest & Circulation',
    focus: 'Microgravity cardiovascular deconditioning, orthostatic intolerance, fluid shifts, stroke volume changes, and telemetry arrhythmias.',
    promptInstructions: `You are the Heart, Chest & Circulation Specialist in the Orbital Medical Bay.
Provide reassuring, authoritative clinical insight into orbital cardiac physiology: central blood volume shifts, stroke volume alterations, baroreceptor resetting, and resting tachycardia.
CRITICAL: Do NOT use any personal doctor names (no "Dr. Someone"). Address the astronaut directly.
Provide immediate stabilization steps (hydration, CEVIS ergometer pacing, lower body negative pressure concepts, breathing techniques).
Strictly under 15 lines. End with: "✨ A strong heartbeat powers every mission."`,
    fallbackHandler: (q: string) => {
      const qLower = q.toLowerCase();
      if (qLower.includes('fast') || qLower.includes('palpitat') || qLower.includes('flutter') || qLower.includes('racing') || qLower.includes('beat')) {
        return `Hello astronaut! Heart palpitations or transient tachycardia in orbit are often triggered by fluid redistribution or sympathetic nervous surge.\n\nWhen blood shifts to the thoracic cavity, your cardiac stretch receptors initially trigger diuresis, reducing total plasma volume and demanding higher pulse rates.\n\nRecommended Immediate Actions:\n1. Float motionless in the neutral body posture with arms folded across your chest.\n2. Execute 4-7-8 parasympathetic breathing: 4s inhale, 7s hold, 8s slow exhalation through pursed lips.\n3. Drink 300ml of ambient electrolyte fluid to restore intravascular volume.\n4. Check your telemetry electrode pads to rule out signal artifact from sweat accumulation.\n\n✨ A strong heartbeat powers every mission.`;
      }
      if (qLower.includes('chest') || qLower.includes('tight') || qLower.includes('heav')) {
        return `Hello astronaut! Chest fullness or pressure is frequently associated with the 2-liter central blood pooling in early spaceflight.\n\nHowever, any acute, crushing, or radiating chest tightness demands immediate high-priority protocol.\n\nRecommended Actions:\n1. Immediately halt all aerobic or resistive workouts (ARED/CEVIS).\n2. Don your pulse oximeter and automated blood pressure cuff from the Medical Chest.\n3. If discomfort radiates to jaw or left arm, contact the Flight Surgeon on the private medical audio loop immediately.\n\n✨ A strong heartbeat powers every mission.`;
      }
      return `Hello astronaut! Evaluating your cardiovascular and circulatory status.\n\nIn microgravity, your heart does not have to work against gravity to pump blood from your lower extremities, causing gradual myocardium deconditioning if not actively loaded.\n\nRecommended Routine:\n1. Ensure you meet your daily 30-minute aerobic target on CEVIS at 75-80% of your VO2 max.\n2. Maintain consistent sodium and water intake to preserve circulatory plasma volume.\n3. Monitor resting heart rate each morning upon waking before unstrapping from your sleeping bag.\n\n✨ A strong heartbeat powers every mission.`;
    },
  },
  ortho: {
    title: 'Spine, Bones & Lower Back Specialist',
    bodyPart: 'Spine, Bones & Lower Back',
    focus: 'Spinal elongation back pain, intervertebral disc hydration, bone mineral density loss (osteopenia), posture stiffness, and EVA knuckle strain.',
    promptInstructions: `You are the Spine, Bones & Lower Back Specialist in the Orbital Medical Bay.
Explain the mechanics of zero-G spinal elongation (expansion of intervertebral discs causing 2-3 inches height gain and deep lumbar tension) and trabecular bone loss.
CRITICAL: Do NOT use any personal doctor names (no "Dr. Someone"). Address the astronaut directly.
Give clear physical countermeasure instructions (fetal tuck maneuver, ARED loading protocols, lumbar heat packs).
Strictly under 15 lines. End with: "✨ Standing tall among the stars."`,
    fallbackHandler: (q: string) => {
      const qLower = q.toLowerCase();
      if (qLower.includes('back') || qLower.includes('spine') || qLower.includes('tall') || qLower.includes('lumbar') || qLower.includes('elongat')) {
        return `Hello astronaut! You are suffering from classic zero-G spinal elongation.\n\nWithout gravitational compression, your intervertebral discs absorb fluid and expand, stretching your spinal column by up to 6 to 7 cm (2 to 3 inches) and putting intense tensile strain on your erector spinae muscles.\n\nImmediate Countermeasures:\n1. Perform the "Orbital Fetal Tuck": hug your knees tightly to your chest while floating freely for 5 to 8 minutes.\n2. Gently rock your pelvis into posterior tilt to decompress the facet joints.\n3. Apply a warm thermal gel pack to your lower lumbar region from the medical hygiene kit.\n\nThis discomfort usually peaks within the first two weeks as your paraspinal ligaments adapt!\n\n✨ Standing tall among the stars.`;
      }
      if (qLower.includes('bone') || qLower.includes('calcium') || qLower.includes('osteopor') || qLower.includes('density') || qLower.includes('fractur')) {
        return `Hello astronaut! Regarding bone mineral health:\n\nIn microgravity, non-weight-bearing bones (pelvis, femur, calcaneus) lose up to 1.0-1.5% mineral density per month as osteoclast resorption exceeds osteoblast formation.\n\nMandatory Countermeasures:\n1. Execute heavy axial loading on ARED: prioritize squats, deadlifts, and heel raises with maximum tolerated piston resistance.\n2. Take your daily Vitamin D3 (1000 IU) and calcium supplement ration.\n3. Stay well hydrated to help your kidneys clear excreted calcium and prevent nephrolithiasis (kidney stones).\n\n✨ Standing tall among the stars.`;
      }
      return `Hello astronaut! Reviewing your musculoskeletal and spinal inquiry.\n\nZero-G alters your natural biomechanical posture into the "Neutral Body Posture" (crouched posture), causing joint stiffness when forced straight.\n\nRecommended Protocol:\n1. Perform 10 minutes of gentle spinal flexion and hip mobility drills before your sleep period.\n2. Ensure your sleeping restraint applies gentle proprioceptive pressure along your back.\n3. Log any localized joint inflammation or tendon pain with the flight medical team.\n\n✨ Standing tall among the stars.`;
    },
  },
  musculo: {
    title: 'Muscles, Legs & Physical Stamina Specialist',
    bodyPart: 'Muscles, Legs & Physical Stamina',
    focus: 'Calf muscle atrophy ("bird legs"), slow-twitch muscle fiber transitions, EVA suit forearm fatigue, and ARED/T2 harness bruising.',
    promptInstructions: `You are the Muscles, Legs & Physical Stamina Specialist in the Orbital Medical Bay.
Explain muscle atrophy in microgravity, loss of postural soleus/gastrocnemius mass, and forearm fatigue during spacewalks.
CRITICAL: Do NOT use any personal doctor names (no "Dr. Someone"). Address the astronaut directly.
Prescribe targeted exercises, resistance techniques on ARED/T2, protein timing, and harness adjustment fixes.
Strictly under 15 lines. End with: "✨ Strength is the armor of the cosmos."`,
    fallbackHandler: (q: string) => {
      const qLower = q.toLowerCase();
      if (qLower.includes('bird leg') || qLower.includes('skinny') || qLower.includes('calf') || qLower.includes('calves') || qLower.includes('atrophy')) {
        return `Hello astronaut! "Bird legs" occur because your antigravity postural muscles (soleus and gastrocnemius) lose their continuous workload, combined with lower-limb fluid draining upward.\n\nWithout mechanical strain, muscle protein breakdown quickly outpaces synthesis.\n\nRecommended Countermeasures:\n1. High-load calf raises on ARED: 3 sets of 15 repetitions with explosive concentric contraction and slow eccentric return.\n2. T2 Treadmill sprints with bungee harness loaded to 65% of your Earth body weight for heel-strike stimulus.\n3. Consume 25g of whey or soy protein within 30 minutes of completing your workout.\n\nYour lower limb volume will rebound rapidly once back in 1-G gravity!\n\n✨ Strength is the armor of the cosmos.`;
      }
      if (qLower.includes('harness') || qLower.includes('shoulder') || qLower.includes('bruise') || qLower.includes('treadmill') || qLower.includes('strap')) {
        return `Hello astronaut! Bungee harness chafing and clavicle bruising are common during T2 treadmill runs because the bungees must pull you down with over 60 kg of force.\n\nRecommended Fixes:\n1. Wrap high-density foam padding or silicone gel sleeves around the shoulder straps.\n2. Verify the waist belt is snug above your iliac crest so hip bones carry the downward load rather than your collarbones.\n3. Inspect your skin post-run; apply zinc oxide or topical arnica if contusions develop.\n\n✨ Strength is the armor of the cosmos.`;
      }
      return `Hello astronaut! Analyzing your muscle and conditioning inquiry.\n\nSustaining muscular endurance in zero-G is non-negotiable for emergency egress readiness and spacewalk capability.\n\nRecommended Regimen:\n1. Never skip your scheduled 2.5 hours of daily countermeasure training without surgeon clearance.\n2. Perform wrist extensor and hand grip flexor therapy to prepare for pressurized suit glove resistance.\n3. Hydrate with electrolyte minerals and monitor your daily calorie intake to prevent catabolic state.\n\n✨ Strength is the armor of the cosmos.`;
    },
  },
  pulmo: {
    title: 'Lungs, Breathing & Cabin Air Specialist',
    bodyPart: 'Lungs & Respiratory Tract',
    focus: 'Station CO2 pocket hypercapnia (carbon dioxide pockets in low air circulation areas), cabin pressure barotrauma, regolith/dust inhalation, and airway dryness.',
    promptInstructions: `You are the Lungs, Breathing & Cabin Air Specialist in the Orbital Medical Bay.
Explain localized CO2 pocket accumulation (lack of natural convective air mixing in 0-G), hypercapnia symptoms (dull frontal headache, air hunger, flushing), and particulate irritation.
CRITICAL: Do NOT use any personal doctor names (no "Dr. Someone"). Address the astronaut directly.
Provide immediate airflow safety steps, checking ventilation anemometers, and lung protective procedures.
Strictly under 15 lines. End with: "✨ Breathe deep, reach far."`,
    fallbackHandler: (q: string) => {
      const qLower = q.toLowerCase();
      if (qLower.includes('co2') || qLower.includes('carbon') || qLower.includes('pocket') || qLower.includes('breath') || qLower.includes('suffocat') || qLower.includes('air hunger') || qLower.includes('stuffy')) {
        return `Hello astronaut! In microgravity, warm exhaled breath does not rise naturally because there is no thermal buoyancy or natural convection.\n\nIf you work or sleep in an area with low module airflow, you can re-breathe an invisible "bubble" of high-concentration CO2, causing hypercapnia (frontal headache, shortness of breath, flushed skin).\n\nImmediate Safety Actions:\n1. Move immediately into a high-ventilation node or main station corridor with active diffuser flow.\n2. Wave an inspection clipboard or hand fan across your workstation to disperse any stagnant air pocket.\n3. Check the cabin atmosphere display: ensure module ppCO2 is below 2.5 mmHg.\n4. Confirm your cabin auxiliary ventilation duct is unblocked and humming.\n\n✨ Breathe deep, reach far.`;
      }
      if (qLower.includes('cough') || qLower.includes('throat') || qLower.includes('dry') || qLower.includes('dust') || qLower.includes('irritat')) {
        return `Hello astronaut! Airway dryness and ticklish throat irritation are very common due to cabin HEPA filtration and dry recycled air (relative humidity ~40%).\n\nAdditionally, floating skin flakes, hair fragments, and particulate dust stay suspended without gravity settling.\n\nRecommended Actions:\n1. Drink warm tea or rehydrated bouillon to soothe irritated mucous membranes.\n2. Check the intake pre-filter screens in your module and vacuum away any accumulated lint.\n3. If coughing persists or wheezing occurs, use a saline inhaler from Medical Pack Bravo.\n\n✨ Breathe deep, reach far.`;
      }
      return `Hello astronaut! Evaluating your respiratory status.\n\nOrbital life support systems maintain cabin pressure at ~14.7 psi (or 10.2 psi during EVA pre-breathe), requiring careful atmospheric balance of O2, N2, and CO2.\n\nRecommended Protocol:\n1. Practice diaphragmatic deep breathing for 3 minutes to expand lower lung bases.\n2. Ensure your sleep cabin vent louvers are directed toward your head for constant fresh cross-breeze.\n3. Report any chest tightness, persistent dry cough, or atmospheric anomaly to ECLSS flight control.\n\n✨ Breathe deep, reach far.`;
    },
  },
  derma: {
    title: 'Skin, Surface & Radiation Specialist',
    bodyPart: 'Skin, Surface & Radiation',
    focus: 'Cosmic radiation erythema, microgravity skin peeling & shedding ("space shedding"), glove moisture dermatitis, EVA friction burns, and low humidity dryness.',
    promptInstructions: `You are the Skin, Surface & Radiation Specialist in the Orbital Medical Bay.
Explain zero-G skin biome changes: delayed epidermal barrier repair, stratum corneum thinning, feet shedding calluses ("space shedding"), and ionizing radiation protection.
CRITICAL: Do NOT use any personal doctor names (no "Dr. Someone"). Address the astronaut directly.
Provide practical dermatological solutions (hypoallergenic creams, glove liners, radiation shelter protocols).
Strictly under 15 lines. End with: "✨ Healthy skin under cosmic skies."`,
    fallbackHandler: (q: string) => {
      const qLower = q.toLowerCase();
      if (qLower.includes('shed') || qLower.includes('peel') || qLower.includes('foot') || qLower.includes('feet') || qLower.includes('callus') || qLower.includes('sole')) {
        return `Hello astronaut! You are experiencing "space shedding" on the soles of your feet.\n\nOn Earth, walking creates thick calluses on your heels and balls of your feet. In weightlessness, without friction or walking pressure, your body sheds those thick layers of skin over weeks, exposing soft new pink skin underneath.\n\nRecommended Care:\n1. When removing your socks, do so very carefully inside the Waste Management Compartment or near an air intake to prevent loose skin flakes from floating into the cabin.\n2. Apply a generous layer of fragrance-free emollient moisturizer from your personal hygiene pouch.\n3. Wear fresh cushioned crew socks to protect the sensitive new skin when tethering your feet to foot restraints.\n\n✨ Healthy skin under cosmic skies.`;
      }
      if (qLower.includes('rash') || qLower.includes('itch') || qLower.includes('dry') || qLower.includes('red') || qLower.includes('bump')) {
        return `Hello astronaut! Spacecraft dermatitis and pruritus (itching) stem from a combination of low cabin humidity (35-45%), shifts in the skin microbiome, and no-rinse hygiene wipes.\n\nRecommended Steps:\n1. Cleanse affected skin gently with warm water dampened towels; avoid harsh antibacterial cleansers.\n2. Apply 1% Hydrocortisone cream from the medical cabinet to acute itchy or inflamed patches.\n3. Change into a fresh 100% breathable cotton base layer flight garment.\n4. Avoid vigorous scratching to prevent opportunistic bacterial folliculitis in microgravity.\n\n✨ Healthy skin under cosmic skies.`;
      }
      return `Hello astronaut! Reviewing your skin and surface tissue health.\n\nIn orbital flight, cosmic radiation and closed-loop environmental air require attentive skin surveillance.\n\nRecommended Protocol:\n1. Apply moisturizing barrier cream twice daily to hands, neck, and face.\n2. Inspect skin folds and suit contact areas after exercise for signs of friction chafing.\n3. Verify your personal passive radiation dosimeter badge is secured to your flight suit.\n\n✨ Healthy skin under cosmic skies.`;
    },
  },
  gastro: {
    title: 'Stomach, Gut & Nutrition Specialist',
    bodyPart: 'Stomach, Gut & Nutrition',
    focus: 'Microgravity gastroparesis, gas bubble flotation bloating, appetite suppression, fluid electrolyte shifts, space microbiome alterations, and hydration.',
    promptInstructions: `You are the Stomach, Gut & Nutrition Specialist in the Orbital Medical Bay.
Explain microgravity digestive mechanics: absence of gravity means stomach gas bubbles and liquid food do not separate naturally (causing belching, bloating, and satiety), plus blunted olfactory taste sensation from fluid shift.
CRITICAL: Do NOT use any personal doctor names (no "Dr. Someone"). Address the astronaut directly.
Provide actionable dietary fixes (spicy seasoning, hydration timing, clockwise abdominal massage, probiotic rations).
Strictly under 15 lines. End with: "✨ Fueling the journey across the stars."`,
    fallbackHandler: (q: string) => {
      const qLower = q.toLowerCase();
      if (qLower.includes('bloat') || qLower.includes('gas') || qLower.includes('stomach') || qLower.includes('belch') || qLower.includes('cramp') || qLower.includes('burp')) {
        return `Hello astronaut! In microgravity, the absence of buoyancy causes gases and liquid food in your stomach to remain mixed as a frothy foam rather than separating with gas on top.\n\nThis stimulates gastric stretch receptors, leading to premature fullness, bloating, and uncomfortable "wet burps".\n\nRecommended Countermeasures:\n1. Eat meals slowly and avoid using straws that swallow excess cabin air.\n2. Perform gentle clockwise abdominal massages while floating with knees bent to assist intestinal peristalsis.\n3. Take Simethicone chewable tablets (80mg) from the gastrointestinal kit to coalesce micro-bubbles.\n4. Avoid carbonated beverages or rapidly rehydrated carbonated rations.\n\n✨ Fueling the journey across the stars.`;
      }
      if (qLower.includes('taste') || qLower.includes('bland') || qLower.includes('appetite') || qLower.includes('eat') || qLower.includes('flavor')) {
        return `Hello astronaut! Dulled taste and appetite loss are universal in orbit because cephalad fluid congestion plugs nasal passages, severely degrading your olfactory sense (which accounts for ~80% of perceived flavor).\n\nRecommended Solutions:\n1. Add hot sauce, sriracha, wasabi, or horseradish from the galley pantry; spicy capsaicin stimulates trigeminal nerves directly.\n2. Eat aromatic foods warm: reheating meals boosts volatile odorant molecules.\n3. Ensure you consume your full caloric target (2,800 to 3,200 kcal/day) even if appetite is low to prevent muscle catabolism.\n\n✨ Fueling the journey across the stars.`;
      }
      return `Hello astronaut! Analyzing your gastrointestinal & nutritional inquiry.\n\nMicrogravity shifts gut motility and alters your microbiome diversity over prolonged space missions.\n\nRecommended Routine:\n1. Hydrate with at least 2.5 to 3.0 liters of electrolyte-balanced water daily.\n2. Consume fiber-rich rehydratables and take your daily prescribed probiotic pack.\n3. Report persistent reflux, severe nausea, or constipation to the medical console.\n\n✨ Fueling the journey across the stars.`;
    },
  },
};

// Endpoint for AI Space Medical Specialists Bay
app.post('/api/ai-specialist/chat', async (req, res) => {
  try {
    const { specialistId = 'eye', question, bodyPart } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'Please enter a symptom or question for the specialist.' });
    }

    const cleanQuestion = question.trim();
    const specialist = SPECIALIST_PERSONAS[specialistId] || SPECIALIST_PERSONAS.eye;

    // 1. Try real live Gemini API if key is available
    const aiClient = getGenAIClient();
    if (aiClient) {
      try {
        const prompt = `${specialist.promptInstructions}

ASTRONAUT INQUIRY DETAILS:
- Medical Domain: ${specialist.title}
- Focused Body Part / System: ${bodyPart || specialist.bodyPart}
- Core Clinical Focus: ${specialist.focus}
- Astronaut Question / Symptom: "${cleanQuestion}"

REQUIREMENTS:
1. Greet the astronaut warmly and directly. DO NOT use any doctor names (do not say "Dr. Smith" or "Dr. Anyone"). Introduce yourself purely as the medical specialist.
2. Explain the spaceflight microgravity physiology behind this symptom in clear, accessible, reassuring language.
3. Provide 2-3 specific, actionable countermeasures or checks they can perform immediately in the spacecraft.
4. Keep the entire response structured, concise, and strictly under 15 lines.
5. End with the specialist domain's motto.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response && response.text) {
          const lines = response.text.trim().split('\n').slice(0, 16).join('\n');
          return res.json({
            reply: lines,
            specialist: specialist.title,
            bodyPart: specialist.bodyPart,
          });
        }
      } catch (geminiError: any) {
        console.warn(`Gemini specialist (${specialistId}) API error, using clinical fallback engine:`, geminiError?.message);
      }
    }

    // 2. Specialized Aerospace Clinical Fallback Engine
    const fallbackAnswer = specialist.fallbackHandler(cleanQuestion);
    return res.json({
      reply: fallbackAnswer,
      specialist: specialist.title,
      bodyPart: specialist.bodyPart,
    });
  } catch (error: any) {
    console.error('Error in AI specialist endpoint:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to complete specialist consultation.',
    });
  }
});

// ==========================================
// ASTRONAUT MISSIONS & HEALTH DEEDS EVALUATOR
// ==========================================
function evaluateHealthDeedFallback(deed: string): {
  marks: number;
  category: string;
  badge: string;
  encouragement: string;
  tip: string;
} {
  const d = deed.toLowerCase();

  // 1. Detect duration in minutes
  let durationMins = 0;
  const hourMatch = d.match(/(\d+(?:\.\d+)?)\s*(?:hour|hours|hr|hrs|h\b)/);
  if (hourMatch) {
    durationMins = Math.round(parseFloat(hourMatch[1]) * 60);
  } else {
    const minMatch = d.match(/(\d+(?:\.\d+)?)\s*(?:min|mins|minute|minutes|m\b)/);
    if (minMatch) {
      durationMins = Math.round(parseFloat(minMatch[1]));
    }
  }

  // 2. Classify by activity
  const isExercise = d.includes('exercise') || d.includes('workout') || d.includes('treadmill') ||
    d.includes('ared') || d.includes('cycle') || d.includes('cevis') || d.includes('run') ||
    d.includes('running') || d.includes('cardio') || d.includes('squat') || d.includes('lift') ||
    d.includes('weight') || d.includes('pushup') || d.includes('training') || d.includes('gym');

  const isHydration = d.includes('water') || d.includes('hydrat') || d.includes('drink') ||
    d.includes('drank') || d.includes('fluid') || d.includes('electrolyte');

  const isSleep = d.includes('sleep') || d.includes('slept') || d.includes('nap') ||
    d.includes('napped') || d.includes('rest') || d.includes('circadian');

  const isSpine = d.includes('stretch') || d.includes('spine') || d.includes('spinal') ||
    d.includes('decompress') || d.includes('yoga') || d.includes('back') || d.includes('posture');

  const isNutrition = d.includes('food') || d.includes('meal') || d.includes('eat') ||
    d.includes('ate') || d.includes('protein') || d.includes('vitamin') || d.includes('fruit') ||
    d.includes('vegetable') || d.includes('nutrient');

  const isMind = d.includes('meditat') || d.includes('mindful') || d.includes('cupola') ||
    d.includes('breathe') || d.includes('breathing') || d.includes('relax') || d.includes('music') ||
    d.includes('calm') || d.includes('mental');

  const isCrew = d.includes('help') || d.includes('helped') || d.includes('crew') ||
    d.includes('crewmate') || d.includes('friend') || d.includes('clean') || d.includes('cleaned') ||
    d.includes('inspect') || d.includes('assist');

  if (isExercise) {
    const duration = durationMins > 0 ? durationMins : 30;
    const calculatedMarks = Math.min(100, Math.max(30, Math.round(duration * 1.1) + 20));
    return {
      marks: calculatedMarks,
      category: 'Exercise & Conditioning',
      badge: 'Orbital Dynamo',
      encouragement: `Outstanding dedication, Astronaut! Exercising for ${duration} minutes directly combats microgravity muscular atrophy, strengthens bone mineral density, and keeps your heart stroke volume strong. Keep up this championship momentum!`,
      tip: 'Remember to wipe down perspiration thoroughly and rehydrate with electrolyte-enriched water within 30 minutes.',
    };
  }

  if (isHydration) {
    const marks = 35;
    return {
      marks,
      category: 'Hydration & Fluid Balance',
      badge: 'Hydration Sentinel',
      encouragement: 'Phenomenal deed! Proper hydration counteracts blood plasma contraction and cephalad fluid loss in space. By keeping your fluid levels balanced, you keep your kidneys shielded against renal stones and maintain sharp mental focus!',
      tip: 'Sip gradually across your flight duty shifts to ensure optimal tissue absorption.',
    };
  }

  if (isSleep) {
    const duration = durationMins > 0 ? Math.round(durationMins / 60) : 8;
    const marks = Math.min(75, Math.max(40, duration * 7 + 10));
    return {
      marks,
      category: 'Circadian Sleep & Recovery',
      badge: 'Deep Space Restorer',
      encouragement: `Excellent health mission! Logging restorative rest in your sleep berth allows your central nervous system to reset, fortifies your immune defenses, and clears ocular pressure buildup from microgravity!`,
      tip: 'Keep your berth air ventilation fan steady and strap into your sleeping bag harness to avoid floating against bulkhead walls.',
    };
  }

  if (isSpine) {
    const marks = 40;
    return {
      marks,
      category: 'Spinal Decompression & Posture',
      badge: 'Spine Guardian',
      encouragement: 'Fantastic proactive care! In microgravity your intervertebral discs expand, lengthening your spine up to 5-7 cm. Targeted stretching and fetal tuck postures relieve spinal ligament tension and prevent lumbar pain!',
      tip: 'Perform the knee-to-chest fetal tuck for 10-15 minutes prior to sleep for maximum lumbar release.',
    };
  }

  if (isNutrition) {
    const marks = 35;
    return {
      marks,
      category: 'Orbital Nutrition & Fuel',
      badge: 'Nutrient Vanguard',
      encouragement: 'Great choice, Astronaut! Balanced nutrition packed with micronutrients, calcium, and lean protein protects muscle mass and counteracts oxidative stress from space radiation!',
      tip: 'Pair high-calcium rations with Vitamin D supplements to maximize bone matrix uptake.',
    };
  }

  if (isMind) {
    const marks = 35;
    return {
      marks,
      category: 'Mental Equilibrium & Serenity',
      badge: 'Cosmic Serenity',
      encouragement: 'Superb mindfulness! Taking time for psychological reset, looking at Earth from the Cupola, or practicing mindful breathing reduces cortisol and optimizes flight focus.',
      tip: 'Pair mindful breathing with calming cosmic music to enhance parasympathetic nervous recovery.',
    };
  }

  if (isCrew) {
    const marks = 45;
    return {
      marks,
      category: 'Crew Synergy & Habitat Care',
      badge: 'Exemplary Crewmate',
      encouragement: 'Inspiring teamwork! Supporting your crewmates and maintaining a clean, orderly station environment directly elevates habitat safety and collective orbital morale!',
      tip: 'Small acts of mutual support build unbreakable crew cohesion during long-duration flight.',
    };
  }

  // General positive deed
  const marks = durationMins > 0 ? Math.min(60, Math.max(25, durationMins + 15)) : 30;
  return {
    marks,
    category: 'Cosmic Health Deed',
    badge: 'Orbital Health Star',
    encouragement: `Bravo, Astronaut! Every good deed you do for your body and well-being strengthens your endurance and ensures mission success. You earned ${marks} Health Marks!`,
    tip: 'Consistency is key in spaceflight. Keep logging your daily healthy victories!',
  };
}

app.post('/api/missions/evaluate', async (req, res) => {
  try {
    const { deed } = req.body;
    if (!deed || typeof deed !== 'string' || !deed.trim()) {
      return res.status(400).json({ error: 'Please enter a healthy deed or activity.' });
    }

    const cleanDeed = deed.trim();

    // 1. Try real live Gemini API if available
    const aiClient = getGenAIClient();
    if (aiClient) {
      try {
        const prompt = `You are the Flight Surgeon & Mission Health Coach aboard an orbital space station.
An astronaut has just logged a health activity or good deed:
"${cleanDeed}"

Evaluate this deed and award Health Marks to encourage and motivate the astronaut.
RULES:
1. "marks": An integer between 20 and 100. For example:
   - 30 minutes exercise = 50 marks
   - 45-60 min heavy workout = 60 to 80 marks
   - Hydration / drinking water = 30 to 40 marks
   - 8 hours sleep = 55 to 65 marks
   - Spinal stretching / yoga = 35 to 45 marks
   - Helping crew or station care = 40 to 50 marks
   - Any other healthy deed = 25 to 50 marks
2. "category": Short 2-4 word category name (e.g., "Exercise & Conditioning", "Hydration", "Rest & Recovery", "Spine Health", "Crew Synergy").
3. "badge": Short heroic badge name (e.g., "Orbital Dynamo", "Hydration Pioneer", "Spine Guardian").
4. "encouragement": 2-3 sentences of inspiring, warm, enthusiastic encouragement written directly to the astronaut. Mention the specific aerospace physiology benefits of their deed in zero-G!
5. "tip": 1 short practical spaceflight health tip.

Return ONLY valid JSON matching this schema:
{
  "marks": number,
  "category": string,
  "badge": string,
  "encouragement": string,
  "tip": string
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response && response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (parsed && typeof parsed.marks === 'number') {
            return res.json({
              marks: Math.max(10, Math.min(100, Math.round(parsed.marks))),
              category: parsed.category || 'Cosmic Health Deed',
              badge: parsed.badge || 'Orbital Champion',
              encouragement: parsed.encouragement,
              tip: parsed.tip || 'Keep up your daily flight routine!',
            });
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini mission evaluate fallback triggered:', geminiErr?.message);
      }
    }

    // 2. High-precision Aerospace Fallback Engine
    const result = evaluateHealthDeedFallback(cleanDeed);
    return res.json(result);
  } catch (error: any) {
    console.error('Error in mission evaluate endpoint:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to evaluate mission deed.',
    });
  }
});

// ==========================================
// NASA-STD-3001 & HRP FLIGHT SURGEON ASSISTANT
// ==========================================
type ToolkitModule = 'hdetector' | 'specialists' | 'missions' | 'ai' | 'gaming' | 'music';

interface FlightSurgeonCountermeasure {
  action: string;
  toolkitLabel: string;
  toolkitModule: ToolkitModule;
}

interface FlightSurgeonAssessment {
  status: 'Nominal' | 'Advisory' | 'Critical';
  exceededBaselines: string[];
  physiologicalCause: string;
  summary: string;
  countermeasures: FlightSurgeonCountermeasure[];
}

function evaluateFlightSurgeonFallback(
  co2: number,
  sleep: number,
  heartRate: number,
  stress: string,
  notes: string
): FlightSurgeonAssessment {
  const exceededBaselines: string[] = [];
  const causes: string[] = [];
  const countermeasures: FlightSurgeonCountermeasure[] = [];

  const co2High = co2 > 3.0;
  const co2Critical = co2 > 4.5;
  const sleepLow = sleep < 6.5;
  const sleepCritical = sleep < 5.0;
  const hrElevated = heartRate > 85;
  const hrCritical = heartRate > 105;
  const stressElevated = stress === 'High' || stress === 'Severe';

  if (co2High) {
    exceededBaselines.push(`Cabin ppCO2 ${co2.toFixed(1)} mmHg (NASA-STD-3001 limit ≤ 3.0 mmHg)`);
    causes.push(
      'Localized CO2 pocket formation in microgravity due to absence of thermal convection causes cerebral vasodilation, hypercapnic respiratory drive, and cognitive slowing.'
    );
    countermeasures.push({
      action: 'Move to an active ventilation node and consult the Lungs & Cabin Air Specialist for CO2 dispersion protocol.',
      toolkitLabel: 'Open AI Doctors',
      toolkitModule: 'specialists',
    });
  }

  if (sleepLow) {
    exceededBaselines.push(`Sleep ${sleep.toFixed(1)} hrs (NASA HRP baseline ≥ 6.5 hrs)`);
    causes.push(
      'Circadian misalignment from 16 orbital sunrises/sunsets per 24h and module acoustics disrupts melatonin phase and impairs neurobehavioral readiness.'
    );
    countermeasures.push({
      action: 'Initiate acoustic wind-down with cosmic soundscapes before your next sleep shift and log an 8h berth recovery mission.',
      toolkitLabel: 'Open Music',
      toolkitModule: 'music',
    });
  }

  if (hrElevated || stressElevated) {
    if (hrElevated) {
      exceededBaselines.push(`Heart Rate ${heartRate} BPM (resting baseline 60–85 BPM)`);
    }
    if (stressElevated) {
      exceededBaselines.push(`Cognitive Stress Load: ${stress}`);
    }
    causes.push(
      'Microgravity cephalad fluid shifts and plasma volume contraction reduce stroke volume, triggering compensatory sympathetic elevation in heart rate and stress reactivity.'
    );
    countermeasures.push({
      action: 'Perform 4-7-8 paced breathing, play a brief cognitive decompression session, or log a hydration/stretch mission to restore autonomic balance.',
      toolkitLabel: stressElevated ? 'Open Gaming' : 'Open Mission',
      toolkitModule: stressElevated ? 'gaming' : 'missions',
    });
  }

  if (notes.trim().length > 0) {
    countermeasures.push({
      action: `Discuss "${notes.trim().slice(0, 60)}" with the onboard AI Problem Solver or relevant body-system specialist.`,
      toolkitLabel: 'Open AI',
      toolkitModule: 'ai',
    });
  }

  if (exceededBaselines.length === 0) {
    return {
      status: 'Nominal',
      exceededBaselines: [],
      physiologicalCause:
        'All monitored parameters remain within NASA-STD-3001 environmental and Human Research Program (HRP) physiological envelopes, indicating stable cephalad fluid adaptation and preserved circadian alignment.',
      summary:
        'Flight Surgeon clearance: Nominal for scheduled orbital operations and daily countermeasure training.',
      countermeasures: [
        {
          action: 'Maintain your daily 2.0–2.5h ARED/T2/CEVIS countermeasure regimen and log completed workouts to earn Health Marks.',
          toolkitLabel: 'Open Mission',
          toolkitModule: 'missions',
        },
        {
          action: 'Run periodic biometric trend checks in H\'Detector to catch early autonomic drift.',
          toolkitLabel: 'Open H\'Detector',
          toolkitModule: 'hdetector',
        },
      ],
    };
  }

  const isCritical = co2Critical || sleepCritical || hrCritical || (exceededBaselines.length >= 3);
  const status: 'Advisory' | 'Critical' = isCritical ? 'Critical' : 'Advisory';

  return {
    status,
    exceededBaselines,
    physiologicalCause: causes.join(' '),
    summary: isCritical
      ? 'NASA-STD-3001 critical threshold exceeded. Stand down from strenuous EVA/ARED loads immediately and execute targeted countermeasures.'
      : 'NASA spaceflight baseline exceeded. Immediate operational adjustment and toolkit countermeasures recommended before high-workload tasks.',
    countermeasures: countermeasures.slice(0, 3),
  };
}

app.post('/api/flight-surgeon', async (req, res) => {
  try {
    const {
      co2 = 2.0,
      sleep = 7.0,
      heartRate = 72,
      stress = 'Low',
      notes = '',
    } = req.body ?? {};

    const parsedCo2 = Math.min(8.0, Math.max(0.2, Number(co2) || 2.0));
    const parsedSleep = Math.min(12.0, Math.max(1.0, Number(sleep) || 7.0));
    const parsedHr = Math.min(180, Math.max(35, Number(heartRate) || 72));
    const parsedStress = String(stress || 'Low');
    const parsedNotes = typeof notes === 'string' ? notes.trim().slice(0, 400) : '';

    const systemInstruction = `You are an onboard Flight Surgeon AI Assistant grounded in NASA-STD-3001 and NASA Human Research Program (HRP) guidelines. When an astronaut's vitals exceed NASA spaceflight baselines (such as CO2 above 3.0 mmHg, sleep under 6.5 hours, or elevated heart rate/stress), explain the physiological spaceflight cause (such as microgravity fluid shifts or circadian misalignment) and recommend actionable countermeasures from the app's mission toolkit.

App Mission Toolkit Modules (use exact toolkitModule IDs):
- "hdetector": H'Detector (biometric vital scanner)
- "specialists": AI Doctors (Eyes/SANS, Head/Vestibular, Cardio, Spine/Ortho, Muscles, Lungs/Cabin Air, Skin, Gut specialists)
- "missions": Mission (log exercise on ARED/T2/CEVIS, hydration, 8h sleep, spinal decompression stretches to earn Health Marks)
- "ai": AI (AI Problem Solver & psychological mood/fitness companion)
- "gaming": Gaming (Space Arcade for cognitive decompression and stress reduction)
- "music": Music (Cosmic soundscapes for sleep onset and relaxation)

Keep explanations scientifically grounded in NASA-STD-3001 & HRP, concise, and immediately actionable.`;

    const aiClient = getGenAIClient();
    if (aiClient) {
      try {
        const userContent = `Evaluate these onboard astronaut telemetry vitals against NASA-STD-3001 and NASA HRP baselines:
- Cabin ppCO2: ${parsedCo2.toFixed(1)} mmHg (NASA-STD-3001 limit: <= 3.0 mmHg)
- Sleep Duration: ${parsedSleep.toFixed(1)} hours (NASA HRP baseline: >= 6.5 hours)
- Resting Heart Rate: ${parsedHr} BPM (Baseline: 60-85 BPM)
- Psychological Stress Level: ${parsedStress}
${parsedNotes ? `- Astronaut Note / Symptom: "${parsedNotes}"` : ''}

Return a concise clinical assessment, physiological spaceflight cause, and 2-3 actionable countermeasures mapped to the app's mission toolkit.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: userContent,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                status: {
                  type: Type.STRING,
                  description: 'Must be exactly Nominal, Advisory, or Critical.',
                },
                exceededBaselines: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of vitals exceeding NASA baselines with numeric readings.',
                },
                physiologicalCause: {
                  type: Type.STRING,
                  description: 'Concise 2-3 sentence spaceflight physiological explanation (e.g., microgravity fluid shifts, CO2 pocket hypercapnia, circadian misalignment).',
                },
                summary: {
                  type: Type.STRING,
                  description: '1-2 sentence Flight Surgeon operational guidance.',
                },
                countermeasures: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      action: {
                        type: Type.STRING,
                        description: 'Specific actionable countermeasure step.',
                      },
                      toolkitLabel: {
                        type: Type.STRING,
                        description: 'Short button label like Open Mission, Open AI Doctors, Open Music, Open Gaming, Open AI, or Open H\'Detector.',
                      },
                      toolkitModule: {
                        type: Type.STRING,
                        description: 'Must be one of: hdetector, specialists, missions, ai, gaming, music.',
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (response && response.text) {
          const parsed = JSON.parse(response.text.trim());
          const validModules = new Set<ToolkitModule>([
            'hdetector',
            'specialists',
            'missions',
            'ai',
            'gaming',
            'music',
          ]);
          const normalizedStatus: 'Nominal' | 'Advisory' | 'Critical' =
            parsed.status === 'Critical'
              ? 'Critical'
              : parsed.status === 'Advisory'
                ? 'Advisory'
                : 'Nominal';

          const normalizedCountermeasures: FlightSurgeonCountermeasure[] = Array.isArray(parsed.countermeasures)
            ? parsed.countermeasures
                .slice(0, 3)
                .map((cm: any) => ({
                  action: String(cm?.action || 'Review countermeasure protocol in mission toolkit.'),
                  toolkitLabel: String(cm?.toolkitLabel || 'Open Toolkit'),
                  toolkitModule: validModules.has(cm?.toolkitModule) ? cm.toolkitModule : 'missions',
                }))
            : [];

          return res.json({
            status: normalizedStatus,
            exceededBaselines: Array.isArray(parsed.exceededBaselines)
              ? parsed.exceededBaselines.map(String)
              : [],
            physiologicalCause: String(parsed.physiologicalCause || ''),
            summary: String(parsed.summary || ''),
            countermeasures: normalizedCountermeasures,
            source: 'gemini-4-hydrogen',
          });
        }
      } catch (geminiErr: any) {
        console.warn('Gemini flight surgeon fallback triggered:', geminiErr?.message);
      }
    }

    const fallback = evaluateFlightSurgeonFallback(
      parsedCo2,
      parsedSleep,
      parsedHr,
      parsedStress,
      parsedNotes
    );
    return res.json({ ...fallback, source: 'nasa-protocol' });
  } catch (error: any) {
    console.error('Error in flight surgeon endpoint:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to complete Flight Surgeon assessment.',
    });
  }
});

// Setup Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`D' Physco-Bit server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
