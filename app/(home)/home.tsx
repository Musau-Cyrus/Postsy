import CustomDrawer from "@/components/common/CustomDrawer";
import { CustomHeader } from "@/components/common/CustomHeader";
import { styles } from "@/styles/_login";
import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
     const [drawerVisible, setDrawerVisible] = useState(false);

    const handleMenuPress = () => {
        setDrawerVisible(true);
    };

    const handleCloseDrawer = () => {
        setDrawerVisible(false);
    };
    return(
        <SafeAreaProvider style={{backgroundColor: '#0e1621'}}>
            <CustomHeader title="Postsy" onMenuPress={handleMenuPress}/>
            <SafeAreaView style={styles.container}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{alignItems: 'center', justifyContent: 'center', paddingTop: 20}}>
                        <Text style={{color: 'white'}}>Welcome to Postsy!</Text>
                    </View>
                </ScrollView>
                <CustomDrawer visible={drawerVisible} onClose={handleCloseDrawer} />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default Home;