import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image, KeyboardAvoidingView } from 'react-native';
import typography from '../theme/typography';
import colors from '../theme/colors';
import { useDishContext } from '../context/DishContext';
import { useBottomSheet } from '../context/BottomSheetContext';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { PointShareIcon as PointsIcon } from '../assets/icons';
import ImageIcon from '../assets/icons/image-icon.svg';

const AddDishContent = () => {
  const { closeSheet, sheetData } = useBottomSheet();
  const {
    fields,
    dishImage,
    setField,
    setImage,
    saveDish,
    loading,
    reset,
    loadDishForEdit,
    editingDishId,
  } = useDishContext();

  const isEdit = sheetData?.mode === 'edit' || !!editingDishId;

  useEffect(() => {
    if (sheetData?.mode === 'edit' && sheetData?.dish) {
      loadDishForEdit(sheetData.dish);
    } else if (sheetData?.mode !== 'edit') {
      reset();
    }
  }, [sheetData?.mode, sheetData?.dish?.id]);

  const pickDishImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.55,
        maxWidth: 1024,
        maxHeight: 1024,
        selectionLimit: 1,
        includeBase64: true,
      },
      (response) => {
        if (response.didCancel || response.errorCode) return;
        if (response.assets && response.assets.length > 0) {
          setImage(response.assets[0]);
        }
      }
    );
  };

  const onSave = async () => {
    try {
      await saveDish();
      closeSheet();
      setTimeout(() => reset(), 400);
    } catch (e) {}
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
          <Text style={styles.title}>{isEdit ? 'Edit Dish' : 'To Create A New Dish'}</Text>
          <Text style={styles.subTitle}>
            {isEdit ? 'Update the details below' : 'Follow the instructions below'}
          </Text>
        </View>

        {!isEdit && (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Instructions</Text>
            <Text style={styles.infoBoxText}>1. Enter the name of the dish you want to create.</Text>
            <Text style={styles.infoBoxText}>2. Enter the amount per dish.</Text>
            <Text style={styles.infoBoxText}>3. Press create dish to complete the process.</Text>
          </View>
        )}

        <View style={styles.customInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Dish Name"
            placeholderTextColor={colors.text.tertiary}
            value={fields.dish_name}
            onChangeText={(v) => setField('dish_name', v)}
          />
        </View>
        <View style={styles.customInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Price of Dish"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="numeric"
            value={String(fields.price)}
            onChangeText={(v) => setField('price', v)}
          />
        </View>

        <View style={styles.customInputContainer}>
          {dishImage?.uri ? (
            <View style={styles.previewRow}>
              <Image source={{ uri: dishImage.uri }} style={styles.previewImage} />
              <Text style={styles.input} numberOfLines={1}>
                {dishImage?.fileName || 'Dish Image'}
              </Text>
            </View>
          ) : (
            <Text style={styles.input}>{dishImage?.fileName || 'Dish Image'}</Text>
          )}
          <Pressable onPress={pickDishImage} style={styles.iconContainer}>
            <ImageIcon />
          </Pressable>
        </View>

        <Pressable onPress={onSave} style={styles.createButton} disabled={loading}>
          <Text style={styles.createText}>
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Dish'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    paddingLeft: 5,
    paddingVertical: 10,
    borderLeftWidth: 1,
    borderLeftColor: colors.border.fade,
    marginLeft: 10,
  },
  previewRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.primary,
    textTransform: 'capitalize',
    letterSpacing: -1,
  },
  container: { padding: 16 },
  infoBox: {
    backgroundColor: '#F3F4FF',
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
    marginBottom: 3,
    borderWidth: 0.6,
    borderColor: colors.border.subtle,
  },
  infoBoxTitle: {
    ...typography.body1,
    fontSize: 12,
    color: '#4B5563',
    fontWeight: 'bold',
  },
  infoBoxText: {
    ...typography.body2,
    color: '#6B7280',
    lineHeight: 18,
    marginTop: 8,
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
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.border.fade,
    borderRadius: 30,
    marginTop: 12,
    paddingHorizontal: 24,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    ...typography.body1,
    color: colors.text.primary,
  },
  createButton: {
    marginTop: 10,
    backgroundColor: colors.primary.main,
    padding: 16,
    borderRadius: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  createText: { color: colors.text.white, fontWeight: '700' },
});

export default AddDishContent;
