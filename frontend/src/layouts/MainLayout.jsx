import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [scrollWidth, setScrollWidth] = useState(0);
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';
  const hideNavbarFooter = isAdminRoute || isLoginRoute;

  // Scroll Progress logic
  useEffect(() => {
    if (hideNavbarFooter) return;
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollWidth(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideNavbarFooter]);

  // Custom Cursor Glow follow-mouse logic
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      cursor.style.left = `${clientX}px`;
      cursor.style.top = `${clientY}px`;
    };

    window.addEventListener('mousemove', moveCursor);

    // Add event listeners to trigger cursor scale up on interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') || 
        target.classList.contains('interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div className="app-container">
      {/* Scroll Progress Bar */}
      {!hideNavbarFooter && (
        <div className="scroll-progress-container">
          <div 
            className="scroll-progress-bar" 
            style={{ width: `${scrollWidth}%` }}
          />
        </div>
      )}

      {/* Cursor Glow effect */}
      <div 
        ref={cursorRef} 
        className={`cursor-glow ${isHovering ? 'cursor-hover' : ''}`}
      />

      {/* Fixed Navbar */}
      {!hideNavbarFooter && <Navbar />}

      {/* Main Content Area */}
      <main className={hideNavbarFooter ? "admin-layout-wrapper" : "main-content"}>
        {children}
      </main>

      {/* Footer */}
      {!hideNavbarFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
