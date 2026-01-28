// src/app/components/LoginForm.tsx
interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold text-[#003087] mb-6">Login</h2>
      <form className="flex flex-col gap-4">
        <input type="email" placeholder="Email" className="p-2 border rounded" />
        <input type="password" placeholder="Password" className="p-2 border rounded" />
        <button type="submit" className="bg-[#003087] text-white py-2 rounded hover:bg-[#002266] transition-colors">
          Log In
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignup} className="text-[#003087] font-medium hover:underline">
          Sign Up
        </button>
      </p>
    </div>
  );
}
