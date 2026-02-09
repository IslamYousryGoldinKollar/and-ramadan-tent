'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Moon, ChevronDown, ChevronRight, Sparkles, UtensilsCrossed,
  Activity, Droplets, Dumbbell, Sun, BookOpen, HeartHandshake, Shield,
  Brain, CloudSun, Target, Users, Flower2
} from 'lucide-react'
import { EandLogo } from '@/components/ui/eand-logo'
import { WELLNESS_CATEGORIES, EGYPTIAN_MEALS, type WellnessCategory } from '@/lib/wellness-data'

// Icon mapping
const Icons: Record<string, any> = {
  Activity, Droplets, Dumbbell, Moon, UtensilsCrossed,
  Sparkles, Sun, BookOpen, HeartHandshake, Shield,
  Brain, CloudSun, Target, Users, Flower2
}

type View = 'home' | 'category' | 'topic' | 'meals'

export default function WellnessPage() {
  const [view, setView] = useState<View>('home')
  const [activeCategory, setActiveCategory] = useState<WellnessCategory | null>(null)
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null)

  const openCategory = (cat: WellnessCategory) => {
    setActiveCategory(cat)
    setView('category')
    setActiveTopic(null)
  }

  const openTopic = (topicId: string) => {
    if (topicId === 'meals') {
      setView('meals')
    } else {
      setActiveTopic(topicId)
      setView('topic')
    }
  }

  const goBack = () => {
    if (view === 'topic' || view === 'meals') {
      setView('category')
      setActiveTopic(null)
    } else if (view === 'category') {
      setView('home')
      setActiveCategory(null)
    }
  }

  const currentTopic = activeCategory?.topics.find(t => t.id === activeTopic)
  const CategoryIcon = activeCategory ? Icons[activeCategory.icon] : null
  const TopicIcon = currentTopic ? Icons[currentTopic.icon] : null

  return (
    <div className="min-h-screen bg-ramadan-subtle flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-eand-ocean/95 backdrop-blur-md border-b border-white/10 safe-top">
        <div className="content-container py-3 flex items-center justify-between">
          {view === 'home' ? (
            <Link href="/" className="flex items-center gap-2 text-white/70 active:text-ramadan-gold transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Home</span>
            </Link>
          ) : (
            <button onClick={goBack} className="flex items-center gap-2 text-white/70 active:text-ramadan-gold transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          <EandLogo size="sm" className="brightness-0 invert" />
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-ramadan-dark px-4 pt-8 pb-5 lg:pt-14 lg:pb-8">
        <div className="absolute top-6 right-8 text-eand-bright-green/10 animate-float-slow">
          <Moon className="h-32 w-32 lg:h-48 lg:w-48" />
        </div>
        <div className="particle w-1.5 h-1.5 bg-eand-bright-green/20 top-1/4 left-[20%] animate-twinkle" />
        <div className="particle w-1 h-1 bg-white/15 bottom-1/4 right-[25%] animate-twinkle delay-1000" />

        <div className="content-container text-center relative z-10">
          <div className="w-16 h-16 bg-eand-dark-green/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-eand-bright-green/20 opacity-0 animate-scale-in">
            {view === 'home' && <Sparkles className="h-8 w-8 text-eand-bright-green" />}
            {view === 'category' && CategoryIcon && <CategoryIcon className="h-8 w-8 text-eand-bright-green" />}
            {view === 'topic' && TopicIcon && <TopicIcon className="h-8 w-8 text-eand-bright-green" />}
            {view === 'meals' && <UtensilsCrossed className="h-8 w-8 text-eand-bright-green" />}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight opacity-0 animate-fade-in-up delay-200">
            {view === 'home' && 'Ramadan Tips'}
            {view === 'category' && activeCategory && `${activeCategory.label} Tips`}
            {view === 'topic' && currentTopic && `${currentTopic.title}`}
            {view === 'meals' && '30 Egyptian Ramadan Meals'}
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto opacity-0 animate-fade-in-up delay-400">
            {view === 'home' && 'Practical tips for body, mind & worship throughout the holy month'}
            {view === 'category' && activeCategory?.description}
            {view === 'topic' && currentTopic?.content}
            {view === 'meals' && 'One authentic Egyptian dish for each day of Ramadan'}
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 px-4 py-6 lg:py-10">
        <div className="content-container">

          {/* ===== HOME VIEW: 3 Category Cards ===== */}
          {view === 'home' && (
            <div className="space-y-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center mb-2">Choose a category</p>
              {WELLNESS_CATEGORIES.map((cat, i) => {
                const Icon = Icons[cat.icon]
                return (
                  <button
                    key={cat.id}
                    onClick={() => openCategory(cat)}
                    className={`w-full text-left rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 active:scale-[0.98] opacity-0 animate-fade-in-up border-0 ${cat.borderColor} hover:-translate-y-1`}
                    style={{ animationDelay: `${150 + i * 120}ms` }}
                  >
                    <div className={`bg-gradient-to-r ${cat.gradient} p-5 flex items-center gap-4`}>
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-white mb-0.5">{cat.label}</h2>
                        <p className="text-sm text-white/80">{cat.description}</p>
                        <p className="text-xs text-white/60 mt-1">{cat.topics.length} topics inside</p>
                      </div>
                      <ChevronRight className="h-6 w-6 text-white/60 flex-shrink-0" />
                    </div>
                  </button>
                )
              })}

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mt-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
                  <p className="text-2xl font-black text-emerald-500">11</p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Topics</p>
                </div>
                <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
                  <p className="text-2xl font-black text-indigo-500">55+</p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Tips</p>
                </div>
                <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
                  <p className="text-2xl font-black text-amber-500">30</p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Meals</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== CATEGORY VIEW: Topic Cards ===== */}
          {view === 'category' && activeCategory && (
            <div className="space-y-3">
              {activeCategory.topics.map((topic, i) => {
                const Icon = Icons[topic.icon]
                return (
                  <button
                    key={topic.id}
                    onClick={() => openTopic(topic.id)}
                    className={`w-full text-left bg-white rounded-2xl shadow-sm border ${activeCategory.borderColor} hover:shadow-lg transition-all duration-300 active:scale-[0.98] overflow-hidden opacity-0 animate-fade-in-up group hover:-translate-y-1`}
                    style={{ animationDelay: `${100 + i * 100}ms` }}
                  >
                    <div className="p-4 flex items-center gap-4">
                      <div className={`w-14 h-14 ${activeCategory.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-7 w-7 ${activeCategory.textColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base leading-snug">{topic.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{topic.content}</p>
                        {topic.id === 'meals' && (
                          <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            <UtensilsCrossed className="h-3 w-3" /> 30 Egyptian dishes
                          </span>
                        )}
                        {topic.items && topic.items.length > 0 && topic.id !== 'meals' && (
                          <span className={`inline-block mt-1.5 text-[10px] font-bold ${activeCategory.textColor} ${activeCategory.bgLight} px-2 py-0.5 rounded-full`}>
                            {topic.items.length} tips
                          </span>
                        )}
                      </div>
                      <ChevronRight className={`h-5 w-5 text-gray-300 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-200`} />
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* ===== TOPIC VIEW: Expanded Tips ===== */}
          {view === 'topic' && currentTopic && activeCategory && TopicIcon && (
            <div className="space-y-3">
              {/* Intro card */}
              <div className={`${activeCategory.bgLight} border ${activeCategory.borderColor} rounded-2xl p-4 opacity-0 animate-fade-in-up`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center flex-shrink-0`}>
                    <TopicIcon className={`h-6 w-6 ${activeCategory.textColor}`} />
                  </div>
                  <p className={`text-sm ${activeCategory.textColor} leading-relaxed`}>{currentTopic.content}</p>
                </div>
              </div>

              {/* Tip cards */}
              {currentTopic.items?.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 opacity-0 animate-fade-in-up hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  style={{ animationDelay: `${150 + i * 80}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 ${activeCategory.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <span className={`text-sm font-black ${activeCategory.textColor}`}>{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm leading-snug">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== MEALS VIEW: 30 Egyptian Meals ===== */}
          {view === 'meals' && (
            <div className="space-y-3">
              {/* Intro */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 opacity-0 animate-fade-in-up">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🇪🇬</span>
                  <div>
                    <p className="text-sm font-bold text-amber-800">Authentic Egyptian Ramadan Kitchen</p>
                    <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                      30 beloved Egyptian dishes — one for each day of Ramadan. From classic street food to grandma&apos;s recipes, these are the flavors that make Egyptian Ramadan special.
                    </p>
                  </div>
                </div>
              </div>

              {/* Meal cards */}
              {EGYPTIAN_MEALS.map((meal, i) => {
                const isOpen = expandedMeal === meal.day
                return (
                  <div
                    key={meal.day}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden opacity-0 animate-fade-in-up hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                    style={{ animationDelay: `${100 + Math.min(i * 50, 800)}ms` }}
                  >
                    <button
                      onClick={() => setExpandedMeal(isOpen ? null : meal.day)}
                      className="w-full text-left p-4 flex items-center gap-3"
                    >
                      <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-200/50">
                        <span className="text-white font-black text-sm">{meal.day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-[15px] leading-snug">{meal.name}</h3>
                        </div>
                        <p className="text-xs text-amber-600 font-medium mt-0.5" dir="rtl">{meal.nameAr}</p>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-gray-300 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-4 pb-4 pt-0">
                        <div className="border-t border-gray-100 pt-3">
                          <p className="text-sm text-gray-600 leading-relaxed">{meal.desc}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Day {meal.day}</span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Egyptian 🇪🇬</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-eand-ocean px-4 py-6 text-center safe-bottom">
        <EandLogo size="sm" className="mx-auto mb-2 brightness-0 invert opacity-40" />
        <p className="text-white/30 text-xs">© 2026 e& Egypt. All rights reserved.</p>
      </footer>
    </div>
  )
}
