import { createSlice } from "@reduxjs/toolkit";

const accessToken = localStorage.getItem('accessToken') || null;


// Define the interface for the user data
interface UserData {
    _id: string;
    username: string;
    email: string;
    password: string;
 
  }
  
  // Define the interface for the response object
  interface UserResponse {
    user: UserData ;
    accessToken: string|null;
  }

  // Define the initial state with blank data
const initialState: UserResponse = {
    user: {
      _id: "",
      username: "",
      email: "",
      password: "",
  };

 const authUser = createSlice({

    initialState:initialState,
    name:'authUser',
    reducers:{

        saveUserAndToken: (state, action) => {
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('accessToken', action.payload.accessToken);
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
          
        }
    }
})


export const {saveUserAndToken} = authUser.actions;
export default authUser.reducer;
 
