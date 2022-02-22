
import React from "react";
import firebase from 'firebase/compat/app';
import 'firebase/firestore'

const FetchData = ({ doc }) => {
  const [value, setValue] = React.useState("");

  const db = firebase.firestore();
  const getValue = (event) => {
    setValue(event.target.value);
  };

  const getData = () => {
    db.collection("times")
    .get()
    .then((querySnapshot) => {
      let arr = [];
      querySnapshot.docs.map((doc) =>
        arr.push({ id: doc.id, value: doc.data() })
      );
      console.log("DATA: ", arr);
      // setDocuments(arr);
    });
    
    // .collection('times')
    // .doc("bookedtimes")
    // .collection("bookedTimes")
    // .get()
    // .then(querySnapshot => {
  
    //   //let service = [];
    //   console.log('Total confirmed appointments: ', querySnapshot.size);
    //   console.log("firestore data: ", querySnapshot);
  
    // //   querySnapshot.forEach(documentSnapshot => {
    // //     console.log("Services Selected: ", documentSnapshot.data().YOUR_ARRAY[1].servicesSelected); 
  
    // //     //service.push(documentSnapshot.data());
    // //     //console.log('Appointment ID: ', documentSnapshot.id, documentSnapshot.data()); 
  
    // //   });
    // });
  };

  return (
    <>
      {/* <input onBlur={getValue} type='text' /> */}
      <button onClick={getData}>Get Data</button>
    </>
  );
};

export default FetchData;