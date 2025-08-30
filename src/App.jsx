// IMPORTANT: This file contains JSX syntax. Please ensure it has a .jsx or .tsx extension (e.g., App.jsx) to avoid build errors.
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Upload, FileText, Clipboard, Settings, BrainCircuit, User, Calendar, Stethoscope, XCircle, FileType, FileJson, Search, PlusCircle, MessageSquare, CheckCircle, ChevronLeft, ChevronRight, Lightbulb, ListPlus, AlertTriangle, FileScan, Mic, Plus, Trash2, Bold, Italic, List, ListOrdered, Pilcrow, BookOpen, Link as LinkIcon, Zap, Copy, UserCheck, LogOut, ChevronDown, History
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import jsPDF from 'jspdf';
import { htmlToText } from 'html-to-text';

// Firebase Imports
import { auth, db } from './firebase'; // Assuming firebase.js is set up
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, serverTimestamp, onSnapshot, query, deleteDoc, doc, getDoc, updateDoc, setDoc, orderBy, limit } from "firebase/firestore";
import Auth from './auth.jsx'; // Your Auth component

// NOTE: findings.js is assumed to be in the same directory.
import { localFindings } from './findings.js';

// --- Diamond Standard Templates (Keep as is) ---
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
        "Lumbar Spine (Non-contrast)": "<h3>IMPRESSION:</h3><p>1. No evidence of acute disc herniation, spinal stenosis, or nerve root compression.</p><p>2. Mild degenerative disc disease.</p><h3>FINDINGS:</h3><p><strong>ALIGNMENT:</strong> Normal lumbar lordosis. No subluxation.</p><p><strong>VERTEBRAL BODIES:</strong> Vertebral body heights and marrow signal are maintained. No acute fracture.</p><p><strong>DISCS:</strong></p><p>[L1-L2 through L3-L4]: No significant disc bulge or herniation.</p><p>[L4-L5]: Mild disc bulge without significant canal or foraminal stenosis.</p><p>[L5-S1]: Mild disc desiccation and height loss without significant herniation.</p><p><strong>SPINAL CANAL AND FORAMINA:</strong> The central canal and neural foramina are patent at all levels.</p><p><strong>CONUS MEDULLARIS:</strong> The conus medullaris terminates at [L1] and is normal in signal.</p><p><strong>PARASPINAL SOFT TISSUES:</strong> Unremarkable.</p>",
    }
};


// --- REUSABLE UI COMPONENTS ---

const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = false, rightContent = null }) => {
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
                <div className="flex items-center">
                    {rightContent}
                    <ChevronDown
                        size={24}
                        className={`text-gray-500 transform transition-transform duration-300 ml-4 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
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
    if (!editor) return null;
    const menuItems = [
        { action: () => editor.chain().focus().toggleBold().run(), disabled: !editor.can().chain().focus().toggleBold().run(), isActive: editor.isActive('bold'), title: 'Bold', icon: Bold },
        { action: () => editor.chain().focus().toggleItalic().run(), disabled: !editor.can().chain().focus().toggleItalic().run(), isActive: editor.isActive('italic'), title: 'Italic', icon: Italic },
        { action: () => editor.chain().focus().setParagraph().run(), isActive: editor.isActive('paragraph'), title: 'Paragraph', icon: Pilcrow },
        { action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList'), title: 'Bullet List', icon: List },
        { action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList'), title: 'Ordered List', icon: ListOrdered },
    ];

    return (
        <div className="flex items-center space-x-1 p-2 bg-gray-100 rounded-t-lg border-b border-gray-300">
            {menuItems.map(({ action, disabled, isActive, title, icon: Icon }) => (
                <button
                    key={title}
                    onClick={action}
                    disabled={disabled}
                    className={`p-2 rounded ${isActive ? 'bg-gray-300' : 'hover:bg-gray-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={title}
                >
                    <Icon size={16} />
                </button>
            ))}
        </div>
    );
};

