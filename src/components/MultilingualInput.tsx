
import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface MultilingualInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const MultilingualInput: React.FC<MultilingualInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Type here...", 
  className = "",
  onKeyDown
}) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'telugu'>('english');
  
  // Telugu characters mapping
  const teluguCharacters = [
    'అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఋ', 'ౠ', 'ఎ', 'ఏ',
    'ఐ', 'ఒ', 'ఓ', 'ఔ', 'క', 'ఖ', 'గ', 'ఘ', 'ఙ', 'చ',
    'ఛ', 'జ', 'ఝ', 'ఞ', 'ట', 'ఠ', 'డ', 'ఢ', 'ణ', 'త',
    'థ', 'ద', 'ధ', 'న', 'ప', 'ఫ', 'బ', 'భ', 'మ', 'య',
    'ర', 'ల', 'వ', 'శ', 'ష', 'స', 'హ', 'ళ', 'క్ష', 'ఱ',
    'ౖ', 'ో', 'ౌ', 'ా', 'ి', 'ీ', 'ు', 'ూ', 'ృ', 'ె', 'ే', '్', '‌', '‍'
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleCharacterClick = (char: string) => {
    onChange(value + char);
  };

  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard);
  };

  const toggleLanguage = () => {
    setSelectedLanguage(selectedLanguage === 'english' ? 'telugu' : 'english');
  };

  return (
    <div className="relative w-full">
      <div className="flex">
        <Input
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={className}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          onClick={toggleKeyboard}
          className="ml-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        >
          {showKeyboard ? "Hide Keyboard" : "Virtual Keyboard"}
        </button>
      </div>
      
      {showKeyboard && (
        <div className="absolute z-50 mt-1 p-2 bg-white shadow-lg rounded-md border w-full max-h-60">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Virtual Keyboard</span>
            <button 
              onClick={toggleLanguage}
              className="text-xs bg-mindease text-white px-2 py-1 rounded"
            >
              {selectedLanguage === 'english' ? 'Switch to Telugu' : 'Switch to English'}
            </button>
          </div>
          
          <ScrollArea className="h-48">
            {selectedLanguage === 'english' ? (
              <div className="grid grid-cols-10 gap-1">
                {Array.from('abcdefghijklmnopqrstuvwxyz1234567890').map((char, index) => (
                  <button
                    key={index}
                    onClick={() => handleCharacterClick(char)}
                    className="p-2 border rounded hover:bg-gray-100"
                  >
                    {char}
                  </button>
                ))}
                <button
                  onClick={() => handleCharacterClick(' ')}
                  className="col-span-10 p-2 border rounded hover:bg-gray-100"
                >
                  Space
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-10 gap-1">
                {teluguCharacters.map((char, index) => (
                  <button
                    key={index}
                    onClick={() => handleCharacterClick(char)}
                    className="p-2 border rounded hover:bg-gray-100"
                  >
                    {char}
                  </button>
                ))}
                <button
                  onClick={() => handleCharacterClick(' ')}
                  className="col-span-10 p-2 border rounded hover:bg-gray-100"
                >
                  Space
                </button>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default MultilingualInput;
