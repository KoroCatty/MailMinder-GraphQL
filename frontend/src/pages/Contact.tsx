// import { Helmet } from "react-helmet";

// Components
import ContactForms from "../components/features/contact/ContactForms";



const Contact = () => {
  return (
    <>
      {/* < Helmet>
          <meta charSet="utf-8" />
          <title>Contact page</title>
           <link rel="canonical" href="http://http://localhost:5173/about" />
       </Helmet> */}

      <main className='fadeIn1' >
        <ContactForms />
      </main>
    </>
  )
}

export default Contact