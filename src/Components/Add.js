import React from "react";
import firebase from 'firebase/compat/app';

const Add = (props) => {

//   const [value, setValue] = React.useState("");
  const db = firebase.firestore();
//   const getValue = (event) => {
//     setValue(event.target.value);
//   };

  const addValue = () => {
      console.log("Adding bookedTimes to firebase: ", props.bookedTimes);
    db.collection("times")
      .doc("bookedtimes")
      .set({
        bookedTimes: props.bookedTimes
      })
      .then(function () {
        console.log("Value successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing Value: ", error);
      });
  };

  return (
    <div>
      {/* <input onBlur={getValue} type='text' /> */}
      <button type='button' onClick={addValue}>
        Add
      </button>
    </div>
  );
};

export default Add;