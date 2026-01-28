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
  ChevronLeft
} from 'lucide-react';
import { Footer } from '../Footer';

import MariaSantosBG from '../../../assets/MariaSantosBG.jpg';
import AnneLimBG from '../../../assets/AnneLimBG.jpg';
import MiguelCruzBG from '../../../assets/MiguelCruzBG.jpg';

export function DonationsView() {
  const [showForm, setShowForm] = useState(false);
  
  // States for togglable selections
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [selectedFreq, setSelectedFreq] = useState<string | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleToggle = (current: string | null, clicked: string, setter: (val: string | null) => void) => {
    setter(current === clicked ? null : clicked);
  };

  if (showForm) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setShowForm(false)} className="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-[#003087] transition-all">
              <ChevronLeft className="w-5 h-5" /> Back to Information
            </button>
            <div className="bg-white rounded-[40px] shadow-xl p-12 text-left space-y-12 border border-gray-100">
              <div className="space-y-2 border-b border-gray-100 pb-8">
                <h1 className="text-4xl font-bold text-gray-900">Make Your Gift</h1>
                <p className="text-gray-500">Thank you for supporting ADDU. Your generosity makes a lasting difference.</p>
              </div>

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
                <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#003087] text-white flex items-center justify-center text-sm">2</span>Choose Gift Frequency</h3>
                <div className="flex flex-wrap gap-4">
                  {['One-Time', 'Monthly', 'Annual'].map((freq) => (
                    <button key={freq} onClick={() => handleToggle(selectedFreq, freq, setSelectedFreq)} className={`px-8 py-3 rounded-xl border-2 font-bold transition-all ${selectedFreq === freq ? 'bg-[#003087] border-[#003087] text-white' : 'bg-white border-gray-200 text-gray-600'}`}>{freq}</button>
                  ))}
                </div>
                <div className="bg-blue-50/50 p-6 rounded-3xl space-y-4">
                  <p className="text-sm font-bold text-[#003087]">Already have a recurring gift?</p>
                  <p className="text-sm text-gray-500">Manage or cancel your existing recurring donations</p>
                  <div className="flex gap-6">
                    <button onClick={() => handleToggle(activeAction, 'manage', setActiveAction)} className={`font-bold text-sm underline ${activeAction === 'manage' ? 'text-[#003087]' : 'text-gray-400'}`}>Manage</button>
                    <button onClick={() => handleToggle(activeAction, 'cancel', setActiveAction)} className={`font-bold text-sm underline ${activeAction === 'cancel' ? 'text-red-600' : 'text-gray-400'}`}>Cancel</button>
                  </div>
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
                  <input type="text" placeholder="Phone Number" className="p-4 bg-gray-50 border border-gray-100 rounded-xl" />
                  <input type="text" placeholder="Class Year (if applicable)" className="p-4 bg-gray-50 border border-gray-100 rounded-xl" />
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
                  <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="Expiry Date *" className="p-4 bg-gray-50 border border-gray-100 rounded-xl" /><input type="text" placeholder="CVV *" className="p-4 bg-gray-50 border border-gray-100 rounded-xl" /></div>
                </div>
              </div>

              <div className="pt-10 border-t border-gray-100 space-y-6">
                <button className="w-full py-5 bg-[#003087] text-white rounded-2xl font-bold text-xl shadow-xl">Complete My Gift</button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-gray-400 font-bold uppercase text-center">
                  <div className="flex items-center justify-center gap-2"><Lock className="w-3 h-3" /> Secure & Encrypted</div>
                  <div>📧 Tax Receipt via Email</div>
                  <div>💳 Fully Tax-Deductible</div>
                </div>
              </div>
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
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">Your generosity empowers students, advances research, and strengthens our Jesuit mission of service and excellence. Together, we're building a brighter future for the Philippines.</p>
            <div className="pt-4 flex flex-col items-center gap-6">
              <button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-black/20">Make a Gift Today</button>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">Why Give to ADDU?</p>
            </div>
          </div>
        </div>

        {/* STATISTICS - Updated for border pop and spacing */}
        <div className="max-w-7xl mx-auto px-8 pt-20 pb-10 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[["Raised This Year", "65.8M"], ["Active Donors", "4,250"], ["Scholarships Awarded", "1,200+"], ["Alumni Participation", "35%"]].map(([label, val], i) => (
              <div 
                key={i} 
                className="space-y-2 border-2 border-blue-500 p-8 rounded-[32px] shadow-lg shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-200 transition-all bg-white"
              >
                <p className="text-4xl font-bold text-[#003087]">₱{val}</p>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AREAS OF NEED - Updated for centering and reduced spacing */}
        <div className="bg-gray-50/50 py-16">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Areas of Greatest Need</h2>
            <p className="text-gray-500 text-lg mb-16 max-w-3xl mx-auto">Every gift matters. Choose where your donation will have the most meaningful impact on the ADDU community and beyond.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Student Financial Aid", desc: "Ensure every deserving student can access an ADDU education regardless of financial circumstances.", stats: ["₱12.5M awarded annually", "450+ scholars supported"], icon: <GraduationCap /> },
                { title: "Faculty Excellence", desc: "Attract and retain world-class educators who inspire the next generation of leaders.", stats: ["₱8M in faculty development", "180+ faculty enhanced"], icon: <Presentation /> },
                { title: "Research & Innovation", desc: "Advance breakthrough research that addresses real-world challenges in our communities.", stats: ["₱6.2M in research grants", "45 active research projects"], icon: <Microscope /> },
                { title: "Campus Infrastructure", desc: "Build state-of-the-art facilities that create optimal learning environments.", stats: ["₱28M in improvements", "5 facilities upgraded"], icon: <Building2 /> },
                { title: "Academic Programs", desc: "Strengthen curricula and create new programs that prepare students for tomorrow.", stats: ["₱4.8M in program support", "12 programs enhanced"], icon: <BookOpen /> },
                { title: "Global Engagement", desc: "Expand international partnerships and study abroad opportunities for students.", stats: ["₱3.5M in exchanges", "85 international experiences"], icon: <Globe /> }
              ].map((area, i) => (
                <div key={i} className="bg-white p-10 rounded-[32px] border border-gray-100 text-left flex flex-col">
                  <div className="bg-blue-50 text-[#003087] w-14 h-14 rounded-2xl flex items-center justify-center mb-6">{area.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{area.title}</h3>
                  <p className="text-gray-500 mb-8 flex-1">{area.desc}</p>
                  <div className="space-y-3 mb-10 pt-6 border-t">{area.stats.map((s, si) => (<div key={si} className="text-sm font-bold text-gray-700 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" />{s}</div>))}</div>
                  <button onClick={() => setShowForm(true)} className="w-full py-4 rounded-xl border-2 border-[#003087] text-[#003087] font-bold text-sm">Support This Area</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STORIES */}
        <div className="max-w-7xl mx-auto px-8 py-24 text-center">
          <h2 className="text-4xl font-bold mb-16">Stories of Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Maria Clara Santos", sub: "Class of 2024 • Computer Science", quote: '"The scholarship changed my life. I went from wondering if I could finish my degree to graduating with honors and landing my dream job."', tag: "ADDU Excellence Scholarship", img: MariaSantosBG },
              { name: "Roberto Miguel Cruz", sub: "Class of 2023 • Engineering", quote: '"Thanks to donor support, I conducted research that is now being used to improve water systems in Mindanao communities."', tag: "Research Grant Recipient", img: MiguelCruzBG },
              { name: "Jennifer Anne Lim", sub: "Class of 2025 • Business Administration", quote: '"The global exchange program opened doors I never imagined. Now I\'m working with an international firm, bridging cultures."', tag: "Global Scholars Program", img: AnneLimBG }
            ].map((story, i) => (
              <div key={i} className="space-y-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto shadow-xl"><img src={story.img} className="w-full h-full object-cover" /></div>
                <p className="italic text-gray-600">{story.quote}</p>
                <div><h4 className="font-bold">{story.name}</h4><p className="text-xs text-gray-400">{story.sub}</p></div>
                <span className="inline-block bg-orange-50 text-orange-600 text-[10px] font-bold px-4 py-1 rounded-full uppercase">{story.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECOGNITION */}
        <div className="bg-[#003087] py-24 px-8 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Donor Recognition</h2>
            <p className="text-blue-200 mb-20">We honor our generous supporters who make our mission possible. Join our community of changemakers.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Founder's Circle", price: "₱1,000,000+", perks: ["Named endowment opportunities", "Private events with university leadership", "Campus building/room naming rights", "Lifetime recognition on Founder's Wall", "Annual impact reports and personal updates"] },
                { name: "President's Council", price: "₱500,000 - ₱999,999", perks: ["Invitation to exclusive university events", "Recognition in annual donor report", "Personal thank you from the President", "Priority access to campus events", "Quarterly impact updates"] },
                { name: "Loyola Society", price: "₱100,000 - ₱499,999", perks: ["Annual recognition event invitation", "Name in university publications", "Donor appreciation events", "Semi-annual impact reports", "Special ADDU memorabilia"] },
                { name: "Blue & Gold Circle", price: "₱25,000 - ₱99,999", perks: ["Recognition in donor honor roll", "Annual impact summary", "University event invitations", "Tax receipt and thank you letter"] }
              ].map((tier, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-[32px] text-left border border-white/10">
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3><p className="text-orange-400 font-bold mb-8 text-sm">{tier.price}</p>
                  <ul className="space-y-4">{tier.perks.map((p, pi) => (<li key={pi} className="text-xs text-blue-100 flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-orange-500 mt-0.5 shrink-0" />{p}</li>))}</ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WAYS TO GIVE */}
        <div className="max-w-7xl mx-auto px-8 py-24 text-left">
          <h2 className="text-4xl font-bold mb-16">Ways to Give</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { t: "Cash Gifts", d: "Make an immediate impact with a one-time or recurring gift via credit card, debit card, or bank transfer.", b: "Give Now" },
              { t: "Matching Gifts", d: "Double or triple your impact! Many employers match charitable donations made by their employees.", b: "Check Eligibility" },
              { t: "Planned Giving", d: "Create a lasting legacy through bequests, trusts, or life insurance beneficiary designations.", b: "Learn More" },
              { t: "Stock & Securities", d: "Donate appreciated stocks or securities and potentially receive tax benefits while avoiding capital gains.", b: "Transfer Stock" }
            ].map((way, i) => (
              <div key={i} className="space-y-4 flex flex-col">
                <h4 className="text-xl font-bold">{way.t}</h4><p className="text-gray-500 text-sm flex-1">{way.d}</p>
                <button onClick={() => setShowForm(true)} className="text-[#003087] font-bold text-sm flex items-center gap-2">{way.b} <ArrowRight className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER CTA */}
        <div className="py-24 text-center bg-gray-50">
          <h2 className="text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-gray-500 mb-10">Your gift today will transform lives and strengthen our community for generations to come.</p>
          <button onClick={() => setShowForm(true)} className="bg-[#003087] text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-xl">Give Now</button>
        </div>

        <div className="py-20 text-center bg-white border-t">
          <p className="text-xl font-bold mb-8">Questions About Giving?</p>
          <div className="flex flex-col md:flex-row justify-center gap-10 text-gray-600 font-bold">
            <div className="flex items-center gap-2"><Mail className="w-5 h-5 text-[#003087]" /> development@addu.edu.ph</div>
            <div className="flex items-center gap-2"><Phone className="w-5 h-5 text-[#003087]" /> +63 (82) 221-2411</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}