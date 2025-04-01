// Automatic data transfer (First Name, Email Address)
// Valid phone number (Use Mask Text)
// Back Button 
// Profile Picture (Use Image Picker) (Initials if not selected)
// Email notification checkboxes 
// Persist changes to the disk (AsyncStorage)
// Logout (clears all data and displays Onboarding screen)

import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, Pressable, Image, StyleSheet, Alert, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { TextInputMask } from 'react-native-masked-text';
import {Ionicons} from '@expo/vector-icons';
import ProfileImage from '../components/ProfileImage';


export default function Profile2() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();
    const [profileImage, setProfileImage] = useState(null);
    const [phone, setPhone] = useState('');
    const [orderStatus, setOrderStatus] = useState(false);
    const [passwordChanges, setPasswordChanges] = useState(false);
    const [specialOffers, setSpecialOffers] = useState(false);
    const [newsletter, setNewsletter] = useState(false);

    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const isPhoneValid = phoneRegex.test(phone.trim());

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedFirstName = await AsyncStorage.getItem('firstName');
                const storedLastName = await AsyncStorage.getItem('lastName');
                const storedEmail = await AsyncStorage.getItem('email');
                const storedPhone = await AsyncStorage.getItem('phone');
                const storedProfileImage = await AsyncStorage.getItem('profileImage');
                const storedOrderStatus = await AsyncStorage.getItem('orderStatus');
                const storedPasswordChanges = await AsyncStorage.getItem('passwordChanges');
                const storedSpecialOffers = await AsyncStorage.getItem('specialOffers');
                const storedNewsletter = await AsyncStorage.getItem('newsletter');
    
                if (storedFirstName) setFirstName(storedFirstName);
                if (storedLastName) setLastName(storedLastName);
                if (storedEmail) setEmail(storedEmail);
                if (storedPhone) setPhone(storedPhone);
                if (storedProfileImage) setProfileImage(storedProfileImage);
                if (storedOrderStatus !== null) setOrderStatus(storedOrderStatus === 'true');
                if (storedPasswordChanges !== null) setPasswordChanges(storedPasswordChanges === 'true');
                if (storedSpecialOffers !== null) setSpecialOffers(storedSpecialOffers === 'true');
                if (storedNewsletter !== null) setNewsletter(storedNewsletter === 'true');
            } catch (error) {
                console.error('Error loading data', error);
            }
        };
        loadData();
    }, []);

    
    const saveProfile = async () => {
        try {
            await AsyncStorage.setItem('firstName', firstName);
            await AsyncStorage.setItem('lastName', lastName);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('phone', phone);
            if (profileImage) await AsyncStorage.setItem('profileImage', profileImage);
            await AsyncStorage.setItem('orderStatus', orderStatus.toString());
            await AsyncStorage.setItem('passwordChanges', passwordChanges.toString());
            await AsyncStorage.setItem('specialOffers', specialOffers.toString());
            await AsyncStorage.setItem('newsletter', newsletter.toString());
            Alert.alert('Success', 'Profile saved successfully');       
     } catch (error) {
            console.error('Error saving data', error);
            Alert.alert('Error', 'There was an error saving your data');
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.cancelled && result.assets.length > 0) {
            setProfileImage(result.assets[0].uri);
            await AsyncStorage.setItem('profileImage', result.assets[0].uri);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.clear();
            router.replace('/screens/Onboarding');
        } catch (error) {
            console.error('Error logging out', error);
            Alert.alert('Error', 'There was an error logging out');
        }
    };

    const discard = async () => {
        try {
            const storedFirstName = await AsyncStorage.getItem('firstName');
            const storedLastName = await AsyncStorage.getItem('lastName');
            const storedEmail = await AsyncStorage.getItem('email');
            const storedPhone = await AsyncStorage.getItem('phone');
            const storedProfileImage = await AsyncStorage.getItem('profileImage');
            const storedOrderStatus = await AsyncStorage.getItem('orderStatus');
            const storedPasswordChanges = await AsyncStorage.getItem('passwordChanges');
            const storedSpecialOffers = await AsyncStorage.getItem('specialOffers');
            const storedNewsletter = await AsyncStorage.getItem('newsletter');
    
            setFirstName(storedFirstName || '');
            setLastName(storedLastName || '');
            setEmail(storedEmail || '');
            setPhone(storedPhone || '');
            setProfileImage(storedProfileImage || null);
            setOrderStatus(storedOrderStatus === 'true');
            setPasswordChanges(storedPasswordChanges === 'true');
            setSpecialOffers(storedSpecialOffers === 'true');
            setNewsletter(storedNewsletter === 'true');

            Alert.alert('Success', 'Profile information discarded');       
        } catch (error) {
            console.error('Error discarding info', error);
            Alert.alert('Error', 'There was an error discarding your info');
        }
    };

    const removeProfileImage = async () => {
        try{
            setProfileImage(null);
            await AsyncStorage.removeItem('profileImage');
            Alert.alert('Success', 'Profile image removed successfully');
        } catch (error) {
            console.error('Error removing profile image', error);
            Alert.alert('Error', 'There was an error removing the profile image');
        }
    };    

    return (
        <View style={styles.container}>
            <View style={styles.heading_container}>
                <Pressable 
                    onPress={() => router.back()} 
                    style={styles.backButton}
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <Image 
                    style={styles.logo}
                    source={require('../../assets/images/logo.jpg')}
                />
                <Text style={styles.heading}>Little Lemon</Text>
                <ProfileImage 
                    profileImage={profileImage}
                    firstName={firstName}
                    lastName={lastName}
                    onPress={() => router.push('/screens/Profile')} 
                    customStyle={{ width: 50, height: 50, borderRadius: 30, right: -10 }} 
                />
            </View>
            <ScrollView>
            <View style={styles.mainContainer}>
                <Text style={styles.personal}>Personal information</Text>
                <Text style={styles.titles}>      Avatar</Text>
                <View style={{flexDirection:'row'}}>
                    <ProfileImage
                        profileImage={profileImage}
                        firstName={firstName}
                        lastName={lastName}
                        customStyle={{width: 100, height: 100, borderRadius: 50, margin:10, fontSize: 30}}
                    />
                    <View style={{flexDirection:'row', marginTop: 15, marginLeft: -5}}>
                        <Pressable 
                            onPress={pickImage} 
                            style={styles.changeButton}
                            accessibilityLabel="Pick Profile Image"
                        >
                            <Text style={{color:'white'}}>Change</Text>
                        </Pressable>
                        <Pressable 
                            onPress={removeProfileImage} 
                            style={styles.removeButton}
                            accessibilityLabel="Remove Profile Image"
                        >
                        <Text style={{color:'#495E57'}}>Remove</Text>
                     </Pressable>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.titles}>First name</Text>
                    <TextInput
                        style={styles.input}
                        value = { firstName} 
                        onChangeText={setFirstName}
                        placeholder = "First Name"
                        keyboardType='default'
                    />
                    <Text style={styles.titles}>Last name</Text>
                    <TextInput
                        style={styles.input}
                        value = { lastName} 
                        onChangeText={setLastName}
                        placeholder = "Last Name"
                        keyboardType='default'
                    />
                    <Text style={styles.titles}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value = {email} 
                        onChangeText={setEmail}
                        placeholder = "Email Address"
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />
                    <Text style={styles.titles}>Phone number</Text>
                    <TextInputMask
                        type={'custom'}
                        options={{
                        mask: '(999) 999-9999'
                    }}
                    value={phone}
                    onChangeText={text => setPhone(text)}
                    style={[
                        styles.input,
                        !isPhoneValid && phone.length > 0 && styles.invalidInput
                    ]}
                    placeholder="Phone Number"
                    placeholderTextColor="#666"
                    keyboardType="phone-pad"
                />
                {!isPhoneValid && phone.length > 0 && (
                    <Text style={styles.errorText}>
                     Please enter a valid US phone number
                    </Text>
            )}
                </View> 
                <Text style={styles.email}>Email notification</Text>    
                <View style={styles.checkboxContainer}>
                    <Switch
                        value={orderStatus}
                        onValueChange={(newValue) => setOrderStatus(newValue)}
                        trackColor={{ false: "#767577", true: "#495E57" }}
                        thumbColor={orderStatus ? "#f5dd4b" : "#f4f3f4"}
                    />
                    <Text style={styles.titles}>   Order statuses</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <Switch
                        value={passwordChanges}
                        onValueChange={(newValue) => setPasswordChanges(newValue)}
                        trackColor={{ false: "#767577", true: "#495E57" }}
                        thumbColor={passwordChanges ? "#f5dd4b" : "#f4f3f4"}
                    />
                    <Text style={styles.titles}>   Password changes</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <Switch
                        value={specialOffers}
                        onValueChange={(newValue) => setSpecialOffers(newValue)}
                        trackColor={{ false: "#767577", true: "#495E57" }}
                        thumbColor={specialOffers ? "#f5dd4b" : "#f4f3f4"}
                    />
                    <Text style={styles.titles}>   Special offers</Text>
                </View>  
                <View style={styles.checkboxContainer}>
                    <Switch
                        value={newsletter}
                        onValueChange={(newValue) => setNewsletter(newValue)}
                        trackColor={{ false: "#767577", true: "#495E57" }}
                        thumbColor={newsletter ? "#f5dd4b" : "#f4f3f4"}
                    />
                    <Text style={styles.titles}>   Newsletter</Text>
                </View> 
                <Pressable
                    style={styles.button}
                    onPress={logout}
                    accessibilityLabel="Logout"> 
                    <Text style={{color: '#495E57', fontWeight: 'bold', fontSize: 18, fontFamily: 'times'}}>Log out</Text>
                </Pressable>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Pressable
                        style={styles.discardButton}
                        onPress={discard}
                        accessibilityLabel="Discard"> 
                        <Text style={{color: '#495E57', fontWeight: 'bold'}}>Discard changes</Text>
                    </Pressable>
                    <Pressable
                        style={styles.saveButton}
                        onPress={saveProfile}
                        accessibilityLabel="Save Profile"> 
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Save changes</Text>
                    </Pressable>
                </View>
            </View>
            </ScrollView>
        </View>
    )
}

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
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 50,
        borderWidth: 0.25,
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
    },
    titles: {
        fontSize: 14,
        fontWeight:'600',
        marginBottom: 6,
        color: '#495E57',
    },
    errorText: {
        color: '#FF0000',
        fontSize: 14,
        marginTop: -15,
        marginBottom: 10,
        marginLeft: 5,
      },
      backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#495E57',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
        left: -20,
      },
      mainContainer: {
        borderColor: '#495E57',
        borderWidth: 0.20,
        borderRadius: 10,
        margin: 20,
      },
      personal: {
        fontSize: 20,
        fontWeight: '700',
        margin: 20,
      },
      email: {
        fontSize: 20,
        fontWeight: '700',
        margin: 20,
        marginTop: -10,
      },
      profileImage: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: '#ccc',
        margin: 20,
    },
    initialsContainer: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: '#495E57',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    initials: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'times',
    },
    changeButton: {
        width: 90,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#495E57',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    removeButton: {
        width: 90,
        height: 40,
        borderRadius: 10,
        borderColor: '#495E57', 
        borderWidth: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginBottom: 10,
    },
    checkboxLabel: {
        fontSize: 16,
    },
    button: {
        height: 50,
        width: 350,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFDB58',
        borderRadius: 10,
        margin: 20,
    },
    saveButton: {
        width: 150,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#495E57',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    discardButton: {
        width: 150,
        height: 50,
        borderRadius: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderColor: '#495E57',
        borderWidth: 1,
    },
});

