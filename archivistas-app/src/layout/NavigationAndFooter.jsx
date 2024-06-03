import Footer from "../universal/footer/Footer"
import Navbar from "../universal/navbar/Navbar";


const NavigationAndFooter = ({ children }) => {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}

export default NavigationAndFooter;