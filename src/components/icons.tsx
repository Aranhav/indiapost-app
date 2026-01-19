import { Check, CloudUpload, Gift, Building2 } from 'lucide-react';

// Re-export Lucide icons with consistent styling
export { Check, CloudUpload, Gift, Building2 };

// Icon wrapper components for common use cases
export const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <Check className={className} />
);

export const UploadIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <CloudUpload className={className} />
);

export const GiftIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <Gift className={className} />
);

export const BuildingIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <Building2 className={className} />
);
