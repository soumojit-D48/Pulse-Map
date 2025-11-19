"use client"


import { motion } from "framer-motion";
import { Map, Users, Clock, Shield, Bell, Activity } from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Live Location Tracking",
    description: "Share your location and find nearby donors on an interactive map with real-time updates.",
  },
  {
    icon: Users,
    title: "Smart Donor Matching",
    description: "Advanced algorithm matches blood type and proximity for the fastest possible response.",
  },
  {
    icon: Clock,
    title: "Emergency Requests",
    description: "Create urgent blood requests that instantly notify all nearby eligible donors.",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "All donors are verified with donation history and availability status for safety.",
  },
  {
    icon: Bell,
    title: "Push Notifications",
    description: "Get instant alerts when someone nearby needs your blood type urgently.",
  },
  {
    icon: Activity,
    title: "Donation History",
    description: "Track your donations, view statistics, and see the lives you've helped save.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Life-Saving
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to connect donors with recipients in critical moments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card border border-border rounded-2xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
