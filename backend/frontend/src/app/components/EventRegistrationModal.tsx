import { useState } from 'react';
import { X, Users, CreditCard, Smartphone, Wallet, CheckCircle2, FileText } from 'lucide-react';

interface EventRegistrationModalProps {
  event: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    feeAmount: number;
  };
  onClose: () => void;
}

type PaymentMethod = 'gcash' | 'bank_transfer' | 'cash';

export function EventRegistrationModal({ event, onClose }: EventRegistrationModalProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'confirmation'>('form');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [guestCount, setGuestCount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const totalPrice = (1 + guestCount) * event.feeAmount;
  const requiresProof = paymentMethod === 'gcash' || paymentMethod === 'bank_transfer';

  const handleGuestCountChange = (newCount: number) => {
    setGuestCount(newCount);
  };

  const incrementGuests = () => {
    handleGuestCountChange(guestCount + 1);
  };

  const decrementGuests = () => {
    if (guestCount > 0) {
      handleGuestCountChange(guestCount - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (event.feeAmount > 0) {
      setStep('payment');
      return;
    }

    void submitRegistration('cash');
  };

  const submitRegistration = async (methodOverride?: PaymentMethod) => {
    setIsProcessing(true);
    setErrorMessage('');

    const method = methodOverride || paymentMethod;
    if ((method === 'gcash' || method === 'bank_transfer') && !referenceNumber.trim()) {
      setErrorMessage('Reference number is required for the selected payment method.');
      setIsProcessing(false);
      return;
    }

    if ((method === 'gcash' || method === 'bank_transfer') && !proofFile) {
      setErrorMessage('Please upload proof of payment.');
      setIsProcessing(false);
      return;
    }

    const formData = new FormData();
    formData.append('activity_id', String(event.id));
    formData.append('first_name', firstName.trim());
    formData.append('last_name', lastName.trim());
    formData.append('email', email.trim());
    formData.append('guests_count', String(guestCount));
    formData.append('amount_due', String(totalPrice));
    formData.append('payment_method', method);

    if (referenceNumber.trim()) {
      formData.append('reference_number', referenceNumber.trim());
    }

    if (proofFile) {
      formData.append('proof', proofFile);
    }

    try {
      const response = await fetch('http://localhost:8000/api/giveback/registrations', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.message || 'Registration failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      const data = await response.json();
      setReceiptUrl(`http://localhost:8000/api/giveback/registrations/${data.registration.id}/receipt`);
      setStep('confirmation');
    } catch (error) {
      setErrorMessage('Unable to submit registration. Please check your connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 'confirmation') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Registration Confirmed</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-semibold">You are registered for {event.title}.</span>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-gray-700">
              <p className="font-semibold mb-2">Payment Instructions</p>
              <p>If you paid via GCash or Bank Transfer, your payment is now pending verification. You can download your receipt below.</p>
            </div>
            {receiptUrl && (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#003087] font-semibold hover:underline"
              >
                <FileText className="w-4 h-4" /> Download Receipt (PDF)
              </a>
            )}
          </div>
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    const paymentOptions = [
      {
        value: 'gcash',
        label: 'GCash',
        icon: Smartphone,
        description: 'Pay via GCash mobile wallet'
      },
      {
        value: 'bank_transfer',
        label: 'Bank Transfer',
        icon: Wallet,
        description: 'Transfer to the official GiveBack bank account'
      },
      {
        value: 'cash',
        label: 'Cash',
        icon: CreditCard,
        description: 'Pay directly at the Alumni Office (optional)'
      }
    ];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
            <button onClick={() => setStep('form')} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-[#003087] hover:bg-blue-50 transition-all"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-4 h-4 accent-[#003087]"
                  />
                  <Icon className="w-6 h-6 text-[#003087]" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </label>
              );
            })}

            {requiresProof && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Reference Number *</label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Enter transaction reference"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Proof of Payment *</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Number of Guests:</span>
              <span className="font-semibold text-gray-900">{guestCount}</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-600">Price per Person:</span>
              <span className="font-semibold text-gray-900">₱{event.feeAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="font-bold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-[#003087]">₱{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => setStep('form')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => submitRegistration()}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-[#003087] text-white rounded-lg font-semibold hover:bg-[#002566] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Submitting...' : `Pay ₱${totalPrice.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full my-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Event Registration</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">📅 {event.date}</div>
            <div className="flex items-center gap-2">🕐 {event.time}</div>
            <div className="flex items-center gap-2">📍 {event.location}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Additional Guests</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  type="button"
                  onClick={decrementGuests}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold text-gray-900 text-center min-w-[60px]">
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={incrementGuests}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>₱{event.feeAmount.toLocaleString()} per person</span>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 bg-[#003087] text-white rounded-xl font-bold hover:bg-[#002566] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {event.feeAmount > 0 ? 'Proceed to Payment' : 'Confirm Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
