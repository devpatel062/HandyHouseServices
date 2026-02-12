const accentGradient = 'linear-gradient(90deg, #e0e7ff 0%, #bae6fd 100%)'; // light blue gradient
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from '@chakra-ui/react';
import Form from './Modal';

const ProvidersModal = ({ serviceType, onClose }) => {
  const [providers, setProviders] = useState([]);
  const [formOpen, setformOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState(null);

  useEffect(() => {
    if (!serviceType) return;
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/providers`, {
        params: { serviceType },
      })
      .then((response) => {
        setProviders(response.data);
      })
      .catch((err) => console.error(err));
  }, [serviceType]);

  return (
    <>
      {/* Provider Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="w-[92%] max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-0 relative shadow-2xl" style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(8px)', border: '2px solid #bae6fd' }}>
          <button
            className="absolute top-3 right-5 text-gray-700 font-bold text-2xl hover:text-pink-500 transition"
            onClick={onClose}
          >
            &times;
          </button>
          <div className="rounded-t-2xl px-6 py-4" style={{ background: accentGradient }}>
            <h2 className="text-xl font-bold text-blue-900 tracking-tight">Available {serviceType} Service-Providers</h2>
          </div>
          <div className="p-6">
            {providers.length === 0 ? (
              <p className="text-center text-gray-500">No providers found.</p>
            ) : (
              <div className="grid gap-4">
                {providers.map((provider, idx) => (
                  <div key={idx} className="group bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                       <div className="space-y-3 flex-1">
                          <div>
                            <h3 className="font-bold text-lg text-slate-800">{provider.name}</h3>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 w-fit px-2 py-0.5 rounded-full mt-1">
                               <span>📍 {provider.location}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-600">
                             <div className="flex items-center gap-2">
                                <span className="text-slate-400">📧</span>
                                <span className="truncate">{provider.email}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="text-slate-400">📞</span>
                                <span>{provider.phone}</span>
                             </div>
                          </div>
                       </div>

                       <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 min-w-[120px] border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4 mt-1 sm:mt-0">
                          <div className="text-right">
                             <span className="block text-xs text-slate-400 font-medium uppercase tracking-wider">Rate</span>
                             <span className="block text-lg font-bold text-blue-600">{provider.price}</span>
                          </div>
                          
                          {provider.availability ? (
                            <Button 
                              size='sm' 
                              colorScheme='blue'
                              onClick={() => { setformOpen(true); setActiveProvider(provider); }}
                              className="font-semibold shadow-blue-200 shadow-lg"
                            >
                              Book Now
                            </Button>
                          ) : (
                            <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100">
                              Busy
                            </span>
                          )}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Fullscreen Booking Form Modal (portal-like) */}
      {formOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
          <Form serviceTypeProvider={activeProvider} serviceType={serviceType} onClose={() => setformOpen(false)} />
        </div>
      )}
    </>
  );
};

export default ProvidersModal;
