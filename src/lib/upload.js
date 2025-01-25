import { getFirestore, doc, setDoc } from "firebase/firestore";

const upload = (file) => {
  const reader = new FileReader();

  reader.onload = async () => {
    const base64String = reader.result;

    try {
      // Initialize Firestore
      const db = getFirestore();

      // Create a document reference in the "images" collection
      const imageDoc = doc(db, "images", `${Date.now()}_${file.name}`);

      // Save the Base64 string in Firestore
      await setDoc(imageDoc, { image: base64String });

      console.log("Upload is complete and stored in Firestore");
    } catch (error) {
      console.error("Error uploading image to Firestore:", error);
    }
  };

  reader.onerror = (error) => {
    console.error("Error reading file:", error);
  };

  // Start reading the file as a Base64 string
  reader.readAsDataURL(file);
};

export default upload;
