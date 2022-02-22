import { useState, useEffect } from "react";
import { projectStorage, projectFirestore } from "../Firebase/config";

const useStorage = (clickEvent) => {
    
    const storageRef = projectStorage.ref(clickEvent.id);
    const collectionRef = projectFirestore.collection('schedule');

    collectionRef.add({test: "test"})

}