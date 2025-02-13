import React from "react";

import { StyleSheet, View, TouchableOpacity } from "react-native";
import { colors } from "../styles";

import { FontAwesome } from "@expo/vector-icons";

import ShushLogoAndText from "./ShushLogoAndText";

export default function TopBar() {

	return (
		<View style={styles.container}>
			<ShushLogoAndText text="Shush!" ContainerStyle={{marginBottom:0}}/>
			<View style={styles.buttons}>
				<TouchableOpacity onPress={() => {/*navigation.navigate("AddPeopleOrSeeCode");*/}}>
					<FontAwesome name="user-plus" size={30} color="white" />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => {/*navigation.navigate("InviteDevice");*/}}>
					<FontAwesome name="bars" size={30} color="white" />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.backgroundColor,
		height: 100,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 20,
		fontWeight: 400,
		fontSize: 29,
		lineHeight: 43,
	},
	buttons: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: 70,
	},
});

