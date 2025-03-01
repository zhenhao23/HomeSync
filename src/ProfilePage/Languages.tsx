import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";


interface LanguagesProps {
  onBack: () => void;
}

const Languages: React.FC<LanguagesProps> = ({ onBack }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const languages = ['English', 'Chinese', 'Bahasa Melayu'];

  return (
    <>
      <div className="container-fluid p-3 pb-2">
        <div className="row align-items-center mb-3">
          <div className="col-4 text-start">
            <button className="btn p-0" onClick={onBack}>
              <FaArrowLeft />
            </button>
          </div>
          <div className="col-4 text-center">
            <h3 className="mb-0">Languages</h3>
          </div>
          <div className="col-4" />
        </div>
      </div>

      <div className="language-options">
        {languages.map((language) => (
          <button
            key={language}
            className={`language-option ${selectedLanguage === language ? 'selected' : ''}`}
            onClick={() => setSelectedLanguage(language)}
          >
            {language}
          </button>
        ))}
      </div>
    </>
  );
};

export default Languages;