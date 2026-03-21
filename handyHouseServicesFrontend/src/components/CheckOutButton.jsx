import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckOutButton = ({
  formData,
  children,
  className,
  style,
  disabled,
  onStart,
  onError,
  validate,
}) => {
  const handleCheckout = async () => {
    if (disabled) return;
    if (validate && !validate()) return; 

    try {
      onStart?.();

      const stripe = await stripePromise;

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/createCheckoutSession`,
        { formData },
        { timeout: 15000, withCredentials: true }
      );

      const session = response.data;

      if (!session?.id) throw new Error("No session id returned from server");

      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (err) {
      console.error("Checkout error:", err?.response?.data || err.message);
      onError?.(err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      className={className}
      style={style}
      disabled={disabled}
    >
      {children || `Pay ${formData?.price || ""}`}
    </button>
  );
};

export default CheckOutButton;
