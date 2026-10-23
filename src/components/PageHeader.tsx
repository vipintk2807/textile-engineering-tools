import type { ReactNode } from 'react';
import { Breadcrumb } from './Breadcrumb';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: readonly { label: string; href?: string }[];
  children?: ReactNode;
}

export function PageHeader({ title, description, breadcrumb, children }: PageHeaderProps) {
  return (
    <header className="page-header">
      {breadcrumb ? <Breadcrumb items={breadcrumb} /> : null}
      <h1>{title}</h1>
      {description ? <p className="page-header__description">{description}</p> : null}
      {children}
    </header>
  );
}
