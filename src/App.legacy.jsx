// // IMPORTANT: This file contains JSX syntax. Please ensure it has a .jsx or .tsx extension (e.g., App.jsx) to avoid build errors.
// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { Upload, FileText, Clipboard, Settings, BrainCircuit, User, Calendar, Stethoscope, XCircle, FileType, FileJson, Search, PlusCircle, MessageSquare, CheckCircle, ChevronLeft, ChevronRight, Lightbulb, ListPlus, AlertTriangle, FileScan, Mic, Plus, Trash2, Bold, Italic, List, ListOrdered, Pilcrow, BookOpen, Link as LinkIcon, Zap, Copy, UserCheck, LogOut, ChevronDown, History, Image as ImageIcon } from 'lucide-react';
// import { Toaster, toast } from 'react-hot-toast';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Placeholder from '@tiptap/extension-placeholder';
// import jsPDF from 'jspdf';
// import { htmlToText } from 'html-to-text';
// import { useDropzone } from 'react-dropzone';
// import { saveAs } from 'file-saver';
// import {  Document,  Packer,  Paragraph,  TextRun,  HeadingLevel,  Table,  TableRow,  TableCell,  WidthType,  BorderStyle,} from 'docx';
// import MeasurementsPanel from './components/panels/MeasurementsPanel.jsx';
// import TemplateManagerModal from './components/modals/TemplateManagerModal.jsx';
// import DOMPurify from 'dompurify';


// // --- DICOM Libraries via CDN (Required for the viewer) ---

// const loadScript = (src, onLoad) => {
//   const script = document.createElement('script');
//   script.src = src;
//   script.onload = onLoad;
//   document.head.appendChild(script);
// };

// // --- Firebase Imports (unchanged from original code) ---
// import { auth, db } from './firebase'; // Assuming firebase.js is set up
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { collection, addDoc, serverTimestamp, onSnapshot, query, deleteDoc, doc, getDoc, updateDoc, setDoc, orderBy, limit } from "firebase/firestore";
// import Auth from './auth.jsx'; // Your Auth component

// // NOTE: findings.js is assumed to be in the same directory.
// import { localFindings } from './findings.js';


// // --- Diamond Standard Templates ---
// const templates = {
//   "Ultrasound": {
//     "Abdomen": "<h3>IMPRESSION:</h3><p>1. No sonographic evidence of significant abnormality in the upper abdomen.</p><h3>FINDINGS:</h3><p><strong>LIVER:</strong> Normal in size (spans __ cm), contour, and echotexture. No focal mass, cyst, or intrahepatic biliary dilatation. Hepatic veins are patent. The main portal vein shows normal hepatopetal flow.</p><p><strong>GALLBLADDER:</strong> Normal size and wall thickness (__ mm). No gallstones, sludge, or polyps. No pericholecystic fluid. Sonographic Murphy's sign is negative.</p><p><strong>COMMON BILE DUCT:</strong> Not dilated, measuring __ mm at the porta hepatis.</p><p><strong>PANCREAS:</strong> The visualized portions of the head, body, and tail are unremarkable. No mass or ductal dilatation.</p><p><strong>SPLEEN:</strong> Normal in size (measures __ x __ cm) and echotexture. No focal lesions.</p><p><strong>KIDNEYS:</strong></p><p>Right Kidney: Measures __ x __ cm with normal cortical thickness. Normal morphology and echotexture. No hydronephrosis, calculus, or mass.</p><p>Left Kidney: Measures __ x __ cm with normal cortical thickness. Normal morphology and echotexture. No hydronephrosis, calculus, or mass.</p><p><strong>ADRENAL GLANDS:</strong> The adrenal areas are unremarkable.</p><p><strong>AORTA & IVC:</strong> Visualized portions are of normal caliber. No evidence of aneurysm or thrombosis.</p><p><strong>ABDOMINAL LYMPHATICS:</strong> No significant retroperitoneal or mesenteric lymphadenopathy.</p><p><strong>ASCITES:</strong> None.</p>",
//     "Pelvis": "<h3>IMPRESSION:</h3><p>1. Unremarkable ultrasound of the pelvis.</p><h3>FINDINGS:</h3><p><strong>URINARY BLADDER:</strong> Adequately distended, with a normal wall thickness. The lumen is anechoic. No calculi, masses, or diverticula identified. Ureteric jets are visualized bilaterally. Post-void residual is __ ml.</p><p><em>(For Male)</em></p><p><strong>PROSTATE:</strong> Normal in size, measuring __ x __ x __ cm (Volume: __ cc). The echotexture is homogeneous. No suspicious nodules. The seminal vesicles are unremarkable.</p><p><em>(For Female)</em></p><p><strong>UTERUS:</strong> [Anteverted/Retroverted] and normal in size, measuring __ x __ x __ cm. The myometrium shows homogeneous echotexture. No fibroids identified.</p><p><strong>ENDOMETRIUM:</strong> Homogeneous and measures __ mm in thickness, which is appropriate for the patient's menstrual/hormonal status.</p><p><strong>OVARIES:</strong></p><p>Right Ovary: Measures __ x __ x __ cm. Normal follicular activity. No cysts or masses.</p><p>Left Ovary: Measures __ x __ x __ cm. Normal follicular activity. No cysts or masses.</p><p><strong>ADNEXA:</strong> No adnexal masses or fluid collections.</p><p><strong>CUL-DE-SAC:</strong> No free fluid.</p>",
//     "Scrotum": "<h3>IMPRESSION:</h3><p>1. No sonographic evidence of testicular torsion, mass, or significant hydrocele.</p><h3>FINDINGS:</h3><p><strong>RIGHT TESTICLE:</strong> Measures __ x __ x __ cm. Homogeneous echotexture. No focal mass or calcification. Normal arterial and venous flow on color Doppler imaging.</p><p><strong>RIGHT EPIDIDYMIS:</strong> The head, body, and tail are normal in size and echotexture. No cysts or inflammation. Normal vascularity.</p><p><strong>LEFT TESTICLE:</strong> Measures __ x __ x __ cm. Homogeneous echotexture. No focal mass or calcification. Normal arterial and venous flow on color Doppler imaging.</p><p><strong>LEFT EPIDIDYMIS:</strong> The head, body, and tail are normal in size and echotexture. No cysts or inflammation. Normal vascularity.</p><p><strong>ADDITIONAL FINDINGS:</strong> No significant hydrocele. No varicocele. The scrotal skin thickness is normal. No inguinal hernia identified.</p>",
//     "Thyroid": "<h3>IMPRESSION:</h3><p>1. Normal ultrasound of the thyroid gland and neck.</p><h3>FINDINGS:</h3><p><strong>RIGHT LOBE:</strong> Measures __ x __ x __ cm. Homogeneous echotexture. No nodules, cysts, or calcifications. Normal vascularity on color Doppler.</p><p><strong>LEFT LOBE:</strong> Measures __ x __ x __ cm. Homogeneous echotexture. No nodules, cysts, or calcifications. Normal vascularity on color Doppler.</p><p><strong>ISTHMUS:</strong> Measures __ mm in thickness. Unremarkable.</p><p><strong>NECK:</strong> The visualized major cervical vessels are patent. The parotid and submandibular glands are unremarkable. No significant cervical lymphadenopathy or other masses identified.</p>",
//     "Renal / KUB": "<h3>IMPRESSION:</h3><p>1. No evidence of hydronephrosis, renal calculi, or focal renal masses.</p><h3>FINDINGS:</h3><p><strong>RIGHT KIDNEY:</strong> Measures __ x __ cm with a cortical thickness of __ cm. Normal size, shape, and echotexture. No hydronephrosis, calculus, or mass. Corticomedullary differentiation is well-maintained.</p><p><strong>LEFT KIDNEY:</strong> Measures __ x __ cm with a cortical thickness of __ cm. Normal size, shape, and echotexture. No hydronephrosis, calculus, or mass. Corticomedullary differentiation is well-maintained.</p><p><strong>URETERS:</strong> The visualized portions of the ureters are not dilated. Ureteric jets are visualized bilaterally from the trigone.</p><p><strong>URINARY BLADDER:</strong> Adequately distended. Normal wall thickness. The lumen is anechoic. No calculi or masses. Post-void residual volume is __ mL.</p>",
//     "Carotid Doppler": "<h3>IMPRESSION:</h3><p>1. No evidence of hemodynamically significant stenosis or plaque in the bilateral carotid systems.</p><h3>FINDINGS:</h3><p>B-mode, color Doppler, and spectral Doppler interrogation of the common, internal, and external carotid arteries were performed bilaterally.</p><p><strong>RIGHT CAROTID SYSTEM:</strong></p><p>CCA: PSV __ cm/s, EDV __ cm/s. No significant plaque. Intima-media thickness is normal.</p><p>ICA: PSV __ cm/s, EDV __ cm/s. No significant plaque. ICA/CCA ratio is normal.</p><p>ECA: Normal flow pattern. No significant plaque.</p><p>Vertebral Artery: Antegrade flow with normal waveform.</p><p><strong>LEFT CAROTID SYSTEM:</strong></p><p>CCA: PSV __ cm/s, EDV __ cm/s. No significant plaque. Intima-media thickness is normal.</p><p>ICA: PSV __ cm/s, EDV __ cm/s. No significant plaque. ICA/CCA ratio is normal.</p><p>ECA: Normal flow pattern. No significant plaque.</p><p>Vertebral Artery: Antegrade flow with normal waveform.</p>",
//     "Lower Limb Venous Doppler": "<h3>IMPRESSION:</h3><p>1. No sonographic evidence of deep vein thrombosis (DVT) in the [right/left] lower extremity from the common femoral to the calf veins.</p><h3>FINDINGS:</h3><p>A complete duplex ultrasound of the [right/left] lower extremity deep venous system was performed with compression and spectral Doppler analysis.</p><p><strong>COMMON FEMORAL VEIN:</strong> Patent, compressible, with normal phasic flow and augmentation.</p><p><strong>FEMORAL VEIN:</strong> Patent, compressible, with normal phasic flow and augmentation.</p><p><strong>POPLITEAL VEIN:</strong> Patent, compressible, with normal phasic flow and augmentation.</p><p><strong>POSTERIOR TIBIAL VEINS:</strong> Patent and compressible.</p><p><strong>PERONEAL VEINS:</strong> Patent and compressible.</p><p><strong>GREAT SAPHENOUS VEIN:</strong> The visualized portions are patent and compressible.</p>",
//     "Lower Limb Arterial Doppler": "<h3>IMPRESSION:</h3><p>1. Normal triphasic waveforms throughout the [right/left] lower extremity arterial system. No evidence of significant stenosis or occlusion.</p><h3>FINDINGS:</h3><p>Ankle-Brachial Index (ABI): [Right/Left] __</p><p><strong>COMMON FEMORAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>SUPERFICIAL FEMORAL ARTERY:</strong> Triphasic waveform throughout its visualized length. PSV __ cm/s.</p><p><strong>POPLITEAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>POSTERIOR TIBIAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>DORSALIS PEDIS ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p>",
//     "Upper Limb Venous Doppler": "<h3>IMPRESSION:</h3><p>1. No sonographic evidence of deep vein thrombosis (DVT) in the [right/left] upper extremity.</p><h3>FINDINGS:</h3><p>A complete duplex ultrasound of the [right/left] upper extremity deep venous system was performed.</p><p><strong>INTERNAL JUGULAR VEIN:</strong> Patent, fully compressible, with normal phasic flow.</p><p><strong>SUBCLAVIAN VEIN:</strong> Patent, fully compressible, with normal phasic flow.</p><p><strong>AXILLARY VEIN:</strong> Patent, fully compressible, with normal phasic flow.</p><p><strong>BRACHIAL VEIN:</strong> Patent and fully compressible.</p><p><strong>BASILIC & CEPHALIC VEINS:</strong> Patent and fully compressible.</p>",
//     "Upper Limb Arterial Doppler": "<h3>IMPRESSION:</h3><p>1. Normal triphasic waveforms throughout the [right/left] upper extremity arterial system. No evidence of significant stenosis or occlusion.</p><h3>FINDINGS:</h3><p><strong>SUBCLAVIAN ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>AXILLARY ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>BRACHIAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>RADIAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>ULNAR ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p>",
//     "Soft Tissue": "<h3>IMPRESSION:</h3><p>1. Unremarkable ultrasound of the soft tissues of the [location]. No discrete fluid collection, mass, or evidence of inflammation.</p><h3>FINDINGS:</h3><p>Ultrasound of the [location] demonstrates normal skin, subcutaneous fat, and underlying muscle planes. There is no evidence of a focal mass, cyst, or abscess. No abnormal vascularity is seen on color Doppler imaging. No significant surrounding edema.</p>",
//     "Obstetrics (1st Trimester)": "<h3>IMPRESSION:</h3><p>1. Single live intrauterine pregnancy at an estimated __ weeks __ days gestation.</p><h3>FINDINGS:</h3><p><strong>UTERUS:</strong> The uterus is gravid and appears normal in contour and echotexture.</p><p><strong>GESTATIONAL SAC:</strong> A single gestational sac is seen within the uterine cavity. Mean sac diameter is __ mm.</p><p><strong>YOLK SAC:</strong> Present and normal in appearance.</p><p><strong>EMBRYO:</strong> A single embryo is identified.</p><p><strong>CROWN-RUMP LENGTH (CRL):</strong> __ mm, corresponding to a gestational age of __ weeks __ days.</p><p><strong>FETAL HEART RATE:</strong> __ bpm.</p><p><strong>ADNEXA:</strong> The ovaries are normal in appearance. No adnexal masses or free fluid.</p><p><strong>CERVIX:</strong> Appears long and closed. Cervical length is __ cm.</p>",
//     "Obstetrics (2nd Trimester)": "<h3>IMPRESSION:</h3><p>1. Single live intrauterine pregnancy at an estimated __ weeks __ days gestation. No gross fetal anomalies identified.</p><h3>FINDINGS:</h3><p><strong>FETAL BIOMETRY:</strong></p><p>Biparietal Diameter (BPD): __ mm (__ w __ d)</p><p>Head Circumference (HC): __ mm (__ w __ d)</p><p>Abdominal Circumference (AC): __ mm (__ w __ d)</p><p>Femur Length (FL): __ mm (__ w __ d)</p><p><strong>ESTIMATED FETAL WEIGHT:</strong> __ grams (__th percentile).</p><p><strong>FETAL ANATOMY SURVEY:</strong> Head, face, neck, spine, heart (4-chamber view and outflow tracts), abdomen (stomach, kidneys, bladder), and limbs appear sonographically unremarkable.</p><p><strong>PLACENTA:</strong> [Anterior/Posterior], Grade __. No previa. Appears normal in thickness and texture.</p><p><strong>AMNIOTIC FLUID:</strong> Normal. Amniotic Fluid Index (AFI) is __ cm.</p><p><strong>FETAL HEART RATE:</strong> __ bpm.</p>",
//     "Obstetrics (3rd Trimester)": "<h3>IMPRESSION:</h3><p>1. Single live intrauterine pregnancy in cephalic presentation, at an estimated __ weeks __ days gestation. Fetal growth appears appropriate.</p><h3>FINDINGS:</h3><p><strong>FETAL BIOMETRY:</strong></p><p>Biparietal Diameter (BPD): __ mm (__ w __ d)</p><p>Head Circumference (HC): __ mm (__ w __ d)</p><p>Abdominal Circumference (AC): __ mm (__ w __ d)</p><p>Femur Length (FL): __ mm (__ w __ d)</p><p><strong>ESTIMATED FETAL WEIGHT:</strong> __ grams (__th percentile).</p><p><strong>PLACENTA:</strong> [Anterior/Posterior/Fundal], Grade __. No previa.</p><p><strong>AMNIOTIC FLUID:</strong> Normal. Amniotic Fluid Index (AFI) is __ cm.</p><p><strong>FETAL PRESENTATION:</strong> Cephalic.</p><p><strong>FETAL HEART RATE:</strong> __ bpm, with normal rhythm.</p>"
//   },
//   "X-Ray": {
//     "Chest": "<h3>IMPRESSION:</h3><p>1. No acute cardiopulmonary process.</p><h3>FINDINGS:</h3><p><strong>LUNGS AND PLEURA:</strong> The lungs are well-expanded and clear. No focal consolidation, pneumothorax, or pleural effusion. The pulmonary vasculature is normal.</p><p><strong>HEART AND MEDIASTINUM:</strong> The cardiomediastinal silhouette is within normal limits for size and contour. The hila are normal.</p><p><strong>AIRWAYS:</strong> The trachea is midline. The major airways are patent.</p><p><strong>BONES:</strong> The visualized osseous structures, including the ribs, clavicles, and thoracic spine, are unremarkable.</p><p><strong>SOFT TISSUES:</strong> The soft tissues of the chest wall are unremarkable.</p>",
//     "Abdomen (KUB)": "<h3>IMPRESSION:</h3><p>1. Unremarkable abdominal radiograph.</p><h3>FINDINGS:</h3><p><strong>BOWEL GAS PATTERN:</strong> Nonspecific bowel gas pattern. No evidence of bowel obstruction or ileus. No pneumoperitoneum.</p><p><strong>CALCIFICATIONS:</strong> No abnormal calcifications are seen in the expected locations of the kidneys, ureters, or bladder.</p><p><strong>OSSEOUS STRUCTURES:</strong> The visualized portions of the lower ribs, lumbar spine, and pelvis are unremarkable for acute fracture or dislocation.</p><p><strong>SOFT TISSUES:</strong> The psoas margins are symmetric. The flank stripes are maintained.</p>",
//     "Cervical Spine": "<h3>IMPRESSION:</h3><p>1. No acute fracture or malalignment.</p><p>2. Mild degenerative changes.</p><h3>FINDINGS:</h3><p><strong>VIEWS:</strong> AP, lateral, and odontoid views of the cervical spine.</p><p><strong>ALIGNMENT:</strong> Normal cervical lordosis. No evidence of anterolisthesis or retrolisthesis.</p><p><strong>VERTEBRAL BODIES:</strong> Vertebral body heights are maintained. No acute fracture is identified.</p><p><strong>DISC SPACES:</strong> Mild narrowing at [C5-C6]. Otherwise, disc spaces are preserved.</p><p><strong>POSTERIOR ELEMENTS:</strong> The facet joints and posterior elements are unremarkable.</p><p><strong>SOFT TISSUES:</strong> The prevertebral soft tissues are of normal thickness.</p>",
//     "Lumbar Spine": "<h3>IMPRESSION:</h3><p>1. No acute fracture or malalignment.</p><p>2. Mild degenerative changes.</p><h3>FINDINGS:</h3><p><strong>VIEWS:</strong> AP and lateral views of the lumbar spine.</p><p><strong>ALIGNMENT:</strong> Normal lumbar lordosis. No evidence of listhesis.</p><p><strong>VERTEBRAL BODIES:</strong> Vertebral body heights are maintained. No acute compression fracture.</p><p><strong>DISC SPACES:</strong> Mild narrowing at [L4-L5] and [L5-S1].</p><p><strong>POSTERIOR ELEMENTS:</strong> The pedicles, facet joints, and posterior elements are intact.</p><p><strong>SACROILIAC JOINTS:</strong> The visualized sacroiliac joints are unremarkable.</p>",
//     "Shoulder": "<h3>IMPRESSION:</h3><p>1. No acute fracture or dislocation.</p><h3>FINDINGS:</h3><p><strong>VIEWS:</strong> AP and axillary lateral views of the [right/left] shoulder.</p><p><strong>GLENOHUMERAL JOINT:</strong> The glenohumeral joint is congruous. No evidence of dislocation or subluxation. The joint space is preserved.</p><p><strong>ACROMIOCLAVICULAR JOINT:</strong> The AC joint is unremarkable.</p><p><strong>BONES:</strong> The humeral head, glenoid, acromion, and clavicle are intact. No acute fracture identified.</p><p><strong>SOFT TISSUES:</strong> No significant soft tissue swelling or abnormal calcifications.</p>",
//   },
//   "CT": {
//     "Head (Non-contrast)": "<h3>IMPRESSION:</h3><p>1. No evidence of acute intracranial hemorrhage, territorial infarct, or mass effect.</p><h3>FINDINGS:</h3><p><strong>BRAIN PARENCHYMA:</strong> No evidence of acute intracranial hemorrhage. Normal gray-white matter differentiation. No evidence of acute territorial ischemia or mass lesion.</p><p><strong>VENTRICLES AND CISTERNS:</strong> The ventricular system is normal in size and configuration. The basal cisterns are patent.</p><p><strong>EXTRACRANIAL STRUCTURES:</strong> The visualized paranasal sinuses and mastoid air cells are clear. The orbits are unremarkable.</p><p><strong>SKULL AND CALVARIUM:</strong> No acute fracture identified.</p>",
//     "Chest (with Contrast)": "<h3>IMPRESSION:</h3><p>1. No acute intrathoracic process. No evidence of pulmonary embolism.</p><h3>FINDINGS:</h3><p><strong>LUNGS AND PLEURA:</strong> The lungs are well-aerated. No focal consolidation, nodules, or masses. No pneumothorax or pleural effusion.</p><p><strong>MEDIASTINUM AND HILA:</strong> The cardiomediastinal silhouette is normal. No mediastinal or hilar lymphadenopathy. The trachea and main bronchi are patent.</p><p><strong>HEART AND GREAT VESSELS:</strong> The heart is not enlarged. The thoracic aorta and main pulmonary arteries are of normal caliber and show normal opacification. No central pulmonary embolism. No pericardial effusion.</p><p><strong>CHEST WALL AND BONES:</strong> The visualized osseous structures and soft tissues of the chest wall are unremarkable. No acute fractures.</p><p><strong>UPPER ABDOMEN:</strong> The visualized portions of the liver, spleen, and adrenal glands are unremarkable.</p>",
//     "Abdomen/Pelvis (with Contrast)": "<h3>IMPRESSION:</h3><p>1. No acute intra-abdominal or pelvic process.</p><h3>FINDINGS:</h3><p><strong>LIVER:</strong> Normal in size, contour, and enhances homogeneously. No focal hepatic lesions.</p><p><strong>GALLBLADDER AND BILIARY SYSTEM:</strong> The gallbladder is unremarkable. No intrahepatic or extrahepatic biliary dilatation.</p><p><strong>PANCREAS:</strong> Unremarkable in appearance. No inflammation or mass.</p><p><strong>SPLEEN:</strong> Normal in size and enhances homogeneously.</p><p><strong>ADRENAL GLANDS:</strong> Unremarkable.</p><p><strong>KIDNEYS AND URETERS:</strong> The kidneys are normal in size, position, and enhance symmetrically. No hydronephrosis or renal masses. The ureters are not dilated.</p><p><strong>BOWEL AND MESENTERY:</strong> The visualized portions of the small and large bowel are unremarkable. No bowel wall thickening or obstruction. The appendix is visualized and normal. The mesentery is clear.</p><p><strong>PELVIC ORGANS:</strong> The urinary bladder is unremarkable. The uterus and ovaries (female) or prostate and seminal vesicles (male) are unremarkable.</p><p><strong>VASCULATURE:</strong> The abdominal aorta and IVC are of normal caliber. No evidence of aneurysm or thrombosis.</p><p><strong>BONES AND SOFT TISSUES:</strong> The visualized osseous structures and soft tissues are unremarkable.</p>",
//   },
//   "MRI": {
//     "Brain (Non-contrast)": "<h3>IMPRESSION:</h3><p>1. No evidence of acute infarct, intracranial hemorrhage, or mass lesion.</p><h3>FINDINGS:</h3><p><strong>PARENCHYMA:</strong> No evidence of acute restricted diffusion to suggest ischemia. No abnormal susceptibility artifact to suggest hemorrhage. Normal gray-white matter differentiation. No space-occupying lesion or significant white matter disease.</p><p><strong>VENTRICLES AND CISTERNS:</strong> The ventricular system and sulci are normal for the patient's age. The basal cisterns are patent.</p><p><strong>VASCULAR STRUCTURES:</strong> Major intracranial vascular flow voids are present and patent.</p><p><strong>EXTRACRANIAL STRUCTURES:</strong> The visualized orbits, paranasal sinuses, and mastoid air cells are unremarkable.</p>",
//     "Knee (Non-contrast)": "<h3>IMPRESSION:</h3><p>1. No acute meniscal or ligamentous tear.</p><h3>FINDINGS:</h3><p><strong>MENISCI:</strong></p><p>Medial Meniscus: Intact. No tear.</p><p>Lateral Meniscus: Intact. No tear.</p><p><strong>LIGAMENTS:</strong></p><p>Anterior Cruciate Ligament (ACL): Intact.</p><p>Posterior Cruciate Ligament (PCL): Intact.</p><p>Medial Collateral Ligament (MCL): Intact.</p><p>Lateral Collateral Ligament (LCL) Complex: Intact.</p><p><strong>CARTILAGE:</strong> The articular cartilage is preserved in the patellofemoral and tibiofemoral compartments.</p><p><strong>BONE MARROW:</strong> No evidence of fracture, contusion, or aggressive bone lesion.</p><p><strong>EXTENSOR MECHANISM:</strong> The quadriceps and patellar tendons are intact.</p><p><strong>JOINT FLUID:</strong> Physiologic amount of joint fluid.</p>",
//     "Lumbar Spine (Non-contrast)": "<h3>IMPRESSION:</h3><p>1. No evidence of acute disc herniation, spinal stenosis, or nerve root compression.</p><p>2. Mild degenerative disc disease.</p><h3>FINDINGS:</h3><p><strong>ALIGNMENT:</strong> Normal lumbar lordosis. No subluxation.</p><p><strong>VERTEBRAL BODIES:</strong> Vertebral body heights and marrow signal are maintained. No acute fracture.</p><p><strong>DISCS:</strong></p><p>[L1-L2 through L3-L4]: No significant disc bulge or herniation.</p><p>L4-L5]: Mild disc bulge without significant canal or foraminal stenosis.</p><p>[L5-S1]: Mild disc desiccation and height loss without significant herniation.</p><p><strong>SPINAL CANAL AND FORAMINA:</strong> The central canal and neural foramina are patent at all levels.</p><p><strong>CONUS MEDULLARIS:</strong> The conus medullaris terminates at [L1] and is normal in signal.</p><p><strong>PARASPINAL SOFT TISSUES:</strong> Unremarkable.</p>",
//   }
// };

// // --- NEW COMPONENT: AiConversationPanel ---
// const AiConversationPanel = ({ history, onSendMessage, isReplying, userInput, setUserInput }) => {
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [history]);

//   const handleSend = () => {
//     if (userInput.trim()) {
//       onSendMessage(userInput);
//       setUserInput('');
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mt-8">
//       <div className="p-4 bg-gray-50 border-b rounded-t-2xl">
//         <h2 className="text-xl font-bold text-gray-700 flex items-center">
//           <MessageSquare className="mr-3 text-indigo-500" />
//           AI Co-pilot Conversation
//         </h2>
//       </div>
//       <div className="p-4 h-96 overflow-y-auto flex flex-col space-y-4">
//         {history.map((msg, index) => (
//           <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//             <div className={`rounded-xl p-3 max-w-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
//               <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
//             </div>
//           </div>
//         ))}
//         {isReplying && (
//           <div className="flex justify-start">
//             <div className="rounded-xl p-3 bg-gray-200 text-gray-800">
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
//                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
//                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={chatEndRef} />
//       </div>
//       <div className="p-4 border-t bg-white rounded-b-2xl">
//         <div className="flex items-center space-x-2">
//           <textarea
//             value={userInput}
//             onChange={(e) => setUserInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Ask a follow-up question..."
//             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition resize-none"
//             rows="2"
//             disabled={isReplying}
//           />
//           <button
//             onClick={handleSend}
//             disabled={isReplying || !userInput.trim()}
//             className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- NEW COMPONENT: CollapsibleSection ---
// const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
//   const [isOpen, setIsOpen] = useState(defaultOpen);

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition focus:outline-none"
//       >
//         <div className="flex items-center">
//           {Icon && <Icon className="mr-3 text-blue-500" />}
//           <h2 className="text-xl font-bold text-gray-700">{title}</h2>
//         </div>
//         <ChevronDown
//           size={24}
//           className={`text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
//         />
//       </button>
//       <div
//         className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
//         style={{ transition: 'max-height 0.7s ease-in-out, padding 0.5s ease, opacity 0.5s ease' }}
//       >
//         <div className="p-6 space-y-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };


// const MenuBar = ({ editor }) => {
//   if (!editor) {
//     return null;
//   }

//   return (
//     <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-t-lg border-b border-gray-300">
//       <button
//         onClick={() => editor.chain().focus().toggleBold().run()}
//         disabled={!editor.can().chain().focus().toggleBold().run()}
//         className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
//         title="Bold"
//       >
//         <Bold size={16} />
//       </button>
//       <button
//         onClick={() => editor.chain().focus().toggleItalic().run()}
//         disabled={!editor.can().chain().focus().toggleItalic().run()}
//         className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
//         title="Italic"
//       >
//         <Italic size={16} />
//       </button>
//       <button
//         onClick={() => editor.chain().focus().setParagraph().run()}
//         className={`p-2 rounded ${editor.isActive('paragraph') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
//         title="Paragraph"
//       >
//         <Pilcrow size={16} />
//       </button>
//       <button
//         onClick={() => editor.chain().focus().toggleBulletList().run()}
//         className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
//         title="Bullet List"
//       >
//         <List size={16} />
//       </button>
//       <button
//         onClick={() => editor.chain().focus().toggleOrderedList().run()}
//         className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
//         title="Ordered List"
//       >
//         <ListOrdered size={16} />
//       </button>
//     </div>
//   );
// };


// // --- UNIFIED COMPONENT: AlertPanel (UPDATED) ---
// const AlertPanel = ({ alertData, onAcknowledge, onInsertMacro, onPrepareNotification, onFix, onProceed }) => {
//   if (!alertData) return null;

//   const isCritical = alertData.type === 'critical';
//   const isFixable = alertData.type === 'inconsistency';
//   const isMissingInfo = alertData.type === 'missing_info';

//   const config = {
//     critical: {
//       bgColor: 'bg-red-50',
//       borderColor: 'border-red-500',
//       textColor: 'text-red-800',
//       iconColor: 'text-red-500',
//       Icon: AlertTriangle,
//       message: 'Please review and take appropriate action immediately.',
//     },
//     inconsistency: {
//       bgColor: 'bg-yellow-50',
//       borderColor: 'border-yellow-500',
//       textColor: 'text-yellow-800',
//       iconColor: 'text-yellow-500',
//       Icon: AlertTriangle,
//       title: 'Inconsistency Detected',
//       message: alertData.message,
//     },
//     missing_info: {
//       bgColor: 'bg-orange-50',
//       borderColor: 'border-orange-500',
//       textColor: 'text-orange-800',
//       iconColor: 'text-orange-500',
//       Icon: AlertTriangle,
//       title: 'Incomplete Report',
//       message: alertData.message,
//     },
//   };

//   const currentConfig = config[alertData.type];
//   if (!currentConfig) return null;

//   const title = isCritical
//     ? `Critical Finding Detected: ${alertData.data?.findingName}`
//     : currentConfig.title;

//   return (
//     <div className={`${currentConfig.bgColor} border-l-4 ${currentConfig.borderColor} ${currentConfig.textColor} p-4 rounded-lg shadow-md mb-4`} role="alert">
//       <div className="flex items-start">
//         <div className="py-1">
//           <currentConfig.Icon className={`h-6 w-6 ${currentConfig.iconColor} mr-4`} />
//         </div>
//         <div className="flex-grow">
//           <p className="font-bold">{title}</p>
//           <p className="text-sm">{currentConfig.message}</p>
//           <div className="mt-3 flex flex-wrap gap-2">
//             {isCritical && (
//               <>
//                 <button
//                   onClick={onInsertMacro}
//                   className="bg-red-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-red-700 transition text-sm flex items-center"
//                 >
//                   <PlusCircle size={16} className="mr-1.5" /> Add to Report
//                 </button>
//                 <button
//                   onClick={onPrepareNotification}
//                   className="bg-yellow-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-yellow-600 transition text-sm flex items-center"
//                 >
//                   <Copy size={16} className="mr-1.5" /> Prepare Notification
//                 </button>
//               </>
//             )}
//             {isFixable && (
//               <>
//                 <button
//                   onClick={onFix}
//                   className="bg-green-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-green-700 transition text-sm flex items-center"
//                 >
//                   <CheckCircle size={16} className="mr-1.5" /> Fix Issue
//                 </button>
//                 <button
//                   onClick={onAcknowledge}
//                   className="bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-lg hover:bg-gray-300 transition text-sm flex items-center"
//                 >
//                   <XCircle size={16} className="mr-1.5" /> Ignore
//                 </button>
//               </>
//             )}
//             {isMissingInfo && (
//               <>
//                 <button
//                   onClick={onProceed}
//                   className="bg-orange-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-orange-700 transition text-sm flex items-center"
//                 >
//                   <CheckCircle size={16} className="mr-1.5" /> Proceed Anyway
//                 </button>
//                 <button
//                   onClick={onAcknowledge}
//                   className="bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-lg hover:bg-gray-300 transition text-sm flex items-center"
//                 >
//                   <ChevronLeft size={16} className="mr-1.5" /> Go Back
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//         { (isCritical || isMissingInfo) && (
//           <button onClick={onAcknowledge} className={`ml-4 ${currentConfig.iconColor} hover:${currentConfig.textColor}`}>
//             <XCircle size={22} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };


// // --- NEW COMPONENT: AiSuggestedMeasurementsPanel ---
// const AiSuggestedMeasurementsPanel = ({ measurements, onInsert, onClear }) => {
//   if (!measurements || measurements.length === 0) {
//     return null;
//   }

//   return (
//     <div className="bg-blue-50 p-4 rounded-2xl shadow-lg border border-blue-200 mt-6">
//       <div className="flex justify-between items-center mb-3">
//         <h3 className="text-xl font-bold text-blue-700 flex items-center">
//           <Zap size={20} className="mr-2" />AI-Suggested Measurements
//         </h3>
//         <button onClick={onClear} className="text-gray-500 hover:text-gray-800">
//           <XCircle size={22} />
//         </button>
//       </div>
//       <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
//         {measurements.map((item, index) => (
//           <div key={index} className="bg-white p-3 rounded-lg flex items-center justify-between shadow-sm">
//             <div>
//               <span className="font-semibold text-gray-800">{item.finding}:</span>
//               <span className="ml-2 text-gray-600">{item.value}</span>
//             </div>
//             <button
//               onClick={() => onInsert(item.finding, item.value)}
//               className="bg-blue-100 text-blue-800 font-bold py-1 px-3 rounded-lg hover:bg-blue-200 transition text-sm flex items-center"
//             >
//               <Plus size={16} className="mr-1" /> Insert
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // --- NEW COMPONENT: RecentReportsPanel ---
// const RecentReportsPanel = ({ onSelectReport, user }) => {
//   const [recentReports, setRecentReports] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (!user) return;
//     const q = query(
//       collection(db, "users", user.uid, "reports"),
//       orderBy("createdAt", "desc"),
//       limit(5)
//     );
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const reports = [];
//       querySnapshot.forEach((doc) => {
//         reports.push({ id: doc.id, ...doc.data() });
//       });
//       setRecentReports(reports);
//       setIsLoading(false);
//     }, (error) => {
//       console.error("Error fetching recent reports: ", error);
//       toast.error("Could not fetch recent reports.");
//       setIsLoading(false);
//     });
//     return () => unsubscribe();
//   }, [user]);

//   return (
//     <CollapsibleSection title="Recent Reports" icon={History}>
//       {isLoading ? (
//         <p>Loading recent reports...</p>
//       ) : recentReports.length > 0 ? (
//         <div className="space-y-2">
//           {recentReports.map(report => (
//             <button
//               key={report.id}
//               onClick={() => onSelectReport(report)}
//               className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border transition"
//             >
//               <p className="font-semibold">{report.patientName}</p>
//               <p className="text-sm text-gray-500">
//                 {report.examDate} - {new Date(report.createdAt?.seconds * 1000).toLocaleDateString()}
//               </p>
//             </button>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">No recent reports found.</p>
//       )}
//     </CollapsibleSection>
//   );
// };



// const ShortcutsHelpModal = ({ shortcuts, onClose }) => {
//   const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
//   const modifierKey = isMac ? '⌘' : 'Ctrl';
//   const altKey = isMac ? '⌥' : 'Alt';

//   const renderKey = (key) => <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">{key}</kbd>;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
//         <div className="p-6 border-b flex justify-between items-center">
//           <h3 className="text-2xl font-bold text-gray-800 flex items-center"><Zap size={24} className="mr-3 text-indigo-500"/>Keyboard Shortcuts</h3>
//           <button onClick={onClose}><XCircle /></button>
//         </div>
//         <div className="p-6 overflow-y-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
//             {Object.entries(shortcuts).map(([action, config]) => (
//               <div key={action} className="flex justify-between items-center">
//                 <span className="text-gray-700">{config.label}</span>
//                 <div className="flex items-center space-x-1">
//                   {config.ctrlOrCmd && renderKey(modifierKey)}
//                   {config.alt && renderKey(altKey)}
//                   {renderKey(config.key.toUpperCase())}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const KnowledgeLookupPanel = ({ result, onClose, onInsert }) => {
//   if (!result) return null;

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-8">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold text-gray-700 flex items-center">
//           <BrainCircuit className="mr-3 text-green-500" />
//           Knowledge Lookup: {result.conditionName}
//         </h2>
//         <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
//           <XCircle size={24} />
//         </button>
//       </div>
//       <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
//         <div>
//           <h3 className="font-bold text-lg text-gray-800 mb-2">Summary</h3>
//           <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: result.summary }} />
//         </div>

//         {result.keyImagingFeatures && result.keyImagingFeatures.length > 0 && (
//           <div>
//             <h3 className="font-bold text-lg text-gray-800 mb-2">Key Imaging Features</h3>
//             <ul className="list-disc list-inside space-y-1 text-sm prose prose-sm max-w-none">
//               {result.keyImagingFeatures.map((feature, index) => (
//                 <li key={index} dangerouslySetInnerHTML={{ __html: feature.replace(/<\/?li>/g, '') }} />
//               ))}
//             </ul>
//           </div>
//         )}

//         {result.differentialDiagnosis && result.differentialDiagnosis.length > 0 && (
//           <div>
//             <h3 className="font-bold text-lg text-gray-800 mb-2">Differential Diagnosis</h3>
//             <ul className="list-disc list-inside space-y-1 text-sm">
//               {result.differentialDiagnosis.map((dx, index) => (
//                 <li key={index}>{dx}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {result.sources && result.sources.length > 0 && (
//           <div>
//             <h4 className="font-bold text-gray-700 mt-4 mb-2 flex items-center"><BookOpen size={16} className="mr-2"/>Sources</h4>
//             <ul className="list-disc list-inside space-y-1 text-xs">
//               {result.sources.map((source, index) => (
//                 <li key={index}>
//                   <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                     {source.name} <LinkIcon size={12} className="inline-block ml-1"/>
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//       <div className="mt-4 pt-4 border-t">
//         <button
//           onClick={() => {
//             const contentToInsert = `
//               <h3>${result.conditionName}</h3>
//               <h4>Summary</h4>
//               ${result.summary}
//               <h4>Key Imaging Features</h4>
//               <ul>${result.keyImagingFeatures.join('')}</ul>
//             `;
//             onInsert(contentToInsert);
//           }}
//           className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
//         >
//           <PlusCircle size={18} className="mr-2" /> Insert into Report
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- HELPER FUNCTION to escape characters for regex
// const escapeRegex = (string) => {
//   return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// };

// // Skeleton Loader Components
// const SearchResultSkeleton = () => (
//   <div className="mt-3 space-y-3">
//     {[...Array(2)].map((_, i) => (
//       <div key={i} className="p-4 bg-gray-200 rounded-lg animate-pulse">
//         <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
//         <div className="h-3 bg-gray-300 rounded w-1/4 mb-3"></div>
//         <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
//         <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
//         <div className="h-3 bg-gray-300 rounded w-5/6"></div>
//       </div>
//     ))}
//   </div>
// );

// const ReportSkeleton = () => (
//   <div className="p-4 space-y-4 animate-pulse">
//     <div className="h-6 bg-gray-300 rounded w-1/3"></div>
//     <div className="space-y-2">
//       <div className="h-4 bg-gray-300 rounded w-full"></div>
//       <div className="h-4 bg-gray-300 rounded w-full"></div>
//       <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//     </div>
//     <div className="h-6 bg-gray-300 rounded w-1/4"></div>
//     <div className="space-y-2">
//       <div className="h-4 bg-gray-300 rounded w-full"></div>
//       <div className="h-4 bg-gray-300 rounded w-5/6"></div>
//     </div>
//   </div>
// );

// // --- UPDATED COMPONENT: ImageViewer ---
// const ImageViewer = ({ image, className }) => {
//     const viewerRef = useRef(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (!image || !viewerRef.current) {
//             return;
//         }

//         const element = viewerRef.current;
//         const cornerstone = window.cornerstone;
//         const cornerstoneTools = window.cornerstoneTools;
//         const csWADOImageLoader = window.cornerstoneWADOImageLoader;

//         if (!cornerstone || !cornerstoneTools || !csWADOImageLoader) {
//             setError("Medical imaging libraries not loaded. Please wait a moment.");
//             return;
//         }

//         const loadAndDisplayImage = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 cornerstone.enable(element);
//                 cornerstoneTools.init();

//                 let imageId;
//                 if (image.type === 'application/dicom' || image.name.toLowerCase().endsWith('.dcm')) {
//                     imageId = csWADOImageLoader.wadouri.fileManager.add(image.file);
//                 } else {
//                     // For non-DICOM, create a file-like object for the loader
//                     const blob = await (await fetch(image.src)).blob();
//                     const file = new File([blob], image.name, {type: image.type});
//                     imageId = csWADOImageLoader.wadouri.fileManager.add(file);
//                 }

//                 const loadedImage = await cornerstone.loadImage(imageId);
//                 cornerstone.displayImage(element, loadedImage);
//                 cornerstone.resize(element, true);

//                 cornerstoneTools.addTool(cornerstoneTools.PanTool);
//                 cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
//                 cornerstoneTools.addTool(cornerstoneTools.WwwcTool);

//                 cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 }); // Left mouse
//                 cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 }); // Right mouse
//                 cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 4 }); // Middle mouse
//             } catch (err) {
//                 console.error("Error loading image:", err);
//                 setError("Failed to load image. It may not be a supported format.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadAndDisplayImage();

//         return () => {
//             try {
//                 if (cornerstone.getEnabledElement(element)) {
//                    cornerstone.disable(element);
//                 }
//             } catch (err) {
//                 // Ignore errors on cleanup
//             }
//         };
//     }, [image]);

//     return (
//         <div className={`relative w-full border rounded-lg bg-gray-900 overflow-hidden ${className || 'h-[500px]'}`}>
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 text-white z-10">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
//                     <p className="ml-4">Loading image...</p>
//                 </div>
//             )}
//             {error && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-red-800 bg-opacity-70 text-white z-10 p-4">
//                     <AlertTriangle size={24} className="mr-2"/>
//                     <p className="font-bold">Error: {error}</p>
//                 </div>
//             )}
//             <div ref={viewerRef} className="absolute inset-0"></div>
//         </div>
//     );
// };

// // --- NEW COMPONENT: ImageModal ---
// const ImageModal = ({ images, currentIndex, onClose, onNext, onPrev }) => {
//   if (currentIndex === null || !images[currentIndex]) return null;

//   const currentImage = images[currentIndex];

//   const handleKeyDown = useCallback((e) => {
//     if (e.key === 'ArrowRight') {
//       onNext();
//     } else if (e.key === 'ArrowLeft') {
//       onPrev();
//     } else if (e.key === 'Escape') {
//       onClose();
//     }
//   }, [onNext, onPrev, onClose]);

//   useEffect(() => {
//     window.addEventListener('keydown', handleKeyDown);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [handleKeyDown]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
//       <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col p-4 border-2 border-gray-700">
//         <div className="flex justify-between items-center mb-2 text-white">
//           <h3 className="text-lg font-bold">
//             Image {currentIndex + 1} of {images.length} - {currentImage.name}
//           </h3>
//           <button onClick={onClose} className="text-gray-300 hover:text-white">
//             <XCircle size={28} />
//           </button>
//         </div>
//         <div className="flex-grow relative">
//           {isDicom(images[currentIndex]) ? (
//           <div className="w-full h-full">
//             <ImageViewer image={images[currentIndex]} />
//           </div>
//         ) : (
//           <img
//             src={getRasterSrc(images[currentIndex])}
//             alt={images[currentIndex]?.name || `Image ${currentIndex + 1}`}
//             className="max-w-full max-h-full object-contain"
//             draggable={false}
//           />
//         )}
//         </div>
//       </div>
//       {/* Navigation Buttons */}
//       <button
//         onClick={onPrev}
//         disabled={currentIndex === 0}
//         className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-700 text-white rounded-full p-3 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
//       >
//         <ChevronLeft size={32} />
//       </button>
//       <button
//         onClick={onNext}
//         disabled={currentIndex >= images.length - 1}
//         className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-700 text-white rounded-full p-3 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
//       >
//         <ChevronRight size={32} />
//       </button>
//     </div>
//   );
// };

// // --- Modal image-type helpers ---
// const isDicom = (img) => {
//   if (!img) return false;
//   const name = (img.name || "").toLowerCase();
//   const type = (img.type || "").toLowerCase();
//   return type === "application/dicom" || name.endsWith(".dcm");
// };

// const getRasterSrc = (img) => {
//   if (!img) return "";
//   if (img.src) return img.src;
//   if (img.base64?.startsWith("data:")) return img.base64;
//   if (img.base64) {
//     const mime = img.type || "image/png";
//     return `data:${mime};base64,${img.base64}`;
//   }
//   if (typeof URL !== "undefined") {
//     if (img.blob instanceof Blob) return URL.createObjectURL(img.blob);
//     if (img.file instanceof File) return URL.createObjectURL(img.file);
//   }
//   return "";
// };


// const App = () => {
//   // --- AUTHENTICATION STATE ---
//   const [user, setUser] = useState(null);
//   const [userRole, setUserRole] = useState('basic'); // Add userRole state
//   const [isAuthLoading, setIsAuthLoading] = useState(true);
//   const [isRestricted, setIsRestricted] = useState(false); // Freemium restriction state


//   // --- ALL OTHER APP STATE ---
//   const [patientName, setPatientName] = useState('John Doe');
//   const [patientId, setPatientId] = useState('P00000000');
//   const [patientAge, setPatientAge] = useState('45');
//   const [referringPhysician, setReferringPhysician] = useState('Dr. Evelyn Reed');
//   const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
//   const [modality, setModality] = useState('Ultrasound');
//   const [template, setTemplate] = useState('Abdomen');
//   const [images, setImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [userFindings, setUserFindings] = useState('');
//   const [generatedReport, setGeneratedReport] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isAiLoading, setIsAiLoading] = useState(false);
//   const [aiAnalysisStatus, setAiAnalysisStatus] = useState('');
//   const [clinicalContext, setClinicalContext] = useState('');
//   const [assistantQuery, setAssistantQuery] = useState('');
//   const [error, setError] = useState(null);
//   const [copySuccess, setCopySuccess] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [localSearchResults, setLocalSearchResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [baseSearchQuery, setBaseSearchQuery] = useState('');
//   const [allAiSearchResults, setAllAiSearchResults] = useState([]);
//   const [currentAiPage, setCurrentAiPage] = useState(0);
//   const [allAiFullReports, setAllAiFullReports] = useState([]);
//   const [currentReportPage, setCurrentReportPage] = useState(0);
//   const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
//   const [aiSuggestions, setAiSuggestions] = useState('');
//   const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
//   const [suggestionType, setSuggestionType] = useState('');
//   const [isParsing, setIsParsing] = useState(false);
//   const [voiceStatus, setVoiceStatus] = useState('idle');
//   const [isDictationSupported, setIsDictationSupported] = useState(true);
//   const [interimTranscript, setInterimTranscript] = useState('');
//   const [macros, setMacros] = useState([]); // Macros will now be loaded from Firestore
//   const [showMacroModal, setShowMacroModal] = useState(false);
//   const [newMacroCommand, setNewMacroCommand] = useState('');
//   const [newMacroText, setNewMacroText] = useState('');
//   const [aiKnowledgeLookupResult, setAiKnowledgeLookupResult] = useState(null);
//   const [isProactiveHelpEnabled, setIsProactiveHelpEnabled] = useState(true);
//   const [structuredData, setStructuredData] = useState({});
//   const [isExtracting, setIsExtracting] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [showShortcutsModal, setShowShortcutsModal] = useState(false);
//   const [aiMeasurements, setAiMeasurements] = useState([]);
//   const [activeAlert, setActiveAlert] = useState(null);
//   const [isAwaitingAlertAcknowledge, setIsAwaitingAlertAcknowledge] = useState(false);
//   const [correctionSuggestion, setCorrectionSuggestion] = useState(null);
//   const [isDicomLoaded, setIsDicomLoaded] = useState(false);
// // --- ALL OTHER APP STATE (Add these new states) ---
// const [isConversationActive, setIsConversationActive] = useState(false);
// const [conversationHistory, setConversationHistory] = useState([]);
// const [isAiReplying, setIsAiReplying] = useState(false);
// const [userInput, setUserInput] = useState(''); // For the chat input box

// // --- ADD THESE NEW STATES ---
//   const [dynamicMeasurements, setDynamicMeasurements] = useState([]);
//   const [templateOrgans, setTemplateOrgans] = useState([]);

//     const [userTemplates, setUserTemplates] = useState({});
//   const [showTemplateModal, setShowTemplateModal] = useState(false);

//   const [editorContent, setEditorContent] = useState(templates.Ultrasound.Abdomen);

// // const blockTemplateReloadRef = useRef(false);

//   const [modalIndex, setModalIndex] = useState(null);
//   // const openModal = (index) => setModalIndex(index);
//   // const closeModal = () => setModalIndex(null);
//   const showNext = () => setModalIndex((prev) => Math.min(prev + 1, images.length - 1));
//   const showPrev = () => setModalIndex((prev) => Math.max(prev - 1, 0));

//   // --- NEW: Modal State ---
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(null);

//   // --- ALL REFS ---
//   const debounceTimeoutRef = useRef(null);
//   const inconsistencyCheckTimeoutRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const searchButtonRef = useRef(null);
//   const voiceStatusRef = useRef(voiceStatus);
//   const dataExtractTimeoutRef = useRef(null);
//   const proactiveAnalysisTimeoutRef = useRef(null);
//   const localSearchInputRef = useRef(null);
//   const searchResultsRef = useRef();
//   const isProgrammaticUpdate = useRef(false);
//   const macrosRef = useRef(macros);

//   useEffect(() => {
//     macrosRef.current = macros;
//   }, [macros]);
//   // Keep a ref in sync with isAwaitingAlertAcknowledge to avoid stale closures
//   const awaitingRef = useRef(false);
//   useEffect(() => {
//     awaitingRef.current = isAwaitingAlertAcknowledge;
//   }, [isAwaitingAlertAcknowledge]);

//   const allTemplates = useMemo(() => {
    
//     const deepMerge = (target, source) => {
//       const output = { ...target };
//       if (target && typeof target === 'object' && source && typeof source === 'object') {
//         Object.keys(source).forEach(key => {
//           if (source[key] && typeof source[key] === 'object') {
//             if (!(key in target))
//               Object.assign(output, { [key]: source[key] });
//             else
//               output[key] = deepMerge(target[key], source[key]);
//           } else {
//             Object.assign(output, { [key]: source[key] });
//           }
//         });
//       }
//       return output;
//     };
//     return deepMerge(templates, userTemplates);
//   }, [userTemplates]);

//   // --- LOAD DICOM LIBRARIES ---
//   useEffect(() => {
//     const loadLibraries = () => {
//       // These libraries must be loaded in a specific order
//       loadScript('https://unpkg.com/cornerstone-core@2.2.8/dist/cornerstone.min.js', () => {
//         loadScript('https://unpkg.com/dicom-parser@1.8.11/dist/dicomParser.min.js', () => {
//           loadScript('https://unpkg.com/cornerstone-wado-image-loader@2.0.4/dist/cornerstoneWADOImageLoader.min.js', () => {
//             const csWADOImageLoader = window.cornerstoneWADOImageLoader;
//             csWADOImageLoader.external.cornerstone = window.cornerstone;
//             csWADOImageLoader.external.dicomParser = window.dicomParser;
//             csWADOImageLoader.configure({
//                 beforeSend: function(xhr) {
//                     // Add custom headers here (e.g., for authentication)
//                 }
//             });
//             loadScript('https://unpkg.com/cornerstone-tools@4.22.0/dist/cornerstoneTools.min.js', () => {
//                 const cornerstoneTools = window.cornerstoneTools;
//                 cornerstoneTools.external.cornerstone = window.cornerstone;
//                 setIsDicomLoaded(true);
//             });
//           });
//         });
//       });
//     };
//     loadLibraries();
//   }, []);

//   // --- NEW: Modal Handlers ---
//   const openModal = (index) => {
//     setCurrentImageIndex(index);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCurrentImageIndex(null);
//   };

//   const showNextImage = () => {
//     setCurrentImageIndex(prevIndex => (prevIndex < images.length - 1 ? prevIndex + 1 : prevIndex));
//   };

//   const showPrevImage = () => {
//     setCurrentImageIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
//   };

//   // --- ALL HOOKS (useCallback, useEditor, useEffect) ---

//   useEffect(() => {
//     searchResultsRef.current = { localSearchResults, allAiSearchResults, currentAiPage };
//   });

//   useEffect(() => {
//     voiceStatusRef.current = voiceStatus;
//   }, [voiceStatus]);

//  // --- DEBOUNCED CHECKS FOR EDITOR ---
//   const debouncedCriticalCheck = useCallback((text) => {
//     if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
//     debounceTimeoutRef.current = setTimeout(() => {
//       if (!awaitingRef.current && text.trim() !== '') {
//         checkForCriticalFindings(text);
//       } else if (!awaitingRef.current) {
//         setActiveAlert(null);
//       }
//     }, 1000);
//   }, []); 

//   const debouncedInconsistencyCheck = useCallback((text) => {
//     if (inconsistencyCheckTimeoutRef.current) clearTimeout(inconsistencyCheckTimeoutRef.current);
//     inconsistencyCheckTimeoutRef.current = setTimeout(() => {
//       if (!awaitingRef.current && text.trim().length > 50) {
//         runInconsistencyCheck(text);
//       } else if (!awaitingRef.current) {
//         setActiveAlert(null);
//       }
//     }, 2000);
//   }, []);

//   const debouncedExtractData = useCallback((text) => {
//     if (dataExtractTimeoutRef.current) clearTimeout(dataExtractTimeoutRef.current);
//     dataExtractTimeoutRef.current = setTimeout(() => {
//       if (text.trim().length > 20) {
//         extractStructuredData(text);
//       } else {
//         setStructuredData({});
//       }
//     }, 1500);
//   }, []);

//   const debouncedProactiveAnalysis = useCallback((text) => {
//     if (proactiveAnalysisTimeoutRef.current) clearTimeout(proactiveAnalysisTimeoutRef.current);
//     proactiveAnalysisTimeoutRef.current = setTimeout(() => {
//       if (isProactiveHelpEnabled && !isSearching && text.trim().length > 40) {
//         runProactiveAnalysis(text);
//       } else if (!awaitingRef.current) {
//         setActiveAlert(null);
//       }
//     }, 3000);
//   }, [isProactiveHelpEnabled, isSearching]);
  
  
//    // --- EDITOR INITIALIZATION ---
//   const handleEditorUpdate = useCallback(({ editor }) => {
//     if (isProgrammaticUpdate.current) {
//       isProgrammaticUpdate.current = false;
//       return;
//     }
    
//     const text = editor.getText();

//     if (awaitingRef.current) {
//       return;
//     }

//     debouncedCriticalCheck(text);
//     debouncedInconsistencyCheck(text);
//     debouncedExtractData(text);
//     debouncedProactiveAnalysis(text);
//   }, [debouncedCriticalCheck, debouncedInconsistencyCheck, debouncedExtractData, debouncedProactiveAnalysis]);

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Placeholder.configure({
//         placeholder: 'Start dictating or paste findings here…',
//         emptyEditorClass: 'is-editor-empty',
//       }),
//     ],
//     onUpdate: handleEditorUpdate,
//   }, []);

// // useEffect(() => {
// //     // This effect will now ONLY run if the ref flag is true (i.e., on initial load or a manual dropdown change).
// //     if (isManualTemplateChangeRef.current === true) {
// //       if (editor && !editor.isDestroyed) {
// //         isProgrammaticUpdate.current = true;
// //         const newTemplateContent = allTemplates[modality]?.[template] || '';
// //         editor.commands.setContent(newTemplateContent);
        
// //         if (modality === 'Ultrasound') {
// //           const parser = new DOMParser();
// //           const doc = parser.parseFromString(newTemplateContent, 'text/html');
          
// //           const placeholders = newTemplateContent.match(/_+\s?(cm|mm|ml|cc)?/g) || [];
// //           const measurements = placeholders.map((_, index) => ({
// //             id: index,
// //             label: `Measurement ${index + 1}`
// //           }));
// //           setDynamicMeasurements(measurements);

// //           const organs = Array.from(doc.querySelectorAll('strong')).map(el => el.textContent.replace(':', '').trim());
// //           setTemplateOrgans(organs.length > 0 ? organs : ['General']);

// //         } else {
// //           setDynamicMeasurements([]);
// //           setTemplateOrgans([]);
// //         }
// //       }
// //       // After it runs, lower the flag so it won't run again on subsequent re-renders (like from the AI analysis).
// //       isManualTemplateChangeRef.current = false;
// //     }
// //   }, [modality, template, editor, allTemplates]);

// // This single useEffect now handles all template loading logic.
 
// // HOOK 1: This is the SINGLE source of truth for updating the Tiptap editor.
//   // It runs ONLY when the `editorContent` state changes.
//   // useEffect(() => {
//   //       console.log('Use effect for editorPanel....1061')

//   //   if (editor && editorContent && editor.getHTML() !== editorContent) {
//   //     isProgrammaticUpdate.current = true;
//   //     editor.commands.setContent(editorContent);
//   //   }
//   // }, [editorContent, editor]);

//   // // HOOK 2: This hook is responsible for populating the Measurements Panel.
//   // // It runs ONLY when the editorContent or modality changes.
//   // useEffect(() => {
//   //   console.log('Use effect for MP....1072')
//   //   if (modality === 'Ultrasound') {
//   //     const parser = new DOMParser();
//   //     const doc = parser.parseFromString(editorContent, 'text/html');
//   //     const placeholders = editorContent.match(/_+\s?(cm|mm|ml|cc)?/g) || [];
//   //     const measurements = placeholders.map((_, index) => ({
//   //       id: index,
//   //       label: `Measurement ${index + 1}`
//   //     }));
//   //     setDynamicMeasurements(measurements);
//   //     const organs = Array.from(doc.querySelectorAll('strong')).map(el => el.textContent.replace(':', '').trim());
//   //     setTemplateOrgans(organs.length > 0 ? organs : ['General']);
//   //   } else {
//   //     setDynamicMeasurements([]);
//   //     setTemplateOrgans([]);
//   //   }
//   // }, [editorContent, modality]);

// // --- START: Replace your existing hooks with this entire block ---


// // It runs ONLY when the `editorContent` state changes.
// useEffect(() => {
//   // Add this log right at the beginning of the effect
//   console.log('%c SYNC EFFECT:', 'color: blue; font-weight: bold;', 'Content changed. Now syncing editor.');

//   if (editor && editorContent && editor.getHTML() !== editorContent) {
//     isProgrammaticUpdate.current = true;
//     console.error('%c CULPRIT FOUND:', 'color: red; font-weight: bold;', 'This piece of code is overwriting the editor content!');
//     editor.commands.setContent(editorContent);
//   }
// }, [editorContent, editor]);

// // HOOK 2: This hook is responsible for populating the Measurements Panel.
// // It ONLY READS from the editorContent state and does not change it.
// useEffect(() => {
//   if (modality === 'Ultrasound') {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(editorContent, 'text/html');
//     const placeholders = editorContent.match(/_+\s?(cm|mm|ml|cc)?/g) || [];
//     const measurements = placeholders.map((_, index) => ({
//       id: index,
//       label: `Measurement ${index + 1}`
//     }));
//     setDynamicMeasurements(measurements);
//     const organs = Array.from(doc.querySelectorAll('strong')).map(el => el.textContent.replace(':', '').trim());
//     setTemplateOrgans(organs.length > 0 ? organs : ['General']);
//   } else {
//     setDynamicMeasurements([]);
//     setTemplateOrgans([]);
//   }
// }, [editorContent, modality]); // Dependency: The content state and the modality.

// // --- END: Replacement block ---
  
//     const handleInsertMeasurements = (values, calculusData) => {
//     if (!editor) return;
    
//     // Always start from the clean, original template to prevent errors
//     let updatedHtml = allTemplates[modality]?.[template] || '';

//     // This robust regex finds a placeholder defined as one or more underscores,
//     // optionally followed by a space and a common unit (cm, mm, ml, cc).
//     const placeholderRegex = /_+\s?(cm|mm|ml|cc)?/;

//     // 1. Replace standard measurement placeholders sequentially
//     dynamicMeasurements.forEach(measurementConfig => {
//         const value = values[measurementConfig.id];
//         // Only replace if there is a value
//         if (value && value.trim() !== '') {
//             // Replace the *next available* placeholder that matches the pattern
//             updatedHtml = updatedHtml.replace(placeholderRegex, `<strong>${value}</strong>`);
//         }
//     });

//     // 2. Insert calculus/mass lesion findings
//     calculusData.forEach(calculus => {
//         if (!calculus.location || !calculus.size) return;
//         const organName = calculus.location;
//         let findingText = ` A ${calculus.size}`;
//         if (calculus.description) {
//             findingText += ` ${calculus.description}`;
//         }
//         findingText += " is noted.";

//         const organRegex = new RegExp(`(<p><strong>${escapeRegex(organName)}:?<\/strong>)(.*?)(<\/p>)`, "i");
        
//         updatedHtml = updatedHtml.replace(organRegex, (match, openingTags, existingContent, closingTag) => {
//             const placeholderRegex = /Normal in size|Not dilated|unremarkable|No significant/i;
//             let finalContent = placeholderRegex.test(existingContent) ? findingText : existingContent + findingText;
//             return `${openingTags}${finalContent}${closingTag}`;
//         });
//     });

//     // Use the programmatic update flag to prevent the editor's onUpdate from re-triggering this logic
//     isProgrammaticUpdate.current = true;
//     console.error('%c CULPRIT FOUND:', 'color: red; font-weight: bold;', 'This piece of code is overwriting the editor content!');
//     editor.commands.setContent(updatedHtml);
// };

  
//   // FIX: This function now correctly replaces all placeholders sequentially.
//   // const handleInsertMeasurements = useCallback((values, calculusData) => {
//   //     if (!editor) return;

//   //     let updatedHtml = templates[modality]?.[template] || '';
//   //     let placeholderCounter = 0;

//   //     // Use a replacer function with a counter to ensure each placeholder is
//   //     // replaced with its corresponding value in the correct order.
//   //     updatedHtml = updatedHtml.replace(/__/g, () => {
//   //         const value = values[placeholderCounter];
//   //         placeholderCounter++;
          
//   //         if (value && value.trim() !== '') {
//   //             return `<strong>${value}</strong>`;
//   //         }
//   //         return '__'; // Keep the placeholder if no value is provided
//   //     });

//   //     // Insert calculus/mass data
//   //     calculusData.forEach(calculus => {
//   //         if (!calculus.location || !calculus.size) return;
//   //         const organName = calculus.location;
//   //         let findingText = ` A ${calculus.size}`;
//   //         if (calculus.description) {
//   //             findingText += ` ${calculus.description}`;
//   //         }
//   //         findingText += " is noted.";

//   //         const organRegex = new RegExp(`(<p><strong>${escapeRegex(organName)}:?<\/strong>)(.*?)(<\/p>)`, "i");
          
//   //         updatedHtml = updatedHtml.replace(organRegex, (match, openingTags, existingContent, closingTag) => {
//   //             const placeholderRegex = /Normal in size|Not dilated|unremarkable|No significant/i;
//   //             let finalContent = placeholderRegex.test(existingContent) ? findingText : existingContent + findingText;
//   //             return `${openingTags}${finalContent}${closingTag}`;
//   //         });
//   //     });

//   //     isProgrammaticUpdate.current = true;
//   //     editor.commands.setContent(updatedHtml);
//   //     // The `onInsert` is now debounced in the panel, so no toast is needed here.
//   // }, [editor, modality, template]);

//   // --- AUTHENTICATION LISTENER & FREEMIUM CHECK ---
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         const userDocRef = doc(db, 'users', currentUser.uid);
//         const userDocSnap = await getDoc(userDocRef);

//         if (userDocSnap.exists()) {
//           const userData = userDocSnap.data();
//           const userRole = userData.role || 'basic';
//           setUserRole(userRole);

//           if (userRole === 'basic') {
//             const reportLimit = 1000;
//             const reportCount = userData.reportCount || 0;
//             const lastReportDate = userData.lastReportDate?.toDate();
//             const currentMonth = new Date().getMonth();

//             if (lastReportDate && lastReportDate.getMonth() !== currentMonth) {
//               // Reset count for the new month
//               await updateDoc(userDocRef, { reportCount: 0, lastReportDate: serverTimestamp() });
//               setIsRestricted(false);
//             } else if (reportCount >= reportLimit) {
//               setIsRestricted(true);
//             } else {
//               setIsRestricted(false);
//             }
//           } else {
//             setIsRestricted(false); // Professional users are never restricted
//           }
//         } else {
//           // New user, set default values
//           await setDoc(userDocRef, {
//             email: currentUser.email,
//             role: 'basic',
//             reportCount: 0,
//             lastReportDate: serverTimestamp(),
//           });
//           setUserRole('basic');
//           setIsRestricted(false);
//         }
//       } else {
//         setUser(null);
//         setUserRole('basic');
//         setIsRestricted(false);
//       }
//       setIsAuthLoading(false);
//     });
//     return () => unsubscribe();
//   }, [user]);

// // // Load the initial template once the editor is ready
// //   useEffect(() => {
// //     if (editor) {
// //       loadTemplate(modality, template);
// //     }
// //   }, [editor]); // This will run only once when the editor is initialized

//   // --- FETCH USER-SPECIFIC MACROS FROM FIRESTORE ---
//   useEffect(() => {
//     if (user) {
//       const q = query(collection(db, "users", user.uid, "macros"));
//       const unsubscribe = onSnapshot(q, (querySnapshot) => {
//         const userMacros = [];
//         querySnapshot.forEach((doc) => {
//           userMacros.push({ id: doc.id, ...doc.data() });
//         });
//         setMacros(userMacros);
//       }, (error) => {
//         console.error("Error fetching macros: ", error);
//         toast.error("Could not fetch your macros.");
//       });

//       return () => unsubscribe(); // Cleanup listener on unmount or user change
//     } else {
//       setMacros([]); // Clear macros if user logs out
//     }
//   }, [user]);
  
//   // --- ADD THIS ENTIRE BLOCK TO FETCH USER TEMPLATES ---
//   useEffect(() => {
//     if (user) {
//       // Assumes your templates are stored in a subcollection named "templates"
//       const templatesQuery = query(collection(db, "users", user.uid, "templates"));
      
//       const unsubscribe = onSnapshot(templatesQuery, (querySnapshot) => {
//         const fetchedTemplates = {};
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           // Ensure the document has the required fields
//           if (data.modality && data.name && data.content) {
//             // Create the nested structure: { Modality: { TemplateName: "content" } }
//             if (!fetchedTemplates[data.modality]) {
//               fetchedTemplates[data.modality] = {};
//             }
//             fetchedTemplates[data.modality][data.name] = data.content;
//           }
//         });
//         setUserTemplates(fetchedTemplates); // This updates the state with your saved templates
//       }, (error) => {
//         console.error("Error fetching user templates: ", error);
//         toast.error("Could not fetch your custom templates.");
//       });

//       return () => unsubscribe(); // Cleanup the listener
//     } else {
//       setUserTemplates({}); // Clear templates on logout
//     }
//   }, [user]); // This effect runs when the user logs in
  
//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       toast.success("Signed out successfully.");
//     } catch (error) {
//       console.error("Error signing out: ", error);
//       toast.error("Failed to sign out.");
//     }
//   };

//   const toastDone = (msg) =>
//     toast(msg, {
//       duration: 2500,
//       ariaProps: { role: 'status', 'aria-live': 'polite' },
//     });

//   const runProactiveAnalysis = async (text) => {
//     if (isRestricted) return;
//     const prompt = `
//       Act as a radiological assistant. Analyze the following dictated text. Does it contain a specific, significant radiological finding that would benefit from an immediate knowledge lookup (like a named classification, a critical finding, or a finding with a well-defined differential diagnosis)? Examples include 'spiculated mass', 'ground glass opacity', 'Bosniak IIF cyst', 'ring-enhancing lesion'.

//       If a key finding is present, respond with a JSON object: {"shouldSearch": true, "searchQuery": "the concise, optimal search term for that finding"}. For example, if the text says 'a 6mm ground glass opacity is seen', the searchQuery should be 'Fleischner criteria for 6mm ground glass opacity'. If the text says 'a complex cyst measuring 3 cm with multiple septations is seen in the right kidney', the searchQuery could be 'Bosniak classification for complex renal cyst'.

//       If no specific, actionable finding is mentioned, or if the text is too generic, respond with {"shouldSearch": false, "searchQuery": null}. Only trigger a search for high-value terms.

//       Dictated Text:
//       ---
//       ${text}
//       ---
//     `;
//     try {
//       const payload = {
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//         generationConfig: { responseMimeType: "application/json" }
//       };
//       const model = 'gemini-2.5-flash';
//       const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;


//       const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//       if (!response.ok) return; // Fail silently

//       const result = await response.json();
//       const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

//       if (textResult) {
//         const parsedResult = JSON.parse(textResult);
//         if (parsedResult.shouldSearch && parsedResult.searchQuery) {
//           toast('Co-pilot found something relevant...', { icon: '💡' });
//           handleAiKnowledgeSearch(true, parsedResult.searchQuery);
//         }
//       }
//     } catch (err) {
//       console.error("Proactive analysis failed:", err); // Log error but don't bother the user
//     }
//   };

//   // const debouncedProactiveAnalysis = useCallback((text) => {
//   //   if (proactiveAnalysisTimeoutRef.current) clearTimeout(proactiveAnalysisTimeoutRef.current);
//   //   proactiveAnalysisTimeoutRef.current = setTimeout(() => {
//   //     if (isProactiveHelpEnabled && !isSearching && text.trim().length > 40) {
//   //       runProactiveAnalysis(text);
//   //     } else if (!awaitingRef.current) {
//   //       setActiveAlert(null);
//   //     }
//   //   }, 3000);
//   // }, [isProactiveHelpEnabled, isSearching]);

// // useEffect(() => {
// //     if (editor && !editor.isDestroyed) {
// //       isProgrammaticUpdate.current = true;
// //       const initialContent = allTemplates[modality]?.[template] || '';
// //       if (editor.getHTML() !== initialContent) {
// //         editor.commands.setContent(initialContent);
// //       }
// //     }
// //   }, [modality, template, editor, allTemplates]);


  
// //    const handleEditorUpdate = useCallback(({ editor }) => {
// //     if (isProgrammaticUpdate.current) {
// //       isProgrammaticUpdate.current = false;
// //       return;
// //     }
    
// //     const html = editor.getHTML();
// //     const text = editor.getText();
// //     setUserFindings(html);

// //     if (awaitingRef.current) {
// //       return;
// //     }

// //     debouncedCriticalCheck(text);
// //     debouncedInconsistencyCheck(text);
// //     debouncedExtractData(text);
// //     debouncedProactiveAnalysis(text);
// //   }, [debouncedCriticalCheck, debouncedInconsistencyCheck, debouncedExtractData, debouncedProactiveAnalysis]);
// //  const editor = useEditor({
// //     extensions: [
// //       StarterKit,
// //       Placeholder.configure({
// //         placeholder: 'Start dictating or paste findings here…',
// //         emptyEditorClass: 'is-editor-empty',
// //       }),
// //     ],
// //     content: userFindings,
// //     onUpdate: handleEditorUpdate,
// //   });
// // useEffect(() => {
// //     if (editor && !editor.isDestroyed) {
// //       isProgrammaticUpdate.current = true;
// //       const initialContent = templates[modality]?.[template] || '';
// //       if (editor.getHTML() !== initialContent) {
// //         editor.commands.setContent(initialContent);
// //       }
// //     }
// //   }, [modality, template, editor]);
  

//   const runInconsistencyCheck = useCallback(async (plainText) => {
//     if (isAwaitingAlertAcknowledge) return;
//     const findingsMatch = plainText.match(/FINDINGS:([\s\S]*)IMPRESSION:/i);
//     const impressionMatch = plainText.match(/IMPRESSION:([\s\S]*)/i);

//     if (!findingsMatch || !impressionMatch) {
//       setActiveAlert(prev => (prev?.type === 'inconsistency' ? null : prev));
//       return;
//     }

//     const findingsText = findingsMatch[1].trim();
//     const impressionText = impressionMatch[1].trim();

//     if (!findingsText || !impressionText) {
//       setActiveAlert(prev => (prev?.type === 'inconsistency' ? null : prev));
//       return;
//     }

//     const prompt = `
//       You are a meticulous radiological assistant. Compare the significant clinical findings in the FINDINGS section with the conclusions in the IMPRESSION section. Identify any major findings that are mentioned in one section but are missing from the other.
      
//       FINDINGS:
//       ---
//       ${findingsText}
//       ---

//       IMPRESSION:
//       ---
//       ${impressionText}
//       ---

//       If you find a discrepancy, respond with a JSON object: {"isInconsistent": true, "message": "A clear explanation of the inconsistency.", "suggestedCorrection": "The exact text to add to the impression."}.
//       For example: {"isInconsistent": true, "message": "'Grade I fatty liver' is mentioned in the findings but is missing from the impression.", "suggestedCorrection": "Grade I fatty liver."}.
//       If the sections are consistent, respond with {"isInconsistent": false, "message": null, "suggestedCorrection": null}.
//     `;

//     try {
//       const payload = {
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//         generationConfig: { responseMimeType: "application/json" }
//       };
//       const model = 'gemini-2.5-flash';
//       const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//       const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//       if (!response.ok) return;

//       const result = await response.json();
//       const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

//       if (textResult) {
//         const parsed = JSON.parse(textResult);
//         if (parsed.isInconsistent && parsed.suggestedCorrection) {
//           setActiveAlert({ type: 'inconsistency', message: parsed.message });
//           setCorrectionSuggestion(parsed.suggestedCorrection);
//           setIsAwaitingAlertAcknowledge(true);
//         } else {
//           setActiveAlert(prev => (prev?.type === 'inconsistency' ? null : prev));
//           setCorrectionSuggestion(null);
//         }
//       }
//     } catch (err) {
//       console.error("Inconsistency check failed:", err);
//     }
//   }, [isAwaitingAlertAcknowledge]);

//   //  const debouncedInconsistencyCheck = useCallback((text) => {
//   //   if (inconsistencyCheckTimeoutRef.current) clearTimeout(inconsistencyCheckTimeoutRef.current);
//   //   inconsistencyCheckTimeoutRef.current = setTimeout(() => {
//   //     if (!awaitingRef.current && text.trim().length > 50) {
//   //       runInconsistencyCheck(text);
//   //     } else if (!awaitingRef.current) {
//   //       setActiveAlert(null);
//   //     }
//   //   }, 2000);
//   // }, []);

//   // const debouncedCriticalCheck = useCallback((text) => {
//   //   if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
//   //   debounceTimeoutRef.current = setTimeout(() => {
//   //     if (!awaitingRef.current && text.trim() !== '') {
//   //       checkForCriticalFindings(text);
//   //     } else if (!awaitingRef.current) {
//   //       setActiveAlert(null);
//   //     }
//   //   }, 1000);
//   // }, []); // Empty array means this function is created only once.

  
   

 
//   // --- NEW FUNCTION: findMissingMeasurements ---
//   const findMissingMeasurements = () => {
//     if (!editor) return [];
//     const editorText = editor.getText();
//     const originalTemplateHtml = templates[modality]?.[template] || '';

//     // Condition 1: Check for leftover "__" placeholders.
//     const hasPlaceholders = /__/.test(editorText);

//     // Condition 2: Check for keywords like "measures", "size", etc., that are NOT followed by a number.
//     // This looks for the keyword, then optional whitespace, then something that isn't a digit or a period.
//     const hasKeywordsMissingValues = /(measures |size |measuring|spans )\s*(?![0-9.])/i.test(editorText);

//     // If neither condition is met, the report is likely complete.
//     if (!hasPlaceholders && !hasKeywordsMissingValues) {
//       return [];
//     }

//     const missingFields = new Set();

//     // If placeholders are found, try to identify which ones by checking the original template.
//     if (hasPlaceholders && originalTemplateHtml) {
//       // This regex finds text that precedes a placeholder in the original template.
//       const contextRegex = /([\w\s\d()\/.-]+?)\s*__/g;
//       const templateText = htmlToText(originalTemplateHtml);
//       let match;

//       while ((match = contextRegex.exec(templateText)) !== null) {
//         const context = match[1].trim();
//         if (!context) continue;

//         // The label is the most meaningful part of the context, usually the last few words.
//         const label = context.split('\n').pop().replace(/:$/, '').trim();

//         // Check if this specific placeholder is still present in the current editor text.
//         const searchRegex = new RegExp(escapeRegex(context) + "\\s*__");
//         if (searchRegex.test(editorText)) {
//           missingFields.add(`'${label}'`);
//         }
//       }
//     }
    
//     // If we detected keywords without values, add a generic warning.
//     if (hasKeywordsMissingValues) {
//       missingFields.add("A value after a term like 'measures' or 'size'");
//     }

//     // If we only found placeholders but couldn't identify them, add a generic message.
//     if (missingFields.size === 0 && hasPlaceholders) {
//       missingFields.add("An unidentified measurement ('__')");
//     }

//     return Array.from(missingFields);
//   };
//   const extractStructuredData = async (text) => {
//     if (isRestricted) return;
//     setIsExtracting(true);
//     const prompt = `
//       Act as a clinical data extraction tool. Analyze the following radiology report text and extract key structured data points like organ names, specific measurements, laterality (left/right), and key pathological findings.
//       Return the data as a single, valid JSON object. Do not include any explanatory text, comments, or markdown formatting.
//       The keys of the JSON object should be the name of the data point (e.g., "Liver Size", "Right Kidney Finding").
//       The values should be the extracted data (e.g., "16.5 cm", "Normal").
//       If a piece of information isn't present, omit its key. Be concise.

//       Text to analyze:
//       ---
//       ${text}
//       ---
//     `;
//     try {
//       const payload = {
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//         generationConfig: {
//           responseMimeType: "application/json",
//         }
//       };
//       const model = 'gemini-2.5-flash';
//       const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
      
//       if (!response.ok) {
//         throw new Error(`API Error: ${response.status} ${response.statusText}`);
//       }
      
//       const result = await response.json();
//       const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

//       if (textResult) {
//         const parsedJson = JSON.parse(textResult);
//         setStructuredData(parsedJson);
//       } else {
//         setStructuredData({});
//       }
//     } catch (err) {
//       console.error("Failed to extract structured data:", err);
//       setStructuredData({});
//     } finally {
//       setIsExtracting(false);
//     }
//   };


//   const getCorrectedTranscript = async (transcript) => {
//     const prompt = `You are an expert medical transcriptionist. Correct any spelling or grammatical errors in the following text, paying close attention to radiological and medical terminology. Return only the corrected text. Text to correct: '${transcript}'`;
//     try {
//       const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
//       const model = 'gemini-2.5-flash';
//       const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//       const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//       if (!response.ok) {
//         console.error("API Error, falling back to original transcript");
//         return transcript; // Fallback
//       }
//       const result = await response.json();
//       const correctedText = result.candidates?.[0]?.content.parts?.[0]?.text;
//       return correctedText || transcript;
//     } catch (error) {
//       console.error("Failed to get corrected transcript:", error);
//       return transcript; // Fallback
//     }
//   };

//   const handleToggleListening = useCallback(() => {
//     if (!recognitionRef.current) {
//       setError("Voice dictation is not supported by your browser.");
//       return;
//     }
//     const currentStatus = voiceStatusRef.current;
//     if (currentStatus !== 'idle') {
//       recognitionRef.current.stop();
//     } else {
//       recognitionRef.current.start();
//     }
//   }, []);

//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       recognitionRef.current = new SpeechRecognition();
//       const recognition = recognitionRef.current;
//       recognition.continuous = true;
//       recognition.interimResults = true;

//       recognition.onstart = () => {
//         setVoiceStatus('listening');
//       };

//       recognition.onresult = async (event) => {
//         let finalTranscript = '';
//         let currentInterim = '';
//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           if (event.results[i].isFinal) {
//             finalTranscript += event.results[i][0].transcript.trim();
//           } else {
//             currentInterim += event.results[i][0].transcript;
//           }
//         }
//         setInterimTranscript(currentInterim);

//         if (finalTranscript) {
//           isProgrammaticUpdate.current = true;
//           await handleVoiceCommand(finalTranscript);
//           setInterimTranscript('');
//         }
//       };

//       recognition.onend = () => {
//         setVoiceStatus('idle');
//         setInterimTranscript('');
//       };

//       recognition.onerror = (event) => {
//         console.error("Speech recognition error", event.error);
//         setError(`Speech recognition error: ${event.error}`);
//         setVoiceStatus('idle');
//       };
//     } else {
//       setIsDictationSupported(false);
//       setError("Voice dictation is not supported by your browser.");
//     }

//     return () => {
//       if(recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     }
//   }, []); // This empty array is the source of the stale state, but we fix it with the ref.

//   const handleVoiceCommand = async (command) => {
//     if (!editor || !command) return;
//     const commandLC = command.toLowerCase().trim();

//     const aiSearchKeyword = "look up";
//     const commandKeyword = "command";
//     const macroKeyword = "macro";

//     if (commandLC.startsWith(aiSearchKeyword)) {
//       const query = commandLC.substring(aiSearchKeyword.length).trim();
//       if (query) {
//         await handleAiKnowledgeSearch(true, query);
//       }
//       return; // Exit after handling
//     }

//     if (commandLC.startsWith(macroKeyword)) {
//       const macroPhrase = commandLC.substring(macroKeyword.length).trim().replace(/[.,?]/g, '');
//       const macro = macrosRef.current.find(m => macroPhrase === m.command.toLowerCase().trim().replace(/[.,?]/g, ''));
//       if (macro) {
//         isProgrammaticUpdate.current = true;
//         editor.chain().focus().insertContent(macro.text).run();
//       } else {
//         console.warn(`Macro not found for: "${macroPhrase}"`);
//       }
//       return;
//     }

//     if (commandLC.startsWith(commandKeyword)) {
//       const action = commandLC.substring(commandKeyword.length).trim().replace(/[.,?]/g, '');

//       if (action === "analyze images") {
//         analyzeImages();
//       } else if (action === "download report") {
//         const reportHtml = await generateFinalReport(); // Await the async function
//         if (reportHtml) {
//           downloadPdfReport(reportHtml);
//         }
//       } else if (action.startsWith("search for")) {
//         const searchTerm = action.substring("search for".length).trim();
//         setSearchQuery(searchTerm);
//         setTimeout(() => {
//           if(searchButtonRef.current) {
//             searchButtonRef.current.click();
//           }
//         }, 100);
//       } else if (action.startsWith("insert result")) {
//         const numberWords = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5 };
//         const resultNumStr = action.substring("insert result".length).trim();
//         const resultNum = numberWords[resultNumStr] || parseInt(resultNumStr, 10);
        
//         const { localSearchResults, allAiSearchResults, currentAiPage } = searchResultsRef.current;
//         const combinedResults = [...localSearchResults, ...(allAiSearchResults[currentAiPage] || [])];
        
//         if (!isNaN(resultNum) && resultNum > 0 && resultNum <= combinedResults.length) {
//           isProgrammaticUpdate.current = true;
//           insertFindings(combinedResults[resultNum - 1]);
//         } else {
//           console.warn(`Invalid result number for insertion: ${resultNumStr}`);
//         }
//       }
//       else if (action.includes("delete last sentence")) {
//         const content = editor.state.doc.textContent;
//         const sentences = content.trim().split(/(?<=[.?!])\s+/);
//         if (sentences.length > 0) {
//           const lastSentence = sentences[sentences.length - 1];
//           const startOfLastSentence = content.lastIndexOf(lastSentence);
//           if (startOfLastSentence !== -1) {
//             const endOfLastSentence = startOfLastSentence + lastSentence.length;
//             isProgrammaticUpdate.current = true;
//             editor.chain().focus().deleteRange({ from: startOfLastSentence, to: endOfLastSentence }).run();
//           }
//         }
//       } else if (action.includes("bold last sentence") || action.includes("bold the last sentence")) {
//         const content = editor.state.doc.textContent;
//         const sentences = content.trim().split(/(?<=[.?!])\s+/);
//           if (sentences.length > 0) {
//             const lastSentence = sentences[sentences.length - 1];
//             const startOfLastSentence = content.lastIndexOf(lastSentence);
//               if (startOfLastSentence !== -1) {
//                 const endOfLastSentence = startOfLastSentence + lastSentence.length;
//                 isProgrammaticUpdate.current = true;
//                 editor.chain().focus().setTextSelection({ from: startOfLastSentence, to: endOfLastSentence }).toggleBold().run();
//               }
//           }
//       }
//       return;
//     }
    
//     const correctedText = await getCorrectedTranscript(command);
//     isProgrammaticUpdate.current = true;
//     editor.chain().focus().insertContent(correctedText + ' ').run();
//   };

//   const fileToImageObject = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64 = reader.result.split(',')[1];
//         const src = URL.createObjectURL(file);
//         resolve({ src, base64, name: file.name, type: file.type, file }); // Store original file for dicom loader
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   }
  
//     const onDrop = useCallback(async (acceptedFiles, _, event) => {
//     let filesToProcess = [...acceptedFiles];

//     // If no files were accepted directly, try to parse the data transfer object
//     // This handles cases like dragging from a native app that provides HTML or raw image data
//     if (acceptedFiles.length === 0 && event.dataTransfer) {
//       const droppedItems = await Promise.all(
//         Array.from(event.dataTransfer.items).map(async (item) => {
//           if (item.type.startsWith('image/')) {
//             return item.getAsFile();
//           }
//           if (item.type === 'text/html') {
//             const html = await new Promise(resolve => item.getAsString(resolve));
//             const tempDiv = document.createElement('div');
//             tempDiv.innerHTML = html;
//             const img = tempDiv.querySelector('img');
//             if (img && img.src) {
//               // Handle base64 data URIs
//               if (img.src.startsWith('data:')) {
//                 const response = await fetch(img.src);
//                 const blob = await response.blob();
//                 return new File([blob], 'pasted-image.png', { type: blob.type });
//               }
//               // Note: file:/// URIs cannot be accessed due to browser security.
//               // We can't fix this case, but we handle base64 which is common.
//             }
//           }
//           return null;
//         })
//       );
//       filesToProcess.push(...droppedItems.filter(Boolean));
//     }

//     if (filesToProcess.length > 0) {
//       try {
//         const newImageObjects = await Promise.all(filesToProcess.map(file => fileToImageObject(file)));
//         setImages(prevImages => [...prevImages, ...newImageObjects]);
//         if (newImageObjects.length > 0 && !selectedImage) {
//             setSelectedImage(newImageObjects[0]);
//         }
//       } catch (error) {
//         console.error("Error processing dropped files:", error);
//         toast.error("Could not process one or more of the dropped items.");
//       }
//     }
//   }, [selectedImage]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': ['.png', '.jpeg', '.jpg', '.dcm'], 'application/dicom': ['.dcm'] } });


//   const handleSelectRecentReport = (report) => {
//     // This function extracts the main body of the report, skipping the patient header
//     const bodyMatch = report.reportHTML.match(/<\/table>\s*<\/div>([\s\S]*)/);
//     const reportBody = bodyMatch ? bodyMatch[1].trim() : report.reportHTML;

//     setPatientName(report.patientName);
//     setExamDate(report.examDate);
//     // You can add other fields here if you save them to Firestore

//     if (editor) {
//       isProgrammaticUpdate.current = true;
//       console.error('%c CULPRIT FOUND:', 'color: red; font-weight: bold;', 'This piece of code is overwriting the editor content!');
//       editor.commands.setContent(reportBody);
//       setUserFindings(reportBody); // Also update the state
//     }
//     toast.success(`Loaded report for ${report.patientName}`);
//   };

//   const removeImage = (indexToRemove) => {
//     setImages(currentImages => {
//         const newImages = currentImages.filter((_, index) => index !== indexToRemove);
//         if (selectedImage && currentImages[indexToRemove]?.src === selectedImage.src) {
//             setSelectedImage(newImages.length > 0 ? newImages[0] : null);
//         }
//         return newImages;
//     });
//   };

  

//    const analyzeImages = async () => {
//         console.log('AnalyzeImages....1859')

//     if (images.length === 0) {
//       setError("Please upload one or more images first.");
//       return;
//     }
//     setIsAiLoading(true);
//     setAiAnalysisStatus('Analyzing images...');
//     setError(null);
//     setAiMeasurements([]);
//     setActiveAlert(null);
//     setCorrectionSuggestion(null);


    
//   //   const prompt = `
//   //  You are a highly observant, knowledgable and one of the most experienced Senior Radiologist and Cardiologist specialized in the analysis of medical imaging with an experience of 20+ years on studies like Ultrasound, X-Ray, MRI, CT, 2d-Echo, 3d-Echo, ECG, etc .
//   //   Given one or more medical images and optional clinical context, you must analyze the content and return a single, valid JSON object.
//   //   The root of this object must contain the following keys: "analysisReport", "measurements", and "criticalFinding".

//   //   1. "analysisReport" (String): A comprehensive, human-readable narrative report describing the findings and impressions, formatted as an HTML string with <p> and <strong> tags.**Note: Impression should provide brief info about the finding not repeat the same thing (for example for this finding:'Two well defined hyperechoic lesions are noted in the subcutaneous plane of anterior abdominal wall in left hypochondria region with no e/o vascularity on applying colour doppler likely to be lipoma, largest measuring 2.1 x 0.8 x 1.1 cm' , The Impression should be :•	'Anterior Abdomial wall lipoma.')
//   //   2. "measurements" (Array of Objects): An array for all identifiable and measurable findings. If none, return an empty array []. Each object must contain:
//   //    - "finding" (String): A concise description of the object being measured (e.g., "Right Kidney", "Aortic Diameter", "Pulmonary Nodule in Left Upper Lobe").
//   //    - "value" (String): The measurement value with units (e.g., "10.2 x 4.5 cm", "4.1 cm", "8 mm").
//   //   3. "criticalFinding" (Object or Null): An object for actionable critical findings. If none, this MUST be null. If a critical finding is detected, the object MUST contain:
//   //    - "findingName" (String): The specific name of the critical finding (e.g., "Aortic Dissection").
//   //    - "reportMacro" (String): A pre-defined sentence for the report (e.g., "CRITICAL FINDING: Acute aortic dissection is identified.").
//   //    - "notificationTemplate" (String): A pre-populated message for communication (e.g., "URGENT: Critical finding on Patient [Patient Name/ID]. CT shows acute aortic dissection...").
        
//   //      **Please remove this for reference only** Clinical Context: "${clinicalContext || 'None'}"
//   //      OR If Given one or more images of the ready-to-print report then :
//   //     1.  **Extract Text**: Accurately extract all text from the provided image(s) to form a complete report.
//   //     2.  **Analyze for Inconsistencies**:
//   //     * Review the "body" of the report which contains all the findings to identify all significant radiological findings.
//   //     * Compare these findings with the "IMPRESSION" section.
//   //     * If a significant finding from the body is missing from the impression (e.g., "fatty liver" is in findings but not impression), or if the significant finding present in the impression is missing in the body of the report that contains all the findings,  identify it.
//   //     3.  **Generate Correction and Alert**:
//   //     * If an inconsistency is found, create a 'suggestedCorrection' string. This should be the exact text to add to the impression (e.g., "Grade I fatty liver.").
//   //     * Also create a concise 'inconsistencyAlert' message explaining the issue (e.g., "'Grade I fatty liver' was found but is missing from the impression.").

//   //      Return a single JSON object with the following keys. Do not include any other text or markdown.
//   //      * 'analysisReport': The **original, uncorrected** report text, extracted from the image, as an HTML string.
//   //      * 'measurements': An array of any measurements found (or an empty array if none).
//   //      * 'criticalFinding': An object for any critical findings (or null if none).
//   //      * 'inconsistencyAlert': A string explaining the inconsistency, or null if none was found.
//   //      * 'suggestedCorrection': The string to be added to the impression to fix the issue, or null if none is needed.

    
//   //   **Your Response MUST be a single, valid JSON object following one of these two schemas:**

//   //   ---
//   //   **Schema 1: High-Confidence Analysis (Default)**
//   //   {
//   //     "analysisSuccessful": true,
//   //     "analysisReport": "string (The full report, formatted as an HTML string with <p> and <strong> tags.)",
//   //     "measurements": [{ "finding": "string", "value": "string" }],
//   //     "criticalFinding": { "findingName": "string", "reportMacro": "string", "notificationTemplate": "string" } | null
//   //   }
//   //   ---
//   //   **Schema 2: Clarification Needed**
//   //   {
//   //     "analysisSuccessful": false,
//   //     "clarificationNeeded": true,
//   //     "questionForDoctor": "string (Your specific, concise question for the doctor.)"
//   //   }
//   //   ---
    
//   //   Clinical Context: "${clinicalContext || 'None'}"
//   //   `;

//    const prompt = `You are a highly observant, knowledgeable, and experienced Senior Radiologist and Cardiologist with over 20 years of experience in analyzing medical imaging studies (Ultrasound, X-Ray, MRI, CT, Echo, ECG, etc.). Your primary goal is to assist in radiology reporting by analyzing medical images and generating accurate, consistent, and structured reports.

// You MUST always respond with a single, valid JSON object.

// ### Core Workflow

// First, determine the nature of the input image(s) and follow the appropriate workflow:
// * If the input is a medical scan: Follow the **"Workflow A: Template-First Reporting"**.
// * If the input is an image of a pre-existing typed report: Follow the **"Workflow B: Report Inconsistency Check"**.

// ---

// ### Workflow A: Template-First Reporting (Default for Scans)

// Your goal is to ensure consistency by using pre-defined templates.

// **1. Context: Available Templates**
// You have access to the following HTML report templates. The key for each template is the name of the body part.

// \`\`\`json
// {
//   "Abdomen": "<h3>IMPRESSION:</h3><p>1. No sonographic evidence of significant abnormality in the upper abdomen.</p><h3>FINDINGS:</h3><p><strong>LIVER:</strong> Normal in size (spans __ cm), contour, and echotexture...</p>",
//   "Pelvis": "<h3>IMPRESSION:</h3><p>1. Unremarkable ultrasound of the pelvis.</p><h3>FINDINGS:</h3><p><strong>URINARY BLADDER:</strong> Adequately distended, with a normal wall thickness...</p>",
//   "Abdomen and Pelvis" : "<p><strong>LIVER:</strong> The liver is normal in size _cm, shape & echotexture. Hepatic veins and intrahepatic portal vein radicles are normal in size and distribution. No focal solid or cystic mass lesion is noted.</p>
//       <p><strong>GALL BLADDER:</strong> Gall bladder appeared normal. No mural mass or calculus is noted.</p>
//       <p><strong>CBD:</strong> Common bile duct appeared normal. No calculi seen in the common bile duct.</p>
//       <p><strong>PANCREAS:</strong> Is normal in shape size and echotexture. No focal lesion seen.</p>
//       <p><strong>SPLEEN:</strong> Spleen is normal in size _cm, shape and echotexture. No focal lesion is seen.</p>
//       <p><strong>KIDNEYS:</strong> Right kidney measures _ x _ x _cm with parenchymal thickness _cm and Left kidney measures _ x _ x _cm with parenchymal thickness _cm. Both kidneys are normal in size, shape, position, echogenicity and echotexture. Normal corticomedullary differentiation is noted. Pelvicalyceal systems on both sides are normal.</p>
//       <p><strong>URETERS:</strong> Visualized portions of both ureters are not dilated. No calculus is seen in the portions of ureters which can be seen by sonography.</p>
//       <p><strong>URINARY BLADDER:</strong> The urinary bladder shows physiological distention. No calculus or mass lesion is seen.</p>
//       <p><strong>PROSTATE:</strong> The prostate is normal in shape, position, echogenicity and echotexture. There is no focal solid or cystic mass lesion in it.</p>
//       <p><strong>OTHER:</strong> Visualized portions of IVC and Aorta are grossly normal. There is no free or loculated fluid collection in abdomen or pelvis. No significant lymphadenopathy is noted.</p>
//       <br>
//       <p><strong>IMPRESSION:</strong></p>
//       <p>• No significant abnormality is seen.</p>"
//   "//": "Add other user-defined templates here"
// }
// \`\`\`

// **2. Rules for Template-First Reporting**
//    1.  **Analyze and Match:** Analyze the medical image(s) to identify the primary body part. Match this to one of the available templates.
//    2.  **Adopt & Fill Template:** If a matching template is found, you **MUST** use its exact HTML structure as the base. Analyze the images for findings and measurements, and intelligently insert them into the appropriate sections or placeholders (\`__\`) of the template. This filled-in template becomes the value for the "analysisReport" key in your final JSON output.
//    3.  **Handle Exceptions:**
//        * **No Template Found:** If, and **ONLY** if, no matching template is found, you are then permitted to generate a new, comprehensive narrative report from scratch. This becomes the "analysisReport".
//        * **User Override:** If the user's request explicitly contains phrases like "generate a different version," you may ignore the templates and generate a new narrative report.

// ---

// ### Workflow B: Report Inconsistency Check (For Images of Reports)

// Your goal is to act as a quality control assistant.

// **Rules for Inconsistency Check**
// 1.  **Extract Text:** Accurately extract all text from the provided image(s) to form a complete report. This will be the value for "analysisReport".
// 2.  **Analyze for Inconsistencies:** Review the "FINDINGS" section to identify all significant radiological findings. Compare these with the "IMPRESSION" section. Identify any major discrepancies (e.g., a finding mentioned in one section but absent in the other).
// 3.  **Generate Correction & Alert:** If an inconsistency is found, create a \`suggestedCorrection\` string (the exact text to add to the impression) and a concise \`inconsistencyAlert\` message explaining the issue. If none is found, these keys should be \`null\`.

// ---

// ### User-Provided Input

// You will be given the medical images and the following clinical context provided by the doctor:
// **Clinical Context: "\${clinicalContext || 'None'}"**

// ---

// ### Final JSON Output Specification

// Regardless of the workflow used, your final output **MUST** be a single, valid JSON object. Combine the results of your analysis into one of the following schemas.

// **Schema 1: Successful Analysis (From Workflow A or B)**
// \`\`\`json
// {
//   "analysisSuccessful": true,
//   "analysisReport": "string (The full report, either generated or extracted, as an HTML string.)",
//   "measurements": [{ "finding": "string", "value": "string" }] | [],
//   "criticalFinding": { "findingName": "string", "reportMacro": "string", "notificationTemplate": "string" } | null,
//   "inconsistencyAlert": "string" | null,
//   "suggestedCorrection": "string" | null
// }
// \`\`\`

// **Schema 2: Clarification Needed (Fallback for Workflow A)**
// \`\`\`json
// {
//   "analysisSuccessful": false,
//   "clarificationNeeded": true,
//   "questionForDoctor": "string (Your specific, concise question for the doctor.)"
// }
// \`\`\`

// **Key Definitions:**
// * **\`analysisReport\`**: A comprehensive HTML report. **Note for Impression:** The impression should provide brief info about the finding, not repeat the entire finding text (e.g., for '...hyperechoic lesion...likely lipoma...', the Impression should be 'Anterior abdominal wall lipoma.').
// * **\`measurements\`**: An array of all measurable findings. Empty \`[]\` if none.
// * **\`criticalFinding\`**: An object for actionable critical findings. **MUST** be \`null\` if none are detected.
// * **\`inconsistencyAlert\` / \`suggestedCorrection\`**: **ONLY** used for Workflow B. They **MUST** be \`null\` when analyzing medical scans (Workflow A).
// `;

//     try {
//       setAiAnalysisStatus('Processing images...');
//       const imageParts = [];
//       for (const image of images) {
//         try {
//           let base64Data = image.base64;
//           let mimeType = image.type;

//           if (!base64Data && !image.file) {
//             console.warn(`Skipping image with no data: ${image.name}`);
//             continue;
//           }
          
//           if (image.type === 'application/dicom' || image.name.toLowerCase().endsWith('.dcm')) {
//             if (!image.file) {
//                 console.warn(`Skipping DICOM with no file object: ${image.name}`);
//                 continue;
//             }
//             base64Data = await convertDicomToPngBase64(image.file);
//             mimeType = 'image/png';
//           }

//           if (!base64Data) {
//             console.warn(`Skipping image after failed processing: ${image.name}`);
//             continue;
//           }

//           imageParts.push({
//             inlineData: {
//               mimeType: mimeType,
//               data: base64Data,
//             },
//           });
//         } catch (procError) {
//           console.error(`Could not process image ${image.name}:`, procError);
//           toast.error(`Failed to process image: ${image.name}`);
//         }
//       }

//       if (imageParts.length === 0) {
//         throw new Error("No images could be processed for analysis.");
//       }
      
//       setAiAnalysisStatus('Sending to AI...');

//       const payload = {
//         contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] }],
//         generationConfig: { responseMimeType: "application/json" }
//       };

//       const model = 'gemini-2.5-flash';
//       const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//       const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      
//       if (!response.ok) {
//         const errorBody = await response.text();
//         console.error("API Error Response:", errorBody);
//         throw new Error(`API Error: ${response.status} ${response.statusText}`);
//       }

//       const result = await response.json();

//       // --- NEW, CRUCIAL DEBUGGING STEP ---
//       console.log("RAW API RESPONSE:", JSON.stringify(result, null, 2));

//       // --- NEW, MORE ROBUST CHECK ---
//       if (!result.candidates || result.candidates.length === 0) {
//         let reason = "The AI returned an empty response.";
//         if (result.promptFeedback?.blockReason) {
//             reason = `The request was blocked. Reason: ${result.promptFeedback.blockReason}.`;
//         } else if (result.candidates?.[0]?.finishReason === 'SAFETY') {
//             reason = "The response was blocked by safety filters.";
//         }
//         throw new Error(reason + " Please check your input or adjust safety settings in your Google AI project.");
//       }
      
//       const textResult = result.candidates[0]?.content?.parts?.[0]?.text;

//       if (textResult) {
//         const parsedResult = JSON.parse(textResult);
//         if (parsedResult.analysisSuccessful) {
//           if (parsedResult.analysisReport) { // Check if the key exists
//           setEditorContent(parsedResult.analysisReport); // SET THE STATE HERE
//                    console.log('%c AI ANALYSIS:', 'color: green; font-weight: bold;', 'Setting editor content.');
//           toastDone('AI analysis complete');
          
//         }
//           //         if (parsedResult.analysisReport && editor) {
//           //   editor.commands.setContent(parsedResult.analysisReport);
//           // }

//           if (parsedResult.measurements) {
//             setAiMeasurements(parsedResult.measurements);
//           }
//           const openingMessage = {
//             sender: 'ai',
//             text: 'Analysis complete. The report has been drafted. Ask any follow-up questions.'
//           };
//           setConversationHistory([openingMessage]);
//           setIsConversationActive(true);
//           toastDone('AI analysis complete');
//         } else if (parsedResult.clarificationNeeded) {
//           const clarificationMessage = { sender: 'ai', text: parsedResult.questionForDoctor };
//           setConversationHistory([clarificationMessage]);
//           setIsConversationActive(true);
//           toast.info('AI needs clarification.', { icon: '🤔' });
//         }
//         if (parsedResult.criticalFinding) {
//           setActiveAlert({ type: 'critical', data: parsedResult.criticalFinding });
//           setIsAwaitingAlertAcknowledge(true);
//         }
//       } else {
//         throw new Error("AI response was received, but it was empty or in an unexpected format.");
//       }
//     } catch (err) {
//       setError(`Failed to analyze images. ${err.message}`);
//       console.error(err);
//     } finally {
//       setIsAiLoading(false);
//       setAiAnalysisStatus('');
//     }
//   };

  
//   const handleSearch = () => {
//       if (!searchQuery) {
//           setError("Please enter a search term.");
//           return;
//       }
//       setError(null);
      
//       const query = searchQuery.toLowerCase().trim();
//       const results = localFindings.filter(finding =>
//           finding.organ.toLowerCase().includes(query) ||
//           finding.findingName.toLowerCase().includes(query)
//       );
//       setLocalSearchResults(results);

//       setAllAiSearchResults([]);
//       setCurrentAiPage(0);
//       setAllAiFullReports([]);
//       setCurrentReportPage(0);
//       setAiKnowledgeLookupResult(null);
      
//       setBaseSearchQuery(searchQuery);
//   };
  
//   const handleAiFindingsSearch = async (isMoreQuery = false) => {
//     // if (isRestricted) {
//     //    toast.error("Please upgrade to a professional plan to use AI search.");
//     //    return;
//     // }
//     if (!baseSearchQuery) {
//       setError("Please perform a standard search first.");
//       return;
//     }
//     setIsSearching(true);
//     setError(null);
//     setAiKnowledgeLookupResult(null); // Clear knowledge results

//     const currentQuery = isMoreQuery ? `${baseSearchQuery} some more` : baseSearchQuery;
//     const existingFindingNames = allAiSearchResults.flat().map(r => r.findingName);
//     const existingReportText = allAiFullReports.map(r => r.fullReportText).join('\n\n---\n\n');
//     const isReportContext = allAiFullReports.length > 0;

//     const prompt = `
//       You are an AI assistant for radiologists, focused on generating report content. Analyze the user's search query: "${currentQuery}".
//       Your task is to generate content for a medical report. Determine the query's intent from the following options:
//       1.  A request to generate a **Full Report** from a descriptive sentence (e.g., "USG report for an ankle with mild thickening of ATFL").
//       2.  A request for a list of **General Findings** related to an organ or system (e.g., "liver findings", "carotid disease").
//       3.  A request for a **Specific Finding** to be inserted into a report (e.g., "Grade I fatty liver").

//       Based on the determined intent, you MUST respond with a single, valid JSON object using ONE of the following schemas.

//       ---
//       **SCHEMA 1: Full Report**
//       ${isMoreQuery && existingReportText ? `You have already generated the following report(s). Please provide a different version or variation, avoiding repetition: \n\n${existingReportText}` : ''}
//       {
//         "queryType": "fullReport",
//         "modality": "string",
//         "template": "string",
//         "fullReportText": "string (The full report text, formatted as a single HTML string with appropriate <p> and <strong> tags for structure and readability.)"
//       }

//       ---
//       **SCHEMA 2: General or Specific Findings**
//       ${isMoreQuery && existingFindingNames.length > 0 ? `Exclude these findings if possible: ${JSON.stringify(existingFindingNames)}.` : ''}
//       {
//         "queryType": "generalFindings",
//         "results": [
//           {
//             "findingName": "string",
//             "organ": "string",
//             "findings": "string",
//             "impression": "string"
//           }
//         ]
//       }
//     `;

//     try {
//       const payload = {
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//         generationConfig: { responseMimeType: "application/json" }
//       };
//       const model = 'gemini-2.5-flash';
//       const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
//       const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      
//       if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

//       const result = await response.json();
//       if (result.candidates?.[0]?.content.parts?.[0]?.text) {
//         const textResult = result.candidates[0].content.parts[0].text;
        
//         try {
//           const parsedResult = JSON.parse(textResult);

//           if (parsedResult.queryType === 'fullReport' && parsedResult.fullReportText) {
//             setAllAiFullReports(prev => [...prev, parsedResult]);
//             setCurrentReportPage(allAiFullReports.length);
//             if (!isReportContext) {
//               setAllAiSearchResults([]);
//               setLocalSearchResults([]);
//             }
//           } else if (parsedResult.results) {
//             if (isReportContext) {
//               setError("AI returned findings when a new report version was expected. Please try again.");
//             } else {
//               setAllAiSearchResults(prev => [...prev, parsedResult.results]);
//               setCurrentAiPage(allAiSearchResults.length);
//               if (allAiSearchResults.length === 0) {
//                 setAllAiFullReports([]);
//               }
//             }
//           } else {
//             setError("The AI returned a response with an unexpected format.");
//           }

//         } catch (jsonError) {
//           console.error("JSON Parsing Error:", jsonError, "Raw Text:", textResult);
//           setError("The AI returned a non-standard response. Please try rephrasing your query.");
//         }
//       } else {
//         throw new Error("Search failed.");
//       }
//     } catch (err) {
//       setError("Failed to perform search. " + err.message);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handleAiKnowledgeSearch = async (isProactive = false, queryOverride = '') => {
//       // if (isRestricted) {
//       //    toast.error("Please upgrade to a professional plan to use AI knowledge search.");
//       //    return;
//       // }
//       const query = isProactive ? queryOverride : baseSearchQuery;
//       if (!query) {
//           setError("Please enter a search term first.");
//           return;
//       }
//       setIsSearching(true);
//       setError(null);
//       // Clear other search results
//       setAllAiSearchResults([]);
//       setAllAiFullReports([]);
//       setLocalSearchResults([]);

//       const prompt = `
//         You are a master medical AI. Your sole task is to provide a knowledge lookup on a specific medical condition.
//         The user wants to know about: "${query}".
        
//         Perform a lookup using authoritative sources (like Radiopaedia, PubMed, StatPearls) and return a single, valid JSON object with this EXACT schema:
//         {
//           "queryType": "knowledgeLookup",
//           "conditionName": "string (The name of the condition)",
//           "summary": "string (HTML-formatted explanation of the condition, its pathophysiology, and clinical significance)",
//           "keyImagingFeatures": ["string (HTML-formatted list item)", "string"],
//           "differentialDiagnosis": ["string", "string"],
//           "sources": [{ "name": "string", "url": "string" }]
//         }
        
//         Do not generate report findings. Your only job is to provide factual, educational information based on the requested condition.
//       `;

//       try {
//           const payload = {
//               contents: [{ role: "user", parts: [{ text: prompt }] }],
//               generationConfig: { responseMimeType: "application/json" }
//           };
//           const model = 'gemini-2.5-flash';
//           const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
//           const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//           const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

//           if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

//           const result = await response.json();
//           if (result.candidates?.[0]?.content.parts?.[0]?.text) {
//               const textResult = result.candidates[0].content.parts[0].text;
//               try {
//                   const parsedResult = JSON.parse(textResult);
//                   if (parsedResult.queryType === 'knowledgeLookup') {
//                       setAiKnowledgeLookupResult(parsedResult);
//                   } else {
//                       setError("The AI returned an unexpected response type for a knowledge search.");
//                   }
//               } catch (jsonError) {
//                   console.error("JSON Parsing Error:", jsonError, "Raw Text:", textResult);
//                   setError("The AI returned a non-standard response for the knowledge search.");
//               }
//           } else {
//               throw new Error("Knowledge search failed.");
//           }
//       } catch (err) {
//           setError("Failed to perform knowledge search. " + err.message);
//       } finally {
//           setIsSearching(false);
//       }
//   };


//   // --- UPDATED FUNCTION: checkForCriticalFindings ---
//   const checkForCriticalFindings = useCallback(async (plainTextFindings) => {
//     if (isAwaitingAlertAcknowledge) return;
//     const prompt = `
//       Act as a vigilant radiologist. Analyze the following report text for critical, urgent, or unexpected findings that require immediate attention (e.g., pneumothorax, aortic dissection, acute hemorrhage, large vessel occlusion).

//       If a critical finding is detected, respond with a JSON object containing the full critical finding details.
//       If no critical finding is detected, respond with a JSON object where "criticalFinding" is null.

//       The JSON object MUST follow this exact schema:
//       {
//         "criticalFinding": {
//           "findingName": "string",
//           "reportMacro": "string",
//           "notificationTemplate": "string"
//         } | null
//       }

//       Report Text:
//       ---
//       ${plainTextFindings}
//       ---
//     `;
//     try {
//       const payload = {
//         contents: [{ role: "user", parts: [{ text: prompt }] }],
//         generationConfig: { responseMimeType: "application/json" }
//       };
//       const model = 'gemini-2.5-flash';
//       const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//       const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//       if (!response.ok) return; // Fail silently
//       const result = await response.json();
//       const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;
//       if (textResult) {
//         const parsed = JSON.parse(textResult);
//         if (parsed.criticalFinding) {
//           setActiveAlert({ type: 'critical', data: parsed.criticalFinding });
//           setIsAwaitingAlertAcknowledge(true);
//         } else {
//           setActiveAlert(prev => (prev?.type === 'critical' ? null : prev));
//         }
//       }
//     } catch (err) {
//       console.error("Critical finding check failed:", err);
//     }
//   }, [isAwaitingAlertAcknowledge]);

//   const handleGetSuggestions = async (type) => {
//     if (!editor) {
//       setError("Editor not initialized. Please wait and try again.");
//       return;
//     }
//     const reportText = editor.getText();
//     if (!reportText.trim()) {
//       setError("Please enter some findings before requesting suggestions.");
//       return;
//     }
    
//     setIsSuggestionLoading(true);
//     setError(null);
//     setSuggestionType(type);
    
//     let prompt = '';
//     if (type === 'differentials') {
//       prompt = `
//         Act as an expert radiologist. Based on the following radiological findings, provide a list of potential differential diagnoses. For each diagnosis, provide a brief rationale and an estimated likelihood (e.g., Likely, Less Likely, Remote).

//         Findings:
//         ---
//         ${reportText}
//         ---
//       `;
//     } else if (type === 'recommendations') {
//       prompt = `
//         Act as an expert radiologist. Based on the following radiology report (especially the impression), suggest clinically appropriate follow-up actions or recommendations.

//         Report:
//         ---
//         ${reportText}
//         ---
//       `;
//     }

//     try {
//       const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
//       const model = 'gemini-2.5-flash';
//       const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//       const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

//       if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

//       const result = await response.json();
//       const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

//       if (textResult) {
//         setAiSuggestions(textResult);
//         setShowSuggestionsModal(true);
//       } else {
//         throw new Error("No suggestions returned from AI.");
//       }
//     } catch (err) {
//       setError("Failed to get suggestions. " + err.message);
//     } finally {
//       setIsSuggestionLoading(false);
//     }
//   };

//   const handleParseReport = async () => {
//     if (!assistantQuery) {
//       setError("Please paste a report into the AI Assistant box to parse.");
//       return;
//     }
//     setIsParsing(true);
//     setError(null);

//     const prompt = `
//       Act as a data extraction engine. Parse the following unstructured medical report and return a structured JSON object.
//       The JSON object must follow this exact schema:
//       {
//         "patientName": "string",
//         "patientId": "string",
//         "patientAge": "string",
//         "referringPhysician": "string",
//         "examDate": "YYYY-MM-DD",
//         "modality": "string (e.g., Ultrasound, X-Ray)",
//         "bodyPart": "string (e.g., Abdomen, Knee)",
//         "reportBody": "string (the full findings and impression text, formatted as an HTML string with <p> and <strong> tags)"
//       }

//       Report to Parse:
//       ---
//       ${assistantQuery}
//       ---
//     `;
//     try {
//       const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
//       const model = 'gemini-2.5-flash';
//       const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//       const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

//       if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      
//       const result = await response.json();
//       const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

//       if (textResult) {
//         const jsonString = textResult.match(/```json\n([\s\S]*?)\n```/s)?.[1] || textResult;
//         const parsed = JSON.parse(jsonString);
        
//         if(parsed.patientName) setPatientName(parsed.patientName);
//         if(parsed.patientId) setPatientId(parsed.patientId);
//         if(parsed.patientAge) setPatientAge(parsed.patientAge);
//         if(parsed.referringPhysician) setReferringPhysician(parsed.referringPhysician);
//         if(parsed.examDate) setExamDate(parsed.examDate);
//         if(parsed.modality) setModality(parsed.modality);
//         if(parsed.bodyPart) setTemplate(parsed.bodyPart);
//         if(parsed.reportBody && editor) {
//           isProgrammaticUpdate.current = true;
//           console.error('%c CULPRIT FOUND:', 'color: red; font-weight: bold;', 'This piece of code is overwriting the editor content!');
//           editor.commands.setContent(parsed.reportBody);
//         }

//         setAssistantQuery(''); // Clear the box after parsing
//       } else {
//         throw new Error("Could not parse the report.");
//       }
//     } catch (err) {
//       setError("Failed to parse report. " + err.message);
//     } finally {
//       setIsParsing(false);
//     }
//   };

//   const appendSuggestionsToReport = () => {
//     if (!aiSuggestions || !editor) return;

//     const header = suggestionType === 'differentials'
//       ? "<h3>DIFFERENTIAL DIAGNOSIS:</h3>"
//       : "<h3>RECOMMENDATIONS:</h3>";
    
//     const formattedSuggestions = `<p>${aiSuggestions.replace(/\n/g, '<br>')}</p>`;
    
//     isProgrammaticUpdate.current = true;
//     editor.chain().focus().insertContent(`<br>${header}${formattedSuggestions}`).run();

//     setShowSuggestionsModal(false);
//     setAiSuggestions('');
//   };

//   const handleNextPage = () => {
//     if (currentAiPage >= allAiSearchResults.length - 1) {
//       handleAiFindingsSearch(true);
//     } else {
//       setCurrentAiPage(prev => prev + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentAiPage > 0) {
//       setCurrentAiPage(prev => prev - 1);
//     }
//   };

//   const handleNextReport = () => {
//     if (currentReportPage >= allAiFullReports.length - 1) {
//       handleAiFindingsSearch(true);
//     } else {
//       setCurrentReportPage(prev => prev + 1);
//     }
//   };

//   const handlePreviousReport = () => {
//     if (currentReportPage > 0) {
//       setCurrentReportPage(prev => prev - 1);
//     }
//   };
  
//   const insertFindings = (findingToInsert) => {
//     if (!editor) return;
//     isProgrammaticUpdate.current = true;

//     // Handle full reports from both AI (queryType) and local findings (isFullReport)
//     if (findingToInsert.queryType === 'fullReport' || findingToInsert.isFullReport) {
//         const { modality: newModality, template: newTemplate, fullReportText, findings, findingName } = findingToInsert;
        
//         // Use fullReportText from AI or findings from local data
//         const contentToInsert = fullReportText || findings;

//         if (newModality) setModality(newModality);
//         if (newTemplate) setTemplate(newTemplate);
        
//         // Replace the entire editor content with the formatted HTML
//         console.error('%c CULPRIT FOUND:', 'color: red; font-weight: bold;', 'This piece of code is overwriting the editor content!');
//         editor.commands.setContent(contentToInsert);
//         toast.success(`Inserted '${findingName}' report.`);
//         return;
//     }

//     // This part handles inserting individual findings into an existing template
//     const { organ, findings, impression } = findingToInsert;
//     let currentHtml = editor.getHTML();
    
//     const newFindingText = ` ${findings}`;
//     const newImpressionHtml = `<p>- ${impression}</p>`;

//     const organRegex = new RegExp(`(<p><strong>${organ.replace(/ /g, "\\s*")}:<\\/strong>)(.*?)(<\\/p>)`, "i");
//     const organMatch = currentHtml.match(organRegex);

//     let wasFindingHandled = false;
//     if (organMatch) {
//         const openingTags = organMatch[1];
//         const existingContent = organMatch[2];
//         const closingTag = organMatch[3];
//         const placeholderRegex = /Normal in size|Not dilated|unremarkable|No significant/i;
        
//         let finalContent;
//         if(placeholderRegex.test(existingContent)){
//             finalContent = newFindingText;
//         } else {
//             finalContent = existingContent + newFindingText;
//         }

//         const updatedOrganLine = `${openingTags}${finalContent}${closingTag}`;
//         currentHtml = currentHtml.replace(organRegex, updatedOrganLine);
//         wasFindingHandled = true;
//     }

//     const impressionHeaderRegex = /(<h3>IMPRESSION:<\/h3>)/i;
//     const impressionMatch = currentHtml.match(impressionHeaderRegex);

//     if (impressionMatch) {
//         // Insert the new impression after the "IMPRESSION:" header
//         currentHtml = currentHtml.replace(impressionHeaderRegex, `${impressionMatch[0]}${newImpressionHtml}`);
//     } else if (wasFindingHandled) {
//         // If no impression header but we did find an organ, add it at the end.
//         currentHtml += `<br><h3>IMPRESSION:</h3>${newImpressionHtml}`;
//     }

//     if (wasFindingHandled) {
//       console.error('%c CULPRIT FOUND:', 'color: red; font-weight: bold;', 'This piece of code is overwriting the editor content!');
//         editor.commands.setContent(currentHtml);
//     } else {
//         // Fallback for when the organ isn't found in the current template
//         const fallbackHtml = `<p><strong>${organ.toUpperCase()}:</strong> ${findings}</p><br><h3>IMPRESSION:</h3>${newImpressionHtml}`;
//         editor.chain().focus().insertContent(fallbackHtml).run();
//     }
//   };

//   const handleFixInconsistency = () => {
//     if (!editor || !correctionSuggestion) return;
//     isProgrammaticUpdate.current = true;

//     let currentHtml = editor.getHTML();
//     const newImpressionHtml = `<p>- ${correctionSuggestion}</p>`;

//     // Regex to find the impression header, works for <h3> or <p><strong>
//     const impressionHeaderRegex = /(<h3>IMPRESSION:<\/h3>|<p><strong>IMPRESSION:<\/strong>)/i;
//     const impressionMatch = currentHtml.match(impressionHeaderRegex);

//     if (impressionMatch) {
//         // Insert the new impression text immediately after the header
//         currentHtml = currentHtml.replace(impressionHeaderRegex, `${impressionMatch[0]}${newImpressionHtml}`);
//     } else {
//         // If no impression header is found, append it to the end of the report
//         currentHtml += `<br><h3>IMPRESSION:</h3>${newImpressionHtml}`;
//     }
// console.error('%c CULPRIT FOUND:', 'color: red; font-weight: bold;', 'This piece of code is overwriting the editor content!');
//     editor.commands.setContent(currentHtml);
//     toast.success("Report corrected.");

//     // Clear the alert and the stored suggestion
//     setActiveAlert(null);
//     setCorrectionSuggestion(null);
//     setIsAwaitingAlertAcknowledge(false);
//   };

// const handleSendMessage = async (message) => {
//     if (isRestricted) {
//       toast.error("Please upgrade to a professional plan for conversational follow-ups.");
//       return;
//     }
    
//     const newUserMessage = { sender: 'user', text: message };
//     const updatedHistory = [...conversationHistory, newUserMessage];
//     setConversationHistory(updatedHistory);
//     setIsAiReplying(true);

//     const reportText = editor ? editor.getText() : 'No report has been generated yet.';
    
//     // Convert history to a simple string format for the prompt
//     const historyString = updatedHistory.map(msg => `${msg.sender.toUpperCase()}: ${msg.text}`).join('\n');

//     const prompt = `
//       You are a radiology AI co-pilot in an ongoing conversation with a doctor. Continue the conversation based on the provided context.

//       **Initial Clinical Context:**
//       ---
//       ${clinicalContext || 'None'}
//       ---

//       **Current Draft Report:**
//       ---
//       ${reportText}
//       ---

//       **Conversation History:**
//       ---
//       ${historyString}
//       ---

//       Based on all the above context and the user's last message, provide a concise and helpful response. If the user asks you to modify the report, you can suggest the exact text to add or change. If the user provides the clarification you asked for earlier, re-attempt the analysis and provide the full report content in your response.
//     `;

//     try {
//       const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
//       const model = 'gemini-2.5-flash';
//       const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//       const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//       if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

//       const result = await response.json();
//       const aiResponseText = result.candidates?.[0]?.content.parts?.[0]?.text;

//       if (aiResponseText) {
//         const newAiMessage = { sender: 'ai', text: aiResponseText };
//         setConversationHistory(prev => [...prev, newAiMessage]);
//       } else {
//         throw new Error("No response from AI assistant.");
//       }
//     } catch (err) {
//       const errorMessage = { sender: 'ai', text: `Sorry, I encountered an error: ${err.message}` };
//       setConversationHistory(prev => [...prev, errorMessage]);
//     } finally {
//       setIsAiReplying(false);
//     }
//   };

//   const handleCorrectReport = async () => {

//     if (!assistantQuery) {
//       setError("Please paste a report in the text box to correct it.");
//       return;
//     }
//     setIsLoading(true);
//     setError(null);

//     const prompt = `
//       You are an expert radiologist and medical editor. Your task is to analyze the provided medical report for completeness and accuracy.

//       1.  **Review the FINDINGS section** to identify all significant radiological findings.
//       2.  **Compare these findings with the IMPRESSION section.**
//       3.  **Identify any inconsistencies or omissions.** If a significant finding mentioned in the report body is missing from the impression, you must add it. For example, if the findings mention "mild diffuse increase in echotexture with fat fraction 11.3%," the impression should be updated to include a conclusion like "Grade I fatty liver."
//       4.  **Proofread** the entire report for any grammatical or structural errors.
//       5.  **Return the fully corrected and complete report** as a single, professional HTML string. Maintain the original structure.

//       If the report is already accurate and complete, return it as-is without any confirmation message.

//       Report to Analyze and Correct:
//       ---
//       ${assistantQuery}
//       ---
//     `;
//     try {
//         const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
//         const model = 'gemini-2.5-flash';
//         const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//         const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//         const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//         if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

//         const result = await response.json();
//         const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

//         if (textResult && editor) {
//             isProgrammaticUpdate.current = true;
//             console.error('%c CULPRIT FOUND:', 'color: red; font-weight: bold;', 'This piece of code is overwriting the editor content!');
//             editor.commands.setContent(textResult);
//             toast.success("Report correction complete!");
//         } else {
//             throw new Error("No response from AI assistant.");
//         }
//     } catch (err) {
//         setError("AI correction request failed: " + err.message);
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   const handleGenerateTemplate = async () => {

//     if (!assistantQuery) {
//       setError("Please enter a topic to generate a template.");
//       return;
//     }
//     setIsLoading(true);
//     setError(null);

//     const prompt = `
//       You are an expert radiologist. Generate a comprehensive, professionally formatted report template for the following topic.
//       The template should be detailed, including all standard sections, common findings, and placeholders where necessary.
//       The output MUST be a single string of properly formatted HTML.

//       Topic:
//       ---
//       ${assistantQuery}
//       ---
//     `;
//     try {
//         const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
//         const model = 'gemini-2.5-flash';
//         const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//         const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//         const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//         if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

//         const result = await response.json();
//         const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

//         if (textResult && editor) {
//             isProgrammaticUpdate.current = true;
//             console.error('%c CULPRIT FOUND:', 'color: red; font-weight: bold;', 'This piece of code is overwriting the editor content!');
//             editor.commands.setContent(textResult);
//             toast.success("Template generated successfully!");
//         } else {
//             throw new Error("No response from AI assistant.");
//         }
//     } catch (err) {
//         setError("AI template generation failed: " + err.message);
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   // const handleGenerateTemplate = async () => {

//   //   if (!assistantQuery) {
//   //     setError("Please enter a topic to generate a template.");
//   //     return;
//   //   }
//   //   setIsLoading(true);
//   //   setError(null);

//   //   const prompt = `
//   //     You are an expert radiologist. Generate a comprehensive, professionally formatted report template for the following topic.
//   //     The template should be detailed, including all standard sections, common findings, and placeholders where necessary.
//   //     The output MUST be a single string of properly formatted HTML.

//   //     Topic:
//   //     ---
//   //     ${assistantQuery}
//   //     ---
//   //   `;
//   //   try {
//   //       const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
//   //       const model = 'gemini-2.5-flash';
//   //       const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//   //       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

//   //       const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//   //       if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

//   //       const result = await response.json();
//   //       const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

//   //       if (textResult && editor) {
//   //           isProgrammaticUpdate.current = true;
//   //           editor.commands.setContent(textResult);
//   //           toast.success("Template generated successfully!");
//   //       } else {
//   //           throw new Error("No response from AI assistant.");
//   //       }
//   //   } catch (err) {
//   //       setError("AI template generation failed: " + err.message);
//   //   } finally {
//   //       setIsLoading(false);
//   //   }
//   // };


// const generateFinalReport = async (force = false) => {
//   if (!user) return;
//   if (!force) {
//     const missing = findMissingMeasurements();
//     if (missing.length > 0) {
//       setActiveAlert({
//         type: 'missing_info',
//         message: `The following appear to be missing or incomplete: ${missing.join(', ')}. Do you want to proceed?`,
//       });
//       return;
//     }
//   }

//   // --- START: MODIFIED SECTION ---

//   if (editor) {
//     // 1. Add a hook to find and remove any attribute starting with '@'
//     DOMPurify.addHook('afterSanitizeAttributes', (currentNode) => {
//       if (currentNode.hasAttributes()) {
//         const attributes = Array.from(currentNode.attributes);
//         for (const attr of attributes) {
//           if (attr.name.startsWith('@')) {
//             currentNode.removeAttribute(attr.name);
//           }
//         }
//       }
//     });

//     // 2. Get the raw HTML from the editor
//     const rawHtml = editor.getHTML();

//     // 3. Sanitize it using the hook we just added
//     const reportBody = DOMPurify.sanitize(rawHtml);

//     // 4. Important: Remove the hook so it doesn't affect other parts of the app
//     DOMPurify.removeHook('afterSanitizeAttributes');

//   // --- END: MODIFIED SECTION ---

//     const userDocRef = doc(db, 'users', user.uid);
//     const userDoc = await getDoc(userDocRef);
//     const userData = userDoc.data();
//     let newCount = userData.reportCount || 0;

//     const patientHeader = `
//       <div style="padding-bottom: 15px; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px; font-size: 0.9rem;">
//         <h3 style="font-size: 1.1em; font-weight: bold; margin-bottom: 10px; color: #1a202c;">Patient Information</h3>
//         <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
//           <tbody>
//             <tr>
//               <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc; width: 25%;">Patient Name</td>
//               <td style="padding: 8px; border: 1px solid #e2e8f0; width: 25%;">${patientName}</td>
//               <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc; width: 25%;">Patient ID</td>
//               <td style="padding: 8px; border: 1px solid #e2e8f0; width: 25%;">${patientId}</td>
//             </tr>
//             <tr>
//               <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc;">Age</td>
//               <td style="padding: 8px; border: 1px solid #e2e8f0;">${patientAge}</td>
//               <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc;">Exam Date</td>
//               <td style="padding: 8px; border: 1px solid #e2e8f0;">${examDate}</td>
//             </tr>
//             <tr>
//               <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc;">Referring Physician</td>
//               <td style="padding: 8px; border: 1px solid #e2e8f0;" colspan="3">${referringPhysician}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     `;
//     const fullReport = patientHeader + reportBody;
//     setGeneratedReport(fullReport);
//     toastDone('Report generated');

//     if (userRole === 'basic') {
//         await updateDoc(userDocRef, {
//             reportCount: newCount + 1,
//             lastReportDate: serverTimestamp(),
//         });
//     }

//     try {
//         await addDoc(collection(db, "users", user.uid, "reports"), {
//             userId: user.uid,
//             reportHTML: fullReport,
//             patientName: patientName,
//             examDate: examDate,
//             createdAt: serverTimestamp()
//         });
//         toast.success('Report saved to cloud!');
//     } catch (e) {
//         console.error("Error adding document: ", e);
//         toast.error('Could not save report.');
//     }
//     return fullReport;
//   }
//   return '';
// };
  
//   const copyToClipboard = (text, successMessage = 'Copied!') => {
//       const plainText = htmlToText(text, {
//           wordwrap: 130
//       });

//       const textArea = document.createElement('textarea');
//       textArea.value = plainText;
//       document.body.appendChild(textArea);
//       textArea.select();
//       try {
//           document.execCommand('copy');
//           toast.success(successMessage);
//       }
//       catch (err) {
//           toast.error('Failed to copy');
//       }
//       document.body.removeChild(textArea);
//   };

//   const downloadTxtReport = (reportContent) => {
//     if (!reportContent) {
//         // Updated error message for clarity
//         toast.error("Please generate the report first before downloading.");
//         return;
//     }
//     const plainText = htmlToText(reportContent, {
//         wordwrap: 130
//     });

//     const element = document.createElement("a");
//     const file = new Blob([plainText], {type: 'text/plain;charset=utf-8'});
//     element.href = URL.createObjectURL(file);
//     element.download = `Radiology_Report_${patientName.replace(/ /g, '_')}_${examDate}.txt`;
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//     toastDone('TXT downloaded');
//   };

//   const downloadPdfReport = (reportContent) => {
//     if (!reportContent) {
//         setError("Report content is empty. Please generate the report first.");
//         return;
//     }
//     setError(null);
//     try {
//         const doc = new jsPDF();
        
//         const tempDiv = document.createElement('div');
//         tempDiv.style.width = '170mm';
//         tempDiv.style.fontFamily = 'helvetica';
//         tempDiv.style.fontSize = '12px';
//         tempDiv.innerHTML = reportContent;
//         document.body.appendChild(tempDiv);

//         doc.html(tempDiv, {
//             callback: function (doc) {
//                 document.body.removeChild(tempDiv);
//                 doc.save(`Radiology_Report_${patientName.replace(/ /g, '_')}_${examDate}.pdf`);
//                 toastDone('PDF downloaded');
//             },
//             x: 15,
//             y: 15,
//             width: 170,
//             windowWidth: tempDiv.scrollWidth
//         });
//     } catch (err) {
//         setError(`An unexpected error occurred during PDF generation: ${err.message}`);
//         console.error(err);
//     }
//   };

//   const downloadWordReport = async (reportContent, patientName = 'Report') => {
//   try {
//     // 1. Use the browser's DOM parser to turn the HTML string into a traversable document
//     const parser = new DOMParser();
//     const docHtml = parser.parseFromString(reportContent, 'text/html');
    
//     const docxChildren = [];

//     // --- NEW LOGIC: Manually Build the Patient Info Table for correct formatting ---
//     const allTds = docHtml.querySelectorAll('td');
//     if (allTds.length >= 8) {
//       const patientInfoTable = new Table({
//         width: { size: 100, type: WidthType.PERCENTAGE },
//         rows: [
//           new TableRow({
//             children: [
//               new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Patient Name", bold: true })] })] }),
//               new TableCell({ children: [new Paragraph(allTds[1]?.textContent || '')] }),
//               new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Patient ID", bold: true })] })] }),
//               new TableCell({ children: [new Paragraph(allTds[3]?.textContent || '')] }),
//             ],
//           }),
//           new TableRow({
//             children: [
//               new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Age", bold: true })] })] }),
//               new TableCell({ children: [new Paragraph(allTds[5]?.textContent || '')] }),
//               new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Exam Date", bold: true })] })] }),
//               new TableCell({ children: [new Paragraph(allTds[7]?.textContent || '')] }),
//             ],
//           }),
//           new TableRow({
//             children: [
//               new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Referring Physician", bold: true })] })] }),
//               new TableCell({
//                 children: [new Paragraph(allTds[9]?.textContent || '')],
//                 columnSpan: 3, // This cell spans across 3 columns
//               }),
//             ],
//           }),
//         ],
//       });
//       docxChildren.push(patientInfoTable);
//       docxChildren.push(new Paragraph("")); // Add a space after the table
//     }

//     // --- Process the rest of the report (Impression, Findings, etc.) ---
//     const mainNodes = docHtml.body.children;
//     for (const node of mainNodes) {
//       // Skip the div that we already processed
//       if (node.nodeName.toUpperCase() === 'DIV') continue;

//       switch (node.nodeName.toUpperCase()) {
//         case 'H3':
//           docxChildren.push(new Paragraph({ text: node.textContent, heading: HeadingLevel.HEADING_3, style: "Heading3" }));
//           break;
//         case 'P':
//           const paragraphRuns = [];
//           for (const childNode of node.childNodes) {
//             if (childNode.nodeName.toUpperCase() === 'STRONG') {
//               paragraphRuns.push(new TextRun({ text: childNode.textContent, bold: true }));
//             } else {
//               paragraphRuns.push(new TextRun(childNode.textContent));
//             }
//           }
//           docxChildren.push(new Paragraph({ children: paragraphRuns }));
//           break;
//       }
//     }

//     // Create a new document with the children we built
//     const doc = new Document({
//       sections: [{
//         children: docxChildren,
//       }],
//       styles: {
//         paragraphStyles: [
//             {
//                 id: "Heading3",
//                 name: "Heading 3",
//                 basedOn: "Normal",
//                 next: "Normal",
//                 run: {
//                     bold: true,
//                     size: 24, // Corresponds to 12pt font
//                 },
//                 paragraph: {
//                     spacing: { after: 120 },
//                 },
//             },
//         ],
//       },
//     });

//     // Use the Packer to generate a Blob
//     const blob = await Packer.toBlob(doc);

//     // Use FileSaver to trigger the download
//     saveAs(blob, `Radiology_Report_${patientName.replace(/ /g, '_')}.docx`);

//   } catch (error) {
//     console.error("Error generating Word document:", error);
//   }
// };

//   // --- NEW FUNCTION: handleInsertMeasurement ---
//   const handleInsertMeasurement = (finding, value) => {
//       if (!editor) return;
//       let currentHtml = editor.getHTML();
      
//       // Escape special regex characters from the finding string
//       const findingCleaned = finding.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      
//       // Create a regex that finds the finding's bolded header and the first placeholder after it.
//       // It handles variations in whitespace and is case-insensitive.
//       // It looks for placeholders like "__ x __ cm", "__ cm", "__ mm", etc.
//       const findingRegex = new RegExp(
//           `(<strong>${findingCleaned.replace(/\s+/g, '\\s*')}:?</strong>.*?)(__\\s*x\\s*__\\s*cm|__\\s*cm|__\\s*mm|__\\s*x\\s*__\\s*x\\s*__\\s*cm|__\\s*ml)`,
//           "i"
//       );
      
//       const match = currentHtml.match(findingRegex);

//       if (match) {
//           isProgrammaticUpdate.current = true;
//           // Replace the placeholder part (match[2]) with the new value
//           const updatedSection = match[0].replace(match[2], `<strong>${value}</strong>`);
//           currentHtml = currentHtml.replace(match[0], updatedSection);
//           console.error('%c CULPRIT FOUND:', 'color: red; font-weight: bold;', 'This piece of code is overwriting the editor content!');
//           editor.commands.setContent(currentHtml);
//           toast.success(`Inserted measurement for ${finding}`);
//       } else {
//           toast.error(`Could not automatically find a placeholder for "${finding}". Please insert manually.`);
//       }
//   };

// //   const handleInsertMeasurement = (values, calculusData) => {
// //     if (!editor) return;
    
// //     // Always start from the clean, original template to prevent errors
// //     const originalTemplateHtml = templates[modality]?.[template] || '';
// //     let updatedHtml = originalTemplateHtml;

// //     // 1. Replace standard measurement placeholders sequentially
// //     dynamicMeasurements.forEach(measurementConfig => {
// //         const value = values[measurementConfig.id];
// //         // Only replace if there is a value, otherwise the placeholder remains
// //         if (value && value.trim() !== '') {
// //             updatedHtml = updatedHtml.replace('__', `<strong>${value}</strong>`);
// //         }
// //     });

// //     // 2. Insert calculus/mass lesion findings
// //     calculusData.forEach(calculus => {
// //         const organName = calculus.location;
// //         let findingText = ` A ${calculus.size}`;
// //         if (calculus.description) {
// //             findingText += ` ${calculus.description}`;
// //         }
// //         findingText += " is noted.";

// //         const organRegex = new RegExp(`(<p><strong>${escapeRegex(organName)}:?<\/strong>)(.*?)(<\/p>)`, "i");
        
// //         // Use a callback with replace to handle appending vs. replacing content
// //         updatedHtml = updatedHtml.replace(organRegex, (match, openingTags, existingContent, closingTag) => {
// //             const placeholderRegex = /Normal in size|Not dilated|unremarkable|No significant/i;
// //             let finalContent = placeholderRegex.test(existingContent) ? findingText : existingContent + findingText;
// //             return `${openingTags}${finalContent}${closingTag}`;
// //         });
// //     });

// //     // Use the programmatic update flag to prevent the editor's onUpdate from re-triggering this logic
// //     isProgrammaticUpdate.current = true;
// //     editor.commands.setContent(updatedHtml);
// // };

  

//   // --- Firestore Macro Handlers ---
//   const handleAddMacro = async () => {
//     if (!newMacroCommand || !newMacroText) {
//       toast.error("Please provide both a command and text for the macro.");
//       return;
//     }
//     if (!user) {
//       toast.error("You must be logged in to add a macro.");
//       return;
//     }

//     try {
//       await addDoc(collection(db, "users", user.uid, "macros"), {
//         command: newMacroCommand,
//         text: newMacroText,
//         createdAt: serverTimestamp()
//       });
//       setNewMacroCommand('');
//       setNewMacroText('');
//       toast.success("Macro added successfully!");
//     } catch (error) {
//       console.error("Error adding macro: ", error);
//       toast.error("Failed to add macro.");
//     }
//   };

//   const handleDeleteMacro = async (macroId) => {
//     if (!user) {
//       toast.error("You must be logged in to delete a macro.");
//       return;
//     }
//     try {
//       await deleteDoc(doc(db, "users", user.uid, "macros", macroId));
//       toast.success("Macro deleted.");
//     } catch (error) {
//       console.error("Error deleting macro: ", error);
//       toast.error("Failed to delete macro.");
//     }
//   };

//   const shortcuts = {
//     toggleMic: { label: 'Toggle Microphone', ctrlOrCmd: true, key: 'm', action: handleToggleListening },
//     generateReport: { label: 'Generate Final Report', ctrlOrCmd: true, key: 'g', action: generateFinalReport, condition: () => userFindings },
//     analyzeImages: { label: 'Analyze Images', ctrlOrCmd: true, key: 'i', action: analyzeImages, condition: () => images.length > 0 },
//     focusSearch: { label: 'Focus Local Search', ctrlOrCmd: true, key: 'f', action: () => localSearchInputRef.current?.focus() },
//     focusEditor: { label: 'Focus Editor', key: 'Escape', action: () => editor?.commands.focus(), isUniversal: true },
//     suggestDifferentials: { label: 'Suggest Differentials', alt: true, key: 'd', action: () => handleGetSuggestions('differentials'), condition: () => userFindings },
//     generateRecommendations: { label: 'Generate Recommendations', alt: true, key: 'r', action: () => handleGetSuggestions('recommendations'), condition: () => userFindings },
//     openMacros: { label: 'Open Voice Macros', alt: true, key: 'm', action: () => setShowMacroModal(true) },
//     toggleProactive: { label: 'Toggle Proactive Co-pilot', alt: true, key: 'p', action: () => setIsProactiveHelpEnabled(prev => !prev) },
//     showHelp: { label: 'Show Shortcuts Help', ctrlOrCmd: true, key: '/', action: () => setShowShortcutsModal(true) },
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//         const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
//         const activeElement = document.activeElement;
//         const isTyping = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;

//         for (const config of Object.values(shortcuts)) {
//             const isCtrlOrCmd = (isMac && event.metaKey) || (!isMac && event.ctrlKey);
            
//             let keyMatch = event.key.toLowerCase() === config.key.toLowerCase();
//             if (config.key === '/') keyMatch = event.key === '/'; // Handle special characters

//             let modifierMatch = (config.ctrlOrCmd && isCtrlOrCmd) || (config.alt && event.altKey) || (!config.ctrlOrCmd && !config.alt && !event.altKey && !isCtrlOrCmd);

//             if (keyMatch && modifierMatch) {
//                 if (config.isUniversal || !isTyping) {
//                     event.preventDefault();
//                     if (config.condition === undefined || config.condition()) {
//                         config.action();
//                     } else {
//                         toast.error('Cannot perform action. Conditions not met.', { duration: 2000 });
//                     }
//                     return; // Stop after first match
//                 }
//             }
//         }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [editor, userFindings, images, isProactiveHelpEnabled, handleToggleListening, generateFinalReport, analyzeImages, handleGetSuggestions]);

//   // --- CONDITIONAL RENDERING ---
//   if (isAuthLoading) {
//       return <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">Loading...</div>;
//   }

//   if (!user) {
//       return <Auth />;
//   }
// // --- NEW HELPER FUNCTION for DICOM Conversion ---
//   const convertDicomToPngBase64 = async (dicomFile) => {
//     const cornerstone = window.cornerstone;
//     const csWADOImageLoader = window.cornerstoneWADOImageLoader;

//     if (!cornerstone || !csWADOImageLoader) {
//       throw new Error("Cornerstone libraries are not loaded yet.");
//     }

//     // Create an off-screen div and canvas to render the image
//     const container = document.createElement('div');
//     container.style.width = '512px';
//     container.style.height = '512px';
//     container.style.position = 'absolute';
//     container.style.left = '-9999px'; // Hide it off-screen
//     document.body.appendChild(container);

//     try {
//       cornerstone.enable(container);
//       const imageId = csWADOImageLoader.wadouri.fileManager.add(dicomFile);
//       const image = await cornerstone.loadImage(imageId);
//       cornerstone.displayImage(container, image);
      
//       const canvas = container.querySelector('canvas');
//       if (!canvas) {
//         throw new Error("Canvas element not found after rendering.");
//       }
      
//       // Get the data URL (which is base64 encoded) and extract the data part
//       const dataUrl = canvas.toDataURL('image/png');
//       return dataUrl.split(',')[1];

//     } finally {
//       // Clean up the off-screen element
//       cornerstone.disable(container);
//       document.body.removeChild(container);
//     }
//   };
//   return (
//     <div
//       className="min-h-screen font-sans text-gray-800"
//       style={{
//         backgroundImage: `linear-gradient(rgba(24, 32, 47, 0.9), rgba(24, 32, 47, 0.9)), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop')`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundAttachment: 'fixed',
//       }}
//     >
//       <style>{`
//         .tiptap {
//           min-height: 250px;
//           border: 1px solid #ccc;
//           border-top: none;
//           border-radius: 0 0 0.5rem 0.5rem;
//           padding: 0.5rem;
//         }
//         .tiptap:focus {
//             outline: none;
//             border-color: #a7f3d0;
//         }
//         .tiptap p.is-editor-empty:first-child::before {
//           color: #adb5bd;
//           content: attr(data-placeholder);
//           float: left;
//           height: 0;
//           pointer-events: none;
//         }
//         /* Added styles for lists */
//         .tiptap ul, .tiptap ol {
//             padding-left: 1.5rem;
//         }
//         .tiptap ul {
//             list-style-type: disc;
//         }
//         .tiptap ol {
//             list-style-type: decimal;
//         }
//         .toggle-checkbox:checked {
//             right: 0;
//             border-color: #4f46e5; /* Tailwind indigo-600 */
//             transform: translateX(100%);
//         }
//         .toggle-checkbox:checked + .toggle-label {
//             background-color: #4f46e5; /* Tailwind indigo-600 */
//         }
//         .toggle-checkbox {
//             transition: all 0.2s ease-in-out;
//             left: 0;
//         }
//         @keyframes pulse-slow {
//           50% {
//             box-shadow: 0 0 0 12px rgba(239, 68, 68, 0.2);
//           }
//         }
//         .animate-pulse-slow {
//           animation: pulse-slow 2s infinite;
//         }
//       `}</style>
//       <div className="container mx-auto p-4 lg:p-8">
//         <header className="text-center mb-8 relative">
//         {/* <img
//           src="src\assets\aiRAD_logo.jpg"
//           alt="example"
//           style={{ maxWidth: '5%' }}
//         /> */}
        
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-100 flex items-center justify-center"> <br/>aiRAD-Reporting, Redefined.</h1>
//           <p className="text-lg text-gray-100 mt-2">AI-Assisted Radiology Reporting System.</p>
//           {user && (
//             <div className="absolute top-0 right-0 flex items-center space-x-4">
//                 <span className="text-white text-sm hidden sm:inline">{user.email}</span>
//                 <button
//                     onClick={handleSignOut}
//                     className="bg-red-500 text-white font-semibold px-3 py-2 rounded-lg hover:bg-red-600 transition shadow-sm flex items-center space-x-2"
//                     title="Sign Out"
//                 >
//                     <LogOut size={16} />
//                     <span className="hidden md:inline">Sign Out</span>
//                 </button>
//             </div>
//           )}
//         </header>
//         {isRestricted && (
//             <div className="p-4 mb-4 bg-yellow-100 text-yellow-800 rounded-lg text-center">
//                 You've reached your free limit.
//                 <button
//                     onClick={() => { /* Navigate to upgrade page */ }}
//                     className="font-bold underline ml-2"
//                 >
//                     Upgrade to Professional
//                 </button>
//                 for unlimited reports and AI features.
//             </div>
//         )}
        
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column: Controls & Inputs */}
//           <div className="space-y-6">
//             <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
//                 <div className="flex justify-between items-center">
//                     <h2 className="text-2xl font-bold text-gray-700 flex items-center"><Settings className="mr-3 text-blue-500" />Controls</h2>
//                     <div className="flex items-center space-x-2">
//                       <button onClick={() => setShowTemplateModal(true)} className="text-sm bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md hover:bg-blue-200 transition flex items-center">
//                           <Plus size={14} className="mr-1" /> Manage Templates
//                       </button>
//                       <button onClick={() => setShowMacroModal(true)} className="text-sm bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md hover:bg-blue-200 transition flex items-center">
//                           <Plus size={14} className="mr-1" /> Voice Macros
//                       </button>
//                     </div>
//                 </div>

//                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
//                     <label htmlFor="proactive-toggle" className="font-semibold text-gray-700 flex items-center text-sm cursor-pointer">
//                         <Lightbulb size={16} className={`mr-2 ${isProactiveHelpEnabled ? 'text-yellow-500' : 'text-gray-400'}`}/>
//                         Proactive AI Co-pilot
//                     </label>
//                     <div className="relative inline-block w-10 align-middle select-none">
//                         <input
//                             type="checkbox"
//                             name="proactive-toggle"
//                             id="proactive-toggle"
//                             checked={isProactiveHelpEnabled}
//                             onChange={() => setIsProactiveHelpEnabled(!isProactiveHelpEnabled)}
//                             className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//                         />
//                         <label htmlFor="proactive-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
//                     </div>
//                 </div>
//             </div>

//             <CollapsibleSection title="Patient & Exam Details" icon={User} defaultOpen={true}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="font-semibold text-gray-600 flex items-center mb-2"><User size={18} className="mr-2"/>Patient Name</label>
//                         <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
//                     </div>
//                     <div>
//                         <label className="font-semibold text-gray-600 flex items-center mb-2"><User size={18} className="mr-2"/>Patient ID</label>
//                         <input type="text" value={patientId} onChange={e => setPatientId(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
//                     </div>
//                     <div>
//                         <label className="font-semibold text-gray-600 flex items-center mb-2"><Calendar size={18} className="mr-2"/>Patient Age</label>
//                         <input type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
//                     </div>
//                     <div>
//                         <label className="font-semibold text-gray-600 flex items-center mb-2"><UserCheck size={18} className="mr-2"/>Referring Physician</label>
//                         <input type="text" value={referringPhysician} onChange={e => setReferringPhysician(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
//                     </div>
//                     <div className="md:col-span-2">
//                         <label className="font-semibold text-gray-600 flex items-center mb-2"><Calendar size={18} className="mr-2"/>Exam Date</label>
//                         <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
//                     </div>
//                 </div>
//             </CollapsibleSection>
            
//             <CollapsibleSection title="Report Template" icon={FileText}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="font-semibold text-gray-600 flex items-center mb-2"><Stethoscope size={18} className="mr-2"/>Modality</label>
//                         {/* <select value={modality} onChange={e => {setModality(e.target.value); setTemplate(Object.keys(allTemplates[e.target.value])[0])}} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white">
//                             {Object.keys(allTemplates).map(m => <option key={m} value={m}>{m}</option>)}
//                         </select> */}
//                         {/* // For the Modality dropdown: */}
//                        <select value={modality} onChange={e => {
//     const newModality = e.target.value;
//     const newTemplate = Object.keys(allTemplates[newModality])[0];
//     setModality(newModality);
//     setTemplate(newTemplate);
//     // Directly set the content for the new template
//     setEditorContent(allTemplates[newModality][newTemplate] || '');
// }} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white">
//     {Object.keys(allTemplates).map(m => <option key={m} value={m}>{m}</option>)}
// </select>
//                     </div>
//                     <div>
//                         <label className="font-semibold text-gray-600 flex items-center mb-2"><FileText size={18} className="mr-2"/>Template</label>
//                         {/* <select value={template} onChange={e => setTemplate(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white" disabled={!modality}>
//                             {modality && Object.keys(allTemplates[modality] || {}).map(t => <option key={t} value={t}>{t}</option>)}
//                         </select> */}
//                         {/* // For the Template dropdown: */}
//                           <select value={template} onChange={e => {
//     const newTemplate = e.target.value;
//     setTemplate(newTemplate);
//     // Directly set the content for the new template
//     setEditorContent(allTemplates[modality][newTemplate] || '');
// }} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white" disabled={!modality}>
//     {modality && Object.keys(allTemplates[modality] || {}).map(t => <option key={t} value={t}>{t}</option>)}
// </select>
//                     </div>
//                 </div>
//             </CollapsibleSection>

//             {/* <CollapsibleSection title="Report Template" icon={FileText}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="font-semibold text-gray-600 flex items-center mb-2"><Stethoscope size={18} className="mr-2"/>Modality</label>
//                         <select value={modality} onChange={e => {setModality(e.target.value); setTemplate(Object.keys(templates[e.target.value])[0])}} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white">
//                             {Object.keys(templates).map(m => <option key={m} value={m}>{m}</option>)}
//                         </select>
//                     </div>
//                     <div>
//                         <label className="font-semibold text-gray-600 flex items-center mb-2"><FileText size={18} className="mr-2"/>Template</label>
//                         <select value={template} onChange={e => setTemplate(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white" disabled={!modality}>
//                             {modality && Object.keys(templates[modality] || {}).map(t => <option key={t} value={t}>{t}</option>)}
//                         </select>
//                     </div>
//                 </div>
//             </CollapsibleSection> */}

//             {/* --- ADD THIS BLOCK --- */}
//             {modality === 'Ultrasound' && (
//               <MeasurementsPanel
//                 measurements={dynamicMeasurements}
//                 organs={templateOrgans}
//                 onInsert={handleInsertMeasurements}
//               />
//             )}

//             {/* NEW: Image Uploads and Viewer */}
//             <CollapsibleSection title="Radiology Images & Viewer" icon={Upload} defaultOpen={true}>
//                 <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-2xl text-center transition-colors cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
//                     <input {...getInputProps()} />
//                     <p className="text-gray-600 font-semibold">{isDragActive ? 'Drop the files here...' : 'Drag & drop images here, or click to select files'}</p>
//                     <p className="text-sm text-gray-500 mt-1">Accepts DICOM, PNG, and JPEG files.</p>
//                 </div>
//                 {isDicomLoaded && selectedImage ? (
//                     <div className="space-y-4">
//                         <div className="cursor-pointer" onClick={() => images.length > 0 && openModal(images.indexOf(selectedImage) > -1 ? images.indexOf(selectedImage) : 0)}>
//                             <ImageViewer image={selectedImage} />
//                         </div>
//                         <div className="flex space-x-2 p-2 overflow-x-auto border rounded-lg bg-gray-100">
//                             {images.map((img, index) => (
//                                 <div key={index} className="relative group flex-shrink-0 cursor-pointer" onClick={() => openModal(index)}>
//                                     <img
//                                         src={img.src}
//                                         alt={`Scan ${index+1}`}
//                                         className={`w-24 h-24 object-contain rounded-md shadow-md transition-all border-2 ${selectedImage === img ? 'border-indigo-500 scale-105' : 'border-transparent'}`}
//                                     />
//                                     <button
//                                         onClick={(e) => { e.stopPropagation(); removeImage(index); }}
//                                         className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
//                                     >
//                                         <XCircle size={18} />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 ) : images.length > 0 ? (
//                     <div className="mt-4 p-2 border rounded-lg bg-gray-100">
//                         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
//                              {images.map((img, index) => (
//                                 <div key={index} className="relative group">
//                                      <img src={img.src} alt={`Scan ${index+1}`} className="w-full h-24 object-cover rounded-md shadow-md cursor-pointer" onClick={() => openModal(index)}/>
//                                      <button onClick={(e) => { e.stopPropagation(); removeImage(index); }} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
//                                          <XCircle size={18}/>
//                                      </button>
//                                 </div>
//                              ))}
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="mt-4 p-4 text-center text-gray-500">
//                         {isDicomLoaded ? "No images loaded. Drag or select files above." : "Loading medical imaging libraries..."}
//                     </div>
//                 )}
//             </CollapsibleSection>

//       {/* Image Modal for DICOM & Raster navigation */}
//       <ImageModal
//         images={images}
//         currentIndex={modalIndex}
//         onClose={closeModal}
//         onNext={showNext}
//         onPrev={showPrev}
//       />

//             <div className="w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
//                 <div className="flex items-center space-x-2 mb-4">
//                     <ImageIcon size={20} className="text-gray-600" />
//                     <label htmlFor="clinical-context" className="font-semibold text-gray-600">Clinical Context (Optional)</label>
//                 </div>
//                 <textarea
//                     id="clinical-context"
//                     value={clinicalContext}
//                     onChange={e => setClinicalContext(e.target.value)}
//                     rows="2"
//                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
//                     placeholder="e.g., Patient presents with right upper quadrant pain."
//                 />
//                 <button
//                     onClick={analyzeImages}
//                     disabled={isAiLoading || images.length === 0 || isRestricted}
//                     className="w-full mt-3 bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition flex items-center justify-center disabled:bg-indigo-300"
//                 >
//                     {isAiLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>{aiAnalysisStatus || 'Analyzing...'}</span></> : <><BrainCircuit size={20} className="mr-2"/>Analyze Images</>}
//                 </button>
//             </div>


//             <CollapsibleSection title="AI Assistant" icon={CheckCircle}>
//                 <div className="flex justify-between items-center">
//                     <label className="font-semibold text-gray-600 flex items-center"><CheckCircle className="mr-2 text-teal-600" />AI Assistant</label>
//                     <button onClick={handleParseReport} disabled={isParsing || !assistantQuery || isRestricted} className="text-xs bg-teal-100 text-teal-800 font-semibold py-1 px-2 rounded-md hover:bg-teal-200 transition flex items-center disabled:opacity-50">
//                         {isParsing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-700 mr-2"></div> : <FileScan size={14} className="mr-1" />}
//                         Parse to Fields
//                     </button>
//                 </div>
//                 <textarea
//                     value={assistantQuery}
//                     onChange={(e) => setAssistantQuery(e.target.value)}
//                     rows="4"
//                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 transition"
//                     placeholder="Paste a report for correction OR enter a topic to generate a new template..."
//                 />
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                     <button onClick={handleCorrectReport} disabled={isLoading || !assistantQuery || isRestricted} className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition flex items-center justify-center disabled:bg-teal-400">
//                         {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Correcting...</> : <><CheckCircle className="mr-2" />Correct Pasted Report</>}
//                     </button>
//                     <button onClick={handleGenerateTemplate} disabled={isLoading || !assistantQuery || isRestricted} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center disabled:bg-blue-400">
//                         {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Generating...</> : <><PlusCircle className="mr-2" />Generate New Template</>}
//                     </button>
//                 </div>
//             </CollapsibleSection>
            
//             <CollapsibleSection title="Local Findings Search" icon={Search}>
//                 <div className="flex items-center space-x-2">
//                     <input
//                         type="text"
//                         ref={localSearchInputRef}
//                         value={searchQuery}
//                         onChange={e => setSearchQuery(e.target.value)}
//                         onKeyDown={e => e.key === 'Enter' && handleSearch()}
//                         placeholder="e.g., Liver, Kidney, or Ectopic Pregnancy"
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition"
//                     />
//                     <button ref={searchButtonRef} onClick={handleSearch} className="bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition flex items-center justify-center">
//                         <Search size={20} />
//                     </button>
//                 </div>
                
//                 {isSearching && !aiKnowledgeLookupResult && <SearchResultSkeleton />}

//                 {!isSearching && localSearchResults.length > 0 && (
//                     <div className="mt-3 space-y-3 max-h-60 overflow-y-auto pr-2">
//                         <h3 className="font-bold text-gray-700">Standard Findings</h3>
//                         {localSearchResults.map((result, index) => (
//                             <div key={result.id || index} className="p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-2 relative">
//                                 <span className="absolute top-2 right-2 bg-purple-200 text-purple-800 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{index + 1}</span>
//                                 <h4 className="font-bold text-purple-800">{result.findingName}</h4>
//                                 <div className="text-sm space-y-1">
//                                     <p><span className="font-semibold">ORGAN:</span> {result.organ}</p>
//                                     {result.isFullReport ? (
//                                         <div>
//                                             <span className="font-semibold">REPORT PREVIEW:</span>
//                                             <div className="prose prose-sm max-w-none mt-1 p-2 bg-white rounded border h-24 overflow-y-hidden relative text-xs">
//                                                 <div dangerouslySetInnerHTML={{ __html: result.findings }} />
//                                                 <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-purple-50 to-transparent pointer-events-none"></div>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <>
//                                             <p><span className="font-semibold">FINDINGS:</span> {result.findings}</p>
//                                             <p><span className="font-semibold">IMPRESSION:</span> {result.impression}</p>
//                                         </>
//                                     )}
//                                 </div>
//                                 <div className="flex space-x-2 mt-2">
//                                     <button onClick={() => insertFindings(result)} className="w-full bg-purple-200 text-purple-800 font-bold py-2 px-4 rounded-lg hover:bg-purple-300 transition flex items-center justify-center">
//                                         <PlusCircle size={18} className="mr-2" /> Insert
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
                
//                 <div className="grid grid-cols-2 gap-2 mt-2">
//                     <button onClick={() => handleAiFindingsSearch()} disabled={isSearching || !baseSearchQuery || isRestricted} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center disabled:bg-indigo-300">
//                         {isSearching && !allAiFullReports.length && !allAiSearchResults.length ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>Searching...</span></> : <><Search size={20} className="mr-2" />Search Findings</>}
//                     </button>
//                     <button onClick={() => handleAiKnowledgeSearch()} disabled={isSearching || !baseSearchQuery || isRestricted} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center disabled:bg-green-300">
//                         {isSearching ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>Searching...</span></> : <><BookOpen size={20} className="mr-2" />Knowledge Search</>}
//                     </button>
//                 </div>
                
//                 {!isSearching && allAiFullReports.length > 0 && (
//                     <div className="mt-3 space-y-3">
//                         <h3 className="font-bold text-gray-700">AI-Drafted Report</h3>
//                         <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 space-y-2">
//                             {allAiFullReports[currentReportPage] && (
//                                 <>
//                                     <div className="text-sm prose max-w-none" dangerouslySetInnerHTML={{__html: allAiFullReports[currentReportPage].fullReportText}}/>
//                                     <button onClick={() => insertFindings(allAiFullReports[currentReportPage])} className="w-full mt-2 bg-indigo-200 text-indigo-800 font-bold py-2 px-4 rounded-lg hover:bg-indigo-300 transition flex items-center justify-center">
//                                         <PlusCircle size={18} className="mr-2" /> Insert this Version
//                                     </button>
//                                 </>
//                             )}
//                         </div>
//                         <div className="flex justify-between items-center mt-4">
//                             <button onClick={handlePreviousReport} disabled={currentReportPage === 0} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50 flex items-center">
//                                 <ChevronLeft size={20} className="inline-block mr-1" /> Previous
//                             </button>
//                             <span className="font-semibold text-gray-700">
//                                 Version {currentReportPage + 1} of {allAiFullReports.length}
//                             </span>
//                             <button onClick={handleNextReport} disabled={isSearching} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-indigo-300 flex items-center">
//                                 {isSearching && currentReportPage === allAiFullReports.length - 1 ? (
//                                     <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div><span>Generating...</span></>
//                                 ) : (
//                                     <>Next <ChevronRight size={20} className="inline-block ml-1" /></>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {!isSearching && allAiSearchResults.length > 0 && (
//                     <div className="mt-3 space-y-3">
//                         <h3 className="font-bold text-gray-700">AI-Powered Findings</h3>
//                         {allAiSearchResults[currentAiPage] && allAiSearchResults[currentAiPage].map((result, index) => (
//                             <div key={index} className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 space-y-2 relative">
//                                 <span className="absolute top-2 right-2 bg-indigo-200 text-indigo-800 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{localSearchResults.length + index + 1}</span>
//                                 <h4 className="font-bold text-indigo-800">{result.findingName}</h4>
//                                 <div className="text-sm">
//                                     <p><span className="font-semibold">ORGAN:</span> {result.organ}</p>
//                                     <p><span className="font-semibold">FINDINGS:</span> {result.findings}</p>
//                                     <p><span className="font-semibold">IMPRESSION:</span> {result.impression}</p>
//                                 </div>
//                                 <div className="flex space-x-2 mt-2">
//                                     <button onClick={() => insertFindings(result)} className="w-full bg-indigo-200 text-indigo-800 font-bold py-2 px-4 rounded-lg hover:bg-indigo-300 transition flex items-center justify-center">
//                                         <PlusCircle size={18} className="mr-2" /> Insert
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                         <div className="flex justify-between items-center mt-4">
//                             <button onClick={handlePreviousPage} disabled={currentAiPage === 0} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50">
//                                 <ChevronLeft size={20} className="inline-block mr-1" /> Previous
//                             </button>
//                             <span>Page {currentAiPage + 1} of {allAiSearchResults.length}</span>
//                             <button onClick={handleNextPage} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
//                                 Next <ChevronRight size={20} className="inline-block ml-1" />
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </CollapsibleSection>

//             {/* <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
//                 <div className="flex justify-between items-center">
//                     <label className="font-semibold text-gray-600">Findings & Measurements</label>
//                     <div className="flex space-x-2">
//                         <button onClick={() => handleGetSuggestions('differentials')} disabled={isSuggestionLoading || !userFindings || isRestricted} className="text-xs bg-gray-200 text-gray-700 font-semibold py-1 px-2 rounded-md hover:bg-gray-300 transition flex items-center disabled:opacity-50">
//                             <Lightbulb size={14} className="mr-1" /> Suggest Differentials
//                         </button>
//                         <button onClick={() => handleGetSuggestions('recommendations')} disabled={isSuggestionLoading || !userFindings || isRestricted} className="text-xs bg-gray-200 text-gray-700 font-semibold py-1 px-2 rounded-md hover:bg-gray-300 transition flex items-center disabled:opacity-50">
//                             <ListPlus size={14} className="mr-1" /> Generate Recommendations
//                         </button>
//                     </div>
//                 </div>
                
//                 <AlertPanel
//                     alertData={activeAlert}
//                     onAcknowledge={() => {
//                         setActiveAlert(null);
//                         setIsAwaitingAlertAcknowledge(false);
//                     }}
//                     onInsertMacro={() => {
//                         if (editor && activeAlert?.type === 'critical' && activeAlert.data?.reportMacro) {
//                             isProgrammaticUpdate.current = true;
//                             editor.chain().focus().insertContent(`<p><strong>${activeAlert.data.reportMacro}</strong></p>`).run();
//                             toast.success("Critical finding macro inserted.");
//                         }
//                         setActiveAlert(null);
//                         setIsAwaitingAlertAcknowledge(false);
//                     }}
//                     onPrepareNotification={() => {
//                         if (activeAlert?.type === 'critical' && activeAlert.data?.notificationTemplate) {
//                             copyToClipboard(activeAlert.data.notificationTemplate, "Notification text copied!");
//                         }
//                         setActiveAlert(null);
//                         setIsAwaitingAlertAcknowledge(false);
//                     }}
//                     onFix={handleFixInconsistency}
//                     onProceed={() => {
//                         setActiveAlert(null);
//                         generateFinalReport(true); // Re-run the function, forcing it to bypass the check
//                     }}
//                 />

//                 <div className={`rounded-lg bg-white transition-all duration-300 ${activeAlert?.type === 'critical' ? 'border-2 border-red-500 shadow-lg ring-4 ring-red-500/20' : 'border border-gray-300'}`}>
//                     <MenuBar editor={editor} />
//                     <EditorContent editor={editor} aria-label="Findings editor" />
//                 </div>
//             </div> */}
//           </div>
          
//           {/* Right Column: Generated Report & AI Co-pilot */}
//           <div className="space-y-8">
//             <div>
//               <div className="space-y-3 p-4 bg-gray-100 rounded-lg">
//                   <h3 className="font-semibold text-gray-700 flex items-center"><FileText className="mr-2" />Summary of the Report</h3>
//                   {isExtracting && <div className="flex items-center text-sm text-gray-500"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>Extracting...</div>}
//                   <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
//                       {Object.entries(structuredData).length > 0 ? (
//                           Object.entries(structuredData).map(([key, value]) => (
//                               <div key={key}>
//                                   <span className="font-semibold text-gray-600">{key}: </span>
//                                   <span className="text-gray-800">{value.toString()}</span>
//                               </div>
//                           ))
//                       ) : (
//                           !isExtracting && <p className="text-gray-500 col-span-2">Start typing in the editor to see extracted data here.</p>
//                       )}
//                   </div>
//               </div>
//               <RecentReportsPanel onSelectReport={handleSelectRecentReport} user={user} />
//               {/* --- NEW: Render Suggested Measurements Panel --- */}
//               <AiSuggestedMeasurementsPanel
//                   measurements={aiMeasurements}
//                   onInsert={handleInsertMeasurement}
//                   onClear={() => setAiMeasurements([])}
//               />

//               <br />
//               <h2 className="text-2xl font-bold text-gray-500 flex items-center mb-4"><FileText className="mr-3 text-green-500" />Generated Report</h2>
//               {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">Error: {error}</div>}
//               <div className="relative w-full min-h-[400px] bg-white rounded-lg border p-4 overflow-y-auto shadow-inner">
//                   <div className="absolute top-2 right-2 flex items-center space-x-2">
//                       {copySuccess && <span className="text-sm text-green-600">{copySuccess}</span>}
//                       <button onClick={() => copyToClipboard(generatedReport)} title="Copy Report" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-600 disabled:opacity-50" disabled={!generatedReport}><Clipboard size={18}/></button>
//                       <button onClick={()=>downloadTxtReport(generatedReport)} title="Download as .txt" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-600 disabled:opacity-50" disabled={!generatedReport}><FileType size={18}/></button>
//                       <button
//                           onClick={() => downloadPdfReport(generatedReport)}
//                           title="Download as .pdf"
//                           aria-label="Download report as PDF"
//                           className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-600 disabled:opacity-50"
//                           disabled={!generatedReport}
//                       >
//                           <FileJson size={18} />
//                       </button>
//                           <button
//                             onClick={() => downloadWordReport(generatedReport, patientName)}
//                             className="p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
//                             title="Download as .docx"
//                           >
//                             Download as Word
//                           </button>
//                       <Toaster
//                           position="top-right"
//                           toastOptions={{
//                               className: 'rounded-lg shadow-md',
//                               style: { background: '#111827', color: '#fff' },
//                           }}
//                       />
//                   </div>
//                   {isLoading ? <ReportSkeleton /> : <div dangerouslySetInnerHTML={{ __html: generatedReport }} className="prose max-w-none"/>}
//               </div>
//               <button onClick={()=>generateFinalReport()} disabled={isLoading || !editorContent} className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center disabled:bg-blue-400 text-lg shadow-md hover:shadow-lg">
//                             {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Generating Report...</> : <><FileText className="mr-2" /> Generate Full Report</>}
//                             </button>
//             </div>

//             <KnowledgeLookupPanel
//               result={aiKnowledgeLookupResult}
//               onClose={() => setAiKnowledgeLookupResult(null)}
//               onInsert={(content) => {
//                   if (editor) {
//                       isProgrammaticUpdate.current = true;
//                       editor.chain().focus().insertContent(content).run();
//                       toastDone('Knowledge summary inserted.');
//                       setAiKnowledgeLookupResult(null);
//                   }
//               }}
//             />
//           </div>
//         </div>

//          <div className="space-y-10">
//            <div>
//           <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
//                 <div className="flex justify-between items-center">
//                     <label className="font-semibold text-gray-600">Findings & Measurements</label>
//                     <div className="flex space-x-2">
//                         <button onClick={() => handleGetSuggestions('differentials')} disabled={isSuggestionLoading || !userFindings || isRestricted} className="text-xs bg-gray-200 text-gray-700 font-semibold py-1 px-2 rounded-md hover:bg-gray-300 transition flex items-center disabled:opacity-50">
//                             <Lightbulb size={14} className="mr-1" /> Suggest Differentials
//                         </button>
//                         <button onClick={() => handleGetSuggestions('recommendations')} disabled={isSuggestionLoading || !userFindings || isRestricted} className="text-xs bg-gray-200 text-gray-700 font-semibold py-1 px-2 rounded-md hover:bg-gray-300 transition flex items-center disabled:opacity-50">
//                             <ListPlus size={14} className="mr-1" /> Generate Recommendations
//                         </button>
//                     </div>
//                 </div>
                
//                 <AlertPanel
//                     alertData={activeAlert}
//                     onAcknowledge={() => {
//                         setActiveAlert(null);
//                         setIsAwaitingAlertAcknowledge(false);
//                     }}
//                     onInsertMacro={() => {
//                         if (editor && activeAlert?.type === 'critical' && activeAlert.data?.reportMacro) {
//                             isProgrammaticUpdate.current = true;
//                             editor.chain().focus().insertContent(`<p><strong>${activeAlert.data.reportMacro}</strong></p>`).run();
//                             toast.success("Critical finding macro inserted.");
//                         }
//                         setActiveAlert(null);
//                         setIsAwaitingAlertAcknowledge(false);
//                     }}
//                     onPrepareNotification={() => {
//                         if (activeAlert?.type === 'critical' && activeAlert.data?.notificationTemplate) {
//                             copyToClipboard(activeAlert.data.notificationTemplate, "Notification text copied!");
//                         }
//                         setActiveAlert(null);
//                         setIsAwaitingAlertAcknowledge(false);
//                     }}
//                     onFix={handleFixInconsistency}
//                     onProceed={() => {
//                         setActiveAlert(null);
//                         generateFinalReport(true); // Re-run the function, forcing it to bypass the check
//                     }}
//                 />

//                 <div className={`rounded-lg bg-white transition-all duration-300 ${activeAlert?.type === 'critical' ? 'border-2 border-red-500 shadow-lg ring-4 ring-red-500/20' : 'border border-gray-300'}`}>
//                     <MenuBar editor={editor} />
//                     <EditorContent editor={editor} aria-label="Findings editor" />
//                 </div>
//             </div>
//             </div>
//          </div>
// {/* --- NEW: RENDER CONVERSATION PANEL --- */}
//         {isConversationActive && (
//           <AiConversationPanel
//             history={conversationHistory}
//             onSendMessage={handleSendMessage}
//             isReplying={isAiReplying}
//             userInput={userInput}
//             setUserInput={setUserInput}
//           />
//         )}

//         {/* Modals */}
//         {isModalOpen && (
//           <ImageModal
//             images={images}
//             currentIndex={currentImageIndex}
//             onClose={closeModal}
//             onNext={showNextImage}
//             onPrev={showPrevImage}
//           />
//         )}
//         {showShortcutsModal && <ShortcutsHelpModal shortcuts={shortcuts} onClose={() => setShowShortcutsModal(false)} />}
//         {showTemplateModal && <TemplateManagerModal user={user} existingModalities={Object.keys(templates)} onClose={() => setShowTemplateModal(false)} />}


//         {showSuggestionsModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
//               <div className="p-6 border-b">
//                 <h3 className="text-2xl font-bold text-gray-800 capitalize">
//                   {suggestionType === 'differentials' ? 'Suggested Differential Diagnoses' : 'Suggested Recommendations'}
//                 </h3>
//               </div>
//               <div className="p-6 overflow-y-auto flex-grow">
//                 {isSuggestionLoading ? (
//                   <div className="flex justify-center items-center h-full">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                   </div>
//                 ) : (
//                   <p className="text-gray-700 whitespace-pre-wrap">{aiSuggestions}</p>
//                 )}
//               </div>
//               <div className="p-4 bg-gray-50 border-t rounded-b-2xl flex justify-end space-x-3">
//                 <button onClick={() => setShowSuggestionsModal(false)} className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
//                   Close
//                 </button>
//                 <button onClick={appendSuggestionsToReport} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
//                   Append to Report
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//         {showMacroModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
//               <div className="p-6 border-b flex justify-between items-center">
//                 <h3 className="text-2xl font-bold text-gray-800">Manage Voice Macros</h3>
//                 <button onClick={() => setShowMacroModal(false)}><XCircle /></button>
//               </div>
//               <div className="p-6 overflow-y-auto flex-grow space-y-4">
//                 <div>
//                   <h4 className="font-bold text-lg mb-2">Add New Macro</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <input
//                       type="text"
//                       placeholder="Voice Command (e.g., 'normal abdomen')"
//                       value={newMacroCommand}
//                       onChange={(e) => setNewMacroCommand(e.target.value)}
//                       className="w-full p-2 border rounded-lg"
//                     />
//                     <textarea
//                       placeholder="Text to insert"
//                       value={newMacroText}
//                       onChange={(e) => setNewMacroText(e.target.value)}
//                       className="w-full p-2 border rounded-lg md:col-span-2"
//                       rows="3"
//                     ></textarea>
//                   </div>
//                   <button
//                     onClick={handleAddMacro}
//                     className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
//                   >
//                     Add Macro
//                   </button>
//                 </div>
//                 <hr />
//                 <div>
//                   <h4 className="font-bold text-lg mb-2">Existing Macros</h4>
//                   <div className="space-y-2">
//                     {macros.map((macro) => (
//                       <div key={macro.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
//                         <div>
//                           <p className="font-semibold">{macro.command}</p>
//                           <p className="text-sm text-gray-600 truncate">{macro.text}</p>
//                         </div>
//                         <button onClick={() => handleDeleteMacro(macro.id)} className="text-red-500 hover:text-red-700">
//                           <Trash2 />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//         <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center">
//             <button
//                 onClick={handleToggleListening}
//                 disabled={!isDictationSupported}
//                 title={isDictationSupported ? "Toggle Voice Dictation" : "Dictation not supported"}
//                 className={`w-16 h-16 rounded-full text-white flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110
//                     ${voiceStatus === 'listening' ? 'bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}
//                 `}
//             >
//                 <Mic size={28} />
//             </button>
//             {voiceStatus === 'listening' && (
//                 <div className="mt-2 text-center text-xs bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg max-w-xs">
//                     <p className="font-bold">Listening...</p>
//                     {interimTranscript && <p className="mt-1 italic">{interimTranscript}</p>}
//                 </div>
//             )}
//         </div>
//     </div>
//   );
// };
// export default App;

// IMPORTANT: This file contains JSX syntax. Please ensure it has a .jsx or .tsx extension (e.g., App.jsx) to avoid build errors.
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
    Upload, FileText, Clipboard, Settings, BrainCircuit, User, Calendar, Stethoscope, XCircle, 
    FileType, FileJson, Search, PlusCircle, MessageSquare, CheckCircle, ChevronLeft, ChevronRight, 
    Lightbulb, ListPlus, AlertTriangle, FileScan, Mic, Plus, Trash2, Bold, Italic, List, 
    ListOrdered, Pilcrow, BookOpen, Link as LinkIcon, Zap, Copy, UserCheck, LogOut, 
    ChevronDown, History, Image as ImageIcon, Menu, Eye, Wand2 // Added Wand2 icon
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import jsPDF from 'jspdf';
import { htmlToText } from 'html-to-text';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';
import {  Document,  Packer,  Paragraph,  TextRun,  HeadingLevel,  Table,  TableRow,  TableCell,  WidthType,  BorderStyle,} from 'docx';
import MeasurementsPanel from './components/panels/MeasurementsPanel.jsx';
import TemplateManagerModal from './components/modals/TemplateManagerModal.jsx';
import CollapsibleSection from './components/common/CollapsibleSection.jsx';
import DOMPurify from 'dompurify';

import { geminiTools } from './api/geminiTools.js'; // Import the tools
import { useVoiceAssistant } from './hooks/useVoiceAssistant.jsx'; // Import the new hook
import { LogoIcon } from './components/common/LogoIcon.jsx'; // <-- ADD THIS
import appLogo from './assets/aiRAD_logo.jpg'; // <-- ADD THIS LINE (and fix the path)

// --- DICOM Libraries via CDN (Required for the viewer) ---

const loadScript = (src, onLoad) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = onLoad;
  document.head.appendChild(script);
};

// --- Firebase Imports (unchanged from original code) ---
import { auth, db } from './firebase'; // Assuming firebase.js is set up
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, serverTimestamp, onSnapshot, query, deleteDoc, doc, getDoc, updateDoc, setDoc, orderBy, limit } from "firebase/firestore";
import Auth from './auth.jsx'; // Your Auth component

// NOTE: findings.js is assumed to be in the same directory.
import { localFindings } from './findings.js';


// --- Diamond Standard Templates ---
const templates = {
  "Ultrasound": {
    "Abdomen": "<h3>IMPRESSION:</h3><p>1. No sonographic evidence of significant abnormality in the upper abdomen.</p><h3>FINDINGS:</h3><p><strong>LIVER:</strong> Normal in size (spans __ cm), contour, and echotexture. No focal mass, cyst, or intrahepatic biliary dilatation. Hepatic veins are patent. The main portal vein shows normal hepatopetal flow.</p><p><strong>GALLBLADDER:</strong> Normal size and wall thickness (__ mm). No gallstones, sludge, or polyps. No pericholecystic fluid. Sonographic Murphy's sign is negative.</p><p><strong>COMMON BILE DUCT:</strong> Not dilated, measuring __ mm at the porta hepatis.</p><p><strong>PANCREAS:</strong> The visualized portions of the head, body, and tail are unremarkable. No mass or ductal dilatation.</p><p><strong>SPLEEN:</strong> Normal in size (measures __ x __ cm) and echotexture. No focal lesions.</p><p><strong>KIDNEYS:</strong></p><p>Right Kidney: Measures __ x __ cm with normal cortical thickness. Normal morphology and echotexture. No hydronephrosis, calculus, or mass.</p><p>Left Kidney: Measures __ x __ cm with normal cortical thickness. Normal morphology and echotexture. No hydronephrosis, calculus, or mass.</p><p><strong>ADRENAL GLANDS:</strong> The adrenal areas are unremarkable.</p><p><strong>AORTA & IVC:</strong> Visualized portions are of normal caliber. No evidence of aneurysm or thrombosis.</p><p><strong>ABDOMINAL LYMPHATICS:</strong> No significant retroperitoneal or mesenteric lymphadenopathy.</p><p><strong>ASCITES:</strong> None.</p>",
    "Pelvis": "<h3>IMPRESSION:</h3><p>1. Unremarkable ultrasound of the pelvis.</p><h3>FINDINGS:</h3><p><strong>URINARY BLADDER:</strong> Adequately distended, with a normal wall thickness. The lumen is anechoic. No calculi, masses, or diverticula identified. Ureteric jets are visualized bilaterally. Post-void residual is __ ml.</p><p><em>(For Male)</em></p><p><strong>PROSTATE:</strong> Normal in size, measuring __ x __ x __ cm (Volume: __ cc). The echotexture is homogeneous. No suspicious nodules. The seminal vesicles are unremarkable.</p><p><em>(For Female)</em></p><p><strong>UTERUS:</strong> [Anteverted/Retroverted] and normal in size, measuring __ x __ x __ cm. The myometrium shows homogeneous echotexture. No fibroids identified.</p><p><strong>ENDOMETRIUM:</strong> Homogeneous and measures __ mm in thickness, which is appropriate for the patient's menstrual/hormonal status.</p><p><strong>OVARIES:</strong></p><p>Right Ovary: Measures __ x __ x __ cm. Normal follicular activity. No cysts or masses.</p><p>Left Ovary: Measures __ x __ x __ cm. Normal follicular activity. No cysts or masses.</p><p><strong>ADNEXA:</strong> No adnexal masses or fluid collections.</p><p><strong>CUL-DE-SAC:</strong> No free fluid.</p>",
    "Scrotum": "<h3>IMPRESSION:</h3><p>1. No sonographic evidence of testicular torsion, mass, or significant hydrocele.</p><h3>FINDINGS:</h3><p><strong>RIGHT TESTICLE:</strong> Measures __ x __ x __ cm. Homogeneous echotexture. No focal mass or calcification. Normal arterial and venous flow on color Doppler imaging.</p><p><strong>RIGHT EPIDIDYMIS:</strong> The head, body, and tail are normal in size and echotexture. No cysts or inflammation. Normal vascularity.</p><p><strong>LEFT TESTICLE:</strong> Measures __ x __ x __ cm. Homogeneous echotexture. No focal mass or calcification. Normal arterial and venous flow on color Doppler imaging.</p><p><strong>LEFT EPIDIDYMIS:</strong> The head, body, and tail are normal in size and echotexture. No cysts or inflammation. Normal vascularity.</p><p><strong>ADDITIONAL FINDINGS:</strong> No significant hydrocele. No varicocele. The scrotal skin thickness is normal. No inguinal hernia identified.</p>",
    "Thyroid": "<h3>IMPRESSION:</h3><p>1. Normal ultrasound of the thyroid gland and neck.</p><h3>FINDINGS:</h3><p><strong>RIGHT LOBE:</strong> Measures __ x __ x __ cm. Homogeneous echotexture. No nodules, cysts, or calcifications. Normal vascularity on color Doppler.</p><p><strong>LEFT LOBE:</strong> Measures __ x __ x __ cm. Homogeneous echotexture. No nodules, cysts, or calcifications. Normal vascularity on color Doppler.</p><p><strong>ISTHMUS:</strong> Measures __ mm in thickness. Unremarkable.</p><p><strong>NECK:</strong> The visualized major cervical vessels are patent. The parotid and submandibular glands are unremarkable. No significant cervical lymphadenopathy or other masses identified.</p>",
    "Renal / KUB": "<h3>IMPRESSION:</h3><p>1. No evidence of hydronephrosis, renal calculi, or focal renal masses.</p><h3>FINDINGS:</h3><p><strong>RIGHT KIDNEY:</strong> Measures __ x __ cm with a cortical thickness of __ cm. Normal size, shape, and echotexture. No hydronephrosis, calculus, or mass. Corticomedullary differentiation is well-maintained.</p><p><strong>LEFT KIDNEY:</strong> Measures __ x __ cm with a cortical thickness of __ cm. Normal size, shape, and echotexture. No hydronephrosis, calculus, or mass. Corticomedullary differentiation is well-maintained.</p><p><strong>URETERS:</strong> The visualized portions of the ureters are not dilated. Ureteric jets are visualized bilaterally from the trigone.</p><p><strong>URINARY BLADDER:</strong> Adequately distended. Normal wall thickness. The lumen is anechoic. No calculi or masses. Post-void residual volume is __ mL.</p>",
    "Carotid Doppler": "<h3>IMPRESSION:</h3><p>1. No evidence of hemodynamically significant stenosis or plaque in the bilateral carotid systems.</p><h3>FINDINGS:</h3><p>B-mode, color Doppler, and spectral Doppler interrogation of the common, internal, and external carotid arteries were performed bilaterally.</p><p><strong>RIGHT CAROTID SYSTEM:</strong></p><p>CCA: PSV __ cm/s, EDV __ cm/s. No significant plaque. Intima-media thickness is normal.</p><p>ICA: PSV __ cm/s, EDV __ cm/s. No significant plaque. ICA/CCA ratio is normal.</p><p>ECA: Normal flow pattern. No significant plaque.</p><p>Vertebral Artery: Antegrade flow with normal waveform.</p><p><strong>LEFT CAROTID SYSTEM:</strong></p><p>CCA: PSV __ cm/s, EDV __ cm/s. No significant plaque. Intima-media thickness is normal.</p><p>ICA: PSV __ cm/s, EDV __ cm/s. No significant plaque. ICA/CCA ratio is normal.</p><p>ECA: Normal flow pattern. No significant plaque.</p><p>Vertebral Artery: Antegrade flow with normal waveform.</p>",
    "Lower Limb Venous Doppler": "<h3>IMPRESSION:</h3><p>1. No sonographic evidence of deep vein thrombosis (DVT) in the [right/left] lower extremity from the common femoral to the calf veins.</p><h3>FINDINGS:</h3><p>A complete duplex ultrasound of the [right/left] lower extremity deep venous system was performed with compression and spectral Doppler analysis.</p><p><strong>COMMON FEMORAL VEIN:</strong> Patent, compressible, with normal phasic flow and augmentation.</p><p><strong>FEMORAL VEIN:</strong> Patent, compressible, with normal phasic flow and augmentation.</p><p><strong>POPLITEAL VEIN:</strong> Patent, compressible, with normal phasic flow and augmentation.</p><p><strong>POSTERIOR TIBIAL VEINS:</strong> Patent and compressible.</p><p><strong>PERONEAL VEINS:</strong> Patent and compressible.</p><p><strong>GREAT SAPHENOUS VEIN:</strong> The visualized portions are patent and compressible.</p>",
    "Lower Limb Arterial Doppler": "<h3>IMPRESSION:</h3><p>1. Normal triphasic waveforms throughout the [right/left] lower extremity arterial system. No evidence of significant stenosis or occlusion.</p><h3>FINDINGS:</h3><p>Ankle-Brachial Index (ABI): [Right/Left] __</p><p><strong>COMMON FEMORAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>SUPERFICIAL FEMORAL ARTERY:</strong> Triphasic waveform throughout its visualized length. PSV __ cm/s.</p><p><strong>POPLITEAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>POSTERIOR TIBIAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>DORSALIS PEDIS ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p>",
    "Upper Limb Venous Doppler": "<h3>IMPRESSION:</h3><p>1. No sonographic evidence of deep vein thrombosis (DVT) in the [right/left] upper extremity.</p><h3>FINDINGS:</h3><p>A complete duplex ultrasound of the [right/left] upper extremity deep venous system was performed.</p><p><strong>INTERNAL JUGULAR VEIN:</strong> Patent, fully compressible, with normal phasic flow.</p><p><strong>SUBCLAVIAN VEIN:</strong> Patent, fully compressible, with normal phasic flow.</p><p><strong>AXILLARY VEIN:</strong> Patent, fully compressible, with normal phasic flow.</p><p><strong>BRACHIAL VEIN:</strong> Patent and fully compressible.</p><p><strong>BASILIC & CEPHALIC VEINS:</strong> Patent and fully compressible.</p>",
    "Upper Limb Arterial Doppler": "<h3>IMPRESSION:</h3><p>1. Normal triphasic waveforms throughout the [right/left] upper extremity arterial system. No evidence of significant stenosis or occlusion.</p><h3>FINDINGS:</h3><p><strong>SUBCLAVIAN ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>AXILLARY ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>BRACHIAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>RADIAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>ULNAR ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p>",
    "Soft Tissue": "<h3>IMPRESSION:</h3><p>1. Unremarkable ultrasound of the soft tissues of the [location]. No discrete fluid collection, mass, or evidence of inflammation.</p><h3>FINDINGS:</h3><p>Ultrasound of the [location] demonstrates normal skin, subcutaneous fat, and underlying muscle planes. There is no evidence of a focal mass, cyst, or abscess. No abnormal vascularity is seen on color Doppler imaging. No significant surrounding edema.</p>",
    "Obstetrics (1st Trimester)": "<h3>IMPRESSION:</h3><p>1. Single live intrauterine pregnancy at an estimated __ weeks __ days gestation.</p><h3>FINDINGS:</h3><p><strong>UTERUS:</strong> The uterus is gravid and appears normal in contour and echotexture.</p><p><strong>GESTATIONAL SAC:</strong> A single gestational sac is seen within the uterine cavity. Mean sac diameter is __ mm.</p><p><strong>YOLK SAC:</strong> Present and normal in appearance.</p><p><strong>EMBRYO:</strong> A single embryo is identified.</p><p><strong>CROWN-RUMP LENGTH (CRL):</strong> __ mm, corresponding to a gestational age of __ weeks __ days.</p><p><strong>FETAL HEART RATE:</strong> __ bpm.</p><p><strong>ADNEXA:</strong> The ovaries are normal in appearance. No adnexal masses or free fluid.</p><p><strong>CERVIX:</strong> Appears long and closed. Cervical length is __ cm.</p>",
    "Obstetrics (2nd Trimester)": "<h3>IMPRESSION:</h3><p>1. Single live intrauterine pregnancy at an estimated __ weeks __ days gestation. No gross fetal anomalies identified.</p><h3>FINDINGS:</h3><p><strong>FETAL BIOMETRY:</strong></p><p>Biparietal Diameter (BPD): __ mm (__ w __ d)</p><p>Head Circumference (HC): __ mm (__ w __ d)</p><p>Abdominal Circumference (AC): __ mm (__ w __ d)</p><p>Femur Length (FL): __ mm (__ w __ d)</p><p><strong>ESTIMATED FETAL WEIGHT:</strong> __ grams (__th percentile).</p><p><strong>FETAL ANATOMY SURVEY:</strong> Head, face, neck, spine, heart (4-chamber view and outflow tracts), abdomen (stomach, kidneys, bladder), and limbs appear sonographically unremarkable.</p><p><strong>PLACENTA:</strong> [Anterior/Posterior], Grade __. No previa. Appears normal in thickness and texture.</p><p><strong>AMNIOTIC FLUID:</strong> Normal. Amniotic Fluid Index (AFI) is __ cm.</p><p><strong>FETAL HEART RATE:</strong> __ bpm.</p>",
    "Obstetrics (3rd Trimester)": "<h3>IMPRESSION:</h3><p>1. Single live intrauterine pregnancy in cephalic presentation, at an estimated __ weeks __ days gestation. Fetal growth appears appropriate.</p><h3>FINDINGS:</h3><p><strong>FETAL BIOMETRY:</strong></p><p>Biparietal Diameter (BPD): __ mm (__ w __ d)</p><p>Head Circumference (HC): __ mm (__ w __ d)</p><p>Abdominal Circumference (AC): __ mm (__ w __ d)</p><p>Femur Length (FL): __ mm (__ w __ d)</p><p><strong>ESTIMATED FETAL WEIGHT:</strong> __ grams (__th percentile).</p><p><strong>PLACENTA:</strong> [Anterior/Posterior/Fundal], Grade __. No previa.</p><p><strong>AMNIOTIC FLUID:</strong> Normal. Amniotic Fluid Index (AFI) is __ cm.</p><p><strong>FETAL PRESENTATION:</strong> Cephalic.</p><p><strong>FETAL HEART RATE:</strong> __ bpm, with normal rhythm.</p>"
  },
  "X-Ray": {
    "Chest": "<h3>IMPRESSION:</h3><p>1. No acute cardiopulmonary process.</p><h3>FINDINGS:</h3><p><strong>LUNGS AND PLEURA:</strong> The lungs are well-expanded and clear. No focal consolidation, pneumothorax, or pleural effusion. The pulmonary vasculature is normal.</p><p><strong>HEART AND MEDIASTINUM:</strong> The cardiomediastinal silhouette is within normal limits for size and contour. The hila are normal.</p><p><strong>AIRWAYS:</strong> The trachea is midline. The major airways are patent.</p><p><strong>BONES:</strong> The visualized osseous structures, including the ribs, clavicles, and thoracic spine, are unremarkable.</p><p><strong>SOFT TISSUES:</strong> The soft tissues of the chest wall are unremarkable.</p>",
    "Abdomen (KUB)": "<h3>IMPRESSION:</h3><p>1. Unremarkable abdominal radiograph.</p><h3>FINDINGS:</h3><p><strong>BOWEL GAS PATTERN:</strong> Nonspecific bowel gas pattern. No evidence of bowel obstruction or ileus. No pneumoperitoneum.</p><p><strong>CALCIFICATIONS:</strong> No abnormal calcifications are seen in the expected locations of the kidneys, ureters, or bladder.</p><p><strong>OSSEOUS STRUCTURES:</strong> The visualized portions of the lower ribs, lumbar spine, and pelvis are unremarkable for acute fracture or dislocation.</p><p><strong>SOFT TISSUES:</strong> The psoas margins are symmetric. The flank stripes are maintained.</p>",
    "Cervical Spine": "<h3>IMPRESSION:</h3><p>1. No acute fracture or malalignment.</p><p>2. Mild degenerative changes.</p><h3>FINDINGS:</h3><p><strong>VIEWS:</strong> AP, lateral, and odontoid views of the cervical spine.</p><p><strong>ALIGNMENT:</strong> Normal cervical lordosis. No evidence of anterolisthesis or retrolisthesis.</p><p><strong>VERTEBRAL BODIES:</strong> Vertebral body heights are maintained. No acute fracture is identified.</p><p><strong>DISC SPACES:</strong> Mild narrowing at [C5-C6]. Otherwise, disc spaces are preserved.</p><p><strong>POSTERIOR ELEMENTS:</strong> The facet joints and posterior elements are unremarkable.</p><p><strong>SOFT TISSUES:</strong> The prevertebral soft tissues are of normal thickness.</p>",
    "Lumbar Spine": "<h3>IMPRESSION:</h3><p>1. No acute fracture or malalignment.</p><p>2. Mild degenerative changes.</p><h3>FINDINGS:</h3><p><strong>VIEWS:</strong> AP and lateral views of the lumbar spine.</p><p><strong>ALIGNMENT:</strong> Normal lumbar lordosis. No evidence of listhesis.</p><p><strong>VERTEBRAL BODIES:</strong> Vertebral body heights are maintained. No acute compression fracture.</p><p><strong>DISC SPACES:</strong> Mild narrowing at [L4-L5] and [L5-S1].</p><p><strong>POSTERIOR ELEMENTS:</strong> The pedicles, facet joints, and posterior elements are intact.</p><p><strong>SACROILIAC JOINTS:</strong> The visualized sacroiliac joints are unremarkable.</p>",
    "Shoulder": "<h3>IMPRESSION:</h3><p>1. No acute fracture or dislocation.</p><h3>FINDINGS:</h3><p><strong>VIEWS:</strong> AP and axillary lateral views of the [right/left] shoulder.</p><p><strong>GLENOHUMERAL JOINT:</strong> The glenohumeral joint is congruous. No evidence of dislocation or subluxation. The joint space is preserved.</p><p><strong>ACROMIOCLAVICULAR JOINT:</strong> The AC joint is unremarkable.</p><p><strong>BONES:</strong> The humeral head, glenoid, acromion, and clavicle are intact. No acute fracture identified.</p><p><strong>SOFT TISSUES:</strong> No significant soft tissue swelling or abnormal calcifications.</p>",
  },
  "CT": {
    "Head (Non-contrast)": "<h3>IMPRESSION:</h3><p>1. No evidence of acute intracranial hemorrhage, territorial infarct, or mass effect.</p><h3>FINDINGS:</h3><p><strong>BRAIN PARENCHYMA:</strong> No evidence of acute intracranial hemorrhage. Normal gray-white matter differentiation. No evidence of acute territorial ischemia or mass lesion.</p><p><strong>VENTRICLES AND CISTERNS:</strong> The ventricular system is normal in size and configuration. The basal cisterns are patent.</p><p><strong>EXTRACRANIAL STRUCTURES:</strong> The visualized paranasal sinuses and mastoid air cells are clear. The orbits are unremarkable.</p><p><strong>SKULL AND CALVARIUM:</strong> No acute fracture identified.</p>",
    "Chest (with Contrast)": "<h3>IMPRESSION:</h3><p>1. No acute intrathoracic process. No evidence of pulmonary embolism.</p><h3>FINDINGS:</h3><p><strong>LUNGS AND PLEURA:</strong> The lungs are well-aerated. No focal consolidation, nodules, or masses. No pneumothorax or pleural effusion.</p><p><strong>MEDIASTINUM AND HILA:</strong> The cardiomediastinal silhouette is normal. No mediastinal or hilar lymphadenopathy. The trachea and main bronchi are patent.</p><p><strong>HEART AND GREAT VESSELS:</strong> The heart is not enlarged. The thoracic aorta and main pulmonary arteries are of normal caliber and show normal opacification. No central pulmonary embolism. No pericardial effusion.</p><p><strong>CHEST WALL AND BONES:</strong> The visualized osseous structures and soft tissues of the chest wall are unremarkable. No acute fractures.</p><p><strong>UPPER ABDOMEN:</strong> The visualized portions of the liver, spleen, and adrenal glands are unremarkable.</p>",
    "Abdomen/Pelvis (with Contrast)": "<h3>IMPRESSION:</h3><p>1. No acute intra-abdominal or pelvic process.</p><h3>FINDINGS:</h3><p><strong>LIVER:</strong> Normal in size, contour, and enhances homogeneously. No focal hepatic lesions.</p><p><strong>GALLBLADDER AND BILIARY SYSTEM:</strong> The gallbladder is unremarkable. No intrahepatic or extrahepatic biliary dilatation.</p><p><strong>PANCREAS:</strong> Unremarkable in appearance. No inflammation or mass.</p><p><strong>SPLEEN:</strong> Normal in size and enhances homogeneously.</p><p><strong>ADRENAL GLANDS:</strong> Unremarkable.</p><p><strong>KIDNEYS AND URETERS:</strong> The kidneys are normal in size, position, and enhance symmetrically. No hydronephrosis or renal masses. The ureters are not dilated.</p><p><strong>BOWEL AND MESENTERY:</strong> The visualized portions of the small and large bowel are unremarkable. No bowel wall thickening or obstruction. The appendix is visualized and normal. The mesentery is clear.</p><p><strong>PELVIC ORGANS:</strong> The urinary bladder is unremarkable. The uterus and ovaries (female) or prostate and seminal vesicles (male) are unremarkable.</p><p><strong>VASCULATURE:</strong> The abdominal aorta and IVC are of normal caliber. No evidence of aneurysm or thrombosis.</p><p><strong>BONES AND SOFT TISSUES:</strong> The visualized osseous structures and soft tissues are unremarkable.</p>",
  },
  "MRI": {
    "Brain (Non-contrast)": "<h3>IMPRESSION:</h3><p>1. No evidence of acute infarct, intracranial hemorrhage, or mass lesion.</p><h3>FINDINGS:</h3><p><strong>PARENCHYMA:</strong> No evidence of acute restricted diffusion to suggest ischemia. No abnormal susceptibility artifact to suggest hemorrhage. Normal gray-white matter differentiation. No space-occupying lesion or significant white matter disease.</p><p><strong>VENTRICLES AND CISTERNS:</strong> The ventricular system and sulci are normal for the patient's age. The basal cisterns are patent.</p><p><strong>VASCULAR STRUCTURES:</strong> Major intracranial vascular flow voids are present and patent.</p><p><strong>EXTRACRANIAL STRUCTURES:</strong> The visualized orbits, paranasal sinuses, and mastoid air cells are unremarkable.</p>",
    "Knee (Non-contrast)": "<h3>IMPRESSION:</h3><p>1. No acute meniscal or ligamentous tear.</p><h3>FINDINGS:</h3><p><strong>MENISCI:</strong></p><p>Medial Meniscus: Intact. No tear.</p><p>Lateral Meniscus: Intact. No tear.</p><p><strong>LIGAMENTS:</strong></p><p>Anterior Cruciate Ligament (ACL): Intact.</p><p>Posterior Cruciate Ligament (PCL): Intact.</p><p>Medial Collateral Ligament (MCL): Intact.</p><p>Lateral Collateral Ligament (LCL) Complex: Intact.</p><p><strong>CARTILAGE:</strong> The articular cartilage is preserved in the patellofemoral and tibiofemoral compartments.</p><p><strong>BONE MARROW:</strong> No evidence of fracture, contusion, or aggressive bone lesion.</p><p><strong>EXTENSOR MECHANISM:</strong> The quadriceps and patellar tendons are intact.</p><p><strong>JOINT FLUID:</strong> Physiologic amount of joint fluid.</p>",
    "Lumbar Spine (Non-contrast)": "<h3>IMPRESSION:</h3><p>1. No evidence of acute disc herniation, spinal stenosis, or nerve root compression.</p><p>2. Mild degenerative disc disease.</p><h3>FINDINGS:</h3><p><strong>ALIGNMENT:</strong> Normal lumbar lordosis. No subluxation.</p><p><strong>VERTEBRAL BODIES:</strong> Vertebral body heights and marrow signal are maintained. No acute fracture.</p><p><strong>DISCS:</strong></p><p>[L1-L2 through L3-L4]: No significant disc bulge or herniation.</p><p>L4-L5]: Mild disc bulge without significant canal or foraminal stenosis.</p><p>[L5-S1]: Mild disc desiccation and height loss without significant herniation.</p><p><strong>SPINAL CANAL AND FORAMINA:</strong> The central canal and neural foramina are patent at all levels.</p><p><strong>CONUS MEDULLARIS:</strong> The conus medullaris terminates at [L1] and is normal in signal.</p><p><strong>PARASPINAL SOFT TISSUES:</strong> Unremarkable.</p>",
  }
};

// --- REDESIGNED COMPONENT: AiConversationPanel ---
const AiConversationPanel = ({ history, onSendMessage, isReplying, userInput, setUserInput }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = () => {
    if (userInput.trim()) {
      onSendMessage(userInput);
      setUserInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800/50 rounded-lg">
      <div className="p-4 h-full overflow-y-auto flex flex-col space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg p-3 max-w-lg shadow-md ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-200'}`}>
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        ))}
        {isReplying && (
          <div className="flex justify-start">
            <div className="rounded-lg p-3 bg-slate-700 text-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-3 border-t border-slate-700">
        <div className="flex items-center space-x-2">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up..."
            className="w-full p-2 border border-slate-600 bg-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 transition resize-none text-gray-200 placeholder-gray-500"
            rows="2"
            disabled={isReplying}
          />
          <button
            onClick={handleSend}
            disabled={isReplying || !userInput.trim()}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-500 transition disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// ====================================================================================
// ============================= START OF HELPER COMPONENTS =========================
// ====================================================================================

// const CollapsibleSidePanel = ({ title, icon: Icon, children, defaultOpen = false }) => {
//   const [isOpen, setIsOpen] = useState(defaultOpen);
//   return (
//     <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
//       <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left hover:bg-slate-700/50 transition-colors focus:outline-none">
//         <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">{Icon && <Icon size={14} className="mr-2" />}{title}</h2>
//         <ChevronDown size={18} className={`text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
//       </button>
//       <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}><div className="p-4 border-t border-slate-700/50">{children}</div></div>
//     </div>
//   );
// };



// --- REDESIGNED COMPONENT: SidePanel ---
const SidePanel = ({ title, icon: Icon, children }) => (
  <div className="space-y-4">
    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
      {Icon && <Icon size={14} className="mr-2" />}
      {title}
    </h2>
    <div className="p-4 bg-slate-800/50 rounded-lg space-y-4">
        {children}
    </div>
  </div>
);



// --- REDESIGNED COMPONENT: MenuBar ---
// --- REPLACE your old MenuBar with this ---

const MenuBar = ({ 
  editor, 
  voiceStatus, 
  isDictationSupported, 
  handleToggleListening,
  interimTranscript 
}) => {
  if (!editor) return null;
  
  return (
    // Make the menubar a flex container with space-between
    <div className="flex items-center justify-between space-x-1 p-2 bg-slate-900 border-b border-slate-700 rounded-t-lg">
      
      {/* Group for Tiptap buttons */}
      <div className="flex items-center space-x-1">
        {['bold', 'italic', 'paragraph', 'bulletList', 'orderedList'].map(type => {
          const icons = { bold: Bold, italic: Italic, paragraph: Pilcrow, bulletList: List, orderedList: ListOrdered };
          const actions = {
            bold: () => editor.chain().focus().toggleBold().run(),
            italic: () => editor.chain().focus().toggleItalic().run(),
            paragraph: () => editor.chain().focus().setParagraph().run(),
            bulletList: () => editor.chain().focus().toggleBulletList().run(),
            orderedList: () => editor.chain().focus().toggleOrderedList().run(),
          };
          const Icon = icons[type];
          return (
            <button
              key={type}
              onClick={actions[type]}
              className={`p-2 rounded ${editor.isActive(type) ? 'bg-slate-700 text-white' : 'text-gray-400 hover:bg-slate-700 hover:text-white'}`}
              title={type.charAt(0).toUpperCase() + type.slice(1)}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>

      {/* Group for Voice Assistant */}
      <div className="flex items-center space-x-3">
        {/* Show interim transcript if listening */}
        {(voiceStatus === 'listening' || voiceStatus === 'processing') && interimTranscript && (
          <p className="text-sm text-gray-400 italic hidden md:block">
            {interimTranscript}
          </p>
        )}
        
        {/* The Voice Button */}
        <button
          onClick={handleToggleListening}
          disabled={!isDictationSupported}
          title={isDictationSupported ? "Toggle Voice Dictation" : "Dictation not supported"}
          className={`w-10 h-10 rounded-full text-white flex items-center justify-center transition-all
              ${voiceStatus === 'listening' ? 'bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}
              ${voiceStatus === 'processing' ? 'bg-yellow-500 animate-spin' : ''}
              disabled:bg-slate-700 disabled:cursor-not-allowed
          `}
        >
          {voiceStatus === 'listening' && <Mic size={20} />}
          {voiceStatus === 'processing' && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
          {voiceStatus === 'idle' && <Mic size={20} />}
        </button>
      </div>

    </div>
  );
};

// --- UNIFIED COMPONENT: AlertPanel (UNCHANGED) ---
// THIS IS THE CORRECT DEFINITION TO REPLACE (around line 4519)
const AlertPanel = ({ alertData, onAcknowledge, onInsertMacro, onPrepareNotification, onFix, onProceed, onInsertGuideline }) => { // 1. ADD onInsertGuideline HERE
  if (!alertData) return null;

  const isCritical = alertData.type === 'critical';
  const isFixable = alertData.type === 'inconsistency';
  const isMissingInfo = alertData.type === 'missing_info';
  const isGuideline = alertData.type === 'guideline'; // 2. Add isGuideline check

  const config = {
    critical: {
      bgColor: 'bg-red-900/50 border-red-500',
      textColor: 'text-red-200',
      iconColor: 'text-red-400',
      Icon: AlertTriangle,
      message: 'Please review and take appropriate action immediately.',
    },
    inconsistency: {
      bgColor: 'bg-yellow-900/50 border-yellow-500',
      textColor: 'text-yellow-200',
      iconColor: 'text-yellow-400',
      Icon: AlertTriangle,
      title: 'Inconsistency Detected',
      message: alertData.message,
    },
    missing_info: {
      bgColor: 'bg-orange-900/50 border-orange-500',
      textColor: 'text-orange-200',
      iconColor: 'text-orange-400',
      Icon: AlertTriangle,
      title: 'Incomplete Report',
      message: alertData.message,
    },
    // 3. Add this new 'guideline' object
    guideline: {
      bgColor: 'bg-blue-900/50 border-blue-500',
      textColor: 'text-blue-200',
      iconColor: 'text-blue-400',
      Icon: Lightbulb, // Using Lightbulb icon
      title: 'AI Guideline Suggestion',
      message: alertData.message, // This will be the finding
    },
  };

  const currentConfig = config[alertData.type];
  if (!currentConfig) return null;

  const title = isCritical
    ? `Critical Finding Detected: ${alertData.data?.findingName}`
    : currentConfig.title;

  return (
    <div className={`${currentConfig.bgColor} border-l-4 ${currentConfig.textColor} p-4 rounded-lg shadow-md mb-4`} role="alert">
      <div className="flex items-start">
        <div className="py-1">
          <currentConfig.Icon className={`h-6 w-6 ${currentConfig.iconColor} mr-4`} />
        </div>
        <div className="flex-grow">
          <p className="font-bold">{title}</p>
          <p className="text-sm">{currentConfig.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {isCritical && (
              <>
                <button
                  onClick={onInsertMacro}
                  className="bg-red-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-red-700 transition text-sm flex items-center"
                >
                  <PlusCircle size={16} className="mr-1.5" /> Add to Report
                </button>
                <button
                  onClick={onPrepareNotification}
                  className="bg-yellow-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-yellow-600 transition text-sm flex items-center"
                >
                  <Copy size={16} className="mr-1.5" /> Prepare Notification
                </button>
              </>
            )}
            {isFixable && (
              <>
                <button
                  onClick={onFix}
                  className="bg-green-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-green-700 transition text-sm flex items-center"
                >
                  <CheckCircle size={16} className="mr-1.5" /> Fix Issue
                </button>
                <button
                  onClick={onAcknowledge}
                  className="bg-slate-600 text-slate-100 font-bold py-1 px-3 rounded-lg hover:bg-slate-500 transition text-sm flex items-center"
                >
                  <XCircle size={16} className="mr-1.5" /> Ignore
                </button>
              </>
            )}
            {isMissingInfo && (
              <>
                <button
                  onClick={onProceed}
                  className="bg-orange-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-orange-700 transition text-sm flex items-center"
                >
                  <CheckCircle size={16} className="mr-1.5" /> Proceed Anyway
                </button>
                <button
                  onClick={onAcknowledge}
                  className="bg-slate-600 text-slate-100 font-bold py-1 px-3 rounded-lg hover:bg-slate-500 transition text-sm flex items-center"
                >
                  <ChevronLeft size={16} className="mr-1.5" /> Go Back
                </button>
              </>
            )}
            
            {/* 4. Add this new button block for guidelines */}
            {isGuideline && (
              <>
                <button
                  onClick={onInsertGuideline} // This line was causing the error
                  className="bg-blue-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-blue-700 transition text-sm flex items-center"
                >
                  <PlusCircle size={16} className="mr-1.5" /> Insert Recommendation
                </button>
                <button
                  onClick={onAcknowledge}
                  className="bg-slate-600 text-slate-100 font-bold py-1 px-3 rounded-lg hover:bg-slate-500 transition text-sm flex items-center"
                >
                  <XCircle size={16} className="mr-1.5" /> Ignore
                </button>
              </>
            )}
            
          </div>
        </div>
        {/* 5. Update this final condition */}
        { (isCritical || isMissingInfo || isGuideline) && (
          <button onClick={onAcknowledge} className={`ml-4 ${currentConfig.iconColor} hover:${currentConfig.textColor}`}>
            <XCircle size={22} />
          </button>
        )}
      </div>
    </div>
  );
};


// --- REDESIGNED COMPONENT: AiSuggestedMeasurementsPanel ---
const AiSuggestedMeasurementsPanel = ({ measurements, onInsert, onClear }) => {
  if (!measurements || measurements.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-800">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-bold text-blue-300 flex items-center">
          <Zap size={16} className="mr-2" />AI Suggestions
        </h3>
        <button onClick={onClear} className="text-gray-500 hover:text-gray-300">
          <XCircle size={20} />
        </button>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
        {measurements.map((item, index) => (
          <div key={index} className="bg-slate-800 p-2 rounded-md flex items-center justify-between shadow-sm">
            <div>
              <span className="font-semibold text-gray-200 text-sm">{item.finding}:</span>
              <span className="ml-2 text-gray-400 text-sm">{item.value}</span>
            </div>
            <button
              onClick={() => onInsert(item.finding, item.value)}
              className="bg-blue-600/50 text-blue-200 font-bold py-1 px-2 rounded-md hover:bg-blue-600 transition text-xs flex items-center"
            >
              <Plus size={14} className="mr-1" /> Insert
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- REDESIGNED COMPONENT: RecentReportsPanel ---
// In App.jsx, replace the old RecentReportsPanel with this one

const RecentReportsPanel = ({ onSelectReport, user }) => {
  const [recentReports, setRecentReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "reports"), orderBy("createdAt", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reports = [];
      querySnapshot.forEach((doc) => {
        reports.push({ id: doc.id, ...doc.data() });
      });
      setRecentReports(reports);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  return (
     <CollapsibleSidePanel title="Recent Reports" icon={History} defaultOpen={false}>
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading reports...</p>
      ) : recentReports.length > 0 ? (
        <div className="space-y-2">
          {recentReports.map(report => (
            <button
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="w-full text-left p-2 bg-slate-700/50 hover:bg-slate-700 rounded-md border border-transparent hover:border-slate-600 transition"
            >
              <p className="font-semibold text-sm text-gray-200">{report.patientName}</p>
              <p className="text-xs text-gray-500">{report.examDate}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No recent reports found.</p>
      )}
     </CollapsibleSidePanel>
  );
};



// --- MODAL COMPONENTS (Styling adjusted for dark mode, but otherwise unchanged) ---

const ShortcutsHelpModal = ({ shortcuts, onClose }) => {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifierKey = isMac ? '⌘' : 'Ctrl';
  const altKey = isMac ? '⌥' : 'Alt';
  const renderKey = (key) => <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-200 bg-slate-600 border border-slate-500 rounded-md">{key}</kbd>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-100 flex items-center"><Zap size={18} className="mr-3 text-blue-400"/>Keyboard Shortcuts</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><XCircle /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(shortcuts).map(([action, config]) => (
              <div key={action} className="flex justify-between items-center">
                <span className="text-gray-300">{config.label}</span>
                <div className="flex items-center space-x-1">
                  {config.ctrlOrCmd && renderKey(modifierKey)}
                  {config.alt && renderKey(altKey)}
                  {renderKey(config.key.toUpperCase())}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const KnowledgeLookupPanel = ({ result, onClose, onInsert }) => {
  if (!result) return null;

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-200 flex items-center">
          <BrainCircuit className="mr-3 text-green-400" />
          {result.conditionName}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
          <XCircle size={22} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4 prose prose-sm prose-invert max-w-none prose-headings:text-green-300 prose-a:text-blue-400">
          <div dangerouslySetInnerHTML={{ __html: result.summary }} />
        {result.keyImagingFeatures && result.keyImagingFeatures.length > 0 && (
          <div>
            <h3>Key Imaging Features</h3>
            <ul>
              {result.keyImagingFeatures.map((feature, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: feature.replace(/<\/?li>/g, '') }} />
              ))}
            </ul>
          </div>
        )}
        {result.differentialDiagnosis && result.differentialDiagnosis.length > 0 && (
          <div>
            <h3>Differential Diagnosis</h3>
            <ul>
              {result.differentialDiagnosis.map((dx, index) => (
                <li key={index}>{dx}</li>
              ))}
            </ul>
          </div>
        )}
         {result.sources && result.sources.length > 0 && (
          <div>
            <h4 className="flex items-center"><BookOpen size={16} className="mr-2"/>Sources</h4>
            <ul>
              {result.sources.map((source, index) => (
                <li key={index}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.name} <LinkIcon size={12} className="inline-block ml-1"/>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-700">
        <button
          onClick={() => { 
const contentToInsert = `
              <h4>Summary</h4>
              ${result.summary}
              <h4>Key Imaging Features</h4>
              <ul>${result.keyImagingFeatures.join('')}</ul>
            `;
            onInsert(contentToInsert);}}
          className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition flex items-center justify-center"
        >
          <PlusCircle size={18} className="mr-2" /> Insert into Report
        </button>
      </div>
    </div>
  );
};

// In App.jsx, add this new component definition

const CollapsibleSidePanel = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 text-left hover:bg-slate-700/50 transition-colors focus:outline-none"
      >
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
          {Icon && <Icon size={14} className="mr-2" />}
          {title}
        </h2>
        <ChevronDown
          size={18}
          className={`text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {/* The content area with collapse/expand transition */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
      >
        <div className="p-4 border-t border-slate-700/50">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- HELPER FUNCTION to escape characters for regex (UNCHANGED)
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// --- REDESIGNED Skeleton Loader Components ---
const SearchResultSkeleton = () => (
  <div className="mt-3 space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-4 bg-slate-700/50 rounded-lg animate-pulse">
        <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-600 rounded w-1/4 mb-3"></div>
        <div className="h-3 bg-slate-600 rounded w-full"></div>
      </div>
    ))}
  </div>
);



// --- UPDATED COMPONENT: ImageViewer ---
// In App.jsx (or wherever ImageViewer is defined)

// --- REPLACE THE ENTIRE ImageViewer COMPONENT WITH THIS ---
const ImageViewer = ({ image, className, isDicomLoaded }) => {
    const viewerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const element = viewerRef.current;
        console.log("ImageViewer Effect Triggered. Element:", element, "Image Prop:", image, "Loaders Ready:", isDicomLoaded);

        // Clear previous error or loading state when image changes or loaders become ready
        setError(null);
        setLoading(false); // Reset loading state

        if (!image || !element) {
            console.log("ImageViewer: Aborting - No image or element provided.");
            // Ensure cornerstone is disabled if no image is present but element exists
            try {
                if (element && window.cornerstone && window.cornerstone.getEnabledElement(element)) {
                   console.log("ImageViewer: Disabling element due to missing image.");
                   window.cornerstone.disable(element);
                }
            } catch (cleanupError) { console.warn("ImageViewer: Error during cleanup for missing image:", cleanupError); }
            return; // Exit if no image or element ref
        }


        // Display message if loaders aren't ready yet
        if (!isDicomLoaded) {
            console.log("ImageViewer: Waiting for Cornerstone loaders...");
            setError("Initializing viewer libraries..."); // Show a waiting message
            return;
        }

        let isEffectActive = true; // Flag to check if component is still mounted during async ops
        let resizeObserver = null; // Variable to hold the observer instance

        const loadAndDisplayImage = async () => {
            if (!isEffectActive) return; // Prevent execution if component unmounted
            setLoading(true);
            setError(null); // Clear previous errors
            console.log("ImageViewer: Starting loadAndDisplayImage...");

            try {
                // Check if libraries are globally available
                if (!window.cornerstone || !window.cornerstoneTools || !window.cornerstoneWADOImageLoader || !window.cornerstoneWebImageLoader) {
                    throw new Error("Cornerstone libraries not fully loaded on window object.");
                }
                const cornerstone = window.cornerstone;
                const cornerstoneTools = window.cornerstoneTools;
                const csWADOImageLoader = window.cornerstoneWADOImageLoader;
                const csWebImageLoader = window.cornerstoneWebImageLoader;
                console.log("ImageViewer: Base libraries available.");

                // Explicitly check for fileManager existence *before* using it
                if (!csWADOImageLoader?.wadouri?.fileManager) {
                     throw new Error("WADO Loader fileManager not initialized.");
                }
                 if (!csWebImageLoader?.fileManager) {
                     throw new Error("Web Loader fileManager not initialized.");
                }
                console.log("ImageViewer: FileManagers available.");

                // Ensure the element isn't already enabled from a previous render
                try {
                    if (cornerstone.getEnabledElement(element)) {
                        console.log("ImageViewer: Element already enabled, disabling first.");
                        cornerstone.disable(element);
                    }
                } catch (e) { /* Element wasn't enabled, proceed */ }

                console.log("ImageViewer: Enabling element...");
                cornerstone.enable(element);

                // Initialize tools (consider if this needs protection, maybe init once in App?)
                try {
                    cornerstoneTools.init({ showSVGCursors: true }); // Initialize tools if not already
                } catch (initError) { console.warn("ImageViewer: cornerstoneTools.init() likely already called:", initError); }


                let imageId;
                console.log("ImageViewer: Determining image type:", image.type, image.name);

                if (image.type === 'application/dicom' || image.name?.toLowerCase().endsWith('.dcm')) {
                    if (!image.file) throw new Error("DICOM image object missing 'file' property.");
                    console.log("ImageViewer: Adding DICOM file:", image.file);
                    // Ensure previous file with same name is removed if re-adding
                    try {
                        csWADOImageLoader.wadouri.fileManager.remove(image.file);
                    } catch (removeError) { /* File likely wasn't added before, ignore */ }
                    imageId = csWADOImageLoader.wadouri.fileManager.add(image.file);
                } else if (image.type?.startsWith('image/')) {
                    if (!image.file && !image.src) throw new Error("Web image object missing 'file' or 'src'.");
                    // Prefer file if available, otherwise fetch from src
                    const fileToLoad = image.file || new File([await (await fetch(image.src)).blob()], image.name || 'image.png', {type: image.type || 'image/png'});
                    console.log("ImageViewer: Adding Web image file:", fileToLoad);
                     // Ensure previous file with same name is removed if re-adding
                    try {
                        csWebImageLoader.fileManager.remove(fileToLoad);
                    } catch (removeError) { /* File likely wasn't added before, ignore */ }
                    imageId = csWebImageLoader.fileManager.add(fileToLoad);
                } else {
                    throw new Error(`Unsupported image type: ${image.type || 'unknown'}`);
                }

                console.log("ImageViewer: Generated Image ID:", imageId);
                if (!imageId) throw new Error("Failed to generate image ID.");

                console.log("ImageViewer: Loading image...");
                const loadedImage = await cornerstone.loadImage(imageId);
                if (!isEffectActive) return; // Check again after await
                console.log("ImageViewer: Image loaded:", loadedImage);

                console.log("ImageViewer: Displaying image...");
                cornerstone.displayImage(element, loadedImage);


                // === START FIX: Disable Overlays ===
                try {
                    const viewport = cornerstone.getViewport(element);
                    if (viewport) {
                        viewport.overlay = false; // Disable general overlay
                        // Optionally disable specific overlays if needed:
                        // viewport.textOverlay = false;
                        // viewport.patientInfoOverlay = false;
                        cornerstone.setViewport(element, viewport);
                        console.log("ImageViewer: Disabled viewport overlays.");
                    } else {
                         console.warn("ImageViewer: Could not get viewport to disable overlays.");
                    }
                } catch (viewportError) {
                    console.error("ImageViewer: Error disabling overlays:", viewportError);
                }
                // === END FIX ===
                
                // === START FIX: ResizeObserver ===
                if (window.ResizeObserver) {
                    resizeObserver = new ResizeObserver(() => {
                        console.log("ImageViewer (ResizeObserver): Element resized, calling cornerstone.resize.");
                        try {
                            // Check if element is still enabled before resizing
                            if (cornerstone.getEnabledElement(element)) {
                                cornerstone.resize(element, true); // Use checkSize = true
                            }
                        } catch (resizeError) {
                             console.warn("ImageViewer (ResizeObserver): Error during resize, element might be disabled:", resizeError);
                             // Optionally disconnect observer if element is consistently disabled
                             // if (resizeObserver) resizeObserver.disconnect();
                        }
                    });
                    resizeObserver.observe(element);
                    console.log("ImageViewer: ResizeObserver attached.");
                    // Trigger initial resize explicitly AFTER observing, ensures it runs at least once
                    // cornerstone.resize(element, true); // Let observer handle initial size calculation
                } else {
                    // Fallback for older browsers (less reliable)
                    console.warn("ImageViewer: ResizeObserver not supported, falling back to manual resize.");
                    cornerstone.resize(element, true);
                    // Consider adding a window resize listener as a further fallback here
                }
                // === END FIX ===

                cornerstone.resize(element, true); // Resize after setting viewport potentially
                console.log("ImageViewer: Image displayed and overlays potentially disabled.");

                // Tool setup
                console.log("ImageViewer: Setting up tools...");
                try {
                    // Check if tools exist before adding to prevent errors on re-renders
                    if (!cornerstoneTools.getToolState(element, 'Pan')) {
                        cornerstoneTools.addTool(cornerstoneTools.PanTool);
                    }
                    if (!cornerstoneTools.getToolState(element, 'Zoom')) {
                       cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
                    }
                     if (!cornerstoneTools.getToolState(element, 'Wwwc')) {
                       cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
                     }
                } catch (toolError) { console.warn("ImageViewer: Error during tool setup/check:", toolError); }

                cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
                cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 });
                cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 4 });
                console.log("ImageViewer: Tools activated.");

            } catch (err) {
                if (!isEffectActive) return; // Don't set error if unmounted
                console.error("ImageViewer: Error during load/display:", err);
                setError(`Failed to load image: ${err.message}.`);
                // Attempt to disable the element on error to clean up
                 try {
                     if (element && window.cornerstone && window.cornerstone.getEnabledElement(element)) {
                        window.cornerstone.disable(element);
                     }
                 } catch (disableError) { console.warn("ImageViewer: Error disabling element after load failure:", disableError); }
            } finally {
                if (isEffectActive) setLoading(false);
                console.log("ImageViewer: loadAndDisplayImage finished.");
            }
        };

        loadAndDisplayImage();

        // Cleanup function
        return () => {
            isEffectActive = false; // Signal that the effect is no longer active
            console.log("ImageViewer: Running cleanup for element:", element);
            try {
                if (element && window.cornerstone && window.cornerstone.getEnabledElement(element)) {
                   console.log("ImageViewer: Disabling cornerstone element.");
                   // Remove tool state before disabling if necessary, though disable often handles this
                   // cornerstoneTools.clearToolState(element, 'Pan'); // Example
                   window.cornerstone.disable(element);
                }
            } catch (err) {
                console.warn("ImageViewer: Error during cleanup:", err);
            }
        };
    }, [image, isDicomLoaded]); // Depend on both image and loader status

    // --- JSX for the viewer component ---
    // (The JSX part of ImageViewer remains unchanged)
    return (
        <div className={`relative w-full border border-slate-700 rounded-lg bg-black overflow-hidden ${className || 'h-[500px]'}`}>
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                    Loading image...
                </div>
            )}
            {/* Error Overlay */}
            {error && !loading && ( // Show error only if not loading
                <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-80 text-white z-10 p-4 text-center">
                    <AlertTriangle size={24} className="mr-2 inline-block"/>
                    <span className="font-semibold">Error:</span> {error}
                </div>
            )}
            {/* Cornerstone Element */}
            <div ref={viewerRef} className="absolute inset-0"></div>
        </div>
    );
};

// --- NEW COMPONENT: ImageModal ---
const ImageModal = ({ images, currentIndex, onClose, onNext, onPrev, isDicomLoaded }) => { // Added isDicomLoaded prop
  if (currentIndex === null || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight') {
      onNext();
    } else if (e.key === 'ArrowLeft') {
      onPrev();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [onNext, onPrev, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 sm:p-4">
      {/* Main modal container */}
      <div className="relative bg-gray-900 rounded-lg sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col p-3 sm:p-4 border-2 border-gray-700">

        {/* Header (Unchanged from previous fix) */}
        <div className="flex items-center justify-between mb-2 text-white gap-3 flex-shrink-0">
            <div className="flex-grow min-w-0">
                <h3 className="text-base sm:text-lg font-bold truncate">
                    <span className="hidden sm:inline">Image </span>{currentIndex + 1}/{images.length} - {currentImage.name}
                </h3>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-white flex-shrink-0 p-1">
                <XCircle size={24} sm:size={28} />
            </button>
        </div>

        {/* Image display area - Parent defines the boundary */}
        <div className="flex-grow relative min-h-0 overflow-hidden">
          {isDicom(currentImage) ? (
            // DICOM container - Still uses absolute positioning for ImageViewer
            <div className="absolute inset-0">
              <ImageViewer image={currentImage} isDicomLoaded={isDicomLoaded} />
            </div>
          ) : (
            // === START FIX: Raster Image Container ===
            // Reverted: Use standard flex centering within the parent bounds
            // The parent div above provides the actual size via flex-grow
            <div className="w-full h-full flex items-center justify-center p-1">
                 <img
                    src={getRasterSrc(currentImage)}
                    alt={currentImage?.name || `Image ${currentIndex + 1}`}
                    // max-w/max-h constrain the image within this flex container
                    className="block max-w-full max-h-full object-contain"
                    draggable={false}
                 />
            </div>
            // === END FIX ===
          )}
        </div>

      </div>

      {/* Navigation Buttons (Unchanged) */}
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 bg-gray-700/70 text-white rounded-full p-1.5 sm:p-3 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft size={24} sm:size={32} />
      </button>
      <button
        onClick={onNext}
        disabled={currentIndex >= images.length - 1}
        className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 bg-gray-700/70 text-white rounded-full p-1.5 sm:p-3 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronRight size={24} sm:size={32} />
      </button>
    </div>
  );
};

// --- Modal image-type helpers ---
const isDicom = (img) => {
  if (!img) return false;
  const name = (img.name || "").toLowerCase();
  const type = (img.type || "").toLowerCase();
  return type === "application/dicom" || name.endsWith(".dcm");
};

const getRasterSrc = (img) => {
  if (!img) return "";
  if (img.src) return img.src;
  if (img.base64?.startsWith("data:")) return img.base64;
  if (img.base64) {
    const mime = img.type || "image/png";
    return `data:${mime};base64,${img.base64}`;
  }
  if (typeof URL !== "undefined") {
    if (img.blob instanceof Blob) return URL.createObjectURL(img.blob);
    if (img.file instanceof File) return URL.createObjectURL(img.file);
  }
  return "";
};



const App = () => {
  // --- ALL STATE AND LOGIC (UNCHANGED) ---
  // All your useState, useEffect, useCallback, and other hooks remain here.
  // All your functions (analyzeImages, handleSearch, etc.) also remain here.
  // The core application logic does not need to change for a redesign.

  // --- NEW STATE for UI ---
  const [activeAiTab, setActiveAiTab] = useState('copilot'); // 'copilot', 'search', 'knowledge'
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // --- AUTHENTICATION STATE ---
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('basic'); // Add userRole state
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isRestricted, setIsRestricted] = useState(false); // Freemium restriction state


  // --- ALL OTHER APP STATE ---
  const [patientName, setPatientName] = useState('John Doe');
  const [patientId, setPatientId] = useState('P00000000');
  const [patientAge, setPatientAge] = useState('45');
  const [referringPhysician, setReferringPhysician] = useState('Dr. Evelyn Reed');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [modality, setModality] = useState('Ultrasound');
  const [template, setTemplate] = useState('Abdomen');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userFindings, setUserFindings] = useState('');
  const [generatedReport, setGeneratedReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysisStatus, setAiAnalysisStatus] = useState('');
  const [clinicalContext, setClinicalContext] = useState('');
  const [assistantQuery, setAssistantQuery] = useState('');
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [localSearchResults, setLocalSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [baseSearchQuery, setBaseSearchQuery] = useState('');
  const [allAiSearchResults, setAllAiSearchResults] = useState([]);
  const [currentAiPage, setCurrentAiPage] = useState(0);
  const [allAiFullReports, setAllAiFullReports] = useState([]);
  const [currentReportPage, setCurrentReportPage] = useState(0);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [suggestionType, setSuggestionType] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  // const [voiceStatus, setVoiceStatus] = useState('idle');
  // const [isDictationSupported, setIsDictationSupported] = useState(true);
  // const [interimTranscript, setInterimTranscript] = useState('');
  const [macros, setMacros] = useState([]); // Macros will now be loaded from Firestore
  const [showMacroModal, setShowMacroModal] = useState(false);
  const [newMacroCommand, setNewMacroCommand] = useState('');
  const [newMacroText, setNewMacroText] = useState('');
  const [aiKnowledgeLookupResult, setAiKnowledgeLookupResult] = useState(null);
  const [isProactiveHelpEnabled, setIsProactiveHelpEnabled] = useState(true);
  const [structuredData, setStructuredData] = useState({});
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [aiMeasurements, setAiMeasurements] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [isAwaitingAlertAcknowledge, setIsAwaitingAlertAcknowledge] = useState(false);
  const [correctionSuggestion, setCorrectionSuggestion] = useState(null);
  const [isDicomLoaded, setIsDicomLoaded] = useState(false);
// --- ALL OTHER APP STATE (Add these new states) ---
const [isConversationActive, setIsConversationActive] = useState(false);
const [conversationHistory, setConversationHistory] = useState([]);
const [isAiReplying, setIsAiReplying] = useState(false);
const [userInput, setUserInput] = useState(''); // For the chat input box

const [showAssistantModal, setShowAssistantModal] = useState(false); // New state for AI Assistant

// --- ADD THESE NEW STATES ---
  const [dynamicMeasurements, setDynamicMeasurements] = useState([]);
  const [templateOrgans, setTemplateOrgans] = useState([]);

    const [userTemplates, setUserTemplates] = useState({});
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const [editorContent, setEditorContent] = useState(templates.Ultrasound.Abdomen);

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [mobileView, setMobileView] = useState('workspace'); // For mobile tab navigation


// const blockTemplateReloadRef = useRef(false);

  const [modalIndex, setModalIndex] = useState(null);
  // const openModal = (index) => setModalIndex(index);
  // const closeModal = () => setModalIndex(null);
  const showNext = () => setModalIndex((prev) => Math.min(prev + 1, images.length - 1));
  const showPrev = () => setModalIndex((prev) => Math.max(prev - 1, 0));

  // --- NEW: Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  // --- ALL REFS ---
  const debounceTimeoutRef = useRef(null);
  const inconsistencyCheckTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);
  const searchButtonRef = useRef(null);
  // const voiceStatusRef = useRef(voiceStatus);
  const dataExtractTimeoutRef = useRef(null);
  const proactiveAnalysisTimeoutRef = useRef(null);
  const localSearchInputRef = useRef(null);
  const searchResultsRef = useRef();
  const isProgrammaticUpdate = useRef(false);
  const macrosRef = useRef(macros);

  useEffect(() => {
    macrosRef.current = macros;
  }, [macros]);
  // Keep a ref in sync with isAwaitingAlertAcknowledge to avoid stale closures
  const awaitingRef = useRef(false);
  useEffect(() => {
    awaitingRef.current = isAwaitingAlertAcknowledge;
  }, [isAwaitingAlertAcknowledge]);

  const allTemplates = useMemo(() => {
    
    const deepMerge = (target, source) => {
      const output = { ...target };
      if (target && typeof target === 'object' && source && typeof source === 'object') {
        Object.keys(source).forEach(key => {
          if (source[key] && typeof source[key] === 'object') {
            if (!(key in target))
              Object.assign(output, { [key]: source[key] });
            else
              output[key] = deepMerge(target[key], source[key]);
          } else {
            Object.assign(output, { [key]: source[key] });
          }
        });
      }
      return output;
    };
    return deepMerge(templates, userTemplates);
  }, [userTemplates]);

  // --- LOAD DICOM LIBRARIES ---
  // In App.jsx's script loading useEffect
// In App.jsx

  // --- State for tracking library loading ---
  // const [isDicomLoaded, setIsDicomLoaded] = useState(false); // Represents if *all* viewers are ready

  // --- REPLACE THE ENTIRE SCRIPT LOADING useEffect WITH THIS ---
  useEffect(() => {
   
    let isMounted = true; // Flag to prevent state updates if component unmounts during loading

    const loadLibraries = () => {
      loadScript('https://unpkg.com/cornerstone-core@2.2.8/dist/cornerstone.min.js', () => {
        if (!isMounted) return;
  
        loadScript('https://unpkg.com/cornerstone-web-image-loader@2.1.1/dist/cornerstoneWebImageLoader.min.js', () => {
          if (!isMounted) return;
         
          loadScript('https://unpkg.com/dicom-parser@1.8.11/dist/dicomParser.min.js', () => {
            if (!isMounted) return;
         
            loadScript('https://unpkg.com/cornerstone-wado-image-loader@2.1.0/dist/cornerstoneWADOImageLoader.min.js', () => { // Using 2.1.0
              if (!isMounted) return;
          
              try {
                // --- Configure WADO Loader ---
                const csWADOImageLoader = window.cornerstoneWADOImageLoader;
                if (!csWADOImageLoader) throw new Error("WADO Loader not found on window");
                csWADOImageLoader.external.cornerstone = window.cornerstone;
                csWADOImageLoader.external.dicomParser = window.dicomParser;
                csWADOImageLoader.configure({ /* your config options if any */ });
             

                // --- Configure Web Image Loader ---
                const csWebImageLoader = window.cornerstoneWebImageLoader;
                if (!csWebImageLoader) throw new Error("Web Loader not found on window");
                csWebImageLoader.external.cornerstone = window.cornerstone;
             

                // Load Tools LAST
                loadScript('https://unpkg.com/cornerstone-tools@4.22.0/dist/cornerstoneTools.min.js', () => {
                  if (!isMounted) return;
           
                  const cornerstoneTools = window.cornerstoneTools;
                  if (!cornerstoneTools) throw new Error("Tools not found on window");
                  cornerstoneTools.external.cornerstone = window.cornerstone;

                  // *** SET STATE ONLY HERE AT THE VERY END ***
                  setIsDicomLoaded(true); // Signifies ALL loaders are ready
           
                });
              } catch (configError) {
                console.error("🚨 Error configuring Cornerstone loaders:", configError);
                if (isMounted) {
                    // Optionally set an error state here
                    toast.error(`Error loading viewers: ${configError.message}`);
                }
              }
            });
          });
        });
      });
    };

    // Prevent loading if already loaded (optional but good practice)
    if (!isDicomLoaded && typeof window !== 'undefined' && !window.cornerstone) {
        loadLibraries();
    } else if (window.cornerstone) {
        // If libraries were somehow loaded previously (e.g., hot reload), set state
        setIsDicomLoaded(true);
        console.log("Libraries already loaded.");
    }


    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
      console.log("Library loading effect cleanup.");
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- NEW: Modal Handlers ---
  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImageIndex(null);
  };

  const showNextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex < images.length - 1 ? prevIndex + 1 : prevIndex));
  };

  const showPrevImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  // --- ALL HOOKS (useCallback, useEditor, useEffect) ---

  useEffect(() => {
    searchResultsRef.current = { localSearchResults, allAiSearchResults, currentAiPage };
  });

  // useEffect(() => {
  //   voiceStatusRef.current = voiceStatus;
  // }, [voiceStatus]);

 // --- DEBOUNCED CHECKS FOR EDITOR ---
  // const debouncedCriticalCheck = useCallback((text) => {
  //   if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
  //   debounceTimeoutRef.current = setTimeout(() => {
  //     if (!awaitingRef.current && text.trim() !== '') {
  //       checkForCriticalFindings(text);
  //     } else if (!awaitingRef.current) {
  //       setActiveAlert(null);
  //     }
  //   }, 1000);
  // }, []); 

    const runInconsistencyCheck = useCallback(async (plainText) => {
    if (isAwaitingAlertAcknowledge) return;
    const findingsMatch = plainText.match(/FINDINGS:([\s\S]*)IMPRESSION:/i);
    const impressionMatch = plainText.match(/IMPRESSION:([\s\S]*)/i);

    if (!findingsMatch || !impressionMatch) {
      setActiveAlert(prev => (prev?.type === 'inconsistency' ? null : prev));
      return;
    }

    const findingsText = findingsMatch[1].trim();
    const impressionText = impressionMatch[1].trim();

    if (!findingsText || !impressionText) {
      setActiveAlert(prev => (prev?.type === 'inconsistency' ? null : prev));
      return;
    }

    const prompt = `
      You are a meticulous radiological assistant. Compare the significant clinical findings in the FINDINGS section with the conclusions in the IMPRESSION section. Identify any major findings that are mentioned in one section but are missing from the other.
      
      FINDINGS:
      ---
      ${findingsText}
      ---

      IMPRESSION:
      ---
      ${impressionText}
      ---

      If you find a discrepancy, respond with a JSON object: {"isInconsistent": true, "message": "A clear explanation of the inconsistency.", "suggestedCorrection": "The exact text to add to the impression."}.
      For example: {"isInconsistent": true, "message": "'Grade I fatty liver' is mentioned in the findings but is missing from the impression.", "suggestedCorrection": "Grade I fatty liver."}.
      If the sections are consistent, respond with {"isInconsistent": false, "message": null, "suggestedCorrection": null}.
    `;

    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      };
      const model = 'gemini-2.5-flash';
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) return;

      const result = await response.json();
      const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

      if (textResult) {
        const parsed = JSON.parse(textResult);
        if (parsed.isInconsistent && parsed.suggestedCorrection) {
          setActiveAlert({ type: 'inconsistency', message: parsed.message });
          setCorrectionSuggestion(parsed.suggestedCorrection);
          setIsAwaitingAlertAcknowledge(true);
        } else {
          setActiveAlert(prev => (prev?.type === 'inconsistency' ? null : prev));
          setCorrectionSuggestion(null);
        }
      }
    } catch (err) {
      console.error("Inconsistency check failed:", err);
    }
  }, [isAwaitingAlertAcknowledge]);
// In App.jsx, ensure this useCallback exists
// const debouncedInconsistencyCheck = useCallback((text) => {
//     if (inconsistencyCheckTimeoutRef.current) clearTimeout(inconsistencyCheckTimeoutRef.current);
//     inconsistencyCheckTimeoutRef.current = setTimeout(() => {
//     // Ensure you don't have isAwaitingAlertAcknowledge check here if it causes issues
//     if (text.trim().length > 50) { // Check only after substantial text
//         runInconsistencyCheck(text); // Ensure runInconsistencyCheck exists
//     } else {
//         // Optionally clear the alert if text is too short
//          setActiveAlert(prev => (prev?.type === 'inconsistency' ? null : prev));
//     }
//     }, 2500); // Increased delay slightly
// }, [runInconsistencyCheck]); // Add runInconsistencyCheck as dependency if defined with useCallback

  // const debouncedExtractData = useCallback((text) => {
  //   if (dataExtractTimeoutRef.current) clearTimeout(dataExtractTimeoutRef.current);
  //   dataExtractTimeoutRef.current = setTimeout(() => {
  //     if (text.trim().length > 20) {
  //       extractStructuredData(text);
  //     } else {
  //       setStructuredData({});
  //     }
  //   }, 1500);
  // }, []);

  // const debouncedProactiveAnalysis = useCallback((text) => {
  //   if (proactiveAnalysisTimeoutRef.current) clearTimeout(proactiveAnalysisTimeoutRef.current);
  //   proactiveAnalysisTimeoutRef.current = setTimeout(() => {
  //     // FIX: Removed the '!awaitingRef.current' check here.
  //     // Proactive analysis should run even if another alert is active.
  //     if (isProactiveHelpEnabled && !isSearching && text.trim().length > 40) {
  //       runProactiveAnalysis(text);
  //     }
  //     // REMOVED the else-if block that might have cleared other alerts incorrectly.
  //   }, 3000);
  //   // FIX: Added isAwaitingAlertAcknowledge to dependencies, although the check inside is removed,
  //   // it's good practice if other logic depended on it.
  // }, [isProactiveHelpEnabled, isSearching, isAwaitingAlertAcknowledge]); // Added isAwaitingAlertAcknowledge dependency
  
  

   // --- EDITOR INITIALIZATION ---
  // const handleEditorUpdate = useCallback(({ editor }) => {
  //   if (isProgrammaticUpdate.current) {
  //     isProgrammaticUpdate.current = false;
  //     return;
  //   }
    
  //   const text = editor.getText();
  //   const html = editor.getHTML(); // <-- Get the HTML
  //   setEditorContent(html); // <-- THIS IS THE FIX: Keep React state in sync

  //   if (awaitingRef.current) {
  //     return;
  //   }

  //   debouncedCriticalCheck(text);
  //   debouncedInconsistencyCheck(text);
  //   debouncedExtractData(text);
  //   debouncedProactiveAnalysis(text);
  // }, [debouncedCriticalCheck, debouncedInconsistencyCheck, debouncedExtractData, debouncedProactiveAnalysis]);

  // --- DEBOUNCED CHECKS FOR EDITOR ---

  const handleAiKnowledgeSearch = async (isProactive = false, queryOverride = '') => {
      // if (isRestricted) {
      //    toast.error("Please upgrade to a professional plan to use AI knowledge search.");
      //    return;
      // }
      const query = isProactive ? queryOverride : baseSearchQuery;
      if (!query) {
          setError("Please enter a search term first.");
          return;
      }
      setIsSearching(true);
      setError(null);
      // Clear other search results
      setAllAiSearchResults([]);
      setAllAiFullReports([]);
      setLocalSearchResults([]);

      const prompt = `
        You are a master medical AI. Your sole task is to provide a knowledge lookup on a specific medical condition.
        The user wants to know about: "${query}".
        
        Perform a lookup using authoritative sources (like Radiopaedia, PubMed, StatPearls) and return a single, valid JSON object with this EXACT schema:
        {
          "queryType": "knowledgeLookup",
          "conditionName": "string (The name of the condition)",
          "summary": "string (HTML-formatted explanation of the condition, its pathophysiology, and clinical significance)",
          "keyImagingFeatures": ["string (HTML-formatted list item)", "string"],
          "differentialDiagnosis": ["string", "string"],
          "sources": [{ "name": "string", "url": "string" }]
        }
        
        Do not generate report findings. Your only job is to provide factual, educational information based on the requested condition.
      `;

      try {
          const payload = {
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" }
          };
          const model = 'gemini-2.5-flash';
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

          if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

          const result = await response.json();
          if (result.candidates?.[0]?.content.parts?.[0]?.text) {
              const textResult = result.candidates[0].content.parts[0].text;
              try {
                  const parsedResult = JSON.parse(textResult);
                  if (parsedResult.queryType === 'knowledgeLookup') {
                      setAiKnowledgeLookupResult(parsedResult);
                  } else {
                      setError("The AI returned an unexpected response type for a knowledge search.");
                  }
              } catch (jsonError) {
                  console.error("JSON Parsing Error:", jsonError, "Raw Text:", textResult);
                  setError("The AI returned a non-standard response for the knowledge search.");
              }
          } else {
              throw new Error("Knowledge search failed.");
          }
      } catch (err) {
          setError("Failed to perform knowledge search. " + err.message);
      } finally {
          setIsSearching(false);
      }
  };

   // --- NEW: "Editor Guardian" Agent ---
  // (This function MUST be defined *after* handleAiKnowledgeSearch)
  const runEditorGuardianAgent = useCallback(async (editorText) => {
    // This agent runs on every text change (debounced)
    // It consolidates multiple checks into one API call for efficiency
    
    // 1. Get current states for the prompt
    const findingsMatch = editorText.match(/FINDINGS:([\s\S]*)IMPRESSION:/i);
    const impressionMatch = editorText.match(/IMPRESSION:([\s\S]*)/i);

    const findingsTextForPrompt = (findingsMatch && findingsMatch[1]) ? findingsMatch[1].trim() : "N/A";
    const impressionTextForPrompt = (impressionMatch && impressionMatch[1]) ? impressionMatch[1].trim() : "N/A";
    const canCheckInconsistency = findingsMatch && impressionMatch;

    const prompt = `
      You are an expert "Editor Guardian" AI for a radiology reporting system.
      Your task is to analyze the user's in-progress report text and return a
      single JSON object with checks for critical findings, inconsistencies,
      guideline adherence, structured data, and knowledge lookups.

      Analyze this text (for critical, guideline, knowledge, and data checks):
      ---
      ${editorText}
      ---
      
      Separately, here are the parsed sections for your consistency check.
      You must ONLY perform this check if both sections are provided (not "N/A").
      If sections are "N/A", return "null" for "inconsistency".
      FINDINGS: ${findingsTextForPrompt}
      IMPRESSION: ${impressionTextForPrompt}

      ---
      **IMPORTANT RULES:**
      1. A single finding can trigger multiple checks. For example, 'Acute Cholecystitis' should trigger *both* a "criticalFinding" AND a "knowledgeLookupQuery".
      2. '6mm pulmonary nodule' should trigger *both* a "guidelineSuggestion" AND a "knowledgeLookupQuery" (for 'Fleischner criteria').
      ---

      You MUST respond with a single, valid JSON object following this exact schema.
      Return "null" for any key where no finding is detected.

      {
        "criticalFinding": {
          "findingName": "string",
          "reportMacro": "string",
          "notificationTemplate": "string"
        } | null,
        "inconsistency": ${canCheckInconsistency ? `{
          "message": "string (Explanation of the mismatch)",
          "suggestedCorrection": "string (Text to add to impression)"
        } | null` : `null`},
        "guidelineSuggestion": {
          "finding": "string (The finding that triggered this, e.g., '6mm ground glass opacity')",
          "guidelineName": "string (e.g., 'Fleischner Criteria')",
          "recommendationText": "string (The suggested follow-up, e.g., 'Follow-up CT in 6-12 months is recommended.')"
        } | null,
        "knowledgeLookupQuery": "string (A concise search term for a specific entity, e.g., 'Bosniak classification')" | null,
        "structuredData": {
          "Finding1": "Value1",
          "Measurement2": "Value2"
        } | null
      }
    `;

    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      };
      const model = 'gemini-2.5-flash';
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) {
        throw new Error(`Guardian API Error: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.candidates?.[0]?.content.parts?.[0]?.text) {
        console.warn("Guardian Agent returned empty or blocked response.");
        return;
      }
      
      const textResult = result.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(textResult);

      // --- Process the Consolidated Response ---

      // 1. Always update Structured Data (if not in restricted mode)
      if (parsed.structuredData && !isRestricted) {
        setStructuredData(parsed.structuredData);
      } else {
        setStructuredData({}); // Clear it if not present
      }

      // 2. Always trigger Knowledge Lookup (if not restricted)
      if (parsed.knowledgeLookupQuery && !isRestricted) {
        console.log("Guardian: Knowledge Lookup triggered for:", parsed.knowledgeLookupQuery); // Added log
        setBaseSearchQuery(parsed.knowledgeLookupQuery); 
        handleAiKnowledgeSearch(true, parsed.knowledgeLookupQuery);
      }

      // 3. Handle Alerts (Only if no other alert is awaiting acknowledgement)
      if (awaitingRef.current) {
        console.log("Guardian: Alert found, but another alert is pending. Ignoring new alert.");
        return;
      }

      if (parsed.criticalFinding) {
        console.log("Guardian: Critical finding detected.");
        setActiveAlert({ type: 'critical', data: parsed.criticalFinding });
        setIsAwaitingAlertAcknowledge(true);
      
      } else if (parsed.inconsistency && canCheckInconsistency) {
        console.log("Guardian: Inconsistency detected.");
        setActiveAlert({ type: 'inconsistency', message: parsed.inconsistency.message });
        setCorrectionSuggestion(parsed.inconsistency.suggestedCorrection);
        setIsAwaitingAlertAcknowledge(true);
      
      } else if (parsed.guidelineSuggestion && !isRestricted) {
        console.log("Guardian: Guideline suggestion detected.");
        setActiveAlert({
          type: 'guideline',
          message: `Finding: ${parsed.guidelineSuggestion.finding} (${parsed.guidelineSuggestion.guidelineName})`,
          data: { recommendationText: parsed.guidelineSuggestion.recommendationText } 
        });
        setIsAwaitingAlertAcknowledge(true); // Treat it like an alert

      } else {
        // If no alerts are found, clear any non-critical, non-pending alerts
        setActiveAlert(null);
        setCorrectionSuggestion(null);
      }

    } catch (err) {
      console.error("Editor Guardian Agent failed:", err);
      // Don't bother the user with background failures
    }
  }, [isRestricted, isSearching, awaitingRef.current, handleAiKnowledgeSearch]); // Add dependencies

  
 // --- DEBOUNCED CHECKS FOR EDITOR ---

  // NEW: Single debounced function for the Editor Guardian Agent
  const debouncedGuardianCheck = useCallback((text) => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    
    // Set a single timer (e.g., 1.5 seconds)
    debounceTimeoutRef.current = setTimeout(() => {
      // Don't run the full agent if text is empty
      if (text.trim().length > 20) {
        // Run the consolidated agent
        runEditorGuardianAgent(text); 
      } else {
        // If text is cleared, clear structured data and alerts
        setStructuredData({});
        if (!awaitingRef.current) {
          setActiveAlert(null);
          setCorrectionSuggestion(null); // <-- THIS IS THE FIX
        }
      }
    }, 1500); // 1.5 second debounce
  }, [runEditorGuardianAgent, awaitingRef.current]); // Add runEditorGuardianAgent

   // --- EDITOR INITIALIZATION ---
  const handleEditorUpdate = useCallback(({ editor }) => {
    if (isProgrammaticUpdate.current) {
      isProgrammaticUpdate.current = false;
      return;
    }
    
    const text = editor.getText();
    const html = editor.getHTML();
    setEditorContent(html); // Keep React state in sync

    // Call the single, new debounced function
    debouncedGuardianCheck(text);

  }, [debouncedGuardianCheck]); // Only one dependency now

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start dictating or paste findings here…',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    onUpdate: handleEditorUpdate,
  });

  useEffect(() => {
    if (editor && editorContent && editor.getHTML() !== editorContent) {
      isProgrammaticUpdate.current = true;
      editor.commands.setContent(editorContent, false); // "false" prevents re-parsing, can be smoother
    }
  }, [editorContent, editor]);

// useEffect(() => {
//     // This effect will now ONLY run if the ref flag is true (i.e., on initial load or a manual dropdown change).
//     if (isManualTemplateChangeRef.current === true) {
//       if (editor && !editor.isDestroyed) {
//         isProgrammaticUpdate.current = true;
//         const newTemplateContent = allTemplates[modality]?.[template] || '';
//         editor.commands.setContent(newTemplateContent);
        
//         if (modality === 'Ultrasound') {
//           const parser = new DOMParser();
//           const doc = parser.parseFromString(newTemplateContent, 'text/html');
          
//           const placeholders = newTemplateContent.match(/_+\s?(cm|mm|ml|cc)?/g) || [];
//           const measurements = placeholders.map((_, index) => ({
//             id: index,
//             label: `Measurement ${index + 1}`
//           }));
//           setDynamicMeasurements(measurements);

//           const organs = Array.from(doc.querySelectorAll('strong')).map(el => el.textContent.replace(':', '').trim());
//           setTemplateOrgans(organs.length > 0 ? organs : ['General']);

//         } else {
//           setDynamicMeasurements([]);
//           setTemplateOrgans([]);
//         }
//       }
//       // After it runs, lower the flag so it won't run again on subsequent re-renders (like from the AI analysis).
//       isManualTemplateChangeRef.current = false;
//     }
//   }, [modality, template, editor, allTemplates]);

// This single useEffect now handles all template loading logic.
 
// HOOK 1: This is the SINGLE source of truth for updating the Tiptap editor.
  // It runs ONLY when the `editorContent` state changes.
  // useEffect(() => {
  //       console.log('Use effect for editorPanel....1061')

  //   if (editor && editorContent && editor.getHTML() !== editorContent) {
  //     isProgrammaticUpdate.current = true;
  //     editor.commands.setContent(editorContent);
  //   }
  // }, [editorContent, editor]);

  // // HOOK 2: This hook is responsible for populating the Measurements Panel.
  // // It runs ONLY when the editorContent or modality changes.
  // useEffect(() => {
  //   console.log('Use effect for MP....1072')
  //   if (modality === 'Ultrasound') {
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(editorContent, 'text/html');
  //     const placeholders = editorContent.match(/_+\s?(cm|mm|ml|cc)?/g) || [];
  //     const measurements = placeholders.map((_, index) => ({
  //       id: index,
  //       label: `Measurement ${index + 1}`
  //     }));
  //     setDynamicMeasurements(measurements);
  //     const organs = Array.from(doc.querySelectorAll('strong')).map(el => el.textContent.replace(':', '').trim());
  //     setTemplateOrgans(organs.length > 0 ? organs : ['General']);
  //   } else {
  //     setDynamicMeasurements([]);
  //     setTemplateOrgans([]);
  //   }
  // }, [editorContent, modality]);

// --- START: Replace your existing hooks with this entire block ---


// It runs ONLY when the `editorContent` state changes.
// It runs ONLY when the `editorContent` state changes.
// useEffect(() => {
//   // Check if the editor exists and if its current content is different from our state
//   if (editor && editorContent && editor.getHTML() !== editorContent) {
//     // Use the ref to prevent the editor's own 'onUpdate' from firing our debounced checks
//     isProgrammaticUpdate.current = true;
    
//     // This is now the ONLY place in the entire app that should call setContent
//     editor.commands.setContent(editorContent);
//     console.log('%c EDITOR SYNC:', 'color: blue; font-weight: bold;', 'Editor content updated from state.');
//   }
// }, [editorContent, editor]); // Dependency: The content state and the editor instance.

// This hook populates the Measurements Panel based on the current template
useEffect(() => {
  if (modality === 'Ultrasound') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(editorContent, 'text/html');
    
    // Find all placeholders like "__ cm"
    const placeholders = editorContent.match(/_+\s?(cm|mm|ml|cc)?/g) || [];
    const measurements = placeholders.map((_, index) => ({
      id: index,
      label: `Measurement ${index + 1}`
    }));
    setDynamicMeasurements(measurements);
    
    // Find all organ names from <strong> tags
    const organs = Array.from(doc.querySelectorAll('strong')).map(el => el.textContent.replace(':', '').trim());
    setTemplateOrgans(organs.length > 0 ? organs : ['General']);

  } else {
    // Clear the panel if the modality is not Ultrasound
    setDynamicMeasurements([]);
    setTemplateOrgans([]);
  }
}, [editorContent, modality]); // This runs whenever the template or modality changes



  
// const handleInsertMeasurements = (values, calculusData) => {
//         if (!editor) return;

//         // Start with the clean, original template content from state or props
//         let updatedHtml = allTemplates[modality]?.[template] || '';

//         // Regex for placeholders like "__ cm", "__ mm", etc.
//         const placeholderRegex = /_+\s?(cm|mm|ml|cc)?/;

//         // 1. Replace standard measurement placeholders sequentially
//         dynamicMeasurements.forEach(measurementConfig => {
//             const value = values[measurementConfig.id];
//             if (value && value.trim() !== '') {
//                 // Replace the *next available* placeholder
//                 updatedHtml = updatedHtml.replace(placeholderRegex, `<strong>${value}</strong>`);
//             }
//         });

//         // 2. Insert calculus/mass lesion findings
//         calculusData.forEach(calculus => {
//             if (!calculus.location || !calculus.size) return; // Skip if essential data is missing

//             const organName = calculus.location;
//             let findingText = ` A ${calculus.size}`;
//             if (calculus.description) {
//                 findingText += ` ${calculus.description}`;
//             }
//             findingText += " is noted."; // Specify 'calculus'

//             // Regex to find the <p> tag containing the organ name (case-insensitive)
//             const organRegex = new RegExp(`(<p><strong>${escapeRegex(organName)}:?<\/strong>)(.*?)(<\/p>)`, "i");

//             // Use the replace callback function
//             updatedHtml = updatedHtml.replace(organRegex, (match, openingTags, existingContent, closingTag) => {
//                 // Sentences indicating normality that should be replaced
//                 // Make this more specific to avoid accidentally replacing other content
//                 const normalSentencesRegex = new RegExp(
//                     [
//                         // General
//                         "Normal morphology and echotexture\\.",
//                         "Normal size, shape, position, echogenicity and echotexture\\.",
//                         "unremarkable\\.",
//                         // Specific organs
//                         "No hydronephrosis, calculus, or mass\\.", // Kidneys
//                         "No gallstones, sludge, or polyps\\.", // Gallbladder
//                         "Not dilated, measuring __ mm at the porta hepatis\\.", // CBD (Handle placeholder)
//                         "Not dilated\\.", // Ureters, CBD etc.
//                         "No calculus is seen in the portions of ureters which can be seen by sonography\\.", // Ureters specific
//                         "No calculi, masses, or diverticula identified\\.", // Bladder
//                         "No calculi or masses\\." // Bladder simplified
//                     ].map(s => `(${s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`).join('|'), // Escape regex chars and join with OR
//                     "gi" // Global, case-insensitive
//                 );

//                 let finalContent;
//                 let replacedNormalSentence = false;

//                 // Attempt to replace a specific "normal" sentence
//                 finalContent = existingContent.replace(normalSentencesRegex, (sentenceMatch) => {
//                     replacedNormalSentence = true; // Mark that replacement happened
//                     return findingText; // Replace the matched normal sentence
//                 });

//                 // If no specific normal sentence was found and replaced, append the finding
//                 if (!replacedNormalSentence) {
//                     // Append with a space, ensuring not to add if already ends with a period.
//                     finalContent = existingContent.trim().endsWith('.')
//                         ? existingContent + ' ' + findingText
//                         : existingContent + '.' + ' ' + findingText;
//                 }

//                 // Return the modified paragraph content
//                 return `${openingTags}${finalContent}${closingTag}`;
//             });
//         });

//         // Update the editor and the React state
//         isProgrammaticUpdate.current = true;
//         editor.commands.setContent(updatedHtml);
//         setEditorContent(updatedHtml); // Keep React state in sync
//     };
  
const handleInsertMeasurements = (values, calculusData) => {
        if (!editor) {
            console.error("Apply Measurements: Editor not available.");
            return;
        }

        console.log("Apply Measurements: Received Values:", values);
        console.log("Apply Measurements: Received Calculus Data:", calculusData);

        let currentHtml = editor.getHTML();
        let updatedHtml = currentHtml; // Start with current content

        console.log("Apply Measurements: Starting HTML:", currentHtml.substring(0, 300) + "..."); // Log beginning

        // --- Corrected Placeholder Replacement Logic ---
        dynamicMeasurements.forEach(measurementConfig => {
            const valueKey = measurementConfig.id;
            const providedValue = values[valueKey];

            if (providedValue && providedValue.trim() !== '') {
                // FIX: Use '_+' to match one or more underscores
                const placeholderRegex = /_+\s?(cm|mm|ml|cc)?/;

                if (placeholderRegex.test(updatedHtml)) {
                    const tempHtml = updatedHtml.replace(placeholderRegex, `<strong>${providedValue}</strong>`);
                    if (tempHtml !== updatedHtml) {
                         console.log(`Apply Measurements: Replaced placeholder for value '${providedValue}' (Key: ${valueKey})`);
                         updatedHtml = tempHtml;
                    } else {
                        console.warn(`Apply Measurements: Regex test passed but replace failed for value '${providedValue}'. Check placeholder format.`);
                    }
                } else {
                     console.warn(`Apply Measurements: No placeholder found in current HTML state for value '${providedValue}' (Key: ${valueKey})`);
                }
            }
        });
        // --- End Placeholder Logic ---


        // --- Calculus/Mass Lesion Insertion Logic (with logging) ---
        calculusData.forEach((calculus, index) => {
            if (!calculus.location || !calculus.size) {
                console.log(`Calculus Entry ${index}: Skipping due to missing location or size.`);
                return;
            }

            const organName = calculus.location;
            let findingText = ` A ${calculus.size}`;
            if (calculus.description) {
                findingText += ` ${calculus.description}`;
            }
            findingText += " calculus is noted.";
            const findingTextTrimmed = findingText.trim();

             console.log(`Calculus Entry ${index}: Processing for ${organName} - Finding: "${findingTextTrimmed}"`);

            const organRegex = new RegExp(`(<p><strong>${escapeRegex(organName)}:?<\/strong>)(.*?)(<\/p>)`, "i");

            let organParagraphFound = false;

            updatedHtml = updatedHtml.replace(organRegex, (match, openingTags, existingContent, closingTag) => {
                organParagraphFound = true;
                console.log(`Calculus Entry ${index}: Found organ paragraph for ${organName}. Existing content: "${existingContent}"`);

                if (existingContent.includes(findingTextTrimmed)) {
                    console.log(`Calculus Entry ${index}: Finding text already present. Skipping insertion.`);
                    return match;
                }

                const normalSentencesRegex = new RegExp(
                    [
                        "Normal morphology and echotexture\\.",
                        "Normal size, shape, position, echogenicity and echotexture\\.",
                        "unremarkable\\.",
                        "No hydronephrosis, calculus, or mass\\.",
                        "No gallstones, sludge, or polyps\\.",
                        // FIX: Match one or more underscores in CBD regex
                        "Not dilated, measuring _+\\s?mm at the porta hepatis\\.",
                        "Not dilated\\.",
                        "No calculus is seen in the portions of ureters which can be seen by sonography\\.",
                        "No calculi, masses, or diverticula identified\\.",
                        "No calculi or masses\\."
                    ].map(s => `(${s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`).join('|'), // Escape normally
                    "gi"
                );

                let finalContent;
                let replacedNormalSentence = false;

                finalContent = existingContent.replace(normalSentencesRegex, (sentenceMatch) => {
                    console.log(`Calculus Entry ${index}: Replacing normal sentence "${sentenceMatch}" with finding.`);
                    replacedNormalSentence = true;
                    return findingText;
                });

                if (!replacedNormalSentence) {
                    console.log(`Calculus Entry ${index}: No normal sentence found/replaced. Appending finding.`);
                    finalContent = existingContent.trim().endsWith('.')
                        ? existingContent + ' ' + findingText
                        : existingContent + '.' + ' ' + findingText;
                }

                return `${openingTags}${finalContent}${closingTag}`;
            });

             if (!organParagraphFound) {
                 console.warn(`Calculus Entry ${index}: Could not find organ paragraph matching "${organName}". Calculus not inserted.`);
            }
        });
        // --- End Calculus Logic ---

        console.log("Apply Measurements: Final HTML:", updatedHtml.substring(0, 300) + "...");

        if (updatedHtml !== currentHtml) {
            console.log("Apply Measurements: HTML changed, updating editor and state.");
            isProgrammaticUpdate.current = true;
            editor.commands.setContent(updatedHtml);
            setEditorContent(updatedHtml);
        } else {
             console.log("Apply Measurements: HTML did not change. No update applied.");
             if (Object.keys(values).some(key => values[key]) || calculusData.length > 0) {
                 toast.error("Could not apply measurements. Check console logs or if values already match.", {duration: 4000}); // Updated toast
             }
        }
    };


  // --- AUTHENTICATION LISTENER & FREEMIUM CHECK ---
  useEffect(() => {
    let databaseUnsubscribe = null; // This will hold our database listener

    // This first listener only watches for LOGIN or LOGOUT
    const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsAuthLoading(true);

      // If a user was logged in, we must unsubscribe from their old doc
      if (databaseUnsubscribe) {
        databaseUnsubscribe();
      }

      if (currentUser) {
        // --- 1. USER IS LOGGED IN ---
        setUser(currentUser); // Set the user object

        // Now, set up a LIVE listener for this user's document
        const userDocRef = doc(db, 'users', currentUser.uid);

        databaseUnsubscribe = onSnapshot(userDocRef, async (userDocSnap) => {
          if (userDocSnap.exists()) {
            // --- 2. User document exists, READ THE DATA ---
            const userData = userDocSnap.data();
            const userRole = userData.role || 'basic';
            setUserRole(userRole);

            if (userRole === 'basic') {
              // Check for report limits (your existing logic)
              const reportLimit = 1000;
              const reportCount = userData.reportCount || 0;
              const lastReportDate = userData.lastReportDate?.toDate();
              const currentMonth = new Date().getMonth();

              if (lastReportDate && lastReportDate.getMonth() !== currentMonth) {
                // It's a new month, reset their count
                setIsRestricted(false);
                await updateDoc(userDocRef, { reportCount: 0, lastReportDate: serverTimestamp() });
              } else if (reportCount >= reportLimit) {
                setIsRestricted(true); // They are over the limit
              } else {
                setIsRestricted(false); // They are under the limit
              }
            } else {
              // --- 3. USER IS "pro" ---
              setIsRestricted(false);
            }
          } else {
            // --- 4. NEW USER ---
            // The document doesn't exist, so let's create it
            await setDoc(userDocRef, {
              email: currentUser.email,
              role: 'basic',
              reportCount: 0,
              lastReportDate: serverTimestamp(),
            });
            setUserRole('basic');
            setIsRestricted(false); // They are new, so they are not restricted yet
          }
          setIsAuthLoading(false); // Done loading
        }, (error) => {
          // Handle listener error
          console.error("Error listening to user document:", error);
          toast.error("Error syncing user profile.");
          setIsAuthLoading(false);
        });

      } else {
        // --- 5. USER IS LOGGED OUT ---
        setUser(null);
        setUserRole('basic');
        setIsRestricted(false);
        setIsAuthLoading(false);
      }
    });

    // Cleanup function for the auth listener
    return () => {
      authUnsubscribe();
      if (databaseUnsubscribe) {
        databaseUnsubscribe(); // Also clean up the DB listener
      }
    };
  }, []); // <-- Empty array is CRITICAL. This effect runs once on mount.

// --- (End of the replacement block) ---

// // Load the initial template once the editor is ready
//   useEffect(() => {
//     if (editor) {
//       loadTemplate(modality, template);
//     }
//   }, [editor]); // This will run only once when the editor is initialized

  // --- FETCH USER-SPECIFIC MACROS FROM FIRESTORE ---
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "users", user.uid, "macros"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userMacros = [];
        querySnapshot.forEach((doc) => {
          userMacros.push({ id: doc.id, ...doc.data() });
        });
        setMacros(userMacros);
      }, (error) => {
        console.error("Error fetching macros: ", error);
        toast.error("Could not fetch your macros.");
      });

      return () => unsubscribe(); // Cleanup listener on unmount or user change
    } else {
      setMacros([]); // Clear macros if user logs out
    }
  }, [user]);
  
  // --- ADD THIS ENTIRE BLOCK TO FETCH USER TEMPLATES ---
  useEffect(() => {
    if (user) {
      // Assumes your templates are stored in a subcollection named "templates"
      const templatesQuery = query(collection(db, "users", user.uid, "templates"));
      
      const unsubscribe = onSnapshot(templatesQuery, (querySnapshot) => {
        const fetchedTemplates = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Ensure the document has the required fields
          if (data.modality && data.name && data.content) {
            // Create the nested structure: { Modality: { TemplateName: "content" } }
            if (!fetchedTemplates[data.modality]) {
              fetchedTemplates[data.modality] = {};
            }
            fetchedTemplates[data.modality][data.name] = data.content;
          }
        });
        setUserTemplates(fetchedTemplates); // This updates the state with your saved templates
      }, (error) => {
        console.error("Error fetching user templates: ", error);
        toast.error("Could not fetch your custom templates.");
      });

      return () => unsubscribe(); // Cleanup the listener
    } else {
      setUserTemplates({}); // Clear templates on logout
    }
  }, [user]); // This effect runs when the user logs in
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully.");
    } catch (error) {
      console.error("Error signing out: ", error);
      toast.error("Failed to sign out.");
    }
  };

  const toastDone = (msg) =>
    toast(msg, {
      duration: 2500,
      ariaProps: { role: 'status', 'aria-live': 'polite' },
    });

  const runProactiveAnalysis = async (text) => {
    // No isRestricted check needed here as handleAiKnowledgeSearch handles it.
    // Ensure the proactive analysis itself doesn't trigger the searching state.
    // Let handleAiKnowledgeSearch manage the isSearching flag.

    const prompt = `
      Act as a radiological assistant. Analyze the following dictated text. Does it contain a specific, significant radiological finding that would benefit from an immediate knowledge lookup (like a named classification, a critical finding, or a finding with a well-defined differential diagnosis)? Examples include 'spiculated mass', 'ground glass opacity', 'Bosniak IIF cyst', 'ring-enhancing lesion'.

      If a key finding is present, respond with a JSON object: {"shouldSearch": true, "searchQuery": "the concise, optimal search term for that finding"}. For example, if the text says 'a 6mm ground glass opacity is seen', the searchQuery should be 'Fleischner criteria for 6mm ground glass opacity'. If the text says 'a complex cyst measuring 3 cm with multiple septations is seen in the right kidney', the searchQuery could be 'Bosniak classification for complex renal cyst'.

      If no specific, actionable finding is mentioned, or if the text is too generic, respond with {"shouldSearch": false, "searchQuery": null}. Only trigger a search for high-value terms.

      Dictated Text:
      ---
      ${text}
      ---
    `;
    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      };
      const model = 'gemini-2.5-flash';
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) return; // Fail silently

      const result = await response.json();
      const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

      if (textResult) {
        const parsedResult = JSON.parse(textResult);
        if (parsedResult.shouldSearch && parsedResult.searchQuery) {
          toast('Co-pilot found something relevant...', { icon: '💡' });
          // FIX: Explicitly set baseSearchQuery before calling the search
          setBaseSearchQuery(parsedResult.searchQuery);
          // Call handleAiKnowledgeSearch with isProactive=true and the query
          handleAiKnowledgeSearch(true, parsedResult.searchQuery);
        }
      }
    } catch (err) {
      console.error("Proactive analysis failed:", err); // Log error but don't bother the user
    }
    // No need to set isSearching here, handleAiKnowledgeSearch will do it.
  };


 


 
  // --- NEW FUNCTION: findMissingMeasurements ---
  const findMissingMeasurements = () => {
    if (!editor) return [];
    const editorText = editor.getText();
    const originalTemplateHtml = templates[modality]?.[template] || '';

    // Condition 1: Check for leftover "__" placeholders.
    const hasPlaceholders = /__/.test(editorText);

    // Condition 2: Check for keywords like "measures", "size", etc., that are NOT followed by a number.
    // This looks for the keyword, then optional whitespace, then something that isn't a digit or a period.
    const hasKeywordsMissingValues = /(measures |size |measuring|spans )\s*(?![0-9.])/i.test(editorText);

    
    // If neither condition is met, the report is likely complete.
    if (!hasPlaceholders && !hasKeywordsMissingValues) {
      return [];
    }

    const missingFields = new Set();

    // If placeholders are found, try to identify which ones by checking the original template.
    if (hasPlaceholders && originalTemplateHtml) {
      // This regex finds text that precedes a placeholder in the original template.
      const contextRegex = /([\w\s\d()\/.-]+?)\s*__/g;
      const templateText = htmlToText(originalTemplateHtml);
      let match;

      while ((match = contextRegex.exec(templateText)) !== null) {
        const context = match[1].trim();
        if (!context) continue;

        // The label is the most meaningful part of the context, usually the last few words.
        const label = context.split('\n').pop().replace(/:$/, '').trim();

        // Check if this specific placeholder is still present in the current editor text.
        const searchRegex = new RegExp(escapeRegex(context) + "\\s*__");
        if (searchRegex.test(editorText)) {
          missingFields.add(`'${label}'`);
        }
      }
    }
    
    // If we detected keywords without values, add a generic warning.
    if (hasKeywordsMissingValues) {
      missingFields.add("A value after a term like 'measures' or 'size'");
    }

    // If we only found placeholders but couldn't identify them, add a generic message.
    if (missingFields.size === 0 && hasPlaceholders) {
      missingFields.add("An unidentified measurement ('__')");
    }
console.log("Missing fields check:", missingFields); // Add log for debugging
    return Array.from(missingFields);
  };
  
  const extractStructuredData = async (text) => {
    if (isRestricted) return;
    setIsExtracting(true);
    const prompt = `
      Act as a clinical data extraction tool. Analyze the following radiology report text and extract key structured data points like organ names, specific measurements, laterality (left/right), and key pathological findings.
      Return the data as a single, valid JSON object. Do not include any explanatory text, comments, or markdown formatting.
      The keys of the JSON object should be the name of the data point (e.g., "Liver Size", "Right Kidney Finding").
      The values should be the extracted data (e.g., "16.5 cm", "Normal").
      If a piece of information isn't present, omit its key. Be concise.

      Text to analyze:
      ---
      ${text}
      ---
    `;
    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      };
      const model = 'gemini-2.5-flash';
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

      if (textResult) {
        const parsedJson = JSON.parse(textResult);
        setStructuredData(parsedJson);
      } else {
        setStructuredData({});
      }
    } catch (err) {
      console.error("Failed to extract structured data:", err);
      setStructuredData({});
    } finally {
      setIsExtracting(false);
    }
  };

  // const executeFunctionCall = useCallback(async (functionCall) => {
  //   const { name, args } = functionCall;

  //   console.log(`Executing function: ${name}`, args);
  //   toast(<>Executing: <b>{name}</b></>, { icon: '🤖' });

  //   switch (name) {
  //     case "analyzeImages":
  //       if (images.length > 0) {
  //         analyzeImages();
  //       } else {
  //         toast.error("Please upload images first.");
  //       }
  //       break;

  //     case "handleAiKnowledgeSearch":
  //       await handleAiKnowledgeSearch(true, args.query);
  //       break;

  //     case "insertMacro":
  //       const macroPhrase = args.macroName.toLowerCase().trim().replace(/[.,?]/g, '');
  //       const macro = macrosRef.current.find(m => m.command.toLowerCase().trim().replace(/[.,?]/g, '') === macroPhrase);
        
  //       if (macro) {
  //         isProgrammaticUpdate.current = true;
  //         editor.chain().focus().insertContent(macro.text).run();
  //         toast.success(`Inserted macro: ${macro.command}`);
  //       } else {
  //         toast.error(`Macro "${args.macroName}" not found.`);
  //       }
  //       break;

  //     case "generateFinalReport":
  //       await generateFinalReport();
  //       break;

  //     case "deleteLastSentence":
  //       const content = editor.state.doc.textContent;
  //       const sentences = content.trim().split(/(?<=[.?!])\s+/);
  //       if (sentences.length > 0) {
  //         const lastSentence = sentences[sentences.length - 1];
  //         const startOfLastSentence = content.lastIndexOf(lastSentence);
  //         if (startOfLastSentence !== -1) {
  //           const endOfLastSentence = startOfLastSentence + lastSentence.length;
  //           isProgrammaticUpdate.current = true;
  //           editor.chain().focus().deleteRange({ from: startOfLastSentence, to: endOfLastSentence }).run();
  //         }
  //       }
  //       break;

  //     default:
  //       console.warn(`Unknown function call: ${name}`);
  //   }
  // }, [editor, images, macrosRef, analyzeImages, handleAiKnowledgeSearch, generateFinalReport]); // Add all dependencies

  // // --- (NEW function for the hook's fallback) ---
  // const insertPlainText = useCallback((text) => {
  //   isProgrammaticUpdate.current = true;
  //   editor.chain().focus().insertContent(text + ' ').run();
  // }, [editor]); // Dependency is just the editor

  // const { 
  //   voiceStatus, 
  //   interimTranscript, 
  //   error: voiceError, // Renamed to avoid conflicts
  //   isDictationSupported, 
  //   handleToggleListening 
  // } = useVoiceAssistant({
  //   geminiTools,
  //   onFunctionCall: executeFunctionCall,
  //   onPlainText: insertPlainText
  // });

  // // Handle voice-specific errors (optional)
  // useEffect(() => {
  //   if (voiceError) {
  //     setError(voiceError); // Or use toast.error(voiceError)
  //   }
  // }, [voiceError]);

  // const getCorrectedTranscript = async (transcript) => {
  //   const prompt = `You are an expert medical transcriptionist. Correct any spelling or grammatical errors in the following text, paying close attention to radiological and medical terminology. Return only the corrected text. Text to correct: '${transcript}'`;
  //   try {
  //     const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
  //     const model = 'gemini-2.5-flash';
  //     const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
  //     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  //     const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  //     if (!response.ok) {
  //       console.error("API Error, falling back to original transcript");
  //       return transcript; // Fallback
  //     }
  //     const result = await response.json();
  //     const correctedText = result.candidates?.[0]?.content.parts?.[0]?.text;
  //     return correctedText || transcript;
  //   } catch (error) {
  //     console.error("Failed to get corrected transcript:", error);
  //     return transcript; // Fallback
  //   }
  // };

  // const handleToggleListening = useCallback(() => {
  //   if (!recognitionRef.current) {
  //     setError("Voice dictation is not supported by your browser.");
  //     return;
  //   }
  //   const currentStatus = voiceStatusRef.current;
  //   if (currentStatus !== 'idle') {
  //     recognitionRef.current.stop();
  //   } else {
  //     recognitionRef.current.start();
  //   }
  // }, []);

  // useEffect(() => {
  //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //   if (SpeechRecognition) {
  //     recognitionRef.current = new SpeechRecognition();
  //     const recognition = recognitionRef.current;
  //     recognition.continuous = true;
  //     recognition.interimResults = true;

  //     recognition.onstart = () => {
  //       setVoiceStatus('listening');
  //     };

  //     recognition.onresult = async (event) => {
  //       let finalTranscript = '';
  //       let currentInterim = '';
  //       for (let i = event.resultIndex; i < event.results.length; ++i) {
  //         if (event.results[i].isFinal) {
  //           finalTranscript += event.results[i][0].transcript.trim();
  //         } else {
  //           currentInterim += event.results[i][0].transcript;
  //         }
  //       }
  //       setInterimTranscript(currentInterim);

  //       if (finalTranscript) {
  //         isProgrammaticUpdate.current = true;
  //         await handleVoiceCommand(finalTranscript);
  //         setInterimTranscript('');
  //       }
  //     };

  //     recognition.onend = () => {
  //       setVoiceStatus('idle');
  //       setInterimTranscript('');
  //     };

  //     recognition.onerror = (event) => {
  //       console.error("Speech recognition error", event.error);
  //       setError(`Speech recognition error: ${event.error}`);
  //       setVoiceStatus('idle');
  //     };
  //   } else {
  //     setIsDictationSupported(false);
  //     setError("Voice dictation is not supported by your browser.");
  //   }

  //   return () => {
  //     if(recognitionRef.current) {
  //       recognitionRef.current.stop();
  //     }
  //   }
  // }, []); // This empty array is the source of the stale state, but we fix it with the ref.

  // const handleVoiceCommand = async (command) => {
  //   if (!editor || !command) return;
  //   const commandLC = command.toLowerCase().trim();

  //   const aiSearchKeyword = "look up";
  //   const commandKeyword = "command";
  //   const macroKeyword = "macro";

  //   if (commandLC.startsWith(aiSearchKeyword)) {
  //     const query = commandLC.substring(aiSearchKeyword.length).trim();
  //     if (query) {
  //       await handleAiKnowledgeSearch(true, query);
  //     }
  //     return; // Exit after handling
  //   }

  //   if (commandLC.startsWith(macroKeyword)) {
  //     const macroPhrase = commandLC.substring(macroKeyword.length).trim().replace(/[.,?]/g, '');
  //     const macro = macrosRef.current.find(m => macroPhrase === m.command.toLowerCase().trim().replace(/[.,?]/g, ''));
  //     if (macro) {
  //       isProgrammaticUpdate.current = true;
  //       editor.chain().focus().insertContent(macro.text).run();
  //     } else {
  //       console.warn(`Macro not found for: "${macroPhrase}"`);
  //     }
  //     return;
  //   }

  //   if (commandLC.startsWith(commandKeyword)) {
  //     const action = commandLC.substring(commandKeyword.length).trim().replace(/[.,?]/g, '');

  //     if (action === "analyze images") {
  //       analyzeImages();
  //     } else if (action === "download report") {
  //       const reportHtml = await generateFinalReport(); // Await the async function
  //       if (reportHtml) {
  //         downloadPdfReport(reportHtml);
  //       }
  //     } else if (action.startsWith("search for")) {
  //       const searchTerm = action.substring("search for".length).trim();
  //       setSearchQuery(searchTerm);
  //       setTimeout(() => {
  //         if(searchButtonRef.current) {
  //           searchButtonRef.current.click();
  //         }
  //       }, 100);
  //     } else if (action.startsWith("insert result")) {
  //       const numberWords = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5 };
  //       const resultNumStr = action.substring("insert result".length).trim();
  //       const resultNum = numberWords[resultNumStr] || parseInt(resultNumStr, 10);
        
  //       const { localSearchResults, allAiSearchResults, currentAiPage } = searchResultsRef.current;
  //       const combinedResults = [...localSearchResults, ...(allAiSearchResults[currentAiPage] || [])];
        
  //       if (!isNaN(resultNum) && resultNum > 0 && resultNum <= combinedResults.length) {
  //         isProgrammaticUpdate.current = true;
  //         insertFindings(combinedResults[resultNum - 1]);
  //       } else {
  //         console.warn(`Invalid result number for insertion: ${resultNumStr}`);
  //       }
  //     }
  //     else if (action.includes("delete last sentence")) {
  //       const content = editor.state.doc.textContent;
  //       const sentences = content.trim().split(/(?<=[.?!])\s+/);
  //       if (sentences.length > 0) {
  //         const lastSentence = sentences[sentences.length - 1];
  //         const startOfLastSentence = content.lastIndexOf(lastSentence);
  //         if (startOfLastSentence !== -1) {
  //           const endOfLastSentence = startOfLastSentence + lastSentence.length;
  //           isProgrammaticUpdate.current = true;
  //           editor.chain().focus().deleteRange({ from: startOfLastSentence, to: endOfLastSentence }).run();
  //         }
  //       }
  //     } else if (action.includes("bold last sentence") || action.includes("bold the last sentence")) {
  //       const content = editor.state.doc.textContent;
  //       const sentences = content.trim().split(/(?<=[.?!])\s+/);
  //         if (sentences.length > 0) {
  //           const lastSentence = sentences[sentences.length - 1];
  //           const startOfLastSentence = content.lastIndexOf(lastSentence);
  //             if (startOfLastSentence !== -1) {
  //               const endOfLastSentence = startOfLastSentence + lastSentence.length;
  //               isProgrammaticUpdate.current = true;
  //               editor.chain().focus().setTextSelection({ from: startOfLastSentence, to: endOfLastSentence }).toggleBold().run();
  //             }
  //         }
  //     }
  //     return;
  //   }
    
  //   const correctedText = await getCorrectedTranscript(command);
  //   isProgrammaticUpdate.current = true;
  //   editor.chain().focus().insertContent(correctedText + ' ').run();
  // };

  const fileToImageObject = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        const src = URL.createObjectURL(file);
        resolve({ src, base64, name: file.name, type: file.type, file }); // Store original file for dicom loader
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
    const onDrop = useCallback(async (acceptedFiles, _, event) => {
    let filesToProcess = [...acceptedFiles];

    // If no files were accepted directly, try to parse the data transfer object
    // This handles cases like dragging from a native app that provides HTML or raw image data
    if (acceptedFiles.length === 0 && event.dataTransfer) {
      const droppedItems = await Promise.all(
        Array.from(event.dataTransfer.items).map(async (item) => {
          if (item.type.startsWith('image/')) {
            return item.getAsFile();
          }
          if (item.type === 'text/html') {
            const html = await new Promise(resolve => item.getAsString(resolve));
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const img = tempDiv.querySelector('img');
            if (img && img.src) {
              // Handle base64 data URIs
              if (img.src.startsWith('data:')) {
                const response = await fetch(img.src);
                const blob = await response.blob();
                return new File([blob], 'pasted-image.png', { type: blob.type });
              }
              // Note: file:/// URIs cannot be accessed due to browser security.
              // We can't fix this case, but we handle base64 which is common.
            }
          }
          return null;
        })
      );
      filesToProcess.push(...droppedItems.filter(Boolean));
    }

    if (filesToProcess.length > 0) {
      try {
        const newImageObjects = await Promise.all(filesToProcess.map(file => fileToImageObject(file)));
        setImages(prevImages => [...prevImages, ...newImageObjects]);
        if (newImageObjects.length > 0 && !selectedImage) {
            setSelectedImage(newImageObjects[0]);
        }
      } catch (error) {
        console.error("Error processing dropped files:", error);
        toast.error("Could not process one or more of the dropped items.");
      }
    }
  }, [selectedImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': ['.png', '.jpeg', '.jpg', '.dcm'], 'application/dicom': ['.dcm'] } });


  const handleSelectRecentReport = (report) => {
    // This function extracts the main body of the report, skipping the patient header
    const bodyMatch = report.reportHTML.match(/<\/table>\s*<\/div>([\s\S]*)/);
    const reportBody = bodyMatch ? bodyMatch[1].trim() : report.reportHTML;

    setPatientName(report.patientName);
    setExamDate(report.examDate);
    // You can add other fields here if you save them to Firestore

    if (editor) {
      isProgrammaticUpdate.current = true;
      editor.commands.setContent(reportBody);
      setEditorContent(reportBody); // <-- THIS LINE IS ADDED
      setUserFindings(reportBody); // Also update the state
    }
    toast.success(`Loaded report for ${report.patientName}`);
  };

  const removeImage = (indexToRemove) => {
    setImages(currentImages => {
        const newImages = currentImages.filter((_, index) => index !== indexToRemove);
        if (selectedImage && currentImages[indexToRemove]?.src === selectedImage.src) {
            setSelectedImage(newImages.length > 0 ? newImages[0] : null);
        }
        return newImages;
    });
  };

  

   const analyzeImages = async () => {
       if (isRestricted) {
      toast.error("Please upgrade to Pro for AI image analysis.");
      return; // Stop the function
    }

    if (images.length === 0) {
      setError("Please upload one or more images first.");
      return;
    }
    setIsAiLoading(true);
    setAiAnalysisStatus('Analyzing images...');
    setError(null);
    setAiMeasurements([]);
    setActiveAlert(null);
    setCorrectionSuggestion(null);


    
  //   const prompt = `
  //  You are a highly observant, knowledgable and one of the most experienced Senior Radiologist and Cardiologist specialized in the analysis of medical imaging with an experience of 20+ years on studies like Ultrasound, X-Ray, MRI, CT, 2d-Echo, 3d-Echo, ECG, etc .
  //   Given one or more medical images and optional clinical context, you must analyze the content and return a single, valid JSON object.
  //   The root of this object must contain the following keys: "analysisReport", "measurements", and "criticalFinding".

  //   1. "analysisReport" (String): A comprehensive, human-readable narrative report describing the findings and impressions, formatted as an HTML string with <p> and <strong> tags.**Note: Impression should provide brief info about the finding not repeat the same thing (for example for this finding:'Two well defined hyperechoic lesions are noted in the subcutaneous plane of anterior abdominal wall in left hypochondria region with no e/o vascularity on applying colour doppler likely to be lipoma, largest measuring 2.1 x 0.8 x 1.1 cm' , The Impression should be :•	'Anterior Abdomial wall lipoma.')
  //   2. "measurements" (Array of Objects): An array for all identifiable and measurable findings. If none, return an empty array []. Each object must contain:
  //    - "finding" (String): A concise description of the object being measured (e.g., "Right Kidney", "Aortic Diameter", "Pulmonary Nodule in Left Upper Lobe").
  //    - "value" (String): The measurement value with units (e.g., "10.2 x 4.5 cm", "4.1 cm", "8 mm").
  //   3. "criticalFinding" (Object or Null): An object for actionable critical findings. If none, this MUST be null. If a critical finding is detected, the object MUST contain:
  //    - "findingName" (String): The specific name of the critical finding (e.g., "Aortic Dissection").
  //    - "reportMacro" (String): A pre-defined sentence for the report (e.g., "CRITICAL FINDING: Acute aortic dissection is identified.").
  //    - "notificationTemplate" (String): A pre-populated message for communication (e.g., "URGENT: Critical finding on Patient [Patient Name/ID]. CT shows acute aortic dissection...").
        
  //      **Please remove this for reference only** Clinical Context: "${clinicalContext || 'None'}"
  //      OR If Given one or more images of the ready-to-print report then :
  //     1.  **Extract Text**: Accurately extract all text from the provided image(s) to form a complete report.
  //     2.  **Analyze for Inconsistencies**:
  //     * Review the "body" of the report which contains all the findings to identify all significant radiological findings.
  //     * Compare these findings with the "IMPRESSION" section.
  //     * If a significant finding from the body is missing from the impression (e.g., "fatty liver" is in findings but not impression), or if the significant finding present in the impression is missing in the body of the report that contains all the findings,  identify it.
  //     3.  **Generate Correction and Alert**:
  //     * If an inconsistency is found, create a 'suggestedCorrection' string. This should be the exact text to add to the impression (e.g., "Grade I fatty liver.").
  //     * Also create a concise 'inconsistencyAlert' message explaining the issue (e.g., "'Grade I fatty liver' was found but is missing from the impression.").

  //      Return a single JSON object with the following keys. Do not include any other text or markdown.
  //      * 'analysisReport': The **original, uncorrected** report text, extracted from the image, as an HTML string.
  //      * 'measurements': An array of any measurements found (or an empty array if none).
  //      * 'criticalFinding': An object for any critical findings (or null if none).
  //      * 'inconsistencyAlert': A string explaining the inconsistency, or null if none was found.
  //      * 'suggestedCorrection': The string to be added to the impression to fix the issue, or null if none is needed.

    
  //   **Your Response MUST be a single, valid JSON object following one of these two schemas:**

  //   ---
  //   **Schema 1: High-Confidence Analysis (Default)**
  //   {
  //     "analysisSuccessful": true,
  //     "analysisReport": "string (The full report, formatted as an HTML string with <p> and <strong> tags.)",
  //     "measurements": [{ "finding": "string", "value": "string" }],
  //     "criticalFinding": { "findingName": "string", "reportMacro": "string", "notificationTemplate": "string" } | null
  //   }
  //   ---
  //   **Schema 2: Clarification Needed**
  //   {
  //     "analysisSuccessful": false,
  //     "clarificationNeeded": true,
  //     "questionForDoctor": "string (Your specific, concise question for the doctor.)"
  //   }
  //   ---
    
  //   Clinical Context: "${clinicalContext || 'None'}"
  //   `;

   const prompt = `You are a highly observant, knowledgeable, and experienced Senior Radiologist and Cardiologist with over 20 years of experience in analyzing medical imaging studies (Ultrasound, X-Ray, MRI, CT, Echo, ECG, etc.). Your primary goal is to assist in radiology reporting by analyzing medical images and generating accurate, consistent, and structured reports.

You MUST always respond with a single, valid JSON object.

### Core Workflow

First, determine the nature of the input image(s) and follow the appropriate workflow:
* If the input is a medical scan: Follow the **"Workflow A: Template-First Reporting"**.
* If the input is an image of a pre-existing typed report: Follow the **"Workflow B: Report Inconsistency Check"**.

---

### Workflow A: Template-First Reporting (Default for Scans)

Your goal is to ensure consistency by using pre-defined templates.

**1. Context: Available Templates**
You have access to the following HTML report templates. The key for each template is the name of the body part.

\`\`\`json
{
  "Abdomen": "<h3>IMPRESSION:</h3><p>1. No sonographic evidence of significant abnormality in the upper abdomen.</p><h3>FINDINGS:</h3><p><strong>LIVER:</strong> Normal in size (spans __ cm), contour, and echotexture...</p>",
  "Pelvis": "<h3>IMPRESSION:</h3><p>1. Unremarkable ultrasound of the pelvis.</p><h3>FINDINGS:</h3><p><strong>URINARY BLADDER:</strong> Adequately distended, with a normal wall thickness...</p>",
  "Abdomen and Pelvis" : "<p><strong>LIVER:</strong> The liver is normal in size _cm, shape & echotexture. Hepatic veins and intrahepatic portal vein radicles are normal in size and distribution. No focal solid or cystic mass lesion is noted.</p>
      <p><strong>GALL BLADDER:</strong> Gall bladder appeared normal. No mural mass or calculus is noted.</p>
      <p><strong>CBD:</strong> Common bile duct appeared normal. No calculi seen in the common bile duct.</p>
      <p><strong>PANCREAS:</strong> Is normal in shape size and echotexture. No focal lesion seen.</p>
      <p><strong>SPLEEN:</strong> Spleen is normal in size _cm, shape and echotexture. No focal lesion is seen.</p>
      <p><strong>KIDNEYS:</strong> Right kidney measures _ x _ x _cm with parenchymal thickness _cm and Left kidney measures _ x _ x _cm with parenchymal thickness _cm. Both kidneys are normal in size, shape, position, echogenicity and echotexture. Normal corticomedullary differentiation is noted. Pelvicalyceal systems on both sides are normal.</p>
      <p><strong>URETERS:</strong> Visualized portions of both ureters are not dilated. No calculus is seen in the portions of ureters which can be seen by sonography.</p>
      <p><strong>URINARY BLADDER:</strong> The urinary bladder shows physiological distention. No calculus or mass lesion is seen.</p>
      <p><strong>PROSTATE:</strong> The prostate is normal in shape, position, echogenicity and echotexture. There is no focal solid or cystic mass lesion in it.</p>
      <p><strong>OTHER:</strong> Visualized portions of IVC and Aorta are grossly normal. There is no free or loculated fluid collection in abdomen or pelvis. No significant lymphadenopathy is noted.</p>
      <br>
      <p><strong>IMPRESSION:</strong></p>
      <p>• No significant abnormality is seen.</p>"
  "//": "Add other user-defined templates here"
}
\`\`\`

**2. Rules for Template-First Reporting**
   1.  **Analyze and Match:** Analyze the medical image(s) to identify the primary body part. Match this to one of the available templates.
   2.  **Adopt & Fill Template:** If a matching template is found, you **MUST** use its exact HTML structure as the base. Analyze the images for findings and measurements, and intelligently insert them into the appropriate sections or placeholders (\`__\`) of the template. This filled-in template becomes the value for the "analysisReport" key in your final JSON output.
   3.  **Handle Exceptions:**
       * **No Template Found:** If, and **ONLY** if, no matching template is found, you are then permitted to generate a new, comprehensive narrative report from scratch. This becomes the "analysisReport".
       * **User Override:** If the user's request explicitly contains phrases like "generate a different version," you may ignore the templates and generate a new narrative report.

---

### Workflow B: Report Inconsistency Check (For Images of Reports)

Your goal is to act as a quality control assistant.

**Rules for Inconsistency Check**
1.  **Extract Text:** Accurately extract all text from the provided image(s) to form a complete report. This will be the value for "analysisReport".
2.  **Analyze for Inconsistencies:** Review the "FINDINGS" section to identify all significant radiological findings. Compare these with the "IMPRESSION" section. Identify any major discrepancies (e.g., a finding mentioned in one section but absent in the other).
3.  **Generate Correction & Alert:** If an inconsistency is found, create a \`suggestedCorrection\` string (the exact text to add to the impression) and a concise \`inconsistencyAlert\` message explaining the issue. If none is found, these keys should be \`null\`.

---

### User-Provided Input

You will be given the medical images and the following clinical context provided by the doctor:
**Clinical Context: "\${clinicalContext || 'None'}"**

---

### Final JSON Output Specification

Regardless of the workflow used, your final output **MUST** be a single, valid JSON object. Combine the results of your analysis into one of the following schemas.

**Schema 1: Successful Analysis (From Workflow A or B)**
\`\`\`json
{
  "analysisSuccessful": true,
  "analysisReport": "string (The full report, either generated or extracted, as an HTML string.)",
  "measurements": [{ "finding": "string", "value": "string" }] | [],
  "criticalFinding": { "findingName": "string", "reportMacro": "string", "notificationTemplate": "string" } | null,
  "inconsistencyAlert": "string" | null,
  "suggestedCorrection": "string" | null
}
\`\`\`

**Schema 2: Clarification Needed (Fallback for Workflow A)**
\`\`\`json
{
  "analysisSuccessful": false,
  "clarificationNeeded": true,
  "questionForDoctor": "string (Your specific, concise question for the doctor.)"
}
\`\`\`

**Key Definitions:**
* **\`analysisReport\`**: A comprehensive HTML report. **Note for Impression:** The impression should provide brief info about the finding, not repeat the entire finding text (e.g., for '...hyperechoic lesion...likely lipoma...', the Impression should be 'Anterior abdominal wall lipoma.').
* **\`measurements\`**: An array of all measurable findings. Empty \`[]\` if none.
* **\`criticalFinding\`**: An object for actionable critical findings. **MUST** be \`null\` if none are detected.
* **\`inconsistencyAlert\` / \`suggestedCorrection\`**: **ONLY** used for Workflow B. They **MUST** be \`null\` when analyzing medical scans (Workflow A).
`;

    try {
      setAiAnalysisStatus('Processing images...');
      const imageParts = [];
      for (const image of images) {
        try {
          let base64Data = image.base64;
          let mimeType = image.type;

          if (!base64Data && !image.file) {
            console.warn(`Skipping image with no data: ${image.name}`);
            continue;
          }
          
          if (image.type === 'application/dicom' || image.name.toLowerCase().endsWith('.dcm')) {
            if (!image.file) {
                console.warn(`Skipping DICOM with no file object: ${image.name}`);
                continue;
            }
            base64Data = await convertDicomToPngBase64(image.file);
            mimeType = 'image/png';
          }

          if (!base64Data) {
            console.warn(`Skipping image after failed processing: ${image.name}`);
            continue;
          }

          imageParts.push({
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          });
        } catch (procError) {
          console.error(`Could not process image ${image.name}:`, procError);
          toast.error(`Failed to process image: ${image.name}`);
        }
      }

      if (imageParts.length === 0) {
        throw new Error("No images could be processed for analysis.");
      }
      
      setAiAnalysisStatus('Sending to AI...');

      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] }],
        generationConfig: { responseMimeType: "application/json" }
      };

      const model = 'gemini-2.5-flash';
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error Response:", errorBody);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // --- NEW, CRUCIAL DEBUGGING STEP ---
      console.log("RAW API RESPONSE:", JSON.stringify(result, null, 2));

      // --- NEW, MORE ROBUST CHECK ---
      if (!result.candidates || result.candidates.length === 0) {
        let reason = "The AI returned an empty response.";
        if (result.promptFeedback?.blockReason) {
            reason = `The request was blocked. Reason: ${result.promptFeedback.blockReason}.`;
        } else if (result.candidates?.[0]?.finishReason === 'SAFETY') {
            reason = "The response was blocked by safety filters.";
        }
        throw new Error(reason + " Please check your input or adjust safety settings in your Google AI project.");
      }
      
      const textResult = result.candidates[0]?.content?.parts?.[0]?.text;

      if (textResult) {
        const parsedResult = JSON.parse(textResult);
       if (parsedResult.analysisSuccessful) {
          if (parsedResult.analysisReport) { // Check if the key exists
            // THIS IS THE FIX: Set editor directly, then set state
            isProgrammaticUpdate.current = true;
            if (editor) editor.commands.setContent(parsedResult.analysisReport);
            setEditorContent(parsedResult.analysisReport);
            console.log('%c AI ANALYSIS:', 'color: green; font-weight: bold;', 'Setting editor content.');
            toastDone('AI analysis complete');
          }

          if (parsedResult.measurements) {
            setAiMeasurements(parsedResult.measurements);
          }
          const openingMessage = {
            sender: 'ai',
            text: 'Analysis complete. The report has been drafted. Ask any follow-up questions.'
          };
          setConversationHistory([openingMessage]);
          setIsConversationActive(true);
        } else if (parsedResult.clarificationNeeded) {
          const clarificationMessage = { sender: 'ai', text: parsedResult.questionForDoctor };
          setConversationHistory([clarificationMessage]);
          setIsConversationActive(true);
          toast.info('AI needs clarification.', { icon: '🤔' });
        }
        if (parsedResult.criticalFinding) {
          setActiveAlert({ type: 'critical', data: parsedResult.criticalFinding });
          setIsAwaitingAlertAcknowledge(true);
        }
      } else {
        throw new Error("AI response was received, but it was empty or in an unexpected format.");
      }
    } catch (err) {
      setError(`Failed to analyze images. ${err.message}`);
      console.error(err);
    } finally {
      setIsAiLoading(false);
      setAiAnalysisStatus('');
    }
  };

  // Inside your App component in App.legacy.jsx

const handleUpgrade = async () => {
  toast.loading("Initializing payment...");

  try {
    // 1. Get the Firebase Auth Token
    if (!auth.currentUser) {
      toast.error("You must be logged in to upgrade.");
      return;
    }
    const token = await auth.currentUser.getIdToken();

    // 2. CALL YOUR VERCEL API to create an order
    const response = await fetch('/api/createOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Send the token
      },
      body: JSON.stringify({ amount: 50000 }), // e.g., 50000 = ₹500.00
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to create order.");
    }

    const order = await response.json();

    // 3. DEFINE OPTIONS for the Razorpay modal
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your *public* Key ID
      amount: order.amount,
      currency: order.currency,
      name: "aiRAD Reporting",
      description: "Pro Subscription",
      order_id: order.id,

      // 4. DEFINE THE HANDLER (This runs on success)
      handler: async (response) => {
        toast.loading("Verifying payment...");
        try {
          // 5. Get a FRESH token (important!)
          const newToken = await auth.currentUser.getIdToken(true);

          // 6. CALL YOUR VERCEL API to verify the payment
          const verifyResponse = await fetch('/api/verifyPayment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${newToken}`,
            },
            body: JSON.stringify({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });

          if (!verifyResponse.ok) {
            const err = await verifyResponse.json();
            throw new Error(err.error || "Verification failed.");
          }

          toast.dismiss();
          toast.success("Upgrade successful! Welcome to Pro.");
          // Your app's `onAuthStateChanged` listener will automatically
          // see the new "pro" role on the next refresh/token change.

        } catch (error) {
          console.error("Payment verification failed:", error);
          toast.dismiss();
          toast.error(`Verification failed: ${error.message}`);
        }
      },
      prefill: {
        email: auth.currentUser.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    // 7. OPEN THE RAZORPAY CHECKOUT MODAL
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      toast.dismiss();
      toast.error("Payment failed. Please try again.");
      console.error("Razorpay failure:", response.error);
    });

    toast.dismiss();
    rzp.open();

  } catch (error) {
    console.error("Order creation failed:", error);
    toast.dismiss();
    toast.error(`Error: ${error.message}`);
  }
};

  
// In App.legacy.jsx, replace the old handleSearch function with this:

  const handleLocalSearch = (query) => {
    if (!query) {
        setError("Please provide a search term.");
        return;
    }
    setError(null);
    
    // --- THIS IS THE FIX ---
    // 1. Set the states so the UI updates
    setSearchQuery(query); 
    setBaseSearchQuery(query); 
    
    // 2. Use the query to perform the search
    const queryLC = query.toLowerCase().trim();
    const results = localFindings.filter(finding =>
        finding.organ.toLowerCase().includes(queryLC) ||
        finding.findingName.toLowerCase().includes(queryLC)
    );
    setLocalSearchResults(results);

    // 3. Reset other search types
    setAllAiSearchResults([]);
    setCurrentAiPage(0);
    setAllAiFullReports([]);
    setCurrentReportPage(0);
    setAiKnowledgeLookupResult(null);
  };
  
  // In App.legacy.jsx, replace the old handleAiFindingsSearch with this:

  const handleAiFindingsSearch = async (queryOrIsMore, isMoreQueryFlag = false) => {
    // if (isRestricted) { ... }

    let queryToUse;
    let isMoreQuery = false;

    // --- THIS IS THE FIX ---
    if (typeof queryOrIsMore === 'string') {
      // 1. A new search query was passed (from voice or input)
      queryToUse = queryOrIsMore;
      setBaseSearchQuery(queryToUse); // Set this as the new base query
      setSearchQuery(queryToUse); // Also update the search box text
      isMoreQuery = false;
    } else if (typeof queryOrIsMore === 'boolean' && queryOrIsMore === true) {
      // 2. The "More" button was clicked (old logic)
      queryToUse = `${baseSearchQuery} some more`;
      isMoreQuery = true;
    } else {
      // 3. Fallback or initial search button click without query
      queryToUse = baseSearchQuery;
      isMoreQuery = isMoreQueryFlag; // Use the flag
    }
    
    if (!queryToUse) {
      setError("Please perform a standard search first.");
      return;
    }
    
    setIsSearching(true);
    setError(null);
    setAiKnowledgeLookupResult(null); // Clear knowledge results

    const existingFindingNames = allAiSearchResults.flat().map(r => r.findingName);
    const existingReportText = allAiFullReports.map(r => r.fullReportText).join('\n\n---\n\n');
    const isReportContext = allAiFullReports.length > 0;

    const prompt = `
      You are an AI assistant for radiologists, focused on generating report content. Analyze the user's search query: "${queryToUse}".
      Your task is to generate content for a medical report. Determine the query's intent from the following options:
      1.  A request to generate a **Full Report** from a descriptive sentence (e.g., "USG report for an ankle with mild thickening of ATFL").
      2.  A request for a list of **General Findings** related to an organ or system (e.g., "liver findings", "carotid disease").
      3.  A request for a **Specific Finding** to be inserted into a report (e.g., "Grade I fatty liver").

      Based on the determined intent, you MUST respond with a single, valid JSON object using ONE of the following schemas.

      ---
      **SCHEMA 1: Full Report**
      ${isMoreQuery && existingReportText ? `You have already generated the following report(s). Please provide a different version or variation, avoiding repetition: \n\n${existingReportText}` : ''}
      {
        "queryType": "fullReport",
        "modality": "string",
        "template": "string",
        "fullReportText": "string (The full report text, formatted as a single HTML string with appropriate <p> and <strong> tags for structure and readability.)"
      }

      ---
      **SCHEMA 2: General or Specific Findings**
      ${isMoreQuery && existingFindingNames.length > 0 ? `Exclude these findings if possible: ${JSON.stringify(existingFindingNames)}.` : ''}
      {
        "queryType": "generalFindings",
        "results": [
          {
            "findingName": "string",
            "organ": "string",
            "findings": "string",
            "impression": "string"
          }
        ]
      }
    `;

    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      };
      const model = 'gemini-2.5-flash';
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

      const result = await response.json();
      if (result.candidates?.[0]?.content.parts?.[0]?.text) {
        const textResult = result.candidates[0].content.parts[0].text;
        
        try {
          const parsedResult = JSON.parse(textResult);

          if (parsedResult.queryType === 'fullReport' && parsedResult.fullReportText) {
            setAllAiFullReports(prev => [...prev, parsedResult]);
            setCurrentReportPage(allAiFullReports.length);
            if (!isReportContext) {
              setAllAiSearchResults([]);
              setLocalSearchResults([]);
            }
          } else if (parsedResult.results) {
            if (isReportContext) {
              setError("AI returned findings when a new report version was expected. Please try again.");
            } else {
              setAllAiSearchResults(prev => [...prev, parsedResult.results]);
              setCurrentAiPage(allAiSearchResults.length);
              if (allAiSearchResults.length === 0) {
                setAllAiFullReports([]);
              }
            }
          } else {
            setError("The AI returned a response with an unexpected format.");
          }

        } catch (jsonError) {
          console.error("JSON Parsing Error:", jsonError, "Raw Text:", textResult);
          setError("The AI returned a non-standard response. Please try rephrasing your query.");
        }
      } else {
        throw new Error("Search failed.");
      }
    } catch (err) {
      setError("Failed to perform search. " + err.message);
    } finally {
      setIsSearching(false);
    }
  };
  


  // --- UPDATED FUNCTION: checkForCriticalFindings ---
  const checkForCriticalFindings = useCallback(async (plainTextFindings) => {
    if (isAwaitingAlertAcknowledge) return;
    const prompt = `
      Act as a vigilant radiologist. Analyze the following report text for critical, urgent, or unexpected findings that require immediate attention (e.g., pneumothorax, aortic dissection, acute hemorrhage, large vessel occlusion).

      If a critical finding is detected, respond with a JSON object containing the full critical finding details.
      If no critical finding is detected, respond with a JSON object where "criticalFinding" is null.

      The JSON object MUST follow this exact schema:
      {
        "criticalFinding": {
          "findingName": "string",
          "reportMacro": "string",
          "notificationTemplate": "string"
        } | null
      }

      Report Text:
      ---
      ${plainTextFindings}
      ---
    `;
    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      };
      const model = 'gemini-2.5-flash';
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) return; // Fail silently
      const result = await response.json();
      const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;
      if (textResult) {
        const parsed = JSON.parse(textResult);
        if (parsed.criticalFinding) {
          setActiveAlert({ type: 'critical', data: parsed.criticalFinding });
          setIsAwaitingAlertAcknowledge(true);
        } else {
          setActiveAlert(prev => (prev?.type === 'critical' ? null : prev));
        }
      }
    } catch (err) {
      console.error("Critical finding check failed:", err);
    }
  }, [isAwaitingAlertAcknowledge]);

  const handleGetSuggestions = async (type) => {
    if (!editor) {
      setError("Editor not initialized. Please wait and try again.");
      return;
    }
    const reportText = editor.getText();
    if (!reportText.trim()) {
      setError("Please enter some findings before requesting suggestions.");
      return;
    }
    
    setIsSuggestionLoading(true);
    setError(null);
    setSuggestionType(type);
    
    let prompt = '';
    if (type === 'differentials') {
      prompt = `
        Act as a highly experienced diagnostic radiologist with deep knowledge across various modalities and pathologies, including both common and uncommon conditions.

        Carefully analyze the key imaging features described in the **Findings** section of the following radiology report.

        Based *specifically* on these key imaging features, generate a list of the **3 to 5 most relevant potential differential diagnoses**.

        For each differential diagnosis:
        1.  State the name of the condition clearly.
        2.  **Crucially, list the specific imaging findings** from the provided report text that support this possibility.
        3.  Briefly mention any **key distinguishing imaging features** (present or absent in the report) that help differentiate this diagnosis from others on the list, if applicable and concise.
        4.  Provide an estimated likelihood using one of these terms: **Most Likely, Possible, Less Likely, Remote**.

        Present the differentials in order, starting with the most likely. Format the output as a numbered list. Ensure the rationale directly connects the findings to the potential diagnoses.

        Findings:
        ---
        ${reportText}
        ---
      `;
    } else if (type === 'recommendations') {
      prompt = `
        Act as a highly experienced, detail-oriented expert radiologist, fully aware of current clinical guidelines (e.g., ACR appropriateness criteria, Fleischner criteria where relevant).

        Analyze the following radiology report, paying close attention to the **Impression** section to identify the most clinically significant findings.

        Based *specifically* on these significant findings, provide a list of **3 to 5 clinically appropriate follow-up actions or recommendations**.

        For each recommendation:
        1.  State the recommendation clearly and concisely (e.g., "Follow-up CT chest in 6 months," "Correlation with liver function tests recommended," "Surgical consultation advised").
        2.  Briefly explain the clinical reasoning or guideline supporting it, directly linking it to a finding in the impression.
        3.  Prioritize the recommendations based on the urgency or importance of the corresponding findings.

        Ensure the recommendations are precise, accurate, evidence-based where applicable, and directly relevant to the report's conclusions. Format the output as a numbered list. Avoid generic advice.

        Report:
        ---
        ${reportText}
        ---
      `;
    }

    try {
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
      const model = 'gemini-2.5-flash';
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

      const result = await response.json();
      const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

      if (textResult) {
        setAiSuggestions(textResult);
        setShowSuggestionsModal(true);
      } else {
        throw new Error("No suggestions returned from AI.");
      }
    } catch (err) {
      setError("Failed to get suggestions. " + err.message);
    } finally {
      setIsSuggestionLoading(false);
    }
  };

  const handleParseReport = async () => {
    if (!assistantQuery) {
      setError("Please paste a report into the AI Assistant box to parse.");
      return;
    }
    setIsParsing(true);
    setError(null);

    const prompt = `
      Act as a data extraction engine. Parse the following unstructured medical report and return a structured JSON object.
      The JSON object must follow this exact schema:
      {
        "patientName": "string",
        "patientId": "string",
        "patientAge": "string",
        "referringPhysician": "string",
        "examDate": "YYYY-MM-DD",
        "modality": "string (e.g., Ultrasound, X-Ray)",
        "bodyPart": "string (e.g., Abdomen, Knee)",
        "reportBody": "string (the full findings and impression text, formatted as an HTML string with <p> and <strong> tags)"
      }

      Report to Parse:
      ---
      ${assistantQuery}
      ---
    `;
    try {
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
      const model = 'gemini-2.5-flash';
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      
      const result = await response.json();
      const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

      if (textResult) {
        const jsonString = textResult.match(/```json\n([\s\S]*?)\n```/s)?.[1] || textResult;
        const parsed = JSON.parse(jsonString);
        
        if(parsed.patientName) setPatientName(parsed.patientName);
        if(parsed.patientId) setPatientId(parsed.patientId);
        if(parsed.patientAge) setPatientAge(parsed.patientAge);
        if(parsed.referringPhysician) setReferringPhysician(parsed.referringPhysician);
        if(parsed.examDate) setExamDate(parsed.examDate);
        if(parsed.modality) setModality(parsed.modality);
        if(parsed.bodyPart) setTemplate(parsed.bodyPart);
       if(parsed.reportBody && editor) {
          isProgrammaticUpdate.current = true;
          editor.commands.setContent(parsed.reportBody);
          setEditorContent(parsed.reportBody); // <-- THIS LINE IS ADDED
        }

        setAssistantQuery(''); // Clear the box after parsing
      } else {
        throw new Error("Could not parse the report.");
      }
    } catch (err) {
      setError("Failed to parse report. " + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const appendSuggestionsToReport = () => {
    if (!aiSuggestions || !editor) return;

    const header = suggestionType === 'differentials'
      ? "<h3>DIFFERENTIAL DIAGNOSIS:</h3>"
      : "<h3>RECOMMENDATIONS:</h3>";
    
    const formattedSuggestions = `<p>${aiSuggestions.replace(/\n/g, '<br>')}</p>`;
    
    isProgrammaticUpdate.current = true;
    editor.chain().focus().insertContent(`<br>${header}${formattedSuggestions}`).run();

    setShowSuggestionsModal(false);
    setAiSuggestions('');
  };

  const handleNextPage = () => {
    if (currentAiPage >= allAiSearchResults.length - 1) {
      handleAiFindingsSearch(true);
    } else {
      setCurrentAiPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentAiPage > 0) {
      setCurrentAiPage(prev => prev - 1);
    }
  };

  const handleNextReport = () => {
    if (currentReportPage >= allAiFullReports.length - 1) {
      handleAiFindingsSearch(true);
    } else {
      setCurrentReportPage(prev => prev + 1);
    }
  };

  const handlePreviousReport = () => {
    if (currentReportPage > 0) {
      setCurrentReportPage(prev => prev - 1);
    }
  };
  
  const insertFindings = (findingToInsert) => {
    if (!editor) return;
    isProgrammaticUpdate.current = true;

    // Handle full reports from both AI (queryType) and local findings (isFullReport)
    if (findingToInsert.queryType === 'fullReport' || findingToInsert.isFullReport) {
        const { modality: newModality, template: newTemplate, fullReportText, findings, findingName } = findingToInsert;
        
        // Use fullReportText from AI or findings from local data
        const contentToInsert = fullReportText || findings;

        if (newModality) setModality(newModality);
        if (newTemplate) setTemplate(newTemplate);
        
        // Replace the entire editor content with the formatted HTML
        editor.commands.setContent(contentToInsert);
        setEditorContent(contentToInsert); // <-- THIS LINE IS ADDED
        toast.success(`Inserted '${findingName}' report.`);
        return;
    }

    // This part handles inserting individual findings into an existing template
    const { organ, findings, impression } = findingToInsert;
    let currentHtml = editor.getHTML();
    
    const newFindingText = ` ${findings}`;
    const newImpressionHtml = `<p>- ${impression}</p>`;

    const organRegex = new RegExp(`(<p><strong>${organ.replace(/ /g, "\\s*")}:<\\/strong>)(.*?)(<\\/p>)`, "i");
    const organMatch = currentHtml.match(organRegex);

    let wasFindingHandled = false;
    if (organMatch) {
        const openingTags = organMatch[1];
        const existingContent = organMatch[2];
        const closingTag = organMatch[3];
        const placeholderRegex = /Normal in size|Not dilated|unremarkable|No significant/i;
        
        let finalContent;
        if(placeholderRegex.test(existingContent)){
            finalContent = newFindingText;
        } else {
            finalContent = existingContent + newFindingText;
        }

        const updatedOrganLine = `${openingTags}${finalContent}${closingTag}`;
        currentHtml = currentHtml.replace(organRegex, updatedOrganLine);
        wasFindingHandled = true;
    }

    const impressionHeaderRegex = /(<h3>IMPRESSION:<\/h3>)/i;
    const impressionMatch = currentHtml.match(impressionHeaderRegex);

    if (impressionMatch) {
        // Insert the new impression after the "IMPRESSION:" header
        currentHtml = currentHtml.replace(impressionHeaderRegex, `${impressionMatch[0]}${newImpressionHtml}`);
    } else if (wasFindingHandled) {
        // If no impression header but we did find an organ, add it at the end.
        currentHtml += `<br><h3>IMPRESSION:</h3>${newImpressionHtml}`;
    }

    if (wasFindingHandled) {
      editor.commands.setContent(currentHtml);
      setEditorContent(currentHtml); // <-- THIS LINE IS ADDED
    } else {
        // Fallback for when the organ isn't found in the current template
        const fallbackHtml = `<p><strong>${organ.toUpperCase()}:</strong> ${findings}</p><br><h3>IMPRESSION:</h3>${newImpressionHtml}`;
        editor.chain().focus().insertContent(fallbackHtml).run();
        // `insertContent` triggers onUpdate, which will sync state via handleEditorUpdate
    }
  };

 const handleFixInconsistency = () => {
    if (!editor || !correctionSuggestion) return;
    isProgrammaticUpdate.current = true;

    let currentHtml = editor.getHTML();
    const newImpressionHtml = `<p>- ${correctionSuggestion}</p>`;

    // Regex to find the impression header, works for <h3> or <p><strong>
    const impressionHeaderRegex = /(<h3>IMPRESSION:<\/h3>|<p><strong>IMPRESSION:<\/strong>)/i;
    const impressionMatch = currentHtml.match(impressionHeaderRegex);

    if (impressionMatch) {
        // Insert the new impression text immediately after the header
        currentHtml = currentHtml.replace(impressionHeaderRegex, `${impressionMatch[0]}${newImpressionHtml}`);
    } else {
        // If no impression header is found, append it to the end of the report
        currentHtml += `<br><h3>IMPRESSION:</h3>${newImpressionHtml}`;
    }
    editor.commands.setContent(currentHtml);
    setEditorContent(currentHtml); // <-- THIS LINE IS ADDED
    toast.success("Report corrected.");

    // Clear the alert and the stored suggestion
    setActiveAlert(null);
    setCorrectionSuggestion(null);
    setIsAwaitingAlertAcknowledge(false);
  };

const handleSendMessage = async (message) => {
    if (isRestricted) {
      toast.error("Please upgrade to a professional plan for conversational follow-ups.");
      return;
    }
    
    const newUserMessage = { sender: 'user', text: message };
    const updatedHistory = [...conversationHistory, newUserMessage];
    setConversationHistory(updatedHistory);
    setIsAiReplying(true);

    const reportText = editor ? editor.getText() : 'No report has been generated yet.';
    
    // Convert history to a simple string format for the prompt
    const historyString = updatedHistory.map(msg => `${msg.sender.toUpperCase()}: ${msg.text}`).join('\n');

    const prompt = `
      You are a radiology AI co-pilot in an ongoing conversation with a doctor. Continue the conversation based on the provided context.

      **Initial Clinical Context:**
      ---
      ${clinicalContext || 'None'}
      ---

      **Current Draft Report:**
      ---
      ${reportText}
      ---

      **Conversation History:**
      ---
      ${historyString}
      ---

      Based on all the above context and the user's last message, provide a concise and helpful response. If the user asks you to modify the report, you can suggest the exact text to add or change. If the user provides the clarification you asked for earlier, re-attempt the analysis and provide the full report content in your response.
    `;

    try {
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
      const model = 'gemini-2.5-flash';
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

      const result = await response.json();
      const aiResponseText = result.candidates?.[0]?.content.parts?.[0]?.text;

      if (aiResponseText) {
        const newAiMessage = { sender: 'ai', text: aiResponseText };
        setConversationHistory(prev => [...prev, newAiMessage]);
      } else {
        throw new Error("No response from AI assistant.");
      }
    } catch (err) {
      const errorMessage = { sender: 'ai', text: `Sorry, I encountered an error: ${err.message}` };
      setConversationHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsAiReplying(false);
    }
  };

  const handleCorrectReport = async () => {

    if (!assistantQuery) {
      setError("Please paste a report in the text box to correct it.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const prompt = `
      You are an expert radiologist and medical editor. Your task is to analyze the provided medical report for completeness and accuracy.

      1.  **Review the FINDINGS section** to identify all significant radiological findings.
      2.  **Compare these findings with the IMPRESSION section.**
      3.  **Identify any inconsistencies or omissions.** If a significant finding mentioned in the report body is missing from the impression, you must add it. For example, if the findings mention "mild diffuse increase in echotexture with fat fraction 11.3%," the impression should be updated to include a conclusion like "Grade I fatty liver."
      4.  **Proofread** the entire report for any grammatical or structural errors.
      5.  **Return the fully corrected and complete report** as a single, professional HTML string. Maintain the original structure.

      If the report is already accurate and complete, return it as-is without any confirmation message.

      Report to Analyze and Correct:
      ---
      ${assistantQuery}
      ---
    `;
    try {
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        const model = 'gemini-2.5-flash';
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

        const result = await response.json();
        const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

        if (textResult && editor) {
            isProgrammaticUpdate.current = true;
            editor.commands.setContent(textResult);
            setEditorContent(textResult); // <-- THIS LINE IS ADDED
            toast.success("Report correction complete!");
        } else {
            throw new Error("No response from AI assistant.");
        }
    } catch (err) {
        setError("AI correction request failed: " + err.message);
    } finally {
      
        setIsLoading(false);
    }
  };

  const handleGenerateTemplate = async () => {

    if (!assistantQuery) {
      setError("Please enter a topic to generate a template.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const prompt = `
      You are an expert radiologist. Generate a comprehensive, professionally formatted report template for the following topic.
      The template should be detailed, including all standard sections, common findings, and placeholders where necessary.
      The output MUST be a single string of properly formatted HTML.

      Topic:
      ---
      ${assistantQuery}
      ---
    `;
    try {
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        const model = 'gemini-2.5-flash';
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

        const result = await response.json();
        const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

        if (textResult && editor) {
            isProgrammaticUpdate.current = true;
            editor.commands.setContent(textResult);
            setEditorContent(textResult); // <-- THIS LINE IS ADDED
            toast.success("Template generated successfully!");
        } else {
            throw new Error("No response from AI assistant.");
        }
    } catch (err) {
        setError("AI template generation failed: " + err.message);
    } finally {
        setIsLoading(false);
    }
  };

  


const generateFinalReport = async (force = false) => {
  if (!user) return;
  if (!force) {
    const missing = findMissingMeasurements();
    console.log("Result from findMissingMeasurements:", missing); // Debug log
    if (missing.length > 0) {
      setActiveAlert({
        type: 'missing_info',
        title: 'Incomplete Report', // Add a title if AlertPanel needs it
        message: `The following appear to be missing or incomplete: ${missing.join(', ')}. Do you want to proceed?`,
      });
      return;
    }
  }

  // --- Modified AI Assistant Functions ---
  // const handleCorrectReport = async () => {
  //   if (!assistantQuery) return;
  //   setIsAiLoading(true);
  //   toast.loading('AI is correcting the report...');
  //   // Replace with your actual API call
  //   setTimeout(() => {
  //       const correctedText = `<h3>CORRECTED REPORT:</h3><p>${assistantQuery}</p>`;
  //       setEditorContent(correctedText);
  //       setIsAiLoading(false);
  //       toast.dismiss();
  //       toast.success("Report corrected!");
  //       setShowAssistantModal(false); // Close modal
  //       setAssistantQuery(''); // Clear input
  //   }, 1500);
  // };


  // --- START: MODIFIED SECTION ---
console.log("Generating report content..."); // Debug log
  if (editor) {
    // 1. Add a hook to find and remove any attribute starting with '@'
    DOMPurify.addHook('afterSanitizeAttributes', (currentNode) => {
      if (currentNode.hasAttributes()) {
        const attributes = Array.from(currentNode.attributes);
        for (const attr of attributes) {
          if (attr.name.startsWith('@')) {
            currentNode.removeAttribute(attr.name);
          }
        }
      }
    });

    // 2. Get the raw HTML from the editor
    const rawHtml = editor.getHTML();

    // 3. Sanitize it using the hook we just added
    const reportBody = DOMPurify.sanitize(rawHtml);

    // 4. Important: Remove the hook so it doesn't affect other parts of the app
    DOMPurify.removeHook('afterSanitizeAttributes');

  // --- END: MODIFIED SECTION ---

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    let newCount = userData.reportCount || 0;

    const patientHeader = `
      <div style="padding-bottom: 15px; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px; font-size: 0.9rem;">
        <h3 style="font-size: 1.1em; font-weight: bold; margin-bottom: 10px; color: #1a202c;">Patient Information</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
          <tbody>
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc; width: 25%;">Patient Name</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; width: 25%;">${patientName}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc; width: 25%;">Patient ID</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; width: 25%;">${patientId}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc;">Age</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${patientAge}</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc;">Exam Date</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${examDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc;">Referring Physician</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;" colspan="3">${referringPhysician}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    const fullReport = patientHeader + reportBody;
    setGeneratedReport(fullReport);
    setShowPreviewModal(true);
    toastDone('Report generated');

    if (userRole === 'basic') {
        await updateDoc(userDocRef, {
            reportCount: newCount + 1,
            lastReportDate: serverTimestamp(),
        });
    }

    try {
        await addDoc(collection(db, "users", user.uid, "reports"), {
            userId: user.uid,
            reportHTML: fullReport,
            patientName: patientName,
            examDate: examDate,
            createdAt: serverTimestamp()
        });
        toast.success('Report saved to cloud!');
    } catch (e) {
        console.error("Error adding document: ", e);
        toast.error('Could not save report.');
    }
    return fullReport;
  }
  return '';
};
  
  const copyToClipboard = (text, successMessage = 'Copied!') => {
      const plainText = htmlToText(text, {
          wordwrap: 130
      });

      const textArea = document.createElement('textarea');
      textArea.value = plainText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
          document.execCommand('copy');
          toast.success(successMessage);
      }
      catch (err) {
          toast.error('Failed to copy');
      }
      document.body.removeChild(textArea);
  };

  const downloadTxtReport = (reportContent) => {
    if (!reportContent) {
        // Updated error message for clarity
        toast.error("Please generate the report first before downloading.");
        return;
    }
    const plainText = htmlToText(reportContent, {
        wordwrap: 130
    });

    const element = document.createElement("a");
    const file = new Blob([plainText], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `Radiology_Report_${patientName.replace(/ /g, '_')}_${examDate}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toastDone('TXT downloaded');
  };

  const downloadPdfReport = (reportContent) => {
    if (!reportContent) {
        setError("Report content is empty. Please generate the report first.");
        return;
    }
    setError(null);
    try {
        const doc = new jsPDF();
        
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '170mm';
        tempDiv.style.fontFamily = 'helvetica';
        tempDiv.style.fontSize = '12px';
        tempDiv.innerHTML = reportContent;
        document.body.appendChild(tempDiv);

        doc.html(tempDiv, {
            callback: function (doc) {
                document.body.removeChild(tempDiv);
                doc.save(`Radiology_Report_${patientName.replace(/ /g, '_')}_${examDate}.pdf`);
                toastDone('PDF downloaded');
            },
            x: 15,
            y: 15,
            width: 170,
            windowWidth: tempDiv.scrollWidth
        });
    } catch (err) {
        setError(`An unexpected error occurred during PDF generation: ${err.message}`);
        console.error(err);
    }
  };

  const downloadWordReport = async (reportContent, patientName = 'Report') => {
  try {
    // 1. Use the browser's DOM parser to turn the HTML string into a traversable document
    const parser = new DOMParser();
    const docHtml = parser.parseFromString(reportContent, 'text/html');
    
    const docxChildren = [];

    // --- NEW LOGIC: Manually Build the Patient Info Table for correct formatting ---
    const allTds = docHtml.querySelectorAll('td');
    if (allTds.length >= 8) {
      const patientInfoTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Patient Name", bold: true })] })] }),
              new TableCell({ children: [new Paragraph(allTds[1]?.textContent || '')] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Patient ID", bold: true })] })] }),
              new TableCell({ children: [new Paragraph(allTds[3]?.textContent || '')] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Age", bold: true })] })] }),
              new TableCell({ children: [new Paragraph(allTds[5]?.textContent || '')] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Exam Date", bold: true })] })] }),
              new TableCell({ children: [new Paragraph(allTds[7]?.textContent || '')] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Referring Physician", bold: true })] })] }),
              new TableCell({
                children: [new Paragraph(allTds[9]?.textContent || '')],
                columnSpan: 3, // This cell spans across 3 columns
              }),
            ],
          }),
        ],
      });
      docxChildren.push(patientInfoTable);
      docxChildren.push(new Paragraph("")); // Add a space after the table
    }

    // --- Process the rest of the report (Impression, Findings, etc.) ---
    const mainNodes = docHtml.body.children;
    for (const node of mainNodes) {
      // Skip the div that we already processed
      if (node.nodeName.toUpperCase() === 'DIV') continue;

      switch (node.nodeName.toUpperCase()) {
        case 'H3':
          docxChildren.push(new Paragraph({ text: node.textContent, heading: HeadingLevel.HEADING_3, style: "Heading3" }));
          break;
        case 'P':
          const paragraphRuns = [];
          for (const childNode of node.childNodes) {
            if (childNode.nodeName.toUpperCase() === 'STRONG') {
              paragraphRuns.push(new TextRun({ text: childNode.textContent, bold: true }));
            } else {
              paragraphRuns.push(new TextRun(childNode.textContent));
            }
          }
          docxChildren.push(new Paragraph({ children: paragraphRuns }));
          break;
      }
    }

    // Create a new document with the children we built
    const doc = new Document({
      sections: [{
        children: docxChildren,
      }],
      styles: {
        paragraphStyles: [
            {
                id: "Heading3",
                name: "Heading 3",
                basedOn: "Normal",
                next: "Normal",
                run: {
                    bold: true,
                    size: 24, // Corresponds to 12pt font
                },
                paragraph: {
                    spacing: { after: 120 },
                },
            },
        ],
      },
    });

    // Use the Packer to generate a Blob
    const blob = await Packer.toBlob(doc);

    // Use FileSaver to trigger the download
    saveAs(blob, `Radiology_Report_${patientName.replace(/ /g, '_')}.docx`);

  } catch (error) {
    console.error("Error generating Word document:", error);
  }
};

  // --- NEW FUNCTION: handleInsertMeasurement ---
  const handleInsertMeasurement = (finding, value) => {
      if (!editor) return;
      let currentHtml = editor.getHTML();
      
      // Escape special regex characters from the finding string
      const findingCleaned = finding.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      
      // Create a regex that finds the finding's bolded header and the first placeholder after it.
      // It handles variations in whitespace and is case-insensitive.
      // It looks for placeholders like "__ x __ cm", "__ cm", "__ mm", etc.
      const findingRegex = new RegExp(
          `(<strong>${findingCleaned.replace(/\s+/g, '\\s*')}:?</strong>.*?)(__\\s*x\\s*__\\s*cm|__\\s*cm|__\\s*mm|__\\s*x\\s*__\\s*x\\s*__\\s*cm|__\\s*ml)`,
          "i"
      );
      
      const match = currentHtml.match(findingRegex);

      if (match) {
          isProgrammaticUpdate.current = true;
          // Replace the placeholder part (match[2]) with the new value
          const updatedSection = match[0].replace(match[2], `<strong>${value}</strong>`);
          currentHtml = currentHtml.replace(match[0], updatedSection);
          editor.commands.setContent(currentHtml);
          setEditorContent(currentHtml); // <-- THIS LINE IS ADDED
          toast.success(`Inserted measurement for ${finding}`);
      } else {
          toast.error(`Could not automatically find a placeholder for "${finding}". Please insert manually.`);
      }
  };

//   const handleInsertMeasurement = (values, calculusData) => {
//     if (!editor) return;
    
//     // Always start from the clean, original template to prevent errors
//     const originalTemplateHtml = templates[modality]?.[template] || '';
//     let updatedHtml = originalTemplateHtml;

//     // 1. Replace standard measurement placeholders sequentially
//     dynamicMeasurements.forEach(measurementConfig => {
//         const value = values[measurementConfig.id];
//         // Only replace if there is a value, otherwise the placeholder remains
//         if (value && value.trim() !== '') {
//             updatedHtml = updatedHtml.replace('__', `<strong>${value}</strong>`);
//         }
//     });

//     // 2. Insert calculus/mass lesion findings
//     calculusData.forEach(calculus => {
//         const organName = calculus.location;
//         let findingText = ` A ${calculus.size}`;
//         if (calculus.description) {
//             findingText += ` ${calculus.description}`;
//         }
//         findingText += " is noted.";

//         const organRegex = new RegExp(`(<p><strong>${escapeRegex(organName)}:?<\/strong>)(.*?)(<\/p>)`, "i");
        
//         // Use a callback with replace to handle appending vs. replacing content
//         updatedHtml = updatedHtml.replace(organRegex, (match, openingTags, existingContent, closingTag) => {
//             const placeholderRegex = /Normal in size|Not dilated|unremarkable|No significant/i;
//             let finalContent = placeholderRegex.test(existingContent) ? findingText : existingContent + findingText;
//             return `${openingTags}${finalContent}${closingTag}`;
//         });
//     });

//     // Use the programmatic update flag to prevent the editor's onUpdate from re-triggering this logic
//     isProgrammaticUpdate.current = true;
//     editor.commands.setContent(updatedHtml);
// };

  

  // --- Firestore Macro Handlers ---
  const handleAddMacro = async () => {
    if (!newMacroCommand || !newMacroText) {
      toast.error("Please provide both a command and text for the macro.");
      return;
    }
    if (!user) {
      toast.error("You must be logged in to add a macro.");
      return;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "macros"), {
        command: newMacroCommand,
        text: newMacroText,
        createdAt: serverTimestamp()
      });
      setNewMacroCommand('');
      setNewMacroText('');
      toast.success("Macro added successfully!");
    } catch (error) {
      console.error("Error adding macro: ", error);
      toast.error("Failed to add macro.");
    }
  };

  const handleDeleteMacro = async (macroId) => {
    if (!user) {
      toast.error("You must be logged in to delete a macro.");
      return;
    }
    try {
      await deleteDoc(doc(db, "users", user.uid, "macros", macroId));
      toast.success("Macro deleted.");
    } catch (error) {
      console.error("Error deleting macro: ", error);
      toast.error("Failed to delete macro.");
    }
  };

  // In App.jsx

  // +++++++++++++++++ PASTE BLOCK 1 HERE +++++++++++++++++++
  const executeFunctionCall = useCallback(async (functionCall) => {
    const { name, args } = functionCall;

    console.log(`Executing function: ${name}`, args);
    toast(<>Executing: <b>{name}</b></>, { icon: '🤖' });

    switch (name) {
      case "askCopilot":
        // 1. Send the question to the chat.
        handleSendMessage(args.question);
        // 2. Switch to the Co-pilot tab so the user sees the answer.
        setActiveAiTab('copilot');
        break;

      case "analyzeImages":
        if (images.length > 0) {
          analyzeImages();
        } else {
          toast.error("Please upload images first.");
        }
        break;
case "handleLocalSearch": // <--- NEW CASE
        // This will trigger your local findings search
        await handleLocalSearch(args.query); 
        // Also ensure the "Search" tab is active if it's not already
        setActiveAiTab('search');
        break;

      case "handleAiFindingsSearch": // <--- NEW CASE
        // This will trigger your AI findings search
        await handleAiFindingsSearch(args.query);
        // Also ensure the "AI Findings" tab (or main search tab) is active
        setActiveAiTab('search'); // Assuming AI findings is part of the 'search' tab
        break;

      case "handleAiKnowledgeSearch":
        await handleAiKnowledgeSearch(true, args.query);
        setActiveAiTab('knowledge')
        break;

      case "insertMacro":
        const macroPhrase = args.macroName.toLowerCase().trim().replace(/[.,?]/g, '');
        const macro = macrosRef.current.find(m => m.command.toLowerCase().trim().replace(/[.,?]/g, '') === macroPhrase);
        
        if (macro) {
          isProgrammaticUpdate.current = true;
          editor.chain().focus().insertContent(macro.text).run();
          toast.success(`Inserted macro: ${macro.command}`);
        } else {
          toast.error(`Macro "${args.macroName}" not found.`);
        }
        break;

      case "generateFinalReport":
        await generateFinalReport();
        break;

      case "deleteLastSentence":
        const content = editor.state.doc.textContent;
        const sentences = content.trim().split(/(?<=[.?!])\s+/);
        if (sentences.length > 0) {
          const lastSentence = sentences[sentences.length - 1];
          const startOfLastSentence = content.lastIndexOf(lastSentence);
          if (startOfLastSentence !== -1) {
            const endOfLastSentence = startOfLastSentence + lastSentence.length;
            isProgrammaticUpdate.current = true;
            editor.chain().focus().deleteRange({ from: startOfLastSentence, to: endOfLastSentence }).run();
          }
        }
        break;

      default:
        console.warn(`Unknown function call: ${name}`);
    }
  }, [editor, images, macrosRef, analyzeImages, handleAiKnowledgeSearch, generateFinalReport, handleLocalSearch, handleAiFindingsSearch, setActiveAiTab]);

  const insertPlainText = useCallback((text) => {
    if (editor) { // Added a check for editor
      isProgrammaticUpdate.current = true;
      editor.chain().focus().insertContent(text + ' ').run();
    }
  }, [editor]);
// +++++++++++++++++ END OF BLOCK 1 ++++++++++++++++++++++


// +++++++++++++++++ PASTE BLOCK 2 HERE +++++++++++++++++++
  const { 
    voiceStatus, 
    interimTranscript, 
    error: voiceError, // Renamed to avoid conflicts
    isDictationSupported, 
    handleToggleListening 
  } = useVoiceAssistant({
    geminiTools,
    onFunctionCall: executeFunctionCall,
    onPlainText: insertPlainText
  });

  // Handle voice-specific errors (optional)
  useEffect(() => {
    if (voiceError) {
      setError(voiceError); // Or use toast.error(voiceError)
    }
  }, [voiceError]);
// +++++++++++++++++ END OF BLOCK 2 ++++++++++++++++++++++

const shortcuts = {
    toggleMic: { label: 'Toggle Microphone', ctrlOrCmd: true, key: 'm', action: handleToggleListening },
    // ... other shortcuts that work ...

    generateReport: {
        label: 'Generate Final Report',
        ctrlOrCmd: true,
        key: 'g',
        action: generateFinalReport,
        // condition: () => editorContent, // <-- REMOVE THIS
        isUniversal: true
    },
    analyzeImages: {
        label: 'Analyze Images',
        ctrlOrCmd: true,
        key: 'i',
        action: analyzeImages,
        // condition: () => images.length > 0, // <-- REMOVE THIS
        isUniversal: true
    },
    suggestDifferentials: {
        label: 'Suggest Differentials',
        alt: true,
        key: 'd',
        action: () => handleGetSuggestions('differentials'),
        // condition: () => editorContent, // <-- REMOVE THIS
        isUniversal: true
    },
    generateRecommendations: {
        label: 'Generate Recommendations',
        alt: true,
        key: 'r',
        action: () => handleGetSuggestions('recommendations'),
        // condition: () => editorContent, // <-- REMOVE THIS
        isUniversal: true
    },
    // ... other shortcuts ...
   focusSearch: { label: 'Focus Local Search', ctrlOrCmd: true, key: 'f', action: () => localSearchInputRef.current?.focus() }, // Has key: 'f' - OK
    focusEditor: { label: 'Focus Editor', key: 'Escape', action: () => editor?.commands.focus(), isUniversal: true }, // Has key: 'Escape' - OK
openMacros: { label: 'Open Voice Macros', alt: true, key: 'm', action: () => setShowMacroModal(true), isUniversal: true }, // Has key: 'm' - OK (Note: duplicate Alt+M with Toggle Mic Ctrl+M is okay, different modifiers)
toggleProactive: { label: 'Toggle Proactive Co-pilot', alt: true, key: 'p', action: () => setIsProactiveHelpEnabled(prev => !prev) }, // Has key: 'p' - OK
showHelp: { label: 'Show Shortcuts Help', ctrlOrCmd: true, key: '/', action: () => setShowShortcutsModal(true) }, // Has key: '/' - OK
};

 // In App.jsx

useEffect(() => {
    const handleKeyDown = (event) => {
        const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const activeElement = document.activeElement;
        const isTyping = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;

        // Use Object.entries to get the action name easily
        for (const [actionName, config] of Object.entries(shortcuts)) {
            const isCtrlOrCmd = (isMac && event.metaKey) || (!isMac && event.ctrlKey);
            let keyMatch = event.key.toLowerCase() === config.key.toLowerCase();
            if (config.key === '/') keyMatch = event.key === '/';
            let modifierMatch = (config.ctrlOrCmd && isCtrlOrCmd) || (config.alt && event.altKey) || (!config.ctrlOrCmd && !config.alt && !event.altKey && !isCtrlOrCmd && !event.metaKey); // Added !event.metaKey for non-Cmd case

            if (keyMatch && modifierMatch) {
                if (config.isUniversal || !isTyping) {
                    event.preventDefault();

                    // --- EVALUATE CONDITIONS HERE ---
                    let conditionMet = true; // Default to true

                    if (actionName === 'generateReport' || actionName === 'suggestDifferentials' || actionName === 'generateRecommendations') {
                        // Check if editorContent state has meaningful content
                        conditionMet = !!editorContent?.trim();
                    } else if (actionName === 'analyzeImages') {
                        // Check if the images array has items
                        conditionMet = images.length > 0;
                    }
                    // Add checks for other actions if they had conditions

                    // --- EXECUTE OR SHOW ERROR ---
                    if (conditionMet) {
                        config.action(); // Call the action if condition is met
                    } else {
                        // Log details for debugging
                        console.warn(`Shortcut Condition Failed for '${actionName}': editorContent empty=${!editorContent?.trim()}, images empty=${images.length === 0}`);
                        toast.error('Cannot perform action. Conditions not met.', { duration: 2000 });
                    }

                    return; // Stop after first match
                }
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);

// ADD editorContent and images to the dependency array
}, [
    editor, // Keep editor if needed for focusEditor
    editorContent, // Add editorContent state
    images, // Add images state
    isProactiveHelpEnabled,
    handleToggleListening, // Keep functions defined with useCallback
    generateFinalReport,
    analyzeImages,
    handleGetSuggestions
    // Add other dependencies like setShowMacroModal, etc. if needed
]); // End of useEffect



  // --- CONDITIONAL RENDERING ---
  if (isAuthLoading) {
      return <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">Loading...</div>;
  }

  if (!user) {
      return <Auth />;
  }
// --- NEW HELPER FUNCTION for DICOM Conversion ---
  const convertDicomToPngBase64 = async (dicomFile) => {
    const cornerstone = window.cornerstone;
    const csWADOImageLoader = window.cornerstoneWADOImageLoader;

    if (!cornerstone || !csWADOImageLoader) {
      throw new Error("Cornerstone libraries are not loaded yet.");
    }

    // Create an off-screen div and canvas to render the image
    const container = document.createElement('div');
    container.style.width = '512px';
    container.style.height = '512px';
    container.style.position = 'absolute';
    container.style.left = '-9999px'; // Hide it off-screen
    document.body.appendChild(container);

    try {
      cornerstone.enable(container);
      const imageId = csWADOImageLoader.wadouri.fileManager.add(dicomFile);
      const image = await cornerstone.loadImage(imageId);
      cornerstone.displayImage(container, image);
      
      const canvas = container.querySelector('canvas');
      if (!canvas) {
        throw new Error("Canvas element not found after rendering.");
      }
      
      // Get the data URL (which is base64 encoded) and extract the data part
      const dataUrl = canvas.toDataURL('image/png');
      return dataUrl.split(',')[1];

    } finally {
      // Clean up the off-screen element
      cornerstone.disable(container);
      document.body.removeChild(container);
    }
  };

  // --- The new render method ---
  return (
<div className="bg-slate-900 text-gray-300 font-sans flex flex-col h-screen overflow-hidden">
      <style>{`
    .tiptap {
        flex-grow: 1;
        padding: 0.75rem;
        overflow-y: auto;
    }
    .tiptap:focus { 
        outline: none; 
    }
    .tiptap p.is-editor-empty:first-child::before {
      color: #6b7280; /* text-gray-500 */
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }
    .tiptap h3, .tiptap strong { 
        color: #e5e7eb; /* text-gray-200 */
    }

    /* --- ADD THESE STYLES BACK --- */
    .tiptap ul, .tiptap ol {
        padding-left: 1.75rem; /* Indents the list */
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }
    .tiptap ul {
        list-style-type: disc; /* Makes bullet points visible */
    }
    .tiptap ol {
        list-style-type: decimal; /* Makes numbers visible */
    }
    .tiptap li p {
        margin: 0; /* Fixes extra space between list items */
    }
    
`}</style>

      {/* ============== HEADER ============== */}
{/* // In App.jsx, replace the <header> block */}

<header className="flex-shrink-0 bg-slate-950/70 backdrop-blur-sm border-b border-slate-700/50 p-2 flex items-center justify-between z-20 h-14">
    {/* Left Side: Hamburger & Logo */}
    <div className="flex items-center space-x-2">
        {/* Hamburger remains for toggling sidebar on mobile if needed, or remove if sidebar is always hidden */}
        {/* <button onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} className="p-2 rounded-md hover:bg-slate-700 lg:hidden"><Menu size={20} /></button> */}
        
        {/* <BrainCircuit className="text-blue-500 h-6 w-6" /> */}
        {/* <LogoIcon className="text-blue-500 h-6 w-6" /> */}
        <img 
          src={appLogo} 
          alt="aiRAD Logo" 
          className="h-12 w-12" // Use the same size as the icon
        />
        <h1 className="text-lg font-bold text-white hidden sm:block">aiRAD</h1>
    </div>

    {/* Right Side: Icons & Buttons */}
    <div className="flex items-center space-x-2 sm:space-x-3"> {/* Adjusted spacing */}
        {/* Proactive Toggle (remains) */}
        <div className="flex items-center"> {/* Removed border/padding */}
            <label htmlFor="proactive-toggle" className="flex items-center cursor-pointer" title="Toggle Proactive AI Suggestions">
                <div className="relative">
                    <input
                        type="checkbox"
                        id="proactive-toggle"
                        className="sr-only"
                        checked={isProactiveHelpEnabled}
                        onChange={() => setIsProactiveHelpEnabled(!isProactiveHelpEnabled)}
                    />
                    <div className={`block ${isProactiveHelpEnabled ? 'bg-blue-600' : 'bg-slate-600'} w-9 h-5 rounded-full transition`}></div> {/* Slightly smaller toggle */}
                    <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isProactiveHelpEnabled ? 'translate-x-4' : ''}`}></div>
                </div>
                <Lightbulb size={18} className={`ml-1.5 ${isProactiveHelpEnabled ? 'text-yellow-400' : 'text-gray-500'}`} />
            </label>
        </div>

        {/* Mic Button (remains) */}
        <button
          onClick={handleToggleListening}
          disabled={!isDictationSupported}
          title={isDictationSupported ? "Toggle Voice Dictation" : "Dictation not supported"}
           className={`p-1.5 rounded-md transition-colors ...
              ${voiceStatus === 'listening' ? 'bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}
              ${voiceStatus === 'processing' ? 'bg-yellow-500 animate-spin' : ''}
          `}
        >
          {/* Show different icon based on state */}
          {voiceStatus === 'listening' && <Mic size={28} />}
          {voiceStatus === 'processing' && <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
          {voiceStatus === 'idle' && <Mic size={28} />}
        </button>
        
        {/* Show interim transcript or processing status */}
        {(voiceStatus === 'listening' || voiceStatus === 'processing') && (
            <div className="mt-2 text-center text-xs bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg max-w-xs">
                <p className="font-bold">
                  {voiceStatus === 'listening' ? 'Listening...' : 'Processing...'}
                </p>
                {interimTranscript && <p className="mt-1 italic">{interimTranscript}</p>}
            </div>
        )}

        {/* AI Assistant Button (remains) */}
        <button onClick={() => setShowAssistantModal(true)} title="AI Assistant" className="p-1.5 rounded-md hover:bg-slate-700 text-gray-400 hover:text-white">
            <Wand2 size={18} /> {/* Slightly smaller icon */}
        </button>

         {/* Data Summary Button (remains) */}
        <button onClick={() => setShowDataModal(true)} title="Show Extracted Data" className="p-1.5 rounded-md hover:bg-slate-700 text-gray-400 hover:text-white">
             <ListPlus size={18} /> {/* Slightly smaller icon */}
        </button>


        {/* --- HIDDEN ON MOBILE --- */}
        {/* Manage Templates Button - Hidden on small screens */}
       

        {/* Shortcuts Button - Hidden on small screens */}
        <button onClick={() => setShowShortcutsModal(true)} title="Shortcuts" className="p-1.5 rounded-md hover:bg-slate-700 text-gray-400 hover:text-white hidden sm:flex"> {/* Added hidden sm:flex */}
            <Zap size={18} />
        </button>
        {/* --- END HIDDEN ON MOBILE --- */}


        {/* Separator - Hidden on small screens */}
        <div className="h-6 w-px bg-slate-700 hidden sm:block" />

        {/* Macros Button (remains) */}
        <button onClick={() => setShowMacroModal(true)} title="Voice Macros" className="p-1.5 rounded-md hover:bg-slate-700 text-gray-400 hover:text-white">
            <MessageSquare size={18} /> {/* Slightly smaller icon */}
        </button>

        <button onClick={() => setShowTemplateModal(true)} title="Manage Templates" className="p-1.5 rounded-md hover:bg-slate-700 text-gray-400 hover:text-white sm:flex"> {/* Added hidden sm:flex */}
            <FileText size={18} />
        </button>
        
        {/* Sign Out Button (remains) */}
        <button onClick={handleSignOut} className="p-1.5 rounded-md hover:bg-slate-700 text-gray-400 hover:text-white" title="Sign Out">
            <LogOut size={18} /> {/* Slightly smaller icon */}
        </button>
    </div>
</header>
{isRestricted && (
            <div className="p-4 mb-4 bg-yellow-100 text-yellow-800 rounded-lg text-center">
                You've reached your free limit.
                <button
                    onClick={handleUpgrade}
                    className="font-bold underline ml-2"
                >
                    Upgrade to Professional
                </button>
                for unlimited reports and AI features.
            </div>
        )}

      {/* ============== MAIN CONTENT ============== */}
<main className="flex-grow flex flex-col lg:flex-row overflow-hidden"> {/* Use overflow-hidden */}

        {/* --- LEFT SIDEBAR: Context & Case Info --- */}
     <aside className={`bg-slate-950/50 w-full lg:w-96 flex-shrink-0 lg:overflow-y-auto lg:h-auto
                              ${mobileView === 'case' ? 'flex flex-col overflow-y-auto' : 'hidden'} lg:flex`}
                     // Apply calculated height only on mobile when this view is active
                     style={mobileView === 'case' ? { height: 'calc(100vh - 7.5rem)' } : {}} > {/* 3.5rem header + 4rem footer */}

                   {/* ADD this inner div */}
    <div className="p-4 space-y-4">

    {/* ... content of the left sidebar ... */}
            {/* <SidePanel title="Patient & Exam" icon={User}>
                <div className="grid grid-cols-2 gap-3"> */}
                    {/* Simplified inputs for the new design */}
                    {/* <label className="font-semibold text-gray-600 flex items-center mb-2"><User size={18} className="mr-2"/>Pt. Name</label>
                    <input type="text" placeholder="Patient Name" value={patientName} onChange={e => setPatientName(e.target.value)} className="col-span-2 bg-slate-700/50 border-slate-600 p-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                    <label className="font-semibold text-gray-600 flex items-center mb-2"><User size={18} className="mr-2"/>Pt. ID</label>
                    <input type="text" placeholder="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} className="bg-slate-700/50 border-slate-600 p-2 rounded-md text-sm" />
                    <label className="font-semibold text-gray-600 flex items-center mb-2"><User size={18} className="mr-2"/>Ref. Physician</label>
                    <input type="text" placeholder="Physician Name" value={referringPhysician} onChange={e => setReferringPhysician(e.target.value)} className="col-span-2 bg-slate-700/50 border-slate-600 p-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                    <label className="font-semibold text-gray-600 flex items-center mb-2"><Calendar size={18} className="mr-2"/>Pt. Age</label>
                    <input type="number" placeholder="Age" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="bg-slate-700/50 border-slate-600 p-2 rounded-md text-sm" />
                     <label className="font-semibold text-gray-600 flex items-center mb-2"><Calendar size={18} className="mr-2"/>Exam Date</label>
                    <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="col-span-2 bg-slate-700/50 border-slate-600 p-2 rounded-md text-sm" />
                </div>
            </SidePanel> */}
            {/* // In App.jsx, find the left sidebar <aside> and replace the SidePanel with this: */}

<SidePanel title="Patient & Exam" icon={User}>
    <div className="space-y-3">
        <div>
            <label htmlFor="patientName" className="text-xs font-medium text-gray-400 mb-1 block">Patient Name</label>
            <input 
                id="patientName" 
                type="text" 
                placeholder="Patient Name" 
                value={patientName} 
                onChange={e => setPatientName(e.target.value)} 
                className="w-full bg-slate-700/50 border border-slate-600 p-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500" 
            />
        </div>
        <div>
            <label htmlFor="patientId" className="text-xs font-medium text-gray-400 mb-1 block">Patient ID</label>
            <input 
                id="patientId" 
                type="text" 
                placeholder="Patient ID" 
                value={patientId} 
                onChange={e => setPatientId(e.target.value)} 
                className="w-full bg-slate-700/50 border border-slate-600 p-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500" 
            />
        </div>
        <div className="grid grid-cols-2 gap-3"> {/* Use grid for side-by-side */}
            <div>
                <label htmlFor="patientAge" className="text-xs font-medium text-gray-400 mb-1 block">Age</label>
                <input 
                    id="patientAge" 
                    type="number" 
                    placeholder="Age" 
                    value={patientAge} 
                    onChange={e => setPatientAge(e.target.value)} 
                    className="w-full bg-slate-700/50 border border-slate-600 p-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500" 
                />
            </div>
            <div>
                <label htmlFor="examDate" className="text-xs font-medium text-gray-400 mb-1 block">Exam Date</label>
                <input 
                    id="examDate" 
                    type="date" 
                    value={examDate} 
                    onChange={e => setExamDate(e.target.value)} 
                    className="w-full bg-slate-700/50 border border-slate-600 p-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500" 
                />
            </div>
        </div>
        {/* ======================================================= */}
        {/* ============ REFERRING PHYSICIAN FIELD ADDED ============ */}
        {/* ======================================================= */}
        <div>
            <label htmlFor="referringPhysician" className="text-xs font-medium text-gray-400 mb-1 block">Referring Physician</label>
            <input 
                id="referringPhysician" 
                type="text" 
                placeholder="Referring Physician" 
                value={referringPhysician} 
                onChange={e => setReferringPhysician(e.target.value)} 
                className="w-full bg-slate-700/50 border border-slate-600 p-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500" 
            />
        </div>
    </div>
</SidePanel>
            {/* =================================================================== */}
    {/* ========= ADD THIS NEW SIDEPANEL FOR TEMPLATE SELECTION ========= */}
    {/* =================================================================== */}
    <SidePanel title="Report Template" icon={FileText}>
        <div className="space-y-3">
            <div>
                <label className="text-xs font-medium text-white mb-1 block">Modality</label>
                <select value={modality} onChange={e => {
                            const newModality = e.target.value;
                            const newTemplate = Object.keys(allTemplates[newModality])[0];
                            const newContent = allTemplates[newModality][newTemplate] || '';
                            setModality(newModality);
                            setTemplate(newTemplate);
                            // Directly update editor AND state
                            isProgrammaticUpdate.current = true;
                            if (editor) editor.commands.setContent(newContent);
                            setEditorContent(newContent);
                        }}  className="w-full bg-slate-700/50 border-slate-600 p-2 rounded-md text-sm-white focus:ring-1 focus:ring-blue-500"
                >
                            {Object.keys(allTemplates).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                
            </div>
            <div>
                <label className="text-sm font-medium text-white mb-1 block">Template</label>
                <select value={template} onChange={e => {
                            const newTemplate = e.target.value;
                            const newContent = allTemplates[modality][newTemplate] || '';
                            setTemplate(newTemplate);
                            // Directly update editor AND state
                            isProgrammaticUpdate.current = true;
                            if (editor) editor.commands.setContent(newContent);
                            setEditorContent(newContent);
                        }}  className="w-full bg-slate-700/50 border-slate-600 p-2 rounded-md text-sm-white focus:ring-1 focus:ring-blue-500 disabled:opacity-50">
                            {modality && Object.keys(allTemplates[modality] || {}).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
            </div>
        </div>
    </SidePanel>

    {/* =================================================================== */}
    {/* ============ ADD THE MEASUREMENTS PANEL CONDITIONALLY ============= */}
    {/* =================================================================== */}
    {modality === 'Ultrasound' && (
        <MeasurementsPanel
            measurements={dynamicMeasurements}
            organs={templateOrgans}
            onInsert={handleInsertMeasurements}
           CollapsibleSidePanel={CollapsibleSidePanel} // <-- Pass the component as a prop here
           
        />
    )}
            
            <SidePanel title="AI Image Analysis" icon={Upload}>
                <div {...getRootProps()} className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-900/20' : 'border-slate-600'}`}>
                    <input {...getInputProps()} />
                    <p className="text-gray-400 text-sm">{isDragActive ? 'Drop files here...' : 'Drag, drop, or click'}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {images.map((img, index) => (
                        <div key={index} className="relative group flex-shrink-0 cursor-pointer" onClick={() =>openModal(index)}>
                            <img src={img.src} alt={`Scan ${index+1}`} className={`w-full h-16 object-cover rounded-md shadow-md transition-all border-2 ${selectedImage === img ? 'border-blue-500' : 'border-transparent'}`} />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={(e) => { e.stopPropagation(); removeImage(index); }} className="text-white hover:text-red-400 p-1"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
                 {/* ======================================================= */}
    {/* ========= ADD CLINICAL CONTEXT PANEL HERE =========== */}
    {/* ======================================================= */}
    <SidePanel title="Clinical Context" icon={Clipboard}>
        <textarea
            id="clinical-context"
            value={clinicalContext}
            onChange={e => setClinicalContext(e.target.value)}
            rows="3" // Adjust rows as needed
            className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., Patient presents with right upper quadrant pain..."
        />
    </SidePanel>
    
                <button onClick={analyzeImages} disabled={isAiLoading || images.length === 0 || isRestricted } className="w-full mt-2 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition flex items-center justify-center disabled:bg-indigo-800 text-sm">
                    {isAiLoading ? "Analyzing..." : <><BrainCircuit size={16} className="mr-2"/>Analyze Images</>}
                </button>
                
            </SidePanel>



       {/* Image Modal for DICOM & Raster navigation */}
       <ImageModal
         images={images}
         currentIndex={modalIndex}
         onClose={closeModal}
         onNext={showNext}
         onPrev={showPrev}
       />
            <RecentReportsPanel onSelectReport={handleSelectRecentReport} user={user} />
            </div>
        </aside>


            
        {/* --- CENTER PANEL: Workspace (Viewer & Editor) --- */}
       

          
        {/* <div className={`flex-grow flex-col p-2 lg:p-4 overflow-hidden ${mobileView === 'workspace' ? 'flex' : 'hidden'} lg:flex`}>
            <div className="flex-shrink-0 mb-4 relative">
                {selectedImage ? (
                    <ImageViewer image={selectedImage} className="h-[40vh]" />
                ) : (
                    <div className="h-[40vh] border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center text-slate-500">
                        <p>Select an image to view</p>
                    </div>
                )}
                 <button onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} className="absolute top-2 left-2 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full transition-colors">
                    <PanelLeftClose size={18} />
                 </button>
                 <button onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} className="absolute top-2 right-2 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full transition-colors">
                    <PanelRightClose size={18} />
                 </button>
            </div>
            
            <div className="flex-grow flex flex-col bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
                 <AlertPanel
                    alertData={activeAlert}
                    onAcknowledge={() => { setActiveAlert(null); setIsAwaitingAlertAcknowledge(false); }}
                    onInsertMacro={() => { /* ... unchanged */ }
                    {/* onPrepareNotification={() => { /* ... unchanged */ }
                    {/* onFix={handleFixInconsistency} */}
                    {/* onProceed={() => { /* ... unchanged */ }
                {/* />
                <MenuBar editor={editor} />
                <EditorContent editor={editor} /> */}
            {/* </div>
        </div> */} 
    <div className={`flex flex-col p-2 lg:p-4 overflow-hidden lg:flex-grow
                           ${mobileView === 'workspace' ? 'flex flex-grow' : 'hidden'} lg:flex`}
                  // Apply calculated height only on mobile when this view is active
                  style={mobileView === 'workspace' ? { height: 'calc(100vh - 7.5rem)' } : {}} >
            {/* FIX #5: The main image viewer is removed from here. The editor is now the primary focus. */}
<div className="flex-grow flex flex-col bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
            {/* ======================================================= */}
        {/* ============ ALERT PANEL ADDED HERE ================== */}
        {/* ======================================================= */}
        <AlertPanel
            alertData={activeAlert}
            onAcknowledge={() => {
                setActiveAlert(null);
                setIsAwaitingAlertAcknowledge(false); // Reset the lock
            }}
            onInsertMacro={() => {
                if (editor && activeAlert?.type === 'critical' && activeAlert.data?.reportMacro) {
                    isProgrammaticUpdate.current = true;
                    editor.chain().focus().insertContent(`<p><strong>${activeAlert.data.reportMacro}</strong></p>`).run();
                    setEditorContent(editor.getHTML()); // Sync state
                    toast.success("Critical finding macro inserted.");
                }
                setActiveAlert(null);
                setIsAwaitingAlertAcknowledge(false);
            }}
            onPrepareNotification={() => {
                if (activeAlert?.type === 'critical' && activeAlert.data?.notificationTemplate) {
                    copyToClipboard(activeAlert.data.notificationTemplate, "Notification text copied!");
                }
                setActiveAlert(null);
                setIsAwaitingAlertAcknowledge(false);
            }}
            onFix={handleFixInconsistency}
            onProceed={() => {
                setActiveAlert(null);
                setIsAwaitingAlertAcknowledge(false); // Reset lock
                generateFinalReport(true); // Re-run the function, forcing it
            }}
            // --- THIS IS THE PROP THAT WAS MISSING ---
            onInsertGuideline={() => {
                if (editor && activeAlert?.type === 'guideline' && activeAlert.data?.recommendationText) {
                    isProgrammaticUpdate.current = true;
                    // Insert the recommendation text, e.g., in a new paragraph
                    editor.chain().focus().insertContent(`<p><strong>RECOMMENDATION:</strong> ${activeAlert.data.recommendationText}</p>`).run();
                    setEditorContent(editor.getHTML()); // Sync state
                    toast.success("Guideline recommendation inserted.");
                }
                setActiveAlert(null);
                setIsAwaitingAlertAcknowledge(false);
            }}
            // --- END OF FIX ---
        />
               <MenuBar 
  editor={editor}
  voiceStatus={voiceStatus}
  isDictationSupported={isDictationSupported}
  handleToggleListening={handleToggleListening}
  interimTranscript={interimTranscript}
/>
                {/* ======================================================= */}
        {/* ======== ADD SUGGESTION BUTTONS HERE ================ */}
        {/* ======================================================= */}
<div className="flex-shrink-0 p-2 border-b border-slate-700 flex items-center justify-end space-x-2">
            <button 
                onClick={() => handleGetSuggestions('differentials')} 
                disabled={isSuggestionLoading || !editorContent} 
                className="px-3 py-1 bg-slate-600 text-xs text-gray-200 font-semibold rounded-md hover:bg-slate-500 transition flex items-center disabled:opacity-50"
            >
                <Lightbulb size={14} className="mr-1.5"/> Suggest Differentials
            </button>
            <button 
                onClick={() => handleGetSuggestions('recommendations')} 
                disabled={isSuggestionLoading || !editorContent} 
                className="px-3 py-1 bg-slate-600 text-xs text-gray-200 font-semibold rounded-md hover:bg-slate-500 transition flex items-center disabled:opacity-50"
            >
                <ListPlus size={14} className="mr-1.5"/> Generate Recommendations
            </button>
        </div>
<EditorContent editor={editor} className="flex-grow overflow-y-auto" /> {/* Editor scrolls itself */}
            </div>
            <div className="flex-shrink-0 pt-2">
                 <button onClick={generateFinalReport} disabled={isLoading || !editorContent} className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition flex items-center justify-center disabled:bg-blue-800 text-base">
                    <Eye size={18} className="mr-2"/> Generate Report Preview
                </button>
            </div>
        </div>

        {/* --- RIGHT SIDEBAR: AI Co-pilot & Tools --- */}
        {/* <aside className={`flex-shrink-0 bg-slate-950/50 flex flex-col p-4 space-y-4 overflow-y-auto transition-all duration-300 ${isRightSidebarOpen ? 'w-96' : 'w-0 p-0'}`}> */}
       {/* ======================================================= */}
{/* ========= COMPLETE RIGHT SIDEBAR CODE =============== */}
{/* ======================================================= */}
<aside className={`bg-slate-950/50 w-full lg:w-[450px] flex-shrink-0 lg:overflow-y-auto lg:h-auto
                              ${mobileView === 'ai' ? 'flex flex-col overflow-y-auto' : 'hidden'} lg:flex`}
                     // Apply calculated height only on mobile when this view is active
                     style={mobileView === 'ai' ? { height: 'calc(100vh - 7.5rem)' } : {}} >
<div className="p-4 space-y-4 flex flex-col flex-grow"> {/* ADDED flex flex-col flex-grow */}
    {/* --- Tab Buttons --- */}
    <div className="flex-shrink-0">
        <div className="flex items-center p-1 bg-slate-800/50 rounded-lg border border-slate-700">
            <button onClick={() => setActiveAiTab('copilot')} className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${activeAiTab === 'copilot' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'}`}>Co-pilot</button>
            <button onClick={() => setActiveAiTab('search')} className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${activeAiTab === 'search' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'}`}>Search</button>
            <button onClick={() => setActiveAiTab('knowledge')} disabled={!aiKnowledgeLookupResult} className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${activeAiTab === 'knowledge' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'} disabled:text-slate-600`}>Knowledge</button>
        </div>
    </div>

    {/* --- Tab Content Area --- */}
<div className="flex-grow flex flex-col overflow-hidden mt-4"> {/* ADDED flex-grow, mt-4 and flex-col */}
      {/* --- Co-pilot Tab --- */}
      {activeAiTab === 'copilot' && (
        <AiConversationPanel history={conversationHistory} onSendMessage={handleSendMessage} isReplying={isAiReplying} userInput={userInput} setUserInput={setUserInput} />
      )}

      {/* --- Search Tab --- */}
      {activeAiTab === 'search' && (
    // Use flex-col to structure search tab content vertically
    <div className="flex flex-col h-full space-y-4">
        {/* Search Input & Local Button */}
        <div className="flex-shrink-0 flex items-center space-x-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700">
            <input
                ref={localSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                // --- FIX 1: Pass the 'searchQuery' state ---
                onKeyDown={e => e.key === 'Enter' && handleLocalSearch(searchQuery)}
                placeholder="Search local or AI..."
                className="w-full bg-transparent p-2 rounded-md text-sm focus:outline-none placeholder-slate-500"
            />
            <button
                // --- FIX 2: Pass the 'searchQuery' state ---
                onClick={() => handleLocalSearch(searchQuery)}
                className="p-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white"
                title="Search Local Findings"
            >
                <Search size={18}/>
            </button>
        </div>

        {/* AI Search Buttons */}
        <div className="flex-shrink-0 grid grid-cols-2 gap-2">
            <button
                // --- FIX 3: Pass the 'searchQuery' state ---
                onClick={() => handleAiFindingsSearch(searchQuery)}
                // --- FIX 4: Disable based on 'searchQuery', not 'baseSearchQuery' ---
                disabled={isSearching || !searchQuery}
                className="w-full text-xs py-2 bg-slate-700 hover:bg-slate-600 rounded-md disabled:opacity-50 flex items-center justify-center space-x-1.5"
            >
                {isSearching && !aiKnowledgeLookupResult && !allAiFullReports.length ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Search size={14}/>}
                <span>AI Findings</span>
            </button>
            <button
                // --- FIX 5: Pass 'false' and the 'searchQuery' state ---
                onClick={() => handleAiKnowledgeSearch(false, searchQuery)}
                // --- FIX 6: Disable based on 'searchQuery' ---
                disabled={isSearching || !searchQuery}
                className="w-full text-xs py-2 bg-slate-700 hover:bg-slate-600 rounded-md disabled:opacity-50 flex items-center justify-center space-x-1.5"
            >
                {isSearching && aiKnowledgeLookupResult ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <BookOpen size={14}/>}
                <span>AI Knowledge</span>
            </button>
        </div>

        {/* Search Results Area (Scrollable) */}
       <div className="flex-grow overflow-y-auto min-h-[150px] space-y-4 pr-1">
            {isSearching && <SearchResultSkeleton />}

            {/* --- UPDATED LOCAL RESULTS DISPLAY --- */}
            {!isSearching && localSearchResults.length > 0 && (
                <div className="space-y-3"> {/* Increased spacing */}
                    <h3 className="text-xs font-semibold text-gray-400 uppercase">Local Findings</h3>
                    {localSearchResults.map((result, index) => (
                        <div key={`local-${index}`} className="p-3 bg-slate-800 rounded-md border border-slate-700/50 relative space-y-1.5"> {/* Added space-y */}
                              <span className="absolute top-1 right-1 bg-slate-600 text-slate-200 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{index + 1}</span>
                            <h4 className="font-semibold text-sm text-gray-100 pr-6">{result.findingName}</h4>
                            {/* Display Organ, Findings, Impression */}
                            <p className="text-xs text-gray-400"><span className="font-medium text-gray-300">Organ:</span> {result.organ}</p>
                            {!result.isFullReport && (
                                <>
                                    <p className="text-xs text-gray-300 break-words"><span className="font-medium text-gray-400 block">Findings:</span> {result.findings}</p>
                                    <p className="text-xs text-gray-300 break-words"><span className="font-medium text-gray-400 block">Impression:</span> {result.impression}</p>
                                </>
                            )}
                            {result.isFullReport && (<p className="text-xs text-gray-400 italic">Full Report Template</p>)}
                            <button
                                onClick={() => insertFindings(result)}
                                className="mt-2 text-xs bg-blue-600/30 text-blue-300 font-semibold py-1 px-2 rounded-md hover:bg-blue-600/50 transition flex items-center"
                            >
                                <Plus size={14} className="mr-1" /> Insert
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* AI Full Report Results */}
            {!isSearching && allAiFullReports.length > 0 && (
               <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase">AI Drafted Reports</h3>
                    <div className="p-3 bg-indigo-900/30 rounded-md border border-indigo-700 space-y-2">
                        {allAiFullReports[currentReportPage] && (
                            <>
                                {/* --- DIV NOW SHOWS FULL CONTENT --- */}
                                <div className="text-xs prose prose-sm prose-invert max-w-none">
                                    <div dangerouslySetInnerHTML={{__html: allAiFullReports[currentReportPage].fullReportText}}/>
                                    {/* --- GRADIENT FADE DIV REMOVED --- */}
                                </div>
                                <button
                                    onClick={() => insertFindings(allAiFullReports[currentReportPage])}
                                    className="w-full mt-1 text-xs bg-indigo-600/50 text-indigo-200 font-semibold py-1 px-2 rounded-md hover:bg-indigo-600/70 transition flex items-center justify-center"
                                >
                                    <Plus size={14} className="mr-1" /> Insert This Version
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <button onClick={handlePreviousReport} disabled={currentReportPage === 0} className="px-2 py-1 bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-50 flex items-center"><ChevronLeft size={14} className="mr-0.5"/> Prev</button>
                        <span className="text-slate-400">Ver {currentReportPage + 1} / {allAiFullReports.length}</span>
                        <button onClick={handleNextReport} disabled={isSearching} className="px-2 py-1 bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-50 flex items-center">Next <ChevronRight size={14} className="ml-0.5"/></button>
                    </div>
                </div>
            )}

            {/* AI Findings Results */}
            {!isSearching && allAiSearchResults.length > 0 && !allAiFullReports.length && (
                <div className="space-y-3"> {/* Increased spacing */}
                    <h3 className="text-xs font-semibold text-gray-400 uppercase">AI Findings</h3>
                    {allAiSearchResults[currentAiPage]?.map((result, index) => (
                       <div key={`ai-${currentAiPage}-${index}`} className="p-3 bg-purple-900/30 rounded-md border border-purple-700 relative space-y-1.5"> {/* Added space-y */}
                           <span className="absolute top-1 right-1 bg-purple-600 text-purple-100 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{localSearchResults.length + index + 1}</span>
                           <h4 className="font-semibold text-sm text-purple-100 pr-6">{result.findingName}</h4>
                           {/* Display Organ, Findings, Impression */}
                           <p className="text-xs text-purple-300"><span className="font-medium text-purple-200">Organ:</span> {result.organ}</p>
                           <p className="text-xs text-purple-200 break-words"><span className="font-medium text-purple-300 block">Findings:</span> {result.findings}</p>
                           <p className="text-xs text-purple-200 break-words"><span className="font-medium text-purple-300 block">Impression:</span> {result.impression}</p>
                            <button
                               onClick={() => insertFindings(result)}
                               className="mt-2 text-xs bg-purple-600/50 text-purple-200 font-semibold py-1 px-2 rounded-md hover:bg-purple-600/70 transition flex items-center"
                           >
                               <Plus size={14} className="mr-1" /> Insert
                           </button>
                       </div>
                    ))}
                    <div className="flex justify-between items-center text-xs mt-2">
                        <button onClick={handlePreviousPage} disabled={currentAiPage === 0} className="px-2 py-1 bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-50 flex items-center"><ChevronLeft size={14} className="mr-0.5"/> Prev</button>
                        <span className="text-slate-400">Page {currentAiPage + 1} / {allAiSearchResults.length}</span>
                        <button onClick={handleNextPage} disabled={isSearching} className="px-2 py-1 bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-50 flex items-center">More <ChevronRight size={14} className="ml-0.5"/></button>
                    </div>
                </div>
            )}

                    {/* No Results Message */}
                    {!isSearching && localSearchResults.length === 0 && allAiSearchResults.length === 0 && allAiFullReports.length === 0 && !aiKnowledgeLookupResult && baseSearchQuery && (
                        <p className="text-sm text-slate-500 italic text-center py-4">No results found for "{baseSearchQuery}".</p>
                    )}
                     {!isSearching && !baseSearchQuery && (
                         <p className="text-sm text-slate-500 italic text-center py-4">Enter a term above to search.</p>
                    )}
                </div>
            </div>
      )}

      {/* --- Knowledge Tab --- */}
      {activeAiTab === 'knowledge' && (
           // Ensure Knowledge panel takes full height and scrolls internally if needed
           <div className="flex-grow overflow-y-auto">
               <KnowledgeLookupPanel
                   result={aiKnowledgeLookupResult}
                    // Reset tab to search if knowledge panel is closed
                   onClose={() => { setAiKnowledgeLookupResult(null); setActiveAiTab('search'); }}
                   onInsert={(content) => {
                       if (editor) {
                           setEditorContent(prev => prev + content); // Append safely
                           toast('Knowledge summary inserted.');
                           setAiKnowledgeLookupResult(null);
                           setActiveAiTab('search'); // Switch back after inserting
                       }
                   }}
                />
            </div>
      )}
    </div>

    {/* --- Suggested Measurements (remains at the bottom, outside tab content) --- */}
    <div className="flex-shrink-0 border-t border-slate-700/50 pt-4">
      <AiSuggestedMeasurementsPanel measurements={aiMeasurements} onInsert={handleInsertMeasurement} onClear={() => setAiMeasurements([])} />
    </div>
    </div>
</aside>
      </main>
      
{/* ================================================= */}
{/* ========= ADD THE AI ASSISTANT MODAL HERE ========= */}
{/* ================================================= */}
{showAssistantModal && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center">
                    <Wand2 size={18} className="mr-2 text-blue-400"/> AI Assistant
                </h3>
                <button onClick={() => setShowAssistantModal(false)} className="text-gray-400 hover:text-white">
                    <XCircle />
                </button>
            </div>

            <div className="p-6">
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                    Paste a report for correction, or enter a topic to generate a new template.
                </label>
                <textarea
                    value={assistantQuery}
                    onChange={(e) => setAssistantQuery(e.target.value)}
                    rows="8"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                    placeholder="Paste full report here..."
                />
            </div>

            <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex justify-end space-x-2">
                <button
                    onClick={handleCorrectReport}
                    disabled={isAiLoading || !assistantQuery}
                    // Added: transition classes for animation
                    className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition transform duration-100 ease-in-out active:scale-95 flex items-center justify-center disabled:opacity-50 text-sm"
                >
                    <CheckCircle size={16} className="mr-2"/> Correct Report
                </button>
                <button
                    onClick={handleGenerateTemplate}
                    disabled={isAiLoading || !assistantQuery}
                     // Added: transition classes for animation
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition transform duration-100 ease-in-out active:scale-95 flex items-center justify-center disabled:opacity-50 text-sm"
                >
                    <PlusCircle size={16} className="mr-2"/> Generate Template
                </button>
            </div>
        </div>
    </div>
)}

{/* ================================================= */}
{/* ========= ADD THE SUGGESTIONS MODAL HERE ========= */}
{/* ================================================= */}
{showSuggestionsModal && (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-lg font-bold capitalize">
                    {suggestionType === 'differentials' ? 'Suggested Differentials' : 'Suggested Recommendations'}
                </h3>
                <button onClick={() => setShowSuggestionsModal(false)} className="text-gray-400 hover:text-white">
                    <XCircle />
                </button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow min-h-[200px]">
                {isSuggestionLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
                    </div>
                ) : (
                    <p className="text-gray-300 whitespace-pre-wrap">{aiSuggestions}</p>
                )}
            </div>
            <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex justify-end space-x-2">
                <button 
                    onClick={() => setShowSuggestionsModal(false)} 
                    className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition text-sm"
                >
                    Close
                </button>
                <button 
                    onClick={appendSuggestionsToReport} 
                    disabled={isSuggestionLoading || !aiSuggestions}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition disabled:opacity-50 text-sm"
                >
                    Append to Report
                </button>
            </div>
        </div>
    </div>
)}

{/* ================================================= */}
{/* ========= ADD THE DATA SUMMARY MODAL HERE ========= */}
{/* ================================================= */}
{/* // In App.jsx, replace the existing showDataModal block */}

{showDataModal && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        {/* Adjusted max-w-2xl for a bit more space than xl but less than 4xl */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header remains structurally similar */}
            <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                <h3 className="text-lg font-bold flex items-center text-gray-100">
                    <ListPlus size={18} className="mr-2 text-blue-400"/> Extracted Data Summary
                </h3>
                <button onClick={() => setShowDataModal(false)} className="text-gray-400 hover:text-white">
                    <XCircle />
                </button>
            </div>

            {/* Content Area: Changed background, text color, and using prose */}
            <div className="p-6 overflow-y-auto bg-white text-gray-900 prose prose-sm">
                {isExtracting && (
                    <div className="flex items-center text-sm text-slate-500">
                        {/* Spinner for loading state */}
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-500 mr-2"></div>
                        Extracting...
                    </div>
                )}
                {!isExtracting && Object.keys(structuredData).length === 0 && (
                    <p className="text-sm text-slate-500 italic">No data extracted yet. Type in the editor.</p>
                )}
                {!isExtracting && Object.keys(structuredData).length > 0 && (
                     <dl className="space-y-2">
                        {Object.entries(structuredData).map(([key, value]) => (
                            <div key={key} className="border-b border-gray-200 pb-1">
                                <dt className="font-semibold capitalize text-gray-700">{key.replace(/([A-Z])/g, ' $1')}:</dt>
                                <dd className="ml-4 text-gray-800 break-words">{value.toString()}</dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>

            {/* Footer remains structurally similar */}
             <div className="p-3 bg-slate-900/50 border-t border-slate-700 flex justify-end flex-shrink-0">
                <button
                    onClick={() => setShowDataModal(false)}
                    className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition text-sm"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}


      {/* ============== MODALS & FLOATING BUTTONS ============== */}
{isModalOpen && ( <ImageModal images={images} currentIndex={currentImageIndex} onClose={closeModal} onNext={showNextImage} onPrev={showPrevImage} /> )}

       {showShortcutsModal && <ShortcutsHelpModal shortcuts={shortcuts} onClose={() => setShowShortcutsModal(false)} />}
       {showTemplateModal && <TemplateManagerModal user={user} existingModalities={Object.keys(templates)} onClose={() => setShowTemplateModal(false)} />}
        {/* FIX #6: New Report Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Report Preview</h3>
                    <div className="flex items-center space-x-2">
                       {/* Download and copy buttons go here */}
                       <button onClick={() => downloadPdfReport(generatedReport)} title="Download as PDF" className="p-2 rounded-md hover:bg-slate-700"><FileJson size={18}/></button>
                       <button onClick={() => copyToClipboard(generatedReport)} title="Copy Text" className="p-2 rounded-md hover:bg-slate-700"><Clipboard size={18}/></button>
                        <button onClick={()=>downloadTxtReport(generatedReport)} title="Download as .txt" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-600 disabled:opacity-50" disabled={!generatedReport}><FileType size={18}/></button>                          
                          <button
                            onClick={() => downloadWordReport(generatedReport, patientName)}
                            className="p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                            title="Download as .docx"
                          >
                            Download as Word
                          </button>
                       <button onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-white"><XCircle /></button>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto bg-white text-black prose">
                    <div dangerouslySetInnerHTML={{ __html: generatedReport }} />
                </div>
            </div>
        </div>
      )}
        {showMacroModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Manage Voice Macros</h3>
                <button className="text-2xl font-bold text-gray-800 hover:bg-gray-300 transition" onClick={() => setShowMacroModal(false)}><XCircle /></button>
              </div>
              <div className="p-6 overflow-y-auto flex-grow space-y-4 gray-1000">
                <div>
                  <h4 className="font-bold text-gray-800 ">Add New Macro</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Voice Command (e.g., 'normal abdomen')"
                      value={newMacroCommand}
                      onChange={(e) => setNewMacroCommand(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-gray-400 hover:bg-gray-500 transition"
                    />
                    <textarea
                      placeholder="Text to insert"
                      value={newMacroText}
                      onChange={(e) => setNewMacroText(e.target.value)}
                      className="w-full p-2 border rounded-lg md:col-span-2 bg-gray-400 hover:bg-gray-500 transition"
                      rows="3"
                    ></textarea>
                  </div>
                  <button
                    onClick={handleAddMacro}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    Add Macro
                  </button>
                </div>
                <hr />
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Existing Macros</h4>
                  <div className="space-y-2">
                    {macros.map((macro) => (
                      <div key={macro.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                        <div>
                          <p className="font-semibold text-sm text-black truncate">{macro.command}</p>
                          <p className="text-sm text-gray-500 truncate">{macro.text}</p>
                        </div>
                        <button onClick={() => handleDeleteMacro(macro.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
       {/* // In App.jsx, replace the existing <nav> block */}

{/* =============================================================================== */}
{/* ============ UPDATED MOBILE NAVIGATION TABS =================================== */}
{/* =============================================================================== */}
<nav className="flex-shrink-0 bg-slate-950 border-t border-slate-700 flex lg:hidden h-16"> {/* Added h-16 */}
    {/* Case Info Button */}
    <button
        onClick={() => setMobileView('case')}
        className={`flex-1 py-3 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors ${mobileView === 'case' ? 'text-blue-400 bg-slate-800' : 'text-gray-400 hover:bg-slate-800/50'}`}
    >
        <User size={18} /> Case Info
    </button>
    {/* Workspace Button */}
    <button
        onClick={() => setMobileView('workspace')}
        className={`flex-1 py-3 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors ${mobileView === 'workspace' ? 'text-blue-400 bg-slate-800' : 'text-gray-400 hover:bg-slate-800/50'}`}
    >
        <FileText size={18} /> Workspace
    </button>
    {/* AI Tools Button */}
    <button
        onClick={() => setMobileView('ai')}
        className={`flex-1 py-3 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors ${mobileView === 'ai' ? 'text-blue-400 bg-slate-800' : 'text-gray-400 hover:bg-slate-800/50'}`}
    >
        <BrainCircuit size={18} /> AI Tools
    </button>
</nav>
       {/* Other modals (Suggestions, Macros) go here, styling adjusted for dark theme */}

      <div className="fixed bottom-6 right-6 z-50">
          {/* <button
              onClick={handleToggleListening}
              disabled={!isDictationSupported}
              title="Toggle Voice Dictation"
              className={`w-16 h-16 rounded-full text-white flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110
                  ${voiceStatus === 'listening' ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'}
              `}
          >
              <Mic size={28} />
          </button> */}
      </div>

       <Toaster position="bottom-right" toastOptions={{ style: { background: '#1f2937', color: '#e5e7eb' } }} />
    </div>
  );
};

export default App;