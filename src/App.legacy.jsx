// IMPORTANT: This file contains JSX syntax. Please ensure it has a .jsx or .tsx extension (e.g., App.jsx) to avoid build errors.
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Upload, FileText, Clipboard, Settings, BrainCircuit, User, Calendar, Stethoscope, XCircle,
  FileType, FileJson, Search, PlusCircle, MessageSquare, CheckCircle, ChevronLeft, ChevronRight,
  Lightbulb, ListPlus, AlertTriangle, FileScan, Mic, Plus, Trash2, Bold, Italic, List, UnderlineIcon,
  ListOrdered, Pilcrow, BookOpen, Link as LinkIcon, Zap, Copy, UserCheck, LogOut, X, Save, Wifi, WifiOff, Shield, Loader2, FileIcon,
  ChevronDown, History, Redo2, Image as ImageIcon, Menu, Eye, Wand2, Table as TableIcon, ArrowRight, Sun, Moon,
  Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, Heading1, Heading2, Heading3, Quote, Code, Minus,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontSize } from '@tiptap/extension-font-size';
// 👇 Tiptap table extensions, ALIASED to avoid clash with docx.Table
import { Table as TableExtension } from '@tiptap/extension-table';
import { TableRow as TableRowExtension } from '@tiptap/extension-table-row';
import { TableHeader as TableHeaderExtension } from '@tiptap/extension-table-header';
import { TableCell as TableCellExtension } from '@tiptap/extension-table-cell';
import jsPDF from 'jspdf';
import { htmlToText } from 'html-to-text';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ShadingType, ImageRun } from 'docx';
import MeasurementsPanel from './components/panels/MeasurementsPanel.jsx';
import TemplateManagerModal from './components/modals/TemplateManagerModal.jsx';
import CollapsibleSection from './components/common/CollapsibleSection.jsx';
import DOMPurify from 'dompurify';

import { geminiTools } from './api/geminiTools.js'; // Import the tools
import { useVoiceAssistant } from './hooks/useVoiceAssistant.jsx'; // Import the new hook

import { useTheme } from "./context/ThemeContext"; // Import hook
import { LogoIcon } from './components/common/LogoIcon.jsx'; // <-- ADD THIS
import appLogo from './assets/aiRAD_logo.jpg'; // <-- ADD THIS LINE (and fix the path)
// import Groq from groq;
import BrandingModal from './components/modals/BrandingModal.jsx'; // Import new modal
import { runHuggingFacePrompt } from './api/huggingFaceTools.js';
import { handleAiKnowledgeSearchHF } from './api/huggingFaceTools.js';
import Fuse from 'fuse.js';
import LandingPage from './components/LandingPage';

// ... existing imports ...
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'; // Add this line

// --- Import Admin Components ---
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import RequireAdmin from './components/admin/RequireAdmin';
// Import the component
import BroadcastManager from './components/admin/BroadcastManager';

// --- DICOM Libraries via CDN (Required for the viewer) ---

const loadScript = (src, onLoad) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = onLoad;
  document.head.appendChild(script);
};

