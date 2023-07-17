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

// import callGoogleVisionAsync from "../helperFunctions.js"

//components
//google image to text

const HomeScreen = ({ navigation: { navigate } }) => {
  let cameraRef = useRef()
  const [hasCameraPermission, setHasCameraPermission] = useState()
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
  const [photo, setPhoto] = useState()
  const [text, setText] = useState()
  const windowWidth = useWindowDimensions().width

  useEffect(() => {
    ;(async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync()
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync()
      setHasCameraPermission(cameraPermission.status === "granted")
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted")
    })()
  }, [])

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    }

    let newPhoto = await cameraRef.current.takePictureAsync(options)
    setPhoto(newPhoto)
    console.log(photo)
    //then move to the image screen
    navigate("ImageScreen", {
      photo,
    })
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
      <Camera
        ratio={"1:1"}
        style={[styles.camera, { width: windowWidth, height: windowWidth }]}
        ref={cameraRef}
      ></Camera>
      <View style={styles.buttonContainer}>
        <Button title="Take Pic" onPress={takePic} />
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
  preview: {
    alignSelf: "center",
    flex: 1,
  },
})

export default HomeScreen
