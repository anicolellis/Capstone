import React, {useState, useMemo, useEffect} from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Alert } from "react-native";
import { RootStackParamList } from './App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RadioGroup, {RadioButtonProps}  from 'react-native-radio-buttons-group';
import { HorizonData } from './Data/HorizonData'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_BASE } from './Data/Urls'
import EncryptedStorage from 'react-native-encrypted-storage';

/*
Horizon form: Second page
Author: Alex Nicolellis

This page contains the Horizon form checklist, as well as the form submission.
Similar to Astronaut page 5.
*/

type Props = NativeStackScreenProps<RootStackParamList, 'HorizonForm2'>;

var keyGen = 0;

interface ChecklistItem {
    description: string;
    value: string; // YES, NO, or N/A
}

export const HorizonForm2 = ({route, navigation}: Props) => {
    const { farm,first,last,num,street,zip,city,country,
        lelynum,lelyname,lelyarea,coordname, } = route.params;

    const [rows, setRows] = useState<Array<ChecklistItem>>([{description: "", value: "" }]);


    const radioButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: '1',
            label: 'YES',
            value: 'yes',
        },
        {
            id: '2',
            label: 'NO',
            value: 'no'
        },
        {
            id: '3',
            label: 'N/A',
            value: 'na'
        }
    ]), []);

    useEffect(() =>{
        const fillRows = () => {
            setRows(prevRows => {
                if (prevRows.length == 0) {
                    return prevRows;
                }
                return [];
            });
            for (var item of HorizonData) {
                addRow(item.description);
            }
        };
        fillRows();
    }, [])

    const submitForm = async() => {
        const keys = ['username', 'customerNumber', 'customerLastName']; 
        const result = await AsyncStorage.multiGet(keys);
        const items = Object.fromEntries(result);
        const token = await EncryptedStorage.getItem("token");
        const username = items.username;
        const lastName = items.customerLastName;
        const custNum = items.customerNumber;
        
        console.log('Stored token:', token);
        console.log('Stored username:', username);

        if (!token) {
            console.error('No token found');
            return; 
        }

        if (!lastName || !custNum) {
            console.error('Customer info not found');
            return;
        }

        const url=`${URL_BASE}/forms/horizon/add/${lastName}/${custNum}/`;

        const requestOptions= {
            method: 'POST',
            headers: { 
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                userInfo: {
                    farm:farm,
                    first:first,
                    last:last,
                    num:num,
                    street:street,
                    zip:zip,
                    city:city,
                    country:country,
                },
                lelyInfo: {
                    num:lelynum,
                    name:lelyname,
                    area:lelyarea,
                    coordname:coordname,
                }, 
                checklistVals:getAllVals(rows)
            })
        };
        console.log('Token: ', token)
        console.log('Page 1 Data:', { farm,
            first,
            last,
            num,
            street,
            zip,
            city,
            country,
            lelynum,
            lelyname,
            lelyarea,
            coordname,
        });
        console.log('Page 2 Data: ', rows);
        console.log(requestOptions.body);
        try {
          await fetch( url, requestOptions )
          .then(response => {
            if (response.status === 200) {
                console.log("Form submission complete! ",
                response.json());
                Alert.alert('Submission Complete!', 'Returning to form selection.', [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate("FormSelection"),
                    }
                ]);
            } else {
                console.log("Error with form submission. Message: ", response.json());
                Alert.alert('Error with submission.', 'Please check your responses.', [
                    {
                        text: 'OK',
                    }
                ]);
            }
          });
        }
        catch (error) {
          console.error(error);
        }
    }

    const addRow = (d: string) => {
        setRows(prevRows => {
            return [ ...prevRows, {description: d, value: "" } ];
        });
    }
    const changeValue = (index:number, val: string) => {
        setRows(prevRows => {
            return [ ...prevRows.slice(0, index), {description: prevRows[index].description, value: val }, ...prevRows.slice(index+1)];
        });
    }
    const getAllVals = (arr:Array<ChecklistItem>) => {
        return rows.map(function(x) { return x.value; })
    }
    return (
        <SafeAreaView>
        <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Horizon Server Installation Checklist</Text>
        <View style={styles.table}>
            {rows.map((item, idx) => (
            <View key={keyGen++}>
                <View style={styles.row}>
                    <Text style={styles.cell}>{rows[idx].description}</Text>
                    
                </View>
                <View style={styles.row}>
                    
                    <RadioGroup
                        radioButtons={radioButtons}
                        onPress={(val) => changeValue(idx, val)}
                        selectedId={rows[idx].value}
                        layout='row'
                        containerStyle={styles.radioGroup}
                    />
                </View>
            </View>
            ))}
        <Pressable
            style={styles.button}
            onPress={() => {console.log(rows)}}>
            <Text style={styles.buttonText}>Check State</Text>
        </Pressable>
        <Pressable
            style={styles.button}
            onPress={() => {submitForm()}}>
            <Text style={styles.buttonText}>Submit</Text>
        </Pressable>

        </View>
        </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    ddcontainer: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#c30a14',
        marginBottom: 1,
    },
    table: {
       borderWidth: 1,
       borderColor: "black",
       marginBottom: 10,
       marginTop: 10,
    },
    row: {
       flexDirection: "row",
       justifyContent: "center",
       alignItems: "center",
       backgroundColor: "white",
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        marginBottom: 50
     },
    cell: {
       flex: 1,
       padding: 10,
       borderWidth: 1,
       width: 200,
       textAlign: "center",
       fontSize: 14,
       color: "black",
       borderColor: "black",
       marginBottom: 10,
       marginTop:20,
    },
    headerCell: {
       flex: 1,
       padding: 10,
       borderWidth: 1,
       width: 200,
       height: 40,
       textAlign: "center",
       fontSize: 14,
       color: "black",
       borderColor: "black",
    },
    scrollView: {
        marginHorizontal: 10,
    },
    buttonText: {
        color: 'white'
    },
    button: {
        backgroundColor: '#850c18',
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    radioGroup: {
        marginBottom: 10
    },
 });