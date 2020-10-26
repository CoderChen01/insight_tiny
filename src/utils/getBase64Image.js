export const getBase64Image = imageFile => {
  return new Promise(function(resolve, reject) {
    let reader = new FileReader()
    let imgResult = ""
    reader.readAsDataURL(imageFile)
    reader.onload = function() {
      imgResult = reader.result
    }
    reader.onerror = function(error) {
      reject(error)
    }
    reader.onloadend = function() {
      resolve(imgResult)
    }
  })
}