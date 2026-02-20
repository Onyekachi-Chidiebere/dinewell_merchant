import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import BackButton from '../components/BackButton';
import { Pressable, SafeAreaView } from 'react-native';
import colors from '../theme/colors';
import { useBottomSheet } from '../context/BottomSheetContext';
import { useCardContext } from '../context/CardContext';
import Visa from '../assets/icons/Visa.svg'
import Mastercard from '../assets/icons/Mastercard.svg'
import AmericanExpress from '../assets/icons/AmericanExpress.svg'
import Discover from '../assets/icons/Discover.svg'
import JCB from '../assets/icons/JCB.svg'
import UnionPay from '../assets/icons/UnionPay.svg'
import DefaultCard from '../assets/icons/DefaultCard.svg'

// Card type icons mapping
const getCardIcon = (brand: string) => {
  const brandLower = brand?.toLowerCase();
  switch (brandLower) {
    case 'visa':
      return <Visa width={40} height={40} />
    case 'mastercard':
      return  <Mastercard width={40} height={40} />;
    case 'american_express':
        return <AmericanExpress width={40} height={40} />;
    case 'discover':
      return <Discover width={40} height={40} />;
    case 'jcb':
      return <JCB width={40} height={40} />;
    case 'unionpay':
      return <UnionPay width={40} height={40} />;
    default:
      return <DefaultCard width={40} height={40} />;
  }
};

const ManageCards = () => {
    const { openCardSheet } = useBottomSheet();
    const { cards, fetchingCards, error, setDefaultCard } = useCardContext();

    const openAddCard = () => openCardSheet({});

    const handleSetDefault = async (cardId: string) => {
        try {
            await setDefaultCard(cardId);
           
        } catch (e: any) {
            
        }
    };

    const renderCard = ({ item: card }: { item: any }) => (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <View style={styles.cardBrandContainer}>
                    <Text style={styles.cardIcon}>{getCardIcon(card.brand)}</Text>
                    <Text style={styles.cardBrand}>{card.brand?.toUpperCase() || 'CARD'}</Text>
                </View>
                {card.isDefault ?(
                    <View style={styles.activePill}>
                        <Text style={styles.activePillText}>Active</Text>
                    </View>
                ):(
                    <Pressable 
                        style={styles.setDefaultButton}
                        onPress={() => handleSetDefault(card.id)}
                    >
                        <Text style={styles.setDefaultButtonText}>Set as Default</Text>
                    </Pressable>
                )}
            </View>
            <View style={styles.cardDetailsRow}>
                <Text style={styles.cardNumber}>{card.last4 ? `**** **** **** ${card.last4}` : '**** **** **** ****'}</Text>
                <View style={styles.divider} />
                <Text style={styles.expiry}>
                    <Text style={styles.expiryBold}>{card.exp_month?.toString().padStart(2, '0') || 'MM'}</Text>
                    <Text style={styles.expiryFaint}>/{card.exp_year?.toString().slice(-2) || 'YY'}</Text>
                </Text>
                <View style={styles.divider} />
                <Text style={styles.cvv}>***</Text>
            </View>
           
        </View>
    );

    if (fetchingCards) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <BackButton />
                    <Pressable onPress={openAddCard} style={styles.addCardButtonContainer}>
                        <View style={styles.addCardButton}>
                            <Text style={styles.addCardButtonText}>+</Text>
                        </View>
                    </Pressable>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary.main} />
                    <Text style={styles.loadingText}>Loading cards...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <TouchableOpacity onPress={() => {openAddCard()}} style={styles.addCardButtonContainer}>
                    <View style={styles.addCardButton}>
                        <Text style={styles.addCardButtonText}>++</Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={cards}
                    renderItem={renderCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No cards added yet</Text>
                            <Text style={styles.emptySubtext}>Tap the + button to add your first card</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default ManageCards;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 16,
    },
    addCardButtonText: {
        color: colors.text.white,
    },
    addCardButton: {
        height: 20,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.text.secondary,
        borderRadius: 40,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background.paper,
    },
    addCardButtonContainer: {
        height: 32,
        width: 32,
        backgroundColor: colors.background.subtle,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingBottom: 20,
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F3E9E4',
        padding: 12,
        margin: 5,
        marginHorizontal: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBrandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    cardBrand: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#545967',
        fontStyle: 'italic',
    },
    cardDetailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardNumber: {
        fontSize: 12,
        color: '#222',
        fontWeight: '500',
        letterSpacing: 1,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#E2E0F6',
        marginHorizontal: 12,
        borderRadius: 1,
    },
    expiry: {
        fontSize: 12,
        fontWeight: '500',
        color: '#545967',
    },
    expiryBold: {
        color: '#545967',
        fontWeight: 'bold',
    },
    expiryFaint: {
        color: '#B6B6C0',
        fontWeight: '400',
    },
    cvv: {
        fontSize: 18,
        color: '#222',
        fontWeight: '500',
        marginRight: 12,
    },
    activePill: {
        backgroundColor: '#4CD964',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginLeft: 'auto',
    },
    activePillText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    setDefaultButton: {
        marginTop: 8,
        backgroundColor: colors.primary.main,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    setDefaultButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: colors.text.secondary,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 16,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.text.secondary,
        textAlign: 'center',
    },
});