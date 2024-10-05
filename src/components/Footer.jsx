import { FaFacebookF, FaXTwitter, FaGithub } from "react-icons/fa6";
import { SiDailydotdev } from "react-icons/si";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="bottom-0 w-full">
      <div className="app-container backdrop-blur-md ">
        <div className="py-10 items-center justify-center justify-items-center gap-3 md:gap-10 grid md:flex">
          <h1 className="font-bold">All rights reserved </h1>
          <p>Fisayo Obadina</p>
          <div className="flex gap-6 items-center">
            <div className="flex gap-2 items-center">
              <Link to="https://www.x.com">
                <FaXTwitter className="md:w-6 md:h-6 w-5 h-5" />
              </Link>
              <Link to="https://www.web.facebook.com">
                <FaFacebookF className="md:w-6 md:h-6 w-5 h-5" />
              </Link>
              <Link to="https://www.github.com">
                <FaGithub className="md:w-6 md:h-6 w-5 h-5" />
              </Link>
              <Link to="https://www.dailydev.app">
                <SiDailydotdev className="md:w-6 md:h-6 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
