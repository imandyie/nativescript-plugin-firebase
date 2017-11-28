import { Component, OnInit } from "@angular/core";
import { firestore } from "nativescript-plugin-firebase";
const firebase = require("nativescript-plugin-firebase/app");

@Component({
  selector: "ns-items",
  moduleId: module.id,
  templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {

  private listenerUnsubscribe: () => void;

  constructor() {
  }

  ngOnInit(): void {
    firebase.initializeApp({
      persist: false
    }).then(() => console.log("Firebase initialized"));
  }

  public loginAnonymously(): void {
    firebase.auth().signInAnonymously()
        .then(() => console.log("Logged in"))
        .catch(err => console.log("Login error: " + JSON.stringify(err)));
  }

  public firestoreAdd(): void {
    firebase.firestore().collection("dogs").add({name: "Fido"})
        .then((docRef: firestore.DocumentReference) => {
          console.log("Fido added, ref: " + docRef.id);
        })
        .catch(err => console.log("Adding Fido failed, error: " + err));
  }

  public firestoreSet(): void {
    firebase.firestore().collection("dogs").doc("fave")
        .set({name: "Woofie", last: "lastofwoofie", date: new Date()}, {merge: true})
        .then(() => {
          console.log("Woofie set");
        })
        .catch(err => console.log("Setting Woofie failed, error: " + err));


    // example from https://firebase.google.com/docs/firestore/query-data/get-data
    const citiesCollection = firebase.firestore().collection("cities");

    citiesCollection.doc("SF").set({
      name: "San Francisco",
      state: "CA",
      country: "USA",
      capital: false,
      population: 860000
    });

    citiesCollection.doc("LA").set({
      name: "Los Angeles",
      state: "CA",
      country: "USA",
      capital: false,
      population: 3900000
    });

    citiesCollection.doc("SAC").set({
      name: "Sacramento",
      state: "CA",
      country: "USA",
      capital: true,
      population: 500000
    });

    citiesCollection.doc("DC").set({
      name: "Washington, D.C.",
      state: "WA",
      country: "USA",
      capital: true,
      population: 680000
    });

    citiesCollection.doc("TOK").set({
      name: "Tokyo",
      state: null,
      country: "Japan",
      capital: true,
      population: 9000000
    });

    citiesCollection.doc("BJ").set({
      name: "Beijing",
      state: null,
      country: "China",
      capital: true,
      population: 21500000
    });
  }

  public firestoreSetByAutoID(): void {
    firebase.firestore().collection("dogs").doc()
        .set({name: "Woofie", last: "lastofwoofie", date: new Date()})
        .then(() => {
          console.log("Woofie set");
        })
        .catch(err => console.log("Setting Woofie failed, error: " + err));
  }

  public firestoreUpdate(): void {
    firebase.firestore().collection("dogs").doc("fave")
        .update({name: "Woofieupdate", last: "updatedwoofie"})
        .then(() => {
          console.log("Woofie updated");
        })
        .catch(err => console.log("Updating Woofie failed, error: " + JSON.stringify(err)));
  }

  public firestoreGet(): void {
    const collectionRef: firestore.CollectionReference = firebase.firestore().collection("dogs");
    collectionRef.get()
        .then((querySnapshot: firestore.QuerySnapshot) => {
          querySnapshot.forEach(doc => {
            console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
          });
        })
        .catch(err => console.log("Get failed, error" + err));

    // examples from https://firebase.google.com/docs/firestore/query-data/get-data
    const docRef: firestore.DocumentReference = firebase.firestore().collection("cities").doc("BJ");

    docRef.get().then((doc: firestore.DocumentSnapshot) => {
      if (doc.exists) {
        console.log("Document data:", JSON.stringify(doc.data()));
      } else {
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
  }

  public firestoreListen(): void {
    if (this.listenerUnsubscribe !== undefined) {
      console.log("Already listening ;)");
      return;
    }

    const docRef: firestore.DocumentReference = firebase.firestore().collection("cities").doc("SF");

    this.listenerUnsubscribe = docRef.onSnapshot((doc: firestore.DocumentSnapshot) => {
      if (doc.exists) {
        console.log("Document data:", JSON.stringify(doc.data()));
      } else {
        console.log("No such document!");
      }
    });
  }

  public firestoreStopListening(): void {
    if (this.listenerUnsubscribe === undefined) {
      console.log("Please start listening first ;)");
      return;
    }

    this.listenerUnsubscribe();
    this.listenerUnsubscribe = undefined;
  }

  public firestoreWhere(): void {
    const query: firestore.Query = firebase.firestore().collection("cities")
        .where("state", "==", "CA")
        .where("population", "<", 550000);

    query
        .get()
        .then((querySnapshot: firestore.QuerySnapshot) => {
          querySnapshot.forEach(doc => {
            console.log(`Relatively small Californian city: ${doc.id} => ${JSON.stringify(doc.data())}`);
          });
        })
        .catch(err => console.log("Where-get failed, error" + err));
  }

  public firestoreWhereOrderLimit(): void {
    const query: firestore.Query = firebase.firestore().collection("cities")
        .where("state", "==", "CA")
        .orderBy("population", "desc")
        .limit(2);

    query
        .get()
        .then((querySnapshot: firestore.QuerySnapshot) => {
          querySnapshot.forEach(doc => {
            console.log(`Large Californian city: ${doc.id} => ${JSON.stringify(doc.data())}`);
          });
        })
        .catch(err => console.log("firestoreWhereOrderLimit failed, error" + err));
  }

  public firestoreDelete(): void {
    firebase.firestore().collection("dogs").doc("fave")
        .delete()
        .then(() => {
          console.log("Woofie deleted");
        })
        .catch(err => console.log("Delete failed, error" + err));
  }
}