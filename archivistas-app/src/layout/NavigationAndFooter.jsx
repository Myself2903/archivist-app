import Footer from "../universal/footer/Footer"
import Navbar from "../universal/navbar/Navbar";


const NavigationAndFooter = ({ children, logo_url_redirect="/main_page", show_menu=true}) => {
    return (
        <div>
            <Navbar logo_url_redirect={logo_url_redirect} show_menu={show_menu}/>
            {children}
            <Footer />
        </div>
    )
}

export default NavigationAndFooter;