import React, { useState } from "react";
import {
  Download,
  Star,
  Users,
  Shield,
  Smartphone,
  ArrowRight,
  Play,
  Moon,
  Sparkles,
  Eye,
} from "lucide-react";

function AppLink() {
  const [isHovered, setIsHovered] = useState(false);

  // Replace this with your actual Google Play Store link
  const playStoreLink =
    "https://play.google.com/store/apps/details?id=your.astrology.app.package";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements - stars and cosmic effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>

        {/* Scattered stars */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-300 rounded-full opacity-80 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-purple-300 rounded-full opacity-70 animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-pink-300 rounded-full opacity-60 animate-ping delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300 relative">
              <Moon className="w-12 h-12 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-1 w-2 h-2 bg-purple-300 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Cosmic Insights
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Unlock the mysteries of the universe. Discover your destiny through
            personalized astrology readings, daily horoscopes, and cosmic
            guidance.
          </p>

          {/* Mystical tagline */}
          <div className="flex items-center justify-center space-x-2 text-purple-300 mb-8">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-lg italic">
              "Your stars await, your future unfolds"
            </span>
            <Sparkles className="w-5 h-5 animate-pulse delay-500" />
          </div>
        </div>

        {/* Main CTA Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-purple-300/20 shadow-2xl relative overflow-hidden">
            {/* Cosmic decoration */}
            <div className="absolute top-4 right-4 w-16 h-16 border border-purple-300/30 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border border-pink-300/30 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Begin Your Cosmic Journey
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join millions who trust the stars for guidance in love, career,
                and life's biggest decisions
              </p>
            </div>

            {/* Download Button */}
            <div className="flex justify-center mb-8">
              <a
                href={playStoreLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative bg-black rounded-xl px-8 py-4 flex items-center space-x-4 transform hover:scale-105 transition-all duration-300">
                  <Play className="w-8 h-8 text-white" />
                  <div className="text-left">
                    <div className="text-xs text-gray-300 uppercase tracking-wide">
                      Get it on
                    </div>
                    <div className="text-xl font-bold text-white">
                      Google Play
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-6 h-6 text-white transform transition-transform duration-300 ${isHovered ? "translate-x-2" : ""}`}
                  />
                </div>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center group">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 relative">
                  <Users className="w-6 h-6 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-bold text-white">2M+</div>
                <div className="text-gray-300">Cosmic Seekers</div>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-r from-pink-500 to-indigo-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 relative">
                  <Star className="w-6 h-6 text-white" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-300 rounded-full animate-ping"></div>
                </div>
                <div className="text-2xl font-bold text-white">4.9</div>
                <div className="text-gray-300">Star Rating</div>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-gray-300">Confidential</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-4">
            Discover Your Cosmic Destiny
          </h3>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Unlock personalized insights powered by ancient wisdom and modern
            astrology
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 h-full border border-purple-300/20 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-2 right-2 w-6 h-6 border border-purple-300/20 rounded-full animate-spin"></div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Moon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  Daily Horoscopes
                </h4>
                <p className="text-gray-300">
                  Get personalized daily insights based on your zodiac sign and
                  planetary alignments. Start each day with cosmic guidance.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 h-full border border-pink-300/20 hover:border-pink-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-3 right-3 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="absolute top-6 right-6 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
                <div className="bg-gradient-to-r from-pink-500 to-indigo-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  Birth Chart Analysis
                </h4>
                <p className="text-gray-300">
                  Unlock the secrets of your personality with detailed natal
                  chart readings and planetary position analysis.
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 h-full border border-indigo-300/20 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-4 h-4 border border-indigo-300/30 rounded-full animate-pulse"></div>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">
                  Compatibility Reading
                </h4>
                <p className="text-gray-300">
                  Explore relationship compatibility through zodiac matching and
                  discover your perfect cosmic connections.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-8 border border-purple-300/20 text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <blockquote className="text-lg text-white italic mb-4">
              "This app completely changed how I understand myself and my
              relationships. The daily readings are incredibly accurate and the
              birth chart analysis was mind-blowing!"
            </blockquote>
            <div className="text-purple-300">- Sarah M., Verified User</div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="inline-block bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-300/20 relative">
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping"></div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Connect With Expert Astrologers Now
            </h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Download AstroSeva and get your first consultation at special
              rates. Choose text, audio, or video - your preference!
            </p>
            <a
              href={playStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              <span>Download AstroSeva</span>
              <Sparkles className="w-4 h-4 animate-pulse" />
            </a>
            <div className="mt-4 text-sm text-purple-300">
              ✨ Free download • Special rates for first-time users
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppLink;
