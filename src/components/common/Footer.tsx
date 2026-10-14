import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-wrap items-center justify-center space-x-6 text-sm text-gray-600">
            <Link 
              to="/terms" 
              className="hover:text-blue-600 transition-colors"
            >
              {t('footer.termsOfService')}
            </Link>
            <Link 
              to="/privacy" 
              className="hover:text-blue-600 transition-colors"
            >
              {t('footer.privacyPolicy')}
            </Link>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">
              {t('footer.copyright')}
            </p>
            <p className="text-xs text-blue-600 font-medium">
              {t('footer.poweredBy')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;