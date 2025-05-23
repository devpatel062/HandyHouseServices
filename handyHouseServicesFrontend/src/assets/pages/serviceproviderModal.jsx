import { useEffect, useState } from "react";
import axios from "axios";

const ProvidersModal = ({ serviceType, onClose }) => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    if (!serviceType) return;
    console.log("before " + serviceType);
  
    axios
      .get("https://handyhouseservicesbackend.onrender.com/api/providers", {
        params: { serviceType },
      })
      .then((response) => {
        console.log(response.data);
        setProviders(response.data);
      })
      .catch((err) => console.error(err));
  }, [serviceType]);
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl p-6 relative">
        <button
          className="absolute top-2 right-4 text-gray-700 font-bold text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">
          Available {serviceType} Service-Providers
        </h2>
        {providers.length === 0 ? (
          <p>No providers found.</p>
        ) : (
          <ul className="space-y-4">
            {providers.map((provider, idx) => (
              <li key={idx} className="border p-4 rounded shadow">
                <h3 className="font-bold text-lg">{provider.name}</h3>
                <p>Email: {provider.email}</p>
                <p>Phone: {provider.phone}</p>
                <p>Location: {provider.location}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProvidersModal;