const AlertPanel = ({ alertData, onAcknowledge, onInsertMacro, onPrepareNotification, onFix }) => {
    if (!alertData) return null;

    const isCritical = alertData.type === 'critical';
    const isFixable = alertData.type === 'inconsistency';

    const config = {
        critical: { bgColor: 'bg-red-50', borderColor: 'border-red-500', textColor: 'text-red-800', iconColor: 'text-red-500', Icon: AlertTriangle, message: 'Please review and take appropriate action immediately.' },
        inconsistency: { bgColor: 'bg-yellow-50', borderColor: 'border-yellow-500', textColor: 'text-yellow-800', iconColor: 'text-yellow-500', Icon: AlertTriangle, title: 'Inconsistency Detected', message: alertData.message },
    };

    const currentConfig = config[alertData.type];
    if (!currentConfig) return null;

    const title = isCritical ? `Critical Finding: ${alertData.data?.findingName}` : currentConfig.title;

    return (
        <div className={`${currentConfig.bgColor} border-l-4 ${currentConfig.borderColor} ${currentConfig.textColor} p-4 rounded-lg shadow-md mb-4`} role="alert">
            <div className="flex items-start">
                <currentConfig.Icon className={`h-6 w-6 ${currentConfig.iconColor} mr-4 mt-1`} />
                <div className="flex-grow">
                    <p className="font-bold">{title}</p>
                    <p className="text-sm">{currentConfig.message}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {isCritical && (
                            <>
                                <button onClick={onInsertMacro} className="bg-red-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-red-700 transition text-sm flex items-center"><PlusCircle size={16} className="mr-1.5" /> Add to Report</button>
                                <button onClick={onPrepareNotification} className="bg-yellow-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-yellow-600 transition text-sm flex items-center"><Copy size={16} className="mr-1.5" /> Prepare Notification</button>
                            </>
                        )}
                        {isFixable && (
                            <>
                                <button onClick={onFix} className="bg-green-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-green-700 transition text-sm flex items-center"><CheckCircle size={16} className="mr-1.5" /> Fix Issue</button>
                                <button onClick={onAcknowledge} className="bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-lg hover:bg-gray-300 transition text-sm flex items-center"><XCircle size={16} className="mr-1.5" /> Ignore</button>
                            </>
                        )}
                    </div>
                </div>
                <button onClick={onAcknowledge} className={`ml-4 ${currentConfig.iconColor} hover:${currentConfig.textColor}`}><XCircle size={22} /></button>
            </div>
        </div>
    );
};

