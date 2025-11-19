import React from 'react';
import Header from './Header';
import Footer from './Footer';
import NotificationToast from '../ui/common/NotificationToast';

interface PublicLayoutProps {
  children: React.ReactNode; 
  showFooter?: boolean;
}

function PublicLayout({ children, showFooter = true }: PublicLayoutProps) {
  return (
    <div className="public-layout-container">
      <Header />
      <NotificationToast />
      <main className='pt-28' style={{minHeight: '80vh'}}>
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

export default PublicLayout;