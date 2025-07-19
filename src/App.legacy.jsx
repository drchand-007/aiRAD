import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, FileText, Clipboard, Settings, Download, BrainCircuit, User, Calendar, Stethoscope, XCircle, FileType, FileJson, Search, PlusCircle, MessageSquare, CheckCircle, ChevronLeft, ChevronRight, Lightbulb, ListPlus, AlertTriangle, FileScan, Mic, Plus, Trash2, Bold, Italic, List, ListOrdered, Pilcrow, BookOpen, Link as LinkIcon } from 'lucide-react';
import Placeholder from '@tiptap/extension-placeholder';
import { Toaster, toast } from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import jsPDF from 'jspdf';
import { htmlToText } from 'html-to-text';
// NOTE: findings.js is assumed to be in the same directory, but its contents are commented out as per the original code.
 import { localFindings } from './findings.js'; 
// const localFindings = []; // Using an empty array as a fallback.


// Pre-defined templates for different modalities - ENHANCED VERSION

// Pre-defined templates for different modalities - ENHANCED VERSION
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

// --- NEW COMPONENT: AIKnowledgePanel ---
const AIKnowledgePanel = ({ isLoading, result, onInsert, onClose }) => {
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-8">
                <h2 className="text-2xl font-bold text-gray-700 flex items-center mb-4"><BrainCircuit className="mr-3 text-purple-500" />AI Co-pilot</h2>
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/3 mt-4"></div>
                </div>
            </div>
        );
    }

    if (!result) {
        return null;
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700 flex items-center"><BrainCircuit className="mr-3 text-purple-500" />AI Co-pilot</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                    <XCircle size={24} />
                </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: result.summary }} />

                {result.referenceImages && result.referenceImages.length > 0 && (
                    <div>
                        <h4 className="font-bold text-gray-700 mt-4 mb-2">Reference Images</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {result.referenceImages.map((img, index) => (
                                <div key={index}>
                                    <a href={img.url} target="_blank" rel="noopener noreferrer">
                                        <img src={img.url} alt={img.caption} className="rounded-lg border" onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/400x300/e2e8f0/4a5568?text=Image+Not+Found`; }}/>
                                    </a>
                                    <p className="text-xs text-center mt-1">{img.caption}</p>
                                </div>
                            ))}
                        </div>
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
                    onClick={() => onInsert(result.summary)}
                    className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
                >
                    <PlusCircle size={18} className="mr-2" /> Insert Summary into Report
                </button>
                <div className="mt-3 text-xs p-2 bg-yellow-100 text-yellow-800 rounded-lg text-center">
                   ⚠️ AI-generated assistance. For reference only. Clinical verification required.
                </div>
            </div>
        </div>
    );
};
const ShortcutsHelpModal = ({ shortcuts, onClose }) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
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


const normalizeSearchTerm = (text) => {
    let normalized = text.toLowerCase();
    const gradeMap = {
        'one': '1', 'i': '1',
        'two': '2', 'ii': '2',
        'three': '3', 'iii': '3',
        'four': '4', 'iv': '4',
        'five': '5', 'v': '5'
    };
    normalized = normalized.replace(/\bgrade\s+(one|two|three|four|five|i|ii|iii|iv|v)\b/gi, (match, p1) => {
        return `grade ${gradeMap[p1.toLowerCase()]}`;
    });
    return normalized;
}

const App = () => {
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
  const [copySuccess, setCopySuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [localSearchResults, setLocalSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [baseSearchQuery, setBaseSearchQuery] = useState('');
  const [allAiSearchResults, setAllAiSearchResults] = useState([]);
  const [currentAiPage, setCurrentAiPage] = useState(0);
  const [allAiFullReports, setAllAiFullReports] = useState([]);
  const [currentReportPage, setCurrentReportPage] = useState(0);

  // State for new features
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [suggestionType, setSuggestionType] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isCriticalFinding, setIsCriticalFinding] = useState(false);
  const [criticalFindingMessage, setCriticalFindingMessage] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('idle'); // 'idle', 'listening'
  const [isDictationSupported, setIsDictationSupported] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [macros, setMacros] = useState([{ command: 'normal abdomen', text: 'This is a sample normal abdomen report.' },{ command: 'Renal calculus', text: 'A calculus measuring __ x __ cm is noted in the lower/mid/upper pole calyx.' },{ command: 'Renal calculi', text: 'Multiple calculi noted in the right/left kidney largest one measuring __ x __ cm is noted in the lower/mid/upper pole calyx.' }]);
  const [showMacroModal, setShowMacroModal] = useState(false);
  const [newMacroCommand, setNewMacroCommand] = useState('');
  const [newMacroText, setNewMacroText] = useState('');

  // --- NEW STATE for AI Knowledge Panel ---
  const [aiKnowledgeResult, setAiKnowledgeResult] = useState(null);
  const [isAiKnowledgeLoading, setIsAiKnowledgeLoading] = useState(false);
  
  // --- NEW STATE for Proactive Co-pilot ---
  const [isProactiveHelpEnabled, setIsProactiveHelpEnabled] = useState(true);

  // Structured Data Extraction State
  const [structuredData, setStructuredData] = useState({});
  const [isExtracting, setIsExtracting] = useState(false);
  
  // State for drag-and-drop UI
  const [isDragging, setIsDragging] = useState(false);
  // --- NEW STATE for Shortcuts ---
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  
  const debounceTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);
  const searchButtonRef = useRef(null);
  const voiceStatusRef = useRef(voiceStatus);
  const dataExtractTimeoutRef = useRef(null);
  const proactiveAnalysisTimeoutRef = useRef(null);
  const localSearchInputRef = useRef(null); // Ref for local search input



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

const toastDone = (msg) =>
  toast(msg, {
    duration: 2500,
    ariaProps: { role: 'status', 'aria-live': 'polite' },
  });

// --- NEW FUNCTION: Proactive Analysis ---
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
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        };
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // If you have a Gemini API key, place it here.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) return; // Fail silently

        const result = await response.json();
        const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

        if (textResult) {
            const parsedResult = JSON.parse(textResult);
            if (parsedResult.shouldSearch && parsedResult.searchQuery) {
                toast('Co-pilot found something relevant...', { icon: '💡' });
                // Reuse the existing knowledge search function
                handleAiKnowledgeSearch(parsedResult.searchQuery);
            }
        }
    } catch (err) {
        console.error("Proactive analysis failed:", err); // Log error but don't bother the user
    }
};

// --- NEW: Debounced callback for proactive analysis ---
const debouncedProactiveAnalysis = useCallback((text) => {
    if (proactiveAnalysisTimeoutRef.current) {
        clearTimeout(proactiveAnalysisTimeoutRef.current);
    }
    proactiveAnalysisTimeoutRef.current = setTimeout(() => {
        // Check conditions before running the analysis
        if (isProactiveHelpEnabled && !isAiKnowledgeLoading && text.trim().length > 40) {
             runProactiveAnalysis(text);
        }
    }, 3000); // 3-second delay after user stops typing
}, [isProactiveHelpEnabled, isAiKnowledgeLoading]);


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
    const html = editor.getHTML();
    const text = editor.getText();
    setUserFindings(html);
    debouncedCriticalCheck(text);
    debouncedExtractData(text);
    // --- NEW: Trigger proactive analysis on update ---
    debouncedProactiveAnalysis(text);
  },
});

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const initialContent = templates[modality]?.[template] || '';
      if (editor.getHTML() !== initialContent) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [modality, template, editor]);

  const debouncedCriticalCheck = useCallback((text) => {
    if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
        if (text.trim() !== '') {
            checkForCriticalFindings(text);
        } else {
            setIsCriticalFinding(false);
            setCriticalFindingMessage('');
        }
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
        const payload = { 
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        };
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // If you have a Gemini API key, place it here.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
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
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // If you have a Gemini API key, place it here.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
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
  }, []);

  // --- NEW FUNCTION: AI Knowledge Search ---
  const handleAiKnowledgeSearch = async (query) => {
      setIsAiKnowledgeLoading(true);
      setAiKnowledgeResult(null);
      setError(null);

      // Anonymize context before sending to LLM
      const currentReportText = editor ? editor.getText() : '';
      const sanitizedContext = `
          Current Report Context:
          - Modality: ${modality}
          - Body Part: ${template}
          - Patient Age: ${patientAge} years
          - Dictated Findings (first 1000 chars): "${currentReportText.substring(0, 1000)}..." 
          // IMPORTANT: Patient Name and other direct PHI are excluded.
      `;

      const prompt = `
          You are a world-class radiological co-pilot. Your task is to answer the user's query based ONLY on information from authoritative, web-searchable sources like Radiopaedia, PubMed, StatPearls, and official guidelines from bodies like the ACR or ESR.
          
          USER QUERY: "${query}"
          
          ANONYMIZED CONTEXT: ${sanitizedContext}
          
          Please provide a concise summary, cite your sources clearly, and if relevant, provide direct URLs for reference diagrams or images.
          Respond with a single, valid JSON object with this exact schema:
          {
            "summary": "HTML-formatted string of the answer. Use <p>, <ul>, <li>, and <strong> tags for clarity.",
            "sources": [{ "name": "string", "url": "string" }],
            "referenceImages": [{ "caption": "string", "url": "string" }]
          }
          If you cannot find a definitive answer from a reliable source, return a summary explaining that, with an empty array for sources. Do not invent information.
      `;

      try {
          const payload = {
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" }
          };
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // If you have a Gemini API key, place it here.
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
          
          const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          if (!response.ok) throw new Error(`API Error: ${response.status}`);
          
          const result = await response.json();
          const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

          if (textResult) {
              const parsedResult = JSON.parse(textResult);
              setAiKnowledgeResult(parsedResult);
              toastDone('AI Co-pilot has a suggestion.');
          } else {
              throw new Error("No valid response from AI Co-pilot.");
          }
      } catch (err) {
          setError("AI Knowledge Search failed: " + err.message);
          setAiKnowledgeResult(null);
      } finally {
          setIsAiKnowledgeLoading(false);
      }
  };

  // --- UPDATED: Voice Command Handler ---
  const handleVoiceCommand = async (command) => {
    if (!editor || !command) return;
    const commandLC = command.toLowerCase().trim();

    const aiSearchKeyword = "look up";
    const commandKeyword = "command";
    const macroKeyword = "macro";

    if (commandLC.startsWith(aiSearchKeyword)) {
        const query = commandLC.substring(aiSearchKeyword.length).trim();
        if (query) {
            await handleAiKnowledgeSearch(query);
        }
        return; // Exit after handling
    }

    if (commandLC.startsWith(macroKeyword)) {
        const macroPhrase = commandLC.substring(macroKeyword.length).trim().replace(/[.,?]/g, '');
        const macro = macros.find(m => macroPhrase === m.command.toLowerCase());
        if (macro) {
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
            const reportHtml = generateFinalReport();
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
            const combinedResults = [...localSearchResults, ...(allAiSearchResults[currentAiPage] || [])];
            if (!isNaN(resultNum) && resultNum > 0 && resultNum <= combinedResults.length) {
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
                    editor.chain().focus().setTextSelection({ from: startOfLastSentence, to: endOfLastSentence }).toggleBold().run();
                }
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
  
  const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
  };

  const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
  };

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
        if (items[i].type.indexOf("image") !== -1) {
            imageFiles.push(items[i].getAsFile());
        }
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
    if (images.length === 0) {
      setError("Please upload one or more images first.");
      return;
    }
    setIsAiLoading(true);
    setAiAnalysisStatus('Analyzing images...');
    setError(null);
    if(editor) editor.commands.clearContent();
    
    try {
        const prompt = `
            Act as an expert radiologist. Analyze the following radiology images carefully.
            The user has provided this clinical context: "${clinicalContext || 'None'}".
            Your task is to generate a comprehensive, professional radiology report based on the images and the provided context. The report should have two main sections: 'FINDINGS' and 'IMPRESSION'.
            
            Under 'FINDINGS', describe all observations in detail, organ by organ, using standard radiological terminology.
            Under 'IMPRESSION', provide a concise conclusion summarizing the most significant findings.
            
            The output MUST be a single string of properly formatted HTML. Use <p> tags for paragraphs and line breaks. Use <strong> for headers like 'IMPRESSION:' and 'FINDINGS:'.
            For example:
            <p><strong>IMPRESSION:</strong></p><p>Impression text here.</p><br><p><strong>FINDINGS:</strong></p><p>Findings text here.</p>
        `;
        const imageParts = images.map(image => ({ inlineData: { mimeType: image.type, data: image.base64 } }));
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] }] };
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // If you have a Gemini API key, place it here.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

        const result = await response.json();
        const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;
        if (textResult && editor) {
            editor.commands.setContent(textResult);
            toastDone('AI analysis complete');
        } else {
            throw new Error("No findings returned from AI.");
        }
    } catch (err) {
        setError("Failed to analyze images. " + err.message);
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
      
      const normalizedQuery = normalizeSearchTerm(searchQuery);
      const results = localFindings.filter(finding => 
          normalizeSearchTerm(finding.findingName).includes(normalizedQuery)
      );
      setLocalSearchResults(results);

      setAllAiSearchResults([]);
      setCurrentAiPage(0);
      setAllAiFullReports([]);
      setCurrentReportPage(0);
      
      setBaseSearchQuery(searchQuery);
  };
  
  const handleAiSearch = async (isMoreQuery = false) => {
    if (!baseSearchQuery) {
        setError("Please perform a standard search first.");
        return;
    }
    setIsSearching(true);
    setError(null);
    
    const currentQuery = isMoreQuery ? `${baseSearchQuery} some more` : baseSearchQuery;
    
    const existingFindingNames = allAiSearchResults.flat().map(r => r.findingName);
    const existingReportText = allAiFullReports.map(r => r.fullReportText).join('\n\n---\n\n');
    
    const isReportContext = allAiFullReports.length > 0;
    
    const prompt = `
      Analyze the user's medical search query: "${currentQuery}". Provide a highly detailed, clinically accurate response in JSON format.
      ${isMoreQuery && existingFindingNames.length > 0 ? `The user wants MORE findings. Exclude the following findings from your response if possible: ${JSON.stringify(existingFindingNames)}.` : ''}
      
      First, determine the query type:
      1.  A FULL REPORT request from a descriptive sentence (e.g., "USG report for an ankle with mild thickening of ATFL", "Provide me the complete USG Scrotum Report", "Provide me the various versions of the USG Abdomen and Pelvis report.")?
      2.  A VERY SPECIFIC finding query (e.g., "Grade I fatty liver", "simple renal cyst")?
      3.  A GENERAL category query (e.g., "liver findings", "carotid disease")?

      Based on the type, structure your response as follows:

      - If Type 1 (FULL REPORT):
        ${isMoreQuery && existingReportText ? `You have already generated the following report(s). Please provide a different version or variation, avoiding repetition of the exact same structure and phrasing: \n\n${existingReportText}` : ''}
        Return a JSON object with "queryType": "fullReport", "modality": "Ultrasound", "template": (e.g., "Scrotum"), and "fullReportText": (a complete, professionally worded findings and impression section based on the query).
        
      - If Type 2 (VERY SPECIFIC):
        Return a JSON object with "queryType": "specificFinding" and "results": [an array with a SINGLE detailed finding object].
        For "Grade I fatty liver", the finding MUST include a randomized fat fraction between 5% and 20%. For this specific query, use ${(Math.random() * (20 - 5) + 5).toFixed(1)}%.
        
      - If Type 3 (GENERAL) or a "some more" query:
        Return a JSON object with "queryType": "generalFindings" and "results": [an array of MULTIPLE (around 3-5) common, distinct findings related to "${currentQuery}"].

    //  SCHEMA for each finding object within the "results" array:
    //  - "findingName": Short name for the pathology (e.g., "Plaque Formation").
    //  - "organ": Primary organ involved (e.g., "LIVER").
    //  - "findings": A highly detailed, clinically accurate description, including typical measurements, echogenicity, vascularity, and other relevant sonographic features.
    //  - "impression": A detailed, conclusive statement for the finding, often including grading or classification.

      Always return a single, valid JSON object as the root of your response.
    `;

    try {
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // If you have a Gemini API key, place it here.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

        const result = await response.json();
        if (result.candidates?.[0]?.content.parts?.[0]?.text) {
            const textResult = result.candidates[0].content.parts[0].text;
            let jsonString = '';
            const fencedMatch = textResult.match(/```json\n([\s\S]*?)\n```/s);
            jsonString = fencedMatch ? fencedMatch[1] : textResult;
            
            try {
                const parsedResult = JSON.parse(jsonString);
                
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

  const checkForCriticalFindings = useCallback(async (plainTextFindings) => {
    const prompt = `
      Act as a vigilant radiologist. Analyze the following report text. Determine if it contains any critical, urgent, or unexpected findings that require immediate attention (e.g., pneumothorax, aortic dissection, acute hemorrhage, large vessel occlusion, etc.).
      Respond with a simple JSON object in the format: {"isCritical": boolean, "finding": "string_name_of_finding_or_null"}.
      
      Report Text:
      ---
      ${plainTextFindings}
      ---
    `;
    try {
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // If you have a Gemini API key, place it here.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) return; // Fail silently
      const result = await response.json();
      const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;
      if (textResult) {
        const jsonString = textResult.match(/```json\n([\s\S]*?)\n```/s)?.[1] || textResult;
        const parsed = JSON.parse(jsonString);
        if (parsed.isCritical) {
          setIsCriticalFinding(true);
          setCriticalFindingMessage(parsed.finding);
        } else {
          setIsCriticalFinding(false);
          setCriticalFindingMessage('');
        }
      }
    } catch (err) {
      console.error("Critical finding check failed:", err);
    }
  }, []);

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
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // If you have a Gemini API key, place it here.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
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
        "patientAge": "string",
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
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // If you have a Gemini API key, place it here.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      
      const result = await response.json();
      const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

      if (textResult) {
        const jsonString = textResult.match(/```json\n([\s\S]*?)\n```/s)?.[1] || textResult;
        const parsed = JSON.parse(jsonString);
        
        if(parsed.patientName) setPatientName(parsed.patientName);
        if(parsed.patientAge) setPatientAge(parsed.patientAge);
        if(parsed.examDate) setExamDate(parsed.examDate);
        if(parsed.modality) setModality(parsed.modality);
        if(parsed.bodyPart) setTemplate(parsed.bodyPart);
        if(parsed.reportBody && editor) {
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
    
    editor.chain().focus().insertContent(`<br>${header}${formattedSuggestions}`).run();

    setShowSuggestionsModal(false);
    setAiSuggestions('');
  };

  const handleNextPage = () => {
    if (currentAiPage >= allAiSearchResults.length - 1) {
      handleAiSearch(true);
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
      handleAiSearch(true);
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

    if (findingToInsert.queryType === 'fullReport') {
      const { modality: newModality, template: newTemplate, fullReportText } = findingToInsert;
      setModality(newModality);
      setTemplate(newTemplate);
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

    const impressionHeaderRegex = /(<p><strong>IMPRESSION:<\/strong>)/i;
    if (impressionHeaderRegex.test(currentHtml)) {
        currentHtml = currentHtml.replace(impressionHeaderRegex, `$1${newImpressionHtml}`);
    } else if (wasFindingHandled) {
        currentHtml += `<br><p><strong>IMPRESSION:</strong></p>${newImpressionHtml}`;
    }

    if (wasFindingHandled) {
        editor.commands.setContent(currentHtml);
    } else {
        const fallbackHtml = `<p><strong>${organ.toUpperCase()}:</strong> ${findings}</p>`;
        editor.chain().focus().insertContent(fallbackHtml).run();
    }
  };


  const handleAIAssistant = async () => {
    if (!assistantQuery) {
      setError("Please enter a topic or paste a report in the AI Assistant box.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedReport('');

    try {
      const prompt = `
        You are an expert radiologist and medical editor.Analyze the user's request below and perform one of two tasks:

        1.  **If the request is a topic (e.g., "Liver Elastography", "CT KUB report template"):**
            Generate a comprehensive, professionally formatted report template for that topic. The template should be detailed, including all standard sections, findings, interpretations, and placeholders like '[Patient Name]' as appropriate. The output MUST be a single string of properly formatted HTML.

        2.  **If the request is a full or partial medical report:**
            Meticulously proofread the report for any clinical, grammatical, or structural errors. Return a fully corrected, professional version of the report, formatted as an HTML string. If the report is already accurate, return a confirmation message like: "The provided report is accurate and requires no corrections."

        User's Request:
        ---
        ${assistantQuery}
        ---
      `;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // If you have a Gemini API key, place it here.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

        const result = await response.json();
        const textResult = result.candidates?.[0]?.content.parts?.[0]?.text;

        if (textResult && editor) {
            editor.commands.setContent(textResult);
        } else {
            throw new Error("No response from AI assistant.");
        }
    } catch (err) {
        setError("AI Assistant request failed: " + err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const generateFinalReport = () => {
    let reportHtml = '';
    if (editor) {
      reportHtml = editor.getHTML();
      setGeneratedReport(reportHtml);
       toastDone('Report generated');
    }
    return reportHtml;
  };
  
      const copyToClipboard = (text) => {
          const plainText = htmlToText(text, {
              wordwrap: 130
          });

          const textArea = document.createElement('textarea');
          textArea.value = plainText;
          document.body.appendChild(textArea);
          textArea.select();
          try { document.execCommand('copy'); setCopySuccess('Copied!'); setTimeout(() => setCopySuccess(''), 2000); }
          catch (err) { setCopySuccess('Failed to copy'); }
          document.body.removeChild(textArea);

      };

      const downloadTxtReport = () => {
          const plainText = htmlToText(generatedReport, {
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
      // --- NEW: Shortcut Configuration & Handler ---
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
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
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

    return (
      
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
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
          /* --- NEW: CSS for Proactive Toggle --- */
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
        `}</style>
        <div className="container mx-auto p-4 lg:p-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">AI-Assisted Radiology Reporting</h1>
            <p className="text-lg text-gray-600 mt-2">Streamline your workflow with AI-powered insights.</p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Controls & Inputs */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-700 flex items-center"><Settings className="mr-3 text-blue-500" />Controls</h2>
                <button onClick={() => setShowMacroModal(true)} className="text-sm bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md hover:bg-blue-200 transition flex items-center">
                  <Plus size={14} className="mr-1" /> Voice Macros
                </button>
              </div>

              {/* --- NEW: Proactive Co-pilot Toggle --- */}
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
              
              <div className="space-y-3 p-4 bg-gray-100 rounded-lg">
                  <label className="font-semibold text-gray-700 flex items-center"><Search className="mr-2" />Local Findings Search</label>
                  <div className="flex items-center space-x-2">
                      <input 
                          type="text" 
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSearch()}
                          placeholder="e.g., Cholelithiasis or USG Scrotum report"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition"
                      />
                      <button ref={searchButtonRef} onClick={handleSearch} className="bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition flex items-center justify-center">
                          <Search size={20} />
                      </button>
                  </div>
                  
                  {isSearching && <SearchResultSkeleton />}

                  {!isSearching && localSearchResults.length > 0 && (
                      <div className="mt-3 space-y-3">
                      <h3 className="font-bold text-gray-700">Standard Findings</h3>
                      {localSearchResults.map((result, index) => (
                          <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-2 relative">
                              <span className="absolute top-2 right-2 bg-purple-200 text-purple-800 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{index + 1}</span>
                              <h4 className="font-bold text-purple-800">{result.findingName}</h4>
                              <div className="text-sm">
                              <p><span className="font-semibold">ORGAN:</span> {result.organ}</p>
                              <p><span className="font-semibold">FINDINGS:</span> {result.findings}</p>
                              <p><span className="font-semibold">IMPRESSION:</span> {result.impression}</p>
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

                <button onClick={() => handleAiSearch()} disabled={isSearching || !baseSearchQuery} className="w-full mt-2 bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition flex items-center justify-center disabled:bg-indigo-300">
                  {isSearching && !allAiFullReports.length && !allAiSearchResults.length ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>Searching AI...</span></> : <><BrainCircuit size={20} className="mr-2" />Search with AI</>}
                </button>
                  
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-semibold text-gray-600 flex items-center mb-2"><User size={18} className="mr-2"/>Patient Name</label>
                    <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
                </div>
                <div>
                    <label className="font-semibold text-gray-600 flex items-center mb-2"><Calendar size={18} className="mr-2"/>Patient Age</label>
                    <input type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
                </div>
                <div>
                    <label className="font-semibold text-gray-600 flex items-center mb-2"><Calendar size={18} className="mr-2"/>Exam Date</label>
                    <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"/>
                </div>
              </div>
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
              <div className="space-y-3">
                <label className="font-semibold text-gray-600 flex items-center"><Upload className="mr-2"/>Radiology Images</label>
                <div 
                    onDragOver={handleDragOver} 
                    onDragLeave={handleDragLeave} 
                    onDrop={handleDrop} 
                    onPaste={handlePaste}
                    className={`p-4 border-2 border-dashed rounded-lg text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                >
                    <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" id="image-upload" multiple />
                    <label htmlFor="image-upload" className="cursor-pointer text-blue-600 font-semibold">
                        {isDragging ? 'Drop images here' : (images.length > 0 ? 'Add more images' : 'Choose image(s)')}
                    </label>
                    <p className="text-sm text-gray-500 mt-1">or drag and drop, or paste from clipboard</p>
                </div>
                {images.length > 0 && (
                    <div className="mt-4 p-2 border rounded-lg bg-gray-100">
                        <div className="space-y-2 mb-2">
                          <label className="font-semibold text-gray-600 flex items-center"><MessageSquare size={18} className="mr-2" />Clinical Context (Optional)</label>
                          <textarea value={clinicalContext} onChange={e => setClinicalContext(e.target.value)} rows="2" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition" placeholder="e.g., Patient presents with right upper quadrant pain."></textarea>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {images.map((img, index) => (
                            <div key={index} className="relative group">
                                    <img src={img.src} alt={`Scan ${index+1}`} className="w-full h-24 object-cover rounded-md shadow-md"/>
                                    <button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XCircle size={18}/>
                                    </button>
                            </div>
                            ))}
                        </div>
                        <button onClick={analyzeImages} disabled={isAiLoading} className="w-full mt-3 bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition flex items-center justify-center disabled:bg-indigo-300">
                        {isAiLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>{aiAnalysisStatus || 'Analyzing...'}</span></> : <><BrainCircuit size={20} className="mr-2"/>Analyze Images</>}
                        </button>
                    </div>
                )}
              </div>
              {/* AI ASSISTANT COMPONENT RE-ADDED */}
              <div className="space-y-2 mt-4">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-600 flex items-center"><CheckCircle className="mr-2 text-teal-600" />AI Assistant / Corrector</label>
                    <button onClick={handleParseReport} disabled={isParsing || !assistantQuery} className="text-xs bg-teal-100 text-teal-800 font-semibold py-1 px-2 rounded-md hover:bg-teal-200 transition flex items-center disabled:opacity-50">
                      {isParsing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-700 mr-2"></div> : <FileScan size={14} className="mr-1" />}
                      Parse Report to Fields
                    </button>
                  </div>
                  <textarea 
                      value={assistantQuery} 
                      onChange={(e) => setAssistantQuery(e.target.value)} 
                      rows="4" 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 transition" 
                      placeholder="Paste a report for correction OR enter a topic to generate a new template (e.g., Liver Elastography report)..."
                  />
                  <button onClick={handleAIAssistant} disabled={isLoading || !assistantQuery} className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition flex items-center justify-center disabled:bg-teal-400">
                      {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Checking...</> : <><MessageSquare className="mr-2" />Ask AI Assistant</>}
                  </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-gray-600">Findings & Measurements</label>
                  <div className="flex space-x-2">
                    <button onClick={() => handleGetSuggestions('differentials')} disabled={isSuggestionLoading || !userFindings} className="text-xs bg-gray-200 text-gray-700 font-semibold py-1 px-2 rounded-md hover:bg-gray-300 transition flex items-center disabled:opacity-50">
                      <Lightbulb size={14} className="mr-1" /> Suggest Differentials
                    </button>
                    <button onClick={() => handleGetSuggestions('recommendations')} disabled={isSuggestionLoading || !userFindings} className="text-xs bg-gray-200 text-gray-700 font-semibold py-1 px-2 rounded-md hover:bg-gray-300 transition flex items-center disabled:opacity-50">
                      <ListPlus size={14} className="mr-1" /> Generate Recommendations
                    </button>
                  </div>
                </div>
                {isCriticalFinding && (
                  <div className="p-3 bg-red-100 text-red-800 rounded-lg flex items-center justify-between animate-pulse">
                    <div className="flex items-center">
                      <AlertTriangle className="text-red-600 mr-3" />
                      <span className="font-bold">Critical Finding Detected: {criticalFindingMessage}</span>
                    </div>
                    <button onClick={() => setIsCriticalFinding(false)} className="text-red-800 hover:text-red-900">
                      <XCircle size={20} />
                    </button>
                  </div>
                )}
                <div className={`rounded-lg bg-white ${isCriticalFinding ? 'border-2 border-red-500' : 'border border-gray-300'}`}>
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
                <br />
                <h2 className="text-2xl font-bold text-gray-700 flex items-center mb-4"><FileText className="mr-3 text-green-500" />Generated Report</h2>
                {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">Error: {error}</div>}
                <div className="relative w-full min-h-[400px] bg-gray-50 rounded-lg border p-4 overflow-y-auto">
                  <div className="absolute top-2 right-2 flex items-center space-x-2">
                      {copySuccess && <span className="text-sm text-green-600">{copySuccess}</span>}
                      <button onClick={() => copyToClipboard(generatedReport)} title="Copy Report" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-600 disabled:opacity-50" disabled={!generatedReport}><Clipboard size={18}/></button>
                      <button onClick={() => downloadTxtReport()} title="Download as .txt" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-600 disabled:opacity-50" disabled={!generatedReport}><FileType size={18}/></button>
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
                 <button onClick={generateFinalReport} disabled={isLoading || !userFindings} className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center disabled:bg-blue-400 text-lg shadow-md hover:shadow-lg">
                  {isLoading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>Generating Report...</> : <><FileText className="mr-2" /> Generate Full Report</>}
                </button>
              </div>

              {/* --- NEW: AI Knowledge Panel Render Location --- */}
              <AIKnowledgePanel 
                isLoading={isAiKnowledgeLoading}
                result={aiKnowledgeResult}
                onClose={() => setAiKnowledgeResult(null)}
                onInsert={(summary) => {
                    if (editor) {
                        editor.chain().focus().insertContent(`<br><p><strong>AI Co-pilot Summary:</strong></p>${summary}`).run();
                        toastDone('AI summary inserted.');
                    }
                }}
              />
            </div>
          </div>


          {/* Modals */}
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
                      onClick={() => {
                        if(newMacroCommand && newMacroText) {
                          setMacros([...macros, { command: newMacroCommand, text: newMacroText }]);
                          setNewMacroCommand('');
                          setNewMacroText('');
                        }
                      }}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                      Add Macro
                    </button>
                  </div>
                  <hr />
                  <div>
                    <h4 className="font-bold text-lg mb-2">Existing Macros</h4>
                    <div className="space-y-2">
                      {macros.map((macro, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                          <div>
                            <p className="font-semibold">{macro.command}</p>
                            <p className="text-sm text-gray-600 truncate">{macro.text}</p>
                          </div>
                          <button onClick={() => setMacros(macros.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-700">
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
