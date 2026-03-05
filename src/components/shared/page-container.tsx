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
    <div className={`p-4 bg-background text-foreground rounded-lg sm:rounded-xl mb-3 sm:mb-4 lg:mb-6 ${theme !== "light" ? "border border-border" : ""} shadow-sm`}>
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-2xl font-bold mb-1 sm:mb-2">{title}</h3>
        {subtitle && <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">{subtitle}</p>}
    </div>
    <div className="space-y-4 sm:space-y-6 w-full">{children}</div>
    </>
  );
};

export default PageContainer;
