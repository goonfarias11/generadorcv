'use client'

import { useResumeStore } from '@/store/resumeStore'
import { calculateScore, getScoreLevel } from '@/lib/score'
import { useState } from 'react'

export default function ProgressScore({ compact = false }) {
  const { resume } = useResumeStore()
  const result = calculateScore(resume)
  const scoreValue = typeof result === 'number' ? result : result.score
  const tips = typeof result === 'object' ? result.tips : []
  const { level, color, text } = getScoreLevel(scoreValue)
  const [showTips, setShowTips] = useState(false)

  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  }

  const textColorClasses = {
    green: 'text-green-700',
    blue: 'text-blue-700',
    yellow: 'text-yellow-700',
    orange: 'text-orange-700',
    red: 'text-red-700'
  }

  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-sm md:text-base font-bold text-neutral-800">Calidad del CV</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-bold text-sm ${textColorClasses[color]}`}>{level}</span>
            <div className="text-2xl md:text-3xl font-bold" style={{ color: `var(--${color}-600)` }}>
              {scoreValue}%
            </div>
          </div>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2 md:h-3 overflow-hidden shadow-inner">
          <div
            className={`${colorClasses[color]} h-2 md:h-3 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${scoreValue}%` }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-neutral-200 p-4 md:p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-base md:text-lg font-bold text-neutral-800">Calidad del CV</h3>
        </div>
        <div className="text-3xl md:text-4xl font-bold" style={{ color: `var(--${color}-600)` }}>
          {scoreValue}%
        </div>
      </div>

      <div className="w-full bg-neutral-200 rounded-full h-3 md:h-4 mb-4 overflow-hidden shadow-inner">
        <div
          className={`${colorClasses[color]} h-3 md:h-4 rounded-full transition-all duration-500 ease-out shadow-sm`}
          style={{ width: `${scoreValue}%` }}
        ></div>
      </div>

      <div className="text-center">
        <p className={`font-bold text-base md:text-lg ${textColorClasses[color]} mb-1`}>{level}</p>
        <p className="text-sm md:text-base text-neutral-700 font-medium">{text}</p>
      </div>

      {/* Tips de mejora */}
      {tips && tips.length > 0 && (
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between text-xs md:text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>💡 Sugerencias de mejora ({tips.length})</span>
            <span className="text-lg md:text-xl">{showTips ? '−' : '+'}</span>
          </button>
          
          {showTips && (
            <div className="mt-2 md:mt-3 space-y-1.5 md:space-y-2 animate-fade-in">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-700 bg-yellow-50 p-2 md:p-3 rounded">
                  <span className="text-yellow-600 font-bold">→</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
        <h4 className="text-[10px] md:text-xs font-semibold text-gray-600 mb-2 uppercase">Desglose:</h4>
        <div className="space-y-1.5 md:space-y-2 text-[10px] md:text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Información personal</span>
            <span className={resume.name && resume.email ? 'text-green-600 font-semibold' : 'text-gray-400'}>
              {resume.name && resume.email ? '✓' : '○'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Perfil profesional</span>
            <span className={resume.profile && resume.profile.length > 50 ? 'text-green-600 font-semibold' : 'text-gray-400'}>
              {resume.profile && resume.profile.length > 50 ? '✓' : '○'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Experiencia laboral</span>
            <span className={resume.experience?.length > 0 ? 'text-green-600 font-semibold' : 'text-gray-400'}>
              {resume.experience?.length > 0 ? `✓ (${resume.experience.length})` : '○'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Educación</span>
            <span className={resume.education?.length > 0 ? 'text-green-600 font-semibold' : 'text-gray-400'}>
              {resume.education?.length > 0 ? `✓ (${resume.education.length})` : '○'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Habilidades</span>
            <span className={resume.skills?.length >= 4 ? 'text-green-600 font-semibold' : 'text-gray-400'}>
              {resume.skills?.length > 0 ? `${resume.skills.length} skills` : '○'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
