import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ViewStyle, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import typography from '../theme/typography';
import QRCode from 'react-native-qrcode-svg';
import { useAppContext } from '../context/AppContext';

type RootStackParamList = {
    // Add other screen params as needed
};

const QrCode = ({ route }: { route: { params: { type: string, qrCode:string } } }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { type, qrCode } = route.params;
    const { socket } = useAppContext();

    useEffect(() => {

        if (socket) {
            console.log('Socket connected:', socket);
            socket.on('points:completed', (data: any) => {
                Alert.alert(
                    'Points Completed',
                    'The points transaction was successful.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Navigate back to Home/BottomTab
                                // Using any to avoid strict typing issues with route names
                                (navigation as any).navigate('BottomTab');
                            },
                        },
                    ],
                    { cancelable: false }
                );
            });
        }
        return () => {
            if (socket) {
                socket.off('points:completed');
            }
        };
    }, [socket]);
    return (
        <SafeAreaView style={styles.container}>
            <View
                style={styles.scrollContainer}
            >
                <>       <BackButton />
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <View style={styles.qrContainer}>
                                <QRCode
                                    value={qrCode}
                                    size={250}
                                />
≈ß
                            </View>
                            <Text style={styles.subTitle}>How to Issue Points</Text>

                        </View>
                        <View style={styles.instructionContainer}>
                            <View style={styles.instructionItem}>
                                <Text style={styles.instructionCount}>01</Text>
                                <Text style={styles.instruction}>Select Dish and number of plates</Text>
                            </View>
                            <View style={styles.instructionItem}>
                                <Text style={styles.instructionCount}>02</Text>
                                <Text style={styles.instruction}>Confirm the amount of points to be issued</Text>
                            </View>
                            <View style={styles.instructionItem}>
                                <Text style={styles.instructionCount}>03</Text>
                                <Text style={styles.instruction}>Create QR code for customer to scan</Text>
                            </View>
                            <View style={styles.instructionItem}>
                                <Text style={styles.instructionCount}>04</Text>
                                <Text style={styles.instruction}>Customer scans to complete process</Text>
                            </View>
                        </View>

                    </View>
                </>
                <>
                    <View style={styles.buttonContainer}>
                        <Pressable onPress={() => navigation.goBack()}  style={[styles.button, styles.newDishButton]}>
                            <Text style={styles.newDishButtonText}>Make Changes</Text>
                        </Pressable>
                        <Pressable onPress={() => navigation.reset({index: 0, routes: [{name: 'BottomTab'}]})} style={[styles.button, styles.createQrButton]}>
                            <Text style={styles.createQrButtonText}>Close</Text>
                        </Pressable>
                    </View></>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        backgroundColor: colors.background.subtle,
        borderWidth: 1,
        borderColor: colors.border.default,
        width: '100%',
        marginBottom: 40,
        marginTop: 20,
        borderRadius: 12,
    },
    instructionCount: {
        padding: 3,
        paddingHorizontal: 6,
        borderRadius: 12,
        fontSize: 12,

        backgroundColor: colors.primary.main,
        color: colors.text.white,
    },
    instructionItem: {
        flexDirection: 'row',
        gap: 8
    },
    iconCircle: {
        alignSelf: 'center',
        width: 72,
        height: 72,
        borderRadius: 36,
        marginTop: 24,
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
        gap: 8,
        marginVertical: 30
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

export default QrCode;