import { View, Text, Image, ActivityIndicator, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { CreateTripContext } from '../../context/CreateTripContext'
import { AI_PROMPT } from '../../constants/Options'
import { chatSession } from '../../configs/AiModal'
import { useRouter } from 'expo-router'
import { auth, db } from './../../configs/firebaseConfig'
import { collection, doc, setDoc } from 'firebase/firestore'

export default function GenerateTrip() {
  const { tripData, setTripData } = useContext(CreateTripContext)
  const [loading, setLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const router = useRouter()
  const user = auth.currentUser

  useEffect(() => {
    generateAiTrip()
  }, [])

  const generateAiTrip = async () => {
    setLoading(true)

    const FINAL_PROMPT = buildFinalPrompt()

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT)
      const responseText = await result.response.text()

      if (responseText) {
        try {
          const tripResp = JSON.parse(responseText)
          await saveTripToFirestore(tripResp)
          setLoading(false)
          router.push('(tabs)/mytrip')
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError)
          await retryAiRequest(FINAL_PROMPT)
        }
      } else {
        console.error("Empty response from AI service.")
        await retryAiRequest(FINAL_PROMPT)
      }
    } catch (error) {
      console.error("Error fetching trip data:", error)
      await retryAiRequest(FINAL_PROMPT)
    }
  }

  const retryAiRequest = async (prompt) => {
    setRetryCount(retryCount + 1)

    if (retryCount >= 3) {
      setLoading(false)
      Alert.alert(
        "Error",
        "There was an error generating the trip plan. Please try again later.",
        [{ text: "OK" }]
      )
      return
    }

    try {
      const result = await chatSession.sendMessage(prompt)
      const responseText = await result.response.text()

      if (responseText) {
        try {
          const tripResp = JSON.parse(responseText)
          await saveTripToFirestore(tripResp)
          setLoading(false)
          router.push('(tabs)/mytrip')
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError)
          setLoading(false)
          Alert.alert(
            "Error",
            "There was an error processing the trip plan. Please try again later.",
            [{ text: "OK" }]
          )
        }
      } else {
        console.error("Empty response from AI service.")
        setLoading(false)
        Alert.alert(
          "Error",
          "The AI service did not return a valid response. Please try again later.",
          [{ text: "OK" }]
        )
      }
    } catch (error) {
      console.error("Error fetching trip data:", error)
      setLoading(false)
      Alert.alert(
        "Error",
        "There was an error generating the trip plan. Please check your internet connection and try again later.",
        [{ text: "OK" }]
      )
    }
  }

  const buildFinalPrompt = () => {
    return AI_PROMPT.replace('{location}', tripData?.locationInfo?.name)
      .replace('{totalDays}', tripData.totalNoOfDays)
      .replace('{totalNight}', tripData.totalNoOfDays - 1)
      .replace('{traveler}', tripData.traveler?.title)
      .replace('{budget}', tripData.budget)
  }

  const saveTripToFirestore = async (tripResp) => {
    const docId = (Date.now()).toString()
    const userTripsCollection = collection(db, 'UserTrips')
    await setDoc(doc(userTripsCollection, docId), {
      userEmail: user.email,
      tripPlan: tripResp,
      tripData: JSON.stringify(tripData),
      docId: docId
    })
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff'
    }}>
      {loading ? (
        <>
          <Image source={require('./../../assets/images/plane.gif')}
            style={{
              width: 200,
              height: 200
            }} />
          <Text style={{
            fontFamily: 'outfit-medium',
            fontSize: 18,
            marginTop: 20
          }}>Generating your dream trip...</Text>
        </>
      ) : (
        <ActivityIndicator size="large" color="#007AFF" />
      )}
    </View>
  )
}