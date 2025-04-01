import React from 'react';
import { Pressable, Image, Text, View, StyleSheet } from 'react-native';

const ProfileImage = ({ profileImage, firstName, lastName, onPress, customStyle = {} }) => (
    <Pressable onPress={onPress}>
        {profileImage ? (
            <Image source={{ uri: profileImage }} style={[styles.profileImage, customStyle]} />
        ) : (
            <View style={[styles.initialsContainer, customStyle]}>
                <Text style={styles.initials}>
                    {(firstName?.charAt(0) || '').toUpperCase()}
                    {(lastName?.charAt(0) || '').toUpperCase()}
                </Text>
            </View>
        )}
    </Pressable>
);

const styles = StyleSheet.create({
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    initialsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    initials: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    }
});

export default ProfileImage;
