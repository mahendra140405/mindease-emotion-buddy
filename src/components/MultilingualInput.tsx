
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Language keyboard layouts
const languageKeyboards: Record<string, Record<string, string>> = {
  te: {
    'a': 'అ', 'aa': 'ఆ', 'i': 'ఇ', 'ii': 'ఈ',
    'u': 'ఉ', 'uu': 'ఊ', 'e': 'ఎ', 'ee': 'ఏ',
    'o': 'ఒ', 'oo': 'ఓ', 'k': 'క', 'kh': 'ఖ',
    'g': 'గ', 'gh': 'ఘ', 'ch': 'చ', 'j': 'జ',
    't': 'త', 'th': 'థ', 'd': 'ద', 'dh': 'ధ',
    'n': 'న', 'p': 'ప', 'ph': 'ఫ', 'b': 'బ',
    'bh': 'భ', 'm': 'మ', 'y': 'య', 'r': 'ర',
    'l': 'ల', 'v': 'వ', 's': 'స', 'h': 'హ',
  },
  hi: {
    'a': 'अ', 'aa': 'आ', 'i': 'इ', 'ii': 'ई',
    'u': 'उ', 'uu': 'ऊ', 'e': 'ए', 'ai': 'ऐ',
    'o': 'ओ', 'au': 'औ', 'k': 'क', 'kh': 'ख',
    'g': 'ग', 'gh': 'घ', 'ch': 'च', 'chh': 'छ',
    'j': 'ज', 'jh': 'झ', 't': 'त', 'th': 'थ',
    'd': 'द', 'dh': 'ध', 'n': 'न', 'p': 'प',
    'ph': 'फ', 'b': 'ब', 'bh': 'भ', 'm': 'म',
    'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व',
    'sh': 'श', 's': 'स', 'h': 'ह',
  },
  ta: {
    'a': 'அ', 'aa': 'ஆ', 'i': 'இ', 'ii': 'ஈ',
    'u': 'உ', 'uu': 'ஊ', 'e': 'எ', 'ee': 'ஏ',
    'ai': 'ஐ', 'o': 'ஒ', 'oo': 'ஓ', 'au': 'ஔ',
    'k': 'க', 'ng': 'ங', 'ch': 'ச', 'nj': 'ஞ',
    't': 'ட', 'n': 'ண', 'th': 'த', 'nh': 'ந',
    'p': 'ப', 'm': 'ம', 'y': 'ய', 'r': 'ர',
    'l': 'ல', 'v': 'வ', 'zh': 'ழ', 'll': 'ள',
    'lr': 'ற', 'n': 'ன', 'j': 'ஜ', 'sh': 'ஷ',
    's': 'ஸ', 'h': 'ஹ',
  },
};

// Virtual keyboard component
const VirtualKeyboard = ({ language, onKeyClick }: { language: string, onKeyClick: (key: string) => void }) => {
  if (!languageKeyboards[language]) return null;
  
  const keyboard = languageKeyboards[language];
  
  return (
    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md shadow-inner">
      <div className="grid grid-cols-8 gap-1 mb-1">
        {Object.entries(keyboard).slice(0, 16).map(([roman, char]) => (
          <button 
            key={roman} 
            className="text-sm p-1 bg-white dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={() => onKeyClick(char)}
          >
            {char}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1">
        {Object.entries(keyboard).slice(16, 32).map(([roman, char]) => (
          <button 
            key={roman} 
            className="text-sm p-1 bg-white dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={() => onKeyClick(char)}
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
};

interface MultilingualInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  id?: string;
}

const MultilingualInput: React.FC<MultilingualInputProps> = ({
  value,
  onChange,
  placeholder = "Type your message...",
  className = "",
  multiline = false,
  id
}) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [language, setLanguage] = useState<string>("en");
  
  const handleKeyClick = (char: string) => {
    onChange(value + char);
  };
  
  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard);
  };
  
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (newLang !== "en") {
      setShowKeyboard(true);
    } else {
      setShowKeyboard(false);
    }
  };
  
  const InputComponent = multiline ? Textarea : Input;
  
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <InputComponent
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={className}
          />
        </div>
        <div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="te">Telugu</SelectItem>
              <SelectItem value="ta">Tamil</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {language !== "en" && (
          <button 
            className={`p-2 rounded-full ${showKeyboard ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={toggleKeyboard}
          >
            {showKeyboard ? "Hide" : "🌐"}
          </button>
        )}
      </div>
      
      {showKeyboard && language !== "en" && (
        <VirtualKeyboard language={language} onKeyClick={handleKeyClick} />
      )}
    </div>
  );
};

export default MultilingualInput;
