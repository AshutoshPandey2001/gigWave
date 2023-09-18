import React, { FC } from 'react';
import { Alert } from 'react-native';

interface ErrorAlertProps {
    title: string;
    message: string;
}

const CommanAlertBox = ({ title, message }: ErrorAlertProps) => {
    return (
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'OK',
                    onPress: () => {},
                },
            ],
            {
                cancelable: true,
                onDismiss: () => {

                }
            },
        )
    );
};

export default CommanAlertBox;
