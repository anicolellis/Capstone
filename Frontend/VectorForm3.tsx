import React, {useState, useMemo, useEffect} from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, Alert, Pressable } from "react-native";
import { RootStackParamList } from './App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RadioGroup, {RadioButtonProps}  from 'react-native-radio-buttons-group';
import { VectorData } from './Data/VectorData'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_BASE } from './Data/Urls'
import EncryptedStorage from 'react-native-encrypted-storage';

/*
Vector form: Third page
Author: Alex Nicolellis

This page contains the Vector form checklist, as well as the form submission.
Similar to Astronaut page 5.
*/

type Props = NativeStackScreenProps<RootStackParamList, 'VectorForm3'>;

var keyGen = 0;

interface VectorItem {
    description: string;
    code: number;
    who: boolean; // false = lely, true = customer
    value: string; // OK, Missing, or Insufficient
    remarks: string;
}

export const VectorForm3 = ({route, navigation}: Props) => {
    const { farm,first,last,num,street,zip,city,country,
        lelynum,lelyname,lelyarea,coordname,installco,
        machineTypes,machineDates,machineItemNos,machineSerialNos } = route.params;

    const [rows, setRows] = useState<Array<VectorItem>>([{description: "", code: -1, who: false, value: "", remarks: "" }]);


    const radioButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: '1',
            label: 'OK',
            value: 'ok'
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

    useEffect(() =>{
        const fillRows = () => {
            for (var item of VectorData) {
                addRow(item.description, item.code, item.who);
            }
            setRows(prevRows => {
                return [...prevRows.slice(1)];
            });
        };
        fillRows();
    }, [])

    const submitForm = async() => {
        const keys = ['token', 'username', 'customerNumber', 'customerLastName']; 
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
        const url=`${URL_BASE}/forms/vector/add/${lastName}/${custNum}/`;
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
                    installco:installco,
                }, 
                machineTypes:machineTypes,
                machineDates:machineDates,
                machineItemNos:machineItemNos,
                machineSerialNos:machineSerialNos,
                vectorVals:getAllVals(rows),
                vectorRemarks:getAllRemarks(rows)
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
            installco });
        console.log('Page 2 Data: ', {
            machineTypes,machineDates,machineItemNos,machineSerialNos
        });
        console.log('Page 3 Data: ', rows);
        console.log(requestOptions.body);
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

    const addRow = (d: string, c:number, w:boolean) => {
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
    const getAllVals = (arr:Array<VectorItem>) => {
        return rows.map(function(x) { return x.value; })
    }
    const getAllRemarks = (arr:Array<VectorItem>) => {
        return rows.map(function(x) { return x.remarks; })
    }
    return (
        <SafeAreaView>
        <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Handover Appendix Lely Vector</Text>
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