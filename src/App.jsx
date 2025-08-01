import React, { useState, useEffect, useRef, useCallback } from 'react';

// Icon Imports
import {
    Upload, FileText, Clipboard, Settings, Download, BrainCircuit, User, Calendar, Stethoscope, XCircle, FileJson, Search, PlusCircle, MessageSquare, CheckCircle, ChevronLeft, ChevronRight, Lightbulb, ListPlus, AlertTriangle, FileScan, Mic, Plus, Trash2, Bold, Italic, List, ListOrdered, Pilcrow, BookOpen, Link as LinkIcon, Zap, Copy, Keyboard, Info
} from 'lucide-react';

// Tiptap Editor Imports
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Utility Imports
import { Toaster, toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import { htmlToText } from 'html-to-text';

// NOTE: findings.js is assumed to be in the same directory.
// The original code had this commented out, so we maintain that.
import { localFindings } from './findings.js';
// const localFindings = []; // Using an empty array as a fallback.


// --- DATA: Pre-defined Report Templates ---
// No changes made to the data structure
const templates = {
  "Ultrasound": {
    "Abdomen": "IMPRESSION: <p>1. No sonographic evidence of significant abnormality in the upper abdomen.</p><br><p>FINDINGS:</p><p><strong>LIVER:</strong> Normal in size (spans __ cm), shape, and echotexture. No focal mass, cyst, or intrahepatic biliary dilatation. Hepatic veins and portal vein are patent with normal flow.</p><p><strong>GALLBLADDER:</strong> Normal size and wall thickness (__ mm). No gallstones, sludge, or polyps. No pericholecystic fluid.</p><p><strong>COMMON BILE DUCT:</strong> Not dilated, measuring __ mm at the porta hepatis.</p><p><strong>PANCREAS:</strong> Head, body, and tail are visualized and are unremarkable. No mass or ductal dilatation.</p><p><strong>SPLEEN:</strong> Normal in size (measures __ x __ cm) and echotexture. No focal lesions.</p><p><strong>KIDNEYS:</strong> </p><p>Right Kidney: Measures __ x __ cm with parenchyma of __ cm. Normal morphology and echotexture. No hydronephrosis, calculus, or mass.</p><p>Left Kidney: Measures __ x __ cm with parenchyma of __ cm. Normal morphology and echotexture. No hydronephrosis, calculus, or mass.</p><p><strong>AORTA & IVC:</strong> Visualized portions are of normal caliber. No evidence of aneurysm or thrombosis.</p><p><strong>ABDOMINAL LYMPHATICS:</strong> No significant lymphadenopathy noted.</p><p><strong>ASCITES:</strong> None.</p>",
    "Pelvis": "IMPRESSION: <p>1. Unremarkable ultrasound of the pelvis.</p><br><p>FINDINGS:</p><p><strong>URINARY BLADDER:</strong> Adequately distended, with a normal wall thickness. The lumen is anechoic. No calculi, masses, or diverticula identified. Post-void residual is __ ml.</p><br><p>(For Male)</p><p><strong>PROSTATE:</strong> Normal in size, measuring __ x __ x __ cm (Volume: __ cc). The echotexture is homogeneous. No suspicious nodules.</p><p><strong>SEMINAL VESICLES:</strong> Unremarkable.</p><br><p>(For Female)</p><p><strong>UTERUS:</strong> Anteverted and normal in size, measuring __ x __ x __ cm. The myometrium shows homogeneous echotexture. No fibroids identified.</p><p><strong>ENDOMETRIUM:</strong> Normal thickness (__ mm) and appearance for the phase of the menstrual cycle. </p><p><strong>OVARIES:</strong></p><p>Right Ovary: Measures __ x __ x __ cm. Normal follicular activity. No cysts or masses.</p><p>Left Ovary: Measures __ x __ x __ cm. Normal follicular activity. No cysts or masses.</p><p><strong>ADNEXA:</strong> No adnexal masses or fluid collections.</p><p><strong>CUL-DE-SAC:</strong> No free fluid.</p>",
    "Scrotum": "IMPRESSION: <p>1. No sonographic evidence of testicular torsion, mass, or significant hydrocele.</p><br><p>FINDINGS:</p><p><strong>RIGHT TESTICLE:</strong> Measures __ x __ x __ cm. Homogeneous echotexture. No focal mass or calcification. Normal arterial and venous flow on color Doppler.</p><p><strong>RIGHT EPIDIDYMIS:</strong> Normal in size and echotexture. No cysts or inflammation. Normal vascularity.</p><br><p><strong>LEFT TESTICLE:</strong> Measures __ x __ x __ cm. Homogeneous echotexture. No focal mass or calcification. Normal arterial and venous flow on color Doppler.</p><p><strong>LEFT EPIDIDYMIS:</strong> Normal in size and echotexture. No cysts or inflammation. Normal vascularity.</p><br><p><strong>ADDITIONAL FINDINGS:</strong> No significant hydrocele. No varicocele. The scrotal skin thickness is normal.</p>",
    "Thyroid": "IMPRESSION: <p>1. Normal ultrasound of the thyroid gland and neck.</p><br><p>FINDINGS:</p><p><strong>RIGHT LOBE:</strong> Measures __ x __ x __ cm. Homogeneous echotexture. No nodules, cysts, or calcifications. Normal vascularity on color Doppler.</p><p><strong>LEFT LOBE:</strong> Measures __ x __ x __ cm. Homogeneous echotexture. No nodules, cysts, or calcifications. Normal vascularity on color Doppler.</p><p><strong>ISTHMUS:</strong> Measures __ mm in thickness. Unremarkable.</p><p><strong>NECK:</strong> No significant cervical lymphadenopathy or other masses identified.</p>",
    "Renal / KUB": "IMPRESSION: <p>1. No evidence of hydronephrosis, renal calculi, or focal renal masses.</p><br><p>FINDINGS:</p><p><strong>RIGHT KIDNEY:</strong> Measures __ x __ cm with a cortical thickness of __ cm. Normal size, shape, and echotexture. No hydronephrosis, calculus, or mass. Corticomedullary differentiation is well-maintained.</p><p><strong>LEFT KIDNEY:</strong> Measures __ x __ cm with a cortical thickness of __ cm. Normal size, shape, and echotexture. No hydronephrosis, calculus, or mass. Corticomedullary differentiation is well-maintained.</p><p><strong>URETERS:</strong> The visualized portions of the ureters are not dilated. No ureteric jets seen.</p><p><strong>URINARY BLADDER:</strong> Adequately distended. Normal wall thickness. The lumen is anechoic. No calculi or masses. Post-void residual volume is __ mL.</p>",
    "Carotid Doppler": "IMPRESSION: <p>1. No evidence of hemodynamically significant stenosis or plaque in the bilateral carotid systems.</p><br><p>FINDINGS:</p><p><strong>RIGHT CAROTID SYSTEM:</strong></p><p>CCA: PSV __ cm/s, EDV __ cm/s. No plaque.</p><p>ICA: PSV __ cm/s, EDV __ cm/s. No plaque. ICA/CCA ratio is normal.</p><p>ECA: Normal flow pattern. No plaque.</p><p>Vertebral Artery: Antegrade flow.</p><p><strong>LEFT CAROTID SYSTEM:</strong></p><p>CCA: PSV __ cm/s, EDV __ cm/s. No plaque.</p><p>ICA: PSV __ cm/s, EDV __ cm/s. No plaque. ICA/CCA ratio is normal.</p><p>ECA: Normal flow pattern. No plaque.</p><p>Vertebral Artery: Antegrade flow.</p>",
    "Lower Limb Venous Doppler": "IMPRESSION: <p>1. No sonographic evidence of deep vein thrombosis (DVT) in the [right/left] lower extremity.</p><br><p>FINDINGS:</p><p>A complete duplex ultrasound of the [right/left] lower extremity deep venous system was performed.</p><p><strong>COMMON FEMORAL VEIN:</strong> Patent, compressible, with normal phasic flow and augmentation.</p><p><strong>FEMORAL VEIN:</strong> Patent, compressible, with normal phasic flow and augmentation.</p><p><strong>POPLITEAL VEIN:</strong> Patent, compressible, with normal phasic flow and augmentation.</p><p><strong>POSTERIOR TIBIAL VEINS:</strong> Patent and compressible.</p><p><strong>PERONEAL VEINS:</strong> Patent and compressible.</p>",
    "Lower Limb Arterial Doppler": "IMPRESSION: <p>1. Normal triphasic waveforms throughout the [right/left] lower extremity arterial system. No evidence of significant stenosis or occlusion.</p><br><p>FINDINGS:</p><p>Ankle-Brachial Index (ABI): [Right/Left] __</p><p><strong>COMMON FEMORAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>SUPERFICIAL FEMORAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>POPLITEAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>POSTERIOR TIBIAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>DORSALIS PEDIS ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p>",
    "Upper Limb Venous Doppler": "IMPRESSION: <p>1. No sonographic evidence of deep vein thrombosis (DVT) in the [right/left] upper extremity.</p><br><p>FINDINGS:</p><p>A complete duplex ultrasound of the [right/left] upper extremity deep venous system was performed.</p><p><strong>INTERNAL JUGULAR VEIN:</strong> Patent, compressible, with normal phasic flow.</p><p><strong>SUBCLAVIAN VEIN:</strong> Patent, compressible, with normal phasic flow.</p><p><strong>AXILLARY VEIN:</strong> Patent, compressible, with normal phasic flow.</p><p><strong>BRACHIAL VEIN:</strong> Patent and compressible.</p><p><strong>BASILIC & CEPHALIC VEINS:</strong> Patent and compressible.</p>",
    "Upper Limb Arterial Doppler": "IMPRESSION: <p>1. Normal triphasic waveforms throughout the [right/left] upper extremity arterial system. No evidence of significant stenosis or occlusion.</p><br><p>FINDINGS:</p><p><strong>SUBCLAVIAN ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>AXILLARY ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>BRACHIAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>RADIAL ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p><p><strong>ULNAR ARTERY:</strong> Triphasic waveform. PSV __ cm/s.</p>",
    "Soft Tissue": "IMPRESSION: <p>1. Unremarkable ultrasound of the soft tissues of the [location]. No discrete fluid collection, mass, or evidence of inflammation.</p><br><p>FINDINGS:</p><p>Ultrasound of the [location] demonstrates normal skin, subcutaneous fat, and underlying muscle planes. There is no evidence of a focal mass, cyst, or abscess. No abnormal vascularity is seen on color Doppler imaging.</p>",
    "Obstetrics (1st Trimester)": "IMPRESSION: <p>1. Single live intrauterine pregnancy at an estimated __ weeks __ days gestation.</p><br><p>FINDINGS:</p><p><strong>UTERUS:</strong> The uterus is gravid and appears normal.</p><p><strong>GESTATIONAL SAC:</strong> A single gestational sac is seen within the uterine cavity. Mean sac diameter is __ mm.</p><p><strong>YOLK SAC:</strong> Present and normal in appearance.</p><p><strong>EMBRYO:</strong> A single embryo is identified.</p><p><strong>CROWN-RUMP LENGTH (CRL):</strong> __ mm, corresponding to a gestational age of __ weeks __ days.</p><p><strong>FETAL HEART RATE:</strong> __ bpm.</p><p><strong>ADNEXA:</strong> The ovaries are normal in appearance. No adnexal masses.</p><p><strong>CERVIX:</strong> Appears long and closed.</p>",
    "Obstetrics (2nd Trimester)": "IMPRESSION: <p>1. Single live intrauterine pregnancy at an estimated __ weeks __ days gestation. No gross fetal anomalies identified.</p><br><p>FINDINGS:</p><p><strong>FETAL BIOMETRY:</strong></p><p>Biparietal Diameter (BPD): __ mm (__ w __ d)</p><p>Head Circumference (HC): __ mm (__ w __ d)</p><p>Abdominal Circumference (AC): __ mm (__ w __ d)</p><p>Femur Length (FL): __ mm (__ w __ d)</p><p><strong>ESTIMATED FETAL WEIGHT:</strong> __ grams (__th percentile).</p><p><strong>FETAL ANATOMY SURVEY:</strong> Head, face, neck, spine, heart, abdomen, and limbs appear sonographically unremarkable.</p><p><strong>PLACENTA:</strong> [Anterior/Posterior], Grade __. No previa.</p><p><strong>AMNIOTIC FLUID:</strong> Normal. Amniotic Fluid Index (AFI) is __ cm.</p><p><strong>FETAL HEART RATE:</strong> __ bpm.</p>",
    "Obstetrics (3rd Trimester)": "IMPRESSION: <p>1. Single live intrauterine pregnancy in cephalic presentation, at an estimated __ weeks __ days gestation. Fetal growth appears appropriate.</p><br><p>FINDINGS:</p><p><strong>FETAL BIOMETRY:</strong></p><p>Biparietal Diameter (BPD): __ mm (__ w __ d)</p><p>Head Circumference (HC): __ mm (__ w __ d)</p><p>Abdominal Circumference (AC): __ mm (__ w __ d)</p><p>Femur Length (FL): __ mm (__ w __ d)</p><p><strong>ESTIMATED FETAL WEIGHT:</strong> __ grams (__th percentile).</p><p><strong>PLACENTA:</strong> [Anterior/Posterior], Grade __. No previa.</p><p><strong>AMNIOTIC FLUID:</strong> Normal. Amniotic Fluid Index (AFI) is __ cm.</p><p><strong>FETAL PRESENTATION:</strong> Cephalic.</p><p><strong>FETAL HEART RATE:</strong> __ bpm.</p>"
  },
  "X-Ray": {
    "Chest": "IMPRESSION: <p>1. No acute cardiopulmonary process.</p><br><p>FINDINGS:</p><p><strong>LUNGS AND PLEURA:</strong> The lungs are clear. No focal consolidation, pneumothorax, or pleural effusion.</p><p><strong>HEART AND MEDIASTINUM:</strong> The cardiomediastinal silhouette is within normal limits for size and contour. </p><p><strong>AORTA:</strong> The thoracic aorta is normal in appearance.</p><p><strong>BONES:</strong> The visualized osseous structures are unremarkable.</p><p><strong>SOFT TISSUES:</strong> The soft tissues of the chest wall are unremarkable.</p>",
    "Knee": "IMPRESSION: <p>1. No acute fracture or dislocation.</p><p>2. Mild degenerative changes.</p><br><p>FINDINGS:</p><p><strong>VIEWS:</strong> AP, Lateral, and Sunrise views of the [right/left] knee.</p><p><strong>ALIGNMENT:</strong> Normal alignment.</p><p><strong>JOINT SPACES:</strong> Mild narrowing of the medial femorotibial compartment. The lateral and patellofemoral compartments are preserved.</p><p><strong>BONES:</strong> No acute fracture or dislocation. Small marginal osteophytes are noted. Bone density is appropriate for age.</p><p><strong>SOFT TISSUES:</strong> No significant joint effusion or soft tissue swelling.</p>",
  }
};

// --- UI HELPER: A shared styled container for main sections ---
const Panel = ({ children, className = '', ...props }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80 ${className}`} {...props}>
        {children}
    </div>
);

// --- UI HELPER: A shared styled section header ---
const SectionHeader = ({ icon, title, children }) => (
    <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-200">
        <div className="flex items-center">
            {icon}
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <div>{children}</div>
    </div>
);


// --- Component: Tiptap Editor MenuBar ---
// Redesigned for a cleaner, modern toolbar look
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const menuItems = [
    { action: () => editor.chain().focus().toggleBold().run(), name: 'bold', icon: <Bold size={18} />, title: 'Bold' },
    { action: () => editor.chain().focus().toggleItalic().run(), name: 'italic', icon: <Italic size={18} />, title: 'Italic' },
    { action: () => editor.chain().focus().setParagraph().run(), name: 'paragraph', icon: <Pilcrow size={18} />, title: 'Paragraph' },
    { action: () => editor.chain().focus().toggleBulletList().run(), name: 'bulletList', icon: <List size={18} />, title: 'Bullet List' },
    { action: () => editor.chain().focus().toggleOrderedList().run(), name: 'orderedList', icon: <ListOrdered size={18} />, title: 'Ordered List' },
  ];

  return (
    <div className="flex items-center space-x-1 p-2 bg-gray-100 rounded-t-lg border-b border-gray-300">
      {menuItems.map(item => (
        <button
          key={item.name}
          onClick={item.action}
          className={`p-2 rounded-md transition-colors ${editor.isActive(item.name) ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 text-gray-600'}`}
          title={item.title}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

// --- Component: CriticalFindingModal ---
// Refined styling for better visual impact
const CriticalFindingModal = ({ findingData, onAcknowledge, onInsertMacro, onPrepareNotification }) => {
    if (!findingData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-in fade-in-0 zoom-in-95">
                <div className="p-8 text-center border-t-8 border-red-500 rounded-t-2xl">
                    <AlertTriangle size={52} className="text-red-500 mx-auto mb-5 animate-pulse" />
                    <h3 className="text-3xl font-bold text-gray-900">Critical Finding Detected</h3>
                    <p className="text-red-600 font-semibold text-xl mt-3 mb-8">{findingData.findingName}</p>
                    
                    <div className="space-y-3">
                        <button onClick={onInsertMacro} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 flex items-center justify-center text-lg">
                            <PlusCircle size={22} className="mr-2" /> Add to Report
                        </button>
                         <button onClick={onPrepareNotification} className="w-full bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-transform transform hover:scale-105 flex items-center justify-center text-lg">
                            <Copy size={22} className="mr-2" /> Prepare Notification
                        </button>
                        <button onClick={onAcknowledge} className="w-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition mt-4">
                            Acknowledge
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Component: AiSuggestedMeasurementsPanel ---
// Redesigned with a cleaner, card-based layout
const AiSuggestedMeasurementsPanel = ({ measurements, onInsert, onClear }) => {
    if (!measurements || measurements.length === 0) return null;

    return (
        <div className="bg-blue-50 p-5 rounded-xl shadow-md border border-blue-200 mt-6 animate-in fade-in-0">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-blue-800 flex items-center">
                    <Zap size={20} className="mr-2 text-blue-600" />AI-Suggested Measurements
                </h3>
                <button onClick={onClear} className="text-gray-500 hover:text-gray-800 transition-colors">
                    <XCircle size={24} />
                </button>
            </div>
            <div className="space-y-3 max-h-52 overflow-y-auto pr-2 -mr-2">
                {measurements.map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg flex items-center justify-between shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                        <div>
                            <span className="font-semibold text-gray-800">{item.finding}:</span>
                            <span className="ml-2 text-blue-700 font-medium">{item.value}</span>
                        </div>
                        <button onClick={() => onInsert(item.finding, item.value)} className="bg-blue-100 text-blue-800 font-bold py-1 px-3 rounded-full hover:bg-blue-200 transition text-sm flex items-center">
                            <Plus size={16} className="mr-1" /> Insert
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Component: ShortcutsHelpModal ---
// Enhanced styling and layout for clarity
const ShortcutsHelpModal = ({ shortcuts, onClose }) => {
    const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? '⌘' : 'Ctrl';
    const altKey = isMac ? '⌥' : 'Alt';

    const renderKey = (key) => <kbd className="px-2 py-1 text-sm font-semibold text-gray-700 bg-gray-200/80 border-b-2 border-gray-400/50 rounded-md">{key}</kbd>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center"><Keyboard size={26} className="mr-3 text-blue-600"/>Keyboard Shortcuts</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition"><XCircle size={24} /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                        {Object.entries(shortcuts).map(([action, config]) => (
                            <div key={action} className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-700">{config.label}</span>
                                <div className="flex items-center space-x-1.5">
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

// --- Component: KnowledgeLookupPanel ---
// Visually enhanced to better present knowledge-base information
const KnowledgeLookupPanel = ({ result, onClose, onInsert }) => {
    if (!result) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-8 animate-in fade-in-0">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <BrainCircuit className="mr-3 text-teal-500" />
                    Knowledge Lookup
                </h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
                    <XCircle size={24} />
                </button>
            </div>
            
            <div className="bg-teal-50/50 border border-teal-200/60 p-4 rounded-lg mb-4">
                <h3 className="text-xl font-bold text-teal-900">{result.conditionName}</h3>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto pr-3 -mr-3 space-y-5 text-gray-700">
                <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">Summary</h4>
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-strong:text-gray-700" dangerouslySetInnerHTML={{ __html: result.summary }} />
                </div>

                {result.keyImagingFeatures?.length > 0 && (
                    <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-2">Key Imaging Features</h4>
                        <ul className="list-disc list-outside space-y-1 text-sm pl-5 prose prose-sm max-w-none prose-li:my-1">
                            {result.keyImagingFeatures.map((feature, index) => (
                                <li key={index} dangerouslySetInnerHTML={{ __html: feature.replace(/<\/?li>/g, '') }} />
                            ))}
                        </ul>
                    </div>
                )}

                {result.differentialDiagnosis?.length > 0 && (
                    <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-2">Differential Diagnosis</h4>
                        <ul className="list-disc list-outside text-sm pl-5 space-y-1">
                            {result.differentialDiagnosis.map((dx, index) => <li key={index}>{dx}</li>)}
                        </ul>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-6 border-t">
                 <button
                    onClick={() => {
                        const contentToInsert = `<hr><h3>Knowledge Summary: ${result.conditionName}</h3><h4>Summary</h4>${result.summary}<h4>Key Imaging Features</h4><ul>${result.keyImagingFeatures.join('')}</ul><hr>`;
                        onInsert(contentToInsert);
                    }}
                    className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition flex items-center justify-center text-base shadow-sm hover:shadow-md"
                >
                    <PlusCircle size={20} className="mr-2" /> Insert Summary into Report
                </button>
                {result.sources?.length > 0 && (
                    <div className="mt-4">
                        <h5 className="font-semibold text-gray-600 mb-2 flex items-center"><BookOpen size={16} className="mr-2"/>Sources</h5>
                        <ul className="flex flex-wrap gap-2 text-xs">
                            {result.sources.map((source, index) => (
                                <li key={index}>
                                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 bg-blue-100/70 hover:bg-blue-200/70 px-2 py-1 rounded-full transition">
                                        {source.name} <LinkIcon size={12} className="inline-block ml-1.5"/>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Component: Skeleton Loaders ---
// Redesigned with a subtle shimmer animation for a more modern feel
// NOTE: You'll need to add keyframes for `shimmer` in your `tailwind.config.js`
/*
  // In tailwind.config.js
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { background-position: '-1000px 0' },
          '100%': { background-position: '1000px 0' },
        },
      },
    },
  },
*/
const ShimmerBase = () => <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/80 to-transparent animate-shimmer" style={{ backgroundSize: '1000px 100%' }} />;
const SearchResultSkeleton = () => (
    <div className="mt-4 space-y-3">
        {[...Array(2)].map((_, i) => (
            <div key={i} className="relative p-4 bg-gray-200/60 rounded-lg overflow-hidden">
                <div className="h-4 bg-gray-300/70 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-300/70 rounded w-1/4 mb-4"></div>
                <div className="h-3 bg-gray-300/70 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-300/70 rounded w-5/6"></div>
                <ShimmerBase />
            </div>
        ))}
    </div>
);
const ReportSkeleton = () => (
    <div className="relative p-4 space-y-5 overflow-hidden">
        <div className="h-6 bg-gray-300/70 rounded w-1/3"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-300/70 rounded w-full"></div>
            <div className="h-4 bg-gray-300/70 rounded w-full"></div>
            <div className="h-4 bg-gray-300/70 rounded w-3/4"></div>
        </div>
        <div className="h-6 bg-gray-300/70 rounded w-1/4 mt-6"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-300/70 rounded w-full"></div>
            <div className="h-4 bg-gray-300/70 rounded w-5/6"></div>
        </div>
        <ShimmerBase />
    </div>
);


// --- Main App Component ---
const App = () => {
  // --- STATE MANAGEMENT (No changes to logic) ---
  const [patientName, setPatientName] = useState('John Doe');
  const [patientAge, setPatientAge] = useState('45');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [modality, setModality] = useState('Ultrasound');
  const [template, setTemplate] = useState('Abdomen');
  const [images, setImages] = useState([]);
  const [userFindings, setUserFindings] = useState('');
  const [generatedReport, setGeneratedReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysisStatus, setAiAnalysisStatus] = useState('');
  const [clinicalContext, setClinicalContext] = useState('');
  const [assistantQuery, setAssistantQuery] = useState('');
  const [error, setError] = useState(null);
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
  const [macros, setMacros] = useState([{ command: 'normal abdomen', text: 'This is a sample normal abdomen report.' },{ command: 'Renal calculus', text: 'A calculus measuring __ x __ cm is noted in the lower/mid/upper pole calyx.' },{ command: 'Renal calculi', text: 'Multiple calculi noted in the right/left kidney largest one measuring __ x __ cm is noted in the lower/mid/upper pole calyx.' }]);
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
  const [criticalFindingData, setCriticalFindingData] = useState(null);
  
  // --- REFS (No changes) ---
  const debounceTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);
  const searchButtonRef = useRef(null);
  const voiceStatusRef = useRef(voiceStatus);
  const dataExtractTimeoutRef = useRef(null);
  const proactiveAnalysisTimeoutRef = useRef(null);
  const localSearchInputRef = useRef(null);

  // --- HOOKS and BUSINESS LOGIC (No changes) ---
  useEffect(() => {
    voiceStatusRef.current = voiceStatus;
  }, [voiceStatus]);

  const debouncedExtractData = useCallback((text) => {
    if (dataExtractTimeoutRef.current) clearTimeout(dataExtractTimeoutRef.current);
    dataExtractTimeoutRef.current = setTimeout(() => {
        if (text.trim().length > 20) extractStructuredData(text);
        else setStructuredData({});
    }, 1500);
  }, []);

  const toastDone = (msg, icon) => toast.success(msg, { duration: 2500, icon });

  const runProactiveAnalysis = async (text) => {
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
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" }};
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) return;

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
        console.error("Proactive analysis failed:", err);
    }
  };

  const debouncedProactiveAnalysis = useCallback((text) => {
    if (proactiveAnalysisTimeoutRef.current) clearTimeout(proactiveAnalysisTimeoutRef.current);
    proactiveAnalysisTimeoutRef.current = setTimeout(() => {
        if (isProactiveHelpEnabled && !isSearching && text.trim().length > 40) {
             runProactiveAnalysis(text);
        }
    }, 3000);
  }, [isProactiveHelpEnabled, isSearching]);

  const editor = useEditor({
    extensions: [ StarterKit, Placeholder.configure({ placeholder: 'Start dictating, paste findings, or select a template…' })],
    content: userFindings,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      setUserFindings(html);
      debouncedCriticalCheck(text);
      debouncedExtractData(text);
      debouncedProactiveAnalysis(text);
    },
  });

  useEffect(() => {
    if (error) {
        toast.error(error);
        setError(null); // Reset error after showing toast
    }
  }, [error]);

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const initialContent = templates[modality]?.[template] || '';
      if (editor.getHTML() !== initialContent) {
        editor.commands.setContent(initialContent, false, { preserveWhitespace: 'full' });
      }
    }
  }, [modality, template, editor]);

  const debouncedCriticalCheck = useCallback((text) => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
        if (text.trim() !== '') checkForCriticalFindings(text);
        else setCriticalFindingData(null);
    }, 1000);
  }, []);

  const extractStructuredData = async (text) => {
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
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" }};
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        
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
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) {
        console.error("API Error, falling back to original transcript");
        return transcript;
      }
      const result = await response.json();
      return result.candidates?.[0]?.content.parts?.[0]?.text || transcript;
    } catch (error) {
      console.error("Failed to get corrected transcript:", error);
      return transcript;
    }
  };

  const handleToggleListening = useCallback(() => {
    if (!recognitionRef.current) {
        setError("Voice dictation is not supported by your browser.");
        return;
    }
    if (voiceStatusRef.current !== 'idle') recognitionRef.current.stop();
    else recognitionRef.current.start();
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onstart = () => setVoiceStatus('listening');
      recognition.onresult = async (event) => {
        let finalTranscript = '';
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript.trim();
          else currentInterim += event.results[i][0].transcript;
        }
        setInterimTranscript(currentInterim);
        if (finalTranscript) {
            await handleVoiceCommand(finalTranscript);
            setInterimTranscript('');
        }
      };
      recognition.onend = () => setVoiceStatus('idle');
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setError(`Speech recognition error: ${event.error}`);
        setVoiceStatus('idle');
      };
    } else {
      setIsDictationSupported(false);
      setError("Voice dictation is not supported by your browser.");
    }
    return () => recognitionRef.current?.stop();
  }, []);

  const handleVoiceCommand = async (command) => {
    if (!editor || !command) return;
    const commandLC = command.toLowerCase().trim();

    const aiSearchKeyword = "look up";
    const commandKeyword = "command";
    const macroKeyword = "macro";

    if (commandLC.startsWith(aiSearchKeyword)) {
        const query = commandLC.substring(aiSearchKeyword.length).trim();
        if (query) await handleAiKnowledgeSearch(true, query);
        return;
    }

    if (commandLC.startsWith(macroKeyword)) {
        const macroPhrase = commandLC.substring(macroKeyword.length).trim().replace(/[.,?]/g, '');
        const macro = macros.find(m => macroPhrase === m.command.toLowerCase());
        if (macro) editor.chain().focus().insertContent(macro.text).run();
        else console.warn(`Macro not found for: "${macroPhrase}"`);
        return;
    }

    if (commandLC.startsWith(commandKeyword)) {
        const action = commandLC.substring(commandKeyword.length).trim().replace(/[.,?]/g, '');

        if (action === "analyze images") analyzeImages();
        else if (action === "download report") {
            const reportHtml = generateFinalReport();
            if (reportHtml) downloadPdfReport(reportHtml);
        } else if (action.startsWith("search for")) {
            const searchTerm = action.substring("search for".length).trim();
            setSearchQuery(searchTerm);
            setTimeout(() => searchButtonRef.current?.click(), 100);
        } else if (action.startsWith("insert result")) {
            const numberWords = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5 };
            const resultNumStr = action.substring("insert result".length).trim();
            const resultNum = numberWords[resultNumStr] || parseInt(resultNumStr, 10);
            const combinedResults = [...localSearchResults, ...(allAiSearchResults[currentAiPage] || [])];
            if (!isNaN(resultNum) && resultNum > 0 && resultNum <= combinedResults.length) insertFindings(combinedResults[resultNum - 1]);
            else console.warn(`Invalid result number for insertion: ${resultNumStr}`);
        }
        else if (action.includes("delete last sentence")) {
            const content = editor.state.doc.textContent;
            const sentences = content.trim().split(/(?<=[.?!])\s+/);
            if (sentences.length > 0) {
                const lastSentence = sentences.pop();
                const startOfLastSentence = content.lastIndexOf(lastSentence);
                if (startOfLastSentence !== -1) editor.chain().focus().deleteRange({ from: startOfLastSentence, to: startOfLastSentence + lastSentence.length }).run();
            }
        } else if (action.includes("bold last sentence") || action.includes("bold the last sentence")) {
            const content = editor.state.doc.textContent;
            const sentences = content.trim().split(/(?<=[.?!])\s+/);
             if (sentences.length > 0) {
                const lastSentence = sentences.pop();
                const startOfLastSentence = content.lastIndexOf(lastSentence);
                 if (startOfLastSentence !== -1) editor.chain().focus().setTextSelection({ from: startOfLastSentence, to: startOfLastSentence + lastSentence.length }).toggleBold().run();
            }
        }
        return;
    }
    
    const correctedText = await getCorrectedTranscript(command);
    editor.chain().focus().insertContent(correctedText + ' ').run();
  };

  const fileToImageObject = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            const src = URL.createObjectURL(file);
            resolve({ src, base64, name: file.name, type: file.type });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  }

  const handleImageChange = async (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
        const newImageObjects = await Promise.all(files.map(fileToImageObject));
        setImages(prevImages => [...prevImages, ...newImageObjects]);
    }
  };
  
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = async (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
      if (files.length > 0) {
          const imageFiles = files.filter(file => file.type.startsWith('image/'));
          if (imageFiles.length > 0) {
              const newImageObjects = await Promise.all(imageFiles.map(fileToImageObject));
              setImages(prevImages => [...prevImages, ...newImageObjects]);
          }
      }
  };
  
  const handlePaste = async (e) => {
    const items = e.clipboardData.items;
    const imageFiles = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) imageFiles.push(items[i].getAsFile());
    }
    if (imageFiles.length > 0) {
        const newImageObjects = await Promise.all(imageFiles.map(fileToImageObject));
        setImages(prevImages => [...prevImages, ...newImageObjects]);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const analyzeImages = async () => {
    if (images.length === 0) { setError("Please upload one or more images first."); return; }
    setIsAiLoading(true);
    setAiAnalysisStatus('Analyzing images...');
    setError(null);
    setAiMeasurements([]);
    setCriticalFindingData(null);
    if(editor) editor.commands.clearContent();
    
    try {
        const prompt = `
            You are an advanced AI assistant specializing in the analysis of medical imaging studies.
            Given one or more medical images and optional clinical context, you must analyze the content and return a single, valid JSON object.
            The root of this object must contain the following keys: "analysisReport", "measurements", and "criticalFinding".

            1. "analysisReport" (String): A comprehensive, human-readable narrative report describing the findings and impressions, formatted as an HTML string with <p> and <strong> tags.
            2. "measurements" (Array of Objects): An array for all identifiable and measurable findings. If none, return an empty array []. Each object must contain:
                - "finding" (String): A concise description of the object being measured (e.g., "Right Kidney", "Aortic Diameter").
                - "value" (String): The measurement value with units (e.g., "10.2 x 4.5 cm", "4.1 cm").
            3. "criticalFinding" (Object or Null): An object for actionable critical findings. If none, this MUST be null. If a critical finding is detected, the object MUST contain:
                - "findingName" (String): The specific name of the critical finding (e.g., "Aortic Dissection").
                - "reportMacro" (String): A pre-defined sentence for the report (e.g., "CRITICAL FINDING: Acute aortic dissection is identified.").
                - "notificationTemplate" (String): A pre-populated message for communication (e.g., "URGENT: Critical finding on Patient [Patient Name/ID]. CT shows acute aortic dissection...").
            
            Clinical Context: "${clinicalContext || 'None'}"
        `;
        const imageParts = images.map(image => ({ inlineData: { mimeType: image.type, data: image.base64 } }));
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] }], generationConfig: { responseMimeType: "application/json" } };
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flashenerateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        const result = await response.json();
        const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

        if (textResult) {
            const parsedResult = JSON.parse(textResult);
            if (parsedResult.analysisReport && editor) editor.commands.setContent(parsedResult.analysisReport);
            if (parsedResult.measurements) setAiMeasurements(parsedResult.measurements);
            if (parsedResult.criticalFinding) setCriticalFindingData(parsedResult.criticalFinding);
            toastDone('AI analysis complete', '✅');
        } else {
            throw new Error("No valid response returned from AI.");
        }
    } catch (err) {
        setError("Failed to analyze images. " + err.message);
        console.error(err);
    } finally {
        setIsAiLoading(false);
        setAiAnalysisStatus('');
    }
  };
  
  const handleSearch = () => {
      if (!searchQuery) { setError("Please enter a search term."); return; }
      setError(null);
      const query = searchQuery.toLowerCase().trim();
      const results = localFindings.filter(finding => finding.organ.toLowerCase().includes(query) || finding.findingName.toLowerCase().includes(query));
      setLocalSearchResults(results);
      setAllAiSearchResults([]);
      setCurrentAiPage(0);
      setAllAiFullReports([]);
      setCurrentReportPage(0);
      setAiKnowledgeLookupResult(null);
      setBaseSearchQuery(searchQuery);
  };
  
  const handleAiFindingsSearch = async (isMoreQuery = false) => {
    if (!baseSearchQuery) { setError("Please perform a standard search first."); return; }
    setIsSearching(true);
    setError(null);
    setAiKnowledgeLookupResult(null);

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
      { "queryType": "fullReport", "modality": "string", "template": "string", "fullReportText": "string" }

      ---
      **SCHEMA 2: General or Specific Findings**
      ${isMoreQuery && existingFindingNames.length > 0 ? `Exclude these findings if possible: ${JSON.stringify(existingFindingNames)}.` : ''}
      { "queryType": "generalFindings", "results": [ { "findingName": "string", "organ": "string", "findings": "string", "impression": "string" } ] }
    `;

    try {
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } };
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
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
                    if (!isReportContext) { setAllAiSearchResults([]); setLocalSearchResults([]); }
                } else if (parsedResult.results) {
                    if (isReportContext) { setError("AI returned findings when a new report version was expected. Please try again."); } 
                    else {
                        setAllAiSearchResults(prev => [...prev, parsedResult.results]);
                        setCurrentAiPage(allAiSearchResults.length);
                        if (allAiSearchResults.length === 0) setAllAiFullReports([]);
                    }
                } else { setError("The AI returned a response with an unexpected format."); }
            } catch (jsonError) {
                console.error("JSON Parsing Error:", jsonError, "Raw Text:", textResult);
                setError("The AI returned a non-standard response. Please try rephrasing your query."); 
            }
        } else { throw new Error("Search failed."); }
    } catch (err) {
        setError("Failed to perform search. " + err.message);
    } finally {
        setIsSearching(false);
    }
  };

  const handleAiKnowledgeSearch = async (isProactive = false, queryOverride = '') => {
      const query = isProactive ? queryOverride : baseSearchQuery;
      if (!query) { setError("Please enter a search term first."); return; }
      setIsSearching(true);
      setError(null);
      setAllAiSearchResults([]); setAllAiFullReports([]); setLocalSearchResults([]);

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
          const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" }};
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
          const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

          if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
          const result = await response.json();
          if (result.candidates?.[0]?.content.parts?.[0]?.text) {
              const textResult = result.candidates[0].content.parts[0].text;
              try {
                  const parsedResult = JSON.parse(textResult);
                  if (parsedResult.queryType === 'knowledgeLookup') setAiKnowledgeLookupResult(parsedResult);
                  else setError("The AI returned an unexpected response type for a knowledge search.");
              } catch (jsonError) {
                  console.error("JSON Parsing Error:", jsonError, "Raw Text:", textResult);
                  setError("The AI returned a non-standard response for the knowledge search.");
              }
          } else { throw new Error("Knowledge search failed."); }
      } catch (err) {
          setError("Failed to perform knowledge search. " + err.message);
      } finally {
          setIsSearching(false);
      }
  };

  const checkForCriticalFindings = useCallback(async (plainTextFindings) => {
    const prompt = `
        Act as a vigilant radiologist. Analyze the following report text for critical, urgent, or unexpected findings that require immediate attention (e.g., pneumothorax, aortic dissection, acute hemorrhage, large vessel occlusion).
        If a critical finding is detected, respond with a JSON object containing the full critical finding details.
        If no critical finding is detected, respond with a JSON object where "criticalFinding" is null.
        The JSON object MUST follow this exact schema:
        { "criticalFinding": { "findingName": "string", "reportMacro": "string", "notificationTemplate": "string" } | null }
        Report Text: --- ${plainTextFindings} ---
    `;
    try {
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" }};
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) return;
        const result = await response.json();
        const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;
        if (textResult) {
            const parsed = JSON.parse(textResult);
            if (parsed.criticalFinding) setCriticalFindingData(parsed.criticalFinding);
            else setCriticalFindingData(null);
        }
    } catch (err) { console.error("Critical finding check failed:", err); }
  }, []);

  const handleGetSuggestions = async (type) => {
    if (!editor) { setError("Editor not initialized."); return; }
    const reportText = editor.getText();
    if (!reportText.trim()) { setError("Please enter some findings before requesting suggestions."); return; }
    
    setIsSuggestionLoading(true);
    setError(null);
    setSuggestionType(type);
    
    const prompt = type === 'differentials' ? 
      `Act as an expert radiologist. Based on the following findings, provide a list of potential differential diagnoses. For each, provide a brief rationale and estimated likelihood (e.g., Likely, Less Likely, Remote). Findings: --- ${reportText} ---` : 
      `Act as an expert radiologist. Based on the following report, suggest clinically appropriate follow-up actions or recommendations. Report: --- ${reportText} ---`;

    try {
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      const result = await response.json();
      const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

      if (textResult) { setAiSuggestions(textResult); setShowSuggestionsModal(true); } 
      else { throw new Error("No suggestions returned from AI."); }
    } catch (err) {
      setError("Failed to get suggestions. " + err.message);
    } finally {
      setIsSuggestionLoading(false);
    }
  };

  const handleParseReport = async () => {
    if (!assistantQuery) { setError("Please paste a report into the AI Assistant box to parse."); return; }
    setIsParsing(true);
    setError(null);

    const prompt = `
      Act as a data extraction engine. Parse the following unstructured medical report and return a structured JSON object.
      The JSON object must follow this exact schema:
      { "patientName": "string", "patientAge": "string", "examDate": "YYYY-MM-DD", "modality": "string (e.g., Ultrasound, X-Ray)", "bodyPart": "string (e.g., Abdomen, Knee)", "reportBody": "string (the full findings and impression text, formatted as an HTML string with <p> and <strong> tags)" }
      Report to Parse: --- ${assistantQuery} ---
    `;
    try {
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } };
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      const result = await response.json();
      const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

      if (textResult) {
        const parsed = JSON.parse(textResult);
        if(parsed.patientName) setPatientName(parsed.patientName);
        if(parsed.patientAge) setPatientAge(parsed.patientAge);
        if(parsed.examDate) setExamDate(parsed.examDate);
        if(parsed.modality) setModality(parsed.modality);
        if(parsed.bodyPart) setTemplate(parsed.bodyPart);
        if(parsed.reportBody && editor) editor.commands.setContent(parsed.reportBody);
        setAssistantQuery('');
        toast.success("Report fields parsed and populated!");
      } else { throw new Error("Could not parse the report."); }
    } catch (err) {
      setError("Failed to parse report. " + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const appendSuggestionsToReport = () => {
    if (!aiSuggestions || !editor) return;
    const header = suggestionType === 'differentials' ? "<h3>DIFFERENTIAL DIAGNOSIS:</h3>" : "<h3>RECOMMENDATIONS:</h3>";
    const formattedSuggestions = `<p>${aiSuggestions.replace(/\n/g, '<br>')}</p>`;
    editor.chain().focus().insertContent(`<br>${header}${formattedSuggestions}`).run();
    setShowSuggestionsModal(false);
    setAiSuggestions('');
  };

  const handleNextPage = () => {
    if (currentAiPage >= allAiSearchResults.length - 1) handleAiFindingsSearch(true);
    else setCurrentAiPage(prev => prev + 1);
  };
  const handlePreviousPage = () => { if (currentAiPage > 0) setCurrentAiPage(prev => prev - 1); };
  const handleNextReport = () => {
    if (currentReportPage >= allAiFullReports.length - 1) handleAiFindingsSearch(true);
    else setCurrentReportPage(prev => prev + 1);
  };
  const handlePreviousReport = () => { if (currentReportPage > 0) setCurrentReportPage(prev => prev - 1); };
  
  const insertFindings = (findingToInsert) => {
    if (!editor) return;
    if (findingToInsert.queryType === 'fullReport') {
      const { modality: newModality, template: newTemplate, fullReportText } = findingToInsert;
      setModality(newModality); setTemplate(newTemplate);
      editor.commands.setContent(fullReportText);
      return;
    }

    const { organ, findings, impression } = findingToInsert;
    let currentHtml = editor.getHTML();
    const newFindingText = ` ${findings}`;
    const newImpressionHtml = `<p>- ${impression}</p>`;
    const organRegex = new RegExp(`(<p><strong>${organ.replace(/ /g, "\\s*")}:<\\/strong>)(.*?)(<\\/p>)`, "i");
    const organMatch = currentHtml.match(organRegex);
    let wasFindingHandled = false;

    if (organMatch) {
        const [, openingTags, existingContent, closingTag] = organMatch;
        const placeholderRegex = /Normal in size|Not dilated|unremarkable|No significant/i;
        const finalContent = placeholderRegex.test(existingContent) ? newFindingText : existingContent + newFindingText;
        currentHtml = currentHtml.replace(organRegex, `${openingTags}${finalContent}${closingTag}`);
        wasFindingHandled = true;
    }

    const impressionHeaderRegex = /(IMPRESSION:.*<\/p>)/i;
    const impressionMatch = currentHtml.match(impressionHeaderRegex);
    if (impressionMatch) {
      currentHtml = currentHtml.replace(impressionHeaderRegex, `${impressionMatch[0]}${newImpressionHtml}`);
    } else if (wasFindingHandled) {
        currentHtml += `<br><p><strong>IMPRESSION:</strong></p>${newImpressionHtml}`;
    }

    if (wasFindingHandled) editor.commands.setContent(currentHtml);
    else editor.chain().focus().insertContent(`<h4>${organ.toUpperCase()}</h4><p>${findings}</p><h4>IMPRESSION</h4><p>${impression}</p>`).run();
    toast.success(`Inserted finding for ${findingToInsert.findingName}`);
  };

  const handleAIAssistant = async () => {
    if (!assistantQuery) { setError("Please enter a topic or paste a report."); return; }
    setIsLoading(true);
    setError(null);
    setGeneratedReport('');

    try {
      const prompt = `
        You are an expert radiologist and medical editor.Analyze the user's request below and perform one of two tasks:
        1.  **If the request is a topic (e.g., "Liver Elastography"):** Generate a comprehensive, professional report template for that topic. The output MUST be a single string of properly formatted HTML.
        2.  **If the request is a medical report:** Meticulously proofread the report for any errors. Return a fully corrected, professional version of the report, formatted as an HTML string. If accurate, return a confirmation message like: "The provided report is accurate and requires no corrections."
        User's Request: --- ${assistantQuery} ---
      `;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        const result = await response.json();
        const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

        if (textResult && editor) editor.commands.setContent(textResult);
        else throw new Error("No response from AI assistant.");
    } catch (err) {
        setError("AI Assistant request failed: " + err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const generateFinalReport = () => {
    if (editor) {
      const reportHtml = editor.getHTML();
      setGeneratedReport(reportHtml);
      toastDone('Report preview is ready!', '📄');
      return reportHtml;
    }
    return '';
  };
  
    const copyToClipboard = (text, successMessage = 'Copied to clipboard!') => {
        const plainText = htmlToText(text, { wordwrap: 130 });
        navigator.clipboard.writeText(plainText).then(() => toast.success(successMessage), () => toast.error('Failed to copy!'));
    };

    const downloadTxtReport = () => {
        const plainText = htmlToText(generatedReport, { wordwrap: 130 });
        const element = document.createElement("a");
        const file = new Blob([plainText], {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = `Radiology_Report_${patientName.replace(/ /g, '_')}_${examDate}.txt`;
        document.body.appendChild(element); element.click(); document.body.removeChild(element);
        toastDone('TXT report downloaded!', '💾');
    };

    const downloadPdfReport = (reportContent) => {
        if (!reportContent) { setError("Report content is empty."); return; }
        setError(null);
        try {
            const doc = new jsPDF();
            const tempDiv = document.createElement('div');
            tempDiv.style.width = '170mm';
            tempDiv.innerHTML = `<h2>Radiology Report</h2>
                <p><strong>Patient:</strong> ${patientName}</p>
                <p><strong>Age:</strong> ${patientAge}</p>
                <p><strong>Date:</strong> ${examDate}</p>
                <hr/>
                ${reportContent}`;
            document.body.appendChild(tempDiv);
            doc.html(tempDiv, {
                callback: (doc) => {
                    document.body.removeChild(tempDiv);
                    doc.save(`Radiology_Report_${patientName.replace(/ /g, '_')}_${examDate}.pdf`);
                    toastDone('PDF report downloaded!', '💾');
                },
                x: 15, y: 15, width: 170, windowWidth: 800
            });
        } catch (err) {
            setError(`PDF generation failed: ${err.message}`);
            console.error(err);
        }
    };

    const handleInsertMeasurement = (finding, value) => {
        if (!editor) return;
        let currentHtml = editor.getHTML();
        const findingCleaned = finding.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const findingRegex = new RegExp(`(<strong>${findingCleaned.replace(/\s+/g, '\\s*')}:?</strong>\\s*.*?)(__\\s*x\\s*__\\s*cm|__\\s*cm|__\\s*mm)`, "i");
        const match = currentHtml.match(findingRegex);

        if (match) {
            const updatedLine = match[1].replace(match[2], `<strong>${value}</strong>`);
            currentHtml = currentHtml.replace(match[0], updatedLine);
            editor.commands.setContent(currentHtml);
            toast.success(`Inserted measurement for ${finding}`);
        } else {
            toast.error(`Could not automatically find a placeholder for "${finding}".`);
        }
    };

    const shortcuts = {
        toggleMic: { label: 'Toggle Microphone', ctrlOrCmd: true, key: 'm', action: handleToggleListening },
        generateReport: { label: 'Generate Final Report', ctrlOrCmd: true, key: 'g', action: generateFinalReport, condition: () => userFindings },
        analyzeImages: { label: 'Analyze Images', ctrlOrCmd: true, key: 'i', action: analyzeImages, condition: () => images.length > 0 },
        focusSearch: { label: 'Focus Search', ctrlOrCmd: true, key: 'f', action: () => localSearchInputRef.current?.focus() },
        focusEditor: { label: 'Focus Editor', key: 'Escape', action: () => editor?.commands.focus(), isUniversal: true },
        suggestDifferentials: { label: 'Suggest Differentials', alt: true, key: 'd', action: () => handleGetSuggestions('differentials'), condition: () => userFindings },
        generateRecommendations: { label: 'Generate Recommendations', alt: true, key: 'r', action: () => handleGetSuggestions('recommendations'), condition: () => userFindings },
        openMacros: { label: 'Open Voice Macros', alt: true, key: 'm', action: () => setShowMacroModal(true) },
        toggleProactive: { label: 'Toggle Proactive Co-pilot', alt: true, key: 'p', action: () => setIsProactiveHelpEnabled(p => !p) },
        showHelp: { label: 'Show Shortcuts Help', ctrlOrCmd: true, key: '/', action: () => setShowShortcutsModal(true) },
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const activeElement = document.activeElement;
            const isTyping = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;

            for (const config of Object.values(shortcuts)) {
                const isCtrlOrCmd = (isMac && event.metaKey) || (!isMac && event.ctrlKey);
                let keyMatch = event.key.toLowerCase() === config.key.toLowerCase();
                if (config.key === '/') keyMatch = event.key === '/';
                let modifierMatch = (config.ctrlOrCmd && isCtrlOrCmd) || (config.alt && event.altKey) || (!config.ctrlOrCmd && !config.alt && !event.altKey && !isCtrlOrCmd);
                
                if (keyMatch && modifierMatch && (config.isUniversal || !isTyping)) {
                    event.preventDefault();
                    if (config.condition === undefined || config.condition()) config.action();
                    else toast.error('Cannot perform action. Conditions not met.');
                    return;
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [editor, userFindings, images, isProactiveHelpEnabled, handleToggleListening, generateFinalReport, analyzeImages, handleGetSuggestions]);

    // --- RENDER METHOD (Completely redesigned JSX structure) ---
    return (
      <div className="min-h-screen bg-gray-700 font-sans text-gray-800">
        <Toaster position="top-right" toastOptions={{
            className: 'rounded-xl shadow-lg',
            style: { background: '#333', color: '#fff' },
        }}/>

        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-gray-200">
            <div className="container mx-auto px-4 lg:px-8 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <BrainCircuit className="text-blue-600" size={32}/>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        AI Radiology Co-Pilot
                    </h1>
                </div>
                <button onClick={() => setShowShortcutsModal(true)} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                    <Keyboard size={18}/>
                    <span>Shortcuts</span>
                </button>
            </div>
        </header>
        
        <main className="container mx-auto p-4 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* --- LEFT COLUMN: Controls & Inputs --- */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <Panel>
                <SectionHeader icon={<Settings className="mr-3 text-blue-600" size={24}/>} title="Configuration" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                    {/* Patient Info Inputs */}
                    <div>
                        <label className="font-semibold text-gray-600 flex items-center mb-1.5 text-sm"><User size={16} className="mr-2"/>Patient Name</label>
                        <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm"/>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-600 flex items-center mb-1.5 text-sm"><Calendar size={16} className="mr-2"/>Patient Age</label>
                        <input type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm"/>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-600 flex items-center mb-1.5 text-sm"><Calendar size={16} className="mr-2"/>Exam Date</label>
                        <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm"/>
                    </div>

                    {/* Proactive AI Toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-100/70 rounded-lg border border-gray-200/80">
                        <label htmlFor="proactive-toggle" className="font-semibold text-gray-700 flex items-center text-sm cursor-pointer">
                            <Lightbulb size={18} className={`mr-2 transition-colors ${isProactiveHelpEnabled ? 'text-yellow-500' : 'text-gray-400'}`}/>
                            Proactive Co-pilot
                        </label>
                        <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" id="proactive-toggle" checked={isProactiveHelpEnabled} onChange={() => setIsProactiveHelpEnabled(!isProactiveHelpEnabled)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2 appearance-none cursor-pointer transition-transform"/>
                            <label htmlFor="proactive-toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${isProactiveHelpEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}></label>
                        </div>
                    </div>

                    {/* Modality & Template Selects */}
                    <div>
                        <label className="font-semibold text-gray-600 flex items-center mb-1.5 text-sm"><Stethoscope size={16} className="mr-2"/>Modality</label>
                        <select value={modality} onChange={e => {setModality(e.target.value); setTemplate(Object.keys(templates[e.target.value])[0])}} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white shadow-sm">
                            {Object.keys(templates).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-600 flex items-center mb-1.5 text-sm"><FileText size={16} className="mr-2"/>Template</label>
                        <select value={template} onChange={e => setTemplate(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white shadow-sm" disabled={!modality}>
                            {modality && Object.keys(templates[modality] || {}).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
              </Panel>

              <Panel>
                <SectionHeader icon={<Upload className="mr-3 text-blue-600" size={24}/>} title="Image Analysis" />
                <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onPaste={handlePaste} className={`p-6 border-2 border-dashed rounded-xl text-center transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400'}`}>
                    <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" id="image-upload" multiple />
                    <label htmlFor="image-upload" className="cursor-pointer text-blue-600 font-semibold flex flex-col items-center justify-center space-y-2">
                        <Upload size={32} className="text-gray-400" />
                        <span>{isDragging ? 'Drop images here' : (images.length > 0 ? 'Add more images...' : 'Click to upload or drag & drop')}</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">You can also paste images from your clipboard</p>
                </div>

                {images.length > 0 && (
                    <div className="mt-4 space-y-4 animate-in fade-in-0">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {images.map((img, index) => (
                                <div key={index} className="relative group aspect-square">
                                    <img src={img.src} alt={`Scan ${index+1}`} className="w-full h-full object-cover rounded-lg shadow-md"/>
                                    <button onClick={() => removeImage(index)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110">
                                        <XCircle size={20}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                         <div>
                          <label className="font-semibold text-gray-600 flex items-center mb-1.5 text-sm"><Info size={16} className="mr-2"/>Clinical Context (Optional)</label>
                          <textarea value={clinicalContext} onChange={e => setClinicalContext(e.target.value)} rows="2" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm" placeholder="e.g., Patient presents with right upper quadrant pain."></textarea>
                        </div>
                        <button onClick={analyzeImages} disabled={isAiLoading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
                            {isAiLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>{aiAnalysisStatus || 'Analyzing...'}</span></> : <><BrainCircuit size={20} className="mr-2"/>Analyze Images</>}
                        </button>
                    </div>
                )}
              </Panel>

              <Panel>
                <SectionHeader icon={<FileScan className="mr-3 text-teal-600" size={24} />} title="AI Assistant">
                    <button onClick={handleParseReport} disabled={isParsing || !assistantQuery} className="text-xs bg-teal-100 text-teal-800 font-semibold py-1 px-3 rounded-md hover:bg-teal-200 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                        {isParsing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-700 mr-2"></div> : <FileScan size={14} className="mr-1" />}
                        Parse to Fields
                    </button>
                </SectionHeader>
                <textarea 
                    value={assistantQuery} 
                    onChange={(e) => setAssistantQuery(e.target.value)} 
                    rows="4" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition shadow-sm" 
                    placeholder="Paste a report for proofreading OR enter a topic (e.g., 'Liver Elastography') to generate a template..."
                />
                <button onClick={handleAIAssistant} disabled={isLoading || !assistantQuery} className="w-full mt-3 bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition flex items-center justify-center disabled:bg-teal-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
                    {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Processing...</> : <><MessageSquare className="mr-2" />Submit to Assistant</>}
                </button>
              </Panel>
            </div>

            {/* --- RIGHT COLUMN: Editor, Search & Report --- */}
            <div className="space-y-8">
              <Panel>
                  <SectionHeader icon={<Search className="mr-3 text-blue-600" size={24}/>} title="Findings Search & Insertion"/>
                  <div className="flex items-center space-x-2">
                      <input 
                          type="text" 
                          ref={localSearchInputRef}
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSearch()}
                          placeholder="Search for conditions, organs, or findings..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                      />
                      <button ref={searchButtonRef} onClick={handleSearch} className="bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg flex-shrink-0">
                          <Search size={24} />
                      </button>
                  </div>
                   <div className="grid grid-cols-2 gap-2 mt-3">
                    <button onClick={() => handleAiFindingsSearch()} disabled={isSearching || !baseSearchQuery} className="w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed text-sm">
                      {isSearching && !aiKnowledgeLookupResult ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>Searching...</span></> : <><Search size={18} className="mr-2" />AI Findings</>}
                    </button>
                    <button onClick={() => handleAiKnowledgeSearch()} disabled={isSearching || !baseSearchQuery} className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition flex items-center justify-center disabled:bg-teal-400 disabled:cursor-not-allowed text-sm">
                      {isSearching && aiKnowledgeLookupResult ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>Searching...</span></> : <><BookOpen size={18} className="mr-2" />Knowledge</>}
                    </button>
                  </div>
                  
                  {isSearching && <SearchResultSkeleton />}
                  
                  {/* Results Display Area */}
                  {!isSearching && (localSearchResults.length > 0 || allAiFullReports.length > 0 || allAiSearchResults.length > 0) && (
                    <div className="mt-4 space-y-4 max-h-96 overflow-y-auto pr-2 -mr-2">
                        {/* AI Full Reports */}
                        {allAiFullReports.length > 0 && (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
                                <h4 className="font-bold text-blue-800">AI-Drafted Report (Version {currentReportPage + 1}/{allAiFullReports.length})</h4>
                                <div className="text-sm prose max-w-none bg-white p-2 rounded" dangerouslySetInnerHTML={{__html: allAiFullReports[currentReportPage]?.fullReportText}}/>
                                <button onClick={() => insertFindings(allAiFullReports[currentReportPage])} className="w-full mt-2 bg-blue-200 text-blue-800 font-bold py-2 px-4 rounded-lg hover:bg-blue-300 transition flex items-center justify-center">
                                    <PlusCircle size={18} className="mr-2" /> Insert this Version
                                </button>
                                <div className="flex justify-between items-center pt-2">
                                    <button onClick={handlePreviousReport} disabled={currentReportPage === 0} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50 text-sm">Prev</button>
                                    <button onClick={handleNextReport} disabled={isSearching} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50 text-sm">Next</button>
                                </div>
                            </div>
                        )}
                        {/* Local & AI Findings */}
                        {[...localSearchResults, ...(allAiSearchResults[currentAiPage] || [])].map((result, index) => (
                          <div key={result.id || index} className="p-4 bg-gray-50/80 rounded-lg border border-gray-200/80 space-y-2 group hover:border-blue-300 transition">
                              <h4 className="font-bold text-gray-800 group-hover:text-blue-700 transition">{result.findingName}</h4>
                              <p className="text-xs text-gray-500"><strong>ORGAN:</strong> {result.organ}</p>
                              <button onClick={() => insertFindings(result)} className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition flex items-center justify-center">
                                  <PlusCircle size={18} className="mr-2" /> Insert Finding
                              </button>
                          </div>
                        ))}
                         {/* AI Search Pagination */}
                        {allAiSearchResults.length > 0 && (
                             <div className="flex justify-between items-center pt-2">
                                <button onClick={handlePreviousPage} disabled={currentAiPage === 0} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50 text-sm">Previous</button>
                                <span className="text-sm font-semibold">Page {currentAiPage + 1}</span>
                                <button onClick={handleNextPage} disabled={isSearching} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50 text-sm">Next</button>
                            </div>
                        )}
                    </div>
                  )}

              </Panel>
              
              <Panel>
                <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <FileText className="mr-3 text-blue-600" size={24}/>
                        <h2 className="text-xl font-bold text-gray-800">Report Editor</h2>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => handleGetSuggestions('differentials')} disabled={isSuggestionLoading || !userFindings} className="text-xs bg-gray-200 text-gray-700 font-semibold py-1.5 px-3 rounded-md hover:bg-gray-300 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                            <Lightbulb size={14} className="mr-1.5" /> Differentials
                        </button>
                        <button onClick={() => handleGetSuggestions('recommendations')} disabled={isSuggestionLoading || !userFindings} className="text-xs bg-gray-200 text-gray-700 font-semibold py-1.5 px-3 rounded-md hover:bg-gray-300 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                            <ListPlus size={14} className="mr-1.5" /> Recommendations
                        </button>
                    </div>
                </div>

                <div className={`rounded-lg bg-white shadow-inner border transition-all ${criticalFindingData ? 'border-2 border-red-500' : 'border-gray-300'}`}>
                  <MenuBar editor={editor} />
                  <div className="min-h-[250px] max-h-[50vh] overflow-y-auto">
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </Panel>

              {/* Generated Report Output */}
              <div>
                <Panel>
                    <SectionHeader icon={<CheckCircle className="mr-3 text-green-600" size={24}/>} title="Final Report Preview">
                        <div className="flex items-center space-x-1.5">
                            <button onClick={() => copyToClipboard(generatedReport)} title="Copy as Text" className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-gray-600 disabled:opacity-50" disabled={!generatedReport}><Clipboard size={18}/></button>
                            <button onClick={downloadTxtReport} title="Download as .txt" className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-gray-600 disabled:opacity-50" disabled={!generatedReport}><FileText size={18}/></button>
                            <button onClick={() => downloadPdfReport(generatedReport)} title="Download as .pdf" className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-gray-600 disabled:opacity-50" disabled={!generatedReport}><FileJson size={18}/></button>
                        </div>
                    </SectionHeader>
                    <div className="relative w-full min-h-[300px] max-h-[60vh] overflow-y-auto bg-gray-50/70 rounded-lg border p-4 shadow-inner">
                        {isLoading ? <ReportSkeleton /> : <div dangerouslySetInnerHTML={{ __html: generatedReport || '<p class="text-gray-400">Click "Generate Full Report" to see the final output here.</p>' }} className="prose max-w-none prose-sm"/>}
                    </div>
                </Panel>
                <button onClick={generateFinalReport} disabled={isLoading || !userFindings} className="w-full mt-4 bg-green-600 text-white font-bold py-3.5 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center disabled:bg-green-400 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Generating...</> : <><Download className="mr-2" /> Generate Full Report</>}
                </button>
              </div>

              {/* AI-Extracted Data Panels */}
              {Object.keys(structuredData).length > 0 && 
                <Panel className="bg-gray-50/50">
                    <h3 className="font-semibold text-gray-700 flex items-center mb-3 text-base"><Info className="mr-2"/>Live Report Summary</h3>
                    {isExtracting && <div className="flex items-center text-sm text-gray-500"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>Extracting...</div>}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {Object.entries(structuredData).map(([key, value]) => (
                            <div key={key}>
                                <span className="font-semibold text-gray-500">{key}: </span>
                                <span className="text-gray-900">{String(value)}</span>
                            </div>
                        ))}
                    </div>
                </Panel>
              }
              <AiSuggestedMeasurementsPanel 
                  measurements={aiMeasurements}
                  onInsert={handleInsertMeasurement}
                  onClear={() => setAiMeasurements([])}
              />
              <KnowledgeLookupPanel
                result={aiKnowledgeLookupResult}
                onClose={() => setAiKnowledgeLookupResult(null)}
                onInsert={(content) => {
                    if (editor) {
                        editor.chain().focus().insertContent(content).run();
                        toastDone('Knowledge summary inserted.', '📚');
                        setAiKnowledgeLookupResult(null);
                    }
                }}
              />
            </div>
          </div>
        </main>

        {/* --- MODALS & FLOATING UI --- */}
        <CriticalFindingModal 
            findingData={criticalFindingData}
            onAcknowledge={() => setCriticalFindingData(null)}
            onInsertMacro={() => {
                if (editor && criticalFindingData?.reportMacro) {
                    editor.chain().focus().insertContent(`<p><strong>${criticalFindingData.reportMacro}</strong></p>`).run();
                    toast.success("Critical finding macro inserted.");
                }
                setCriticalFindingData(null);
            }}
            onPrepareNotification={() => {
                if (criticalFindingData?.notificationTemplate) {
                    copyToClipboard(criticalFindingData.notificationTemplate, "Notification text copied!");
                }
                setCriticalFindingData(null);
            }}
        />

        {showShortcutsModal && <ShortcutsHelpModal shortcuts={shortcuts} onClose={() => setShowShortcutsModal(false)} />}
        
        {/* Suggestions Modal */}
        {showSuggestionsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95">
                <div className="p-6 border-b">
                  <h3 className="text-2xl font-bold text-gray-800 capitalize flex items-center">
                    <Lightbulb size={24} className="mr-3 text-yellow-500" />
                    {suggestionType === 'differentials' ? 'Suggested Differential Diagnoses' : 'Suggested Recommendations'}
                  </h3>
                </div>
                <div className="p-6 overflow-y-auto flex-grow prose prose-sm max-w-none">
                  {isSuggestionLoading ? (
                    <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{aiSuggestions}</p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 border-t rounded-b-2xl flex justify-end space-x-3">
                  <button onClick={() => setShowSuggestionsModal(false)} className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">Close</button>
                  <button onClick={appendSuggestionsToReport} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Append to Report</button>
                </div>
              </div>
            </div>
          )}

        {/* Macro Management Modal */}
        {showMacroModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95">
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center"><Mic size={24} className="mr-3 text-blue-600"/>Manage Voice Macros</h3>
                  <button onClick={() => setShowMacroModal(false)} className="text-gray-500 hover:text-gray-800"><XCircle /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow space-y-6">
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-gray-700">Add New Macro</h4>
                    <div className="space-y-3 bg-gray-50/80 p-4 rounded-lg border">
                       <input type="text" placeholder="Voice Command (e.g., 'normal abdomen')" value={newMacroCommand} onChange={(e) => setNewMacroCommand(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md"/>
                       <textarea placeholder="Text to insert into report" value={newMacroText} onChange={(e) => setNewMacroText(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" rows="3"></textarea>
                       <button onClick={() => { if(newMacroCommand && newMacroText) { setMacros([...macros, { command: newMacroCommand, text: newMacroText }]); setNewMacroCommand(''); setNewMacroText(''); toast.success("Macro added!"); } }} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Add Macro</button>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-gray-700">Existing Macros</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {macros.map((macro, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                          <div>
                            <p className="font-semibold text-blue-800">{macro.command}</p>
                            <p className="text-sm text-gray-600 italic truncate">"{macro.text}"</p>
                          </div>
                          <button onClick={() => {setMacros(macros.filter((_, i) => i !== index)); toast.success("Macro removed.");}} className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-100 transition">
                            <Trash2 size={18}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Floating Action Button for Mic */}
         <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center group">
            <button
                onClick={handleToggleListening}
                disabled={!isDictationSupported}
                title={isDictationSupported ? "Toggle Voice Dictation (Ctrl + M)" : "Dictation not supported"}
                className={`w-16 h-16 rounded-full text-white flex items-center justify-center shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110
                    ${voiceStatus === 'listening' ? 'bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}
                    disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
                <Mic size={28} />
            </button>
            {voiceStatus === 'listening' && (
                <div className="absolute bottom-20 text-center bg-gray-900/80 text-white px-4 py-2 rounded-lg shadow-lg max-w-xs transition-all opacity-0 group-hover:opacity-100">
                    <p className="font-bold animate-pulse">Listening...</p>
                    {interimTranscript && <p className="mt-1 italic text-sm">{interimTranscript}</p>}
                </div>
            )}
        </div>
      </div>
    );
  };
  
  export default App;

  // Simple CSS-in-JS for toggle switch state, as pseudo-elements are tricky with Tailwind
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    .toggle-checkbox:checked {
        transform: translateX(100%);
        border-color: #4338ca; /* indigo-700 */
    }
    .toggle-checkbox {
        right: auto;
        left: 0;
        transition: all 0.2s ease-in-out;
    }
  `;
  document.head.appendChild(styleSheet);