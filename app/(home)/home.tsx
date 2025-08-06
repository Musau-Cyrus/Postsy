import CustomDrawer from "@/components/common/CustomDrawer";
import { CustomHeader } from "@/components/common/CustomHeader";
import PostCard from "@/components/PostCard";
import { useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaProvider, } from "react-native-safe-area-context";

const Home = () => {
     const [drawerVisible, setDrawerVisible] = useState(false);

    const handleMenuPress = () => {
        setDrawerVisible(true);
    };

    const handleCloseDrawer = () => {
        setDrawerVisible(false);
    };
    return(
        <SafeAreaProvider style={{backgroundColor: '#0b1120'}}>
            <View style={{paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b',}}>
                <CustomHeader title="Postsy" onMenuPress={handleMenuPress}/>
            </View>
                <ScrollView style={{ flex: 1, paddingTop: 16 }}>
                  <PostCard
                            username="Cyrus Musau"
                            handle="cyrus"
                            timeAgo="2h"
                            text="Loving the new React Native layout I built.\nPurple theme hits different 💜🔥"
                        />
                    <PostCard
                            username="Cyrus Musau"
                            handle="cyrus"
                            timeAgo="2h"
                            text="Loving the new React Native layout I built.\nPurple theme hits different 💜🔥"
                        />
                        <PostCard
                            username="Cyrus Musau"
                            handle="cyrus"
                            timeAgo="2h"
                            text="Loving the new React Native layout I built.\nPurple theme hits different 💜🔥"
                        />
                        <PostCard
                            username="Cyrus Musau"
                            handle="cyrus"
                            timeAgo="2h"
                            text="Loving the new React Native layout I built.\nPurple theme hits different 💜🔥"
                        />
                        <PostCard
                            username="Cyrus Musau"
                            handle="cyrus"
                            timeAgo="2h"
                            text="Loving the new React Native layout I built.\nPurple theme hits different 💜🔥"
                        />
                        <PostCard
                            username="Cyrus Musau"
                            handle="cyrus"
                            timeAgo="2h"
                            text="Loving the new React Native layout I built.\nPurple theme hits different 💜🔥"
                        />
                        <PostCard
                            username="Cyrus Musau"
                            handle="cyrus"
                            timeAgo="2h"
                            text="Loving the new React Native layout I built.\nPurple theme hits different 💜🔥"
                        />
                        <PostCard
                            username="Cyrus Musau"
                            handle="cyrus"
                            timeAgo="2h"
                            text="Loving the new React Native layout I built.\nPurple theme hits different 💜🔥"
                        />
                        <PostCard
                            username="Cyrus Musau"
                            handle="cyrus"
                            timeAgo="2h"
                            text="Loving the new React Native layout I built.\nPurple theme hits different 💜🔥"
                        />
                </ScrollView>
                <CustomDrawer visible={drawerVisible} onClose={handleCloseDrawer}/>
            
        </SafeAreaProvider>
    )
}

export default Home;