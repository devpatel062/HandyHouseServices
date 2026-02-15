import { X } from "lucide-react";
import { Input, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CheckOutButton from "../pages/CheckOutButton";
import AddressSelector from "../components/AddressSelector";

const accentGradient =
  "linear-gradient(90deg, #e0e7ff 0%, #bae6fd 100%)";

function Modal({ serviceTypeProvider, serviceType, onClose }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    address: "",
    contact: "",
    email: "",
    serviceProvidername: serviceTypeProvider.name || "",
    serviceProvideremail: serviceTypeProvider.email || "",
    serviceProvidernumber: serviceTypeProvider.phone || "",
    serviceProviderrating: serviceTypeProvider.rating || "",
    serviceType: serviceType || "",
    problem: "",
    date: "",
    price: serviceTypeProvider.price || "",
  });

  const formFields = [
    { name: "fullname", placeholder: "Full Name", type: "text" },
    { name: "address", placeholder: "Address", type: "text" },
    { name: "contact", placeholder: "Contact Number", type: "text" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "serviceType", placeholder: "Service Type", type: "text" },
    { name: "problem", placeholder: "Problem Description", type: "text" },
    { name: "date", placeholder: "Select Date and Time", type: "datetime-local" },
  ];

  const showToast = (title, status, description = "", duration = 2000) => {
    toast({ title, status, description, duration, isClosable: true });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user`,
          { withCredentials: true }
        );
        const { username, location, phone, email } = response.data;
        setFormData((prev) => ({
          ...prev,
          fullname: username || "",
          address: location || "",
          contact: phone || "",
          email: email || "",
        }));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        showToast("Failed to fetch user data.", "error");
        navigate("/signin");
      }
    };
    fetchUserData();
  }, [navigate, toast]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressChange = (address) => {
    setFormData((prev) => ({ ...prev, address }));
  };

  const validateForm = () => {
    if (!formData.fullname || !formData.address || !formData.contact || !formData.email || !formData.serviceType || !formData.problem || !formData.date) {
      showToast("Please fill all fields.", "error");
      return false;
    }
    return true;
  };

  // ✅ No DB save here. DB save happens in Stripe webhook after payment succeeds.
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    // Stripe redirect happens inside CheckOutButton click
    // We keep loading state so user cannot spam
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999] p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Complete Booking</h2>
            <p className="text-xs text-slate-500">Enter details to confirm your appointment</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
           <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-4">
              {/* Provider Info Card */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {formData.serviceProvidername.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{formData.serviceProvidername}</p>
                      <p className="text-xs text-slate-500">{formData.serviceType}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">{formData.price}</p>
                 </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formFields.filter(f => ['fullname', 'contact', 'date'].includes(f.name)).map((field) => (
                    <div key={field.name} className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 ml-1">
                        {field.placeholder}
                      </label>
                      <Input
                        variant="filled"
                        size="md"
                        bg="slate.50"
                        name={field.name}
                        type={field.type}
                        // placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                        borderRadius="xl"
                        _focus={{ bg: 'white', borderColor: 'blue.400' }}
                      />
                    </div>
                  ))}
               </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 ml-1">Location</label>
                   <AddressSelector
                    value={formData.address}
                    onChange={handleAddressChange}
                    placeholder="Enter service address"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 ml-1">Describe the issue</label>
                  <Input
                    as="textarea"
                    variant="filled"
                    bg="slate.50"
                    name="problem"
                    placeholder="Briefly describe the problem..."
                    value={formData.problem}
                    onChange={handleChange}
                    required
                    borderRadius="xl"
                    py={3}
                    minH="80px"
                    _focus={{ bg: 'white', borderColor: 'blue.400' }}
                  />
                </div>
            </div>

            {/* Hidden fields we still need in state but not UI if already auto-filled or redundant */}
            <div className="hidden">
              <Input name="email" value={formData.email} readOnly />
              <Input name="serviceType" value={formData.serviceType} readOnly />
            </div>

            <div className="pt-4">
              <CheckOutButton
                formData={formData}
                disabled={loading}
                validate={validateForm}
                className="w-full py-4 rounded-xl text-white font-bold shadow-lg shadow-blue-200 transition-transform active:scale-95 flex justify-center items-center"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                }}
              >
                {loading ? "Processing..." : `Pay ${formData.price} & Book`}
              </CheckOutButton>
              <p className="text-center text-[10px] text-slate-400 mt-3 flex justify-center items-center gap-1">
                🔒 Secure payment via Stripe
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modal;
