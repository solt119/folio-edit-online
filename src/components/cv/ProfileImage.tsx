
import React, { useRef } from 'react';
import { Upload, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileImageProps {
  image?: string;
  name: string;
  isEditing: boolean;
  isVisible: boolean;
  onUpdate: (value: string) => void;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  image,
  name,
  isEditing,
  isVisible,
  onUpdate
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUpdate(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="flex justify-center">
      <div 
        className={`relative ${isEditing ? 'cursor-pointer group' : ''}`}
        onClick={handleImageClick}
      >
        <Avatar className="w-32 h-32 mx-auto border-4 border-blue-400">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="bg-slate-700 text-white text-2xl">
            <User className="w-12 h-12" />
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="w-8 h-8 text-white" />
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};
