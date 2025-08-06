import {AntDesign, Feather, FontAwesome} from "@expo/vector-icons"
import { Tabs } from "expo-router"

const HomeRootLayout = () => {
    return (
        <Tabs screenOptions ={{
            tabBarActiveTintColor: '#0F172A',
            tabBarInactiveTintColor: '#64748B',
            headerShown: false,
           tabBarStyle: {
                backgroundColor: '#1E293B',
                borderTopWidth: 1,
                borderTopColor: '#1E293B',
                height: 62,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
                marginTop: 4,
            },
            headerStyle: {
                backgroundColor: '#1E293B',
            },
            headerTitleStyle: {
                color: '#F8FAFC',
            },
            headerTintColor: '#F8FAFC',
        }}>
            <Tabs.Screen name='home' options={{
                tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color}/>,
                headerStyle: {
                    backgroundColor: '#0F172A',
                },
            }} />
            <Tabs.Screen name="search" options={{
                tabBarIcon: ({ color }) =>
                    <Feather name="search" size={24} color={color}/>,
                headerStyle: {
                    backgroundColor: '#0F172A',
                },
            }}/>
            <Tabs.Screen name="new_post" options={{
                title: "New",
                headerShown: false,
                tabBarIcon: ({ color }) =>
                    <AntDesign name="plus" size={24} color={color}/>,
                headerStyle: {
                    backgroundColor: '#0F172A',
                },
            }} />
            <Tabs.Screen name="profile" options={{
                title: "Profile",
                headerShown: false,
                tabBarIcon: ({ color }) =>
                    <FontAwesome name="user-o" size={24} color={color} />,
                headerStyle: {
                    backgroundColor: '#0F172A',
                },
            }} />
            
        </Tabs>
    )
}

export default HomeRootLayout;