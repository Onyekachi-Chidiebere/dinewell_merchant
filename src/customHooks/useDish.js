import { useState } from 'react';
import axios from '../api/axios';
import { useAppContext } from '../context/AppContext';
import Toast from 'react-native-toast-message';

const initialState = {
  dish_name: '',
  price: '',
  points_per_dollar: '',
  base_points_per_dish: '',
};

const useDish = () => {
  const { user } = useAppContext();
  const [fields, setFields] = useState(initialState);
  const [dishImage, setDishImage] = useState({
    fileName: '',
    uri: '',
    type: '',
    base64: '',
  });
  const [editingDishId, setEditingDishId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [activeDishes, setActiveDishes] = useState('0');
  const [searchQuery, setSearchQuery] = useState('');

  const setField = (name, value) => setFields((prev) => ({ ...prev, [name]: value }));

  const setImage = (input) => {
    const asset = Array.isArray(input) ? input[0] : input?.assets ? input.assets[0] : input;
    if (!asset) return;
    setDishImage({
      uri: asset.uri || '',
      fileName: asset.fileName || 'dish.jpg',
      type: asset.type || 'image/jpeg',
      base64: asset.base64 || '',
    });
  };

  const reset = () => {
    setFields(initialState);
    setDishImage({ fileName: '', uri: '', type: '', base64: '' });
    setEditingDishId(null);
  };

  const loadDishForEdit = (dish) => {
    if (!dish) return;
    setEditingDishId(dish.id);
    setFields({
      dish_name: dish.dish_name || '',
      price: dish.price != null ? String(dish.price) : '',
      points_per_dollar:
        dish.points_per_dollar != null ? String(dish.points_per_dollar) : '',
      base_points_per_dish:
        dish.base_points_per_dish != null ? String(dish.base_points_per_dish) : '',
    });
    setDishImage({
      fileName: dish.dish_image_url ? 'Current image' : '',
      uri: dish.dish_image_url || '',
      type: 'image/jpeg',
      base64: '',
    });
  };

  const fetchDishes = async () => {
    if (!user?.id) return [];
    try {
      const res = await axios.get(`/restaurants/${user.id}/dishes/${searchQuery}`);
      setDishes(res.data.dishes || []);
      setActiveDishes(res.data.activeDishes);
      return res.data.dishes || [];
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Dish error',
        text2: e?.response?.data?.error || 'Failed to fetch dishes',
      });
      return [];
    }
  };

  const buildImagePayload = () => {
    if (!dishImage?.base64) return undefined;
    return {
      base64: dishImage.base64,
      fileName: dishImage.fileName || 'dish.jpg',
      type: dishImage.type || 'image/jpeg',
    };
  };

  const createDish = async () => {
    if (!user?.id) throw new Error('Not authenticated');
    if (!fields.dish_name?.trim()) throw new Error('Dish name is required');
    if (fields.price === '' || fields.price == null) throw new Error('Dish price is required');

    setLoading(true);
    setError(null);
    try {
      const payload = {
        restaurant_id: String(user.id),
        dish_name: fields.dish_name.trim(),
        price: String(fields.price),
      };
      if (fields.points_per_dollar !== '') {
        payload.points_per_dollar = String(fields.points_per_dollar);
      }
      if (fields.base_points_per_dish !== '') {
        payload.base_points_per_dish = String(fields.base_points_per_dish);
      }
      const image = buildImagePayload();
      if (image) payload.dishImage = image;

      const res = await axios.post('/dishes/base64', payload, { timeout: 120000 });
      await fetchDishes();
      Toast.show({
        type: 'success',
        text1: 'Dish created',
        text2: 'Dish created successfully',
      });
      return res.data;
    } catch (e) {
      console.log('createDish error', e?.response?.data || e?.message || e);
      setError(e);
      Toast.show({
        type: 'error',
        text1: 'Dish error',
        text2: e?.response?.data?.error || e?.message || 'Failed to create dish',
      });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateDish = async () => {
    if (!user?.id) throw new Error('Not authenticated');
    if (!editingDishId) throw new Error('No dish selected to edit');
    if (!fields.dish_name?.trim()) throw new Error('Dish name is required');
    if (fields.price === '' || fields.price == null) throw new Error('Dish price is required');

    setLoading(true);
    setError(null);
    try {
      const payload = {
        restaurant_id: String(user.id),
        dish_name: fields.dish_name.trim(),
        price: String(fields.price),
      };
      if (fields.points_per_dollar !== '') {
        payload.points_per_dollar = String(fields.points_per_dollar);
      }
      if (fields.base_points_per_dish !== '') {
        payload.base_points_per_dish = String(fields.base_points_per_dish);
      }
      const image = buildImagePayload();
      if (image) payload.dishImage = image;

      const res = await axios.put(`/dishes/${editingDishId}/base64`, payload, {
        timeout: 120000,
      });
      await fetchDishes();
      Toast.show({
        type: 'success',
        text1: 'Dish updated',
        text2: 'Changes saved successfully',
      });
      return res.data;
    } catch (e) {
      console.log('updateDish error', e?.response?.data || e?.message || e);
      setError(e);
      Toast.show({
        type: 'error',
        text1: 'Dish error',
        text2: e?.response?.data?.error || e?.message || 'Failed to update dish',
      });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const saveDish = async () => {
    if (editingDishId) return updateDish();
    return createDish();
  };

  const setDishStatus = async (dishId, status) => {
    if (!user?.id) throw new Error('Not authenticated');
    setLoading(true);
    try {
      const res = await axios.patch(`/dishes/${dishId}/status`, {
        restaurant_id: String(user.id),
        status,
      });
      await fetchDishes();
      Toast.show({
        type: 'success',
        text1: status === 'paused' ? 'Dish paused' : 'Dish resumed',
        text2:
          status === 'paused'
            ? 'This dish is hidden from active offerings'
            : 'This dish is active again',
      });
      return res.data;
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Dish error',
        text2: e?.response?.data?.error || e?.message || 'Failed to update dish status',
      });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const pauseDish = (dishId) => setDishStatus(dishId, 'paused');
  const resumeDish = (dishId) => setDishStatus(dishId, 'active');

  return {
    activeDishes,
    setActiveDishes,
    fields,
    dishImage,
    setField,
    setImage,
    reset,
    loadDishForEdit,
    editingDishId,
    createDish,
    updateDish,
    saveDish,
    pauseDish,
    resumeDish,
    setDishStatus,
    loading,
    error,
    dishes,
    fetchDishes,
    searchQuery,
    setSearchQuery,
  };
};

export default useDish;
