
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'te', label: 'తెలుగు' }, // Telugu
];

// Virtual keyboards for different languages
const virtualKeyboards: Record<string, string[]> = {
  te: [
    'అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఋ', 'ౠ', 'ఎ', 'ఏ', 'ఐ', 'ఒ', 'ఓ', 'ఔ', 'అం', 'అః',
    'క', 'ఖ', 'గ', 'ఘ', 'ఙ', 'చ', 'ఛ', 'జ', 'ఝ', 'ఞ', 'ట', 'ఠ', 'డ', 'ఢ', 'ణ',
    'త', 'థ', 'ద', 'ధ', 'న', 'ప', 'ఫ', 'బ', 'భ', 'మ', 'య', 'ర', 'ల', 'వ', 'శ', 'ష', 'స', 'హ'
  ],
  hi: [
    'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः',
    'क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण',
    'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'
  ],
};

interface MultilingualInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MultilingualInput: React.FC<MultilingualInputProps> = ({
  value,
  onChange,
  placeholder = 'Type your message...',
  className = '',
  disabled = false,
}) => {
  const [language, setLanguage] = useState('en');
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);

  // Function to insert character at current cursor position
  const insertChar = (char: string) => {
    onChange(value + char);
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={className}
            disabled={disabled}
            onClick={() => setShowVirtualKeyboard(true)}
          />
        </div>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {showVirtualKeyboard && (virtualKeyboards[language]) && (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
          <div className="flex flex-wrap gap-1 max-h-[150px] overflow-y-auto">
            {virtualKeyboards[language].map((char, i) => (
              <button
                key={i}
                className="min-w-[30px] h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
                onClick={() => insertChar(char)}
                type="button"
              >
                {char}
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-2">
            <button
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setShowVirtualKeyboard(false)}
              type="button"
            >
              Close Keyboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultilingualInput;
