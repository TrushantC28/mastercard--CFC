import React from 'react';
import { 
  Ear, 
  Lightbulb, 
  Wrench, 
  TrendingUp
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ImpactInfographic from '../components/common/ImpactInfographic';
import heroImg from '../assets/hero.png';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />

      {/* SECTION 2: HERO SECTION */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <h1 className="hero-title">Share Your Experience</h1>
          <p className="hero-subtitle">
            Every volunteering experience has a story. Share yours and help us create better experiences for every volunteer.
          </p>
          <p className="hero-support-text" style={{marginTop: '2rem'}}>
            Your feedback helps SevaSahayog improve every volunteering experience. Please login to share your experience or view upcoming activities.
          </p>
        </div>
      </section>

      {/* SECTION 2: WHY FEEDBACK MATTERS */}
      <section className="section-padding" id="why-feedback">
        <div className="section-header">
          <h2 className="section-title">Why Your Feedback Matters</h2>
          <p className="section-subtitle">
            Your experience helps us turn every volunteering activity into a better one.
          </p>
        </div>
        
        <div className="feedback-cards">
          <div className="feedback-card">
            <div className="card-icon-wrapper">
              <Ear size={32} />
            </div>
            <h3 className="card-title">LISTEN</h3>
            <p className="card-desc">We listen to what volunteers experienced.</p>
          </div>
          
          <div className="feedback-card">
            <div className="card-icon-wrapper">
              <Lightbulb size={32} />
            </div>
            <h3 className="card-title">LEARN</h3>
            <p className="card-desc">We identify what worked and what needs attention.</p>
          </div>
          
          <div className="feedback-card">
            <div className="card-icon-wrapper">
              <Wrench size={32} />
            </div>
            <h3 className="card-title">IMPROVE</h3>
            <p className="card-desc">We use your feedback to improve future activities.</p>
          </div>
          
          <div className="feedback-card">
            <div className="card-icon-wrapper">
              <TrendingUp size={32} />
            </div>
            <h3 className="card-title">IMPACT</h3>
            <p className="card-desc">Better experiences help create greater community impact.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: ABOUT US */}
      <section className="about-section" id="about">
        <div className="about-content-wrapper">
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              A family gathering sparked a noble idea: dedicating time and effort to the welfare of society. This commitment to uplifting individuals in urban slums led to the creation of the Seva Sahayog Foundation (SSF). Founded in 2005 and formally registered in 2009 as a Section 8 Company under companies Act 2013. SSF is a volunteer-driven organization devoted to empowering socio-economically disadvantaged communities. The organization focuses on key areas such as education, women empowerment, health, environment, rural development, and holistic child development.
            </p>
            <p>
              SSF's mission is to bridge the gap between socially conscious individuals, corporations, and communities in need, fostering meaningful change and sustainable development. By connecting resources to purpose-driven initiatives, SSF enables corporations and individuals to make a lasting impact.
            </p>
            <p>
              Aligned with the United Nations' Sustainable Development Goals (SDGs) and India's NITI Aayog, SSF's initiatives address 16 of the 17 SDGs. Through collaborations with NGOs, corporates, and volunteers, SSF continues its journey of "Celebrating Humanity."
            </p>
          </div>
          <div className="about-diagram" style={{ flex: '1.5' }}>
            <ImpactInfographic />
          </div>
        </div>
      </section>



      {/* SECTION 4: IMPACT STATISTICS */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">30+</span>
            <span className="stat-label">Activities Every Month</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Volunteer Experiences</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">25+</span>
            <span className="stat-label">Corporate Partners</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1</span>
            <span className="stat-label">Shared Mission</span>
          </div>
        </div>
      </section>





      {/* SECTION 9: FOOTER */}
      <Footer />
    </div>
  );
};

export default LandingPage;
