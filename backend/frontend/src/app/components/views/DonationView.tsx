import { useState } from 'react';
import { 
  Heart, 
  ArrowRight, 
  GraduationCap, 
  Building2, 
  Microscope, 
  Globe, 
  BookOpen, 
  Presentation,
  Mail,
  Phone,
  CheckCircle2,
  Lock,
  ChevronLeft,
  Gift,
  Award,
  Calendar,
  Trash2,
  CreditCard,
  Edit2,
  Check
} from 'lucide-react';
import { Footer } from '../Footer';

export function DonationsView() {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'gift' | 'needs'>('gift');
  const [managementView, setManagementView] = useState(false);
  
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [selectedFreq, setSelectedFreq] = useState<string | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  // Functional state for management
  const [paymentMethod, setPaymentMethod] = useState("Visa ending in 4242");
  const [recurringGifts, setRecurringGifts] = useState([
    { id: 1, amount: "₱500", freq: "Monthly", designation: "Student Financial Aid", nextDate: "March 15, 2026" }
  ]);
  const [editingGiftId, setEditingGiftId] = useState<number | null>(null);
  const [newAmountInput, setNewAmountInput] = useState("");

  const handleUpdateAmount = (id: number, currentAmount: string) => {
    setEditingGiftId(id);
    setNewAmountInput(currentAmount.replace('₱', ''));
  };

  const saveNewAmount = (id: number) => {
    setRecurringGifts(prev => prev.map(g => 
      g.id === id ? { ...g, amount: `₱${newAmountInput}` } : g
    ));
    setEditingGiftId(null);
  };

  const handleChangePayment = () => {
    const newCard = window.prompt("Enter new card last 4 digits:");
    if (newCard && newCard.length === 4) {
      setPaymentMethod(`Visa ending in ${newCard}`);
    }
  };

  const handleToggle = (current: string | null, clicked: string, setter: (val: string | null) => void) => {
    setter(current === clicked ? null : clicked);
  };

  if (showForm) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <button 
              onClick={() => {
                if (managementView) setManagementView(false);
                else setShowForm(false);
              }} 
              className="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-[#003087] transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> {managementView ? "Back to Donation Form" : "Back to Information"}
            </button>
            
            <div className="bg-white rounded-[40px] shadow-xl p-12 text-left space-y-12 border border-gray-100">
              
              {managementView ? (
                /* FUNCTIONAL MANAGEMENT VIEW */
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Manage Recurring Gifts</h1>
                    <p className="text-gray-500">Update your giving preferences or payment methods.</p>
                  </div>

                  <div className="space-y-4">
                    {recurringGifts.map((gift) => (
                      <div key={gift.id} className="p-6 border border-blue-100 rounded-3xl bg-blue-50/30 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-[#003087] uppercase tracking-wider">{gift.freq} Gift</p>
                            {editingGiftId === gift.id ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-2xl font-bold text-gray-900">₱</span>
                                    <input 
                                        autoFocus
                                        className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-[#003087] outline-none w-32"
                                        value={newAmountInput}
                                        onChange={(e) => setNewAmountInput(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <h4 className="text-2xl font-bold text-gray-900">{gift.amount}</h4>
                            )}
                          </div>
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue-100">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-blue-500" /> Next Billing: {gift.nextDate}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Gift className="w-4 h-4 text-blue-500" /> Fund: {gift.designation}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          {editingGiftId === gift.id ? (
                             <button onClick={() => saveNewAmount(gift.id)} className="flex-1 py-3 bg-[#003087] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                                <Check className="w-4 h-4" /> Save New Amount
                             </button>
                          ) : (
                            <button onClick={() => handleUpdateAmount(gift.id, gift.amount)} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2">
                                <Edit2 className="w-4 h-4" /> Update Amount
                            </button>
                          )}
                          <button 
                            onClick={() => { if(window.confirm("Are you sure?")) setRecurringGifts([]); }}
                            className="px-4 py-3 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300">
                    <div className="flex items-center gap-4 text-gray-500">
                      <CreditCard className="w-6 h-6" />
                      <div className="flex-1">
                        <p className="text-sm font-bold">Default Payment Method</p>
                        <p className="text-xs">{paymentMethod}</p>
                      </div>
                      <button onClick={handleChangePayment} className="text-[#003087] text-xs font-bold underline">Change</button>
                    </div>
                  </div>
                </div>
              ) : (
                /* MAIN DONATION FORM */
                <>
                  <div className="space-y-2 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Make Your Gift</h1>
                    <p className="text-gray-500">Thank you for supporting ADDU. Your generosity makes a lasting difference.</p>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900">Already have a recurring gift?</h4>
                      <p className="text-sm text-gray-500">Manage or cancel your existing recurring donations</p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => setManagementView(true)} className="px-6 py-2 bg-white border border-gray-300 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm">Manage</button>
                      <button onClick={() => { if(window.confirm("Are you sure?")) setRecurringGifts([]); }} className="px-6 py-2 bg-white border border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all">Cancel</button>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">1</span>Select Your Gift Amount</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['₱50', '₱100', '₱200', '₱1,000'].map((amt) => (
                          <button key={amt} onClick={() => handleToggle(selectedAmount, amt, setSelectedAmount)} className={`py-4 rounded-2xl font-bold border-2 transition-all ${selectedAmount === amt ? 'bg-[#003087] border-[#003087] text-white' : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200'}`}>{amt}</button>
                        ))}
                      </div>
                      <input type="text" placeholder="Enter Amount" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">2</span>Choose Gift Frequency</h3>
                        {selectedFreq && selectedFreq !== 'One-Time' && (
                          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                            <Heart className="w-3 h-3 fill-current" /> Recurring Active
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {['One-Time', 'Monthly', 'Annual'].map((freq) => (
                          <button key={freq} onClick={() => handleToggle(selectedFreq, freq, setSelectedFreq)} className={`px-8 py-3 rounded-xl border-2 font-bold transition-all ${selectedFreq === freq ? 'bg-[#003087] border-[#003087] text-white' : 'bg-white border-gray-200 text-gray-600'}`}>{freq}</button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">3</span>Designate Your Gift</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {["Where it's needed most (Unrestricted)", "Student Financial Aid", "Faculty Excellence", "Research & Innovation", "Campus Infrastructure", "Academic Programs", "Global Engagement"].map((dest) => (
                          <button key={dest} onClick={() => handleToggle(selectedDesignation, dest, setSelectedDesignation)} className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all text-left ${selectedDesignation === dest ? 'bg-blue-50 border-[#003087] text-[#003087]' : 'bg-white border-gray-100 text-gray-600'}`}>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedDesignation === dest ? 'border-[#003087] bg-[#003087]' : 'border-gray-300'}`}>{selectedDesignation === dest && <div className="w-1.5 h-1.5 rounded-full bg-white" />}</div>
                            <span className="text-sm font-bold">{dest}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">4</span>Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="First Name *" className="p-4 bg-gray-50 border border-gray-100 rounded-xl" />
                        <input type="text" placeholder="Last Name *" className="p-4 bg-gray-50 border border-gray-100 rounded-xl" />
                        <input type="email" placeholder="Email Address *" className="p-4 bg-gray-50 border border-gray-100 rounded-xl md:col-span-2" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">5</span>Payment Details</h3>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          {['Credit Card', 'GCash', 'Bank Transfer'].map(m => (
                            <button key={m} onClick={() => handleToggle(selectedPayment, m, setSelectedPayment)} className={`px-6 py-3 border-2 rounded-xl text-sm font-bold ${selectedPayment === m ? 'bg-[#003087] border-[#003087] text-white' : 'bg-white border-gray-200 text-gray-600'}`}>{m}</button>
                          ))}
                        </div>
                        <input type="text" placeholder="Card Number *" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="Expiry Date *" className="p-4 bg-gray-50 border border-gray-100 rounded-xl" />
                          <input type="text" placeholder="CVV *" className="p-4 bg-gray-50 border border-gray-100 rounded-xl" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-10 border-t border-gray-100 space-y-6">
                      <button className="w-full py-5 bg-[#003087] text-white rounded-2xl font-bold text-xl shadow-xl hover:bg-[#002566] transition-all">
                        {selectedFreq === 'One-Time' || !selectedFreq ? 'Complete My Gift' : `Start My ${selectedFreq} Gift`}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        {/* HERO */}
        <div className="bg-[#003087] text-white py-24 px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl font-bold leading-tight">Supporting Excellence at ADDU</h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">Your generosity empowers students, advances research, and strengthens our Jesuit mission of service and excellence.</p>
            <div className="pt-4">
              <button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-black/20">Make a Gift Today</button>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION - Font size reduced to text-base */}
        <div className="max-w-7xl mx-auto px-8 mt-16 border-b border-gray-200">
          <div className="flex gap-12">
            <button 
              onClick={() => setActiveTab('gift')}
              className={`pb-4 text-base font-bold transition-all border-b-4 ${activeTab === 'gift' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Make a Gift
            </button>
            <button 
              onClick={() => setActiveTab('needs')}
              className={`pb-4 text-base font-bold transition-all border-b-4 ${activeTab === 'needs' ? 'border-[#003087] text-[#003087]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Areas of Greatest Need
            </button>
          </div>
        </div>

        {/* TAB CONTENT: MAKE A GIFT */}
        {activeTab === 'gift' && (
          <>
            <div className="max-w-7xl mx-auto px-8 py-20">
              <div className="flex flex-col sm:flex-row justify-center gap-8">
                {[["Active Donors", "4,250"], ["Alumni Participation", "35%"]].map(([label, val], i) => (
                  <div key={i} className="flex-1 max-w-sm space-y-2 border-2 border-blue-500 p-10 rounded-[32px] shadow-lg shadow-blue-100/50 hover:shadow-xl transition-all bg-white text-center">
                    <p className="text-5xl font-extrabold text-[#003087]">{val}</p>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#003087] py-24 px-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  <div className="lg:col-span-7 space-y-12">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-orange-400 font-bold uppercase tracking-widest text-sm">
                        <Award className="w-5 h-5" /> Recognition Tiers
                      </div>
                      <h2 className="text-4xl font-bold text-white">Honoring Our Donors</h2>
                      <p className="text-blue-200 text-lg">We honor our generous supporters who make our mission possible.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { 
                          name: "Founder's Circle", 
                          price: "₱1,000,000+", 
                          perks: ["Named endowment opportunities", "Private events with leadership", "Campus naming rights", "Lifetime recognition on Founder's Wall"] 
                        },
                        { 
                          name: "President's Council", 
                          price: "₱500,000 - ₱999,999", 
                          perks: ["Exclusive event invitations", "Annual donor report recognition", "Personal thank you from President", "Priority access"] 
                        },
                        { 
                          name: "Loyola Society", 
                          price: "₱100,000 - ₱499,999", 
                          perks: ["Recognition event invitations", "Name in publications", "Donor appreciation events", "Semi-annual impact reports"] 
                        },
                        { 
                          name: "Blue & Gold Circle", 
                          price: "₱25,000 - ₱99,999", 
                          perks: ["Donor honor roll", "Annual impact summary", "University invitations", "Official tax receipt"] 
                        }
                      ].map((tier, i) => (
                        <div key={i} className="bg-white/5 p-8 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all">
                          <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                          <p className="text-orange-400 font-bold mb-6 text-sm">{tier.price}</p>
                          <ul className="space-y-3">
                            {tier.perks.map((p, pi) => (
                              <li key={pi} className="text-[11px] text-blue-100 flex items-start gap-2 leading-relaxed">
                                <CheckCircle2 className="w-3 h-3 text-orange-500 mt-0.5 shrink-0" /> {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-5">
                    <div className="bg-white rounded-[40px] p-10 h-full shadow-2xl">
                      <div className="flex items-center gap-3 text-[#003087] font-bold uppercase tracking-widest text-sm mb-4"><Gift className="w-5 h-5" /> Giving Methods</div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-8">Ways to Give</h3>
                      <div className="space-y-10">
                        {[{ t: "Cash Gifts", d: "Immediate impact via credit card, GCash, or bank transfer." }, { t: "Planned Giving", d: "Create a legacy through bequests or trusts." }].map((way, i) => (
                          <div key={i} className="group">
                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#003087] transition-colors">{way.t}</h4>
                            <p className="text-gray-500 text-sm mb-3 leading-relaxed">{way.d}</p>
                            <button onClick={() => setShowForm(true)} className="text-[#003087] text-sm font-bold flex items-center gap-2 group-hover:gap-4 transition-all">Give Now <ArrowRight className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB CONTENT: AREAS OF NEED - All 6 sections integrated */}
        {activeTab === 'needs' && (
          <div className="bg-gray-50/50 py-16">
            <div className="max-w-7xl mx-auto px-8 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-16">Areas of Greatest Need</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                {[
                  { title: "Student Financial Aid", desc: "Ensure every deserving student can access education.", stats: ["₱12.5M annually", "450+ scholars"], icon: <GraduationCap /> },
                  { title: "Faculty Excellence", desc: "Attract and retain world-class educators.", stats: ["₱8M development", "180+ faculty"], icon: <Presentation /> },
                  { title: "Research & Innovation", desc: "Advance breakthrough research.", stats: ["₱6.2M grants", "45 projects"], icon: <Microscope /> },
                  { title: "Campus Infrastructure", desc: "Build state-of-the-art facilities.", stats: ["₱28M improvements", "5 facilities"], icon: <Building2 /> },
                  { title: "Academic Programs", desc: "Prepare students for tomorrow.", stats: ["₱4.8M support", "12 programs"], icon: <BookOpen /> },
                  { title: "Global Engagement", desc: "Expand international partnerships.", stats: ["₱3.5M exchanges", "85 experiences"], icon: <Globe /> }
                ].map((area, i) => (
                  <div key={i} className="bg-white p-10 rounded-[32px] border border-gray-100 flex flex-col shadow-sm">
                    <div className="bg-blue-50 text-[#003087] w-14 h-14 rounded-2xl flex items-center justify-center mb-6">{area.icon}</div>
                    <h3 className="text-2xl font-bold mb-4">{area.title}</h3>
                    <p className="text-gray-500 mb-8 flex-1 leading-relaxed">{area.desc}</p>
                    <div className="space-y-3 mb-10 pt-6 border-t border-gray-100">
                      {area.stats.map((s, si) => (
                        <div key={si} className="text-sm font-bold text-gray-700 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" />{s}</div>
                      ))}
                    </div>
                    <button onClick={() => setShowForm(true)} className="w-full py-4 rounded-xl border-2 border-[#003087] text-[#003087] font-bold text-sm hover:bg-[#003087] hover:text-white transition-all">Support This Area</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SHARED CONTACT FOOTER */}
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="relative overflow-hidden flex flex-col gap-12 rounded-[48px] p-12 md:p-20 shadow-2xl bg-[#003087]">
            <div className="relative z-10 text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to Make an Impact?</h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">Your gift today will transform lives for generations to come.</p>
              <div className="pt-4">
                <button onClick={() => setShowForm(true)} className="bg-orange-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-xl hover:bg-orange-500 transition-all transform hover:-translate-y-1">Give Now</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}