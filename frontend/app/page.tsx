'use client';

import Link from 'next/link';
import { WEBSITE_REGISTER, WEBSITE_LOGIN } from '@/routes/WebsiteRoute';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Award, Share2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center px-4 py-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm mb-6 border border-white/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Referral System • Launch your campaign
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Share & Earn with
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Referral Program
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
          Invite your friends, earn rewards, and grow your network. 
          Every successful referral gives you bonus points!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href={WEBSITE_REGISTER}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href={WEBSITE_LOGIN}>
            <Button size="lg" variant="outline" className="text-black cursor-pointer border-white/30 hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">10k+</p>
            <p className="text-sm text-gray-300">Active Users</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white">50k+</p>
            <p className="text-sm text-gray-300">Points Earned</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-center mb-2">
              <Share2 className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">100k+</p>
            <p className="text-sm text-gray-300">Referrals Made</p>
          </div>
        </div>
      </div>
    </div>
  );
}