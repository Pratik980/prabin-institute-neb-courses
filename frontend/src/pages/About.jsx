import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ScrollReveal from '../components/ScrollReveal';
import axios from 'axios';

const About = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalVideoLessons: 0, totalCourses: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/users/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Format number with K+ suffix
  const formatNumber = (num) => {
    if (num >= 1000) {
      const k = Math.floor(num / 1000);
      return `${k}K+`;
    }
    return `${num}+`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Prabin Institute</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for NEB preparation through comprehensive video courses
          </p>
        </div>

        {/* Mission Section */}
        <ScrollReveal delay={0}>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-primary-600 mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              At Prabin Institute, we are dedicated to helping students excel in NEB examinations through high-quality video courses. 
              We believe that learning should be accessible, flexible, and effective. Our comprehensive video-based courses allow 
              students to learn at their own pace, anytime and anywhere.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mt-4">
              We focus exclusively on NEB preparation, providing detailed video lessons that cover the entire syllabus with expert 
              instruction and clear explanations.
            </p>
          </div>
        </ScrollReveal>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <ScrollReveal delay={0}>
            <div className="bg-white rounded-lg shadow-lg p-6 card-hover">
              <div className="text-4xl mb-4">📹</div>
              <h3 className="text-xl font-semibold mb-2">Expert Video Instruction</h3>
              <p className="text-gray-600">
                Learn from experienced NEB instructors through high-quality video lessons designed to help you master every concept.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="bg-white rounded-lg shadow-lg p-6 card-hover">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold mb-2">Learn at Your Pace</h3>
              <p className="text-gray-600">
                Access all video lessons 24/7. Pause, rewind, and rewatch videos as many times as you need to fully understand the material.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="bg-white rounded-lg shadow-lg p-6 card-hover">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Learn Anywhere</h3>
              <p className="text-gray-600">
                Access your video courses from any device - laptop, tablet, or smartphone. Study wherever and whenever suits you.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Why Choose Us Section */}
        <ScrollReveal delay={0}>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-primary-600 mb-6">Why Choose Prabin Institute for NEB Preparation?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">✅ Complete NEB Syllabus Coverage</h3>
                <p className="text-gray-600">
                  Our video courses cover the entire NEB syllabus comprehensively, ensuring you don't miss any important topics.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">✅ Video-Based Learning Only</h3>
                <p className="text-gray-600">
                  We focus exclusively on video courses. No classes, no exams - just high-quality video lessons you can watch anytime.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">✅ Expert Instruction</h3>
                <p className="text-gray-600">
                  Learn from experienced NEB instructors who know exactly what students need to excel in examinations.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">✅ Self-Paced Learning</h3>
                <p className="text-gray-600">
                  Study at your own speed. Rewatch difficult concepts, skip ahead if you're confident, and learn at your convenience.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <ScrollReveal delay={0}>
            <div className="bg-primary-600 text-white rounded-lg p-6 text-center card-hover">
              <div className="text-4xl font-bold mb-2">{formatNumber(stats.totalStudents)}</div>
              <div className="text-primary-100">Students</div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="bg-primary-600 text-white rounded-lg p-6 text-center card-hover">
              <div className="text-4xl font-bold mb-2">{formatNumber(stats.totalVideoLessons)}</div>
              <div className="text-primary-100">Video Lessons</div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="bg-primary-600 text-white rounded-lg p-6 text-center card-hover">
              <div className="text-4xl font-bold mb-2">{formatNumber(stats.totalCourses)}</div>
              <div className="text-primary-100">Courses</div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="bg-primary-600 text-white rounded-lg p-6 text-center card-hover">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-primary-100">Satisfaction</div>
            </div>
          </ScrollReveal>
        </div>

        {/* CTA Section */}
        <ScrollReveal delay={0}>
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-12 text-center card-hover">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl mb-6">Join thousands of students preparing for NEB with our video courses</p>
            <a
              href="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block ripple"
            >
              Get Started Today
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default About;
