"use client"


import { motion } from "framer-motion";
import { UserPlus, MapPin, Bell, Heart } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Register as Donor",
    description: "Create your profile with blood type, location, and availability status.",
  },
  {
    icon: MapPin,
    title: "Share Location",
    description: "Enable live location tracking to help nearby recipients find you quickly.",
  },
  {
    icon: Bell,
    title: "Get Notified",
    description: "Receive instant alerts when someone nearby needs your blood type.",
  },
  {
    icon: Heart,
    title: "Save Lives",
    description: "Respond to requests and make a life-saving difference in your community.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI0MCwgNjgsIDU2LCAwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to start saving lives in your community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow mx-auto">
                    <step.icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-linear-to-r from-primary to-transparent" />

                // <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-linear-to-r from-primary to-transparent" />
                //  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-[transparent]" /> 
              )}
{/* 
      {index < steps.length - 1 && (
          <div
            className="
              hidden lg:block
              absolute
              top-1/2
              left-1/2
              w-[220px]
              h-[3px]
              -translate-y-1/2
              -translate-x-1/2
              bg-gradient-to-r
              from-transparent
              via-red-500/70
              to-transparent
              z-0
            "
          />
      )} 
 */}

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
