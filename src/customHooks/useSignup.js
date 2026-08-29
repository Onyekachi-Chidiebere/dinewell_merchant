import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/axios';
import Toast from 'react-native-toast-message';
import { BACKEND_URL } from '../theme/constants';

const SIGNUP_STORAGE_KEY = 'dinewell_merchant_signup';
const emptyImage = () => ({ uri: '', fileName: '', type: '', base64: '' });

/** Build a long-lived debug dump for signup upload failures (test mode). */
const formatUploadDebugError = (err, context = {}) => {
  const responseData = err?.response?.data;
  let responseBody = '';
  try {
    responseBody =
      responseData == null
        ? '(no response body)'
        : typeof responseData === 'string'
          ? responseData
          : JSON.stringify(responseData, null, 2);
  } catch {
    responseBody = String(responseData);
  }

  const lines = [
    'UPLOAD DEBUG (stays on screen until dismissed)',
    `time: ${new Date().toISOString()}`,
    `platform: ${Platform.OS}`,
    `backend: ${BACKEND_URL}`,
    `endpoint: ${err?.config?.url || 'POST /merchant/signup/pictures-base64'}`,
    `merchantId: ${context.merchantId ?? '(missing)'}`,
    `merchantIdSource: ${context.merchantIdSource || '(n/a)'}`,
    `logo: ${context.hasLogo ? 'yes' : 'no'}`,
    `restaurantImages: ${context.imageCount ?? 0}`,
    `axiosMessage: ${err?.message || '(none)'}`,
    `axiosCode: ${err?.code || '(none)'}`,
    `httpStatus: ${err?.response?.status ?? '(no HTTP response — often Network Error / timeout / wrong URL)'}`,
    `responseURL: ${err?.config?.baseURL || ''}${err?.config?.url || ''}`,
    `timeoutMs: ${err?.config?.timeout ?? '(default)'}`,
    `responseBody:`,
    responseBody,
  ];

  if (err?.request && !err?.response) {
    lines.push(
      'hint: Request left the app but no response came back.',
      'Check API is up, BACKEND_URL, SSL, and Cloudinary/server crash on upload.'
    );
  }

  return lines.join('\n');
};