const AiSuggestedMeasurementsPanel = ({ measurements, onInsert, onClear }) => {
    if (!measurements || measurements.length === 0) return null;
    return (
        <div className="bg-blue-50 p-4 rounded-2xl shadow-lg border border-blue-200 mt-6">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-blue-700 flex items-center"><Zap size={20} className="mr-2" />AI-Suggested Measurements</h3>
                <button onClick={onClear} className="text-gray-500 hover:text-gray-800"><XCircle size={22} /></button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {measurements.map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg flex items-center justify-between shadow-sm">
                        <div>
                            <span className="font-semibold text-gray-800">{item.finding}:</span>
                            <span className="ml-2 text-gray-600">{item.value}</span>
                        </div>
                        <button onClick={() => onInsert(item.finding, item.value)} className="bg-blue-100 text-blue-800 font-bold py-1 px-3 rounded-lg hover:bg-blue-200 transition text-sm flex items-center"><Plus size={16} className="mr-1" /> Insert</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const KnowledgeLookupPanel = ({ result, onClose, onInsert }) => {
    if (!result) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700 flex items-center"><BrainCircuit className="mr-3 text-green-500" />Knowledge Lookup: {result.conditionName}</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XCircle size={24} /></button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Summary</h3>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: result.summary }} />
                </div>
                {result.keyImagingFeatures?.length > 0 && (
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Key Imaging Features</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm prose prose-sm max-w-none">
                            {result.keyImagingFeatures.map((feature, index) => <li key={index} dangerouslySetInnerHTML={{ __html: feature.replace(/<\/?li>/g, '') }} />)}
                        </ul>
                    </div>
                )}
                {result.differentialDiagnosis?.length > 0 && (
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Differential Diagnosis</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">{result.differentialDiagnosis.map((dx, index) => <li key={index}>{dx}</li>)}</ul>
                    </div>
                )}
                {result.sources?.length > 0 && (
                     <div>
                        <h4 className="font-bold text-gray-700 mt-4 mb-2 flex items-center"><BookOpen size={16} className="mr-2"/>Sources</h4>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            {result.sources.map((source, index) => (
                                <li key={index}>
                                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{source.name} <LinkIcon size={12} className="inline-block ml-1"/></a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="mt-4 pt-4 border-t">
                <button
                    onClick={() => {
                        const contentToInsert = `<h3>${result.conditionName}</h3><h4>Summary</h4>${result.summary}<h4>Key Imaging Features</h4><ul>${result.keyImagingFeatures.join('')}</ul>`;
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

// --- SKELETON LOADERS ---
const SearchResultSkeleton = () => (
    <div className="mt-3 space-y-3">
        {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-200 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4 mb-3"></div>
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
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
    </div>
);


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


const App = () => {
    // --- AUTH STATE ---
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // --- UI STATE ---
    const [activeTab, setActiveTab] = useState('report'); // 'report', 'search', 'assistant'
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- REPORT DATA STATE ---
    const [patientName, setPatientName] = useState('John Doe');
    const [patientId, setPatientId] = useState('P12345678');
    const [patientAge, setPatientAge] = useState('45');
    const [referringPhysician, setReferringPhysician] = useState('Dr. Evelyn Reed');
    const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
    const [modality, setModality] = useState('Ultrasound');
    const [template, setTemplate] = useState('Abdomen');
    const [images, setImages] = useState([]);
    const [clinicalContext, setClinicalContext] = useState('');
    const [generatedReport, setGeneratedReport] = useState('');
    
    // --- EDITOR & DICTATION ---
    const [userFindings, setUserFindings] = useState('');
    const [voiceStatus, setVoiceStatus] = useState('idle');
    const [interimTranscript, setInterimTranscript] = useState('');
    const recognitionRef = useRef(null);
    const isProgrammaticUpdate = useRef(false);

    // --- AI & SEARCH STATE ---
    const [aiAnalysisStatus, setAiAnalysisStatus] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [localSearchResults, setLocalSearchResults] = useState([]);
    const [aiSearchResults, setAiSearchResults] = useState([]);
    const [aiKnowledgeResult, setAiKnowledgeResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    
    // --- AUTHENTICATION ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            toast.success("Signed out successfully.");
        } catch (error) {
            toast.error("Failed to sign out.");
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start dictating or paste findings here…',
            }),
        ],
        content: userFindings,
        onUpdate: ({ editor }) => {
            if (isProgrammaticUpdate.current) {
                isProgrammaticUpdate.current = false;
                return;
            }
            setUserFindings(editor.getHTML());
        },
    });

    // --- EFFECT to update editor when template changes ---
    useEffect(() => {
        if (editor && !editor.isDestroyed) {
            const initialContent = templates[modality]?.[template] || '';
            if (editor.getHTML() !== initialContent) {
                isProgrammaticUpdate.current = true;
                editor.commands.setContent(initialContent);
                setUserFindings(initialContent); // Sync state
            }
        }
    }, [modality, template, editor]);


    // --- DICTATION LOGIC ---
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition not supported.");
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => setVoiceStatus('listening');
        recognition.onend = () => setVoiceStatus('idle');
        recognition.onerror = (event) => console.error("Speech recognition error", event.error);

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let currentInterim = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript.trim() + ' ';
                } else {
                    currentInterim += event.results[i][0].transcript;
                }
            }
            setInterimTranscript(currentInterim);
            if (finalTranscript && editor) {
                isProgrammaticUpdate.current = true;
                editor.chain().focus().insertContent(finalTranscript).run();
                setUserFindings(editor.getHTML());
            }
        };

        return () => recognition?.stop();
    }, [editor]);

    const handleToggleListening = useCallback(() => {
        if (!recognitionRef.current) return;
        if (voiceStatus !== 'idle') {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    }, [voiceStatus]);

    // --- DATA HANDLING ---
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        const imageObjects = await Promise.all(files.map(file => 
            new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({ 
                        src: URL.createObjectURL(file), 
                        base64: reader.result.split(',')[1], 
                        name: file.name, 
                        type: file.type 
                    });
                };
                reader.readAsDataURL(file);
            })
        ));
        setImages(prev => [...prev, ...imageObjects]);
    };

    const removeImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const handleSelectRecentReport = (report) => {
        // A simple regex to strip the header might be needed if it's complex
        const bodyMatch = report.reportHTML.match(/<\/table>\s*<\/div>([\s\S]*)/);
        const reportBody = bodyMatch ? bodyMatch[1] : report.reportHTML;

        setPatientName(report.patientName);
        setExamDate(report.examDate);
        // You might need to parse other fields if they are stored
        if (editor) {
            isProgrammaticUpdate.current = true;
            editor.commands.setContent(reportBody);
            setUserFindings(reportBody);
        }
        toast.success(`Loaded report for ${report.patientName}`);
    };

    // --- REPORT GENERATION & EXPORT ---
    const generateFinalReport = async () => {
        if (!user) {
            toast.error("You must be logged in to save a report.");
            return null;
        }
        setIsLoading(true);
        const reportBody = editor.getHTML();
        const patientHeader = `
            <div style="padding-bottom: 15px; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px; font-size: 0.9rem;">
                <h3 style="font-size: 1.1em; font-weight: bold; margin-bottom: 10px; color: #1a202c;">Patient Information</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc;">Patient Name</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${patientName}</td><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc;">Patient ID</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${patientId}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc;">Age</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${patientAge}</td><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc;">Exam Date</td><td style="padding: 8px; border: 1px solid #e2e8f0;">${examDate}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background-color: #f8fafc;">Referring Physician</td><td style="padding: 8px; border: 1px solid #e2e8f0;" colspan="3">${referringPhysician}</td></tr>
                </table>
            </div>`;
        
        const fullReport = patientHeader + reportBody;
        setGeneratedReport(fullReport);

        try {
            await addDoc(collection(db, "users", user.uid, "reports"), {
                reportHTML: fullReport,
                patientName,
                examDate,
                createdAt: serverTimestamp()
            });
            toast.success('Report saved to cloud!');
        } catch (e) {
            toast.error('Could not save report to cloud.');
            console.error("Error adding document: ", e);
        } finally {
            setIsLoading(false);
        }
        return fullReport;
    };

    const downloadPdfReport = async () => {
        const reportContent = generatedReport || await generateFinalReport();
        if (!reportContent) return;

        const doc = new jsPDF();
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '170mm';
        tempDiv.innerHTML = reportContent;
        document.body.appendChild(tempDiv);

        doc.html(tempDiv, {
            callback: function (doc) {
                document.body.removeChild(tempDiv);
                doc.save(`Report_${patientName.replace(/ /g, '_')}.pdf`);
                toast.success('PDF downloaded');
            },
            x: 15, y: 15, width: 170, windowWidth: tempDiv.scrollWidth
        });
    };

    // --- RENDER LOGIC ---
    if (isAuthLoading) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading authentication...</div>;
    }
    if (!user) {
        return <Auth />;
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
             <style>{`
                .tiptap { min-height: 250px; border: 1px solid #ccc; border-top: none; border-radius: 0 0 0.5rem 0.5rem; padding: 0.5rem; }
                .tiptap:focus { outline: none; border-color: #3b82f6; }
                .tiptap p.is-editor-empty:first-child::before { color: #adb5bd; content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
                .tiptap ul, .tiptap ol { padding-left: 1.5rem; }
                .tiptap ul { list-style-type: disc; }
                .tiptap ol { list-style-type: decimal; }
            `}</style>
            <Toaster position="top-right" />
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 lg:px-8 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <BrainCircuit className="h-8 w-8 text-blue-600 mr-3" />
                        <h1 className="text-2xl font-bold text-gray-800">aiRAD</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 hidden sm:inline">{user.email}</span>
                        <button onClick={handleSignOut} className="bg-red-500 text-white font-semibold px-3 py-2 rounded-lg hover:bg-red-600 transition shadow-sm flex items-center space-x-2"><LogOut size={16} /> <span className="hidden md:inline">Sign Out</span></button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- LEFT COLUMN: Inputs & Controls --- */}
                <div className="lg:col-span-1 space-y-6">
                    <CollapsibleSection title="Patient & Exam" icon={User} defaultOpen>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-gray-600 text-sm mb-1 block">Patient Name</label>
                                <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full p-2 border rounded-lg"/>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-600 text-sm mb-1 block">Patient ID</label>
                                <input type="text" value={patientId} onChange={e => setPatientId(e.target.value)} className="w-full p-2 border rounded-lg"/>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-600 text-sm mb-1 block">Age</label>
                                <input type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="w-full p-2 border rounded-lg"/>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-600 text-sm mb-1 block">Exam Date</label>
                                <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="w-full p-2 border rounded-lg"/>
                            </div>
                            <div className="md:col-span-2">
                                <label className="font-semibold text-gray-600 text-sm mb-1 block">Referring Physician</label>
                                <input type="text" value={referringPhysician} onChange={e => setReferringPhysician(e.target.value)} className="w-full p-2 border rounded-lg"/>
                            </div>
                        </div>
                    </CollapsibleSection>
                    
                    <CollapsibleSection title="Template" icon={FileText}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-gray-600 text-sm mb-1 block">Modality</label>
                                <select value={modality} onChange={e => {setModality(e.target.value); setTemplate(Object.keys(templates[e.target.value])[0])}} className="w-full p-2 border rounded-lg bg-white">
                                    {Object.keys(templates).map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-600 text-sm mb-1 block">Body Part</label>
                                <select value={template} onChange={e => setTemplate(e.target.value)} className="w-full p-2 border rounded-lg bg-white" disabled={!modality}>
                                    {modality && Object.keys(templates[modality] || {}).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                    </CollapsibleSection>

                    <RecentReportsPanel onSelectReport={handleSelectRecentReport} user={user} />

                    <CollapsibleSection title="Images" icon={Upload}>
                        <div className="p-4 border-2 border-dashed rounded-lg text-center">
                            <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" id="image-upload" multiple />
                            <label htmlFor="image-upload" className="cursor-pointer text-blue-600 font-semibold">Choose image(s)</label>
                            <p className="text-xs text-gray-500 mt-1">or drag & drop</p>
                        </div>
                        {images.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {images.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img src={img.src} alt={`Scan ${index+1}`} className="w-full h-20 object-cover rounded-md"/>
                                        <button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"><XCircle size={18}/></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CollapsibleSection>
                </div>

                {/* --- RIGHT COLUMN: Editor & Output --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">Report Editor</h2>
                        <div className="relative">
                            <MenuBar editor={editor} />
                            <EditorContent editor={editor} />
                            <button
                                onClick={handleToggleListening}
                                title="Toggle Voice Dictation"
                                className={`absolute bottom-3 right-3 w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg transition-colors ${voiceStatus === 'listening' ? 'bg-red-600 animate-pulse' : 'bg-blue-600'}`}
                            >
                                <Mic size={24} />
                            </button>
                        </div>
                         {voiceStatus === 'listening' && interimTranscript && (
                            <div className="mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                <em>{interimTranscript}</em>
                            </div>
                        )}
                    </div>

                     <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">Final Report</h2>
                        <div className="relative w-full min-h-[200px] bg-gray-50 rounded-lg border p-4 overflow-y-auto shadow-inner">
                             <div className="absolute top-2 right-2 flex items-center space-x-2">
                                <button onClick={downloadPdfReport} title="Download as .pdf" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50" disabled={!generatedReport}><FileJson size={18}/></button>
                            </div>
                           {isLoading ? <ReportSkeleton /> : <div dangerouslySetInnerHTML={{ __html: generatedReport }} className="prose max-w-none"/>}
                        </div>
                        <button onClick={generateFinalReport} disabled={isLoading || !userFindings} className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center disabled:bg-blue-400 text-lg">
                            <FileText className="mr-2" /> {isLoading ? 'Generating...' : 'Save & Finalize Report'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
