import { useState } from 'react';
import axios from '../api/axios';
import Toast from 'react-native-toast-message'
const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const [merchantId, setMerchantId] = useState(null);
    const [restaurantDetails, setRestaurantDetails] = useState({
        name: '',
        phone: '',
        email: '',
        location: '',
        password: '',
        streetNumber: '',
        streetName: '',
        area: '',
        logo: {uri:'', fileName:''},
        images: [{uri:''}, {uri:''}, {uri:''}, {uri:''}],
        card: {},
    });

    const handleRestaurantDetails = ({ name, value }) =>
        setRestaurantDetails((prev) => ({ ...prev, [name]: value }));

    // Set/replace image at a specific index (0-3)
    const setImageAtIndex = (index, image) =>
        setRestaurantDetails((prev) => {
            const newImages = [...prev.images];
            newImages[index] = image;
            return { ...prev, images: newImages };
        });

    // Remove image by index
    const removeImage = (index) =>
        setRestaurantDetails((prev) => {
            const newImages = [...prev.images];
            newImages[index] = null;
            return { ...prev, images: newImages };
        });

    // Set card details
    const setCard = (card) =>
        setRestaurantDetails((prev) => ({ ...prev, card }));

    // --- API Calls ---
    const submitDetails = async () => {
        setLoading(true);
        try {
            const { name, phone, email, location, password } = restaurantDetails;
            const res = await axios.post('/merchant/signup/details', { name, phone, email, location, password });
            setMerchantId(res.data.merchantId);
            setLoading(false);
            return res.data.merchantId;
        } catch (err) {
            setLoading(false);  
            Toast.show({
                type: 'error',
                text1: 'Signup error',
                text2: err?.response?.data?.error || 'Failed to submit details'
            });
            return null
        }
    };

    const submitAddress = async () => {
        setLoading(true);
        try {
            const { streetNumber, streetName, area } = restaurantDetails;
            const res = await axios.post('/merchant/signup/address', { merchantId, streetNumber, streetName, area });
            setLoading(false);
            return res.data;
        } catch (err) {
            setLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Signup error',
                text2: err?.response?.data?.error || 'Failed to submit address'
            });
            throw err;
            return null
        } finally {
            setLoading(false);
        }
    };

    const submitPictures = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('merchantId', merchantId);
            if (restaurantDetails.logo) {
                formData.append('logo', {
                    uri: restaurantDetails.logo.uri,
                    name: restaurantDetails.logo.fileName || 'logo.jpg',
                    type: restaurantDetails.logo.type || 'image/jpeg',
                });
            }
            restaurantDetails.images.forEach((img, idx) => {
                if (img) {
                    formData.append('restaurantImages', {
                        uri: img.uri,
                        name: img.fileName || `image${idx}.jpg`,
                        type: img.type || 'image/jpeg',
                    });
                }
            });
            const res = await axios.post('/merchant/signup/pictures', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setLoading(false);
            return res.data;
        } catch (err) {
            setLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Signup error',
                text2: err?.response?.data?.error || 'Failed to submit pictures'
            });
            return null
        } finally {
            setLoading(false);
        }
    };

    // For RestaurantPictures: custom handlers for image picking
    const handleLogoPick = (image) => handleRestaurantDetails({ name: 'logo', value: image });
    const handleAddPicture = (index, image) => setImageAtIndex(index, image);

    return {
        loading,
        restaurantDetails,
        handleRestaurantDetails,
        setImageAtIndex,
        removeImage,
        setCard,
        setLoading,
        setRestaurantDetails,
        merchantId,
        submitDetails,
        submitAddress,
        submitPictures,
        handleLogoPick,
        handleAddPicture,
    };
};
export default useSignup;