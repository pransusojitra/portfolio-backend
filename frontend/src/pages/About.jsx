
import AboutSection from '../components/About/About';
import SkillsSection from '../components/Skills/Skills';
import ExperienceSection from '../components/Experience/Experience';
import ServicesSection from '../components/Services/Services';
import TestimonialsSection from '../components/Testimonials/Testimonials';

const About = () => {
  return (
    <div className="page-wrapper pt-5 pb-5">
      {/* Top Banner padding */}
      <div className="container pt-5 text-center">
        <h1 className="text-gradient fs-1 fw-extrabold mb-2">About Me</h1>
        <div className="title-line mx-auto mb-4" style={{ width: '80px', height: '3px', background: 'var(--color-primary)' }} />
        <p className="text-muted max-width-600 mx-auto">
          Discover my professional background, key technical capabilities, professional career history, and client recommendations.
        </p>
      </div>

      {/* Main Biography Section */}
      <section id="bio" className="section-padding py-4">
        <AboutSection />
      </section>

      {/* Skills Metrics */}
      <section id="skills" className="section-padding py-4 bg-secondary-subtle">
        <SkillsSection />
      </section>

      {/* Career Timeline */}
      <section id="experience" className="section-padding py-5">
        <ExperienceSection />
      </section>

      {/* Services Catalogue */}
      <section id="services" className="section-padding py-5 bg-secondary-subtle">
        <ServicesSection />
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-padding py-5">
        <div className="container">
          <div className="row justify-content-center mb-5 text-center">
            <div className="col-md-8">
              <h2 className="section-title text-gradient fs-2 fw-bold">Client Reviews</h2>
              <div className="title-line mx-auto mb-3" style={{ width: '80px', height: '3px', background: 'var(--color-primary)' }} />
            </div>
          </div>
          <TestimonialsSection />
        </div>
      </section>
    </div>
  );
};

export default About;
