import React, { useState } from "react";
import { TextInput, View, StyleSheet, Pressable, Text } from "react-native";
import colors from "../theme/colors";
import typography from "../theme/typography";

const FormInput = ({
    value,
    onChangeText,
    placeholder,
    passsword = false,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [secured, setSecured] = useState(true)

    return (
        <View
            style={[
                styles.container,
                isFocused && styles.focusedContainer,

            ]}
        >{
                passsword ? <View style={styles.passwordContainer}>
                    <TextInput
                        secureTextEntry={secured}
                        style={[styles.input]}
                        value={value}
                        placeholder={placeholder}
                        onChangeText={onChangeText}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...rest}
                    />
                    <Pressable onPress={()=>setSecured(!secured)}>
                    <Text style={styles.eyeIconText}>{secured ? '👁️‍🗨️':'👁️'}</Text>
                    </Pressable>
                </View> : <TextInput
                    style={[styles.input]}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...rest}
                />
            }

        </View>
    );
};

export default FormInput;

const styles = StyleSheet.create({
    passwordContainer:{
        flexDirection:'row', 
        justifyContent:'space-between', 
        alignItems:'center'
    },
    container: {
        borderWidth: 1,
        borderColor: colors.border.default,
        borderRadius: 50,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    focusedContainer: {
        borderColor: colors.primary.main,
        borderRadius: 50,
        borderWidth: 1,
    },
    input: {
        ...typography.subtitle2,
        color: colors.text.secondary,
        fontSize: 16,
        fontWeight: '400',
        margin: 8



    },
    eyeIconText: {
        fontSize: 20,
      },
});
