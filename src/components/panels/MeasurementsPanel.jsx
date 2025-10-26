import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
import { Stethoscope, Trash2, Plus, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Accept SidePanel as a prop
const MeasurementsPanel = ({ measurements, organs, onInsert, CollapsibleSidePanel }) => {
  const [values, setValues] = useState({});
  const [showCalculus, setShowCalculus] = useState(false);
  const [calculusEntries, setCalculusEntries] = useState([]);

  // ===================================================================
  // ======================= THE FIX IS HERE ===========================
  // ===================================================================
  // 1. Create a stable key based on the CONTENT of the measurements array.
  const measurementsKey = useMemo(() => {
    if (!measurements) return '';
    return measurements.map(m => m.label).join(',');
  }, [measurements]);

  // 2. Use this stable key as the dependency for the reset effect.
  useEffect(() => {
    setValues({});
    setCalculusEntries([]);
    setShowCalculus(false);
  }, [measurementsKey]); // <-- This now correctly ignores simple re-renders

  const handleApplyMeasurements = () => {
    const filteredCalculus = calculusEntries.filter(e => e.location && e.size);
    onInsert(values, filteredCalculus);
    toast.success("Measurements applied to report!");
  };

  const handleValueChange = (id, value) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const handleCalculusChange = (index, field, value) => {
    const newEntries = [...calculusEntries];
    newEntries[index][field] = value;
    setCalculusEntries(newEntries);
  };

  const addCalculusEntry = () => {
    setCalculusEntries([...calculusEntries, { location: organs[0] || '', size: '', description: '' }]);
  };
  
  const removeCalculusEntry = (index) => {
    setCalculusEntries(calculusEntries.filter((_, i) => i !== index));
  };

  if (!measurements || measurements.length === 0) return null;
  if (!CollapsibleSidePanel) return <div>Error: SidePanel component not provided.</div>;

  return (
<CollapsibleSidePanel title="Ultrasound Measurements" icon={Stethoscope} defaultOpen={false}>
        {/* The rest of the JSX is exactly the same as before */}
        <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-200">Standard Measurements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {measurements.map(m => (
                <div key={m.id}>
                  <label className="text-xs font-medium text-gray-400">{m.label}</label>
                  <input
                    type="text"
                    value={values[m.id] || ''}
                    onChange={(e) => handleValueChange(m.id, e.target.value)}
                    className="w-full p-2 mt-1 bg-slate-700/50 border border-slate-600 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                    placeholder="Value..."
                  />
                </div>
              ))}
            </div>
    
            <div className="pt-2 border-t border-slate-700">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCalculus}
                  onChange={(e) => {
                    setShowCalculus(e.target.checked);
                    if (e.target.checked && calculusEntries.length === 0) {
                       addCalculusEntry();
                    } else if (!e.target.checked) {
                       setCalculusEntries([]);
                    }
                  }}
                  className="h-4 w-4 rounded bg-slate-600 border-slate-500 text-blue-500 focus:ring-blue-500 accent-blue-500"
                />
                <span className="font-semibold text-gray-300 text-sm">Add Calculus / Mass Lesion</span>
              </label>
            </div>
    
            {showCalculus && (
              <div className="space-y-3">
                {calculusEntries.map((entry, index) => (
                  <div key={index} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 space-y-2 relative">
                     <button onClick={() => removeCalculusEntry(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><Trash2 size={16} /></button>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                         <div>
                            <label className="text-xs font-medium text-gray-400">Location</label>
                            <select
                              value={entry.location}
                              onChange={(e) => handleCalculusChange(index, 'location', e.target.value)}
                              className="w-full p-2 mt-1 bg-slate-700 border border-slate-600 rounded-md text-sm"
                            >
                              {organs.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                         </div>
                         <div>
                           <label className="text-xs font-medium text-gray-400">Size</label>
                           <input
                              type="text"
                              placeholder="e.g., 1.2 cm"
                              value={entry.size}
                              onChange={(e) => handleCalculusChange(index, 'size', e.target.value)}
                              className="w-full p-2 mt-1 bg-slate-700 border border-slate-600 rounded-md text-sm"
                            />
                         </div>
                          <div>
                           <label className="text-xs font-medium text-gray-400">Description</label>
                            <input
                              type="text"
                              placeholder="e.g., echogenic"
                              value={entry.description}
                              onChange={(e) => handleCalculusChange(index, 'description', e.target.value)}
                              className="w-full p-2 mt-1 bg-slate-700 border border-slate-600 rounded-md text-sm"
                            />
                         </div>
                      </div>
                  </div>
                ))}
                 <button onClick={addCalculusEntry} className="text-sm bg-slate-600 text-gray-200 font-semibold py-1 px-3 rounded-md hover:bg-slate-500 transition flex items-center">
                    <Plus size={14} className="mr-1" /> Add Another
                  </button>
              </div>
            )}
        </div>
        
        <div className="pt-4 border-t border-slate-700 mt-4">
            <button
                onClick={handleApplyMeasurements}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition flex items-center justify-center disabled:bg-blue-800"
            >
                <CheckCircle size={18} className="mr-2"/>
                Apply to Report
            </button>
        </div>
    </CollapsibleSidePanel>
  );
};

export default MeasurementsPanel;