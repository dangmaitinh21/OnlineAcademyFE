import React from "react";
import "../../components/footer/footer.css";

function Footer() {
  return (
    <div className="footer">
      <div className="upperDiv">
        <div className="linksContainer">
          <div className="linksDiv linksDiv1">
            <p>Online Academy for Business</p>
            <p>Teach on Online Academy</p>
            <p>Get the app</p>
            <p>About us</p>
            <p>Contact us</p>
          </div>
          <div className="linksDiv linksDiv2">
            <p>Careers</p>
            <p>Blog</p>
            <p>Help and Support</p>
            <p>Affliate</p>
            <p> </p>
          </div>
          <div className="linksDiv linksDiv3">
            <p>Terms</p>
            <p>Privacy policy and cookie policy</p>
            <p>Sitemap</p>
            <p>Featured courses</p>
            <p> </p>
          </div>
        </div>
        <div className="linksDiv linksDiv4"></div>
      </div>
      <div className="lowerDiv">
        <img src="..//logo.png" className="udemyLogo" alt="logo"></img>
        <div className="copyrightDiv">
          <p>© 2020 Online Academy, Inc.</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
