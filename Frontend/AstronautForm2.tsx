import React, {useState, useEffect} from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, Pressable } from "react-native";
import { RootStackParamList } from './App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_BASE } from './Data/Urls'
import EncryptedStorage from 'react-native-encrypted-storage';

/*
Astronaut form: Second page
Author: Alex Nicolellis

This page contains machine information. It can have any number of entries, and the size is customizable by the user.
*/

// Define which item in App.tsx's RootStackParamList this screen maps to
type Props = NativeStackScreenProps<RootStackParamList, 'AstronautForm2'>;

// Used to generate unique keys when rendering components in a loop
var keyGen = 0;

// Custom type used to store machine information data in an array
interface MInfo {
    type: string;
    date: string;
    item_no: string;
    serial_no: string;
}

export const AstronautForm2 = ({route, navigation}: Props) => {
    // Receiving data from the previous form page
    const { farm,
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
        coordname
    } = route.params;

    // Declare array to store all machine information
    const [rows, setRows] = useState<Array<MInfo>>([{
        type: "", date: "", item_no: "", serial_no: "" }]);
    
    // Code run upon reloading the page
    useEffect(() =>{
        const fetchUserData = async() => {
            try {
                // Get customer data (see page 1) and use it to pre-fill the machine types in their project.
                const keys = ['username', 'customerNumber', 'customerLastName']; 
                const result = await AsyncStorage.multiGet(keys);
                const items = Object.fromEntries(result);
                const token = await EncryptedStorage.getItem("token");
                const username = items.username;
                const lastName = items.customerLastName;
                const custNum = items.customerNumber;
        
                if (!token || !username) {
                  console.error('No token or username found');
                  return;
                }

                if (!lastName || !custNum) {
                  console.error('Customer info not found');
                  return;
                }
        
                const response = await fetch(`${URL_BASE}/customerInfo/${lastName}/${custNum}/`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                  },
                });
        
                if (!response.ok) {
                  console.log('Failed to fetch user info');
                  return;
                }
        
                const data = await response.json();
                const installs = data["installations"];
                console.log('Got installs: ', installs);
                // Populate the array with the known machines. This process is hacky and not very good.

                // This order is arbitrary and requires manually updating when adding new machines to the app. Should be stored in the database.
                const formNames = ['Astronaut', 'Vector', 'Horizon'];
                // Installs is a string, this only works if each machine has a single digit number.
                console.log('Info: ', installs.length, installs[0], installs[3], installs[6])
                removeRow();
                for(var i=0;i<installs.length;i+=3) {
                    for(var j=0;j<installs[i];j++){
                        setRows(prevRows => {
                            return [ ...prevRows, {type: formNames[i/3], isFocus: false, date: "", item_no: "", serial_no: "" } ];
                        });
                    }
                }

              } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };
        fetchUserData();
    }, [])

    const nextPage = () => {
        navigation.navigate("AstronautForm3", {
            farm:farm,
            first:first,
            last:last,
            num:num,
            street:street,
            zip:zip,
            city:city,
            country:country,
            lelynum:lelynum,
            lelyname:lelyname,
            lelyarea:lelyarea,
            coordname:coordname,
            machineTypes:getAllTypes(rows),
            machineDates:getAllDates(rows),
            machineItemNos:getAllItemNos(rows),
            machineSerialNos:getAllSerials(rows)
        });
    };

    // Add blank machine at the end of the array for the customer to fill out
    const addRow = () => {
        setRows(prevRows => {
            return [ ...prevRows, {type: "", isFocus: false, date: "", item_no: "", serial_no: "" } ];
        });
    }
    // Change the type field of a given row
    const changeType = (index:number, value:string) => {
        setRows(prevRows => {
            return [ ...prevRows.slice(0, index), {type: value, date: prevRows[index].date, item_no: prevRows[index].item_no, serial_no: prevRows[index].serial_no }, ...prevRows.slice(index+1)];
        });
    }
    // Change the date field of a given row
    const changeDate = (index:number, value: string) => {
        setRows(prevRows => {
            return [ ...prevRows.slice(0, index), {type: prevRows[index].type, date: value, item_no: prevRows[index].item_no, serial_no: prevRows[index].serial_no }, ...prevRows.slice(index+1)];
        });
    }
    // Change the item number field of a given row
    const changeItemNo = (index:number, value: string) => {
        setRows(prevRows => {
            return [ ...prevRows.slice(0, index), {type: prevRows[index].type, date: prevRows[index].date, item_no: value, serial_no: prevRows[index].serial_no }, ...prevRows.slice(index+1)];
        });
    }
    // Change the serial number field of a given row
    const changeSerialNo = (index:number, value: string) => {
        setRows(prevRows => {
            return [ ...prevRows.slice(0, index), {type: prevRows[index].type, date: prevRows[index].date, item_no: prevRows[index].item_no, serial_no: value }, ...prevRows.slice(index+1)];
        });
    }
    // Remove the last row
    const removeRow = () => {
        setRows(prevRows => {
            return [ ...prevRows.slice(0, -1)];
        });
    }
    // Remove a specified row
    const removeSpecificRow = (index:number) => {
        setRows(prevRows => {
            return [ ...prevRows.slice(0, index), ...prevRows.slice(index+1)];
        });
    }
    // Get an array of just the type fields for all machines
    const getAllTypes = (arr:Array<MInfo>) => {
        return rows.map(function(x) { return x.type; })
    }
    // Get an array of just the date fields for all machines
    const getAllDates = (arr:Array<MInfo>) => {
        return rows.map(function(x) { return x.date; })
    }
    // Get an array of just the item no fields for all machines
    const getAllItemNos = (arr:Array<MInfo>) => {
        return rows.map(function(x) { return x.item_no; })
    }
    // Get an array of just the serial no fields for all machines
    const getAllSerials = (arr:Array<MInfo>) => {
        return rows.map(function(x) { return x.serial_no; })
    }

    // The screen is populated by looping through the array and generating a set of components for each row.
    return (
        <SafeAreaView>
        <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Machine Information</Text>
        <View style={styles.table}>
            {rows.map((item, idx) => (
            <View key={keyGen++}>
                <View style={styles.row}>
                    <Text style={styles.headerCell}>Machine Type</Text>
                    <Text style={styles.headerCell}>Start Up Date</Text>
                    
                </View>
                <View style={styles.row}>
                    
                    <TextInput
                        style={styles.cell}
                        value={rows[idx].type}
                        onChangeText={(e) => changeType(idx, e)}
                    />
                    <TextInput
                        style={styles.cell}
                        value={rows[idx].date}
                        onChangeText={(e) => changeDate(idx, e)}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.headerCell}>Item No.</Text>
                    <Text style={styles.headerCell}>Serial No.</Text>
                    
                </View>
                <View style={styles.row}>
                    
                    <TextInput
                        style={styles.cell}
                        value={rows[idx].item_no}
                        onChangeText={(e) => changeItemNo(idx, e)}
                    />
                    <TextInput
                        style={styles.cell}
                        value={rows[idx].serial_no}
                        onChangeText={(e) => changeSerialNo(idx, e)}
                    />
                </View>
                <View style={styles.row}>
                
                    <Pressable
                        style={styles.rowButton}
                        onPress={() => removeSpecificRow(idx)}>
                        <Text style={styles.buttonText}>Remove</Text>
                    </Pressable>
                </View>
            </View>
            ))}
        <Pressable
            style={styles.button}
            onPress={() => addRow()}>
            <Text style={styles.buttonText}>Add New Machine</Text>
        </Pressable>
        <Pressable
            style={styles.button}
            onPress={() => removeRow()}>
            <Text style={styles.buttonText}>Remove Last Machine</Text>
        </Pressable>
        <Pressable
            style={styles.button}
            onPress={() => {nextPage()}}>
            <Text style={styles.buttonText}>Next Page</Text>
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
       backgroundColor: "#fff",
    },
    cell: {
       flex: 1,
       padding: 10,
       borderWidth: 1,
       width: 200,
       height: 70,
       textAlign: "center",
       fontSize: 14,
       color: "black",
       borderColor: "black",
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
    rowButton: {
        backgroundColor: '#c30a14',
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 10,
        marginBottom: 50,
    },
    buttonText: {
        color: 'white'
    },
    button: {
        backgroundColor: '#c30a14',
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
 });