// import React, { useState, useEffect } from 'react';
// import { XCircle, Plus, Trash2, FileText } from 'lucide-react';
// import  { db } from '../../firebase'; // Assuming firebase.js is set up

// import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
// import { toast } from 'react-hot-toast';

// const TemplateManagerModal = ({ user, existingModalities, onClose }) => {
//   const [customTemplates, setCustomTemplates] = useState([]);
//   const [newTemplateModality, setNewTemplateModality] = useState(existingModalities[0] || 'Ultrasound');
//   const [newTemplateName, setNewTemplateName] = useState('');
//   const [newTemplateContent, setNewTemplateContent] = useState('');
//   const [isSaving, setIsSaving] = useState(false);

//   // Fetch user's custom templates
//   useEffect(() => {
//     if (!user) return;
//     const templatesCollectionRef = collection(db, "users", user.uid, "templates");
//     const unsubscribe = onSnapshot(templatesCollectionRef, (snapshot) => {
//       const templatesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setCustomTemplates(templatesData);
//     });
//     return () => unsubscribe();
//   }, [user]);

//   const handleAddTemplate = async () => {
//     if (!newTemplateName.trim() || !newTemplateContent.trim()) {
//       toast.error("Template name and content cannot be empty.");
//       return;
//     }
//     setIsSaving(true);
//     try {
//       await addDoc(collection(db, "users", user.uid, "templates"), {
//         modality: newTemplateModality,
//         name: newTemplateName,
//         content: newTemplateContent,
//         createdAt: serverTimestamp(),
//       });
//       toast.success("Template added successfully!");
//       setNewTemplateName('');
//       setNewTemplateContent('');
//     } catch (error) {
//       console.error("Error adding template: ", error);
//       toast.error("Failed to add template.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDeleteTemplate = async (templateId) => {
//     // Using a simple browser confirm dialog for this action
//     if (!confirm("Are you sure you want to delete this template?")) return;
//     try {
//       await deleteDoc(doc(db, "users", user.uid, "templates", templateId));
//       toast.success("Template deleted.");
//     } catch (error) {
//       console.error("Error deleting template: ", error);
//       toast.error("Failed to delete template.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
//         <div className="p-6 border-b flex justify-between items-center">
//           <h3 className="text-2xl font-bold text-gray-800 flex items-center">
//             <FileText size={24} className="mr-3 text-blue-500" />
//             Manage Custom Templates
//           </h3>
//           <button onClick={onClose}><XCircle /></button>
//         </div>
//         <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Add New Template Form */}
//           <div className="space-y-4">
//             <h4 className="font-bold text-xl text-gray-700 border-b pb-2">Add New Template</h4>
//             <div>
//               <label className="font-semibold text-gray-600 mb-1 block">Modality</label>
//               <select
//                 value={newTemplateModality}
//                 onChange={(e) => setNewTemplateModality(e.target.value)}
//                 className="w-full p-2 border rounded-lg bg-white"
//               >
//                 {existingModalities.map(mod => <option key={mod} value={mod}>{mod}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="font-semibold text-gray-600 mb-1 block">Template Name</label>
//               <input
//                 type="text"
//                 placeholder="e.g., Pediatric Hip Ultrasound"
//                 value={newTemplateName}
//                 onChange={(e) => setNewTemplateName(e.target.value)}
//                 className="w-full p-2 border rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="font-semibold text-gray-600 mb-1 block">Template Content (HTML)</label>
//               <textarea
//                 placeholder="<h3>IMPRESSION:</h3><p>...</p>"
//                 value={newTemplateContent}
//                 onChange={(e) => setNewTemplateContent(e.target.value)}
//                 className="w-full p-2 border rounded-lg font-mono text-sm"
//                 rows="10"
//               />
//             </div>
//             <button
//               onClick={handleAddTemplate}
//               disabled={isSaving}
//               className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center justify-center"
//             >
//               {isSaving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Plus size={18} className="mr-2"/>Add Template</>}
//             </button>
//           </div>

//           {/* Existing Templates List */}
//           <div className="space-y-4">
//             <h4 className="font-bold text-xl text-gray-700 border-b pb-2">Your Templates</h4>
//             <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
//               {customTemplates.length > 0 ? customTemplates.map((template) => (
//                 <div key={template.id} className="flex justify-between items-start bg-gray-50 p-3 rounded-lg border">
//                   <div className="flex-grow">
//                     <p className="font-bold text-gray-800">{template.name}</p>
//                     <p className="text-xs text-white bg-blue-500 rounded-full px-2 py-0.5 inline-block mt-1">{template.modality}</p>
//                   </div>
//                   <button onClick={() => handleDeleteTemplate(template.id)} className="text-red-500 hover:text-red-700 ml-4 flex-shrink-0">
//                     <Trash2 />
//                   </button>
//                 </div>
//               )) : (
//                 <p className="text-gray-500 mt-4 text-center">You haven't added any custom templates yet.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TemplateManagerModal;

import React, { useState, useEffect } from 'react';
import { XCircle, Plus, Trash2, FileText, Bold, Table as TableIcon } from 'lucide-react';
import { db } from '../../firebase'; // Assuming firebase.js is set up
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { toast } from 'react-hot-toast';

