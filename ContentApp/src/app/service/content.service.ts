import { Injectable } from "@angular/core";
import axios from "axios";

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor() { /** */ }

  createEvent() {
    // Send input data to the Flask API
    const inputData = { name: 'John', age: 30 };

    axios.post('http://localhost:5000/api/process-data', inputData)
    .then((response) => {
    // Handle the response from the Flask API
    console.log('Response:', response.data);
    })
    .catch((error) => {
    // Handle any errors that occurred during the request
    console.error('Error:', error);
    });
  }
}
