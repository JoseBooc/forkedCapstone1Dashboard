import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import ADDULogo from '../../assets/ADDULogo.jpg';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    // For now, just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side - Blue Background with Campus Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-[#003087] relative overflow-hidden"
        style={{
          background: `linear-gradient(rgba(0, 61, 122, 0.85), rgba(0, 61, 122, 0.85)), url('https://upload.wikimedia.org/wikipedia/en/3/3e/Ateneo_De_Davao_University_%28Roxas_Avenue%2C_Davao_City%3B_08-21-2023%29.jpg') center/cover`
        }}
      >
        {/* Back to Home Button - Desktop */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-white hover:text-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Content */}
        <div className="flex flex-col justify-center items-center w-full px-12 text-white">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 p-4">
              <img src={ADDULogo} alt="ADDU Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-2 text-center">Alumni Portal</h1>
          <p className="text-xl mb-8 text-blue-100">Ateneo de Davao University</p>

          {/* Welcome Text */}
          <h2 className="text-3xl font-bold mb-6 text-center">
            Welcome Home, <span className="text-orange-400">Ateneans</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-center max-w-md text-blue-100">
            Connecting generations of excellence. Join our thriving community of over 50,000 alumni making a difference worldwide.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
        {/* Mobile Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-[#003D7A] hover:text-[#002855] transition lg:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          {/* Logo for Mobile */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-2">
              <img src={ADDULogo} alt="ADDU Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-[#003087] mb-2">Sign In</h2>
          <p className="text-gray-600 mb-8">Access your alumni account</p>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Address */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-2">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D7A] focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="mb-6 text-right">
              <button
                type="button"
                className="text-[#003D7A] hover:text-[#002855] font-medium text-sm transition"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#003D7A] text-white py-3 rounded-lg hover:bg-[#002855] transition font-semibold text-lg shadow-lg"
            >
              Sign In
            </button>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-[#003D7A] hover:text-[#002855] font-bold transition"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
