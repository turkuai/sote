import { ReactNode } from 'react';

interface TreeProps {
  children: ReactNode;
}

export default function Tree({ children }: TreeProps) {
  return <div>{children}</div>;
}
