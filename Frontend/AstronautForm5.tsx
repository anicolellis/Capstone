import React, {useState, useMemo, useEffect} from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, Pressable, Alert } from "react-native";
import { RootStackParamList } from './App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RadioGroup, {RadioButtonProps}  from 'react-native-radio-buttons-group';
import { AstronautData3 } from './Data/AstronautData'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_BASE } from './Data/Urls'
import EncryptedStorage from 'react-native-encrypted-storage';

/*
Astronaut form: Fifth page
Author: Alex Nicolellis

This page contains part of the Astronaut form checklist, as well as the form submission.
*/

// Define which item in App.tsx's RootStackParamList this screen maps to
type Props = NativeStackScreenProps<RootStackParamList, 'AstronautForm5'>;

// Used to generate unique keys when rendering components in a loop
var keyGen = 0;

// Custom type used to store checklist data in an array
interface ChecklistItem {
    description: string;
    code: string;
    who: boolean; // false = lely, true = customer
    value: string; // OK, Missing, or Insufficient
    remarks: string;
}

export const AstronautForm5 = ({route, navigation}: Props) => {
    // Receiving data from the previous form page
    const { farm,first,last,num,street,zip,city,country,
        lelynum,lelyname,lelyarea,coordname,
        machineTypes,machineDates,machineItemNos,machineSerialNos,
        checklistVals1, checklistRemarks1, checklistVals2, checklistRemarks2 } = route.params;

    // Declare array to store all machine information
    const [rows, setRows] = useState<Array<ChecklistItem>>([{description: "", code: "", who: false, value: "", remarks: "" }]);

    // Define the options for the radio button component
    const radioButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: '1',
            label: 'OK',
            value: 'ok',
        },
        {
            id: '2',
            label: 'Missing',
            value: 'missing'
        },
        {
            id: '3',
            label: 'Insufficient',
            value: 'insufficient'
        }
    ]), []);

    // Code run upon reloading the page
    useEffect(() =>{
        // Use the checklist information stored in AstronautData.tsx to populate the array
        const fillRows = () => {
            for (var item of AstronautData3) {
                addRow(item.description, item.code, item.who);
            }
            setRows(prevRows => {
                return [...prevRows.slice(1)];
            });
        };
        fillRows();
    }, [])

    // Form submission
    const submitForm = async() => {
        // Get data from app storage
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

        // Url for the addAstronaut view
        const url=`${URL_BASE}/forms/astronaut/add/${lastName}/${custNum}/`;

        // Put all the form data in the request body
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
                machineTypes:machineTypes,
                machineDates:machineDates,
                machineItemNos:machineItemNos,
                machineSerialNos:machineSerialNos,
                checklistVals:checklistVals1.concat(checklistVals2).concat(getAllVals(rows)),
                checklistRemarks:checklistRemarks1.concat(checklistRemarks2).concat(getAllRemarks(rows))
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
        console.log('Page 2 Data: ', {
            machineTypes,machineDates,machineItemNos,machineSerialNos
        });
        console.log('Page 3 Data: ', rows);
        console.log(requestOptions.body);
        // Upon a successful response, go back to the form selection screen
        try {
          await fetch( url, requestOptions )
          .then(response => {
            response.json()
              .then(data => {
                console.log("Form submission complete! ",
                data);
                Alert.alert('Submission Complete!', 'Returning to form selection.', [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate("FormSelection"),
                    }
                ]);
                
              });
          })
        }
        catch (error) {
          console.error(error);
        }
    }
    // Similar helper functions to page 2
    const addRow = (d: string, c:string, w:boolean) => {
        setRows(prevRows => {
            return [ ...prevRows, {description: d, code: c, who: w, value: "", remarks: "" } ];
        });
    }
    const changeValue = (index:number, val: string) => {
        setRows(prevRows => {
            return [ ...prevRows.slice(0, index), {description: prevRows[index].description, code: prevRows[index].code, who: prevRows[index].who, value: val, remarks: prevRows[index].remarks }, ...prevRows.slice(index+1)];
        });
    }
    const changeRemarks = (index:number, val: string) => {
        setRows(prevRows => {
            return [ ...prevRows.slice(0, index), {description: prevRows[index].description, code: prevRows[index].code, who: prevRows[index].who, value: prevRows[index].value, remarks: val }, ...prevRows.slice(index+1)];
        });
    }
    const getAllVals = (arr:Array<ChecklistItem>) => {
        return rows.map(function(x) { return x.value; })
    }
    const getAllRemarks = (arr:Array<ChecklistItem>) => {
        return rows.map(function(x) { return x.remarks; })
    }
    // The screen is populated by looping through the array and generating a set of components for each row.
    return (
        <SafeAreaView>
        <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Checklist: Lely Astronaut Milking System (LAM)</Text>
        <View style={styles.table}>
            {rows.map((item, idx) => (
            <View key={keyGen++}>
                <View style={styles.row}>
                    <Text style={styles.cell}>{rows[idx].description}</Text>
                    
                </View>
                <View style={styles.row}>
                    <Text style={styles.cell}>Code: {rows[idx].code}</Text>
                    <Text style={styles.cell}>Who: {rows[idx].who == false ? "Lely" : "Customer"}</Text>
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
                <View style={styles.bottomRow}>
                    
                    <TextInput
                        style={styles.cell}
                        value={rows[idx].remarks}
                        placeholder="Remarks"
                        onChangeText={(val) => changeRemarks(idx, val)}
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