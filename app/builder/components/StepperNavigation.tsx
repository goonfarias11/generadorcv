/**
 * StepperNavigation Component
 * Lateral navigation for builder sections
 */

'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface Step {
  id: number
  name: string
  icon: string
  completed?: boolean
}

interface StepperNavigationProps {
  steps: Step[]
  activeStep: number
  onStepClick: (stepId: number) => void
  className?: string
}

export default function StepperNavigation({ 
  steps, 
  activeStep, 
  onStepClick,
  className = '' 
}: StepperNavigationProps) {
  return (
    <nav 
      className={`space-y-1 ${className}`}
      aria-label="Navegación de secciones del CV"
    >
      {steps.map((step, index) => {
        const isActive = activeStep === step.id
        const isCompleted = step.completed
        const isPast = step.id < activeStep

        return (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
              ${isActive 
                ? 'bg-primary-50 border-2 border-primary-600 text-primary-900' 
                : isPast || isCompleted
                  ? 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }
            `}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`Paso ${index + 1}: ${step.name}`}
          >
            {/* Step Number / Icon */}
            <div className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${isActive 
                ? 'bg-primary-600 text-white' 
                : isCompleted || isPast
                  ? 'bg-green-100 text-green-700'
                  : 'bg-neutral-200 text-neutral-600'
              }
            `}>
              {isCompleted || isPast ? (
                <Check className="w-4 h-4" />
              ) : (
                <span>{step.icon}</span>
              )}
            </div>

            {/* Step Name */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${
                isActive ? 'text-primary-900' : 'text-neutral-700'
              }`}>
                {step.name}
              </p>
              {isActive && (
                <motion.div
                  layoutId="activeStepIndicator"
                  className="h-0.5 bg-primary-600 mt-1"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </div>

            {/* Active Indicator */}
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 rounded-full bg-primary-600"
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
