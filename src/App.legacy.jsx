// IMPORTANT: This file contains JSX syntax. Please ensure it has a .jsx or .tsx extension (e.g., App.jsx) to avoid build errors.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, FileText, Clipboard, Settings, BrainCircuit, User, Calendar, Stethoscope, XCircle, FileType, FileJson, Search, PlusCircle, MessageSquare, CheckCircle, ChevronLeft, ChevronRight, Lightbulb, ListPlus, AlertTriangle, FileScan, Mic, Plus, Trash2, Bold, Italic, List, ListOrdered, Pilcrow, BookOpen, Link as LinkIcon, Zap, Copy, UserCheck, LogOut, ChevronDown, History, Image as ImageIcon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import jsPDF from 'jspdf';
import { htmlToText } from 'html-to-text';
import { useDropzone } from 'react-dropzone';

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

// --- NEW COMPONENT: AiConversationPanel ---
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mt-8">
      <div className="p-4 bg-gray-50 border-b rounded-t-2xl">
        <h2 className="text-xl font-bold text-gray-700 flex items-center">
          <MessageSquare className="mr-3 text-indigo-500" />
          AI Co-pilot Conversation
        </h2>
      </div>
      <div className="p-4 h-96 overflow-y-auto flex flex-col space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-xl p-3 max-w-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        ))}
        {isReplying && (
          <div className="flex justify-start">
            <div className="rounded-xl p-3 bg-gray-200 text-gray-800">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 border-t bg-white rounded-b-2xl">
        <div className="flex items-center space-x-2">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition resize-none"
            rows="2"
            disabled={isReplying}
          />
          <button
            onClick={handleSend}
            disabled={isReplying || !userInput.trim()}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// --- NEW COMPONENT: CollapsibleSection ---
const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition focus:outline-none"
      >
        <div className="flex items-center">
          {Icon && <Icon className="mr-3 text-blue-500" />}
          <h2 className="text-xl font-bold text-gray-700">{title}</h2>
        </div>
        <ChevronDown
          size={24}
          className={`text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ transition: 'max-height 0.7s ease-in-out, padding 0.5s ease, opacity 0.5s ease' }}
      >
        <div className="p-6 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};


const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-t-lg border-b border-gray-300">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-2 rounded ${editor.isActive('paragraph') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        title="Paragraph"
      >
        <Pilcrow size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </button>
    </div>
  );
};


// --- UNIFIED COMPONENT: AlertPanel (UPDATED) ---
const AlertPanel = ({ alertData, onAcknowledge, onInsertMacro, onPrepareNotification, onFix, onProceed }) => {
  if (!alertData) return null;

  const isCritical = alertData.type === 'critical';
  const isFixable = alertData.type === 'inconsistency';
  const isMissingInfo = alertData.type === 'missing_info';

  const config = {
    critical: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
      iconColor: 'text-red-500',
      Icon: AlertTriangle,
      message: 'Please review and take appropriate action immediately.',
    },
    inconsistency: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500',
      Icon: AlertTriangle,
      title: 'Inconsistency Detected',
      message: alertData.message,
    },
    missing_info: {
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-800',
      iconColor: 'text-orange-500',
      Icon: AlertTriangle,
      title: 'Incomplete Report',
      message: alertData.message,
    },
  };

  const currentConfig = config[alertData.type];
  if (!currentConfig) return null;

  const title = isCritical
    ? `Critical Finding Detected: ${alertData.data?.findingName}`
    : currentConfig.title;

  return (
    <div className={`${currentConfig.bgColor} border-l-4 ${currentConfig.borderColor} ${currentConfig.textColor} p-4 rounded-lg shadow-md mb-4`} role="alert">
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
                  className="bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-lg hover:bg-gray-300 transition text-sm flex items-center"
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
                  className="bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-lg hover:bg-gray-300 transition text-sm flex items-center"
                >
                  <ChevronLeft size={16} className="mr-1.5" /> Go Back
                </button>
              </>
            )}
          </div>
        </div>
        { (isCritical || isMissingInfo) && (
          <button onClick={onAcknowledge} className={`ml-4 ${currentConfig.iconColor} hover:${currentConfig.textColor}`}>
            <XCircle size={22} />
          </button>
        )}
      </div>
    </div>
  );
};


// --- NEW COMPONENT: AiSuggestedMeasurementsPanel ---
const AiSuggestedMeasurementsPanel = ({ measurements, onInsert, onClear }) => {
  if (!measurements || measurements.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 p-4 rounded-2xl shadow-lg border border-blue-200 mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-blue-700 flex items-center">
          <Zap size={20} className="mr-2" />AI-Suggested Measurements
        </h3>
        <button onClick={onClear} className="text-gray-500 hover:text-gray-800">
          <XCircle size={22} />
        </button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {measurements.map((item, index) => (
          <div key={index} className="bg-white p-3 rounded-lg flex items-center justify-between shadow-sm">
            <div>
              <span className="font-semibold text-gray-800">{item.finding}:</span>
              <span className="ml-2 text-gray-600">{item.value}</span>
            </div>
            <button
              onClick={() => onInsert(item.finding, item.value)}
              className="bg-blue-100 text-blue-800 font-bold py-1 px-3 rounded-lg hover:bg-blue-200 transition text-sm flex items-center"
            >
              <Plus size={16} className="mr-1" /> Insert
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- NEW COMPONENT: RecentReportsPanel ---
const RecentReportsPanel = ({ onSelectReport, user }) => {
  const [recentReports, setRecentReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "reports"),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reports = [];
      querySnapshot.forEach((doc) => {
        reports.push({ id: doc.id, ...doc.data() });
      });
      setRecentReports(reports);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching recent reports: ", error);
      toast.error("Could not fetch recent reports.");
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <CollapsibleSection title="Recent Reports" icon={History}>
      {isLoading ? (
        <p>Loading recent reports...</p>
      ) : recentReports.length > 0 ? (
        <div className="space-y-2">
          {recentReports.map(report => (
            <button
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border transition"
            >
              <p className="font-semibold">{report.patientName}</p>
              <p className="text-sm text-gray-500">
                {report.examDate} - {new Date(report.createdAt?.seconds * 1000).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recent reports found.</p>
      )}
    </CollapsibleSection>
  );
};



const ShortcutsHelpModal = ({ shortcuts, onClose }) => {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifierKey = isMac ? '⌘' : 'Ctrl';
  const altKey = isMac ? '⌥' : 'Alt';

  const renderKey = (key) => <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">{key}</kbd>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center"><Zap size={24} className="mr-3 text-indigo-500"/>Keyboard Shortcuts</h3>
          <button onClick={onClose}><XCircle /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(shortcuts).map(([action, config]) => (
              <div key={action} className="flex justify-between items-center">
                <span className="text-gray-700">{config.label}</span>
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
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700 flex items-center">
          <BrainCircuit className="mr-3 text-green-500" />
          Knowledge Lookup: {result.conditionName}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <XCircle size={24} />
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Summary</h3>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: result.summary }} />
        </div>

        {result.keyImagingFeatures && result.keyImagingFeatures.length > 0 && (
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Key Imaging Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm prose prose-sm max-w-none">
              {result.keyImagingFeatures.map((feature, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: feature.replace(/<\/?li>/g, '') }} />
              ))}
            </ul>
          </div>
        )}

        {result.differentialDiagnosis && result.differentialDiagnosis.length > 0 && (
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Differential Diagnosis</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {result.differentialDiagnosis.map((dx, index) => (
                <li key={index}>{dx}</li>
              ))}
            </ul>
          </div>
        )}

        {result.sources && result.sources.length > 0 && (
          <div>
            <h4 className="font-bold text-gray-700 mt-4 mb-2 flex items-center"><BookOpen size={16} className="mr-2"/>Sources</h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {result.sources.map((source, index) => (
                <li key={index}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {source.name} <LinkIcon size={12} className="inline-block ml-1"/>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t">
        <button
          onClick={() => {
            const contentToInsert = `
              <h3>${result.conditionName}</h3>
              <h4>Summary</h4>
              ${result.summary}
              <h4>Key Imaging Features</h4>
              <ul>${result.keyImagingFeatures.join('')}</ul>
            `;
            onInsert(contentToInsert);
          }}
          className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
        >
          <PlusCircle size={18} className="mr-2" /> Insert into Report
        </button>
      </div>
    </div>
  );
};

// --- HELPER FUNCTION to escape characters for regex
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Skeleton Loader Components
const SearchResultSkeleton = () => (
  <div className="mt-3 space-y-3">
    {[...Array(2)].map((_, i) => (
      <div key={i} className="p-4 bg-gray-200 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/4 mb-3"></div>
        <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
    ))}
  </div>
);

const ReportSkeleton = () => (
  <div className="p-4 space-y-4 animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  </div>
);

// --- UPDATED COMPONENT: ImageViewer ---
const ImageViewer = ({ image, className }) => {
    const viewerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!image || !viewerRef.current) {
            return;
        }

        const element = viewerRef.current;
        const cornerstone = window.cornerstone;
        const cornerstoneTools = window.cornerstoneTools;
        const csWADOImageLoader = window.cornerstoneWADOImageLoader;

        if (!cornerstone || !cornerstoneTools || !csWADOImageLoader) {
            setError("Medical imaging libraries not loaded. Please wait a moment.");
            return;
        }

        const loadAndDisplayImage = async () => {
            setLoading(true);
            setError(null);
            try {
                cornerstone.enable(element);
                cornerstoneTools.init();

                let imageId;
                if (image.type === 'application/dicom' || image.name.toLowerCase().endsWith('.dcm')) {
                    imageId = csWADOImageLoader.wadouri.fileManager.add(image.file);
                } else {
                    // For non-DICOM, create a file-like object for the loader
                    const blob = await (await fetch(image.src)).blob();
                    const file = new File([blob], image.name, {type: image.type});
                    imageId = csWADOImageLoader.wadouri.fileManager.add(file);
                }

                const loadedImage = await cornerstone.loadImage(imageId);
                cornerstone.displayImage(element, loadedImage);
                cornerstone.resize(element, true);

                cornerstoneTools.addTool(cornerstoneTools.PanTool);
                cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
                cornerstoneTools.addTool(cornerstoneTools.WwwcTool);

                cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 }); // Left mouse
                cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 }); // Right mouse
                cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 4 }); // Middle mouse
            } catch (err) {
                console.error("Error loading image:", err);
                setError("Failed to load image. It may not be a supported format.");
            } finally {
                setLoading(false);
            }
        };

        loadAndDisplayImage();

        return () => {
            try {
                if (cornerstone.getEnabledElement(element)) {
                   cornerstone.disable(element);
                }
            } catch (err) {
                // Ignore errors on cleanup
            }
        };
    }, [image]);

    return (
        <div className={`relative w-full border rounded-lg bg-gray-900 overflow-hidden ${className || 'h-[500px]'}`}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 text-white z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="ml-4">Loading image...</p>
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-800 bg-opacity-70 text-white z-10 p-4">
                    <AlertTriangle size={24} className="mr-2"/>
                    <p className="font-bold">Error: {error}</p>
                </div>
            )}
            <div ref={viewerRef} className="absolute inset-0"></div>
        </div>
    );
};

// --- NEW COMPONENT: ImageModal ---
const ImageModal = ({ images, currentIndex, onClose, onNext, onPrev }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col p-4 border-2 border-gray-700">
        <div className="flex justify-between items-center mb-2 text-white">
          <h3 className="text-lg font-bold">
            Image {currentIndex + 1} of {images.length} - {currentImage.name}
          </h3>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <XCircle size={28} />
          </button>
        </div>
        <div className="flex-grow relative">
          {isDicom(images[currentIndex]) ? (
          <div className="w-full h-full">
            <ImageViewer image={images[currentIndex]} />
          </div>
        ) : (
          <img
            src={getRasterSrc(images[currentIndex])}
            alt={images[currentIndex]?.name || `Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />
        )}
        </div>
      </div>
      {/* Navigation Buttons */}
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-700 text-white rounded-full p-3 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={onNext}
        disabled={currentIndex >= images.length - 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-700 text-white rounded-full p-3 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronRight size={32} />
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
  const [voiceStatus, setVoiceStatus] = useState('idle');
  const [isDictationSupported, setIsDictationSupported] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');
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
  const voiceStatusRef = useRef(voiceStatus);
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

  // --- LOAD DICOM LIBRARIES ---
  useEffect(() => {
    const loadLibraries = () => {
      // These libraries must be loaded in a specific order
      loadScript('https://unpkg.com/cornerstone-core@2.2.8/dist/cornerstone.min.js', () => {
        loadScript('https://unpkg.com/dicom-parser@1.8.11/dist/dicomParser.min.js', () => {
          loadScript('https://unpkg.com/cornerstone-wado-image-loader@2.0.4/dist/cornerstoneWADOImageLoader.min.js', () => {
            const csWADOImageLoader = window.cornerstoneWADOImageLoader;
            csWADOImageLoader.external.cornerstone = window.cornerstone;
            csWADOImageLoader.external.dicomParser = window.dicomParser;
            csWADOImageLoader.configure({
                beforeSend: function(xhr) {
                    // Add custom headers here (e.g., for authentication)
                }
            });
            loadScript('https://unpkg.com/cornerstone-tools@4.22.0/dist/cornerstoneTools.min.js', () => {
                const cornerstoneTools = window.cornerstoneTools;
                cornerstoneTools.external.cornerstone = window.cornerstone;
                setIsDicomLoaded(true);
            });
          });
        });
      });
    };
    loadLibraries();
  }, []);

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

  useEffect(() => {
    voiceStatusRef.current = voiceStatus;
  }, [voiceStatus]);

  const debouncedExtractData = useCallback((text) => {
    if (dataExtractTimeoutRef.current) {
      clearTimeout(dataExtractTimeoutRef.current);
    }
    dataExtractTimeoutRef.current = setTimeout(() => {
      if (text.trim().length > 20) {
        extractStructuredData(text);
      } else {
        setStructuredData({});
      }
    }, 1500);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start dictating or paste findings here…',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: userFindings,
    onUpdate: ({ editor }) => {
      if (isProgrammaticUpdate.current) {
        isProgrammaticUpdate.current = false;
        return; // Do not trigger checks or reset acknowledge flag on programmatic updates
      }
      
      const html = editor.getHTML();
      const text = editor.getText();
      setUserFindings(html);

      if (isAwaitingAlertAcknowledge) {
        return;
      }

      debouncedCriticalCheck(text);
      debouncedInconsistencyCheck(text);
      debouncedExtractData(text);
      debouncedProactiveAnalysis(text);
    },
  });

  // --- AUTHENTICATION LISTENER & FREEMIUM CHECK ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const userRole = userData.role || 'basic';
          setUserRole(userRole);

          if (userRole === 'basic') {
            const reportLimit = 1000;
            const reportCount = userData.reportCount || 0;
            const lastReportDate = userData.lastReportDate?.toDate();
            const currentMonth = new Date().getMonth();

            if (lastReportDate && lastReportDate.getMonth() !== currentMonth) {
              // Reset count for the new month
              await updateDoc(userDocRef, { reportCount: 0, lastReportDate: serverTimestamp() });
              setIsRestricted(false);
            } else if (reportCount >= reportLimit) {
              setIsRestricted(true);
            } else {
              setIsRestricted(false);
            }
          } else {
            setIsRestricted(false); // Professional users are never restricted
          }
        } else {
          // New user, set default values
          await setDoc(userDocRef, {
            email: currentUser.email,
            role: 'basic',
            reportCount: 0,
            lastReportDate: serverTimestamp(),
          });
          setUserRole('basic');
          setIsRestricted(false);
        }
      } else {
        setUser(null);
        setUserRole('basic');
        setIsRestricted(false);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

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
    if (isRestricted) return;
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
          handleAiKnowledgeSearch(true, parsedResult.searchQuery);
        }
      }
    } catch (err) {
      console.error("Proactive analysis failed:", err); // Log error but don't bother the user
    }
  };

  const debouncedProactiveAnalysis = useCallback((text) => {
    if (proactiveAnalysisTimeoutRef.current) {
      clearTimeout(proactiveAnalysisTimeoutRef.current);
    }
    proactiveAnalysisTimeoutRef.current = setTimeout(() => {
      if (isProactiveHelpEnabled && !isSearching && text.trim().length > 40) {
        runProactiveAnalysis(text);
      } else if (!awaitingRef.current) {
        setActiveAlert(null);
      }
    }, 3000); // 3-second delay after user stops typing
  }, [isProactiveHelpEnabled, isSearching, isRestricted]);

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      isProgrammaticUpdate.current = true;
      const initialContent = templates[modality]?.[template] || '';
      if (editor.getHTML() !== initialContent) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [modality, template, editor]);

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

  const debouncedInconsistencyCheck = useCallback((text) => {
    
    if (inconsistencyCheckTimeoutRef.current) {
      clearTimeout(inconsistencyCheckTimeoutRef.current);
    }
    inconsistencyCheckTimeoutRef.current = setTimeout(() => {

      if (!awaitingRef.current && text.trim().length > 50) { // Only run on substantial text
        runInconsistencyCheck(text);
      } else if (!awaitingRef.current) {
        setActiveAlert(null);
      }
    }, 2000); // 2-second delay
  }, [runInconsistencyCheck, isAwaitingAlertAcknowledge]);

  const debouncedCriticalCheck = useCallback((text) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (!isAwaitingAlertAcknowledge && text.trim() !== '') {
        checkForCriticalFindings(text);
      } else if (!isAwaitingAlertAcknowledge) {
        setActiveAlert(null);
      }
    }, 1000);
  }, []);

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


  const getCorrectedTranscript = async (transcript) => {
    const prompt = `You are an expert medical transcriptionist. Correct any spelling or grammatical errors in the following text, paying close attention to radiological and medical terminology. Return only the corrected text. Text to correct: '${transcript}'`;
    try {
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
      const model = 'gemini-2.5-flash';
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // API Key will be handled by the environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) {
        console.error("API Error, falling back to original transcript");
        return transcript; // Fallback
      }
      const result = await response.json();
      const correctedText = result.candidates?.[0]?.content.parts?.[0]?.text;
      return correctedText || transcript;
    } catch (error) {
      console.error("Failed to get corrected transcript:", error);
      return transcript; // Fallback
    }
  };

  const handleToggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError("Voice dictation is not supported by your browser.");
      return;
    }
    const currentStatus = voiceStatusRef.current;
    if (currentStatus !== 'idle') {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setVoiceStatus('listening');
      };

      recognition.onresult = async (event) => {
        let finalTranscript = '';
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript.trim();
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }
        setInterimTranscript(currentInterim);

        if (finalTranscript) {
          isProgrammaticUpdate.current = true;
          await handleVoiceCommand(finalTranscript);
          setInterimTranscript('');
        }
      };

      recognition.onend = () => {
        setVoiceStatus('idle');
        setInterimTranscript('');
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setError(`Speech recognition error: ${event.error}`);
        setVoiceStatus('idle');
      };
    } else {
      setIsDictationSupported(false);
      setError("Voice dictation is not supported by your browser.");
    }

    return () => {
      if(recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, []); // This empty array is the source of the stale state, but we fix it with the ref.

  const handleVoiceCommand = async (command) => {
    if (!editor || !command) return;
    const commandLC = command.toLowerCase().trim();

    const aiSearchKeyword = "look up";
    const commandKeyword = "command";
    const macroKeyword = "macro";

    if (commandLC.startsWith(aiSearchKeyword)) {
      const query = commandLC.substring(aiSearchKeyword.length).trim();
      if (query) {
        await handleAiKnowledgeSearch(true, query);
      }
      return; // Exit after handling
    }

    if (commandLC.startsWith(macroKeyword)) {
      const macroPhrase = commandLC.substring(macroKeyword.length).trim().replace(/[.,?]/g, '');
      const macro = macrosRef.current.find(m => macroPhrase === m.command.toLowerCase().trim().replace(/[.,?]/g, ''));
      if (macro) {
        isProgrammaticUpdate.current = true;
        editor.chain().focus().insertContent(macro.text).run();
      } else {
        console.warn(`Macro not found for: "${macroPhrase}"`);
      }
      return;
    }

    if (commandLC.startsWith(commandKeyword)) {
      const action = commandLC.substring(commandKeyword.length).trim().replace(/[.,?]/g, '');

      if (action === "analyze images") {
        analyzeImages();
      } else if (action === "download report") {
        const reportHtml = await generateFinalReport(); // Await the async function
        if (reportHtml) {
          downloadPdfReport(reportHtml);
        }
      } else if (action.startsWith("search for")) {
        const searchTerm = action.substring("search for".length).trim();
        setSearchQuery(searchTerm);
        setTimeout(() => {
          if(searchButtonRef.current) {
            searchButtonRef.current.click();
          }
        }, 100);
      } else if (action.startsWith("insert result")) {
        const numberWords = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5 };
        const resultNumStr = action.substring("insert result".length).trim();
        const resultNum = numberWords[resultNumStr] || parseInt(resultNumStr, 10);
        
        const { localSearchResults, allAiSearchResults, currentAiPage } = searchResultsRef.current;
        const combinedResults = [...localSearchResults, ...(allAiSearchResults[currentAiPage] || [])];
        
        if (!isNaN(resultNum) && resultNum > 0 && resultNum <= combinedResults.length) {
          isProgrammaticUpdate.current = true;
          insertFindings(combinedResults[resultNum - 1]);
        } else {
          console.warn(`Invalid result number for insertion: ${resultNumStr}`);
        }
      }
      else if (action.includes("delete last sentence")) {
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
      } else if (action.includes("bold last sentence") || action.includes("bold the last sentence")) {
        const content = editor.state.doc.textContent;
        const sentences = content.trim().split(/(?<=[.?!])\s+/);
          if (sentences.length > 0) {
            const lastSentence = sentences[sentences.length - 1];
            const startOfLastSentence = content.lastIndexOf(lastSentence);
              if (startOfLastSentence !== -1) {
                const endOfLastSentence = startOfLastSentence + lastSentence.length;
                isProgrammaticUpdate.current = true;
                editor.chain().focus().setTextSelection({ from: startOfLastSentence, to: endOfLastSentence }).toggleBold().run();
              }
          }
      }
      return;
    }
    
    const correctedText = await getCorrectedTranscript(command);
    isProgrammaticUpdate.current = true;
    editor.chain().focus().insertContent(correctedText + ' ').run();
  };

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

    const prompt = `
   You are a highly observant, knowledgable and one of the moset experienced Senior Radiologist and Cardiologist specialized in the analysis of medical imaging studies like Ultrasound, X-Ray, MRI, CT, 2d-Echo, 3d-Echo,ECG,etc .
    Given one or more medical images and optional clinical context, you must analyze the content and return a single, valid JSON object.
    The root of this object must contain the following keys: "analysisReport", "measurements", and "criticalFinding".

    1. "analysisReport" (String): A comprehensive, human-readable narrative report describing the findings and impressions, formatted as an HTML string with <p> and <strong> tags.**Note: Impression should provide brief info about the finding not repeat the same thing (for example for this finding:'Two well defined hyperechoic lesions are noted in the subcutaneous plane of anterior abdominal wall in left hypochondria region with no e/o vascularity on applying colour doppler likely to be lipoma, largest measuring 2.1 x 0.8 x 1.1 cm' , The Impression should be :•	'Anterior Abdomial wall lipoma.')
    2. "measurements" (Array of Objects): An array for all identifiable and measurable findings. If none, return an empty array []. Each object must contain:
     - "finding" (String): A concise description of the object being measured (e.g., "Right Kidney", "Aortic Diameter", "Pulmonary Nodule in Left Upper Lobe").
     - "value" (String): The measurement value with units (e.g., "10.2 x 4.5 cm", "4.1 cm", "8 mm").
    3. "criticalFinding" (Object or Null): An object for actionable critical findings. If none, this MUST be null. If a critical finding is detected, the object MUST contain:
     - "findingName" (String): The specific name of the critical finding (e.g., "Aortic Dissection").
     - "reportMacro" (String): A pre-defined sentence for the report (e.g., "CRITICAL FINDING: Acute aortic dissection is identified.").
     - "notificationTemplate" (String): A pre-populated message for communication (e.g., "URGENT: Critical finding on Patient [Patient Name/ID]. CT shows acute aortic dissection...").
        
       **Please remove this for reference only** Clinical Context: "${clinicalContext || 'None'}"
       OR If Given one or more images of the ready-to-print report then :
      1.  **Extract Text**: Accurately extract all text from the provided image(s) to form a complete report.
      2.  **Analyze for Inconsistencies**:
      * Review the "body" of the report which contains all the findings to identify all significant radiological findings.
      * Compare these findings with the "IMPRESSION" section.
      * If a significant finding from the body is missing from the impression (e.g., "fatty liver" is in findings but not impression), or if the significant finding present in the impression is missing in the body of the report that contains all the findings,  identify it.
      3.  **Generate Correction and Alert**:
      * If an inconsistency is found, create a 'suggestedCorrection' string. This should be the exact text to add to the impression (e.g., "Grade I fatty liver.").
      * Also create a concise 'inconsistencyAlert' message explaining the issue (e.g., "'Grade I fatty liver' was found but is missing from the impression.").

       Return a single JSON object with the following keys. Do not include any other text or markdown.
       * 'analysisReport': The **original, uncorrected** report text, extracted from the image, as an HTML string.
       * 'measurements': An array of any measurements found (or an empty array if none).
       * 'criticalFinding': An object for any critical findings (or null if none).
       * 'inconsistencyAlert': A string explaining the inconsistency, or null if none was found.
       * 'suggestedCorrection': The string to be added to the impression to fix the issue, or null if none is needed.

    
    **Your Response MUST be a single, valid JSON object following one of these two schemas:**

    ---
    **Schema 1: High-Confidence Analysis (Default)**
    {
      "analysisSuccessful": true,
      "analysisReport": "string (The full report, formatted as an HTML string with <p> and <strong> tags.)",
      "measurements": [{ "finding": "string", "value": "string" }],
      "criticalFinding": { "findingName": "string", "reportMacro": "string", "notificationTemplate": "string" } | null
    }
    ---
    **Schema 2: Clarification Needed**
    {
      "analysisSuccessful": false,
      "clarificationNeeded": true,
      "questionForDoctor": "string (Your specific, concise question for the doctor.)"
    }
    ---
    
    Clinical Context: "${clinicalContext || 'None'}"
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
          if (parsedResult.analysisReport && editor) {
            editor.commands.setContent(parsedResult.analysisReport);
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
          toastDone('AI analysis complete');
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

  
  const handleSearch = () => {
      if (!searchQuery) {
          setError("Please enter a search term.");
          return;
      }
      setError(null);
      
      const query = searchQuery.toLowerCase().trim();
      const results = localFindings.filter(finding =>
          finding.organ.toLowerCase().includes(query) ||
          finding.findingName.toLowerCase().includes(query)
      );
      setLocalSearchResults(results);

      setAllAiSearchResults([]);
      setCurrentAiPage(0);
      setAllAiFullReports([]);
      setCurrentReportPage(0);
      setAiKnowledgeLookupResult(null);
      
      setBaseSearchQuery(searchQuery);
  };
  
  const handleAiFindingsSearch = async (isMoreQuery = false) => {
    // if (isRestricted) {
    //    toast.error("Please upgrade to a professional plan to use AI search.");
    //    return;
    // }
    if (!baseSearchQuery) {
      setError("Please perform a standard search first.");
      return;
    }
    setIsSearching(true);
    setError(null);
    setAiKnowledgeLookupResult(null); // Clear knowledge results

    const currentQuery = isMoreQuery ? `${baseSearchQuery} some more` : baseSearchQuery;
    const existingFindingNames = allAiSearchResults.flat().map(r => r.findingName);
    const existingReportText = allAiFullReports.map(r => r.fullReportText).join('\n\n---\n\n');
    const isReportContext = allAiFullReports.length > 0;

    const prompt = `
      You are an AI assistant for radiologists, focused on generating report content. Analyze the user's search query: "${currentQuery}".
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
        Act as an expert radiologist. Based on the following radiological findings, provide a list of potential differential diagnoses. For each diagnosis, provide a brief rationale and an estimated likelihood (e.g., Likely, Less Likely, Remote).

        Findings:
        ---
        ${reportText}
        ---
      `;
    } else if (type === 'recommendations') {
      prompt = `
        Act as an expert radiologist. Based on the following radiology report (especially the impression), suggest clinically appropriate follow-up actions or recommendations.

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
    } else {
        // Fallback for when the organ isn't found in the current template
        const fallbackHtml = `<p><strong>${organ.toUpperCase()}:</strong> ${findings}</p><br><h3>IMPRESSION:</h3>${newImpressionHtml}`;
        editor.chain().focus().insertContent(fallbackHtml).run();
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
    // --- NEW: Validation Check ---
    if (!force) {
      const missing = findMissingMeasurements();
      if (missing.length > 0) {
        setActiveAlert({
          type: 'missing_info',
          message: `The following appear to be missing or incomplete: ${missing.join(', ')}. Do you want to proceed?`,
        });
        return; // Stop the function until user decides
      }
    }
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    const reportLimit = 1000;
    let newCount = userData.reportCount || 0;


    let reportHtml = '';
    if (editor) {
        const reportBody = editor.getHTML();
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
          toast.success(`Inserted measurement for ${finding}`);
      } else {
          toast.error(`Could not automatically find a placeholder for "${finding}". Please insert manually.`);
      }
  };

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

  const shortcuts = {
    toggleMic: { label: 'Toggle Microphone', ctrlOrCmd: true, key: 'm', action: handleToggleListening },
    generateReport: { label: 'Generate Final Report', ctrlOrCmd: true, key: 'g', action: generateFinalReport, condition: () => userFindings },
    analyzeImages: { label: 'Analyze Images', ctrlOrCmd: true, key: 'i', action: analyzeImages, condition: () => images.length > 0 },
    focusSearch: { label: 'Focus Local Search', ctrlOrCmd: true, key: 'f', action: () => localSearchInputRef.current?.focus() },
    focusEditor: { label: 'Focus Editor', key: 'Escape', action: () => editor?.commands.focus(), isUniversal: true },
    suggestDifferentials: { label: 'Suggest Differentials', alt: true, key: 'd', action: () => handleGetSuggestions('differentials'), condition: () => userFindings },
    generateRecommendations: { label: 'Generate Recommendations', alt: true, key: 'r', action: () => handleGetSuggestions('recommendations'), condition: () => userFindings },
    openMacros: { label: 'Open Voice Macros', alt: true, key: 'm', action: () => setShowMacroModal(true) },
    toggleProactive: { label: 'Toggle Proactive Co-pilot', alt: true, key: 'p', action: () => setIsProactiveHelpEnabled(prev => !prev) },
    showHelp: { label: 'Show Shortcuts Help', ctrlOrCmd: true, key: '/', action: () => setShowShortcutsModal(true) },
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
        const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const activeElement = document.activeElement;
        const isTyping = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;

        for (const config of Object.values(shortcuts)) {
            const isCtrlOrCmd = (isMac && event.metaKey) || (!isMac && event.ctrlKey);
            
            let keyMatch = event.key.toLowerCase() === config.key.toLowerCase();
            if (config.key === '/') keyMatch = event.key === '/'; // Handle special characters

            let modifierMatch = (config.ctrlOrCmd && isCtrlOrCmd) || (config.alt && event.altKey) || (!config.ctrlOrCmd && !config.alt && !event.altKey && !isCtrlOrCmd);

            if (keyMatch && modifierMatch) {
                if (config.isUniversal || !isTyping) {
                    event.preventDefault();
                    if (config.condition === undefined || config.condition()) {
                        config.action();
                    } else {
                        toast.error('Cannot perform action. Conditions not met.', { duration: 2000 });
                    }
                    return; // Stop after first match
                }
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, userFindings, images, isProactiveHelpEnabled, handleToggleListening, generateFinalReport, analyzeImages, handleGetSuggestions]);

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
  return (
    <div
      className="min-h-screen font-sans text-gray-800"
      style={{
        backgroundImage: `linear-gradient(rgba(24, 32, 47, 0.9), rgba(24, 32, 47, 0.9)), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <style>{`
        .tiptap {
          min-height: 250px;
          border: 1px solid #ccc;
          border-top: none;
          border-radius: 0 0 0.5rem 0.5rem;
          padding: 0.5rem;
        }
        .tiptap:focus {
            outline: none;
            border-color: #a7f3d0;
        }
        .tiptap p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        /* Added styles for lists */
        .tiptap ul, .tiptap ol {
            padding-left: 1.5rem;
        }
        .tiptap ul {
            list-style-type: disc;
        }
        .tiptap ol {
            list-style-type: decimal;
        }
        .toggle-checkbox:checked {
            right: 0;
            border-color: #4f46e5; /* Tailwind indigo-600 */
            transform: translateX(100%);
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #4f46e5; /* Tailwind indigo-600 */
        }
        .toggle-checkbox {
            transition: all 0.2s ease-in-out;
            left: 0;
        }
        @keyframes pulse-slow {
          50% {
            box-shadow: 0 0 0 12px rgba(239, 68, 68, 0.2);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite;
        }
      `}</style>
      <div className="container mx-auto p-4 lg:p-8">
        <header className="text-center mb-8 relative">
        {/* <img
          src="src\assets\aiRAD_logo.jpg"
          alt="example"
          style={{ maxWidth: '5%' }}
        /> */}
        
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 flex items-center justify-center"> <img src="src\assets\aiRAD_logo.jpg" alt="aiRAD Logo" className="h-24 w-24 mr-4 rounded-lg flex items-left justify-left"  /><br/>aiRAD-Reporting, Redefined.</h1>
          <p className="text-lg text-gray-100 mt-2">AI-Assisted Radiology Reporting System.</p>
          {user && (
            <div className="absolute top-0 right-0 flex items-center space-x-4">
                <span className="text-white text-sm hidden sm:inline">{user.email}</span>
                <button
                    onClick={handleSignOut}
                    className="bg-red-500 text-white font-semibold px-3 py-2 rounded-lg hover:bg-red-600 transition shadow-sm flex items-center space-x-2"
                    title="Sign Out"
                >
                    <LogOut size={16} />
                    <span className="hidden md:inline">Sign Out</span>
                </button>
            </div>
          )}
        </header>
        {isRestricted && (
            <div className="p-4 mb-4 bg-yellow-100 text-yellow-800 rounded-lg text-center">
                You've reached your free limit.
                <button
                    onClick={() => { /* Navigate to upgrade page */ }}
                    className="font-bold underline ml-2"
                >
                    Upgrade to Professional
                </button>
                for unlimited reports and AI features.
            </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls & Inputs */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-700 flex items-center"><Settings className="mr-3 text-blue-500" />Controls</h2>
                    <button onClick={() => setShowMacroModal(true)} className="text-sm bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md hover:bg-blue-200 transition flex items-center">
                        <Plus size={14} className="mr-1" /> Voice Macros
                    </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <label htmlFor="proactive-toggle" className="font-semibold text-gray-700 flex items-center text-sm cursor-pointer">
                        <Lightbulb size={16} className={`mr-2 ${isProactiveHelpEnabled ? 'text-yellow-500' : 'text-gray-400'}`}/>
                        Proactive AI Co-pilot
                    </label>
                    <div className="relative inline-block w-10 align-middle select-none">
                        <input
                            type="checkbox"
                            name="proactive-toggle"
                            id="proactive-toggle"
                            checked={isProactiveHelpEnabled}
                            onChange={() => setIsProactiveHelpEnabled(!isProactiveHelpEnabled)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label htmlFor="proactive-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                </div>
            </div>

            <CollapsibleSection title="Patient & Exam Details" icon={User} defaultOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-semibold text-gray-600 flex items-center mb-2"><User size={18} className="mr-2"/>Patient Name</label>
                        <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-600 flex items-center mb-2"><User size={18} className="mr-2"/>Patient ID</label>
                        <input type="text" value={patientId} onChange={e => setPatientId(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-600 flex items-center mb-2"><Calendar size={18} className="mr-2"/>Patient Age</label>
                        <input type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-600 flex items-center mb-2"><UserCheck size={18} className="mr-2"/>Referring Physician</label>
                        <input type="text" value={referringPhysician} onChange={e => setReferringPhysician(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
                    </div>
                    <div className="md:col-span-2">
                        <label className="font-semibold text-gray-600 flex items-center mb-2"><Calendar size={18} className="mr-2"/>Exam Date</label>
                        <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
                    </div>
                </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Report Template" icon={FileText}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-semibold text-gray-600 flex items-center mb-2"><Stethoscope size={18} className="mr-2"/>Modality</label>
                        <select value={modality} onChange={e => {setModality(e.target.value); setTemplate(Object.keys(templates[e.target.value])[0])}} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white">
                            {Object.keys(templates).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-600 flex items-center mb-2"><FileText size={18} className="mr-2"/>Template</label>
                        <select value={template} onChange={e => setTemplate(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white" disabled={!modality}>
                            {modality && Object.keys(templates[modality] || {}).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
            </CollapsibleSection>

            {/* NEW: Image Uploads and Viewer */}
            <CollapsibleSection title="Radiology Images & Viewer" icon={Upload} defaultOpen={true}>
                <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-2xl text-center transition-colors cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                    <input {...getInputProps()} />
                    <p className="text-gray-600 font-semibold">{isDragActive ? 'Drop the files here...' : 'Drag & drop images here, or click to select files'}</p>
                    <p className="text-sm text-gray-500 mt-1">Accepts DICOM, PNG, and JPEG files.</p>
                </div>
                {isDicomLoaded && selectedImage ? (
                    <div className="space-y-4">
                        <div className="cursor-pointer" onClick={() => images.length > 0 && openModal(images.indexOf(selectedImage) > -1 ? images.indexOf(selectedImage) : 0)}>
                            <ImageViewer image={selectedImage} />
                        </div>
                        <div className="flex space-x-2 p-2 overflow-x-auto border rounded-lg bg-gray-100">
                            {images.map((img, index) => (
                                <div key={index} className="relative group flex-shrink-0 cursor-pointer" onClick={() => openModal(index)}>
                                    <img
                                        src={img.src}
                                        alt={`Scan ${index+1}`}
                                        className={`w-24 h-24 object-contain rounded-md shadow-md transition-all border-2 ${selectedImage === img ? 'border-indigo-500 scale-105' : 'border-transparent'}`}
                                    />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : images.length > 0 ? (
                    <div className="mt-4 p-2 border rounded-lg bg-gray-100">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                             {images.map((img, index) => (
                                <div key={index} className="relative group">
                                     <img src={img.src} alt={`Scan ${index+1}`} className="w-full h-24 object-cover rounded-md shadow-md cursor-pointer" onClick={() => openModal(index)}/>
                                     <button onClick={(e) => { e.stopPropagation(); removeImage(index); }} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <XCircle size={18}/>
                                     </button>
                                </div>
                             ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 p-4 text-center text-gray-500">
                        {isDicomLoaded ? "No images loaded. Drag or select files above." : "Loading medical imaging libraries..."}
                    </div>
                )}
            </CollapsibleSection>

      {/* Image Modal for DICOM & Raster navigation */}
      <ImageModal
        images={images}
        currentIndex={modalIndex}
        onClose={closeModal}
        onNext={showNext}
        onPrev={showPrev}
      />

            <div className="w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                    <ImageIcon size={20} className="text-gray-600" />
                    <label htmlFor="clinical-context" className="font-semibold text-gray-600">Clinical Context (Optional)</label>
                </div>
                <textarea
                    id="clinical-context"
                    value={clinicalContext}
                    onChange={e => setClinicalContext(e.target.value)}
                    rows="2"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="e.g., Patient presents with right upper quadrant pain."
                />
                <button
                    onClick={analyzeImages}
                    disabled={isAiLoading || images.length === 0 || isRestricted}
                    className="w-full mt-3 bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition flex items-center justify-center disabled:bg-indigo-300"
                >
                    {isAiLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>{aiAnalysisStatus || 'Analyzing...'}</span></> : <><BrainCircuit size={20} className="mr-2"/>Analyze Images</>}
                </button>
            </div>


            <CollapsibleSection title="AI Assistant" icon={CheckCircle}>
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-600 flex items-center"><CheckCircle className="mr-2 text-teal-600" />AI Assistant</label>
                    <button onClick={handleParseReport} disabled={isParsing || !assistantQuery || isRestricted} className="text-xs bg-teal-100 text-teal-800 font-semibold py-1 px-2 rounded-md hover:bg-teal-200 transition flex items-center disabled:opacity-50">
                        {isParsing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-700 mr-2"></div> : <FileScan size={14} className="mr-1" />}
                        Parse to Fields
                    </button>
                </div>
                <textarea
                    value={assistantQuery}
                    onChange={(e) => setAssistantQuery(e.target.value)}
                    rows="4"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 transition"
                    placeholder="Paste a report for correction OR enter a topic to generate a new template..."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button onClick={handleCorrectReport} disabled={isLoading || !assistantQuery || isRestricted} className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition flex items-center justify-center disabled:bg-teal-400">
                        {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Correcting...</> : <><CheckCircle className="mr-2" />Correct Pasted Report</>}
                    </button>
                    <button onClick={handleGenerateTemplate} disabled={isLoading || !assistantQuery || isRestricted} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center disabled:bg-blue-400">
                        {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Generating...</> : <><PlusCircle className="mr-2" />Generate New Template</>}
                    </button>
                </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Local Findings Search" icon={Search}>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        ref={localSearchInputRef}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="e.g., Liver, Kidney, or Ectopic Pregnancy"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition"
                    />
                    <button ref={searchButtonRef} onClick={handleSearch} className="bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition flex items-center justify-center">
                        <Search size={20} />
                    </button>
                </div>
                
                {isSearching && !aiKnowledgeLookupResult && <SearchResultSkeleton />}

                {!isSearching && localSearchResults.length > 0 && (
                    <div className="mt-3 space-y-3 max-h-60 overflow-y-auto pr-2">
                        <h3 className="font-bold text-gray-700">Standard Findings</h3>
                        {localSearchResults.map((result, index) => (
                            <div key={result.id || index} className="p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-2 relative">
                                <span className="absolute top-2 right-2 bg-purple-200 text-purple-800 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{index + 1}</span>
                                <h4 className="font-bold text-purple-800">{result.findingName}</h4>
                                <div className="text-sm space-y-1">
                                    <p><span className="font-semibold">ORGAN:</span> {result.organ}</p>
                                    {result.isFullReport ? (
                                        <div>
                                            <span className="font-semibold">REPORT PREVIEW:</span>
                                            <div className="prose prose-sm max-w-none mt-1 p-2 bg-white rounded border h-24 overflow-y-hidden relative text-xs">
                                                <div dangerouslySetInnerHTML={{ __html: result.findings }} />
                                                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-purple-50 to-transparent pointer-events-none"></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p><span className="font-semibold">FINDINGS:</span> {result.findings}</p>
                                            <p><span className="font-semibold">IMPRESSION:</span> {result.impression}</p>
                                        </>
                                    )}
                                </div>
                                <div className="flex space-x-2 mt-2">
                                    <button onClick={() => insertFindings(result)} className="w-full bg-purple-200 text-purple-800 font-bold py-2 px-4 rounded-lg hover:bg-purple-300 transition flex items-center justify-center">
                                        <PlusCircle size={18} className="mr-2" /> Insert
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={() => handleAiFindingsSearch()} disabled={isSearching || !baseSearchQuery || isRestricted} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center disabled:bg-indigo-300">
                        {isSearching && !allAiFullReports.length && !allAiSearchResults.length ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>Searching...</span></> : <><Search size={20} className="mr-2" />Search Findings</>}
                    </button>
                    <button onClick={() => handleAiKnowledgeSearch()} disabled={isSearching || !baseSearchQuery || isRestricted} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center disabled:bg-green-300">
                        {isSearching ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>Searching...</span></> : <><BookOpen size={20} className="mr-2" />Knowledge Search</>}
                    </button>
                </div>
                
                {!isSearching && allAiFullReports.length > 0 && (
                    <div className="mt-3 space-y-3">
                        <h3 className="font-bold text-gray-700">AI-Drafted Report</h3>
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 space-y-2">
                            {allAiFullReports[currentReportPage] && (
                                <>
                                    <div className="text-sm prose max-w-none" dangerouslySetInnerHTML={{__html: allAiFullReports[currentReportPage].fullReportText}}/>
                                    <button onClick={() => insertFindings(allAiFullReports[currentReportPage])} className="w-full mt-2 bg-indigo-200 text-indigo-800 font-bold py-2 px-4 rounded-lg hover:bg-indigo-300 transition flex items-center justify-center">
                                        <PlusCircle size={18} className="mr-2" /> Insert this Version
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <button onClick={handlePreviousReport} disabled={currentReportPage === 0} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50 flex items-center">
                                <ChevronLeft size={20} className="inline-block mr-1" /> Previous
                            </button>
                            <span className="font-semibold text-gray-700">
                                Version {currentReportPage + 1} of {allAiFullReports.length}
                            </span>
                            <button onClick={handleNextReport} disabled={isSearching} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-indigo-300 flex items-center">
                                {isSearching && currentReportPage === allAiFullReports.length - 1 ? (
                                    <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div><span>Generating...</span></>
                                ) : (
                                    <>Next <ChevronRight size={20} className="inline-block ml-1" /></>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {!isSearching && allAiSearchResults.length > 0 && (
                    <div className="mt-3 space-y-3">
                        <h3 className="font-bold text-gray-700">AI-Powered Findings</h3>
                        {allAiSearchResults[currentAiPage] && allAiSearchResults[currentAiPage].map((result, index) => (
                            <div key={index} className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 space-y-2 relative">
                                <span className="absolute top-2 right-2 bg-indigo-200 text-indigo-800 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{localSearchResults.length + index + 1}</span>
                                <h4 className="font-bold text-indigo-800">{result.findingName}</h4>
                                <div className="text-sm">
                                    <p><span className="font-semibold">ORGAN:</span> {result.organ}</p>
                                    <p><span className="font-semibold">FINDINGS:</span> {result.findings}</p>
                                    <p><span className="font-semibold">IMPRESSION:</span> {result.impression}</p>
                                </div>
                                <div className="flex space-x-2 mt-2">
                                    <button onClick={() => insertFindings(result)} className="w-full bg-indigo-200 text-indigo-800 font-bold py-2 px-4 rounded-lg hover:bg-indigo-300 transition flex items-center justify-center">
                                        <PlusCircle size={18} className="mr-2" /> Insert
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between items-center mt-4">
                            <button onClick={handlePreviousPage} disabled={currentAiPage === 0} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50">
                                <ChevronLeft size={20} className="inline-block mr-1" /> Previous
                            </button>
                            <span>Page {currentAiPage + 1} of {allAiSearchResults.length}</span>
                            <button onClick={handleNextPage} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
                                Next <ChevronRight size={20} className="inline-block ml-1" />
                            </button>
                        </div>
                    </div>
                )}
            </CollapsibleSection>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
                <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-600">Findings & Measurements</label>
                    <div className="flex space-x-2">
                        <button onClick={() => handleGetSuggestions('differentials')} disabled={isSuggestionLoading || !userFindings || isRestricted} className="text-xs bg-gray-200 text-gray-700 font-semibold py-1 px-2 rounded-md hover:bg-gray-300 transition flex items-center disabled:opacity-50">
                            <Lightbulb size={14} className="mr-1" /> Suggest Differentials
                        </button>
                        <button onClick={() => handleGetSuggestions('recommendations')} disabled={isSuggestionLoading || !userFindings || isRestricted} className="text-xs bg-gray-200 text-gray-700 font-semibold py-1 px-2 rounded-md hover:bg-gray-300 transition flex items-center disabled:opacity-50">
                            <ListPlus size={14} className="mr-1" /> Generate Recommendations
                        </button>
                    </div>
                </div>
                
                <AlertPanel
                    alertData={activeAlert}
                    onAcknowledge={() => {
                        setActiveAlert(null);
                        setIsAwaitingAlertAcknowledge(false);
                    }}
                    onInsertMacro={() => {
                        if (editor && activeAlert?.type === 'critical' && activeAlert.data?.reportMacro) {
                            isProgrammaticUpdate.current = true;
                            editor.chain().focus().insertContent(`<p><strong>${activeAlert.data.reportMacro}</strong></p>`).run();
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
                        generateFinalReport(true); // Re-run the function, forcing it to bypass the check
                    }}
                />

                <div className={`rounded-lg bg-white transition-all duration-300 ${activeAlert?.type === 'critical' ? 'border-2 border-red-500 shadow-lg ring-4 ring-red-500/20' : 'border border-gray-300'}`}>
                    <MenuBar editor={editor} />
                    <EditorContent editor={editor} aria-label="Findings editor" />
                </div>
            </div>
          </div>
          
          {/* Right Column: Generated Report & AI Co-pilot */}
          <div className="space-y-8">
            <div>
              <div className="space-y-3 p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold text-gray-700 flex items-center"><FileText className="mr-2" />Summary of the Report</h3>
                  {isExtracting && <div className="flex items-center text-sm text-gray-500"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>Extracting...</div>}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      {Object.entries(structuredData).length > 0 ? (
                          Object.entries(structuredData).map(([key, value]) => (
                              <div key={key}>
                                  <span className="font-semibold text-gray-600">{key}: </span>
                                  <span className="text-gray-800">{value.toString()}</span>
                              </div>
                          ))
                      ) : (
                          !isExtracting && <p className="text-gray-500 col-span-2">Start typing in the editor to see extracted data here.</p>
                      )}
                  </div>
              </div>
              <RecentReportsPanel onSelectReport={handleSelectRecentReport} user={user} />
              {/* --- NEW: Render Suggested Measurements Panel --- */}
              <AiSuggestedMeasurementsPanel
                  measurements={aiMeasurements}
                  onInsert={handleInsertMeasurement}
                  onClear={() => setAiMeasurements([])}
              />

              <br />
              <h2 className="text-2xl font-bold text-gray-500 flex items-center mb-4"><FileText className="mr-3 text-green-500" />Generated Report</h2>
              {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">Error: {error}</div>}
              <div className="relative w-full min-h-[400px] bg-white rounded-lg border p-4 overflow-y-auto shadow-inner">
                  <div className="absolute top-2 right-2 flex items-center space-x-2">
                      {copySuccess && <span className="text-sm text-green-600">{copySuccess}</span>}
                      <button onClick={() => copyToClipboard(generatedReport)} title="Copy Report" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-600 disabled:opacity-50" disabled={!generatedReport}><Clipboard size={18}/></button>
                      <button onClick={()=>downloadTxtReport(generatedReport)} title="Download as .txt" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-600 disabled:opacity-50" disabled={!generatedReport}><FileType size={18}/></button>
                      <button
                          onClick={() => downloadPdfReport(generatedReport)}
                          title="Download as .pdf"
                          aria-label="Download report as PDF"
                          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-600 disabled:opacity-50"
                          disabled={!generatedReport}
                      >
                          <FileJson size={18} />
                      </button>
                      <Toaster
                          position="top-right"
                          toastOptions={{
                              className: 'rounded-lg shadow-md',
                              style: { background: '#111827', color: '#fff' },
                          }}
                      />
                  </div>
                  {isLoading ? <ReportSkeleton /> : <div dangerouslySetInnerHTML={{ __html: generatedReport }} className="prose max-w-none"/>}
              </div>
              <button onClick={()=>generateFinalReport()} disabled={isLoading || !userFindings} className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center disabled:bg-blue-400 text-lg shadow-md hover:shadow-lg">
              {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Generating Report...</> : <><FileText className="mr-2" /> Generate Full Report</>}
              </button>
            </div>

            <KnowledgeLookupPanel
              result={aiKnowledgeLookupResult}
              onClose={() => setAiKnowledgeLookupResult(null)}
              onInsert={(content) => {
                  if (editor) {
                      isProgrammaticUpdate.current = true;
                      editor.chain().focus().insertContent(content).run();
                      toastDone('Knowledge summary inserted.');
                      setAiKnowledgeLookupResult(null);
                  }
              }}
            />
          </div>
        </div>
{/* --- NEW: RENDER CONVERSATION PANEL --- */}
        {isConversationActive && (
          <AiConversationPanel
            history={conversationHistory}
            onSendMessage={handleSendMessage}
            isReplying={isAiReplying}
            userInput={userInput}
            setUserInput={setUserInput}
          />
        )}

        {/* Modals */}
        {isModalOpen && (
          <ImageModal
            images={images}
            currentIndex={currentImageIndex}
            onClose={closeModal}
            onNext={showNextImage}
            onPrev={showPrevImage}
          />
        )}
        {showShortcutsModal && <ShortcutsHelpModal shortcuts={shortcuts} onClose={() => setShowShortcutsModal(false)} />}

        {showSuggestionsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-800 capitalize">
                  {suggestionType === 'differentials' ? 'Suggested Differential Diagnoses' : 'Suggested Recommendations'}
                </h3>
              </div>
              <div className="p-6 overflow-y-auto flex-grow">
                {isSuggestionLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{aiSuggestions}</p>
                )}
              </div>
              <div className="p-4 bg-gray-50 border-t rounded-b-2xl flex justify-end space-x-3">
                <button onClick={() => setShowSuggestionsModal(false)} className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
                  Close
                </button>
                <button onClick={appendSuggestionsToReport} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                  Append to Report
                </button>
              </div>
            </div>
          </div>
        )}
        {showMacroModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Manage Voice Macros</h3>
                <button onClick={() => setShowMacroModal(false)}><XCircle /></button>
              </div>
              <div className="p-6 overflow-y-auto flex-grow space-y-4">
                <div>
                  <h4 className="font-bold text-lg mb-2">Add New Macro</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Voice Command (e.g., 'normal abdomen')"
                      value={newMacroCommand}
                      onChange={(e) => setNewMacroCommand(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                    <textarea
                      placeholder="Text to insert"
                      value={newMacroText}
                      onChange={(e) => setNewMacroText(e.target.value)}
                      className="w-full p-2 border rounded-lg md:col-span-2"
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
                  <h4 className="font-bold text-lg mb-2">Existing Macros</h4>
                  <div className="space-y-2">
                    {macros.map((macro) => (
                      <div key={macro.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                        <div>
                          <p className="font-semibold">{macro.command}</p>
                          <p className="text-sm text-gray-600 truncate">{macro.text}</p>
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
      </div>
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center">
            <button
                onClick={handleToggleListening}
                disabled={!isDictationSupported}
                title={isDictationSupported ? "Toggle Voice Dictation" : "Dictation not supported"}
                className={`w-16 h-16 rounded-full text-white flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110
                    ${voiceStatus === 'listening' ? 'bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}
                `}
            >
                <Mic size={28} />
            </button>
            {voiceStatus === 'listening' && (
                <div className="mt-2 text-center text-xs bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg max-w-xs">
                    <p className="font-bold">Listening...</p>
                    {interimTranscript && <p className="mt-1 italic">{interimTranscript}</p>}
                </div>
            )}
        </div>
    </div>
  );
};
export default App;