// --- Firebase Imports (unchanged from original code) ---
import { auth, db, appId } from './firebase.js'; // Assuming firebase.js is set up
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, serverTimestamp, onSnapshot, query, deleteDoc, doc, getDoc, getDocs, updateDoc, setDoc, where, orderBy, limit, increment } from "firebase/firestore";
import Auth from './auth.jsx'; // Your Auth component
import UserProfile from './components/UserProfile.jsx';

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
    <div className="flex flex-col h-full bg-muted/50 rounded-lg">
      {/* FIX: Changed h-full to flex-1 and added min-h-0 for proper scrolling */}
      <div className="p-4 flex-1 min-h-0 overflow-y-auto flex flex-col space-y-4 custom-scrollbar">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-2xl p-3.5 max-w-lg shadow-md backdrop-blur-sm text-sm leading-relaxed ${msg.sender === 'user'
              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-900/20 rounded-tr-sm'
              : 'bg-muted/80 border border-border/50 text-foreground rounded-tl-sm ring-1 ring-white/5'
              }`}>
              <p dangerouslySetInnerHTML={{ __html: (msg.text || '').replace(/\n/g, '<br />') }} />
            </div>
          </div>
        ))}
        {isReplying && (
          <div className="flex justify-start">
            <div className="rounded-lg p-3 bg-muted text-foreground">
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
      <div className="p-3 border-t border-border flex-shrink-0"> {/* Added flex-shrink-0 */}
        <div className="flex items-center space-x-2">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up..."
            className="w-full p-2 border border-border bg-background rounded-lg focus:ring-2 focus:ring-primary transition resize-none text-foreground placeholder:text-muted-foreground"
            rows="2"
            disabled={isReplying}
          />
          <button
            onClick={handleSend}
            disabled={isReplying || !userInput.trim()}
            className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
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


// --- REDESIGNED COMPONENT: SidePanel ---
const SidePanel = ({ title, icon: Icon, children }) => (
  <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden mb-4 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="bg-muted/40 px-3 py-2 border-b border-border/50 flex items-center backdrop-blur-md">
      {Icon && <Icon size={14} className="mr-2 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />}
      <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
        {title}
      </h2>
    </div>
    <div className="p-3 space-y-3">
      {children}
    </div>
  </div>
);


const MenuBar = ({ editor, voiceStatus, isDictationSupported, handleToggleListening, interimTranscript }) => {
  if (!editor) return null;

  const ToolbarGroup = ({ children, className = "" }) => (
    <div className={`flex items-center gap-1 p-1 bg-muted/30 rounded-xl border border-border/50 shadow-inner ${className}`}>
      {children}
    </div>
  );

  const ToolbarButton = ({ onClick, isActive, disabled, icon: Icon, title, activeClass = "bg-primary text-white" }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={`
        p-2 rounded-lg transition-all duration-200 flex items-center justify-center
        ${isActive
          ? `${activeClass} shadow-[0_0_12px_rgba(var(--primary),0.3)] scale-105 z-10`
          : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
        }
        ${disabled ? "opacity-20 cursor-not-allowed" : "cursor-pointer hover:scale-105 active:scale-95"}
      `}
    >
      <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
    </button>
  );

  const handleInsertTable = () => {
    editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run();
  };

  return (
    <div className="flex flex-col gap-2 p-2 bg-card/40 backdrop-blur-xl border-b border-border rounded-t-xl sticky top-0 z-30">
      {/* TOOLBAR ROW */}
      <div className="flex flex-wrap items-center gap-2">

        {/* GROUP 1: HISTORY */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            icon={History}
            title="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            icon={Redo2}
            title="Redo"
          />
        </ToolbarGroup>

        {/* GROUP 2: BASIC FORMATTING */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={Bold}
            title="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={Italic}
            title="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            icon={UnderlineIcon}
            title="Underline"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={Strikethrough}
            title="Strike"
          />
        </ToolbarGroup>

        {/* GROUP 2.5: FONT SIZE (NEW) */}
        <ToolbarGroup className="gap-0 px-1">
          <ToolbarButton
            onClick={() => {
              const currentSize = editor.getAttributes('textStyle').fontSize || '16px';
              const size = parseInt(currentSize);
              editor.chain().focus().setFontSize(`${Math.max(8, size - 2)}px`).run();
            }}
            icon={Minus}
            title="Decrease Font Size"
            activeClass="text-foreground"
          />
          <div className="px-2 min-w-[32px] text-center text-[10px] font-black text-primary select-none cursor-default">
            {parseInt(editor.getAttributes('textStyle').fontSize || '16')}
          </div>
          <ToolbarButton
            onClick={() => {
              const currentSize = editor.getAttributes('textStyle').fontSize || '16px';
              const size = parseInt(currentSize);
              editor.chain().focus().setFontSize(`${Math.min(72, size + 2)}px`).run();
            }}
            icon={Plus}
            title="Increase Font Size"
            activeClass="text-foreground"
          />
        </ToolbarGroup>

        {/* GROUP 3: SCRIPTS */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive("subscript")}
            icon={SubscriptIcon}
            title="Subscript"
            activeClass="bg-indigo-600 text-white"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive("superscript")}
            icon={SuperscriptIcon}
            title="Superscript"
            activeClass="bg-indigo-600 text-white"
          />
        </ToolbarGroup>

        {/* GROUP 4: ALIGNMENT */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            icon={AlignLeft}
            title="Align Left"
            activeClass="bg-emerald-600 text-white"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            icon={AlignCenter}
            title="Align Center"
            activeClass="bg-emerald-600 text-white"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            icon={AlignRight}
            title="Align Right"
            activeClass="bg-emerald-600 text-white"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            icon={AlignJustify}
            title="Align Justify"
            activeClass="bg-emerald-600 text-white"
          />
        </ToolbarGroup>

        {/* GROUP 5: STRUCTURE */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            icon={Heading1}
            title="Heading 1"
            activeClass="bg-amber-600 text-white"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            icon={Heading2}
            title="Heading 2"
            activeClass="bg-amber-600 text-white"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            icon={Heading3}
            title="Heading 3"
            activeClass="bg-amber-600 text-white"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={Quote}
            title="Blockquote"
            activeClass="bg-amber-600 text-white"
          />
        </ToolbarGroup>

        {/* GROUP 6: LISTS */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={List}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={ListOrdered}
            title="Ordered List"
          />
        </ToolbarGroup>

        {/* GROUP 7: UTILS */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            icon={Code}
            title="Code Block"
            activeClass="bg-violet-600 text-white"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon={Minus}
            title="Horizontal Rule"
          />
        </ToolbarGroup>

        {/* GROUP 8: LINKS & TABLES */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href;
              const url = window.prompt('URL', previousUrl);
              if (url === null) return;
              if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink().run();
                return;
              }
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }}
            isActive={editor.isActive("link")}
            icon={LinkIcon}
            title="Link"
          />
          <ToolbarButton
            onClick={handleInsertTable}
            isActive={editor.isActive("table")}
            icon={TableIcon}
            title="Table"
          />
        </ToolbarGroup>

        {/* VOICE CONTROLLER */}
        <div className="flex-1 min-w-[240px] flex items-center h-10 bg-muted/50 backdrop-blur-md rounded-xl border border-border shadow-inner px-1 ml-auto">
          <button
            onClick={handleToggleListening}
            disabled={!isDictationSupported}
            title={!isDictationSupported ? "Speech recognition not supported in this browser" : "Toggle Voice Assistant"}
            className={`
              flex items-center justify-center gap-2 h-8 px-4 rounded-lg font-black uppercase tracking-tighter text-[10px] transition-all duration-500
              ${!isDictationSupported
                ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                : voiceStatus === 'listening'
                  ? 'bg-destructive text-white animate-pulse-breathing shadow-[0_0_20px_rgba(var(--destructive),0.5)]'
                  : 'bg-primary/20 text-primary hover:bg-primary hover:text-white border border-primary/30'
              }
            `}
          >
            <Mic size={14} className={voiceStatus === 'listening' ? 'animate-bounce' : ''} />
            <span>{voiceStatus === 'listening' ? 'REC' : 'MIC'}</span>
          </button>

          <div className="flex-1 px-3 overflow-hidden">
            <div className="flex items-center gap-2 h-full">
              {voiceStatus === 'listening' && (
                <div className="flex gap-0.5">
                  <div className="w-1 h-3 bg-destructive rounded-full animate-pulse"></div>
                  <div className="w-1 h-3 bg-destructive rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-1 h-3 bg-destructive rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              )}
              <p className="text-[11px] font-bold text-foreground/80 tracking-tight italic truncate">
                {!isDictationSupported
                  ? 'Voice not supported...'
                  : interimTranscript || (voiceStatus === 'listening' ? 'Radiologist listening...' : 'Ready for dictation...')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- UNIFIED COMPONENT: AlertPanel (UNCHANGED) ---
const AlertPanel = ({ alertData, onAcknowledge, onInsertMacro, onPrepareNotification, onFix, onProceed, onInsertGuideline }) => {
  if (!alertData) return null;

  const isCritical = alertData.type === 'critical';
  const isFixable = alertData.type === 'inconsistency';
  const isMissingInfo = alertData.type === 'missing_info';
  const isGuideline = alertData.type === 'guideline';

  const config = {
    critical: {
      bgColor: 'bg-gradient-to-r from-red-900/90 to-red-950/90 backdrop-blur-md',
      borderColor: 'border-red-500/50',
      textColor: 'text-white',
      iconColor: 'text-red-200',
      Icon: AlertTriangle,
      message: 'Please review and take appropriate action immediately.',
    },
    inconsistency: {
      bgColor: 'bg-gradient-to-r from-yellow-900/90 to-yellow-950/90 backdrop-blur-md',
      borderColor: 'border-yellow-500/50',
      textColor: 'text-white',
      iconColor: 'text-yellow-200',
      Icon: AlertTriangle,
      title: 'Inconsistency Detected',
      message: alertData.message,
    },
    missing_info: {
      bgColor: 'bg-gradient-to-r from-orange-900/90 to-orange-950/90 backdrop-blur-md',
      borderColor: 'border-orange-500/50',
      textColor: 'text-white',
      iconColor: 'text-orange-200',
      Icon: AlertTriangle,
      title: 'Incomplete Report',
      message: alertData.message,
    },
    guideline: {
      bgColor: 'bg-gradient-to-r from-blue-900/90 to-blue-950/90 backdrop-blur-md',
      borderColor: 'border-blue-500/50',
      textColor: 'text-white',
      iconColor: 'text-blue-200',
      Icon: Lightbulb,
      title: 'AI Guideline Suggestion',
      message: alertData.message,
    },
  };

  const currentConfig = config[alertData.type];
  if (!currentConfig) return null;

  const title = isCritical
    ? `Critical Finding Detected: ${alertData.data?.findingName}`
    : currentConfig.title;

  return (
    <div className={`${currentConfig.bgColor} border-l-4 ${currentConfig.borderColor} ${currentConfig.textColor} p-4 rounded shadow-md mb-2 animate-in slide-in-from-top-2`} role="alert">
      <div className="flex items-start">
        <div className="py-1">
          <currentConfig.Icon className={`h-5 w-5 ${currentConfig.iconColor} mr-3`} />
        </div>
        <div className="flex-grow">
          <p className="font-bold text-sm">{title}</p>
          <p className="text-xs opacity-90 mt-1">{currentConfig.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {isCritical && (
              <>
                <button onClick={onInsertMacro} className="bg-red-700 text-white font-bold py-1 px-2 rounded text-xs hover:bg-red-600 transition border border-red-500">
                  Add to Report
                </button>
                <button onClick={onPrepareNotification} className="bg-red-800 text-white font-bold py-1 px-2 rounded text-xs hover:bg-red-700 transition border border-red-500">
                  Notify
                </button>
              </>
            )}
            {isFixable && (
              <button onClick={onFix} className="bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs hover:bg-yellow-600 transition border border-yellow-500">
                Fix Issue
              </button>
            )}
            {isGuideline && (
              <button onClick={onInsertGuideline} className="bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs hover:bg-blue-600 transition border border-blue-500">
                Apply Recommendation
              </button>
            )}
            {isMissingInfo && (
              <button onClick={onProceed} className="bg-orange-700 text-white font-bold py-1 px-2 rounded text-xs hover:bg-orange-600 transition border border-orange-500">
                Proceed Anyway
              </button>
            )}
            <button onClick={onAcknowledge} className="bg-black/30 text-white font-bold py-1 px-2 rounded text-xs hover:bg-black/50 transition">
              Dismiss
            </button>
          </div>
        </div>
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
    <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 backdrop-blur-sm shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center">
          <Zap size={14} className="mr-2" />AI Suggestions
        </h3>
        <button onClick={onClear} className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-white/10 rounded-full">
          <XCircle size={16} />
        </button>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
        {measurements.map((item, index) => (
          <div key={index} className="bg-card/50 border border-border/50 p-2.5 rounded-lg flex items-center justify-between shadow-sm group hover:border-primary/30 transition-all">
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-xs">{item.finding}</span>
              <span className="text-muted-foreground text-[10px] italic">{item.value}</span>
            </div>
            <button
              onClick={() => onInsert(item.finding, item.value)}
              className="bg-primary/20 text-primary font-black py-1.5 px-3 rounded-lg hover:bg-primary hover:text-white transition-all text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm active:scale-95"
            >
              <Plus size={12} strokeWidth={3} /> Insert
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};



// --- UPDATED COMPONENT: RecentReportsPanel ---
const RecentReportsPanel = ({ onSelectReport, user, onViewHistory }) => { // Added onViewHistory prop
  const [recentReports, setRecentReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Listen to the last 5 reports
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
        <p className="text-xs text-muted-foreground italic animate-pulse">Loading reports...</p>
      ) : recentReports.length > 0 ? (
        <div className="space-y-1.5">
          {recentReports.map(report => (
            <button
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="w-full text-left p-2.5 bg-card/50 hover:bg-muted rounded-xl border border-border/50 hover:border-primary/30 transition-all group"
            >
              <p className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">{report.patientName}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{report.examDate}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">No recent reports found.</p>
      )}

      {/* --- NEW BUTTON: View All History --- */}
      <button
        onClick={onViewHistory}
        className="w-full mt-4 py-2.5 px-3 bg-primary/10 hover:bg-primary text-primary hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-primary/20 hover:border-primary transition-all flex items-center justify-center gap-2 group active:scale-95 shadow-sm"
      >
        <History size={12} className="group-hover:rotate-12 transition-transform" />
        View All History
      </button>
    </CollapsibleSidePanel>
  );
};

// const fetchRecentReports = async (userId) => {
//     if (!userId) return;
//     try {
//       // Path: /users/{userId}/reports
//       const q = query(
//         collection(db, 'users', userId, 'reports'),
//         orderBy('createdAt', 'desc'),
//         limit(10)
//       );
//       const querySnapshot = await getDocs(q);
//       const reports = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setSavedReports(reports);
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//     }
//   };
// --- NEW COMPONENT: ReportHistoryModal ---
const ReportHistoryModal = ({ isOpen, onClose, onSelectReport, user }) => {
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch ALL reports when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      // Limit set to 50 for performance, increase if needed
      const q = query(collection(db, "users", user.uid, "reports"), orderBy("createdAt", "desc"), limit(50));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reportsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllReports(reportsData);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-black uppercase tracking-tighter text-foreground flex items-center gap-3">
            <History className="text-primary" size={24} />
            Full Report History
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-all">
            <XCircle size={24} />
          </button>
        </div>

        {/* Modal List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Accessing records...</p>
            </div>
          ) : allReports.length === 0 ? (
            <div className="text-center text-muted-foreground py-20 italic">No reports found in history.</div>
          ) : (
            <div className="grid gap-3">
              {allReports.map((report) => (
                <div key={report.id} className="bg-muted/30 p-4 rounded-2xl border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all flex justify-between items-center group shadow-sm">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-black text-sm tracking-tight">{report.patientName}</span>
                      <span className="text-[10px] text-primary-foreground bg-primary/80 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                        {report.examDate}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground flex gap-2 uppercase tracking-tight">
                      <span>ID: {report.id}</span>
                      <span>•</span>
                      <span>Created: {report.createdAt?.seconds ? new Date(report.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { onSelectReport(report); onClose(); }}
                    className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all border border-primary/20 hover:border-primary active:scale-95 shadow-sm"
                  >
                    Load Report
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-border bg-muted/40 text-right flex justify-between items-center rounded-b-2xl">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Total {allReports.length} reports indexed
          </span>
          <button onClick={onClose} className="px-6 py-2.5 bg-card hover:bg-muted text-foreground text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-border hover:border-primary active:scale-95 shadow-sm">Close</button>
        </div>
      </div>
    </div>
  );
};




// --- MODAL COMPONENTS (Styling adjusted for dark mode, but otherwise unchanged) ---

const ShortcutsHelpModal = ({ shortcuts, onClose }) => {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifierKey = isMac ? '⌘' : 'Ctrl';
  const altKey = isMac ? '⌥' : 'Alt';
  const renderKey = (key) => <kbd className="px-2 py-1.5 text-xs font-semibold text-foreground bg-muted border border-border rounded-md">{key}</kbd>;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0f1c]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-indigo-500/10 w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5 rounded-t-2xl">
          <h3 className="text-lg font-bold text-slate-100 flex items-center"><Zap size={18} className="mr-3 text-indigo-400" />Keyboard Shortcuts</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><XCircle /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(shortcuts).map(([action, config]) => (
              <div key={action} className="flex justify-between items-center">
                <span className="text-slate-300">{config.label}</span>
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
    <div className="p-4 bg-muted/50 rounded-lg h-full flex flex-col">
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
            <h4 className="flex items-center"><BookOpen size={16} className="mr-2" />Sources</h4>
            <ul>
              {result.sources.map((source, index) => (
                <li key={index}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.name} <LinkIcon size={12} className="inline-block ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <button
          onClick={() => {
            const contentToInsert = `
              <h4>Summary</h4>
              ${result.summary}
              <h4>Key Imaging Features</h4>
              <ul>${result.keyImagingFeatures.join('')}</ul>
            `;
            onInsert(contentToInsert);
          }}
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
    <div className="bg-muted/50 rounded-lg border border-border/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 bg-muted/50 hover:bg-muted rounded transition-colors focus:outline-none"
      >
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
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
        <div className="p-4 border-t border-border/50">
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
          const fileToLoad = image.file || new File([await (await fetch(image.src)).blob()], image.name || 'image.png', { type: image.type || 'image/png' });
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



        try {
          const viewport = cornerstone.getViewport(element);
          if (viewport) {
            viewport.overlay = false; // Disable general overlay
            cornerstone.setViewport(element, viewport);
            console.log("ImageViewer: Disabled viewport overlays.");
          } else {
            console.warn("ImageViewer: Could not get viewport to disable overlays.");
          }
        } catch (viewportError) {
          console.error("ImageViewer: Error disabling overlays:", viewportError);
        }

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

            }
          });
          resizeObserver.observe(element);
          console.log("ImageViewer: ResizeObserver attached.");

        } else {

          console.warn("ImageViewer: ResizeObserver not supported, falling back to manual resize.");
          cornerstone.resize(element, true);

        }

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
    <div className={`relative w-full border border-border rounded-lg bg-background overflow-hidden ${className || 'h-[500px]'}`}>
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
          <AlertTriangle size={24} className="mr-2 inline-block" />
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
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4">
      {/* Main modal container */}
      <div className="relative bg-[#0a0f1c]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-indigo-500/10 w-full max-w-4xl max-h-[90vh] flex flex-col p-3 sm:p-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-2 text-slate-100 gap-3 flex-shrink-0">
          <div className="flex-grow min-w-0">
            <h3 className="text-base sm:text-lg font-bold truncate flex items-center gap-2">
              <ImageIcon size={20} className="text-indigo-400" />
              <span className="hidden sm:inline">Image </span>{currentIndex + 1}/{images.length} - {currentImage.name}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white flex-shrink-0 p-1 transition-colors">
            <XCircle size={24} sm:size={28} />
          </button>
        </div>

        {/* Image display area */}
        <div className="flex-grow relative min-h-0 overflow-hidden rounded-lg bg-background border border-border/50">
          {isDicom(currentImage) ? (
            <div className="absolute inset-0">
              <ImageViewer image={currentImage} isDicomLoaded={isDicomLoaded} />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-1">
              <img
                src={getRasterSrc(currentImage)}
                alt={currentImage?.name || `Image ${currentIndex + 1}`}
                className="block max-w-full max-h-full object-contain"
                draggable={false}
              />
            </div>
          )}
        </div>

      </div>

      {/* Navigation Buttons */}
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 sm:p-3 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all backdrop-blur-md"
      >
        <ChevronLeft size={24} sm:size={32} />
      </button>
      <button
        onClick={onNext}
        disabled={currentIndex >= images.length - 1}
        className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 sm:p-3 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all backdrop-blur-md"
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

// --- Settings Modal Component ---
const SettingsModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    address: '',
    contact: '',
    logo: ''
  });
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user && isOpen) {
      const loadSettings = async () => {
        try {
          // Path: /users/{userId}/settings/hospital
          const docRef = doc(db, 'users', user.uid, 'settings', 'hospital');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data());
          } else {
            // Default values
            setFormData({
              name: 'City General Hospital',
              department: 'Department of Radiology',
              address: '123 Medical Center Blvd, Metroville, ST 12345',
              contact: 'Phone: (555) 123-4567 | Fax: (555) 123-4568',
              logo: ''
            });
          }
        } catch (error) {
          console.error("Error loading settings:", error);
        }
      };
      loadSettings();
    }
  }, [user, isOpen]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) { // Limit to ~500KB
        alert("Image is too large. Please upload a smaller logo (under 500KB).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Path: /users/{userId}/settings/hospital
      const docRef = doc(db, 'users', user.uid, 'settings', 'hospital');
      await setDoc(docRef, formData);
      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#0a0f1c]/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl shadow-indigo-500/10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 rounded-t-2xl">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            Hospital Profile
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Hospital / Center Name</label>
            <input type="text" className="w-full p-2 border border-slate-700 bg-muted/40 text-foreground rounded-lg outline-none focus:border-primary transition-colors placeholder:text-muted-foreground" placeholder="e.g. City General Hospital" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Department</label>
            <input type="text" className="w-full p-2 border border-slate-700 bg-muted/40 text-foreground rounded-lg outline-none focus:border-primary transition-colors placeholder:text-muted-foreground" placeholder="e.g. Department of Radiology" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Address</label>
            <textarea className="w-full p-2 border border-slate-700 bg-black/40 text-slate-200 rounded-lg h-20 resize-none outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600" placeholder="e.g. 123 Main St..." value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Contact Info</label>
            <input type="text" className="w-full p-2 border border-slate-700 bg-muted/40 text-foreground rounded-lg outline-none focus:border-primary transition-colors placeholder:text-muted-foreground" placeholder="e.g. Phone: (555) 123-4567" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Logo</label>
            <div className="flex items-center gap-4">
              <div onClick={() => fileInputRef.current?.click()} className="w-20 h-20 border-2 border-dashed border-slate-600 bg-black/20 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden hover:bg-white/5 transition-colors">
                {formData.logo ? <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" /> : <Upload className="w-6 h-6 text-slate-500" />}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="text-sm text-indigo-400 font-medium hover:text-indigo-300">Upload New Logo</button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-black/20 rounded-b-2xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-500 disabled:opacity-50 shadow-lg shadow-indigo-900/20">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      </div>
    </div>
  );
};


const MainApp = () => {
  const navigate = useNavigate(); // <--- ADD THIS LINE
  const { theme, setTheme } = useTheme(); // <--- ADD THIS LINE
  // --- ALL STATE AND LOGIC  ---
  // --- NEW STATE for UI ---
  const [activeAiTab, setActiveAiTab] = useState('copilot'); // 'copilot', 'search', 'knowledge'

  const [isOnline, setIsOnline] = useState(navigator.onLine); // <== New State


  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // --- AUTHENTICATION STATE ---
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('basic'); // Add userRole state
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isRestricted, setIsRestricted] = useState(false); // Freemium restriction state
  const [isSidebarOpen, setSidebarOpen] = useState(true); // <--- Defined here


  // --- ALL OTHER APP STATE ---
  // --- REPORT DATA STATE (Initialized from LocalStorage) ---
  const [patientName, setPatientName] = useState('Patient Name');
  const [patientId, setPatientId] = useState('P00000000');
  const [patientAge, setPatientAge] = useState('Age');
  const [patientGender, setPatientGender] = useState('Male');
  const [referringPhysician, setReferringPhysician] = useState('Dr. XYZ');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [modality, setModality] = useState('Ultrasound');
  const [template, setTemplate] = useState('Abdomen');

  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userFindings, setUserFindings] = useState('');
  const [generatedReport, setGeneratedReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // --- UI STATE ---
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
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  // const [isWakeWordMode, setIsWakeWordMode] = useState(false); 

  // 1. ADD THIS NEW STATE to the App component (near other states)
  const [assistantMode, setAssistantMode] = useState('correction'); // 'correction', 'template', 'simplify', 'rephrase'
  const [rephraseStyle, setRephraseStyle] = useState('standard'); // 'standard', 'concise', 'verbose'

  const [isDownloading, setIsDownloading] = useState(false);

  const [modalIndex, setModalIndex] = useState(null);

  // --- NEW BRANDING STATES ---
  const [showBrandingModal, setShowBrandingModal] = useState(false);
  const [letterheadUrl, setLetterheadUrl] = useState(null);
  const [watermarkUrl, setWatermarkUrl] = useState(null);

  const showNext = () => setModalIndex((prev) => Math.min(prev + 1, images.length - 1));
  const showPrev = () => setModalIndex((prev) => Math.max(prev - 1, 0));

  // --- NEW: Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  const [showSettings, setShowSettings] = useState(false); // <--- Add this


  // Hospital Settings State
  const [hospitalSettings, setHospitalSettings] = useState({
    name: 'City General Hospital',
    department: 'Department of Radiology',
    address: '123 Medical Center Blvd, Metroville, ST 12345',
    contact: 'Phone: (555) 123-4567 | Fax: (555) 123-4568',
    logo: 'Add your logo in the settings and this is text is default please change accordingly.'
  });


  const [savedReports, setSavedReports] = useState([]);
  const [reportContent, setReportContent] = useState('');

  const [templateSearchTerm, setTemplateSearchTerm] = useState(''); // <--- New State for Template Search



  const [systemAnnouncement, setSystemAnnouncement] = useState(null);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true); // Control visibility

  // --- ALL REFS ---
  const debounceTimeoutRef = useRef(null);
  const inconsistencyCheckTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);
  const searchButtonRef = useRef(null);
  const dataExtractTimeoutRef = useRef(null);
  const proactiveAnalysisTimeoutRef = useRef(null);
  const localSearchInputRef = useRef(null);
  const searchResultsRef = useRef();
  const isProgrammaticUpdate = useRef(false);
  const macrosRef = useRef(macros);


  //Broadcasting App News to Users
  useEffect(() => {
    // Listen for the most recent active announcement
    const q = query(
      collection(db, 'system_announcements'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setSystemAnnouncement(snapshot.docs[0].data());
      } else {
        setSystemAnnouncement(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- ONLINE/OFFLINE DETECTION ---
  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); toast.success("Back Online!"); };
    const handleOffline = () => { setIsOnline(false); toast('You are offline. Changes are saved locally.', { icon: '⚠️' }); };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // --- AUTOSAVE & LOAD FORM DATA (USER SCOPED) ---
  // Load user-specific draft when user changes
  useEffect(() => {
    if (user?.uid) {
      const prefix = `draft_${user.uid}_`;
      setPatientName(localStorage.getItem(`${prefix}patientName`) || 'Patient Name');
      setPatientId(localStorage.getItem(`${prefix}patientId`) || 'P00000000');
      setPatientAge(localStorage.getItem(`${prefix}patientAge`) || 'Age');
      setPatientGender(localStorage.getItem(`${prefix}patientGender`) || 'Male');
      setReferringPhysician(localStorage.getItem(`${prefix}referringPhysician`) || 'Dr. XYZ');
      setExamDate(localStorage.getItem(`${prefix}examDate`) || new Date().toISOString().split('T')[0]);
      setModality(localStorage.getItem(`${prefix}modality`) || 'Ultrasound');
      setTemplate(localStorage.getItem(`${prefix}template`) || 'Abdomen');
      setUserFindings(localStorage.getItem(`${prefix}userFindings`) || '');
    } else {
      // Clear or reset to defaults if no user
      setPatientName('Patient Name');
      setPatientId('P00000000');
      setPatientAge('Age');
      setPatientGender('Male');
      setReferringPhysician('Dr. XYZ');
      setExamDate(new Date().toISOString().split('T')[0]);
      setModality('Ultrasound');
      setTemplate('Abdomen');
      setUserFindings('');
    }
  }, [user?.uid]);

  // Saves form fields whenever they change (User Scoped)
  useEffect(() => {
    if (user?.uid) {
      const prefix = `draft_${user.uid}_`;
      localStorage.setItem(`${prefix}patientName`, patientName);
      localStorage.setItem(`${prefix}patientId`, patientId);
      localStorage.setItem(`${prefix}patientAge`, patientAge);
      localStorage.setItem(`${prefix}patientGender`, patientGender);
      localStorage.setItem(`${prefix}referringPhysician`, referringPhysician);
      localStorage.setItem(`${prefix}examDate`, examDate);
      localStorage.setItem(`${prefix}modality`, modality);
      localStorage.setItem(`${prefix}template`, template);
      localStorage.setItem(`${prefix}userFindings`, userFindings);
    }
  }, [user?.uid, patientName, patientId, patientAge, patientGender, referringPhysician, examDate, modality, template, userFindings]);

  useEffect(() => {
    macrosRef.current = macros;
  }, [macros]);
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


  // Helper to load html2pdf dynamically
  const loadHtml2Pdf = () => {
    return new Promise((resolve, reject) => {
      if (window.html2pdf) {
        resolve(window.html2pdf);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => resolve(window.html2pdf);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };
  const handleDownloadPDF = async () => {
    // 1. Check if editor exists and has content
    if (!editor) return;

    const contentHTML = editor.getHTML();
    const textContent = editor.getText();

    // 2. Optional: Warn if empty but allow proceeding
    if (!textContent.trim()) {
      const confirmEmpty = window.confirm("The report body appears empty. Do you want to download the template with just the header and footer?");
      if (!confirmEmpty) {
        return;
      }
    }

    setIsDownloading(true); // Ensure you have this state, or remove if not used
    try {
      // Helper to load html2pdf if not already loaded
      const loadHtml2Pdf = () => {
        return new Promise((resolve, reject) => {
          if (window.html2pdf) {
            resolve(window.html2pdf);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = () => resolve(window.html2pdf);
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      const html2pdf = await loadHtml2Pdf();

      const element = document.createElement('div');
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // 3. Get Settings with Fallbacks
      const hName = hospitalSettings?.name || 'City General Hospital';
      const hDept = hospitalSettings?.department || 'Department of Radiology';
      const hAddr = hospitalSettings?.address || '123 Medical Center Blvd, Metroville, ST 12345';
      const hContact = hospitalSettings?.contact || 'Phone: (555) 123-4567';
      const logoHtml = hospitalSettings?.logo
        ? `<img src="${hospitalSettings.logo}" alt="Logo" style="height: 60px; max-width: 150px; object-fit: contain; margin-bottom: 10px;" />`
        : '';

      // 4. Construct the PDF HTML (Letterhead + Content)
      element.innerHTML = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937; line-height: 1.5; padding: 20px;">
          
          <!-- Hospital Letterhead Header -->
          <div style="border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="flex: 1;">
              ${logoHtml}
              <h1 style="margin: 0; color: #1e3a8a; font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">${hName}</h1>
              <p style="margin: 5px 0 0; color: #4b5563; font-size: 14px; font-weight: 600;">${hDept}</p>
              <p style="margin: 2px 0 0; color: #6b7280; font-size: 12px; max-width: 300px;">${hAddr}</p>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">${hContact}</p>
            </div>
            <div style="text-align: right;">
              <div style="background-color: #2563eb; color: white; padding: 6px 16px; border-radius: 4px; display: inline-block; font-weight: bold; font-size: 14px; margin-bottom: 8px;">RADIOLOGY REPORT</div>
              <p style="margin: 0; font-size: 12px; color: #6b7280;"><strong>Report Status:</strong> Final</p>
              <p style="margin: 0; font-size: 12px; color: #6b7280;"><strong>Generated:</strong> ${date}</p>
            </div>
          </div>

          <!-- Patient Demographics Block (Static Placeholder - Connect to real state if available) -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding-bottom: 8px; width: 50%;"><strong style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Patient Name</strong> <span style="font-size: 15px; font-weight: 600; color: #1e293b;">Doe, John A.</span></td>
                <td style="padding-bottom: 8px; width: 50%;"><strong style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Medical Record Number</strong> <span style="font-size: 15px; font-weight: 600; color: #1e293b;">8492015</span></td>
              </tr>
              <tr>
                <td style="padding-top: 8px; width: 50%;"><strong style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Date of Birth</strong> <span style="font-size: 15px; font-weight: 600; color: #1e293b;">01/15/1980 (45y M)</span></td>
                <td style="padding-top: 8px; width: 50%;"><strong style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Exam Date</strong> <span style="font-size: 15px; font-weight: 600; color: #1e293b;">${date}</span></td>
              </tr>
            </table>
          </div>

          <!-- Report Content Body -->
          <div style="margin-bottom: 40px; font-size: 12pt; text-align: left; color: #374151;">
            <h2 style="font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; color: #1e3a8a; margin-bottom: 20px; font-weight: 700;">Findings & Impression</h2>
            ${contentHTML}
          </div>

          <!-- Signature Footer -->
          <div style="margin-top: 60px; padding-top: 25px; border-top: 2px solid #e2e8f0; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
              <div>
                <p style="margin: 0 0 8px; font-weight: bold; color: #1f2937; font-size: 14px;">Electronically Signed by:</p>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 18px; color: #2563eb; margin-bottom: 4px;">/s/ </div>
                <p style="margin: 0; font-size: 13px; color: #4b5563; font-weight: 500;">Certified Radiologist</p>
              </div>
              <div style="text-align: right;">
                 <!-- QR Code or Stamp placeholder -->
                 <div style="width: 60px; height: 60px; background-color: #f0f0f0; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999;">STAMP</div>
              </div>
            </div>
            
            <p style="margin-top: 30px; font-size: 10px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 10px;">
              This report was generated using <strong>aiRAD</strong>.
            </p>
          </div>
        </div>
      `;

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `Report_${date.replace(/,/g, '').replace(/ /g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

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


  // --- DEBOUNCED CHECKS FOR EDITOR ---

  const handleAiKnowledgeSearch = async (isProactive = false, queryOverride = '') => {
    if (isRestricted) {
      toast.error("Please upgrade to a professional plan to use AI knowledge search.");
      return;
    }
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

  // --- UPDATED handleAiKnowledgeSearch using Hugging Face (Gemma 3) ---
  // const handleAiKnowledgeSearch = async (isProactive = false, queryOverride = '') => {
  //     // if (isRestricted) {
  //     //     toast.error("Please upgrade to a professional plan to use AI knowledge search.");
  //     //     return;
  //     // }

  //     // --- ADD THIS BLOCK ---
  //     const allowed = await checkAndConsumeQuota("Knowledge Lookup");
  //     if (!allowed) return;

  //     const query = isProactive ? queryOverride : baseSearchQuery;
  //     if (!query) {
  //         setError("Please enter a search term first.");
  //         return;
  //     }
  //     setIsSearching(true);
  //     setError(null);

  //     // Clear other search results
  //     setAllAiSearchResults([]);
  //     setAllAiFullReports([]);
  //     setLocalSearchResults([]);

  //     // 1. Construct a strict prompt for JSON output
  //     const prompt = `
  //       You are a medical AI assistant. 
  //       Task: Provide a knowledge lookup on: "${query}".

  //       Rules:
  //       1. Use authoritative sources (Radiopaedia, StatPearls).
  //       2. Output MUST be a valid, parseable JSON object.
  //       3. Do NOT wrap the JSON in markdown code blocks like \`\`\`json. Just the raw JSON string.
  //       4. Follow this EXACT schema:
  //       {
  //         "queryType": "knowledgeLookup",
  //         "conditionName": "Condition Name",
  //         "summary": "Brief HTML-formatted explanation of pathophysiology and clinical significance.",
  //         "keyImagingFeatures": ["Feature 1", "Feature 2"],
  //         "differentialDiagnosis": ["Differential 1", "Differential 2"],
  //         "sources": [{ "name": "Source Name", "url": "URL if known" }]
  //       }
  //     `;

  //     try {
  //         // 2. Call Hugging Face API
  //         // Note: Ensure runHuggingFacePrompt is imported from your api file
  //         const textResult = await runHuggingFacePrompt(prompt);

  //         if (!textResult) throw new Error("No response from AI.");

  //         // 3. Clean up the response (remove potential markdown fences)
  //         const cleanedText = textResult
  //           .replace(/^```json\s*/i, '') // Remove starting ```json
  //           .replace(/^```\s*/i, '')     // Remove starting ```
  //           .replace(/\s*```$/i, '')     // Remove ending ```
  //           .trim();

  //         // 4. Parse JSON
  //         try {
  //             const parsedResult = JSON.parse(cleanedText);

  //             if (parsedResult.queryType === 'knowledgeLookup' || parsedResult.conditionName) {
  //                 // Fallback: If queryType is missing but structure looks right, accept it
  //                 parsedResult.queryType = 'knowledgeLookup'; 
  //                 setAiKnowledgeLookupResult(parsedResult);
  //             } else {
  //                 setError("The AI returned an unexpected response format.");
  //                 console.warn("Unexpected JSON structure:", parsedResult);
  //             }
  //         } catch (jsonError) {
  //             console.error("JSON Parsing Error:", jsonError, "Raw Text:", textResult);
  //             setError("The AI response could not be parsed as valid data. Please try again.");
  //         }

  //     } catch (err) {
  //         setError("Failed to perform knowledge search. " + err.message);
  //     } finally {
  //         setIsSearching(false);
  //     }
  // };

  /// --- UPDATED GUARDIAN AGENT (Removed strict Javascript Regex) ---
  const runEditorGuardianAgent = useCallback(async (editorText) => {
    // We do NOT split findings/impression here via Regex anymore.
    // We send the whole text to the AI and let it figure out the sections.

    const prompt = `
      You are a Senior Quality Assurance Radiologist. Your job is to prevent medical errors in radiology reports.
      
      Analyze the text below. It contains a "FINDINGS" section (observations) and an "IMPRESSION" section (conclusions).
      
      Input Text:
      ---
      ${editorText}
      ---
      
      **CRITICAL ANALYSIS PROTOCOL:**
      1. **Consistency Check (The "Safety Net"):**
         - Compare FINDINGS vs. IMPRESSION.
         - **Laterality Check:** If FINDINGS say "Right kidney cyst" but IMPRESSION says "Left" or just "renal cyst" (ambiguous), flag it immediately.
         - **Measurement Check:** If FINDINGS say "5mm nodule" but IMPRESSION says "5cm mass", flag the discrepancy.Or 
         - Example Error: "Spleen is normal in size 15.1cm". (Correction: Spleen is enlarged/splenomegaly).
           - Example Error: "Aorta is normal measuring 5.5cm". (Correction: Aneurysmal).
         - **Omission Check:** If a "mass", "fracture", "thrombosis", or "acute" condition is in FINDINGS but missing from IMPRESSION, flag it.
      
      2. **Critical Finding Detection (The "Red Flag"):**
         - Identify actionable/emergent findings (e.g., Pneumothorax, Aortic Dissection, Free Air, Acute Appendicitis, Intracranial Hemorrhage).
      
      3. **Guideline Adherence (The "Consultant"):**
         - If specific pathology is noted (e.g., Thyroid Nodule, Pulmonary Nodule, Adnexal Cyst, Renal Cyst), suggest the relevant guideline (TI-RADS, Fleischner, O-RADS, Bosniak).
      
      You MUST respond with a single, valid JSON object:
      {
        "criticalFinding": {
          "findingName": "string (e.g., 'Right Tension Pneumothorax')",
          "reportMacro": "string (Standardized phrasing: 'CRITICAL FINDING: Large right tension pneumothorax...')",
          "notificationTemplate": "string (SMS/Pager format: 'URGENT: Pt [ID] has ...')"
        } | null,
        "inconsistency": {
          "message": "string (e.g., 'Lateral Discrepancy: Findings mention RIGHT kidney, Impression mentions LEFT.')",
          "suggestedCorrection": "string (The text to fix the error)"
        } | null,
        "guidelineSuggestion": {
          "finding": "string (e.g. '1.2cm solid thyroid nodule')",
          "guidelineName": "string (e.g. 'ACR TI-RADS')",
          "recommendationText": "string (e.g. 'TI-RADS 4. Recommendation: FNA if > 1.5cm...')"
        } | null,
        "knowledgeLookupQuery": "string" | null,
        "structuredData": { "Key": "Value" } | null
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
      if (!response.ok) return;

      const result = await response.json();
      const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;
      if (!textResult) return;

      const parsed = JSON.parse(textResult);

      // Process Response
      if (parsed.structuredData && !isRestricted) setStructuredData(parsed.structuredData);
      if (parsed.knowledgeLookupQuery && !isRestricted) {
        setBaseSearchQuery(parsed.knowledgeLookupQuery);
        // Optional: Auto-trigger search? Maybe too distracting.
      }

      // Handle Alerts (Priority: Critical > Inconsistency > Guideline)
      if (awaitingRef.current) return; // Don't overwrite existing alert

      if (parsed.criticalFinding) {
        setActiveAlert({ type: 'critical', data: parsed.criticalFinding });
        setIsAwaitingAlertAcknowledge(true);

      } else if (parsed.inconsistency) {
        setActiveAlert({ type: 'inconsistency', message: parsed.inconsistency.message });
        setCorrectionSuggestion(parsed.inconsistency.suggestedCorrection);
        setIsAwaitingAlertAcknowledge(true);

      } else if (parsed.guidelineSuggestion && !isRestricted) {
        setActiveAlert({
          type: 'guideline',
          message: `Finding: ${parsed.guidelineSuggestion.finding} (${parsed.guidelineSuggestion.guidelineName})`,
          data: { recommendationText: parsed.guidelineSuggestion.recommendationText }
        });
        setIsAwaitingAlertAcknowledge(true);
      }

    } catch (err) {
      console.error("Guardian Agent failed:", err);
    }
  }, [isRestricted]);


  // --- DEBOUNCED CHECKS FOR EDITOR ---

  const debouncedGuardianCheck = useCallback((text) => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      if (text.trim().length > 20) {
        runEditorGuardianAgent(text);
      } else {
        setStructuredData({});
        if (!awaitingRef.current) {
          setActiveAlert(null);
          setCorrectionSuggestion(null);
        }
      }
    }, 2000); // 2 second debounce to allow typing to finish
  }, [runEditorGuardianAgent]);

  const handleEditorUpdate = useCallback(({ editor }) => {
    if (isProgrammaticUpdate.current) {
      isProgrammaticUpdate.current = false;
      return;
    }
    const text = editor.getText();
    const html = editor.getHTML();
    setEditorContent(html);
    debouncedGuardianCheck(text);
  }, [debouncedGuardianCheck]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable any potential defaults to avoid duplicate warnings
        // if using a version of StarterKit that might include them
        codeBlock: false, // We use a customized version or separate extension
      }),
      UnderlineExtension,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      FontSize,
      Placeholder.configure({
        placeholder: 'Start dictating or paste findings here…',
        emptyEditorClass: 'is-editor-empty',
      }),
      TableExtension.configure({
        resizable: true,
        lastColumnResizable: false,
      }),
      TableRowExtension,
      TableHeaderExtension,
      TableCellExtension,
    ],
    content: userFindings, // Loads from localStorage initial state
    onUpdate: ({ editor }) => {
      if (isProgrammaticUpdate.current) {
        isProgrammaticUpdate.current = false;
        return;
      }
      const html = editor.getHTML();
      setUserFindings(html);

      // === CRITICAL: Save to LocalStorage on every keystroke ===
      localStorage.setItem('draft_userFindings', html);
    },
  });

  const handleInsertTemplate = useCallback((content) => {
    if (editor) {
      editor.chain().focus().insertContent(content).run();
      setEditorContent(editor.getHTML());
      toast.success("Template inserted!");
      setShowTemplateModal(false);
    }
  }, [editor]);


  useEffect(() => {
    if (editor && editorContent && editor.getHTML() !== editorContent) {
      isProgrammaticUpdate.current = true;
      editor.commands.setContent(editorContent, false);
    }
  }, [editorContent, editor]);


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
        toast.error("Could not apply measurements. Check console logs or if values already match.", { duration: 4000 }); // Updated toast
      }
    }
  };


  // --- AUTHENTICATION LISTENER & FREEMIUM CHECK ---
  useEffect(() => {
    let databaseUnsubscribe = null; // This will hold our database listener

    // This first listener only watches for LOGIN or LOGOUT
    const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsAuthLoading(true);
      setUser(currentUser); // Set the user object

      // Fetch basic profile to have it available in the app
      if (currentUser) {
        const fetchProfile = async () => {
          try {
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserProfile(data);
            }
          } catch (err) {
            console.error("Error fetching background profile", err);
          }
        }
        fetchProfile();
      } else {
        setUserProfile(null);
      }

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
            // --- NEW: FETCH BRANDING ---
            if (userData.letterheadUrl) setLetterheadUrl(userData.letterheadUrl);
            if (userData.watermarkUrl) setWatermarkUrl(userData.watermarkUrl);

            if (userRole === 'basic') {
              // Check for report limits (your existing logic)
              const reportLimit = 5;
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

  // Fetch Reports & Settings (Dependent on User)
  useEffect(() => {
    if (user && user.uid) {
      fetchRecentReports(user.uid);
      fetchSettings(user.uid);
    }
  }, [user]);

  // --- NEW HELPER: Metered Usage Check ---
  const checkAndConsumeQuota = async (featureName) => {
    // 1. Pro users have unlimited access
    if (userRole !== 'basic') return true;

    // 2. Check if already restricted (Limit Reached)
    if (isRestricted) {
      toast.error(`Free limit reached. Upgrade to Pro to use ${featureName}.`, { icon: '🔒' });
      return false;
    }

    // 3. Increment the counter in Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        reportCount: increment(1), // Counts this action as 1 unit of usage
        lastReportDate: serverTimestamp()
      });
      return true; // Usage approved
    } catch (error) {
      console.error("Quota update error:", error);
      toast.error("Error verifying usage quota.");
      return false;
    }
  };


  const fetchSettings = async (userId) => {
    if (!userId) return;
    try {
      // Path: /users/{userId}/settings/hospital
      const docRef = doc(db, 'users', userId, 'settings', 'hospital');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHospitalSettings(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchRecentReports = async (userId) => {
    if (!userId) return;
    try {
      // Path: /users/{userId}/reports
      const q = query(
        collection(db, 'users', userId, 'reports'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedReports(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };
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


  const fileToImageObject = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        const base64 = result.split(',')[1];
        const src = URL.createObjectURL(file);
        resolve({ src, base64, name: file.name, type: file.type, file });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // --- PASTE EVENT HANDLER ---
  useEffect(() => {
    const handlePaste = async (e) => {
      // Access clipboard data
      const items = e.clipboardData?.items;
      if (!items) return;

      const files = [];
      for (let i = 0; i < items.length; i++) {
        // Accept images or PDF files
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
            files.push(file);
          }
        }
      }

      // If we found valid files, handle them and STOP the editor from seeing the paste
      if (files.length > 0) {
        e.preventDefault(); // Stop default browser paste
        e.stopPropagation(); // Stop event from bubbling

        toast.loading("Processing pasted files...");
        try {
          const newImageObjects = await Promise.all(files.map(file => fileToImageObject(file)));
          setImages(prev => [...prev, ...newImageObjects]);
          if (newImageObjects.length > 0 && !selectedImage) {
            setSelectedImage(newImageObjects[0]);
          }
          toast.dismiss();
          toast.success("Files pasted successfully!");
        } catch (error) {
          console.error("Paste processing error:", error);
          toast.dismiss();
          toast.error("Failed to process pasted files.");
        }
      }
    };

    // *** CRITICAL FIX: Pass 'true' as the third argument ***
    // This enables 'useCapture', catching the event BEFORE the Tiptap editor does.
    window.addEventListener('paste', handlePaste, true);

    return () => window.removeEventListener('paste', handlePaste, true);
  }, [selectedImage]);


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



  //    const analyzeImages = async () => {
  //        if (isRestricted) {
  //       toast.error("Please upgrade to Pro for AI image analysis.");
  //       return; // Stop the function
  //     }

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
  //        if (parsedResult.analysisSuccessful) {
  //           if (parsedResult.analysisReport) { // Check if the key exists
  //             // THIS IS THE FIX: Set editor directly, then set state
  //             isProgrammaticUpdate.current = true;
  //             if (editor) editor.commands.setContent(parsedResult.analysisReport);
  //             setEditorContent(parsedResult.analysisReport);
  //             console.log('%c AI ANALYSIS:', 'color: green; font-weight: bold;', 'Setting editor content.');
  //             toastDone('AI analysis complete');
  //           }

  //           if (parsedResult.measurements) {
  //             setAiMeasurements(parsedResult.measurements);
  //           }
  //           const openingMessage = {
  //             sender: 'ai',
  //             text: 'Analysis complete. The report has been drafted. Ask any follow-up questions.'
  //           };
  //           setConversationHistory([openingMessage]);
  //           setIsConversationActive(true);
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
  // --- NEW HELPER: Process images for Gemini API ---
  const processImagesForGemini = async (imagesToProcess) => {
    const processedParts = [];
    for (const image of imagesToProcess) {
      try {
        let base64Data = image.base64;
        let mimeType = image.type;

        // Handle DICOMs
        if (!base64Data && image.file) {
          if (image.type === 'application/dicom' || image.name.toLowerCase().endsWith('.dcm')) {
            base64Data = await convertDicomToPngBase64(image.file);
            mimeType = 'image/png';
          }
        }

        // Handle pasted/dropped images that might just be files without base64 yet
        if (!base64Data && image.file && image.type.startsWith('image/')) {
          const reader = new FileReader();
          base64Data = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result.split(',')[1]);
            reader.readAsDataURL(image.file);
          });
        }

        if (base64Data) {
          processedParts.push({
            inlineData: {
              mimeType: mimeType || 'image/png',
              data: base64Data,
            },
          });
        }
      } catch (e) {
        console.error("Image processing failed:", e);
      }
    }
    return processedParts;
  };

  const analyzeImages = async () => {
    console.log('AnalyzeImages....1859')
    // --- ADD THIS BLOCK ---
    const allowed = await checkAndConsumeQuota("AI Image Analysis");
    if (!allowed) return;

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

    // const prompt = `Role & Persona:
    // You are an expert Medical Documentation Specialist and Computer Vision Research Assistant. Your role is to draft structured technical descriptions and perform quality control checks on text.

    // CRITICAL OPERATIONAL RULES:

    // DRAFT ONLY: You are NOT a doctor. You do NOT provide final medical diagnoses. You generate preliminary drafts for physician review.

    // DESCRIBE, DON'T DIAGNOSE: When analyzing images, describe visual features (e.g., "hyperechoic region," "increased opacity") rather than asserting a definitive condition (e.g., "This is cancer").

    // OBJECTIVE TONE: Maintain a strictly technical, observational tone.

    // You MUST always respond with a single, valid JSON object.

    // Core Workflow

    // Determine the input type and follow the corresponding drafting protocol:

    // Visual Input (Scans): Follow "Workflow A: Template-Based Drafting".

    // Text Input (Existing Report Images): Follow "Workflow B: Consistency Review".

    // Workflow A: Template-Based Drafting (Visual Feature Extraction)

    // Your goal is to structure visual observations into a pre-defined HTML format.

    // 1. Context: Available Templates
    // (Use the specific HTML schemas provided below for the analysisReport output)

    // {
    //   "Abdomen": "<h3>IMPRESSION:</h3><p>1. No sonographic evidence of significant abnormality in the upper abdomen.</p><h3>FINDINGS:</h3><p><strong>LIVER:</strong> Normal in size (spans __ cm), contour, and echotexture...</p>",
    //    "Pelvis": "<h3>IMPRESSION:</h3><p>1. Unremarkable ultrasound of the pelvis.</p><h3>FINDINGS:</h3><p><strong>URINARY BLADDER:</strong> Adequately distended, with a normal wall thickness...</p>",
    //    "Abdomen and Pelvis" : "<p><strong>LIVER:</strong> The liver is normal in size _cm, shape & echotexture. Hepatic veins and intrahepatic portal vein radicles are normal in size and distribution. No focal solid or cystic mass lesion is noted.</p>
    //        <p><strong>GALL BLADDER:</strong> Gall bladder appeared normal. No mural mass or calculus is noted.</p>
    //        <p><strong>CBD:</strong> Common bile duct appeared normal. No calculi seen in the common bile duct.</p>
    //        <p><strong>PANCREAS:</strong> Is normal in shape size and echotexture. No focal lesion seen.</p>
    //        <p><strong>SPLEEN:</strong> Spleen is normal in size _cm, shape and echotexture. No focal lesion is seen.</p>
    //        <p><strong>KIDNEYS:</strong> Right kidney measures _ x _ x _cm with parenchymal thickness _cm and Left kidney measures _ x _ x _cm with parenchymal thickness _cm. Both kidneys are normal in size, shape, position, echogenicity and echotexture. Normal corticomedullary differentiation is noted. Pelvicalyceal systems on both sides are normal.</p>
    //        <p><strong>URETERS:</strong> Visualized portions of both ureters are not dilated. No calculus is seen in the portions of ureters which can be seen by sonography.</p>
    //        <p><strong>URINARY BLADDER:</strong> The urinary bladder shows physiological distention. No calculus or mass lesion is seen.</p>
    //        <p><strong>PROSTATE:</strong> The prostate is normal in shape, position, echogenicity and echotexture. There is no focal solid or cystic mass lesion in it.</p>
    //        <p><strong>OTHER:</strong> Visualized portions of IVC and Aorta are grossly normal. There is no free or loculated fluid collection in abdomen or pelvis. No significant lymphadenopathy is noted.</p>
    //        <br>
    //        <p><strong>IMPRESSION:</strong></p>
    //        <p>• No significant abnormality is seen.</p>",
    // }


    // 2. Drafting Protocols

    // Visual Matching: Identify the anatomical region shown in the visual input. Select the corresponding template key.

    // Data Insertion: Populate the template placeholders (__) by extracting visual data (dimensions, echogenicity, shape) from the image.

    // Exception Handling:

    // No Template: If no template matches the anatomy, draft a standard technical description structure.

    // User Override: If the user requests a specific format, prioritize the user's instruction over the template.

    // Workflow B: Text Consistency Review (Quality Control)

    // Your goal is to verify the internal logic of an existing document.

    // Rules for QC Check

    // Digitization: Transcribe the text from the image into the analysisReport field.

    // Logic Check: Compare the "FINDINGS" section against the "IMPRESSION" section. Ensure all visual features described in Findings are accounted for in the Impression.

    // Flagging: If a discrepancy exists (e.g., a feature listed in Findings is missing from Impression), populate suggestedCorrection and inconsistencyAlert.

    // User-Provided Context

    // You will be given the images and the following background information:
    // Reference Information: "${clinicalContext || 'None'}"

    // Final JSON Output Specification

    // Generate a single JSON object using one of the schemas below.

    // Schema 1: Successful Draft (Workflow A or B)

    // {
    //   "analysisSuccessful": true,
    //   "analysisReport": "string (The structured HTML draft or digitized text.)",
    //   "measurements": [{ "finding": "string", "value": "string" }] | [],
    //   "criticalFinding": { "findingName": "string (The name of the notable visual feature)", "reportMacro": "string", "notificationTemplate": "string" } | null,
    //   "inconsistencyAlert": "string" | null,
    //   "suggestedCorrection": "string" | null
    // }


    // Schema 2: Information Request (Fallback)

    // {
    //   "analysisSuccessful": false,
    //   "clarificationNeeded": true,
    //   "questionForDoctor": "string (Specific query regarding image quality or anatomical view.)"
    // }
    // `;

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
        generationConfig: { responseMimeType: "application/json" },
        // --- SAFETY SETTINGS FIX ---
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
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

  // --- SEARCH LOGIC ---
  const handleLocalSearch = (query) => {
    // Use the passed query or fall back to the state
    const searchTerm = query !== undefined ? query : searchQuery;

    if (!searchTerm || !searchTerm.trim()) {
      setLocalSearchResults([]);
      setBaseSearchQuery('');
      return;
    }

    setSearchQuery(searchTerm);
    setBaseSearchQuery(searchTerm);

    // Clear AI results to focus on local search results
    setAllAiSearchResults([]);
    setAllAiFullReports([]);
    setAiKnowledgeLookupResult(null);

    // Safety check: Ensure localFindings exists
    if (!localFindings || !Array.isArray(localFindings)) {
      console.warn("localFindings is missing or not an array");
      return;
    }

    const queryLC = searchTerm.toLowerCase().trim();

    // --- FIX: Search in ALL fields (Name, Organ, Findings, Impression) ---
    // const results = localFindings.filter(finding => {
    //     const nameMatch = finding.findingName && finding.findingName.toLowerCase().includes(queryLC);
    //     const organMatch = finding.organ && finding.organ.toLowerCase().includes(queryLC);
    //     const bodyMatch = finding.findings && finding.findings.toLowerCase().includes(queryLC);
    //     const impressionMatch = finding.impression && finding.impression.toLowerCase().includes(queryLC);

    //     return nameMatch || organMatch || bodyMatch || impressionMatch;
    // });

    // setLocalSearchResults(results);

    // ⚡ Fuse.js Implementation
    const fuse = new Fuse(localFindings, {
      keys: ['findingName', 'organ', 'impression', 'findings', 'synonyms'],
      threshold: 0.3, // 0.3 is a "fuzzy" sweet spot
      ignoreLocation: true
    });

    const results = fuse.search(searchTerm);
    // Fuse returns { item, refIndex }, map back to just the item
    setLocalSearchResults(results.map(r => r.item));

    // Ensure "Search" tab is open
    setActiveAiTab('search');
  };

  // In App.legacy.jsx, replace the old handleAiFindingsSearch with this:

  const handleAiFindingsSearch = async (queryOrIsMore, isMoreQueryFlag = false) => {
    // if (isRestricted) { ... }
    // --- ADD THIS BLOCK ---
    const allowed = await checkAndConsumeQuota("AI Search");
    if (!allowed) return;

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

        if (parsed.patientName) setPatientName(parsed.patientName);
        if (parsed.patientId) setPatientId(parsed.patientId);
        if (parsed.patientAge) setPatientAge(parsed.patientAge);
        if (parsed.referringPhysician) setReferringPhysician(parsed.referringPhysician);
        if (parsed.examDate) setExamDate(parsed.examDate);
        if (parsed.modality) setModality(parsed.modality);
        if (parsed.bodyPart) setTemplate(parsed.bodyPart);
        if (parsed.reportBody && editor) {
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
      if (placeholderRegex.test(existingContent)) {
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

  // LOCATE THE EXISTING handleSendMessage FUNCTION AND REPLACE IT WITH THIS:

  // const handleSendMessage = async (message) => {
  //   // if (isRestricted) {
  //   //   toast.error("Please upgrade to a professional plan for conversational follow-ups.");
  //   //   return;
  //   // }

  //   // --- ADD THIS BLOCK ---
  //   const allowed = await checkAndConsumeQuota("AI Co-pilot");
  //   if (!allowed) return;

  //   const newUserMessage = { sender: 'user', text: message };

  //   // Update UI immediately with user message
  //   setConversationHistory(prev => [...prev, newUserMessage]);
  //   setIsAiReplying(true);

  //   // CRITICAL FIX: Send HTML, not Text, so AI preserves formatting/structure
  //   const reportText = editor ? editor.getHTML() : 'No report has been generated yet.';

  //   // Construct history including the new message for the AI context
  //   const currentHistory = [...conversationHistory, newUserMessage];
  //   // Limit to last 15 messages to keep context focused and efficient
  //   const historyString = currentHistory.slice(-15).map(msg => `${msg.sender.toUpperCase()}: ${msg.text}`).join('\n');

  //   const prompt = `
  //     You are a smart Radiology AI Co-pilot. You have direct access to the doctor's report editor.

  //     **Role:** Assist the radiologist by answering questions or modifying the report directly based on their instructions.

  //     **Current Report Content (HTML):**
  //     ---
  //     ${reportText}
  //     ---

  //     **Conversation History:**
  //     ---
  //     ${historyString}
  //     ---

  //     **User Request:** "${message}"

  //     **Instructions:**
  //     1. Analyze the Request.
  //     2. Determine the best **Editor Action**:
  //        - **"append"**: Use ONLY if the new text belongs at the very end of the document (e.g., adding a footer, a new section at the bottom).
  //        - **"replace"**: Use this for **inserting** text into the middle of the report (e.g., adding a finding to 'Soft Tissues') or modifying existing text.
  //        - **"none"**: For general questions/chat.

  //     3. **CRITICAL RULES FOR "replace":**
  //        - You must return the **COMPLETE** report HTML.
  //        - **DO NOT** summarize, truncate, or remove any existing sections (like Patient Info, Technique, other findings) unless explicitly asked to delete them.
  //        - You are an **EDITOR**, not a summarizer. Keep 99% of the report identical, only injecting the specific requested change into the appropriate section.
  //        - Maintain all existing HTML tags (<strong>, <br>, <h3>) exactly as they are.

  //     **Response Format (JSON Only):**
  //     {
  //       "reply": "string (Conversational response, e.g., 'I've added the ganglion cyst findings to the Soft Tissue section.')",
  //       "editorAction": "none" | "append" | "replace", 
  //       "contentToInsert": "string (The HTML content. If 'replace', this MUST be the FULL report HTML with the changes. If 'append', just the new text.)"
  //     }
  //   `;

  //   try {
  //     const payload = {
  //       contents: [{ role: "user", parts: [{ text: prompt }] }],
  //       generationConfig: { responseMimeType: "application/json" } // Force JSON response
  //     };

  //     const model = 'gemini-2.5-flash';
  //     const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  //     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  //     const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  //     if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

  //     const result = await response.json();
  //     const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

  //     if (textResult) {
  //       let parsedResponse;
  //       try {
  //         parsedResponse = JSON.parse(textResult);
  //       } catch (e) {
  //         // Fallback in case AI returns raw text (rare with responseMimeType set)
  //         console.warn("AI returned raw text instead of JSON");
  //         parsedResponse = { reply: textResult, editorAction: 'none' };
  //       }

  //       const newAiMessage = { sender: 'ai', text: parsedResponse.reply };
  //       setConversationHistory(prev => [...prev, newAiMessage]);

  //       // --- INTERACTIVE EDITOR LOGIC ---
  //       if (parsedResponse.editorAction !== 'none' && parsedResponse.contentToInsert && editor) {
  //         isProgrammaticUpdate.current = true; // Prevent loop

  //         if (parsedResponse.editorAction === 'append') {
  //           // Insert content at current cursor position (or end if loose)
  //           editor.chain().focus().insertContent(` ${parsedResponse.contentToInsert}`).run();
  //           toast.success("Co-pilot added to report", { icon: '✍️' });
  //         }
  //         else if (parsedResponse.editorAction === 'replace') {
  //           // Replace entire content
  //           editor.commands.setContent(parsedResponse.contentToInsert);
  //           toast.success("Co-pilot updated the report", { icon: '🔄' });
  //         }
  //         // Sync React state
  //         setEditorContent(editor.getHTML());
  //       }
  //       // --------------------------------

  //     } else {
  //       throw new Error("No response from AI assistant.");
  //     }
  //   } catch (err) {
  //     const errorMessage = { sender: 'ai', text: `Sorry, I encountered an error: ${err.message}` };
  //     setConversationHistory(prev => [...prev, errorMessage]);
  //   } finally {
  //     setIsAiReplying(false);
  //   }
  // };

  // --- REPLACEMENT: Vision-Enabled handleSendMessage ---
  const handleSendMessage = async (message) => {
    // 1. Check Quota (Optional)
    // const allowed = await checkAndConsumeQuota("AI Co-pilot");
    // if (!allowed) return;

    const newUserMessage = { sender: 'user', text: message };
    setConversationHistory(prev => [...prev, newUserMessage]);
    setIsAiReplying(true);

    try {
      // 2. Prepare Context (Report & History)
      const reportText = editor ? editor.getHTML() : 'No report generated yet.';
      const currentHistory = [...conversationHistory, newUserMessage];
      const historyString = currentHistory.slice(-10).map(msg => `${msg.sender.toUpperCase()}: ${msg.text}`).join('\n');

      // 3. Prepare Prompt
      const systemPrompt = `
        You are an expert Radiology AI Assistant (Co-pilot).
        
        **ROLE & CONTEXT:**
        1. You have access to the patient's **Medical Images** (attached).
        2. You have the **Current Report Draft** (below).
        3. Your goal is to assist the radiologist by answering questions or modifying the report directly.

        **CURRENT REPORT DRAFT (HTML):**
        ---
        ${reportText}
        ---

        **CHAT HISTORY:**
        ---
        ${historyString}
        ---

        **USER REQUEST:** "${message}"

        **INSTRUCTIONS:**
        1. Analyze the Request. Use visual information from images if relevant.
        2. Determine the best **Editor Action**:
           - **"append"**: Use this to add new text to the end of the report. Generally safer for additive findings.
           - **"replace"**: Use this for editing existing sections or surgical injections into the middle.
           - **"none"**: For general questions or chat.

        **CRITICAL RULES FOR "replace":**
        - If you choose "replace", you MUST return the **COMPLETE AND FULL** report HTML in "contentToInsert".
        - **DO NOT** truncate, summarize, or remove existing sections.
        - You are an **EDITOR**, not a summarizer. Maintain all existing structure.

        **RESPONSE FORMAT (JSON):**
        {
          "reply": "string (Conversational response, e.g., 'I\\'ve added the cholecystitis findings to the report.')",
          "editorAction": "none" | "append" | "replace", 
          "contentToInsert": "string (The HTML content. If 'replace', this MUST be the FULL report HTML. If 'append', just the new text to add.)"
        }
      `;

      // 4. Process Images (The "Vision" Part)
      let requestParts = [{ text: systemPrompt }];

      // Only attach images if they exist
      if (images && images.length > 0) {
        const imageParts = await processImagesForGemini(images);
        requestParts = [...requestParts, ...imageParts];
        console.log(`Attaching ${imageParts.length} images to chat context.`);
      }

      // 5. Call API
      const payload = {
        contents: [{ role: "user", parts: requestParts }],
        generationConfig: { responseMimeType: "application/json" }
      };

      const model = 'gemini-2.5-flash'; // Or 1.5-pro for better vision reasoning
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const result = await response.json();
      const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

      if (textResult) {
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(textResult);
        } catch (e) {
          parsedResponse = { reply: textResult, editorAction: 'none' };
        }

        const newAiMessage = { sender: 'ai', text: parsedResponse.reply };
        setConversationHistory(prev => [...prev, newAiMessage]);

        // Handle Editor Updates
        if (parsedResponse.editorAction !== 'none' && parsedResponse.contentToInsert && editor) {
          isProgrammaticUpdate.current = true;
          if (parsedResponse.editorAction === 'append') {
            editor.chain().focus().insertContent(` ${parsedResponse.contentToInsert}`).run();
            toast.success("Added to report");
          } else if (parsedResponse.editorAction === 'replace') {
            editor.commands.setContent(parsedResponse.contentToInsert);
            toast.success("Updated report");
          }
          setEditorContent(editor.getHTML());
        }
      }
    } catch (err) {
      console.error("Chat Error:", err);
      const errorMessage = { sender: 'ai', text: "I'm having trouble seeing the images right now. Please try again." };
      setConversationHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsAiReplying(false);
    }
  };

  // 2. REPLACE handleCorrectReport WITH THIS ENHANCED VERSION
  const handleCorrectReport = async () => {
    const allowed = await checkAndConsumeQuota("AI Correction");
    if (!allowed) return;

    if (!assistantQuery) {
      setError("Please paste a report in the text box to correct it.");
      return;
    }
    setIsLoading(true);
    setError(null);

    // Context injection for precision
    const patientContext = `Patient Age: ${patientAge}, Gender Context: ${patientName}`;

    const prompt = `
      You are a Senior Attending Radiologist and expert Medical Editor. 
      Your task is to review the following radiology report for accuracy, consistency, and style.

      **Input Context:**
      ${patientContext}
      
      **Strict Protocol:**
      1.  **Consistency Check:** Cross-reference FINDINGS with IMPRESSION. Ensure every significant finding in the body is accounted for in the impression.
      2.  **Terminology Standardization:** Use standard radiological lexicon (e.g., use "hyperechoic" instead of "bright", "anechoic" instead of "black"). 
      3.  **Guideline Adherence:** If nodules or cysts are mentioned, ensure descriptions align with standard reporting guidelines (e.g., Fleischner Society for lungs, TI-RADS for thyroid, O-RADS for ovaries) if applicable based on the text.
      4.  **Error Correction:** Fix typos, grammar, and lateral discrepancies (e.g., describing left kidney but concluding right kidney).
      5.  **Output Format:** Return ONLY the corrected report as a professional HTML string. Do not include markdown blocks or conversational text.

      **Draft to Correct:**
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
        // Strip markdown code blocks if AI adds them
        const cleanHtml = textResult.replace(/```html/g, '').replace(/```/g, '');
        editor.commands.setContent(cleanHtml);
        setEditorContent(cleanHtml);
        toast.success("Report corrected & standardized!");
        setShowAssistantModal(false); // Auto-close on success
      } else {
        throw new Error("No response from AI assistant.");
      }
    } catch (err) {
      setError("Correction failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. REPLACE handleGenerateTemplate WITH THIS CONTEXT-AWARE VERSION
  const handleGenerateTemplate = async () => {
    if (!assistantQuery) {
      setError("Please enter a topic/modality to generate a template.");
      return;
    }
    setIsLoading(true);
    setError(null);

    // Context injection: A 70yo needs different template defaults (e.g., Prostate size) than a 20yo
    const contextStr = `Patient: ${patientAge} years old, Name: ${patientName} (Determine gender from name if not explicit). Modality: ${modality}.`;

    const prompt = `
      Act as an expert Radiologist. Generate a comprehensive, high-quality HTML report template for: "${assistantQuery}".
      
      **Context:**
      ${contextStr}

      **Requirements:**
      1.  **Anatomy Specificity:** Include sections relevant to the specific age and gender provided in the context (e.g., if Male, include Prostate section; if Female, Uterus/Ovaries).
      2.  **Standard Normals:** Pre-fill with "normal" findings but use placeholders (e.g., "__ cm") for measurements.
      3.  **Formatting:** Use <h3> for headers (FINDINGS, IMPRESSION) and <p><strong>ORGAN:</strong> ...</p> for body text.
      4.  **Output:** Return ONLY the raw HTML string.

      Template Topic:
      ${assistantQuery}
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
        const cleanHtml = textResult.replace(/```html/g, '').replace(/```/g, '');
        editor.commands.setContent(cleanHtml);
        setEditorContent(cleanHtml);
        toast.success("Smart Template generated!");
        setShowAssistantModal(false);
      } else {
        throw new Error("No response.");
      }
    } catch (err) {
      setError("Template generation failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. ADD THIS NEW FUNCTION: Patient Friendly Summary
  const handleSimplifyReport = async () => {
    // If input box is empty, try to use the editor content
    const textToSimplify = assistantQuery || editor?.getText();

    if (!textToSimplify) {
      setError("Please enter text or ensure the editor has content.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const prompt = `
      You are a compassionate medical communicator. 
      Translate the following technical radiology report into a "Patient-Friendly Summary".
      
      Rules:
      1. Use simple, non-medical language (e.g., "Hepatomegaly" -> "Enlarged liver").
      2. Explain what the findings mean in plain English.
      3. Maintain a reassuring but accurate tone.
      4. Format as a bulleted list.

      Technical Text:
      ${textToSimplify}
    `;

    try {
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
      const model = 'gemini-2.5-flash';
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const result = await response.json();
      const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

      if (textResult) {
        setAssistantQuery(textResult); // Show result in the box
        toast.success("Summary generated!");
      }
    } catch (err) {
      setError("Simplification failed: " + err.message);
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
      const hName = hospitalSettings?.name || '';
      const logoHtml = hospitalSettings?.logo ? `<img src="${hospitalSettings.logo}" style="width: 100%; height: auto; display: block;" alt="Logo" />` : '';
      const date = new Date().toLocaleDateString();

      const hospitalDetailsHtml = !hospitalSettings?.logo ? `
        <div style="text-align: right; width: 100%;">
             <h2 style="margin: 0 0 5px 0; font-size: 22px; font-weight: bold; color: #000;">${hospitalSettings?.name || 'Medical Report'}</h2>
             <p style="margin: 2px 0; font-size: 14px; color: #000;">${hospitalSettings?.department || ''}</p>
             <p style="margin: 2px 0; font-size: 12px; color: #000;">${hospitalSettings?.address || ''}</p>
             <p style="margin: 2px 0; font-size: 12px; color: #000;">${hospitalSettings?.contact || ''}</p>
        </div>
      ` : '';

      const patientHeader = `
            <div style="font-family: sans-serif; color: #000;">
                <div style="border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px;">
                    ${logoHtml}
                    ${hospitalDetailsHtml}
                </div>
                
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;color : black;">
                    <tr style="background-color: #f8f9fa;color : black;">
                        <td style="padding: 10px; border: 1px solid #dee2e6; width: 15%;color : black; font-weight: bold;">Patient Name</td>
                        <td style="padding: 10px; border: 1px solid #dee2e6; width: 35%;color : black;">${patientName}</td>
                        <td style="padding: 10px; border: 1px solid #dee2e6; width: 15%;color : black; font-weight: bold;">Patient ID</td>
                        <td style="padding: 10px; border: 1px solid #dee2e6; width: 35%;color : black;">${patientId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;color : black;">Age / Gender</td>
                        <td style="padding: 10px; border: 1px solid #dee2e6;color : black;">${patientAge} / ${patientGender}</td>
                        <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;color : black;">Exam Date</td>
                        <td style="padding: 10px; border: 1px solid #dee2e6;color : black;color : black;">${examDate}</td>
                    </tr>
                    <tr style="background-color: #f8f9fa;">
                        <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;color : black;">Ref. Physician</td>
                        <td style="padding: 10px; border: 1px solid #dee2e6;color : black;" colspan="3">${referringPhysician}</td>
                    </tr>
                </table>
            </div>`;
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
    const file = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Radiology_Report_${patientName.replace(/ /g, '_')}_${examDate}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toastDone('TXT downloaded');
  };

  // const downloadPdfReport = (reportContent) => {
  //   if (!reportContent) {
  //       setError("Report content is empty. Please generate the report first.");
  //       return;
  //   }
  //   setError(null);
  //   try {
  //       const doc = new jsPDF();

  //       const tempDiv = document.createElement('div');
  //       tempDiv.style.width = '170mm';
  //       tempDiv.style.fontFamily = 'helvetica';
  //       tempDiv.style.fontSize = '12px';
  //       tempDiv.innerHTML = reportContent;
  //       document.body.appendChild(tempDiv);

  //       doc.html(tempDiv, {
  //           callback: function (doc) {
  //               document.body.removeChild(tempDiv);
  //               doc.save(`Radiology_Report_${patientName.replace(/ /g, '_')}_${examDate}.pdf`);
  //               toastDone('PDF downloaded');
  //           },
  //           x: 15,
  //           y: 15,
  //           width: 170,
  //           windowWidth: tempDiv.scrollWidth
  //       });
  //   } catch (err) {
  //       setError(`An unexpected error occurred during PDF generation: ${err.message}`);
  //       console.error(err);
  //   }
  // };

  //Cuttenlt working but not properly aligned.

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
      tempDiv.style.color = '#000000'; // Force black text globally for PDF
      tempDiv.innerHTML = reportContent;

      // 🔹 Normalize table styling + spacing for PDF
      const pdfTables = tempDiv.querySelectorAll('table');
      pdfTables.forEach((table) => {
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        table.style.marginTop = '8px';      // same as 0.5rem
        table.style.marginBottom = '8px';   // same as 0.5rem

        table.querySelectorAll('th, td').forEach((cell) => {
          cell.style.border = '0.5px solid #000';
          cell.style.padding = '4px';
          cell.style.color = '#000000'; // Force black text for table cells
        });
      });

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
        windowWidth: tempDiv.scrollWidth,
      });
    } catch (err) {
      setError(`An unexpected error occurred during PDF generation: ${err.message}`);
      console.error(err);
    }
  };

  // const downloadPdfReport = (reportContent) => {
  //     if (!reportContent) {
  //       toast.error("Report content is empty. Please generate the report first.");
  //       return;
  //     }

  //     try {
  //       const doc = new jsPDF();

  //       // 1. Prepare Data
  //       const hName = hospitalSettings?.name || 'City General Hospital';
  //       const hDept = hospitalSettings?.department || 'Department of Radiology';
  //       const hAddr = hospitalSettings?.address || '123 Medical Center Blvd, Metroville, ST 12345';
  //       const hContact = hospitalSettings?.contact || 'Phone: (555) 123-4567';
  //       const logoHtml = hospitalSettings?.logo 
  //          ? `<img src="${hospitalSettings.logo}" style="height: 50px; max-width: 150px; object-fit: contain; margin-bottom: 5px; display: block;" />` 
  //          : '';
  //       const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  //       // 2. Create Temporary HTML Element for jsPDF
  //       const tempDiv = document.createElement('div');
  //       tempDiv.style.width = '170mm'; // Match A4 width approx minus margins
  //       tempDiv.style.fontFamily = 'Helvetica, Arial, sans-serif';
  //       tempDiv.style.fontSize = '12px';
  //       tempDiv.style.lineHeight = '1.5';
  //       tempDiv.style.color = '#333';
  //       tempDiv.style.padding = '10px';

  //       // 3. Construct HTML Structure (Same visual style as handleDownloadPDF)
  //       tempDiv.innerHTML = `
  //         <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937;">

  //           <!-- HEADER -->
  //           <div style="border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start;">
  //             <div style="flex: 1;">
  //               ${logoHtml}
  //               <h1 style="margin: 0; color: #1e3a8a; font-size: 22px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">${hName}</h1>
  //               <p style="margin: 4px 0 0; color: #4b5563; font-size: 12px; font-weight: 600;">${hDept}</p>
  //               <p style="margin: 2px 0 0; color: #6b7280; font-size: 10px; max-width: 300px;">${hAddr}</p>
  //               <p style="margin: 0; color: #6b7280; font-size: 10px;">${hContact}</p>
  //             </div>
  //             <div style="text-align: right;">
  //               <div style="background-color: #2563eb; color: white; padding: 5px 12px; border-radius: 4px; display: inline-block; font-weight: bold; font-size: 12px; margin-bottom: 5px;">RADIOLOGY REPORT</div>
  //               <p style="margin: 0; font-size: 10px; color: #6b7280;"><strong>Status:</strong> Final</p>
  //               <p style="margin: 0; font-size: 10px; color: #6b7280;"><strong>Date:</strong> ${date}</p>
  //             </div>
  //           </div>

  //           <!-- PATIENT INFO (Static placeholder based on your previous code) -->
  //           <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
  //             <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
  //               <tr>
  //                 <td style="padding: 5px 0 0 1vh; width: 50%;"><strong style="color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 8px;">Patient Name:</strong> <span style="font-weight: 600; color: #1e293b;">${patientName || 'N/A'}</span></td>
  //                 <td style="padding: 5px 0 0 1vh; width: 50%;"><strong style="color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 8px;">MRN:</strong> <span style="font-weight: 600; color: #1e293b;">${patientId || 'N/A'}</span></td>
  //               </tr>
  //               <tr>
  //                 <td style="padding: 5px 0 0 1vh; width: 50%;"><strong style="color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 8px;">DOB / Age:</strong> <span style="font-weight: 600; color: #1e293b;">${patientAge || 'N/A'}</span></td>
  //                 <td style="padding: 5px 0 0 1vh; width: 50%;"><strong style="color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 8px;">Exam Date:</strong> <span style="font-weight: 600; color: #1e293b;">${examDate || date}</span></td>
  //               </tr>
  //                <tr>
  //                 <td style="padding: 5px 0 0 1vh; width: 100%;" colspan="2"><strong style="color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 8px;">Referring Phys:</strong> <span style="font-weight: 600; color: #1e293b;">${referringPhysician || 'N/A'}</span></td>
  //               </tr>
  //             </table>
  //           </div>

  //           <!-- BODY CONTENT -->
  //           <div style="margin-bottom: 40px; font-size: 11px; text-align: left; color: #374151; line-height: 1.6;">
  //             <h2 style="font-size: 14px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; color: #1e3a8a; margin-bottom: 15px; font-weight: 700;">Findings & Impression</h2>
  //             ${reportContent}
  //           </div>

  //           <!-- FOOTER -->
  //           <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e2e8f0; page-break-inside: avoid;">
  //             <div style="display: flex; justify-content: space-between; align-items: flex-end;">
  //               <div>
  //                 <p style="margin: 0 0 5px; font-weight: bold; color: #1f2937; font-size: 11px;">Electronically Signed by:</p>
  //                 <div style="font-family: 'Courier New', Courier, monospace; font-size: 14px; color: #2563eb; margin-bottom: 2px;">/s/ Dr. Jane Smith, MD</div>
  //                 <p style="margin: 0; font-size: 10px; color: #4b5563;">Board Certified Radiologist</p>
  //               </div>
  //               <div style="text-align: right;">
  //                  <!-- QR Code Placeholder -->
  //                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=aiRAD-Verified" alt="QR" style="width: 45px; height: 45px; opacity: 0.7;" />
  //               </div>
  //             </div>

  //             <p style="margin-top: 20px; font-size: 8px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 8px;">
  //               This report was generated using <strong>aiRAD</strong>. Confidential Patient Information.
  //             </p>
  //           </div>
  //         </div>
  //       `;

  //       // 4. Normalize styling for existing tables in content
  //       const pdfTables = tempDiv.querySelectorAll('table');
  //       pdfTables.forEach((table) => {
  //         table.style.borderCollapse = 'collapse';
  //         table.style.width = '100%';
  //         table.style.marginTop = '8px';
  //         table.style.marginBottom = '8px';
  //         table.style.fontSize = '10px'; // Smaller font for inner tables

  //         table.querySelectorAll('th, td').forEach((cell) => {
  //           cell.style.border = '0.5px solid #cbd5e1'; // lighter border
  //           cell.style.padding = '4px';
  //         });
  //         table.querySelectorAll('th').forEach((header) => {
  //             header.style.backgroundColor = '#f1f5f9';
  //             header.style.fontWeight = 'bold';
  //             header.style.textAlign = 'left';
  //         });
  //       });

  //       document.body.appendChild(tempDiv);

  //       doc.html(tempDiv, {
  //         callback: function (doc) {
  //           document.body.removeChild(tempDiv);
  //           doc.save(`Radiology_Report_${(patientName || 'Patient').replace(/ /g, '_')}_${examDate || date}.pdf`);
  //           toast.success('PDF downloaded');
  //         },
  //         x: 15,
  //         y: 15,
  //         width: 170, // Max width in mm
  //         windowWidth: tempDiv.scrollWidth, // Important for html2canvas
  //       });
  //     } catch (err) {
  //       toast.error(`An unexpected error occurred: ${err.message}`);
  //       console.error(err);
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

  // const downloadWordReport = async (reportContent, patientName = 'Report') => {
  //   try {
  //     // 1. Parse the HTML into a DOM
  //     const parser = new DOMParser();
  //     const docHtml = parser.parseFromString(reportContent, 'text/html');

  //     const docxChildren = [];

  //     // --- A. Build the Patient Info Table from the FIRST table's <td>s ---
  //     const allTds = docHtml.querySelectorAll('td');
  //     if (allTds.length >= 8) {
  //       const patientInfoTable = new Table({
  //         width: { size: 100, type: WidthType.PERCENTAGE },
  //         rows: [
  //           new TableRow({
  //             children: [
  //               new TableCell({
  //                 children: [
  //                   new Paragraph({
  //                     children: [new TextRun({ text: "Patient Name", bold: true })],
  //                   }),
  //                 ],
  //               }),
  //               new TableCell({
  //                 children: [new Paragraph(allTds[1]?.textContent || '')],
  //               }),
  //               new TableCell({
  //                 children: [
  //                   new Paragraph({
  //                     children: [new TextRun({ text: "Patient ID", bold: true })],
  //                   }),
  //                 ],
  //               }),
  //               new TableCell({
  //                 children: [new Paragraph(allTds[3]?.textContent || '')],
  //               }),
  //             ],
  //           }),
  //           new TableRow({
  //             children: [
  //               new TableCell({
  //                 children: [
  //                   new Paragraph({
  //                     children: [new TextRun({ text: "Age", bold: true })],
  //                   }),
  //                 ],
  //               }),
  //               new TableCell({
  //                 children: [new Paragraph(allTds[5]?.textContent || '')],
  //               }),
  //               new TableCell({
  //                 children: [
  //                   new Paragraph({
  //                     children: [new TextRun({ text: "Exam Date", bold: true })],
  //                   }),
  //                 ],
  //               }),
  //               new TableCell({
  //                 children: [new Paragraph(allTds[7]?.textContent || '')],
  //               }),
  //             ],
  //           }),
  //           new TableRow({
  //             children: [
  //               new TableCell({
  //                 children: [
  //                   new Paragraph({
  //                     children: [new TextRun({ text: "Referring Physician", bold: true })],
  //                   }),
  //                 ],
  //               }),
  //               new TableCell({
  //                 children: [new Paragraph(allTds[9]?.textContent || '')],
  //                 columnSpan: 3,
  //               }),
  //             ],
  //           }),
  //         ],
  //       });

  //       docxChildren.push(patientInfoTable);
  //       docxChildren.push(new Paragraph("")); // spacing after table
  //     }

  //     // --- B. Process the rest of the report (Impression, Findings, other tables) ---
  //     const mainNodes = docHtml.body.children;

  //     for (const node of mainNodes) {
  //       const nodeName = node.nodeName.toUpperCase();

  //       // Skip the patient header wrapper div (we already handled its table)
  //       if (nodeName === 'DIV') continue;

  //       // 🔹 HANDLE ANY OTHER TABLES FROM THE EDITOR
  //       if (nodeName === 'TABLE') {
  //         const rows = [];
  //         const rowElements = node.querySelectorAll('tr');

  //         rowElements.forEach((tr) => {
  //           const cells = [];
  //           const cellElements = tr.querySelectorAll('th, td');

  //           cellElements.forEach((cellEl) => {
  //             const cellText = cellEl.textContent || '';
  //             const colspanAttr = cellEl.getAttribute('colspan');
  //             const colspan = colspanAttr ? parseInt(colspanAttr, 10) || 1 : 1;

  //             const cellOptions = {
  //               children: [new Paragraph(cellText)],
  //             };

  //             if (colspan > 1) {
  //               cellOptions.columnSpan = colspan;
  //             }

  //             cells.push(new TableCell(cellOptions));
  //           });

  //           rows.push(new TableRow({ children: cells }));
  //         });

  //         if (rows.length) {
  //           docxChildren.push(
  //             new Table({
  //               width: { size: 100, type: WidthType.PERCENTAGE },
  //               rows,
  //             })
  //           );
  //           docxChildren.push(new Paragraph("")); // blank line after each table
  //         }

  //         continue; // move to next node; don't fall through to switch
  //       }

  //       // 🔹 Normal headings & paragraphs
  //       switch (nodeName) {
  //         case 'H3':
  //           docxChildren.push(
  //             new Paragraph({
  //               text: node.textContent,
  //               heading: HeadingLevel.HEADING_3,
  //               style: 'Heading3',
  //             })
  //           );
  //           break;

  //         case 'P': {
  //           const paragraphRuns = [];
  //           for (const childNode of node.childNodes) {
  //             if (childNode.nodeName.toUpperCase() === 'STRONG') {
  //               paragraphRuns.push(
  //                 new TextRun({ text: childNode.textContent, bold: true })
  //               );
  //             } else {
  //               paragraphRuns.push(new TextRun(childNode.textContent));
  //             }
  //           }
  //           docxChildren.push(new Paragraph({ children: paragraphRuns }));
  //           break;
  //         }

  //         default:
  //           // Other tags can be converted to simple paragraphs if needed
  //           if (node.textContent && node.textContent.trim()) {
  //             docxChildren.push(new Paragraph(node.textContent.trim()));
  //           }
  //           break;
  //       }
  //     }

  //     // --- C. Build and download the .docx ---
  //     const doc = new Document({
  //       sections: [
  //         {
  //           properties: {},
  //           children: docxChildren,
  //         },
  //       ],
  //       styles: {
  //         paragraphStyles: [
  //           {
  //             id: 'Heading3',
  //             name: 'Heading 3',
  //             basedOn: 'Normal',
  //             next: 'Normal',
  //             run: {
  //               bold: true,
  //               size: 24, // 12 pt
  //             },
  //             paragraph: {
  //               spacing: { after: 120 },
  //             },
  //           },
  //         ],
  //       },
  //     });

  //     const blob = await Packer.toBlob(doc);
  //     saveAs(blob, `Radiology_Report_${patientName.replace(/ /g, '_')}.docx`);
  //     toastDone('Word file downloaded');
  //   } catch (error) {
  //     console.error('Error generating Word document:', error);
  //     toast.error('Failed to generate Word document');
  //   }
  // };

  const downloadWordReport = async (reportContent, patientName = 'Report') => {
    try {
      // 1. Parse the HTML content
      const parser = new DOMParser();
      const docHtml = parser.parseFromString(reportContent, 'text/html');

      const docxChildren = [];
      const FONT_FACE = "Calibri"; // <--- Global Font Setting

      // --- 0. HEADER & LOGO ---
      const hName = hospitalSettings?.name || '';
      const hDept = hospitalSettings?.department || '';
      const hAddr = hospitalSettings?.address || '';
      const hContact = hospitalSettings?.contact || '';
      const date = new Date().toLocaleDateString();
      const hasLogo = !!hospitalSettings?.logo;

      if (hasLogo) {
        try {
          let imageBuffer;
          if (hospitalSettings.logo.startsWith('data:')) {
            const base64Data = hospitalSettings.logo.split(',')[1];
            const binaryString = window.atob(base64Data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            imageBuffer = bytes.buffer;
          } else {
            const response = await fetch(hospitalSettings.logo);
            const blob = await response.blob();
            imageBuffer = await blob.arrayBuffer();
          }

          docxChildren.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: { width: 600, height: 150 },
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            })
          );
        } catch (e) {
          console.error("Logo error:", e);
        }
      }

      const isDefaultName = hName === 'City General Hospital';
      if (hName && !isDefaultName) {
        docxChildren.push(
          new Paragraph({
            children: [new TextRun({ text: hName, bold: true, size: 32, color: "1E3A8A", font: FONT_FACE })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun({ text: hDept, size: 24, color: "4B5563", font: FONT_FACE })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun({ text: hAddr, size: 20, color: "6B7280", font: FONT_FACE })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun({ text: hContact, size: 20, color: "6B7280", font: FONT_FACE })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          })
        );
      }

      // docxChildren.push(
      //     new Paragraph({
      //         children: [ new TextRun({ text: "RADIOLOGY REPORT", bold: true, color: "FFFFFF", font: FONT_FACE }) ],
      //         alignment: AlignmentType.RIGHT,
      //         shading: { fill: "2563EB", type: ShadingType.CLEAR, color: "auto" },
      //         spacing: { after: 100 },
      //     }),
      //     new Paragraph({
      //         children: [ new TextRun({ text: `Date: ${date}  |  Status: Final`, size: 20, color: "6B7280", font: FONT_FACE }) ],
      //         alignment: AlignmentType.RIGHT,
      //         spacing: { after: 400 },
      //     })
      // );

      // --- A. PATIENT INFO TABLE ---
      const patientInfoTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Patient Name", bold: true, font: FONT_FACE })] })], shading: { fill: "F8FAFC" }, width: { size: 25, type: WidthType.PERCENTAGE } }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: patientName || 'N/A', font: FONT_FACE })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Patient ID", bold: true, font: FONT_FACE })] })], shading: { fill: "F8FAFC" }, width: { size: 25, type: WidthType.PERCENTAGE } }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: patientId || 'N/A', font: FONT_FACE })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Age / Gender", bold: true, font: FONT_FACE })] })], shading: { fill: "F8FAFC" } }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${patientAge || 'N/A'} / ${patientGender || 'N/A'}`, font: FONT_FACE })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Exam Date", bold: true, font: FONT_FACE })] })], shading: { fill: "F8FAFC" } }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: examDate || date, font: FONT_FACE })] })] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Referring Physician", bold: true, font: FONT_FACE })] })], shading: { fill: "F8FAFC" } }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: referringPhysician || 'N/A', font: FONT_FACE })] })], columnSpan: 3 }),
            ],
          }),
        ],
      });
      docxChildren.push(patientInfoTable);
      docxChildren.push(new Paragraph(""));
      // --- B. CONTENT PROCESSOR (HELPER) ---
      const extractTextRuns = (node) => {
        const runs = [];
        node.childNodes.forEach(child => {
          if (child.nodeName === '#text') {
            if (child.textContent) runs.push(new TextRun({ text: child.textContent, font: FONT_FACE }));
          }
          else if (['STRONG', 'B'].includes(child.nodeName)) {
            runs.push(new TextRun({ text: child.textContent, bold: true, font: FONT_FACE }));
          }
          else if (['EM', 'I'].includes(child.nodeName)) {
            runs.push(new TextRun({ text: child.textContent, italics: true, font: FONT_FACE }));
          }
          else if (child.nodeName === 'BR') {
            runs.push(new TextRun({ break: 1, font: FONT_FACE }));
          }
          else {
            runs.push(...extractTextRuns(child));
          }
        });
        return runs;
      };

      // --- C. RECURSIVE NODE PROCESSOR ---
      const processNode = (node) => {
        const nodeName = node.nodeName.toUpperCase();

        if (nodeName === '#TEXT' && !node.textContent.trim()) return;

        // PARAGRAPHS
        if (nodeName === 'P' || (nodeName === '#TEXT' && node.textContent.trim())) {
          const runs = nodeName === 'P' ? extractTextRuns(node) : [new TextRun({ text: node.textContent, font: FONT_FACE })];
          docxChildren.push(new Paragraph({ children: runs, spacing: { after: 120 } }));
        }
        // HEADINGS
        else if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(nodeName)) {
          docxChildren.push(new Paragraph({
            text: node.textContent,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
            color: "1E3A8A",
            // Note: Font for Heading style is defined in Document definition below
          }));
        }
        // LISTS
        else if (nodeName === 'UL' || nodeName === 'OL') {
          const listItems = node.querySelectorAll(':scope > li');
          listItems.forEach(li => {
            const runs = extractTextRuns(li);
            docxChildren.push(new Paragraph({
              children: runs,
              bullet: { level: 0 }
            }));
          });
        }
        // DIVs
        else if (nodeName === 'DIV') {
          node.childNodes.forEach(child => processNode(child));
        }
        // TABLES
        else if (nodeName === 'TABLE') {
          if (node.textContent.includes('Patient Name') && node.textContent.includes('Patient ID')) return;

          const rows = [];
          node.querySelectorAll('tr').forEach((tr) => {
            const cells = [];
            tr.querySelectorAll('th, td').forEach((cell) => {
              const cellText = cell.textContent || '';
              cells.push(new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: cellText, font: FONT_FACE })] })],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
                  bottom: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
                  left: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
                  right: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" },
                },
              }));
            });
            rows.push(new TableRow({ children: cells }));
          });
          if (rows.length) {
            docxChildren.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
            docxChildren.push(new Paragraph(""));
          }
        }
      };

      const mainNodes = docHtml.body.childNodes;
      mainNodes.forEach(node => processNode(node));

      // --- D. FOOTER / SIGNATURE ---
      // docxChildren.push(
      //     new Paragraph({ children: [ new TextRun({ text: "Electronically Signed by:", bold: false, size: 20, font: FONT_FACE }) ], spacing: { before: 600 } }),
      //     new Paragraph({ children: [ new TextRun({ text: " Dr. , MD",  bold: true, size: 22, font: FONT_FACE }) ] }),
      //     new Paragraph({ children: [ new TextRun({ text: "Board Certified Radiologist", size: 20, color: "4B5563", font: FONT_FACE }) ] }),
      //     new Paragraph({
      //         children: [ new TextRun({ text: "This report was generated using aiRAD.", size: 16, color: "9CA3AF", font: FONT_FACE }) ],
      //         alignment: AlignmentType.CENTER,
      //         spacing: { before: 400, after: 200 },
      //         border: { top: { color: "E2E8F0", space: 10, value: "single", size: 6 } }
      //     })
      // );

      // --- E. GENERATE ---
      const doc = new Document({
        sections: [{ children: docxChildren }],
        styles: {
          paragraphStyles: [{
            id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal',
            run: { bold: true, size: 24, color: "000000", font: FONT_FACE }, // <--- Font for Headings
            paragraph: { spacing: { after: 120 } },
          }],
          default: {
            document: {
              run: {
                font: FONT_FACE, // <--- Default font fallback
              }
            }
          }
        },
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Radiology_Report_${(patientName || 'Report').replace(/ /g, '_')}.docx`);
      toast.success('Word file downloaded');
    } catch (error) {
      console.error('Error generating Word document:', error);
      toast.error('Failed to generate Word document');
    }
  };


  // --- NEW FUNCTION: Insert Macro Directly ---
  const handleInsertMacro = (text) => {
    if (!editor) return;
    isProgrammaticUpdate.current = true;
    // Insert content and add a space after
    editor.chain().focus().insertContent(text + ' ').run();
    // Sync state
    setEditorContent(editor.getHTML());
    // Close modal and notify
    setShowMacroModal(false);
    toast.success("Macro inserted into editor");
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
        if (args.question) {
          handleSendMessage(args.question);
          // 2. Switch to the Co-pilot tab so the user sees the answer.
          setActiveAiTab('copilot');
        } else {
          console.warn("askCopilot called without a question:", args);
        }
        break;

      case "analyzeImages":
        if (images.length > 0) {
          analyzeImages();
        } else {
          toast.error("Please upload images first.");
        }
        break;

      // ⚡ NEW OPTIMIZED CASE
      // This is called directly by localIntentParser when it finds a macro match
      // case "insertFindings":
      //   if (args.findingToInsert) {
      //       insertFindings(args.findingToInsert);
      //       toast.success(`Inserted: ${args.findingToInsert.findingName}`);
      //   }
      //   break;

      case "handleLocalSearch": // <--- NEW CASE
        // This will trigger your local findings search
        await handleLocalSearch(args.query);
        // Also ensure the "Search" tab is active if it's not already
        setActiveAiTab('search');
        break;

      case "handleAiFindingsSearch": // <--- NEW CASE
        // This will trigger your AI findings search
        // await handleAiFindingsSearch(args.query);
        handleAiFindingsSearch(args.query);
        // Also ensure the "AI Findings" tab (or main search tab) is active
        setActiveAiTab('search'); // Assuming AI findings is part of the 'search' tab
        break;

      case "handleAiKnowledgeSearch":
        await handleAiKnowledgeSearch(true, args.query);
        setActiveAiTab('knowledge')
        break;

      case "insertMacro":
        // 🟢 OPTIMIZED PATH: The local parser already found the text!
        if (args._directContent) {
          isProgrammaticUpdate.current = true;
          editor.chain().focus().insertContent(args._directContent + ' ').run();
          setEditorContent(editor.getHTML());
          toast.success(`Inserted macro: ${args.macroName}`);
          return;
        }

        // Fallback Path (if triggered by Cloud API which only sends macroName)
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

      case "insertFindings": // <--- NEW CASE for Standard Findings (from findings.js)
        if (args.findingToInsert) {
          insertFindings(args.findingToInsert);
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

  const {
    voiceStatus,
    interimTranscript,
    error: voiceError, // Renamed to avoid conflicts
    isDictationSupported,
    handleToggleListening
  } = useVoiceAssistant({
    geminiTools,
    onFunctionCall: executeFunctionCall,
    onPlainText: insertPlainText,
    userMacros: macros, // <--- 🟢 CRITICAL ADDITION: Pass User Macros
    isMagicMode: true // <--- Set this to TRUE to get the Quillr behavior
  });

  // --- MODIFIED ERROR HANDLER ---
  useEffect(() => {
    if (voiceError) {
      // 1. Show a visible popup so you know WHY it failed
      toast.error(voiceError, {
        duration: 5000,
        icon: '🚫',
        style: {
          border: '1px solid #EF4444',
          padding: '16px',
          color: '#EF4444',
        },
      });

      // 2. Also set the internal error state
      setError(voiceError);

      // 3. Log specifically for debugging
      console.error("Voice Assistant Error Triggered:", voiceError);
    }
  }, [voiceError]);


  const shortcuts = {
    toggleMic: { label: 'Toggle Microphone', ctrlOrCmd: true, key: 'm', action: handleToggleListening },

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




  // // --- Wake Word Listener ---
  // const WAKE_WORD = "hey airad"; 

  // useEffect(() => {
  //   // We listen when Wake Word Mode is ON AND we have speech input
  //   if (isWakeWordMode && voiceStatus === 'listening' && interimTranscript) {

  //     const spokenText = interimTranscript.toLowerCase();

  //     if (spokenText.includes(WAKE_WORD)) {
  //       // 1. Visual Feedback
  //       toast.success("AI Assistant Activated!", { 
  //         icon: '🤖',
  //         style: { borderRadius: '10px', background: '#333', color: '#fff' },
  //         duration: 2000
  //       });

  //       // 2. Open the Assistant Modal
  //       setShowAssistantModal(true);

  //       // 3. Optional: Turn OFF wake word mode if you only want it to trigger once
  //       // setIsWakeWordMode(false); 

  //       // 4. Cleanup: Remove the wake word from the editor text
  //       if (editor) {
  //         const currentContent = editor.getText();
  //         if (currentContent.trim().toLowerCase().endsWith(WAKE_WORD)) {
  //             const endPos = editor.state.doc.content.size;
  //             const startPos = Math.max(0, endPos - WAKE_WORD.length - 5); 
  //             editor.commands.deleteRange({ from: startPos, to: endPos }).run();
  //         }
  //       }
  //     }
  //   }
  // }, [interimTranscript, voiceStatus, editor, isWakeWordMode, setShowAssistantModal]);


  // --- CONDITIONAL RENDERING ---
  if (isAuthLoading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  const TableControls = ({ editor }) => {
    if (!editor) return null;

    // Only show when user is inside a table
    const isInTable = editor.isActive('table');
    if (!isInTable) return null;

    return (
      <div className="flex flex-wrap gap-1 p-2 bg-muted border-b border-border text-foreground rounded-md mb-2">
        <button
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className="px-2 py-1 bg-muted/80 hover:bg-muted text-foreground rounded transition-colors"
        >
          + Col Left
        </button>

        <button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className="px-2 py-1 bg-muted/80 hover:bg-muted text-foreground rounded transition-colors"
        >
          + Col Right
        </button>

        <button
          onClick={() => editor.chain().focus().addRowBefore().run()}
          className="px-2 py-1 bg-muted/80 hover:bg-muted text-foreground rounded transition-colors"
        >
          + Row Above
        </button>

        <button
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className="px-2 py-1 bg-muted/80 hover:bg-muted text-foreground rounded transition-colors"
        >
          + Row Below
        </button>

        <button
          onClick={() => editor.chain().focus().deleteColumn().run()}
          className="px-2 py-1 bg-red-700 hover:bg-red-600 rounded"
        >
          Delete Column
        </button>

        <button
          onClick={() => editor.chain().focus().deleteRow().run()}
          className="px-2 py-1 bg-red-700 hover:bg-red-600 rounded"
        >
          Delete Row
        </button>

        <button
          onClick={() => editor.chain().focus().deleteTable().run()}
          className="px-2 py-1 bg-red-800 hover:bg-red-700 rounded"
        >
          Delete Table
        </button>

        <button
          onClick={() => editor.chain().focus().mergeCells().run()}
          className="px-2 py-1 bg-muted/80 hover:bg-muted text-foreground rounded transition-colors"
        >
          Merge Cells
        </button>

        <button
          onClick={() => editor.chain().focus().splitCell().run()}
          className="px-2 py-1 bg-muted/80 hover:bg-muted text-foreground rounded transition-colors"
        >
          Split Cell
        </button>
      </div>
    );
  };



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

    <div className="fixed inset-0 bg-background text-foreground font-sans flex flex-col overflow-hidden selection:bg-primary/20 transition-colors duration-300">
      {/* --- AURORA BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      </div>

      {/* Content wrapper relative z-10 to sit above background */}
      <div className="relative z-10 flex flex-col flex-1 overflow-hidden">
        {/* <style>{` */}
        {/* .tiptap { flex-grow: 1; padding: 1rem; outline: none; }
  .tiptap p.is-editor-empty:first-child::before {
    color: #64748b;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  .tiptap h3, .tiptap strong { color: #e2e8f0; }
  .tiptap ul, .tiptap ol { padding-left: 1.2rem; }
  .tiptap ul { list-style-type: disc; }
  .tiptap ol { list-style-type: decimal; }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #0f172a; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #475569; } */}

        {/* /* ======================== */
  /* ✨ TIPTAP TABLE STYLING  */
  /* ======================== */}

        {/* .tiptap table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0.75rem 0;
  } */}

        {/* .tiptap th,
  .tiptap td {
    border: 1px solid #475569;  
    padding: 6px 8px;
    vertical-align: top;
    color: #e2e8f0;             
  } */}

        {/* .tiptap th {
    background-color: #1e293b;  
    font-weight: 600;
  } */}


        {/* .tiptap .selectedCell::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(59, 130, 246, 0.25);
    pointer-events: none;
  } */}

        {/* .tiptap .column-resize-handle {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: -2px;
    width: 4px;
    background-color: #3b82f6; 
    pointer-events: none;
  } */}
        {/* `}</style> */}
        <style>{`
  .tiptap { flex-grow: 1; padding: 1rem; outline: none; }
  .tiptap p.is-editor-empty:first-child::before {
    color: #64748b;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  .tiptap h3, .tiptap strong { color: #e2e8f0; }

  /* Normalize paragraph + table spacing in the editor */
  .tiptap p {
    margin: 0 0 0.5rem 0;      /* 8px bottom */
  }

  /* RESTORE LIST STYLES */
  .tiptap ul {
    list-style-type: disc;
    padding-left: 1.5em;
    margin: 0.5em 0;
  }
  .tiptap ol {
    list-style-type: decimal;
    padding-left: 1.5em;
    margin: 0.5em 0;
  }
  .tiptap li {
    margin-bottom: 0.25em;
  }

  .tiptap table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0.5rem 0;          /* 8px above & below */
  }

  .tiptap th,
  .tiptap td {
    border: 1px solid hsl(var(--border));
    padding: 6px 8px;
    vertical-align: top;
    color: hsl(var(--foreground));
  }

  .tiptap th {
    background-color: hsl(var(--muted));
    border-bottom: 2px solid hsl(var(--primary) / 0.3);
    font-weight: 600;
  }

  .tiptap .selectedCell::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(59, 130, 246, 0.25);
    pointer-events: none;
  }

  .tiptap .column-resize-handle {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: -2px;
    width: 4px;
    background-color: #3b82f6;
    pointer-events: none;
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #475569; }

  /* ======================== */
  /*  REPORT PREVIEW (prose)  */
  /* ======================== */

  /* Override Tailwind Typography default margins */
  .prose p {
    margin: 0 0 0.5rem 0;      /* same as editor */
  }

  .prose table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0.5rem 0;          /* same as editor */
  }

  .prose th,
  .prose td {
    border: 1px solid hsl(var(--border));
    padding: 6px 8px;
    vertical-align: top;
    color: hsl(var(--foreground));
  }

  .prose th {
    background-color: hsl(var(--muted) / 0.5);
    font-weight: 600;
  }
`}</style>





        {/* HEADER */}
        <header className="h-14 flex-shrink-0 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-3 z-50 relative shadow-sm transition-colors duration-300">
          <div className="flex items-center space-x-3">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-200"></div>
              <img src={appLogo} alt="Logo" className="relative h-8 w-8 rounded shadow-sm bg-black" />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 tracking-tight leading-none">aiRAD</h1>
              <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Reporting, Redefined.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar">

            <div className="h-5 w-px bg-border mx-1 flex-shrink-0" />

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground transition flex-shrink-0"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button onClick={handleToggleListening} disabled={!isDictationSupported} className={`p-1.5 rounded-full flex-shrink-0 transition-all ${voiceStatus === 'listening' ? 'bg-destructive/20 text-destructive ring-1 ring-destructive animate-pulse' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
              {voiceStatus === 'listening' ? <Mic size={18} /> : <Mic size={18} />}
            </button>
            <button onClick={() => setShowAssistantModal(true)} title="AI Assistant" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-primary transition flex-shrink-0"><Wand2 size={18} /></button>
            <button onClick={() => setShowDataModal(true)} title="Extracted Data" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-primary transition flex-shrink-0"><ListPlus size={18} /></button>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button onClick={() => setShowShortcutsModal(true)} className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"><Zap size={18} /></button>
              <button onClick={() => setShowMacroModal(true)} className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"><MessageSquare size={18} /></button>
              <button onClick={() => setShowTemplateModal(true)} className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"><FileText size={18} /></button>
            </div>
            <div className="h-5 w-px bg-border mx-1 flex-shrink-0" />
            {/* 🛡️ ADMIN PANEL BUTTON (Only visible to Admins) */}
            {userRole === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                title="Open Admin Panel"
                className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-purple-500 transition flex-shrink-0"
              >
                <Shield size={18} />
              </button>
            )}
            {/* NEW SETTINGS BUTTON */}
            {/* <button
              onClick={() => setShowBrandingModal(true)}
              title="Report Branding Settings"
              className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition flex-shrink-0"
            >
              <Settings size={18} />
            </button> */}
            <button onClick={() => setShowProfile(true)} className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-blue-500 transition flex-shrink-0" title="Profile"><User size={18} /></button>
            <button onClick={handleSignOut} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition flex-shrink-0"><LogOut size={18} /></button>
          </div>
        </header>
        {/* SYSTEM ANNOUNCEMENT BANNER */}
        {systemAnnouncement && isAnnouncementVisible && (
          <div className={`w-full px-4 py-2.5 flex items-start justify-center gap-3 text-sm font-medium animate-in slide-in-from-top-5 relative shadow-md z-40 ${systemAnnouncement.type === 'critical' ? 'bg-destructive text-destructive-foreground' :
            systemAnnouncement.type === 'warning' ? 'bg-amber-500 text-black' :
              'bg-primary text-primary-foreground'
            }`}>
            {/* Icon */}
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />

            {/* Message */}
            <span className="flex-1 text-left whitespace-pre-wrap break-words">{systemAnnouncement.message}</span>

            {/* Close Button */}
            <button
              onClick={() => setIsAnnouncementVisible(false)}
              className="absolute right-2 top-2 p-1.5 rounded-full hover:bg-black/10 transition-colors"
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {isRestricted && (
          <div className="bg-yellow-900/30 border-b border-yellow-500/20 text-yellow-200 text-xs py-1 text-center flex-shrink-0">
            Free limit reached. <button onClick={handleUpgrade} className="underline font-bold hover:text-white">Upgrade to Pro</button>
          </div>
        )}



        {/* MAIN LAYOUT */}
        <main className="flex-1 flex overflow-hidden min-h-0 relative">

          {/* LEFT SIDEBAR */}
          <aside className={`w-full lg:w-80 bg-background/60 backdrop-blur-xl border-r border-border flex flex-col z-20 transition-all duration-300 ${mobileView === 'case' ? 'absolute inset-0 z-20 lg:static' : 'hidden lg:flex'}`}>
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              <SidePanel title="Patient & Exam" icon={User}>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-primary/80 mb-1 block">Patient Name</label>
                    <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="sidebar-input" placeholder="Name" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-primary/80 mb-1 block">Patient ID</label>
                    <input type="text" value={patientId} onChange={e => setPatientId(e.target.value)} className="sidebar-input" placeholder="ID" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-primary/80 mb-1 block">Age</label>
                      <input type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="sidebar-input" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-primary/80 mb-1 block">Gender</label>
                      <select value={patientGender} onChange={e => setPatientGender(e.target.value)} className="sidebar-input">
                        <option value="Male" className="bg-card text-foreground">Male</option>
                        <option value="Female" className="bg-card text-foreground">Female</option>
                        <option value="Other" className="bg-card text-foreground">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-black tracking-widest text-primary/80 mb-1 block">Date</label>
                      <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="sidebar-input" />
                    </div>
                  </div>
                </div>
              </SidePanel>

              <SidePanel title="Report Template" icon={FileText}>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-primary/80 mb-1 block">Modality</label>
                    <select value={modality} onChange={e => { const m = e.target.value; const t = Object.keys(allTemplates[m])[0]; setModality(m); setTemplate(t); isProgrammaticUpdate.current = true; if (editor) editor.commands.setContent(allTemplates[m][t] || ''); setEditorContent(allTemplates[m][t] || ''); }} className="sidebar-input">
                      {Object.keys(allTemplates).map(m => <option key={m} value={m} className="bg-card text-foreground">{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-primary/80 mb-1 block">Template</label>
                    <select
                      value={template}
                      onChange={e => {
                        const t = e.target.value;
                        setTemplate(t);
                        isProgrammaticUpdate.current = true;

                        // Check in standard templates first, then user templates
                        const content = allTemplates[modality]?.[t] || userTemplates[modality]?.[t] || '';

                        if (editor) editor.commands.setContent(content);
                        setEditorContent(content);
                      }}
                      className="sidebar-input"
                    >
                      <optgroup label="Standard Templates" className="bg-card text-foreground font-bold text-xs uppercase tracking-wider">
                        {modality && Object.keys(allTemplates[modality] || {}).map(t => <option key={`std-${t}`} value={t} className="bg-muted text-foreground font-normal pl-4">{t}</option>)}
                      </optgroup>
                      {userTemplates[modality] && Object.keys(userTemplates[modality]).length > 0 && (
                        <optgroup label="My Templates" className="bg-card text-foreground font-bold text-xs uppercase tracking-wider">
                          {Object.keys(userTemplates[modality]).map(t => <option key={`usr-${t}`} value={t} className="bg-muted text-foreground font-normal pl-4">{t}</option>)}
                        </optgroup>
                      )}
                    </select>
                  </div>
                </div>
              </SidePanel>

              {modality === 'Ultrasound' && (
                <MeasurementsPanel measurements={dynamicMeasurements} organs={templateOrgans} onInsert={handleInsertMeasurements} CollapsibleSidePanel={CollapsibleSidePanel} />
              )}

              {userRole === 'admin' &&
                <SidePanel title="AI Analysis" icon={Upload}>
                  <div {...getRootProps()} className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}>
                    <input {...getInputProps()} />
                    <Upload className={`w-8 h-8 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="text-muted-foreground text-xs font-bold uppercase">Drop Images / PDFs (or Paste)</p>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {images.map((img, index) => (
                        <div key={index} className="relative group aspect-square cursor-pointer border border-border rounded-lg overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all" onClick={() => openModal(index)}>
                          {/* Handle PDF Visualization vs Image */}
                          {img.type === 'application/pdf' ? (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <FileIcon size={24} className="text-destructive" />
                              <span className="text-[8px] absolute bottom-1 text-destructive font-bold">PDF</span>
                            </div>
                          ) : (
                            <img src={img.src} className="w-full h-full object-cover" alt="preview" />
                          )}

                          {/* Remove Button - Always visible (removed opacity-0) */}
                          <button
                            onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 p-1 rounded-md transition-colors z-10 shadow-sm"
                            title="Remove"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea value={clinicalContext} onChange={e => setClinicalContext(e.target.value)} rows="3" className="sidebar-input resize-none" placeholder="Clinical context..." />
                  <button onClick={analyzeImages} disabled={userRole !== 'admin' && isAiLoading || images.length === 0} className="w-full mt-2 py-2 btn-premium text-white text-xs font-black uppercase tracking-widest rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    {isAiLoading ? <span className="animate-pulse">Scanning...</span> : (
                      <span className="flex items-center justify-center gap-2">
                        <Upload size={14} /> Analyze Findings
                      </span>
                    )}
                  </button>
                </SidePanel>}
              <button
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-muted-foreground hover:bg-muted hover:text-foreground mt-2"
              >
                <Settings className="w-5 h-5" />
                {isSidebarOpen && <span className="font-medium text-sm">Settings</span>}
              </button>
              <RecentReportsPanel onSelectReport={handleSelectRecentReport} user={user} onViewHistory={() => setShowHistoryModal(true)} />
            </div>
          </aside>

          {/* CENTER WORKSPACE */}
          <section className={`flex-1 flex flex-col min-w-0 bg-transparent relative ${mobileView === 'workspace' ? 'absolute inset-0 z-20 lg:static' : 'hidden lg:flex'}`}>
            <div className="flex-1 flex flex-col m-2 lg:m-0 lg:border-r lg:border-border bg-card/50 backdrop-blur-xl rounded-lg lg:rounded-none overflow-hidden shadow-sm">
              <div className="px-2 pt-2">
                <AlertPanel alertData={activeAlert}
                  onAcknowledge={() => { setActiveAlert(null); setIsAwaitingAlertAcknowledge(false); }}
                  onInsertMacro={() => { if (editor && activeAlert?.type === 'critical') { isProgrammaticUpdate.current = true; editor.chain().focus().insertContent(`<p><strong>${activeAlert.data.reportMacro}</strong></p>`).run(); setEditorContent(editor.getHTML()); } setActiveAlert(null); setIsAwaitingAlertAcknowledge(false); }}
                  onFix={handleFixInconsistency}
                  onProceed={() => { setActiveAlert(null); setIsAwaitingAlertAcknowledge(false); generateFinalReport(true); }}
                  onInsertGuideline={() => { if (editor && activeAlert?.type === 'guideline') { isProgrammaticUpdate.current = true; editor.chain().focus().insertContent(`<p><strong>RECOMMENDATION:</strong> ${activeAlert.data.recommendationText}</p>`).run(); setEditorContent(editor.getHTML()); } setActiveAlert(null); setIsAwaitingAlertAcknowledge(false); }}
                />
              </div>
              <MenuBar editor={editor} voiceStatus={voiceStatus} isDictationSupported={isDictationSupported} handleToggleListening={handleToggleListening} interimTranscript={interimTranscript} />
              <div className="flex items-center justify-end space-x-3 px-4 py-1.5 border-b border-white/5 bg-black/20 backdrop-blur-sm">
                <button onClick={() => handleGetSuggestions('differentials')} disabled={!editorContent} className="text-[10px] font-bold uppercase tracking-wider text-yellow-500 hover:text-yellow-400 disabled:opacity-30 flex items-center transition-colors"><Lightbulb size={12} className="mr-1.5" />Differentials</button>
                <div className="h-3 w-px bg-white/10"></div>
                <button onClick={() => handleGetSuggestions('recommendations')} disabled={!editorContent} className="text-[10px] font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 disabled:opacity-30 flex items-center transition-colors"><ListPlus size={12} className="mr-1.5" />Recommendations</button>
              </div>
              <div className="flex-1 overflow-y-auto bg-transparent cursor-text selection:bg-indigo-500/30" onClick={() => editor?.commands.focus()}>
                <TableControls editor={editor} />
                <EditorContent editor={editor} className="tiptap min-h-[500px]" />

                {/* <EditorContent editor={editor} className="tiptap min-h-full" /> */}
              </div>
              <div className="p-3 bg-card border-t border-border">
                <button onClick={() => generateFinalReport()} disabled={isLoading || !editorContent}
                  className="w-full py-3 btn-action-primary rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                  {isLoading ? <span className="animate-pulse">Finalizing...</span> : (
                    <span className="flex items-center justify-center gap-2">
                      <Eye size={18} className="group-hover:scale-110 transition-transform" /> Generate Final Report
                    </span>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside className={`w-full lg:w-80 bg-muted/30 backdrop-blur-xl border-l border-border flex flex-col z-20 transition-all duration-300 ${mobileView === 'ai' ? 'absolute inset-0 z-20 lg:static' : 'hidden lg:flex'}`}>
            <div className="p-3 bg-card/50 border-b border-border">
              <div className="relative grid grid-cols-3 p-1 bg-muted rounded-xl border border-border">
                {/* Gliding Pill */}
                <div className={`absolute top-1 bottom-1 w-[calc(33.33%-0.33rem)] bg-primary rounded-lg shadow-lg shadow-primary/20 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeAiTab === 'copilot' ? 'left-1' :
                  activeAiTab === 'search' ? 'left-1/2 -translate-x-1/2' :
                    'right-1'
                  }`}></div>

                <button onClick={() => setActiveAiTab('copilot')} className={`relative z-10 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors duration-300 ${activeAiTab === 'copilot' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Co-pilot</button>
                <button onClick={() => setActiveAiTab('search')} className={`relative z-10 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors duration-300 ${activeAiTab === 'search' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Search</button>
                <button onClick={() => setActiveAiTab('knowledge')} className={`relative z-10 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors duration-300 ${activeAiTab === 'knowledge' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Knowledge</button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative flex flex-col">
              {activeAiTab === 'copilot' && (
                <div className="flex-1 flex flex-col h-full animate-fade-in-up">
                  <AiConversationPanel history={conversationHistory} onSendMessage={handleSendMessage} isReplying={isAiReplying} userInput={userInput} setUserInput={setUserInput} />
                </div>
              )}
              {activeAiTab === 'search' && (
                <div className="flex-1 flex flex-col p-3 overflow-hidden h-full animate-fade-in-up"> {/* Added h-full */}
                  {/* Search Input */}
                  {/* Search Input */}
                  <div className={`flex items-center gap-2 mb-4 p-1.5 rounded-xl border transition-all duration-300 group flex-shrink-0 ${isSearching || searchQuery ? 'bg-background border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-primary/20' : 'bg-muted border-input hover:border-ring'}`}>
                    <Search size={16} className={`ml-1.5 transition-colors duration-300 ${isSearching || searchQuery ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                    <input
                      ref={localSearchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLocalSearch(searchQuery)}
                      placeholder="Search findings (Local or AI)..."
                      className="flex-1 bg-transparent border-none text-xs text-foreground placeholder-muted-foreground focus:ring-0 outline-none h-8"
                    />
                    <button
                      onClick={() => handleLocalSearch(searchQuery)}
                      className="p-1.5 bg-secondary hover:bg-primary text-secondary-foreground hover:text-primary-foreground rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
                      title="Search"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* AI Search Buttons */}
                  <div className="flex-shrink-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAiFindingsSearch(searchQuery)}
                      disabled={isSearching || !searchQuery}
                      className="w-full text-[10px] font-black uppercase tracking-wider py-2.5 btn-premium text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSearching && !aiKnowledgeLookupResult && !allAiFullReports.length ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div> : <Search size={14} />}
                      <span>AI Findings</span>
                    </button>
                    <button
                      onClick={() => handleAiKnowledgeSearch(false, searchQuery)}
                      disabled={isSearching || !searchQuery}
                      className="w-full text-[10px] font-black uppercase tracking-wider py-2.5 btn-glass text-foreground hover:text-white hover:bg-primary rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                    >
                      {isSearching && aiKnowledgeLookupResult ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-primary"></div> : <BookOpen size={14} />}
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
                          <div key={`local-${index}`} className="p-3 bg-card border border-border/50 relative space-y-1.5"> {/* Added space-y */}
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
                                <div dangerouslySetInnerHTML={{ __html: allAiFullReports[currentReportPage].fullReportText }} />
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
                          <button onClick={handlePreviousReport} disabled={currentReportPage === 0} className="px-2 py-1 bg-muted hover:bg-muted/80 rounded transition-colors disabled:opacity-50 flex items-center"><ChevronLeft size={14} className="mr-0.5" /> Prev</button>
                          <span className="text-slate-400">Ver {currentReportPage + 1} / {allAiFullReports.length}</span>
                          <button onClick={handleNextReport} disabled={isSearching} className="px-2 py-1 bg-muted hover:bg-muted/80 rounded transition-colors disabled:opacity-50 flex items-center">Next <ChevronRight size={14} className="ml-0.5" /></button>
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
                          <button onClick={handlePreviousPage} disabled={currentAiPage === 0} className="px-2 py-1 bg-muted hover:bg-muted/80 rounded transition-colors disabled:opacity-50 flex items-center"><ChevronLeft size={14} className="mr-0.5" /> Prev</button>
                          <span className="text-slate-400">Page {currentAiPage + 1} / {allAiSearchResults.length}</span>
                          <button onClick={handleNextPage} disabled={isSearching} className="px-2 py-1 bg-muted hover:bg-muted/80 rounded transition-colors disabled:opacity-50 flex items-center">More <ChevronRight size={14} className="ml-0.5" /></button>
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
              {activeAiTab === 'knowledge' && (
                <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                  <KnowledgeLookupPanel result={aiKnowledgeLookupResult} onClose={() => { setAiKnowledgeLookupResult(null); setActiveAiTab('search'); }} onInsert={(c) => { if (editor) { editor.chain().focus().insertContent(c).run(); setEditorContent(editor.getHTML()); setActiveAiTab('search'); } }} />
                </div>
              )}
            </div>
            <div className="flex-shrink-0 p-2 border-t border-slate-800 bg-slate-900">
              <AiSuggestedMeasurementsPanel measurements={aiMeasurements} onInsert={handleInsertMeasurement} onClear={() => setAiMeasurements([])} />
            </div>
          </aside>
        </main>


        {/* ================================================= */}
        {/* ========= ADD THE AI ASSISTANT MODAL HERE ========= */}
        {/* ================================================= */}
        {showAssistantModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0f1c]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-indigo-500/10 w-full max-w-3xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5 rounded-t-2xl">
                <h3 className="text-lg font-bold flex items-center text-slate-100">
                  <Wand2 size={20} className="mr-2 text-indigo-400" /> AI Assistant
                </h3>
                <button onClick={() => setShowAssistantModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <XCircle size={24} />
                </button>
              </div>

              {/* Mode Tabs */}
              <div className="flex p-2 bg-slate-900 border-b border-slate-800 gap-2 overflow-x-auto">
                {['correction', 'template', 'simplify'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setAssistantMode(mode)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${assistantMode === mode
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                  >
                    {mode === 'correction' && 'Correction & QA'}
                    {mode === 'template' && 'Smart Template'}
                    {mode === 'simplify' && 'Patient Summary'}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="p-6 flex-grow overflow-y-auto">
                <div className="mb-4">
                  <label className="text-sm font-medium text-blue-400 mb-2 block flex items-center gap-2">
                    {assistantMode === 'correction' && <><CheckCircle size={16} /> Paste Report to Correct:</>}
                    {assistantMode === 'template' && <><FileText size={16} /> Enter Topic (e.g. 'MRI Knee'):</>}
                    {assistantMode === 'simplify' && <><UserCheck size={16} /> Report to Simplify (leave empty to use Editor):</>}
                  </label>
                  <textarea
                    value={assistantQuery}
                    onChange={(e) => setAssistantQuery(e.target.value)}
                    rows="10"
                    className="w-full p-4 bg-muted/40 border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all placeholder:text-muted-foreground font-mono"
                    placeholder={
                      assistantMode === 'correction' ? "Paste findings here..." :
                        assistantMode === 'template' ? "e.g., CT Abdomen for 45M with pain..." :
                          "Paste medical text here..."
                    }
                  />
                </div>

                {/* Context Indicator */}
                <div className="text-xs text-slate-500 bg-slate-900/50 p-2 rounded border border-slate-800 flex items-center gap-2">
                  <BrainCircuit size={12} />
                  <span>Active Context: <strong>{patientAge}y {patientName}</strong> ({modality})</span>
                </div>
              </div>

              {/* Footer / Actions */}
              <div className="p-4 bg-muted/50 border-t border-border flex justify-end gap-3 rounded-b-xl">
                {error && <span className="text-red-400 text-xs flex items-center mr-auto"><AlertTriangle size={12} className="mr-1" /> {error}</span>}

                {assistantMode === 'correction' && (
                  <button
                    onClick={handleCorrectReport}
                    disabled={isLoading || !assistantQuery}
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-green-900/20 disabled:opacity-50 flex items-center"
                  >
                    {isLoading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div> : <CheckCircle size={18} className="mr-2" />}
                    Correct & Standardize
                  </button>
                )}

                {assistantMode === 'template' && (
                  <button
                    onClick={handleGenerateTemplate}
                    disabled={isLoading || !assistantQuery}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 flex items-center"
                  >
                    {isLoading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div> : <PlusCircle size={18} className="mr-2" />}
                    Generate Smart Template
                  </button>
                )}

                {assistantMode === 'simplify' && (
                  <button
                    onClick={handleSimplifyReport}
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 flex items-center"
                  >
                    {isLoading ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div> : <UserCheck size={18} className="mr-2" />}
                    Generate Patient Summary
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* ========= ADD THE SUGGESTIONS MODAL HERE ========= */}
        {/* ================================================= */}
        {showSuggestionsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0f1c]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-indigo-500/10 w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5 rounded-t-2xl">
                <h3 className="text-lg font-bold capitalize text-slate-100">
                  {suggestionType === 'differentials' ? 'Suggested Differentials' : 'Suggested Recommendations'}
                </h3>
                <button onClick={() => setShowSuggestionsModal(false)} className="text-gray-400 hover:text-white">
                  <XCircle />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-grow min-h-[200px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {isSuggestionLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
                  </div>
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{aiSuggestions}</p>
                )}
              </div>
              <div className="p-4 border-t border-white/5 flex justify-end space-x-2 bg-black/20 rounded-b-2xl">
                <button
                  onClick={() => setShowSuggestionsModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition text-sm border border-white/5"
                >
                  Close
                </button>
                <button
                  onClick={appendSuggestionsToReport}
                  disabled={isSuggestionLoading || !aiSuggestions}
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition disabled:opacity-50 text-sm shadow-lg shadow-indigo-900/20"
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* Adjusted max-w-2xl for a bit more space than xl but less than 4xl */}
            <div className="bg-[#0a0f1c]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-indigo-500/10 w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
              {/* Header remains structurally similar */}
              <div className="p-4 border-b border-white/5 flex justify-between items-center flex-shrink-0 bg-white/5 rounded-t-2xl">
                <h3 className="text-lg font-bold flex items-center text-slate-100">
                  <ListPlus size={18} className="mr-2 text-indigo-400" /> Extracted Data Summary
                </h3>
                <button onClick={() => setShowDataModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <XCircle />
                </button>
              </div>

              {/* Content Area: Changed background, text color, and using prose */}
              <div className="p-6 overflow-y-auto bg-transparent text-slate-300 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {isExtracting && (
                  <div className="flex items-center text-sm text-indigo-400">
                    {/* Spinner for loading state */}
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400 mr-2"></div>
                    Extracting...
                  </div>
                )}
                {!isExtracting && Object.keys(structuredData).length === 0 && (
                  <p className="text-sm text-slate-500 italic">No data extracted yet. Type in the editor.</p>
                )}
                {!isExtracting && Object.keys(structuredData).length > 0 && (
                  <dl className="space-y-2">
                    {Object.entries(structuredData).map(([key, value]) => (
                      <div key={key} className="border-b border-white/5 pb-1">
                        <dt className="font-semibold capitalize text-indigo-300">{key.replace(/([A-Z])/g, ' $1')}:</dt>
                        <dd className="ml-4 text-slate-300 break-words">{value.toString()}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>

              {/* Footer remains structurally similar */}
              <div className="p-3 bg-black/20 border-t border-white/5 flex justify-end flex-shrink-0 rounded-b-2xl">
                <button
                  onClick={() => setShowDataModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition text-sm border border-white/5"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}


        {/* ============== MODALS & FLOATING BUTTONS ============== */}
        {isModalOpen && (<ImageModal images={images} currentIndex={currentImageIndex} onClose={closeModal} onNext={showNextImage} onPrev={showPrevImage} />)}

        {showTemplateModal && (
          <TemplateManagerModal
            user={user}
            existingModalities={Object.keys(templates)}
            onClose={() => setShowTemplateModal(false)}
            onInsert={handleInsertTemplate} // <--- Pass the handler
          />
        )}
        {showShortcutsModal && <ShortcutsHelpModal shortcuts={shortcuts} onClose={() => setShowShortcutsModal(false)} />}

        {/* 👇 ADD THIS BLOCK AT THE BOTTOM OF YOUR JSX 👇 */}

        <BrandingModal
          isOpen={showBrandingModal}
          onClose={() => setShowBrandingModal(false)}
          user={user}
          currentLetterhead={letterheadUrl}
          currentWatermark={watermarkUrl}
        />
        {showProfile && <UserProfile user={user} onClose={() => setShowProfile(false)} />}
        {/* FIX #6: New Report Preview Modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0f1c]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-indigo-500/10 w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5 rounded-t-2xl">
                <h3 className="text-lg font-bold text-slate-100">Report Preview</h3>
                <div className="flex items-center space-x-2">
                  {/* Download and copy buttons go here */}
                  <button onClick={() => downloadPdfReport(generatedReport)} disabled={isDownloading} title="Download as PDF" className="p-2 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors"><FileJson size={18} /></button>
                  <button onClick={() => copyToClipboard(generatedReport)} title="Copy Text" className="p-2 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors"><Clipboard size={18} /></button>
                  <button onClick={() => downloadTxtReport(generatedReport)} title="Download as .txt" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition text-slate-300 disabled:opacity-50" disabled={!generatedReport}><FileType size={18} /></button>
                  <button
                    onClick={() => downloadWordReport(generatedReport, patientName)}
                    className="p-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/20"
                    title="Download as .docx"
                  >
                    Download as Word
                  </button>
                  <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-white transition-colors"><XCircle /></button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto bg-white text-black prose prose-headings:text-black prose-p:text-black prose-strong:text-black prose-td:text-black prose-th:text-black hover:prose-a:text-blue-600 prose-a:text-blue-600 max-w-none rounded-b-xl mx-1 mb-1">
                <div dangerouslySetInnerHTML={{ __html: generatedReport }} />
              </div>
            </div>
          </div>
        )}

        {showMacroModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0f1c]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-indigo-500/10 w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-slate-100">Manage Voice Macros</h3>
                <button className="text-slate-400 hover:text-white transition rounded-full p-1" onClick={() => setShowMacroModal(false)}><XCircle size={28} /></button>
              </div>
              <div className="p-6 overflow-y-auto flex-grow space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <h4 className="font-bold text-indigo-400 mb-3 block">Add New Macro</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Voice Command (e.g., 'normal abdomen')"
                      value={newMacroCommand}
                      onChange={(e) => setNewMacroCommand(e.target.value)}
                      className="w-full p-2 border border-slate-700 bg-muted/40 text-foreground rounded-lg outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                    />
                    <textarea
                      placeholder="Text to insert"
                      value={newMacroText}
                      onChange={(e) => setNewMacroText(e.target.value)}
                      className="w-full p-2 border border-slate-700 bg-black/40 text-slate-200 rounded-lg md:col-span-2 outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                      rows="3"
                    ></textarea>
                  </div>
                  <button
                    onClick={handleAddMacro}
                    className="mt-3 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/20"
                  >
                    Add Macro
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-slate-300 mb-3">Existing Macros</h4>
                  <div className="space-y-2">
                    {macros.map((macro) => (
                      <div key={macro.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 hover:border-indigo-500/30 transition-all">
                        <div className="flex-grow mr-4 overflow-hidden">
                          <p className="font-semibold text-sm text-indigo-300 truncate">{macro.command}</p>
                          <p className="text-sm text-slate-400 truncate">{macro.text}</p>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {/* --- NEW BUTTON: Insert Macro --- */}
                          <button
                            onClick={() => handleInsertMacro(macro.text)}
                            className="text-indigo-400 hover:text-white hover:bg-indigo-600/50 p-2 rounded-full transition-colors"
                            title="Insert into editor"
                          >
                            <PlusCircle size={20} />
                          </button>

                          {/* Existing Delete Button */}
                          <button
                            onClick={() => handleDeleteMacro(macro.id)}
                            className="text-red-400 hover:text-white hover:bg-red-600/50 p-2 rounded-full transition-colors"
                            title="Delete macro"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {macros.length === 0 && (
                      <p className="text-slate-500 italic text-center py-4">No macros added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showHistoryModal && (
          <ReportHistoryModal
            isOpen={showHistoryModal}
            onClose={() => setShowHistoryModal(false)}
            onSelectReport={handleSelectRecentReport}
            user={user}
          />
        )}
        {/* // In App.jsx, replace the existing <nav> block */}

        {/* =============================================================================== */}
        {/* ============ UPDATED MOBILE NAVIGATION TABS =================================== */}
        {/* =============================================================================== */}
        <nav className="flex-shrink-0 bg-background border-t border-border flex lg:hidden h-16"> {/* Added h-16 */}
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
        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          user={user}
          onSave={setHospitalSettings}
        />
      </div>
    </div >
  );
};
// 2. CREATE the new App component to handle routing
// src/App.legacy.jsx (Bottom section)

// ... (MainApp definition) ...

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 🌍 ROOT: LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. 🔐 AUTH: LOGIN/SIGNUP PAGE */}
        <Route path="/auth" element={<Auth />} />

        {/* 3. 🏥 MAIN APP: PROTECTED (Requires Login) */}
        {/* We assume MainApp checks for user internally and renders <Auth /> if null. 
            To force the routing logic, we direct users here after login. */}
        <Route path="/app/*" element={<MainApp />} />

        {/* 4. 🛡️ ADMIN PANEL */}
        <Route path="/admin" element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="broadcasts" element={<BroadcastManager />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;