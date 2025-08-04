import { assets } from '@/assets/assets';
import LoginNavbar from '@/components/LoginNavbar';
import Image from 'next/image';

export default function RegisterLayout({ children }) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={assets.LoginNavbarBg}
          alt="Background"
          className="w-full h-full object-cover"
          fill
          priority
        />
      </div>

      <LoginNavbar />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}