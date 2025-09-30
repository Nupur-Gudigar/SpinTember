import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
return (
    <div className="landing">
        <div className="overlay"></div>
        <div className="content">
            <h1>WELCOME TO YOUR <br /> SEPTEMBER ADVENTURE!</h1>
            <p>
                Ready to embark on a FALL autumn journey? Choose your adventure
                style and let the wheel of fate decide your next exciting challenge!
            </p>
            <Link to="/AdventureSelection">
                <button className="start-btn">START</button>
            </Link>
        </div>
    </div>
);
}
