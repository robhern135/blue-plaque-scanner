import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Camera } from "expo-camera"
import * as MediaLibrary from "expo-media-library"

import * as Linking from "expo-linking"

import callGoogleVisionAsync from "../helperFunctions.js"

import { sanitizeData } from "../functions"

//components
//google image to text

const HomeScreen = ({ navigation: { navigate, setOptions } }) => {
  let cameraRef = useRef()
  const [hasCameraPermission, setHasCameraPermission] = useState()
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
  const [image, setImage] = useState()
  const [base64, setBase64] = useState()
  const [text, setText] = useState()
  const windowWidth = useWindowDimensions().width
  const windowHeight = useWindowDimensions().height
  const height = Math.round((windowWidth * 16) / 9)
  const halfHeight = height / 2

  const [isHandingOff, setIsHandingOff] = useState(false)

  useEffect(() => {
    getPermissions()
  }, [])

  useLayoutEffect(() => {
    setOptions({
      headerShown: false,
    })
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
    setIsHandingOff(true)
    //run the callGoogleVisionAsync handler and pass in the image data.
    const responseData = await callGoogleVisionAsync(base64)

    let sanitizedData = responseData.map(function (obj) {
      return obj.description
    })

    let useData = sanitizedData.slice(1)
    console.log(`useData: ${useData}`)

    let replaceData = sanitizeData(useData)

    var searchStr = replaceData.join(" ").trim()

    console.log(`searchStr: ${searchStr}`)
    let searchUrl = `https://en.wikipedia.org/wiki/Special:Search/${searchStr}`
    Linking.openURL(searchUrl)
    setTimeout(() => {
      setIsHandingOff(false)
    }, 250)
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
    <View style={{ flex: 1 }}>
      {isHandingOff ? (
        <View
          style={{
            flex: 1,
            height: windowHeight,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ marginBottom: 10 }}>Searching...</Text>
          <ActivityIndicator size="large" color="#3b61a0" />
        </View>
      ) : (
        <>
          <View>
            {image && base64 ? (
              <>
                <Image
                  style={[
                    styles.preview,
                    {
                      height: height,
                      width: windowWidth,
                      objectFit: "cover",
                      overflow: "hidden",
                      ratio: "16:9",
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
                ratio={"16:9"}
                style={[styles.camera, { width: windowWidth, height: height }]}
                ref={cameraRef}
              ></Camera>
            )}
          </View>
          <View
            style={[
              styles.buttonContainer,
              { height: windowHeight - height + 30 },
            ]}
          >
            {base64 ? (
              <>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: "rgba(255, 0, 0, 0.4)" },
                  ]}
                  onPress={discardPic}
                >
                  <Text style={[styles.buttonText, { color: "black" }]}>
                    Discard Picture
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={analysePic}>
                  <Text style={styles.buttonText}>Analyse Picture</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.takePic} onPress={takePic}>
                <Text style={styles.picText}>Take Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
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
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    width: "50%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  takePic: {
    backgroundColor: "black",
    padding: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  picText: { color: "white", fontSize: 20, fontWeight: "bold" },
  buttonText: { color: "white", fontSize: 20, fontWeight: "bold" },
  // preview: {
  //   alignSelf: "center",
  //   flex: 1,
  // },
})

export default HomeScreen
