import { useState } from 'react';
import { cn } from '@/lib/utils';
import React from 'react'; // 添加这行

type TabValue = string;

interface TabsProps {
  defaultValue?: TabValue;
  children: React.ReactNode;
  className?: string;
}

interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabProps {
  value: TabValue;
  children: React.ReactNode;
  className?: string;
}

interface TabPanelProps {
  value: TabValue;
  children: React.ReactNode;
  className?: string;
}

// 创建上下文
const TabsContext = React.createContext<{
  value: TabValue;
  onValueChange: (value: TabValue) => void;
} | undefined>(undefined);

export function Tabs({ defaultValue = '1', children, className }: TabsProps) {
  const [value, setValue] = useState<TabValue>(defaultValue);

  const onValueChange = (newValue: TabValue) => {
    setValue(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children, className }: TabListProps) {
  return (
    <div className={cn('flex border-b border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
}

export function Tab({ value, children, className }: TabProps) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('Tab must be used within a Tabs component');
  }

  const { value: activeValue, onValueChange } = context;
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn(
        'py-4 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
        isActive
          ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
          : 'border-transparent hover:text-gray-500 hover:border-gray-300 dark:hover:text-gray-400',
        'border-b-2 -mb-px',
        className
      )}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('TabPanel must be used within a Tabs component');
  }

  const { value: activeValue } = context;
  const isActive = activeValue === value;

  if (!isActive) {
    return null;
  }

  return (
    <div role="tabpanel" className={cn('mt-4', className)}>
      {children}
    </div>
  );
}