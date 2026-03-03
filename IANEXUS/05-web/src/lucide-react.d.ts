declare module 'lucide-react' {
  import { ReactNode } from 'react';
  
  export interface IconProps {
    className?: string;
    size?: number;
    color?: string;
    strokeWidth?: number;
  }

  export const BookOpen: React.FC<IconProps>;
  export const MessageCircle: React.FC<IconProps>;
  export const GraduationCap: React.FC<IconProps>;
  export const Layers3: React.FC<IconProps>;
  export const Sparkles: React.FC<IconProps>;
  export const Instagram: React.FC<IconProps>;
  export const Youtube: React.FC<IconProps>;
  export const Linkedin: React.FC<IconProps>;
}