// Tiptap Imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Tiptap table extensions (named exports)
import { Table as TableExtension } from '@tiptap/extension-table';
import { TableRow as TableRowExtension } from '@tiptap/extension-table-row';
import { TableHeader as TableHeaderExtension } from '@tiptap/extension-table-header';
import { TableCell as TableCellExtension } from '@tiptap/extension-table-cell';

const TemplateManagerModal = ({ user, existingModalities, onClose }) => {
  const [customTemplates, setCustomTemplates] = useState([]);
  const [newTemplateModality, setNewTemplateModality] = useState(existingModalities[0] || 'Ultrasound');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // --- Tiptap Editor Instance ---
  const editor = useEditor({
    extensions: [
      StarterKit,
      TableExtension.configure({
        resizable: true,
        lastColumnResizable: false,
      }),
      TableRowExtension,
      TableHeaderExtension,
      TableCellExtension,
    ],
    content:
      '<p>Start writing your template here. Paste content (including tables) from the main editor and it will be saved as HTML.</p>',
    editorProps: {
      attributes: {
        // include `tiptap` so your global table CSS applies here as well
        class:
          'tiptap prose prose-sm focus:outline-none w-full p-2 border rounded-b-lg min-h-[250px] text-black',
      },
    },
  });

  // Fetch user's custom templates from Firestore
  useEffect(() => {
    if (!user) return;
    const templatesCollectionRef = collection(db, 'users', user.uid, 'templates');
    const unsubscribe = onSnapshot(templatesCollectionRef, snapshot => {
      const templatesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomTemplates(templatesData);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddTemplate = async () => {
    if (!newTemplateName.trim() || !editor || editor.isEmpty) {
      toast.error('Template name and content cannot be empty.');
      return;
    }

    // Get HTML (including <table> markup) from the Tiptap editor
    const newTemplateContent = editor.getHTML();

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'templates'), {
        modality: newTemplateModality,
        name: newTemplateName,
        content: newTemplateContent, // HTML with proper <table> from Tiptap
        createdAt: serverTimestamp(),
      });
      toast.success('Template added successfully!');

      // Clear the form fields and the editor
      setNewTemplateName('');
      editor.commands.setContent('<p></p>');
    } catch (error) {
      console.error('Error adding template: ', error);
      toast.error('Failed to add template.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTemplate = async templateId => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'templates', templateId));
        toast.success('Template deleted.');
      } catch (error) {
        console.error('Error deleting template: ', error);
        toast.error('Failed to delete template.');
      }
    }
  };

  if (!editor) {
    return null; // Don't render the modal until the editor is ready
  }

  const handleInsertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({
        rows: 2,
        cols: 3,
        withHeaderRow: true,
      })
      .run();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <FileText size={24} className="mr-3 text-blue-500" />
            Manage Custom Templates
          </h3>
          <button
            className="text-2xl font-bold text-gray-800 hover:bg-gray-300 transition rounded-full p-1"
            onClick={onClose}
          >
            <XCircle />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add New Template Form */}
          <div className="space-y-4">
            <h4 className="font-bold text-xl text-gray-700 border-b pb-2">Add New Template</h4>
            <div>
              <label className="font-semibold text-black  mb-1 block">Modality</label>
              <select
                value={newTemplateModality}
                onChange={e => setNewTemplateModality(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white text-gray-600"
              >
                {existingModalities.map(mod => (
                  <option key={mod} value={mod}>
                    {mod}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-black mb-1 block">Template Name</label>
              <input
                type="text"
                placeholder="e.g., Pediatric Hip Ultrasound"
                value={newTemplateName}
                onChange={e => setNewTemplateName(e.target.value)}
                className="w-full p-2 border rounded-lg text-gray-600"
              />
            </div>

            {/* --- RICH TEXT EDITOR --- */}
            <div>
              <label className="font-semibold text-black mb-1 block">Template Content</label>
              <div className="border rounded-lg">
                <div className="flex items-center gap-1 p-2 bg-gray-100 rounded-t-lg border-b text-black">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded ${
                      editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'
                    }`}
                    title="Bold"
                  >
                    <Bold size={16} />
                  </button>

                  {/* Insert 3×3 table button */}
                  <button
                    onClick={handleInsertTable}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Insert 3×3 table"
                  >
                    <TableIcon size={16} />
                  </button>
                </div>

                {/* content area; table HTML is preserved + styled via .tiptap rules */}
                <EditorContent editor={editor} />
              </div>
            </div>

            <button
              onClick={handleAddTemplate}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center justify-center"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  Add Template
                </>
              )}
            </button>
          </div>

          {/* Existing Templates List */}
          <div className="space-y-4">
            <h4 className="font-bold text-xl text-gray-700 border-b pb-2">Your Templates</h4>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {customTemplates.length > 0 ? (
                customTemplates.map(template => (
                  <div
                    key={template.id}
                    className="flex justify-between items-start bg-gray-50 p-3 rounded-lg border"
                  >
                    <div className="flex-grow">
                      <p className="font-bold text-gray-800">{template.name}</p>
                      <p className="text-xs text-white bg-blue-500 rounded-full px-2 py-0.5 inline-block mt-1">
                        {template.modality}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-500 hover:text-red-700 ml-4 flex-shrink-0"
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 mt-4 text-center">
                  You haven't added any custom templates yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateManagerModal;
