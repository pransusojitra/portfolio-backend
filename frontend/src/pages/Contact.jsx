import React from 'react';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import ContactForm from '../components/Contact/ContactForm';

const Contact = () => {
  return (
    <div className="page-wrapper pt-5 pb-5">
      {/* Banner */}
      <div className="container pt-5 text-center mb-5">
        <h1 className="text-gradient fs-1 fw-extrabold mb-2">Get In Touch</h1>
        <div className="title-line mx-auto mb-4" style={{ width: '80px', height: '3px', background: 'var(--color-primary)' }} />
        <p className="text-muted max-width-600 mx-auto">
          Want to discuss a project, query API services, or coordinate a consultation? Shoot over a message and let's start chatting!
        </p>
      </div>

      <div className="container text-start">
        <div className="row g-5 align-items-stretch mb-5">
          {/* Left Column: Contact details */}
          <div className="col-lg-5">
            <div className="d-flex flex-column h-100 justify-content-between gap-4">
              {/* Card 1: Email */}
              <div className="contact-info-card glass-card p-4 d-flex gap-3 align-items-center">
                <div className="info-icon-wrapper flex-shrink-0">
                  <FiMail size={22} />
                </div>
                <div>
                  <h4 className="fs-6 text-muted mb-1 fw-bold">EMAIL ADDRESS</h4>
                  <a href="mailto:alex@example.com" className="fs-5 text-white fw-semibold interactive">
                    alex@example.com
                  </a>
                </div>
              </div>

              {/* Card 2: Phone */}
              <div className="contact-info-card glass-card p-4 d-flex gap-3 align-items-center">
                <div className="info-icon-wrapper flex-shrink-0" style={{ background: 'var(--color-secondary-glow)', color: 'var(--color-secondary)' }}>
                  <FiPhone size={22} />
                </div>
                <div>
                  <h4 className="fs-6 text-muted mb-1 fw-bold">PHONE NUMBER</h4>
                  <a href="tel:+15550192834" className="fs-5 text-white fw-semibold interactive">
                    +1 (555) 019-2834
                  </a>
                </div>
              </div>

              {/* Card 3: Location */}
              <div className="contact-info-card glass-card p-4 d-flex gap-3 align-items-center">
                <div className="info-icon-wrapper flex-shrink-0" style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--color-accent)' }}>
                  <FiMapPin size={22} />
                </div>
                <div>
                  <h4 className="fs-6 text-muted mb-1 fw-bold">OFFICE LOCATION</h4>
                  <p className="fs-5 text-white fw-semibold mb-0">
                    San Francisco, California
                  </p>
                </div>
              </div>

              {/* Card 4: Location Map Placeholder */}
              <div className="glass-card flex-grow-1 p-3 d-flex flex-column justify-content-center bg-dark overflow-hidden position-relative" style={{ minHeight: '180px' }}>
                <div className="position-absolute top-0 left-0 w-100 h-100 bg-gradient opacity-20" style={{ background: 'linear-gradient(45deg, var(--color-primary), var(--color-secondary))' }} />
                <h5 className="text-white mb-2 z-index-2 fw-bold text-center">Interactive Map Mockup</h5>
                <p className="text-secondary small text-center mb-0 z-index-2">
                  Map loads here on production staging.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="col-lg-7">
            <ContactForm />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
