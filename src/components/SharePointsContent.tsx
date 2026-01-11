import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import { StarShareIcon as PointsIcon } from '../assets/icons';
import colors from '../theme/colors';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  availablePoints: number;
  onShare: (points: number, username: string) => void;
}

const SharePointsContent = ({ availablePoints, onShare }: Props) => {
  const [points, setPoints] = useState('');
  const [username, setPhoneNumber] = useState('');

  const handleShare = () => {
    const pointsNumber = parseInt(points, 10);
    if (pointsNumber && username) {
      onShare(pointsNumber, username);
      setPoints('');
      setPhoneNumber('');
    }
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Icon Circle */}
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

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>To Transfer Points</Text>
        <Text style={styles.subtitle}>Follow the instructions below</Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
       
        <View style={styles.instructionsItem}>
          <Text style={styles.instructionsNo}>1</Text>
          <Text style={styles.instructions}>Input the username of the recipient in the field provided.</Text>
        </View>
        <View style={styles.instructionsItem}>
          <Text style={styles.instructionsNo}>2</Text>
          <Text style={styles.instructions}>Input the amount of points you want to transfer (you cannot transfer more than your available points)</Text>
        </View>
        <View style={styles.instructionsItem}>
          <Text style={styles.instructionsNo}>3</Text>
          <Text style={styles.instructions}>Click on transfer to complete the process.</Text>
        </View>

      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        {/* Restaurant Selector */}
        <View style={styles.inputGroup}>
          {/* <TouchableOpacity style={styles.restaurantSelector}>
            <Text style={styles.restaurantText}>KFC</Text>
            <View style={styles.dropdownIcon}>
              <View style={styles.dropdownIconInner} />
            </View>
          </TouchableOpacity> */}

          {/* Points Balance */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Points Balance</Text>
            <Text style={styles.balanceAmount}>{availablePoints}</Text>
          </View>
        </View>

        {/* Username Input */}
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setPhoneNumber}
            placeholder="Recipient username"
            placeholderTextColor="#828DA9"
          />
        </View>

        {/* Points Input */}
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            value={points}
            onChangeText={setPoints}
            placeholder="Points to transfer"
            keyboardType="number-pad"
            placeholderTextColor="#828DA9"
          />
        </View>

        {/* Transfer Button */}
        <TouchableOpacity 
          style={[
            styles.transferButton,
            (!points || !username) && styles.transferButtonDisabled
          ]}
          onPress={handleShare}
          disabled={!points || !username}
        >
          <Text style={[
            styles.transferButtonText,
            
          ]}>Transfer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  instructionsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  scrollView: {
    flex: 1,
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
  titleSection: {
    alignItems: 'center',
    gap: 2,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'MavenPro-Regular',
    fontSize: 16,
    letterSpacing: -1.28,
    color: '#49526A',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontFamily: 'Mulish-Regular',
    fontSize: 12,
    letterSpacing: -0.048,
    color: '#828DA9',
  },
  instructionsContainer: {
    marginHorizontal: 16,
    padding: 8,
    backgroundColor: '#F6F8FA',
    borderRadius: 20,
    borderWidth: 0.6,
    borderColor: '#EBEEFF',
  },
  instructions: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 12,
    color: '#828DA9',
    width: '90%',
  },
  instructionsNo: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 12,
    color: '#828DA9',
    width: 10,
  },
  formSection: {
    padding: 16,
    gap: 8,
  },
  inputGroup: {
    gap: 8,
  },
  restaurantSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingLeft: 16,
    paddingRight: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#EFDCDA',
  },
  restaurantText: {
    fontFamily: 'Mulish-SemiBold',
    fontSize: 14,
    letterSpacing: -0.056,
    color: '#050505',
  },
  dropdownIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#F6F8FA',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EBEEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIconInner: {
    width: 8,
    height: 5,
    backgroundColor: '#C4CBF2',
    borderRadius: 1,
  },
  balanceContainer: {
    backgroundColor: '#FFF5F4',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#FEDDDB',
    padding: 12,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  balanceLabel: {
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#828DA9',
  },
  balanceAmount: {
    fontFamily: 'ClashDisplay-Bold',
    fontSize: 20,
    color: '#2B0B4F',
    fontWeight: '700',
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#EFDCDA',
    fontFamily: 'Mulish-Regular',
    fontSize: 12,
    letterSpacing: -0.048,
    color: '#050505',
  },
  transferButton: {
    height: 48,
    backgroundColor: '#D52B1E',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 50,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  transferButtonDisabled: {
    backgroundColor: colors.primary.main,
    borderWidth: 1,
    borderColor: '#EBEEFF',
    opacity: 0.2,
  },
  transferButtonText: {
    fontFamily: 'MavenPro-Bold',
    fontSize: 16,
    letterSpacing: -0.064,
    color: '#FFFFFF',
    fontWeight: '700',
  },

});

export default SharePointsContent; 