import { evaluate } from "mathjs";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";
export default function Calci() {
    const buttons = [
        ['C', 'DEL', '^', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '+'],
        ['1', '2', '3', '-'],
        ['0', '00', '.', '=']
    ]

    const [expression, setexpression] = useState("");
    const [result, setresult] = useState([[]])

    function handleexp(item) {
        setexpression(item)
    }

    function handlepress(btn) {
        Vibration.vibrate(50)
        if (btn === "C") {
            setexpression("");
            setresult("")
        } else if (btn === "DEL") {
            const newexp = expression.slice(0, expression.length - 1);
            setexpression(newexp)
        }
        else if (btn === "=") {
            if (!expression.length || ['÷', '×', '+', '-'].includes(expression[expression.length - 1])) return;
            let newexp = expression.replaceAll("×", "*");
            newexp = newexp.replaceAll("÷", "/");


            try {
                const result = evaluate(newexp);
                setresult((prev) => {
                    return [{
                        value: result,
                        expression: expression
                    }, ...prev]

                })
            }
            catch (err) {
                setresult((prev) => {
                    return [{
                        value: "Syn error",
                        expression: expression
                    }, ...prev]
                })
            }
            setexpression("")

        }

        else if (['÷', '×', '+', '-', '^'].includes(btn)) {
            if (!expression.length && result.length) {
                setexpression(result[0].value + btn)
            }
            else {

                if (['+', '-'].includes(btn)) {
                    if (!expression.length || ['+', '-'].includes(expression[expression.length - 1])) return;
                }
                else if (!expression.length || ['÷', '×', '+', '-', '^'].includes(expression[expression.length - 1])) return;
                // let value = (result.value ? result.value : '')

                if (expression[expression.length - 1] === ".")
                    setexpression(expression + '0' + btn)
                else
                    setexpression(expression + btn)
            }

        }
        else if (btn === ".") {

            for (let i = expression.length - 1; i >= 0; i--) {
                if (expression[i] === '.') return;
                if (['÷', '×', '+', '-', '^'].includes(expression[i])) {
                    break;
                }
            }
            if (!expression.length || ['÷', '×', '+', '-', '^'].includes(expression[expression.length - 1]))
                setexpression(expression + '0' + btn)
            else
                setexpression(expression + btn)
        }
        else {

            setexpression(expression + btn)
        }


    }
    return (
        <View style={styles.bigcontainer}>
            <View style={styles.container}>
                <FlatList
                    data={result}
                    inverted={true}
                    keyExtractor={(_, index) => {
                        return index.toString();
                    }}
                    renderItem={({ item }) => {
                        return (
                            <View>
                                <TouchableOpacity onPress={()=>{
                                    handleexp(item.expression)
                                }}>
                                    <Text style={styles.resultexp}>{item?.expression}</Text>
                                </TouchableOpacity>
                                <Text style={styles.resulttext}>{item?.value}</Text>
                            </View>


                        )
                    }}


                />
                {expression && <Text style={styles.resulttext}>{expression}</Text>}
            </View>
            <View style={styles.btnblock}>
                {
                    buttons.map((row, index) => {
                        return (
                            <View key={index} style={styles.row}>
                                {
                                    row.map((btn, index) => {
                                        return (
                                            <TouchableOpacity key={index} style={styles.btn} onPress={() => {
                                                handlepress(btn);
                                            }} >
                                                <Text style={styles.btntext}>{btn}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        )
                    })

                }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    bigcontainer: {
        backgroundColor: "black",
        flex: 1,
    },
    container: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flex: 1,
        padding: 10
    },
    btn: {
        flex: 1,
        height: 70,
        justifyContent: "center",
        alignItems: "center"
    },
    btnblock: {
        borderTopWidth: 1,
        borderColor: "grey",
        padding: 5
    },
    btntext: {
        color: "white",
        fontSize: 18
    },
    row: {
        flexDirection: "row",

    },
    resulttext: {
        textAlign: "right",
        color: 'white',
        fontSize: 24
    },
    resultexp: {
        textAlign: "right",
        color: 'grey',
        fontSize: 20
    }

})