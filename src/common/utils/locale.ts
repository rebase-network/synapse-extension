export const getDefaultLanguage = (): string => {
  const languages = ['en', 'zh'];
  const language = localStorage.getItem('language') || navigator.language.split(/[-_]/)[0];

  if (!languages.includes(language)) {
    return 'en'; // default english
  }

  return language;
};
