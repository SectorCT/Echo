import React from "react";

import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "../screens/Routes";

import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles";

import ImageButton from "./ImageButton";

type TopBarProps = {
	navigation: StackNavigationProp<HomeStackParamList>;
};

export default function TopBar({ navigation }: TopBarProps) {

	return (
		<View style={styles.topbar__container}>
			<ImageButton imageSource={require("../assets/addPeople.png")} style={styles.topbar__imageItem}
				onPress={() => {
					navigation.navigate("AddPeopleOrSeeCode");
				}}
			/>
			<Text style={styles.topbar__text}>Shush</Text>
			<ImageButton imageSource={require("../assets/settings.png")} style={styles.topbar__imageItem}
				onPress={() => {
					navigation.navigate("InviteDevice");
				}}
			/>

		</View>
	);
}

const styles = StyleSheet.create({
	topbar__container: {
		backgroundColor: colors.primary,
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
	topbar__text: {
		fontSize: 35,
		fontWeight: "bold",
		color: "#fff",
		justifyContent: "center",
	},
	topbar__people: {
		justifyContent: "flex-start",
	},
	topbar__imageItem: {
		width: 40,
		height: 40,
	}
});
