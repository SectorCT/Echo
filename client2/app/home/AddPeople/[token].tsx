import React, { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from "react-native";
import { colors } from "../../..//styles";

import { makeRequest } from "../../../utils/requests";
import { router, useLocalSearchParams } from "expo-router";


export default function AddPeople() {

    const { inviteToken: tokenFromParams } = useLocalSearchParams();
    const [inviteToken, setInviteToken] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (tokenFromParams) {
          setInviteToken(tokenFromParams as string);
        }
      }, [tokenFromParams]);

    function verrifyToken() {
        if (inviteToken.length === 8) {
            return true;
        }
        setError("Token must be 8 characters long");
        return false;
    }

    function handleSubmit() {
        if (!verrifyToken()) {
            return;
        }
        makeRequest("authentication/make_friends/", "POST", { friend_token: inviteToken }).then((response:any) => {
            if (response === null) {
                console.log("error");
                return;
            }

            if (response.status === 200) {
                response.json().then((data:any) => {
                    if (data.status === "success") {
                        router.navigate("/home/HomeScreen");
                    } else {
                        console.log(data.message);
                    }
                });
            } else {
                console.log("error");
            }
        }
        );
    }


    // const handleInviteTokenChange = debounce((value) => {
    //     setInviteToken(value.toUpperCase());
    // }, 0);

    return (
        <>
            <StatusBar style="light" />
            <View style={styles.islandHider} />
            <View style={styles.container}>
                <View style={styles.header} >
                    <Text style={styles.header_title}>Add People</Text>
                </View>
                {/* Invite */}
                <View style={styles.main}>
                    <View style={styles.invite_container}>
                        <Text style={styles.invite_text}>
                            Insert{" "}
                            <Text style={styles.invite_text_blue}>invite code</Text>
                        </Text>
                        <View style={styles.input}>
                            <TextInput
                                style={styles.input__field}
                                value={inviteToken}
                                placeholder="Insert code"
                                placeholderTextColor={colors.complimentary}
                                onChangeText={(value) => { setInviteToken(value.toUpperCase()); }}
                                maxLength={20}
                            />
                            <TouchableOpacity onPress={() => { router.navigate("/QRScanner");}}>
                                <Image source={require("../../../assets/scanQr.png")} style={styles.input__field_button} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {error !== "" &&
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorContainer_text}>{error}</Text>
                        </View>
                    }
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.button_text}>Add Friend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { router.navigate("/home/HomeScreen"); }}>
                        <Text style={styles.button_text}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    main: {
        flex: 1,
        margin: 40,
    },
    islandHider: {
        backgroundColor: colors.primary,
        height: 35,
        width: "100%",
    },
    container: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
        width: "100%",
    },
    header: {
        backgroundColor: colors.primary,
        height: 60,
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingHorizontal: 30,
    },
    header_title: {
        color: colors.accent,
        fontSize: 40,
        // fontFamily: fonts.primary,
    },
    invite_text: {
        color: colors.white,
        fontWeight: "400",
        fontSize: 35,
        lineHeight: 37,
        flex: 0.25,
        width: "100%"
    },
    invite_text_blue: {
        color: "#4BB2DE",
    },
    invite_container: {
        flex: 1,
        padding: 0
    },
    input: {
        padding: 10,
        width: "100%",
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 30,
        color: colors.white,
        marginTop: 20,
        flex: 0.3

    },
    input__field: {
        padding: 10,
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        height: 70,
        fontSize: 30,
        color: colors.white,
        borderBottomColor: colors.secondary,
        borderBottomWidth: 2,
        marginTop: 20,
    },
    input__field_button: {
        height: 37,
        aspectRatio: "1/1",
        marginTop: 20,
    },
    qr_container: {
        flex: 1.5,
        width: "100%"
    },
    button: {
        backgroundColor: colors.secondary,
        color: colors.primary,
        borderRadius: 15,
        margin: 0,
        marginBottom: 20,
        width: "100%",
        height: 70,
        alignItems: "center",
        justifyContent: "center",
    },
    button_text: {
        fontSize: 30,
        color: colors.white
    },
    errorContainer: {
        backgroundColor: colors.secondary,
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 15,
        padding: 20,
        marginBottom: 20
    },
    errorContainer_text: {
        color: colors.white,
        fontSize: 20,
    }
});