import React from 'react';
import { BookOpen, Users, TreeDeciduous } from 'lucide-react';
import './ImpactInfographic.css';

const ImpactInfographic = () => {
  return (
    <div className="infographic-container">
      <div className="y-axis-labels">
        <div className="y-label">Individual</div>
        <div className="y-label">Institution</div>
        <div className="y-label">Community</div>
      </div>
      
      <div className="infographic-grid">
        {/* Education Column */}
        <div className="info-column">
          <div className="info-header header-edu">
            <div className="header-icon"><BookOpen size={24} color="white" /></div>
            EDUCATION
          </div>
          <div className="info-cell">
            <ul>
              <li>School Kits – <span className="highlight-blue">5 Lakhs</span> till now</li>
              <li>Scholarships – <span className="highlight-blue">4031 students</span> till now</li>
              <li>Text book lending - 2100 students till now</li>
              <li>Sports Training – <span className="highlight-blue">2 academies 200 students</span></li>
            </ul>
          </div>
          <div className="info-cell">
            <ul>
              <li>School infrastructure repair / development – <span className="highlight-blue">130 schools</span></li>
              <li>WASH Projects – <span className="highlight-blue">20 schools</span></li>
              <li>Science laboratories - <span className="highlight-blue">250 schools</span></li>
            </ul>
          </div>
          <div className="info-cell">
            <ul>
              <li>Community learning centre – <span className="highlight-blue">139 centres, 5550 students / year</span></li>
              <li>Mobile Science laboratories – <span className="highlight-blue">6 vans, 28,000 students / year</span></li>
              <li>Community Knowledge hub – <span className="highlight-blue">5000 students</span></li>
            </ul>
          </div>
        </div>

        {/* Empowerment Column */}
        <div className="info-column">
          <div className="info-header header-emp">
            <div className="header-icon"><Users size={24} color="white" /></div>
            EMPOWERMENT
          </div>
          <div className="info-cell">
            <ul>
              <li>Adolescent girls development center – <span className="highlight-blue">80 centres, 3100 girls / year</span></li>
              <li>Urmi - <span className="highlight-blue">21986</span></li>
            </ul>
          </div>
          <div className="info-cell">
            <ul>
              <li>Women skill development – <span className="highlight-blue">1350 women</span></li>
            </ul>
          </div>
          <div className="info-cell">
            <ul>
              <li>Digital Learning centres – <span className="highlight-blue">3 centres, 450 youth</span></li>
              <li>On field agricultural trainings - <span className="highlight-blue">450 farmers</span> from 15 villages</li>
            </ul>
          </div>
        </div>

        {/* Environment Column */}
        <div className="info-column">
          <div className="info-header header-env">
            <div className="header-icon"><TreeDeciduous size={24} color="white" /></div>
            ENVIRONMENT
          </div>
          <div className="info-cell">
            <ul>
              <li>Biogas plants – <span className="highlight-blue">14 plants</span></li>
              <li>Solar Panels – <span className="highlight-blue">86 Schools</span></li>
            </ul>
          </div>
          <div className="info-cell">
            <ul>
              <li>Rainwater Harvesting system – <span className="highlight-blue">11 locations, 1.25 Crore litre water / year</span></li>
            </ul>
          </div>
          <div className="info-cell">
            <ul>
              <li>Urban Forestation – <span className="highlight-blue">6 sites, 10,100 saplings</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactInfographic;
