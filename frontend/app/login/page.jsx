// // frontend/app/login/page.tsx
// 'use client'

// import { Eye, EyeOff } from "lucide-react";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import PageTransition from "@/components/PageTransition";
// export default function LoginPage() {
//     const router = useRouter();
//     const [showPassword, setShowPassword] = useState(false);
//     const [form, setForm] = useState({
//       email: '',
//       password: ''
//     });
    
//     const handleChange = (e) => {
//       setForm({ ...form, [e.target.name]: e.target.value });
//     };
    
//     const handleSubmit = (e) => {
//       e.preventDefault();
//       console.log('Login attempt:', form);
//       // Simulate successful login with slight delay for transition
//       setTimeout(() => {
//         router.push('/');
//       }, 500);
//     };
//   return (
//     <PageTransition>
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-[#2f3136]/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md">
//         <div className="flex flex-col">
//         <h1 className="text-3xl font-bold mb-2 text-white text-center">Welcome Back</h1>
//         <p className="mb-5 text-center">We are excited to see you back!</p>
//         </div>
//         <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//           <div className="flex flex-col space-y-1">
//             <label className="text-sm font-bold text-white">
//               Email <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="bg-[#202225] w-full text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//             />
//           </div>
//           <div className="flex flex-col space-y-1">
//             <label className="text-sm font-bold text-white">
//               Password <span className="text-red-500">*</span>
//             </label>
//             <div className="relative w-full">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 className="bg-[#202225] w-full text-white placeholder-gray-400 p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={()=>{
//                   setShowPassword((prev) => !prev)
//                 }}
//                 className="absolute right-3 top-3 text-white">
//                   {showPassword ? <EyeOff /> : <Eye/>}
//               </button>
//             </div>
//           </div>
//         <p className="text-sm text-gray-400 text-left">
//           <Link href="/forgot" className="text-indigo-400 hover:underline">Forgot Password?</Link>
//         </p>
//           <button
//             type="submit"
//             className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 cursor-pointer rounded-lg transition duration-300"
//           >
//             Login
//           </button>
//         </form>
//         <p className="text-sm text-gray-400 mt-4 text-center">
//           Need an account? <Link href="/register" className="text-indigo-400 hover:underline">Register</Link>
//         </p>
//         </div>
//       </div>
//     </PageTransition>
//   );
// }

'use client'

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(form.email, form.password);
      if (!result.success) {
        alert(result.error || 'Login failed');
        return;
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[#2f3136]/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-2 text-white text-center">Welcome Back</h1>
            <p className="mb-5 text-center text-gray-300">We are excited to see you back!</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-bold text-white">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="bg-[#202225] w-full text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-bold text-white">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="bg-[#202225] w-full text-white placeholder-gray-400 p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-white"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-400 text-left">
              <Link href="/forgot" className="text-indigo-400 hover:underline">Forgot Password?</Link>
            </p>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 cursor-pointer rounded-lg transition duration-300"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-gray-400 mt-4 text-center">
            Need an account? <Link href="/register" className="text-indigo-400 hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
