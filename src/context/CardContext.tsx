import React, { createContext, useContext, ReactNode } from 'react';
import useCard from '../customHooks/useCard';

interface CardContextType {
  // Card form state
  cardNumber: string;
  expiry: string;
  cvv: string;
  setCardNumber: (value: string) => void;
  setExpiry: (value: string) => void;
  setCvv: (value: string) => void;
  
  // Card operations
  addCard: (cardDetails?: any) => Promise<void>;
  fetchCards: () => Promise<void>;
  setDefaultCard: (cardId: string) => Promise<void>;
  chargeCard: (cardId: string, amount: number, description: string) => Promise<void>;
  
  // Cards list and state
  cards: any[];
  loading: boolean;
  fetchingCards: boolean;
  error: string | null;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

interface CardProviderProps {
  children: ReactNode;
}

export const CardProvider: React.FC<CardProviderProps> = ({ children }) => {
  const cardHook = useCard();

  return (
    <CardContext.Provider value={cardHook}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = (): CardContextType => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
};

export default CardContext;
