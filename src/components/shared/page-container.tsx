import React from 'react';
import { useTheme } from './theme-provider';


interface PageContainerProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, subtitle, children }) => {
    const { theme } = useTheme();

  return (
    <>
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-12 rounded-lg sm:rounded-xl mb-6 shadow-lg">
        <h3 className="text-4xl font-black text-white drop-shadow-lg mb-2">{title}</h3>
        {subtitle && <p className="text-lg text-blue-100 font-medium drop-shadow">{subtitle}</p>}
    </div>
    <div className="space-y-4 sm:space-y-6 w-full">{children}</div>
    </>
  );
};

export default PageContainer;
