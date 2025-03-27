
// Environment variable utilities

// OpenAI API Key
export const getOpenAIApiKey = (): string => {
  return localStorage.getItem('VITE_DEEPSEEK_API_KEY') || '';
};

export const setOpenAIApiKey = (key: string): void => {
  localStorage.setItem('VITE_DEEPSEEK_API_KEY', key);
};

// Transport API credentials
export const getTransportApiAppId = (): string => {
  return localStorage.getItem('VITE_TRANSPORT_API_APP_ID') || '';
};

export const setTransportApiAppId = (id: string): void => {
  localStorage.setItem('VITE_TRANSPORT_API_APP_ID', id);
};

export const getTransportApiKey = (): string => {
  return localStorage.getItem('VITE_TRANSPORT_API_KEY') || '';
};

export const setTransportApiKey = (key: string): void => {
  localStorage.setItem('VITE_TRANSPORT_API_KEY', key);
};

// Initialize environment variables
export const initEnvVariables = (): void => {
  // Only set values if they don't already exist
  if (!localStorage.getItem('VITE_DEEPSEEK_API_KEY')) {
    setOpenAIApiKey('sk-062a1bbc2fe94eac811666fb2cb01156');
  }
  
  if (!localStorage.getItem('VITE_TRANSPORT_API_APP_ID')) {
    setTransportApiAppId('AFO38QUwtecO2Co111LQ');
  }
  
  if (!localStorage.getItem('VITE_TRANSPORT_API_KEY')) {
    setTransportApiKey('21WAzS0X20GflGPPRZeEEwEIQ_R7Y-be2DR_Fopppb4');
  }
};
