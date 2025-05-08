import { useTranslation } from "react-i18next";

import { useEffect } from "react";

// import flag icons
import { hasFlag } from 'country-flag-icons'

import { Select, SelectItem, SelectValue, SelectTrigger, SelectContent } from "../ui/select";
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);    
  };

  useEffect(() => {
    console.log(i18n.language);
  }, [i18n.language]);
  return (
    <Select onValueChange={handleLanguageChange} defaultValue={i18n.language}>
      <SelectTrigger >
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">
            {hasFlag('US') && <img src={`https://flagcdn.com/w40/us.png`} alt="US" />}
        </SelectItem>
        <SelectItem value="fr">
            {hasFlag('FR') && <img src={`https://flagcdn.com/w40/fr.png`} alt="FR" />}
        </SelectItem>
        <SelectItem value="he">
            {hasFlag('IL') && <img src={`https://flagcdn.com/w40/il.png`} alt="IL" />}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
