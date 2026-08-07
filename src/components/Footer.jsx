import React from 'react';

function Footer({ onExploreClick, exploreText }) {
  const isConnect = exploreText === "BACK TO TOP";
  return (
    <footer className="footer">
      <div className="footer-left"></div>
      <button className="footer-center-btn" onClick={onExploreClick}>
        {exploreText || "SCROLL TO EXPLORE"}
      </button>
      <div className="footer-right">
        {!isConnect && (
          <a href="mailto:shubham.panwar.dev@gmail.com" className="email-link">EMAIL US</a>
        )}
      </div>
    </footer>
  );
}

export default Footer;
