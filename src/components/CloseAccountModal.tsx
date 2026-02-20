import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import colors from '../theme/colors';
import { CloseIcon , CloseAccountIcon} from '../assets/icons';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

const reasons = [
  'Switching Apps?',
  'Poor Customer Service',
  'App is too technical',
  'Tired of Dinewell',
  'Other',
];

const CloseAccountModal = ({ visible, onClose, onSubmit }: Props) => {
  const [selectedReason, setSelectedReason] = useState('');

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <CloseIcon width={24} height={24}  />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <CloseAccountIcon/>
           
            <Text style={styles.title}>Close Account</Text>
            <Text style={styles.description}>
              This action is irreversible, we would love to know why your deactivating your account.
            </Text>
          </View>

          <View style={styles.reasonsContainer}>
            <View style={styles.divider} />
            {reasons.map((reason, index) => (
              <React.Fragment key={reason}>
                <TouchableOpacity
                  style={styles.reasonItem}
                  onPress={() => setSelectedReason(reason)}
                >
                  <View style={[
                    styles.radioButton,
                    selectedReason === reason && styles.radioButtonSelected
                  ]} />
                  <Text style={styles.reasonText}>{reason}</Text>
                </TouchableOpacity>
                {index < reasons.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
            <View style={styles.divider} />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                !selectedReason && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!selectedReason}
            >
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 375,
    backgroundColor: colors.background.paper,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingBottom: 40,
    paddingTop: 8,
    gap: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 4,
    backgroundColor: '#F3F4F7',
    borderRadius: 40,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E4EB',
  },
  content: {
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 8,
    padding: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeAccountIcon: {
    width: 48,
    height: 48,
    position: 'relative',
  },
  closeAccountCircle: {
    position: 'absolute',
    width: 17,
    height: 17,
    top: 28.5,
    left: 24.5,
    borderRadius: 8.5,
    backgroundColor: '#191F2D',
  },
  closeAccountSubtract: {
    position: 'absolute',
    width: 24,
    height: 40,
    top: 4,
    left: 8,
    backgroundColor: '#191F2D',
  },
  title: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 20,
    lineHeight: 24,
    color: colors.text.primary,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 14,
    lineHeight: 16.8,
    textAlign: 'center',
    color: colors.text.tertiary,
  },
  reasonsContainer: {
    alignSelf: 'stretch',
    gap: 16,
    paddingHorizontal: 8,
  },
  divider: {
    height: 0.4,
    backgroundColor: '#EBEEFF',
    width: '100%',
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
    borderWidth: 1,
    borderColor: '#D2D3F3',
  },
  radioButtonSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  reasonText: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 12,
    lineHeight: 14.4,
    color: colors.text.primary,
  },
  buttonContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 12,
    paddingVertical: 8,
  },
  submitButton: {
    width: 127,
    height: 32,
    backgroundColor: colors.primary.main,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEDDDB',
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: 'MavenPro-SemiBold',
    fontSize: 12,
    letterSpacing: -0.4,
    color: colors.background.paper,
    textAlign: 'center',
  },
});

export default CloseAccountModal; 