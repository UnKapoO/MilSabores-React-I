import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode; 
  showFooter?: boolean;
}

function PublicLayout({ children, showFooter = true }: PublicLayoutProps) {
  return (
    // Este <div> es CRÍTICO para la solución
    <div className="public-layout-container">
      <Header />
      
      <main className='pt-28' style={{minHeight: '80vh'}}>
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

export default PublicLayout;