import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, Modal } from 'react-native';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import GreyBackground from '../assets/icons/grey-background.svg';
import typography, { fontFamily } from '../theme/typography';
import ChevronDownIcon from '../assets/icons/ChevronDownIcon';
import ChevronUpDownIcon from '../assets/icons/ChevronUpDownIcon';


const Topup = () => {
    const [type, setType] = useState('bundles');
    const [visible, setVisible] = useState(false);
    return (
        <SafeAreaView style={styles.container}>
            <View
                style={styles.scrollContainer}
            >
                <BackButton />
                <View style={styles.typeContainer}>
                    <Pressable onPress={() => setType('bundles')} style={type === 'bundles' ? styles.typeButtonActive : styles.typeButtonInactive}>
                        <Text style={type === 'bundles' ? styles.typeButtonTextActive : styles.typeButtonTextInactive}>Bundles</Text>
                    </Pressable>
                    <Pressable onPress={() => setType('custom')} style={type === 'custom' ? styles.typeButtonActive : styles.typeButtonInactive}>
                        <Text style={type === 'custom' ? styles.typeButtonTextActive : styles.typeButtonTextInactive}>Custom</Text>
                    </Pressable>
                </View>
                {type == 'custom' ? <>
                    <>

                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={styles.subTitle}>Select a Type and Enter An Amount Below</Text>
                            </View>
                            <View style={styles.customInputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Select Dish"
                                    placeholderTextColor={colors.text.secondary}
                                />
                                <View style={styles.iconContainer}>
                                    <ChevronDownIcon />
                                </View>
                            </View>
                            <View style={styles.customInputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="No of Plates"
                                    placeholderTextColor={colors.text.secondary}
                                    keyboardType="numeric"
                                />
                                <View style={styles.iconContainer}>
                                    <ChevronUpDownIcon />
                                </View>
                            </View>
                        </View>
                    </>
                    <>
                        <View style={styles.greyRow}>
                            <View style={styles.filterRowBackground}>
                                <GreyBackground />
                            </View>
                            <Text style={styles.filterRowText}>Price</Text>
                            <Text style={styles.filterRowCount}>$150</Text>
                        </View>
                        <View style={styles.greyRow}>
                            <View style={styles.filterRowBackground}>
                                <GreyBackground />
                            </View>
                            <Text style={styles.filterRowText}>Rate</Text>
                            <Text style={styles.filterRowCount}>12pts/$1</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Pressable style={[styles.button, styles.newDishButton]}>
                                <Text style={styles.newDishButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={[styles.button, styles.createQrButton]}>
                                <Text style={styles.createQrButtonText}>Top Up</Text>
                            </Pressable>
                        </View>
                    </>
                </> :
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.subTitle}>Select A bundle below to buy points</Text>
                        </View>

                        <Pressable onPress={() => setVisible(true)} style={styles.bundleItem}>
                            <Text style={styles.bundleName}>MM2</Text>
                            <View style={styles.bundlePointsContainer}>
                                <Text style={styles.bundlePoints}>2257</Text>
                                <Text style={styles.bundlePointsLabel}> Pts</Text>
                            </View>
                            <View style={styles.bundlePriceContainer}>
                                <Text style={styles.bundlePrice}>$12</Text>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => setVisible(true)} style={styles.bundleItem}>
                            <Text style={styles.bundleName}>MM2</Text>
                            <View style={styles.bundlePointsContainer}>
                                <Text style={styles.bundlePoints}>2257</Text>
                                <Text style={styles.bundlePointsLabel}> Pts</Text>
                            </View>
                            <View style={styles.bundlePriceContainer}>
                                <Text style={styles.bundlePrice}>$12</Text>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => setVisible(true)} style={styles.bundleItem}>
                            <Text style={styles.bundleName}>MM2</Text>
                            <View style={styles.bundlePointsContainer}>
                                <Text style={styles.bundlePoints}>2257</Text>
                                <Text style={styles.bundlePointsLabel}> Pts</Text>
                            </View>
                            <View style={styles.bundlePriceContainer}>
                                <Text style={styles.bundlePrice}>$12</Text>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => setVisible(true)} style={styles.bundleItem}>
                            <Text style={styles.bundleName}>MM2</Text>
                            <View style={styles.bundlePointsContainer}>
                                <Text style={styles.bundlePoints}>2257</Text>
                                <Text style={styles.bundlePointsLabel}> Pts</Text>
                            </View>
                            <View style={styles.bundlePriceContainer}>
                                <Text style={styles.bundlePrice}>$12</Text>
                            </View>
                        </Pressable>

                    </View>}
            </View>
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Pressable style={styles.closeButtonContainer} onPress={() => setVisible(false)}>
                                <View style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>×</Text>
                                </View>
                            </Pressable>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Bundle Name</Text>
                            <Text style={styles.detailValue}>MM2</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Bundle Price</Text>
                            <View style={styles.infoValueContainer}>
                                <View style={styles.iconWrapper}>
                                    <Text style={styles.iconText}>$</Text>
                                </View>
                                <View style={styles.separator} />
                                <Text style={styles.infoText}>100</Text>
                            </View>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Bundle Points</Text>
                            <View style={styles.infoValueContainer}>
                                <View style={styles.iconWrapper}>
                                    <Text style={styles.iconText}>↓</Text>
                                </View>
                                <View style={styles.separator} />
                                <Text style={styles.infoText}>2200</Text>
                            </View>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Active Days Left</Text>
                            <View style={styles.infoValueContainer}>
                                <View style={styles.iconWrapper}>
                                    <Text style={styles.iconText}>🕔</Text>
                                </View>
                                <View style={styles.separator} />
                                <Text style={styles.infoText}>32 Days</Text>
                            </View>
                        </View>
                        <View style={styles.noteContainer}>
                            <Text style={styles.noteText}>Bundle most issued before the active days is over. Whatever points remain expire forever.</Text>
                        </View>
                        <Pressable style={styles.purchaseButton}>
                            <Text style={styles.purchaseButtonText}>Purchase Bundle</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.background.paper,
        borderRadius: 24,
        padding: 10,
        margin: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: '#F6F8FA',
        borderRadius: 30,
        padding: 2,
        marginBottom: 24,
    },
    closeButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.paper,
        padding: 8,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    closeButton: {
        backgroundColor: '#FCEFE3',
        width: 28,
        height: 28,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: '900',
        color: colors.text.white
    },
    detailRow: {
        paddingBottom: 24,
        marginBottom: 2,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.default,
    },
    detailLabel: {
        ...typography.body2,
        color: colors.text.secondary,
        fontSize: 12,
    },
    detailValue: {
        fontFamily: fontFamily.clash.bold,
        color: colors.text.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F6F8FA',
        borderRadius: 40,
        padding: 6,
        marginBottom: 12,
    },
    infoLabel: {
        ...typography.body2,
        color: colors.text.secondary,
        marginHorizontal: 8,
    },
    infoValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.paper,
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderWidth: 1,
        borderColor: '#E9E5FF',
    },
    iconWrapper: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        color: colors.text.white,
        fontWeight: 'bold',
    },
    separator: {
        width: 1,
        height: 12,
        backgroundColor: colors.border.subtle,
        marginHorizontal: 8,
    },
    infoText: {
        ...typography.body2,
        color: colors.text.primary,
        fontWeight: '600',
    },
    noteContainer: {
        backgroundColor: colors.primary.light,
        borderRadius: 12,
        padding: 16,
        marginBottom: 40,
        borderWidth: 0.6,
        borderColor: colors.border.secondary,

    },
    noteText: {
        ...typography.body2,
        color: '#4B5563',
    },
    purchaseButton: {
        backgroundColor: colors.primary.main,
        borderRadius: 30,
        paddingVertical: 18,
        alignItems: 'center',
    },
    purchaseButtonText: {
        ...typography.body1,
        color: colors.text.white,
        fontWeight: 'bold',
    },
    bundleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: colors.background.default,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#E9E5FF',
        marginTop: 12,
    },
    bundleName: {
        ...typography.body1,
        color: '#4B5563',
        fontWeight: '900',
        fontSize: 14,
    },
    bundlePointsContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    bundlePoints: {
        ...typography.h3,
        color: '#4B5563',
        fontSize: 14,
        fontWeight: '900',
    },
    bundlePointsLabel: {
        ...typography.body2,
        color: colors.text.secondary,
        marginLeft: 4,
    },
    bundlePriceContainer: {
        backgroundColor: '#FCEFE3',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    bundlePrice: {
        ...typography.body2,
        color: '#4B5563',
        fontWeight: '700',
    },
    typeButtonTextActive: {
        color: colors.text.secondary,
        fontWeight: '600',
        fontSize: 12,
    },
    typeButtonTextInactive: {
        color: colors.text.tertiary,
        fontWeight: '600',
        fontSize: 12,
    },
    typeButtonActive: {
        backgroundColor: colors.primary.main,
        padding: 8,
        borderRadius: 20,
        paddingHorizontal: 16,
    },
    typeButtonInactive: {
        padding: 8,
        borderRadius: 20,
        paddingHorizontal: 16,
        borderWidth: 0.6,
        borderColor: colors.border.default,
        backgroundColor: colors.background.dark,
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 8,
        marginVertical: 16,
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
        flexGrow: 1,
        justifyContent: 'space-between',

        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    content: {
        flex: 1,
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
        marginTop: 16,
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
});

export default Topup;