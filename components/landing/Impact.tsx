"use client"


import { motion } from "framer-motion";
import { Target, Zap, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const reasons = [
  {
    icon: Zap,
    title: "Lightning Fast Response",
    description: "Our real-time matching algorithm connects you with nearby donors in seconds, not hours. Every second counts in emergencies.",
  },
  {
    icon: Shield,
    title: "Safe & Verified",
    description: "Every donor profile is verified with medical history and donation eligibility. Your safety is our top priority.",
  },
  {
    icon: Target,
    title: "Precision Matching",
    description: "Advanced location-based matching ensures you find the closest compatible donor based on blood type and availability.",
  },
  {
    icon: Sparkles,
    title: "Community Driven",
    description: "Join a growing community of heroes ready to make a difference. Together, we're building a life-saving network.",
  },
];

const Impact = () => {
  return (
    <section id="impact" className="py-32 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            🚀 Launching Soon
          </span>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Be Part of Something{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Life-Changing
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're building the future of emergency blood donation. Join us as an early member 
            and help create a community that saves lives every single day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card border border-border rounded-3xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <reason.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{reason.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-primary rounded-[2.5rem] p-1 shadow-glow max-w-4xl mx-auto">
            <div className="bg-background rounded-[2.25rem] p-12 md:p-16">
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Save Lives?
              </h3>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Be among the first to join our platform. Early members get priority access, 
                exclusive features, and the chance to shape the future of blood donation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow text-lg px-8 py-6">
                    Join as Early Donor
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                    Learn More
                  </Button>
                </motion.div>
              </div>
              <p className="text-sm text-muted-foreground mt-8">
                🎉 First 1,000 members get exclusive founder badges
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Impact;
