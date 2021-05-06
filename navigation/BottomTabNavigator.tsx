import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Image } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TuneInScreen from '../screens/tuneIn/TuneInScreen';
import QuestionsListScreen from '../screens/tuneIn/QuestionsListScreen';
import AlignScreen from '../screens/align/AlignScreen';
import { BottomTabParamList, TuneInParamList, TabTwoParamList } from '../types';
import TabBarIcon from '../components/TabBarIcon';
import AnswerQuestionScreen from '../screens/tuneIn/AnswerQuestionScreen';
import CategoryScreen from '../screens/align/CategoryScreen';
import { DigitalThoughtsContext } from '../state';
import OpportunityScreen from '../screens/align/OpportunityScreen';
import ActScreen from '../screens/act/ActScreen';
import ArchiveScreen from '../screens/act/ArchiveScreen';
const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const [dtState, dtDispatch] = useContext(DigitalThoughtsContext);
  const { newResponses } = dtState;

  return (
    <BottomTab.Navigator
      initialRouteName="Tune In"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Tune In"
        component={TuneInNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="tuneIn"
              colorScheme={colorScheme}
              focused={focused}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Align"
        component={AlignNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="align"
              colorScheme={colorScheme}
              focused={focused}
              alerted={newResponses}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Act"
        component={ActNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="act"
              colorScheme={colorScheme}
              focused={focused}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

const TuneInStack = createStackNavigator();

function TuneInNavigator() {
  return (
    <TuneInStack.Navigator>
      <TuneInStack.Screen
        name="TuneInScreen"
        component={TuneInScreen}
        options={{ headerTitle: 'Tune In' }}
      />
      <TuneInStack.Screen
        name="QuestionListScreen"
        component={QuestionsListScreen}
      />
      <TuneInStack.Screen
        name="AnswerQuestionScreen"
        component={AnswerQuestionScreen}
      />
    </TuneInStack.Navigator>
  );
}

const AlignStack = createStackNavigator();

function AlignNavigator() {
  return (
    <AlignStack.Navigator>
      <AlignStack.Screen
        name="AlignScreen"
        component={AlignScreen}
        options={{ headerTitle: 'Align' }}
      />
      <AlignStack.Screen name="CategoryScreen" component={CategoryScreen} />
      <AlignStack.Screen
        name="OpportunityScreen"
        component={OpportunityScreen}
        options={({ route }) => ({
          title: route.params.pageTitle,
        })}
      />
    </AlignStack.Navigator>
  );
}

const ActStack = createStackNavigator();

const ActNavigator = () => {
  return (
    <ActStack.Navigator>
      <ActStack.Screen
        name="ActScreen"
        component={ActScreen}
        options={{ title: 'Act' }}
      />
      <ActStack.Screen name="ArchiveScreen" component={ArchiveScreen} />

      {/* <ActStack.Screen
        name="OpportunityScreen"
        component={OpportunityScreen}
      /> */}
    </ActStack.Navigator>
  );
};
