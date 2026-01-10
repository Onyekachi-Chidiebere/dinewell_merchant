import { useState } from 'react';
import axios from '../api/axios';
import { useAppContext } from '../context/AppContext';
import Toast from 'react-native-toast-message'

const initialState = {
  dish_name: '',
  price: '',
  points_per_dollar: '',
  base_points_per_dish: '',
};

const useDish = () => {
  const { user } = useAppContext();
  const [fields, setFields] = useState(initialState);
  const [dishImage, setDishImage] = useState({ fileName: '', uri: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dishes, setDishes] = useState([]);

  const setField = (name, value) => setFields(prev => ({ ...prev, [name]: value }));

  // Normalize picker input to a single asset { uri, fileName, type }
  const setImage = (input) => {
    const asset = Array.isArray(input) ? input[0] : (input?.assets ? input.assets[0] : input);
    if (!asset) return;
    const normalized = {
      uri: asset.uri || '',
      fileName: asset.fileName || 'dish.jpg',
      type: asset.type || 'image/jpeg',
    };
    setDishImage(normalized);
  };

  const reset = () => {
    setFields(initialState);
    setDishImage({ fileName: '', uri: '', type: '' });
  };

  const fetchDishes = async () => {
    if (!user?.id) return [];
    try {
      const res = await axios.get(`/restaurants/${user.id}/dishes`);
      setDishes(res.data || []);
      return res.data || [];
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Dish error',
        text2: e?.response?.data?.error || 'Failed to fetch dishes'
      });
      return [];
    }
  };

  const createDish = async () => {
    if (!user?.id) throw new Error('Not authenticated');
    setLoading(true);
    try {
      const form = new FormData();
      form.append('restaurant_id', String(user.id));
      form.append('dish_name', fields.dish_name);
      form.append('price', String(fields.price));
      if (fields.points_per_dollar !== '') form.append('points_per_dollar', String(fields.points_per_dollar));
      if (fields.base_points_per_dish !== '') form.append('base_points_per_dish', String(fields.base_points_per_dish));
      if (dishImage?.uri) {
        form.append('dishImage', {
          uri: dishImage.uri,
          name: dishImage.fileName || 'dish.jpg',
          type: dishImage.type || 'image/jpeg',
        });
      }
      const res = await axios.post('/dishes', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLoading(false);
      // refresh list after creation
      await fetchDishes();
      Toast.show({
        type: 'success',
        text1: 'Dish created',
        text2: 'Dish created successfully'
      });
      return res.data;
    } catch (e) {
        console.log({e})
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Dish error',
        text2: e?.response?.data?.error || 'Failed to create dish'
      });
      throw e;
    }
  };

  return { fields, dishImage, setField, setImage, reset, createDish, loading, error, dishes, fetchDishes };
};

export default useDish;
