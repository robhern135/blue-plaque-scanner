import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
  useWindowDimensions,
} from "react-native"
import { useEffect, useRef, useState } from "react"
import { Camera } from "expo-camera"
import * as MediaLibrary from "expo-media-library"

import * as Linking from "expo-linking"

import callGoogleVisionAsync from "../helperFunctions.js"

//components
//google image to text

const HomeScreen = ({ navigation: { navigate } }) => {
  let cameraRef = useRef()
  const [hasCameraPermission, setHasCameraPermission] = useState()
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
  const [image, setImage] = useState()
  const [base64, setBase64] = useState()
  const [text, setText] = useState()
  const windowWidth = useWindowDimensions().width

  useEffect(() => {
    getPermissions()
  }, [])

  const getPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync()
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync()
    setHasCameraPermission(cameraPermission.status === "granted")
    setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted")
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    }
    console.log("taking photo")

    let newPhoto = await cameraRef.current.takePictureAsync(options)
    setImage(newPhoto)
    setBase64(newPhoto.base64)
  }

  const discardPic = () => {
    console.log("discarding")
    setImage()
    setBase64()
  }
  const analysePic = async () => {
    console.log()
    //run the callGoogleVisionAsync handler and pass in the image data.
    const responseData = await callGoogleVisionAsync(base64)

    let sanitizedData = responseData.map(function (obj) {
      return obj.description
    })

    let useData = sanitizedData.slice(1)
    // console.log(`useData: ${useData}`)
    // console.log(typeof useData)

    var searchStr = useData.join(" ").trim()
    // console.log(`searchStr: ${searchStr}`)

    // setText(responseData.text.replace([">", "<", "?", "&"], " "))

    let searchUrl = `https://en.wikipedia.org/wiki/Special:Search/${specifyText(
      searchStr
    )}`
    Linking.openURL(searchUrl)
  }

  // var find = [
  //   ">",
  //   "<",
  //   "?",
  //   "&",
  //   "lived",
  //   "and",
  //   "the",
  //   "council",
  //   "died",
  //   "here",
  //   "greater",
  //   "london",
  //   "-",
  //   "in",
  //   "house",
  //   "english",
  //   "heritage",
  //   "near",
  //   "this",
  // ]

  const specifyText = (string) => {
    console.log(string)
    return string
  }
  //no camera permissions
  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    )
  }

  return (
    <SafeAreaView>
      <View>
        {image && base64 ? (
          <>
            <Image
              style={[
                styles.preview,
                {
                  height: windowWidth,
                  width: windowWidth,
                  objectFit: "cover",
                  overflow: "hidden",
                  ratio: "1:1",
                },
              ]}
              source={{
                uri: `data:image/jpg;base64,${base64}`,
              }}
            />
            {text && <Text>{text}</Text>}
          </>
        ) : (
          <Camera
            ratio={"1:1"}
            style={[styles.camera, { width: windowWidth, height: windowWidth }]}
            ref={cameraRef}
          ></Camera>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {base64 ? (
          <>
            <Button title="Discard Picture" onPress={discardPic} />
            <Button title="Analyse Picture" onPress={analysePic} />
          </>
        ) : (
          <Button title="Take Picture" onPress={takePic} />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  button: {
    marginHorizontal: 5,
  },
  // preview: {
  //   alignSelf: "center",
  //   flex: 1,
  // },
})

export default HomeScreen
