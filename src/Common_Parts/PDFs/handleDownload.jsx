import { jsPDF } from "jspdf";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Function to handle PDF download
const handleDownload = async (input, paragraphs, setMessage) => {
  const storage = getStorage(); // Ensure that Firebase storage is initialized
  const pdfName = `${input}.pdf`;
  const storageRef = ref(storage, `gallery/${pdfName}`);

  try {
    // Check if the PDF already exists in Firebase
    const existingPdfUrl = await getDownloadURL(storageRef);

    if (existingPdfUrl) {
      // PDF exists, set message and download existing PDF
      setMessage("An existing PDF is already available. Downloading now...");
      window.open(existingPdfUrl, '_blank');
      return;
    }
  } catch (error) {
    if (error.code === 'storage/object-not-found') {
      // PDF doesn't exist, proceed to generate a new one
      setMessage("Generating a new PDF...");
    } else {
      console.error("Error checking existing PDF:", error);
      setMessage("An error occurred. Please try again.");
      return;
    }
  }

  // Create a new PDF
  const doc = new jsPDF();

  // Add content to the PDF
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(input.toUpperCase(), 20, 20);
  doc.setFontSize(14);

  paragraphs.forEach((paragraph, index) => {
    doc.text(paragraph, 20, 30 + index * 10);
  });

  // Generate PDF blob
  const pdfBlob = doc.output("blob");

  // Upload the PDF to Firebase Storage
  const uploadTask = uploadBytesResumable(storageRef, pdfBlob);

  // Monitor the upload process
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setMessage(`Upload is ${progress}% done`);
    },
    (error) => {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file. Please try again.");
    },
    () => {
      // Get the download URL and handle the result
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setMessage('Download completed.');
        window.open(downloadURL, '_blank');
      });
    }
  );
};

export default handleDownload;
