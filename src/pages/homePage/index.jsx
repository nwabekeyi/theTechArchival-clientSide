 import ButtonGradient from './assets/svg/ButtonGradient'
import Benefits from './components/Benefits';
import Button from './components/Button';
import Collaboration from './components/Collaboration';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Roadmap from './components/Roadmap';
import Section from './components/Section';
import Services from './components/Services';
import './index.css'

const App = () => {
  return (
    <>
      <div className='pt-[4.75rem] lg:pt-[5.25rem] overflow-x-hidden overflow-y-auto'>
        <Header />
        <Hero />
        <Benefits />
        <Collaboration />
        <Services />
        <About />
        <Roadmap />
        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
