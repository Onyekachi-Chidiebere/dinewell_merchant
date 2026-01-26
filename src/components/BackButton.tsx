import { Pressable } from "react-native";
import colors from '../theme/colors';
import { ArrowLeftIcon } from '../assets/icons';
import { useNavigation } from '@react-navigation/native';

const BackButton = ({ style }: { style?: any }) => {
    const navigation = useNavigation();
    return <Pressable
        onPress={() => navigation.goBack()}
        style={{
            padding: 10,
            borderWidth: 1,
            borderColor: colors.border.default,
            backgroundColor: colors.background.subtle,
            height: 32,
            width: 32,
            borderRadius: 24,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 5,
            ...style
        }}>
        <ArrowLeftIcon width={5} height={10} color={colors.border.subtle} />
    </Pressable>;
};

export default BackButton;