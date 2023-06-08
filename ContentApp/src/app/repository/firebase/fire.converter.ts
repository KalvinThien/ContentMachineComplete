import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const fireConverter = <T>() => ({
  toFirestore: (data: T): DocumentData => {
    return { ...data } as DocumentData;
  },
  fromFirestore: (snap: QueryDocumentSnapshot<T>, options: any): T => {
    const data = snap.data(options);
    return { ...data } as T;
  }
})

/** Usage Example **
 
const userConverter = new FireConverter<User>();

// Store a user object in Firestore
const user: User = { id: '123', name: 'John Doe', email: 'johndoe@example.com' };
const userRef = firestore.collection('users').doc('123').withConverter(userConverter);
userRef.set(user);

// Retrieve a user object from Firestore
userRef.get().then((snapshot) => {
  const user = snapshot.data(); // User object with correct types
  console.log(user);
});


import { doc, getDoc} from "firebase/firestore"; 

const ref = doc(db, "cities", "LA").withConverter(cityConverter);
const docSnap = await getDoc(ref);
if (docSnap.exists()) {
  // Convert to City object
  const city = docSnap.data();
  // Use a City instance method
  console.log(city.toString());
} else {
  console.log("No such document!");
}
 
*/
