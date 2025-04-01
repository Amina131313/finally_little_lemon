import {  React, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

export default function Onboarding() {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleFirstNameChange = (text) => {
        const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        setFirstName(capitalizedText);
    };

   return (
    <View style={styles.container}>
        <View style={styles.heading_container}>
            <Image 
                style={styles.logo}
                source={require('../../assets/images/logo.jpg')}
            />
            <Text style={styles.heading}>Little Lemon</Text>
        </View>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                onChangeText={handleFirstNameChange}                value={firstName}
                autoCorrect = {false}
                placeholder="First Name"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                autoCorrect = {false}
                placeholder="Email"
                keyboardType="numeric"
            />
        </View>
        <Pressable style = {styles.button} 
            onPress={() => router.push('/screens/Home')}>
             <Text style = {{color: 'white', fontWeight: 'bold', fontSize: 16}}>Next</Text>
        </Pressable>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    heading_container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginLeft: 10,
    },
    heading: {
        fontFamily: 'times', 
        fontSize: 25,
        fontWeight: 'bold',
        letterSpacing: 5,
        paddingHorizontal: 10,
        color: '#495E57',
    },
    logo: {
        height: 40, 
        width: 40, 
        resizeMode: 'contain',
    },
    inputContainer: {
        flex: 0.85,
        justifyContent: 'center',
        padding: 20,
        
    },
    input: {
        height: 50,
        borderWidth: 0.25,
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        marginTop: 20,
    },
    button: {
        backgroundColor: '#495E57',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        height: 50,
        width: 100,
        right: 30,
        bottom: 50,
        borderRadius: 8,
    },
})
