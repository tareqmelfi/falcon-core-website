import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface WorkflowStep {
  title: string;
  description: string;
}

interface ServiceWorkflowProps {
  steps: WorkflowStep[];
  title?: string;
}

export const ServiceWorkflow = ({ steps, title }: ServiceWorkflowProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-2xl md:text-3xl font-bold mb-12 text-center">
          {title}
        </h3>
      )}
      
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative"
      >
        {/* Connection line for desktop */}
        <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 rounded-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={item}
              className="flex flex-col items-start"
            >
              {/* Step number circle */}
              <div className="flex items-center gap-4 w-full mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">{index + 1}</span>
                </div>
                
                {/* Mobile connection line */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute left-6 top-12 w-1 h-8 bg-primary/30" />
                )}
              </div>

              {/* Step content */}
              <div className="p-4 rounded-xl bg-background/40 border border-white/10 hover:border-primary/30 transition-all w-full">
                <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Completion indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: steps.length * 0.2 + 0.3 }}
          className="flex justify-center mt-12"
        >
          <div className="p-6 rounded-full bg-primary/10 border-2 border-primary/30">
            <Check className="w-8 h-8 text-primary" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ServiceWorkflow;
