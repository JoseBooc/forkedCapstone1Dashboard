import { useState } from 'react';
import { X, Users, CreditCard, Smartphone, Wallet } from 'lucide-react';

interface EventRegistrationModalProps {
  event: {
    id?: string | number;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
  };
  onClose: () => void;
  pricePerGuest?: number;
  onSubmitRegistration?: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    guestCount: number;
    guests: Array<{ firstName: string; lastName: string; relationship: string }>;
    paymentMethod: 'gcash' | 'maya' | 'card';
    totalPrice: number;
    pricePerGuest: number;
  }) => Promise<void> | void;
}

export function EventRegistrationModal({ event, onClose, pricePerGuest = 1000, onSubmitRegistration }: EventRegistrationModalProps) {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [guestCount, setGuestCount] = useState(0);
  const [guests, setGuests] = useState<Array<{ firstName: string; lastName: string; relationship: string }>>([]);
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'maya' | 'card'>('gcash');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = (1 + guestCount) * pricePerGuest;

  // Update guests array when guest count changes
  const handleGuestCountChange = (newCount: number) => {
    setGuestCount(newCount);
    
    // Adjust guests array based on new count
    if (newCount < guests.length) {
      // Remove excess guests
      setGuests(guests.slice(0, newCount));
    } else if (newCount > guests.length) {
      // Add new guest slots
      const newGuests = [...guests];
      for (let i = guests.length; i < newCount; i++) {
        newGuests.push({ firstName: '', lastName: '', relationship: 'friend' });
      }
      setGuests(newGuests);
    }
  };

  // Update specific guest details
  const handleGuestChange = (index: number, field: string, value: string) => {
    const newGuests = [...guests];
    newGuests[index] = { ...newGuests[index], [field]: value };
    setGuests(newGuests);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      alert('Please enter your first name, last name, and email');
      return;
    }

    // Move to payment step
    setStep('payment');
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      if (onSubmitRegistration) {
        await onSubmitRegistration({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          guestCount,
          guests,
          paymentMethod,
          totalPrice,
          pricePerGuest,
        });
      }
      setIsProcessing(false);
      onClose();
    } catch {
      setIsProcessing(false);
      alert('Unable to complete registration right now. Please try again.');
    }
  };

  const incrementGuests = () => {
    handleGuestCountChange(guestCount + 1);
  };

  const decrementGuests = () => {
    if (guestCount > 0) {
      handleGuestCountChange(guestCount - 1);
    }
  };

  if (step === 'payment') {
    const paymentOptions = [
      { 
        value: 'gcash', 
        label: 'GCash', 
        icon: Smartphone,
        description: 'Pay via GCash mobile wallet'
      },
      { 
        value: 'maya', 
        label: 'Maya', 
        icon: Wallet,
        description: 'Pay via Maya (formerly PayMaya)'
      },
      { 
        value: 'card', 
        label: 'Credit/Debit Card', 
        icon: CreditCard,
        description: 'Pay via Visa, Mastercard, or AMEX'
      }
    ];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
            <button
              onClick={() => setStep('form')}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Payment Options */}
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
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
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
          </div>

          {/* Amount Summary */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Number of Guests:</span>
              <span className="font-semibold text-gray-900">{guestCount}</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-600">Price per Person:</span>
              <span className="font-semibold text-gray-900">₱{pricePerGuest.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="font-bold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-[#003087]">₱{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => setStep('form')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-[#003087] text-white rounded-lg font-semibold hover:bg-[#002566] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Pay ₱${totalPrice.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full my-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Event Registration</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Event Info */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">📅 {event.date}</div>
            <div className="flex items-center gap-2">🕐 {event.time}</div>
            <div className="flex items-center gap-2">📍 {event.location}</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* First Name */}
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

          {/* Last Name */}
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

          {/* Email */}
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

          {/* Guest Count */}
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
                <span>₱{pricePerGuest.toLocaleString()} per person</span>
              </div>
            </div>
          </div>

          {/* Guest Details Fields */}
          {guestCount >= 1 && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">Guest Details</h4>
              <div className="space-y-4">
                {guests.map((guest, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Guest {index + 1}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={guest.firstName}
                          onChange={(e) => handleGuestChange(index, 'firstName', e.target.value)}
                          placeholder="First name"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={guest.lastName}
                          onChange={(e) => handleGuestChange(index, 'lastName', e.target.value)}
                          placeholder="Last name"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Relationship
                      </label>
                      <select
                        value={guest.relationship}
                        onChange={(e) => handleGuestChange(index, 'relationship', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
                      >
                        <option value="friend">Friend</option>
                        <option value="family">Family Member</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="bg-blue-50 border-2 border-[#003087]/20 rounded-lg p-4 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-[#003087]">₱{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#003087] text-white rounded-lg font-semibold hover:bg-[#002566] transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
