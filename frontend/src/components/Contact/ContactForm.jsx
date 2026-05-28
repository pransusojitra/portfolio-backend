import React, { useState } from 'react';
import apiService from '../../services/api';
import ToastNotification from '../Common/ToastNotification';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        tempErrors.email = 'Please provide a valid email address';
      }
    }

    if (formData.phone.trim() && !/^[0-9+\-()\s.]+$/.test(formData.phone)) {
      tempErrors.phone = 'Please provide a valid phone number';
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await apiService.submitContact(formData);
      if (response.success) {
        setToast({
          show: true,
          message: 'Thank you! Your message was sent successfully.',
          type: 'success'
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        throw new Error(response.message || 'Something went wrong');
      }
    } catch (err) {
      setToast({
        show: true,
        message: err.message || 'Failed to send message. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-wrapper glass-card p-4 p-md-5">
      <h3 className="mb-4 text-gradient">Send a Message</h3>
      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="mb-3 text-start">
          <label htmlFor="name" className="form-label text-secondary small fw-semibold">
            YOUR NAME
          </label>
          <input
            type="text"
            className={`form-control bg-dark border-secondary text-white ${errors.name ? 'is-invalid border-danger' : ''}`}
            style={{ backgroundColor: 'rgba(15,23,42,0.4) !important', color: '#fff' }}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        {/* Email */}
        <div className="mb-3 text-start">
          <label htmlFor="email" className="form-label text-secondary small fw-semibold">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            className={`form-control bg-dark border-secondary text-white ${errors.email ? 'is-invalid border-danger' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="johndoe@example.com"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        {/* Phone */}
        <div className="mb-3 text-start">
          <label htmlFor="phone" className="form-label text-secondary small fw-semibold">
            PHONE NUMBER (OPTIONAL)
          </label>
          <input
            type="tel"
            className={`form-control bg-dark border-secondary text-white ${errors.phone ? 'is-invalid border-danger' : ''}`}
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 019-2834"
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        {/* Subject */}
        <div className="mb-3 text-start">
          <label htmlFor="subject" className="form-label text-secondary small fw-semibold">
            SUBJECT (OPTIONAL)
          </label>
          <input
            type="text"
            className="form-control bg-dark border-secondary text-white"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Project Collaboration"
          />
        </div>

        {/* Message */}
        <div className="mb-4 text-start">
          <label htmlFor="message" className="form-label text-secondary small fw-semibold">
            YOUR MESSAGE
          </label>
          <textarea
            className={`form-control bg-dark border-secondary text-white ${errors.message ? 'is-invalid border-danger' : ''}`}
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project needs..."
          />
          {errors.message && <div className="invalid-feedback">{errors.message}</div>}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="btn-premium w-100 d-flex align-items-center justify-content-center gap-2 interactive"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              Sending Message...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>

      {/* Toast popup */}
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default ContactForm;
