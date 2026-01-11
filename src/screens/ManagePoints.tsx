import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ViewStyle, TextInput, Pressable, FlatList, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import GreyBackground from '../assets/icons/grey-background.svg';
import typography from '../theme/typography';
import ChevronDownIcon from '../assets/icons/ChevronDownIcon';
import ChevronUpDownIcon from '../assets/icons/ChevronUpDownIcon';
import LinearGradient from 'react-native-linear-gradient';
import { PointShareIcon as PointsIcon } from '../assets/icons';
import { ManagePointsNavigationProp } from '../types/navigation';
import { useDishContext } from '../context/DishContext';
import { useBottomSheet } from '../context/BottomSheetContext';
import { useAppContext } from '../context/AppContext';
import axios from '../api/axios';
import Toast from 'react-native-toast-message';


// Define types for order items
interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    points: number;
    isCustom: boolean;
    imageUrl?: string;
}

const ManagePoints = ({ route }: { route: { params: { type: string } } }) => {
    const navigation = useNavigation<ManagePointsNavigationProp>();
    const { type } = route.params;
    const { dishes, fetchDishes } = useDishContext();
    const { openDishSheet } = useBottomSheet();
    const { user } = useAppContext();

    // Points rate state - fetched from server
    const [pointsRate, setPointsRate] = useState<{ issue: number; redeem: number }>({
        issue: 0, // Default fallback
        redeem: 0 // Default fallback
    });
    const [loadingPointsRate, setLoadingPointsRate] = useState(true);

    // Local state for dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDish, setSelectedDish] = useState<any>(null);
    const [dishQuantity, setDishQuantity] = useState('1');

    // Order management state
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Custom item state
    const [customItemName, setCustomItemName] = useState('');
    const [customItemPrice, setCustomItemPrice] = useState('');

    // Loading state for API calls
    const [isCreatingPoints, setIsCreatingPoints] = useState(false);

    // Filter dishes based on search query and limit to 5 items
    const filteredDishes = searchQuery.trim() === ''
        ? []
        : dishes.filter(dish =>
            dish.dish_name.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);

    // Calculate totals when order items change
    useEffect(() => {
        const totalPts = orderItems.reduce((sum, item) => sum + (item.points * item.quantity), 0);
        const totalPrc = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPoints(totalPts);
        setTotalPrice(totalPrc);
    }, [orderItems]);

    // Fetch dishes on mount
    useEffect(() => {
        fetchDishes();
    }, []);

    // Fetch points rate from server on mount
    useEffect(() => {
        const fetchPointsRate = async () => {
            try {
                setLoadingPointsRate(true);
                const response = await axios.get('/rate');
                setPointsRate(response.data);
            } catch (error: any) {
                console.error('Error fetching points rate:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.response?.data?.error || 'Failed to fetch points rate'
                });
                // Keep default values on error
            } finally {
                setLoadingPointsRate(false);
            }
        };

        fetchPointsRate();
    }, []);

    // Helper function to calculate points based on price
    const calculatePointsFromPrice = (price: number): number => {
        const rate = pointsRate[type.toLowerCase() as 'issue' | 'redeem'];
        return Math.round(price * rate);
    };

    // Helper functions
    const addDishToOrder = () => {
        if (!selectedDish) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please select a dish first'
            });
            return;
        }

        const quantity = parseInt(dishQuantity) || 1;
        const dishPrice = parseFloat(selectedDish.price);
        const calculatedPoints = calculatePointsFromPrice(dishPrice);

        const newItem: OrderItem = {
            id: `dish_${selectedDish.id}_${Date.now()}`,
            name: selectedDish.dish_name,
            price: dishPrice,
            quantity: quantity,
            points: calculatedPoints,
            isCustom: false,
            imageUrl: selectedDish.dish_image_url
        };

        setOrderItems(prev => [...prev, newItem]);
        setSelectedDish(null);
        setSearchQuery('');
        setDishQuantity('1');
        setIsDropdownOpen(false);
    };

    const addCustomItemToOrder = () => {
        if (!customItemName.trim() || !customItemPrice.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please fill in item name and price'
            });
            return;
        }

        const itemPrice = parseFloat(customItemPrice);
        const calculatedPoints = calculatePointsFromPrice(itemPrice);

        const newItem: OrderItem = {
            id: `custom_${Date.now()}`,
            name: customItemName.trim(),
            price: itemPrice,
            quantity: 1,
            points: calculatedPoints,
            isCustom: true
        };

        setOrderItems(prev => [...prev, newItem]);
        setCustomItemName('');
        setCustomItemPrice('');
    };

    const removeOrderItem = (itemId: string) => {
        setOrderItems(prev => prev.filter(item => item.id !== itemId));
    };

    const updateItemQuantity = (itemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeOrderItem(itemId);
            return;
        }

        setOrderItems(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleDishSelect = (dish: any) => {
        setSelectedDish(dish);
        setSearchQuery(dish.dish_name);
        setIsDropdownOpen(false);
    };

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        if (text !== selectedDish?.dish_name) {
            setSelectedDish(null);
        }
        // Only open dropdown if user is typing
        setIsDropdownOpen(text.trim() !== '');
    };

    // Create points transaction via API
    const createPointsTransaction = async () => {
        if (!user?.id) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'User not authenticated'
            });
            return;
        }

        setIsCreatingPoints(true);
        try {
            const requestData = {
                restaurantId: user.id,
                type: type.toLowerCase(), // 'issue' or 'redeem'
                dishes: orderItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    points: item.points
                })),
                totalPrice: totalPrice,
                notes: `Points ${type} transaction`
            };
            const response = await axios.post('/points', requestData);
            const { points } = response.data;

            // Navigate to QR code screen with the QR code
            navigation.navigate('QrCode', {
                type: type,
                orderItems: orderItems,
                totalPrice: totalPrice,
                totalPoints: totalPoints,
                qrCode: points.qr_code,
                pointsId: points.id
            });

        } catch (error: any) {
            console.error('Error creating points transaction:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.error || 'Failed to create points transaction'
            });
        } finally {
            setIsCreatingPoints(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                style={{flex:1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
            <BackButton />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.iconCircle}>
                            <LinearGradient
                                style={styles.iconGradient}

                                start={{ x: 0.25, y: 0.25 }}
                                end={{ x: 0.5, y: 2 }}
                                locations={[0, 0.95]}
                                colors={[colors.background.default, colors.border.subtle]}
                            >
                                <PointsIcon width={56} height={56} color={colors.primary.main} />
                            </LinearGradient>
                        </View>
                        <Text style={styles.title}>{type} Points</Text>
                        <Text style={styles.subTitle}>Follow the instructions below</Text>

                    </View>
                    <View style={styles.instructionContainer}>
                        <Text style={styles.instruction}>1. Select dishes and quantities or add custom items</Text>
                        <Text style={styles.instruction}>2. Review your order and total points</Text>
                        <Text style={styles.instruction}>3. Create QR code for customer to scan</Text>
                        <Text style={styles.instruction}>4. Customer scans to complete process</Text>
                    </View>


                    {/* Dish Selection */}
                    <View style={styles.sectionTitle}>
                        <Text style={styles.sectionTitleText}>Add Dishes</Text>
                    </View>

                    <View style={styles.dropdownContainer}>
                        <View style={styles.customInputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Search dishes..."
                                placeholderTextColor={colors.text.secondary}
                                value={searchQuery}
                                onChangeText={handleSearchChange}
                                onFocus={() => {
                                    if (searchQuery.trim() !== '') {
                                        setIsDropdownOpen(true);
                                    }
                                }}
                            />
                            <Pressable
                                style={styles.iconContainer}
                                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <ChevronDownIcon />
                            </Pressable>
                        </View>

                        {isDropdownOpen && (
                            <View style={styles.dropdown}>
                                {filteredDishes.length > 0 ? (
                                    <FlatList
                                        data={filteredDishes}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.dropdownItem}
                                                onPress={() => handleDishSelect(item)}
                                            >
                                                <Image
                                                    source={{ uri: item.dish_image_url }}
                                                    style={styles.dishImage}
                                                />
                                                <View style={styles.dishInfo}>
                                                    <Text style={styles.dishName}>{item.dish_name}</Text>
                                                    <Text style={styles.dishPrice}>${item.price}</Text>
                                                    <Text style={styles.dishPoints}>{calculatePointsFromPrice(parseFloat(item.price))} points</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        style={styles.dropdownList}
                                        showsVerticalScrollIndicator={false}
                                    />
                                ) : (
                                    <View style={styles.noResultsContainer}>
                                        <Text style={styles.noResultsText}>No dishes found</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Selected Dish Display */}
                    {selectedDish && (
                        <View style={styles.selectedDishContainer}>
                            <View style={styles.selectedDishCard}>
                                <Image
                                    source={{ uri: selectedDish.dish_image_url }}
                                    style={styles.selectedDishImage}
                                />
                                <View style={styles.selectedDishInfo}>
                                    <Text style={styles.selectedDishName}>{selectedDish.dish_name}</Text>
                                    <Text style={styles.selectedDishPrice}>${selectedDish.price}</Text>
                                    <Text style={styles.selectedDishPoints}>{calculatePointsFromPrice(parseFloat(selectedDish.price))} points</Text>
                                </View>
                            </View>

                            <View style={styles.quantityAndAddContainer}>
                                <View style={styles.customInputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Quantity"
                                        placeholderTextColor={colors.text.secondary}
                                        keyboardType="numeric"
                                        value={dishQuantity}
                                        onChangeText={setDishQuantity}
                                    />
                                    <View style={styles.iconContainer}>
                                        <ChevronUpDownIcon />
                                    </View>
                                </View>

                                <Pressable
                                    style={styles.addDishButton}
                                    onPress={addDishToOrder}
                                >
                                    <Text style={styles.addDishButtonText}>Add to order </Text>
                                </Pressable>
                            </View>
                        </View>
                    )}

                    {/* Custom Item Section */}
                    <View style={styles.sectionTitle}>
                        <Text style={styles.sectionTitleText}>Add Custom Item</Text>
                    </View>

                    <View style={styles.customItemContainer}>
                        <View style={styles.customInputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Item Name"
                                placeholderTextColor={colors.text.secondary}
                                value={customItemName}
                                onChangeText={setCustomItemName}
                            />
                        </View>

                        <View style={styles.customInputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Price ($)"
                                placeholderTextColor={colors.text.secondary}
                                keyboardType="numeric"
                                value={customItemPrice}
                                onChangeText={setCustomItemPrice}
                            />
                        </View>

                        <Pressable
                            style={styles.addCustomButton}
                            onPress={addCustomItemToOrder}
                        >
                            <Text style={styles.addCustomButtonText}>Add Custom Item</Text>
                        </Pressable>
                    </View>

                    {/* Order List */}
                    {orderItems.length > 0 && (
                        <View style={styles.orderSection}>
                            <View style={styles.sectionTitle}>
                                <Text style={styles.sectionTitleText}>Current Order</Text>
                            </View>

                            <FlatList
                                data={orderItems}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.orderItem}>
                                        <View style={styles.orderItemLeft}>
                                            {item.imageUrl && (
                                                <Image
                                                    source={{ uri: item.imageUrl }}
                                                    style={styles.orderItemImage}
                                                />
                                            )}
                                            <View style={styles.orderItemInfo}>
                                                <Text style={styles.orderItemName}>{item.name}</Text>
                                                <Text style={styles.orderItemPrice}>${item.price.toFixed(2)} each</Text>
                                                <Text style={styles.orderItemPoints}>{item.points} points each</Text>
                                            </View>
                                        </View>

                                        <View style={styles.orderItemRight}>
                                            <View style={styles.quantityContainer}>
                                                <Pressable
                                                    style={styles.quantityButton}
                                                    onPress={() => updateItemQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Text style={styles.quantityButtonText}>-</Text>
                                                </Pressable>
                                                <Text style={styles.quantityText}>{item.quantity}</Text>
                                                <Pressable
                                                    style={styles.quantityButton}
                                                    onPress={() => updateItemQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Text style={styles.quantityButtonText}>+</Text>
                                                </Pressable>
                                            </View>

                                            <Pressable
                                                style={styles.removeButton}
                                                onPress={() => removeOrderItem(item.id)}
                                            >
                                                <Text style={styles.removeButtonText}>Remove</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                )}
                                style={styles.orderList}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    )}
                </View>
                
            </ScrollView>

            {/* Fixed Bottom Section */}
            <View style={styles.bottomSection}>
                {/* Order Summary */}
                {orderItems.length > 0 && (
                    <View style={styles.summaryContainer}>
                        <View style={styles.greyRow}>
                            <View style={styles.filterRowBackground}>
                                <GreyBackground />
                            </View>
                            <Text style={styles.filterRowText}>TOTAL PRICE</Text>
                            <Text style={styles.filterRowCount}>${totalPrice.toFixed(2)}</Text>
                        </View>

                        <View style={styles.greyRow}>
                            <View style={styles.filterRowBackground}>
                                <GreyBackground />
                            </View>
                            <Text style={styles.filterRowText}>POINTS TO BE {type}ed</Text>
                            <Text style={styles.filterRowCount}>{totalPoints}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <Pressable
                        style={[styles.button, styles.newDishButton]}
                        onPress={() => openDishSheet()}
                    >
                        <Text style={styles.newDishButtonText}>New Dish</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            if (orderItems.length === 0) {
                                Alert.alert('Empty Order', 'Please add at least one item to create a QR code');
                                return;
                            }
                            createPointsTransaction();
                        }}
                        style={[styles.button, styles.createQrButton]}
                        disabled={isCreatingPoints}
                    >
                        <Text style={styles.createQrButtonText}>
                            {isCreatingPoints ? 'Creating...' : 'Create QR Code'}
                        </Text>
                    </Pressable>
                </View>
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    iconCircle: {
        alignSelf: 'center',
        width: 72,
        height: 72,
        borderRadius: 36,
        marginTop: 18,
        marginBottom: 16,
    },
    iconGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subTitle: {
        ...typography.body2,
        color: colors.text.secondary,
        fontSize: 12,
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    instruction: {
        ...typography.body2,
        color: colors.text.secondary
    },
    instructionContainer: {
        backgroundColor: colors.primary.light,
        borderWidth: 0.6,
        borderColor: colors.border.secondary,
        borderRadius: 24,
        padding: 16,
        gap: 8,
    },
    filterRowBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    filterRowCount: {
        color: colors.text.black,
        fontWeight: '900',
        fontSize: 20,
    },
    filterRowText: {
        ...typography.body2,
        fontSize: 10,
        fontWeight: '500',
        color: colors.text.secondary,
        textTransform: 'uppercase',
    },
    greyRow: {
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.background.subtle,
        padding: 8,
        paddingHorizontal: 16,
        position: 'relative',
        borderWidth: 1,
        borderColor: colors.border.default,
        borderRadius: 20,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background.default,
        minHeight: 812,
    },
    scrollContainer: {
        paddingBottom: 200, // Extra padding to ensure content is scrollable above keyboard
        paddingHorizontal: 20,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        textTransform: 'uppercase',
        letterSpacing: -1,

    },
    inputContainer: {
        gap: 8,
        marginBottom: 24,
    },
    customInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.paper,
        borderWidth: 1,
        borderColor: colors.border.fade,
        borderRadius: 30,
        paddingHorizontal: 24,
    },
    input: {
        flex: 1,
        paddingVertical: 18,
        ...typography.body1,
        color: colors.text.primary,
    },
    iconContainer: {
        paddingLeft: 16,
        paddingVertical: 18,
        borderLeftWidth: 1,
        borderLeftColor: colors.border.fade,
        marginLeft: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        gap: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    newDishButton: {
        borderWidth: 1,
        borderColor: colors.border.secondary,
    },
    createQrButton: {
        backgroundColor: colors.primary.main,
    },
    newDishButtonText: {
        ...typography.body1,
        color: colors.text.black,
        fontWeight: '600',
        fontSize: 12,
    },
    createQrButtonText: {
        ...typography.body1,
        color: colors.text.white,
        fontWeight: '600',
        fontSize: 12,
    },
    dropdownContainer: {
        position: 'relative',
        zIndex: 1000,
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: colors.background.paper,
        borderWidth: 1,
        borderColor: colors.border.fade,
        borderRadius: 12,
        marginTop: 4,
        maxHeight: 300, // Height for 5 items (60px each)
        zIndex: 1001,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    dropdownList: {
        maxHeight: 300, // Height for 5 items (60px each)
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.fade,
    },
    dishImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 12,
    },
    dishInfo: {
        flex: 1,
    },
    dishName: {
        ...typography.body1,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 2,
    },
    dishPrice: {
        ...typography.body2,
        color: colors.text.secondary,
        marginBottom: 2,
    },
    dishPoints: {
        ...typography.caption,
        color: colors.primary.main,
        fontWeight: '500',
    },
    noResultsContainer: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noResultsText: {
        ...typography.body2,
        color: colors.text.secondary,
        fontStyle: 'italic',
    },
    // New styles for multiple items and custom inputs
    sectionTitle: {
        marginTop: 16,
        marginBottom: 6,
    },
    sectionTitleText: {
        ...typography.subtitle2,
        color: colors.text.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    customItemContainer: {
        gap: 12,
    },
    customInputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },
    addCustomButton: {
        backgroundColor: colors.primary.light,
        borderWidth: 1,
        borderColor: colors.border.secondary,
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addCustomButtonText: {
        ...typography.body1,
        color: colors.text.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    orderSection: {
        marginTop: 24,
    },
    orderList: {
        maxHeight: 300,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.background.paper,
        borderWidth: 1,
        borderColor: colors.border.fade,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    orderItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    orderItemImage: {
        width: 48,
        height: 48,
        borderRadius: 12,
        marginRight: 12,
    },
    orderItemInfo: {
        flex: 1,
    },
    orderItemName: {
        ...typography.body1,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 4,
    },
    orderItemPrice: {
        ...typography.body2,
        color: colors.text.secondary,
        marginBottom: 2,
    },
    orderItemPoints: {
        ...typography.caption,
        color: colors.primary.main,
        fontWeight: '500',
    },
    orderItemRight: {
        alignItems: 'center',
        gap: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.subtle,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.background.paper,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border.fade,
    },
    quantityButtonText: {
        ...typography.body1,
        fontWeight: '600',
        color: colors.text.primary,
        fontSize: 16,
    },
    quantityText: {
        ...typography.body1,
        fontWeight: '600',
        color: colors.text.primary,
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        backgroundColor: colors.status.error,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    removeButtonText: {
        ...typography.caption,
        color: colors.text.white,
        fontWeight: '600',
    },
    summaryContainer: {
        gap: 8,
        marginBottom: 16,
    },
    // New styles for scrollable layout and dish selection
    scrollView: {
        flex: 1,
    },
    bottomSection: {
        backgroundColor: colors.background.default,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border.fade,
    },
    selectedDishContainer: {
        marginTop: 10,
        width: '100%',
    },
    selectedDishCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.paper,
        borderWidth: 1,
        borderColor: colors.border.fade,
        borderRadius: 16,
        padding: 16,
    },
    selectedDishImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 16,
    },
    selectedDishInfo: {
        flex: 1,
    },
    selectedDishName: {
        ...typography.body1,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 4,
    },
    selectedDishPrice: {
        ...typography.body2,
        color: colors.text.secondary,
        marginBottom: 2,
    },
    selectedDishPoints: {
        ...typography.caption,
        color: colors.primary.main,
        fontWeight: '500',
    },
    quantityAndAddContainer: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        gap: 12,
    },
    addDishButton: {
        backgroundColor: colors.primary.main,
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
    },
    addDishButtonText: {
        ...typography.body1,
        color: colors.text.white,
        fontWeight: '600',
        fontSize: 14,
    },
    // Points rate display styles
    pointsRateContainer: {
        backgroundColor: colors.primary.light,
        borderWidth: 1,
        borderColor: colors.border.secondary,
        borderRadius: 16,
        padding: 12,
        marginTop: 16,
        alignItems: 'center',
    },
    pointsRateText: {
        ...typography.body2,
        color: colors.text.primary,
        fontWeight: '600',
        fontSize: 13,
    },
});

export default ManagePoints;