import { useState, useEffect } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import axios from '../api/axios';
import { useAppContext } from '../context/AppContext';
import Toast from 'react-native-toast-message'

const useCard = () => {
  const { user } = useAppContext();
  const { createPaymentMethod } = useStripe();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cards, setCards] = useState([]);
  const [fetchingCards, setFetchingCards] = useState(false);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Fetch user's cards from server
  const fetchCards = async () => {
    if (!user?.id) return;
    
    setFetchingCards(true);
    setError(null);
    try {
      const res = await axios.get('/cards', {
        params: { userId: user.id }
      });
      
      // Add isDefault flag to each card
      const cardsWithDefault = (res.data.cards || []).map(card => ({
        ...card,
        isDefault: card.id === res.data.default_payment_card_id
      }));
      console.log({card:res.data.cards ,cardsWithDefault, default:res.data.default_payment_card_id})
      setCards(cardsWithDefault);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Card error',
        text2: e?.message || 'Failed to fetch cards'
      });
      return null
    } finally {
      setFetchingCards(false);
    }
  };

  // With CardField, we don't need to pass raw numbers; it reads from native UI
  const addCard = async (_ignored = {}) => {
    setLoading(true);
    try {
      const pmRes = await createPaymentMethod({ paymentMethodType: 'Card' });
      if (pmRes.error) {
        throw new Error(pmRes.error.message || 'Unable to create payment method');
      }
      const paymentMethodId = pmRes.paymentMethod?.id;
      if (!paymentMethodId) throw new Error('Payment method not created');

      const res = await axios.post('/cards/add', {
        userId: user?.id,
        paymentMethodId,
      });
      Toast.show({
        type: 'success',
        text1: 'Card added',
        text2: 'Card added successfully'
      });
      // Refresh cards list after adding
      await fetchCards();
      
      setLoading(false);
      return res.data;
    } catch (e) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Card error',
        text2: e?.message || 'Failed to add card'
      });
      return null
      throw e;
    }
  };

  // Set default card
  const setDefaultCard = async (cardId) => {
    setLoading(true); 
    try {
      console.log({
        userId: user?.id,
        cardId,
      })
      await axios.post('/cards/default', {
        userId: user?.id,
        paymentMethodId:cardId,
      });
      Toast.show({
        type: 'success',
        text1: 'Card set as default',
        text2: 'Card set as default successfully'
      });
      // Refresh cards list after setting default
      await fetchCards();
      
      setLoading(false);
    } catch (e) {
      
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Card error',
        text2: e?.message || 'Failed to set default card'
      });
      return null
      throw e;
    }
  };

  // Charge a card
  const chargeCard = async (cardId, amount, description) => {
    setLoading(true);
    try {
      const res = await axios.post('/cards/charge', {
        userId: user?.id,
        cardId,
        amount,
        description,
      });
      
      setLoading(false);
      return res.data;
    } catch (e) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Card error',
        text2: e?.message || 'Failed to charge card'
      });
      return null
      throw e;
    }
  };

  // Fetch cards on mount
  useEffect(() => {
    fetchCards();
  }, [user?.id]);

  return { 
    addCard, 
    fetchCards, 
    setDefaultCard, 
    chargeCard, 
    cards, 
    loading, 
    fetchingCards, 
    error,
    // Form state
    cardNumber,
    expiry,
    cvv,
    setCardNumber,
    setExpiry,
    setCvv
  };
};

export default useCard;
