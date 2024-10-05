import { useEffect } from "react";
import { Button, Header, Footer } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import img from "../../assets/no_friends.svg";
const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/chats");
    }
  }, [user, navigate]);
  return (
    <div className="grid h-[100vh] pt-[6.9rem]">
      <Header />
      <div className="app-container">
        <div className="grid justify-items-center place-items-center h-full px-4 md:px-10">
          <div className="mx-auto  md:w-4/5 gap-4 grid text-center justify-items-center">
            <h2 className="text-4xl md:text-5xl font-bold">
              Where Connections Spark and Conversations Thrive!
            </h2>
            <p className="text-1xl">
              Get in touch with your friends and families from any distance.
            </p>
            <div className="flex gap-5">
              <Link to="/signup">
                <Button styles="app-dark-text-color ">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button styles="bg-transparent hover:bg-slate-900 border-2 border-slate-200 app-text-color ">Login</Button>
              </Link>
            </div>
            <div className="my-5 w-full grid justify-items-center h-[20rem] md:h-[40rem] ">
              <div className="grid w-[80%] bg-slate-800 rounded-3xl p-5 shadow-2xl overflow-hidden place-items-center justify-items-center">
                <img src={img} alt="" draggable={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
