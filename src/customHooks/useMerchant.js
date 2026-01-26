import { useState } from 'react';
import axios from '../api/axios';
import Toast from 'react-native-toast-message';

const useMerchant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get merchant profile
  const getProfile = async (userId) => {
    try {
      // For now, we'll use the login response data
      // In the future, you might want to create a dedicated profile endpoint
      const response = await axios.get(`/merchant/restaurants/${userId}`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to get profile';
      Toast.show({
        type: 'error',
        text1: 'Profile error',
        text2: errorMessage
      });
      return null;
    }
  };

  // Update merchant profile
  const updateProfile = async (userId, profileData, imageFile) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      // If there's an image file, use FormData
      if (imageFile) {
        const formData = new FormData();
        
        // Extract file info from image picker response
        const fileUri = imageFile.uri;
        const fileType = imageFile.type || imageFile.mime || 'image/jpeg';
        const fileName = imageFile.fileName || imageFile.uri?.split('/').pop() || `profile-${Date.now()}.jpg`;
        
        // Add image file (React Native FormData format)
        formData.append('profileImage', {
          uri: fileUri,
          type: fileType,
          name: fileName,
        });
        
        // Add other fields
        if (profileData.name) formData.append('name', profileData.name);
        if (profileData.email) formData.append('email', profileData.email);
        if (profileData.phone) formData.append('phone', profileData.phone);
        if (profileData.restaurantName) formData.append('restaurantName', profileData.restaurantName);
        if (profileData.dateOfBirth) formData.append('dateOfBirth', profileData.dateOfBirth);
        if (profileData.gender) formData.append('gender', profileData.gender);
        
       
        response = await axios.put(`/merchant/profile/${userId}`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: (data, headers) => {
            // Don't transform FormData, let React Native handle it
            if (data instanceof FormData) {
              return data;
            }
            return data;
          },
        });
      } else {
        // Regular JSON request
        response = await axios.put(`/merchant/profile/${userId}`, profileData);
      }
      
      setLoading(false);
      return response.data;
    } catch (err) {
      console.log('Update profile error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setLoading(false);
      setError(err.response?.data?.error || err.message || 'Profile update failed');
      Toast.show({
        type: 'error',
        text1: 'Profile error',
        text2: err.response?.data?.error || err.message || 'Profile update failed'
      });
      throw err;
    }
  };

  return { getProfile, updateProfile, loading, error };
};

export default useMerchant;
