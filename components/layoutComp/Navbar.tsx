







"use client";

import Link from "next/link";
import { Moon, Sun, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useThemeStore } from "@/store/themeStore";

const Navbar = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Droplet className="w-6 h-6 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Pulse Map
            </span>
          </motion.div>

          {/* Desktop links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center gap-8"
          >
            <Link href="#features" className="text-foreground/80 hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-foreground/80 hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#impact" className="text-foreground/80 hover:text-primary transition-colors">
              Impact
            </Link>
          </motion.div>

          {/* Right side */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <SignedOut>
              <Link href="/sign-in">
                <Button variant="outline" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>

              <Link href="/sign-up">
                <Button className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow">
                  Get Started
                </Button>
              </Link>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <Button className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow">
                  Dashboard
                </Button>
              </Link>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </SignedIn>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

























// import { Moon, Sun, Droplet } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useTheme } from "next-themes";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";

// const Navbar = () => {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
//     >
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="flex items-center gap-2"
//           >
//             <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
//               <Droplet className="w-6 h-6 text-primary-foreground" fill="currentColor" />
//             </div>
//             <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//               LifeLink
//             </span>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="hidden md:flex items-center gap-8"
//           >
//             <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">
//               Features
//             </a>
//             <a href="#how-it-works" className="text-foreground/80 hover:text-primary transition-colors">
//               How It Works
//             </a>
//             <a href="#impact" className="text-foreground/80 hover:text-primary transition-colors">
//               Impact
//             </a>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             className="flex items-center gap-4"
//           >
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//               className="rounded-full"
//             >
//               {theme === "dark" ? (
//                 <Sun className="h-5 w-5" />
//               ) : (
//                 <Moon className="h-5 w-5" />
//               )}
//             </Button>
//             <Button variant="outline" className="hidden sm:inline-flex">
//               Sign In
//             </Button>
//             <Button className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow">
//               Get Started
//             </Button>
//           </motion.div>
//         </div>
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;
















// "use client";

// import Link from "next/link";
// import { Moon, Sun, Droplet } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useTheme } from "next-themes";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// const Navbar = () => {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
//     >
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="flex items-center gap-2"
//           >
//             <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
//               <Droplet className="w-6 h-6 text-primary-foreground" fill="currentColor" />
//             </div>
//             <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//               LifeLink
//             </span>
//           </motion.div>

//           {/* Desktop Links */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="hidden md:flex items-center gap-8"
//           >
//             <Link href="#features" className="text-foreground/80 hover:text-primary transition-colors">
//               Features
//             </Link>
//             <Link href="#how-it-works" className="text-foreground/80 hover:text-primary transition-colors">
//               How It Works
//             </Link>
//             <Link href="#impact" className="text-foreground/80 hover:text-primary transition-colors">
//               Impact
//             </Link>
//           </motion.div>

//           {/* Right Side */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             className="flex items-center gap-4"
//           >
//             {/* Theme Toggle */}
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//               className="rounded-full"
//             >
//               {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//             </Button>

//             {/* If NOT logged in */}
//             <SignedOut>
//               <Link href="/sign-in">
//                 <Button variant="outline" className="hidden sm:inline-flex">
//                   Sign In
//                 </Button>
//               </Link>

//               <Link href="/sign-up">
//                 <Button className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow">
//                   Get Started
//                 </Button>
//               </Link>
//             </SignedOut>

//             {/* If logged in */}
//             <SignedIn>
//               <Link href="/dashboard">
//                 <Button className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow">
//                   Dashboard
//                 </Button>
//               </Link>

//               <UserButton
//                 appearance={{
//                   elements: {
//                     avatarBox: "w-10 h-10",
//                   },
//                 }}
//               />
//             </SignedIn>
//           </motion.div>
//         </div>
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;



