const defaultDetails = () => ({
  name: '',
  phone: '',
  email: '',
  location: '',
  password: '',
  streetNumber: '',
  streetName: '',
  area: '',
  logo: emptyImage(),
  images: [emptyImage(), emptyImage(), emptyImage(), emptyImage()],
  card: {},
});

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [merchantId, setMerchantIdState] = useState(null);
  const [signupStep, setSignupStep] = useState('details');
  const [uploadDebugError, setUploadDebugError] = useState(null);
  const [restaurantDetails, setRestaurantDetails] = useState(defaultDetails());

  // Keep a sync copy so later screens never lose merchantId to stale state / remounts
  const merchantIdRef = useRef(null);
  const restaurantDetailsRef = useRef(restaurantDetails);
  restaurantDetailsRef.current = restaurantDetails;

  const setMerchantId = useCallback((id) => {
    const normalized = id == null || id === '' ? null : id;
    merchantIdRef.current = normalized;
    setMerchantIdState(normalized);
  }, []);

  const clearUploadDebugError = useCallback(() => setUploadDebugError(null), []);

  const handleRestaurantDetails = ({ name, value }) =>
    setRestaurantDetails((prev) => ({ ...prev, [name]: value }));

  const setImageAtIndex = (index, image) =>
    setRestaurantDetails((prev) => {
      const newImages = [...prev.images];
      newImages[index] = {
        uri: image?.uri || '',
        fileName: image?.fileName || `image${index}.jpg`,
        type: image?.type || 'image/jpeg',
        base64: image?.base64 || '',
      };
      return { ...prev, images: newImages };
    });

  const removeImage = (index) =>
    setRestaurantDetails((prev) => {
      const newImages = [...prev.images];
      newImages[index] = emptyImage();
      return { ...prev, images: newImages };
    });

  const setCard = (card) =>
    setRestaurantDetails((prev) => ({ ...prev, card }));

  const showError = (message) => {
    Toast.show({
      type: 'error',
      text1: 'Signup error',
      text2: message,
    });
  };

  const loadLocalSignupProgress = async () => {
    try {
      const raw = await AsyncStorage.getItem(SIGNUP_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  /**
   * Resolve merchantId from (in order): explicit arg → ref → state → AsyncStorage → server by email.
   * Always syncs ref/state when found.
   */
  const ensureMerchantId = useCallback(async (preferredId) => {
    if (preferredId != null && preferredId !== '') {
      setMerchantId(preferredId);
      return { id: preferredId, source: 'navigation' };
    }
    if (merchantIdRef.current != null && merchantIdRef.current !== '') {
      return { id: merchantIdRef.current, source: 'ref' };
    }
    if (merchantId != null && merchantId !== '') {
      merchantIdRef.current = merchantId;
      return { id: merchantId, source: 'state' };
    }

    const local = await loadLocalSignupProgress();
    if (local?.merchantId != null && local.merchantId !== '') {
      setMerchantId(local.merchantId);
      if (local.restaurantDetails) {
        setRestaurantDetails((prev) => ({
          ...prev,
          ...local.restaurantDetails,
          password: prev.password || '',
          logo: prev.logo?.uri ? prev.logo : emptyImage(),
          images: prev.images?.some((img) => img?.uri) ? prev.images : defaultDetails().images,
        }));
      }
      if (local.signupStep) setSignupStep(local.signupStep);
      return { id: local.merchantId, source: 'asyncStorage' };
    }

    const email = (restaurantDetailsRef.current.email || local?.email || '').trim().toLowerCase();
    if (email) {
      try {
        const res = await axios.get('/merchant/signup/progress', { params: { email } });
        if (res.data?.found && res.data.merchantId && !res.data.completed) {
          setMerchantId(res.data.merchantId);
          return { id: res.data.merchantId, source: 'serverByEmail' };
        }
      } catch {
        // ignore — fall through
      }
    }

    return { id: null, source: 'missing' };
  }, [merchantId, setMerchantId]);

  // Do not auto-restore previous drafts on mount — only when user enters the same email
  // or explicitly continues from login.
  const persistSignupProgress = async ({
    id = merchantIdRef.current || merchantId,
    email = restaurantDetailsRef.current.email,
    step = signupStep,
    details = restaurantDetailsRef.current,
  } = {}) => {
    if (id == null || id === '') return;
    const payload = {
      merchantId: id,
      email: (email || '').trim().toLowerCase(),
      signupStep: step,
      restaurantDetails: {
        name: details.name || '',
        phone: details.phone || '',
        email: (details.email || '').trim().toLowerCase(),
        location: details.location || '',
        streetNumber: details.streetNumber || '',
        streetName: details.streetName || '',
        area: details.area || '',
      },
    };
    await AsyncStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(payload));
  };

  const clearSignupProgress = async () => {
    await AsyncStorage.removeItem(SIGNUP_STORAGE_KEY);
    setMerchantId(null);
    setSignupStep('details');
    setRestaurantDetails(defaultDetails());
  };

  /** Clear local draft so Sign up always starts blank (server drafts stay until same email is used). */
  const startFreshSignup = async () => {
    await AsyncStorage.removeItem(SIGNUP_STORAGE_KEY);
    setMerchantId(null);
    setSignupStep('details');
    setRestaurantDetails(defaultDetails());
    setUploadDebugError(null);
  };

  /** Look up an unfinished server signup for this email only — used when user enters matching details. */
  const checkIncompleteSignupByEmail = async (email) => {
    const normalized = String(email || '').trim().toLowerCase();
    if (!normalized) return null;
    try {
      const res = await axios.get('/merchant/signup/progress', {
        params: { email: normalized },
      });
      if (res.data?.found && !res.data.completed) {
        return res.data;
      }
    } catch {
      // ignore network errors here — submitDetails will surface issues
    }
    return null;
  };

  const hydrateFromProgress = useCallback((progress, { password = '' } = {}) => {
    if (!progress?.merchantId) return null;
    const d = progress.restaurantDetails || {};
    setMerchantId(progress.merchantId);
    setSignupStep(progress.signupStep || 'details');
    setRestaurantDetails((prev) => ({
      ...prev,
      name: d.name || '',
      phone: d.phone || '',
      email: d.email || progress.email || '',
      location: d.location || '',
      password: password || prev.password || '',
      streetNumber: d.streetNumber || '',
      streetName: d.streetName || '',
      area: d.area || '',
      logo: emptyImage(),
      images: [emptyImage(), emptyImage(), emptyImage(), emptyImage()],
    }));
    return progress.nextScreen || 'RestaurantDetails';
  }, [setMerchantId]);

  /**
   * Resume incomplete signup from device storage and/or server.
   * Returns { nextScreen } or null if no incomplete signup.
   */
  const resumeSignup = async () => {
    setLoading(true);
    try {
      const local = await loadLocalSignupProgress();
      if (!local?.merchantId && !local?.email) {
        return null;
      }

      const params = {};
      if (local.merchantId) params.merchantId = local.merchantId;
      else if (local.email) params.email = local.email;

      const res = await axios.get('/merchant/signup/progress', { params });
      if (!res.data?.found || res.data.completed) {
        await AsyncStorage.removeItem(SIGNUP_STORAGE_KEY);
        return null;
      }

      const nextScreen = hydrateFromProgress(res.data);
      await persistSignupProgress({
        id: res.data.merchantId,
        email: res.data.email,
        step: res.data.signupStep,
        details: {
          ...defaultDetails(),
          ...(res.data.restaurantDetails || {}),
        },
      });
      return { nextScreen, progress: res.data };
    } catch (err) {
      const local = await loadLocalSignupProgress();
      if (!local?.merchantId) return null;
      const step = local.signupStep || 'address';
      const nextScreen =
        step === 'details'
          ? 'RestaurantDetails'
          : step === 'address'
            ? 'RestaurantAddress'
            : step === 'pictures'
              ? 'RestaurantPictures'
              : 'Login';
      if (nextScreen === 'Login') return null;
      hydrateFromProgress({
        merchantId: local.merchantId,
        email: local.email,
        signupStep: step,
        nextScreen,
        restaurantDetails: local.restaurantDetails,
      });
      return { nextScreen, progress: local };
    } finally {
      setLoading(false);
    }
  };

  const applySignupProgress = async (progress, { password = '' } = {}) => {
    if (!progress?.merchantId || progress.completed) return null;
    const nextScreen = hydrateFromProgress(progress, { password });
    await persistSignupProgress({
      id: progress.merchantId,
      email: progress.email,
      step: progress.signupStep,
      details: {
        ...defaultDetails(),
        ...(progress.restaurantDetails || {}),
        password,
      },
    });
    return nextScreen;
  };

  const toFormFile = (asset, fallbackName) => {
    if (!asset?.uri) return null;
    let uri = asset.uri;
    if (Platform.OS === 'ios' && uri && !uri.startsWith('file://') && !uri.startsWith('ph://')) {
      uri = `file://${uri}`;
    }
    return {
      uri,
      name: asset.fileName || fallbackName,
      type: asset.type || 'image/jpeg',
    };
  };

  const submitDetails = async () => {
    setLoading(true);
    try {
      const { name, phone, email, location, password } = restaurantDetails;
      if (!name?.trim() || !phone?.trim() || !email?.trim() || !location?.trim() || !password) {
        throw new Error('Please fill in all restaurant details');
      }
      const res = await axios.post('/merchant/signup/details', {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        location: location.trim(),
        password,
      });
      const id = res.data.merchantId;
      if (id == null || id === '') {
        throw new Error('Signup failed: no merchant id returned');
      }
      const step = res.data.signupStep || 'address';
      const nextScreen = res.data.nextScreen || 'RestaurantAddress';
      // Sync immediately so the next screen never sees a null merchantId
      setMerchantId(id);
      setSignupStep(step);
      await persistSignupProgress({
        id,
        email: email.trim().toLowerCase(),
        step,
      });
      return { merchantId: id, nextScreen };
    } catch (err) {
      showError(err?.response?.data?.error || err?.message || 'Failed to submit details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitAddress = async (preferredMerchantId) => {
    setLoading(true);
    try {
      const { id: resolvedId } = await ensureMerchantId(preferredMerchantId);
      if (resolvedId == null || resolvedId === '') {
        throw new Error('Missing merchant account. Please go back and resubmit details.');
      }
      const { streetNumber, streetName, area } = restaurantDetailsRef.current;
      if (!streetNumber?.trim() || !streetName?.trim() || !area?.trim()) {
        throw new Error('Please fill in all address fields');
      }
      await axios.post('/merchant/signup/address', {
        merchantId: resolvedId,
        streetNumber: streetNumber.trim(),
        streetName: streetName.trim(),
        area: area.trim(),
      });
      setSignupStep('pictures');
      await persistSignupProgress({ id: resolvedId, step: 'pictures' });
      return { merchantId: resolvedId };
    } catch (err) {
      showError(err?.response?.data?.error || err?.message || 'Failed to submit address');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitPictures = async (preferredMerchantId) => {
    setLoading(true);
    setUploadDebugError(null);

    let resolvedId = null;
    let merchantIdSource = 'missing';
    const hasLogo = !!(restaurantDetails.logo?.base64 || restaurantDetails.logo?.uri);
    const imageCount = restaurantDetails.images.filter((img) => img?.base64 || img?.uri).length;

    try {
      const resolved = await ensureMerchantId(preferredMerchantId);
      resolvedId = resolved.id;
      merchantIdSource = resolved.source;

      if (resolvedId == null || resolvedId === '') {
        const missingErr = new Error(
          'Missing merchantId. Details step did not persist an account id — go back and tap Next on restaurant details again.'
        );
        setUploadDebugError(
          formatUploadDebugError(missingErr, {
            merchantId: null,
            merchantIdSource,
            hasLogo,
            imageCount,
          })
        );
        throw missingErr;
      }

      const logoPart = restaurantDetails.logo?.base64
        ? {
            base64: restaurantDetails.logo.base64,
            fileName: restaurantDetails.logo.fileName || 'logo.jpg',
            type: restaurantDetails.logo.type || 'image/jpeg',
          }
        : null;

      const imageParts = restaurantDetails.images
        .filter((img) => img?.base64)
        .map((img, idx) => ({
          base64: img.base64,
          fileName: img.fileName || `image${idx}.jpg`,
          type: img.type || 'image/jpeg',
        }));

      if (!logoPart && imageParts.length === 0) {
        throw new Error(
          'Please add a logo or at least one restaurant picture (re-select photos so they can be uploaded).'
        );
      }

      // JSON upload — same transport as login. Android multipart FormData often returns ERR_NETWORK.
      await axios.post(
        '/merchant/signup/pictures-base64',
        {
          merchantId: String(resolvedId),
          logo: logoPart,
          restaurantImages: imageParts,
        },
        { timeout: 120000 }
      );

      setSignupStep('complete');
      await clearSignupProgress();
      Toast.show({
        type: 'success',
        text1: 'Account created',
        text2: 'Your restaurant pictures were saved. You can log in now.',
      });
      return true;
    } catch (err) {
      const debugText = formatUploadDebugError(err, {
        merchantId: resolvedId,
        merchantIdSource,
        hasLogo,
        imageCount,
      });
      console.log('submitPictures error', debugText);
      setUploadDebugError(debugText);
      showError(err?.response?.data?.error || err?.message || 'Failed to submit pictures');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const skipPictures = async (preferredMerchantId) => {
    setLoading(true);
    try {
      const { id: resolvedId } = await ensureMerchantId(preferredMerchantId);
      if (resolvedId == null || resolvedId === '') {
        throw new Error('Missing merchant account. Please go back and resubmit details.');
      }
      await axios.post('/merchant/signup/complete', { merchantId: resolvedId });
      setSignupStep('complete');
      await clearSignupProgress();
      Toast.show({
        type: 'success',
        text1: 'Account created',
        text2: 'You can add pictures later from your profile.',
      });
      return true;
    } catch (err) {
      showError(err?.response?.data?.error || err?.message || 'Failed to finish signup');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogoPick = (image) =>
    handleRestaurantDetails({
      name: 'logo',
      value: {
        uri: image?.uri || '',
        fileName: image?.fileName || 'logo.jpg',
        type: image?.type || 'image/jpeg',
        base64: image?.base64 || '',
      },
    });

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
    signupStep,
    uploadDebugError,
    clearUploadDebugError,
    ensureMerchantId,
    submitDetails,
    submitAddress,
    submitPictures,
    skipPictures,
    resumeSignup,
    applySignupProgress,
    clearSignupProgress,
    startFreshSignup,
    checkIncompleteSignupByEmail,
    handleLogoPick,
    handleAddPicture,
  };
};

export default useSignup;
