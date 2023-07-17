import * as React from "react"
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Button,
  useWindowDimensions,
} from "react-native"
import callGoogleVisionAsync from "../helperFunctions"

//google image to text
// import callGoogleVisionAsync from "./helperFunctions.js"

const ImageScreen = ({ navigation }) => {
  const windowWidth = useWindowDimensions().width

  const analysePic = async () => {
    console.log(navigation.getParam)
    //run the callGoogleVisionAsync handler and pass in the image data.
    // const responseData = await callGoogleVisionAsync(photo)
    // setText(responseData.text)
    // console.log(responseData.text)
  }
  return (
    <View style={styles.container}>
      {/* <Image
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
        source={{ uri: "data:image/jpg;base64," + photo }}
      /> */}
      {/* {photo && <Text>photo exists</Text>} */}
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          title="Confirm"
          onPress={() => analysePic()}
        />
        <Button
          style={[styles.button, { backgroundColor: "red" }]}
          title="Discard"
          onPress={() => setPhoto(undefined)}
        />
      </View>
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

export default ImageScreen
